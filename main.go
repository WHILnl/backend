package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/WHILnl/backend/api"
	"github.com/WHILnl/backend/pkg/config"
	"github.com/WHILnl/backend/pkg/logger"
	"github.com/WHILnl/backend/providers"
	"github.com/WHILnl/backend/providers/helloworld"
	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"

	_ "github.com/mattn/go-sqlite3"
)

func newProvider(identifier string, secret string) (providers.Provider, error) {
	switch identifier {
	case "helloworld":
		return helloworld.New(secret), nil
	default:
		return nil, fmt.Errorf("Unknown provider: %s", identifier)
	}
}

// go:embed static/*
// var staticFiles embed.FS

func main() {
	logger.Init("info")

	if err := godotenv.Load(); err != nil {
		logger.Info(".env file not found, proceeding with environment variables")
	}
	var cfg config.Config
	err := env.Parse(&cfg)
	if err != nil {
		logger.Err(err)
		return
	}

	dirpath := filepath.Join(".", "data")
	err = os.Mkdir(dirpath, os.ModePerm)
	if err != nil && err == os.ErrExist {
		logger.Err(fmt.Errorf("failed to create directory '%s': %s", dirpath, err.Error()))
		return
	}

	db, err := sql.Open("sqlite3", filepath.Join(dirpath, "db.sqlite"))
	if err != nil {
		logger.Err(err)
		return
	}
	defer db.Close()

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS tokens (
			id integer PRIMARY KEY,
			token text
		);
		CREATE TABLE IF NOT EXISTS sessions (
			id integer PRIMARY KEY,
			token text,
			expiresAt time
		);
	`)
	if err != nil {
		logger.Err("Error in creating table", err)
		return
	} else {
		logger.Info("Successfully created table tokens!")
	}

	provider, err := newProvider(cfg.Provider, cfg.ProviderSecret)
	if err != nil {
		return
	}
	logger.Info(fmt.Sprintf("Loading provider '%s'", cfg.Provider))

	server := api.New(cfg, db, provider)
	serverHandler := server.Handler()

	mainMux := http.NewServeMux()
	mainMux.Handle("/api/", http.StripPrefix("/api", serverHandler))

	// assets, err := fs.Sub(staticFiles, "static")
	// if err != nil {
	// 	logger.Err(err)
	// }
	// mainMux.Handle("/", http.FileServerFS(assets))
	mainMux.Handle("/", http.FileServer(http.Dir("static")))

	logger.Info(fmt.Sprintf("Listening on %s", cfg.Port))
	if err := http.ListenAndServe(cfg.Port, mainMux); err != nil {
		logger.Err(err)
	}
}

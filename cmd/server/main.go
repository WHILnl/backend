package main

import (
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
)

func newProvider(identifier string, secret string) (providers.Provider, error) {
	switch identifier {
	case "helloworld":
		return helloworld.New(secret), nil
	default:
		return nil, fmt.Errorf("Unknown provider: %s", identifier)
	}
}

func main() {
	logger.Init("info")

	if err := godotenv.Load(); err != nil {
		logger.Info(".env file not found, proceeding with environment variables")
	}
	var cfg config.Config
	err := env.Parse(&cfg)
	if err != nil {
		logger.Err(err)
		os.Exit(1)
	}

	dirpath := filepath.Join(".", "data")
	err = os.Mkdir(dirpath, os.ModePerm)
	if err != nil && err == os.ErrExist {
		logger.Err(fmt.Errorf("failed to create directory '%s': %s", dirpath, err.Error()))
		os.Exit(1)
	}

	// TODO: create database for tokens

	provider, err := newProvider(cfg.Provider, cfg.ProviderSecret)
	if err != nil {
		logger.Err(err)
	}
	logger.Info(fmt.Sprintf("Loading provider '%s'", cfg.Provider))

	server := api.New(cfg, provider)

	logger.Info("Listening on :8080")
	if err := http.ListenAndServe("127.0.0.1:8080", server.Handler()); err != nil {
		logger.Err(err)
	}
}

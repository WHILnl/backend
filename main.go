package main

import (
	"fmt"
	"log"
	"os"

	"github.com/WHILnl/backend/handlers"
	"github.com/WHILnl/backend/providers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func newProvider() (provider providers.Provider, err error) {
	switch os.Getenv("PROVIDER") {
	case "helloworld":
		return providers.NewHelloWorldProvider(os.Getenv("SECRET")), nil
	case "zermelo":
		return providers.NewZermeloProvider(os.Getenv("SECRET")), nil
	default:
		return nil, fmt.Errorf("Unknown provider %s", os.Getenv("PROVIDER"))
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	router := gin.Default()
	router.SetTrustedProxies(nil)

	provider, err := newProvider()
	if err != nil {
		log.Fatal(err)
	}
	handler := handlers.NewHandler(provider)

	router.GET("/version", handler.GetVersion)
	router.GET("/timetable/:user", handler.GetTimetable)

	router.Run() // listens on 0.0.0.0:8080 by default
}

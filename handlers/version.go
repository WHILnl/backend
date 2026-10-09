package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetVersion(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"version":  os.Getenv("VERSION"),
		"provider": h.provider.Name(),
	})
}

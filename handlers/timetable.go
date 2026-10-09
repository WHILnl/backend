package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetTimetable(c *gin.Context) {
	user := c.Param("user")

	timetable, err := h.provider.GetTimetable(user)

	c.JSON(http.StatusOK, gin.H{
		"version":  os.Getenv("VERSION"),
		"provider": h.provider.Name(),
	})
}

package handlers

import "github.com/WHILnl/backend/providers"

type Handler struct {
	provider providers.Provider
}

func NewHandler(provider providers.Provider) *Handler {
	return &Handler{
		provider: provider,
	}
}

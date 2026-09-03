package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/WHILnl/backend/pkg/config"
	"github.com/WHILnl/backend/providers"
)

type API struct {
	cfg      config.Config
	provider providers.Provider
}

func New(cfg config.Config, provider providers.Provider) *API {
	return &API{cfg: cfg, provider: provider}
}

func RespondJson(w http.ResponseWriter, data any) {
	if _, ok := data.(Response); !ok {
		data = Response{Data: data}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)

}

func (h *API) tokenAuth(next func(w http.ResponseWriter, r *http.Request)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		tokenStr := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")

		next(w, r.WithContext(ctx))
	}
}

func (h *API) Handler() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/version", h.getVersion)
	mux.HandleFunc("/timetable/{user}", h.tokenAuth(h.getTimetable))

	return mux
}

package api

import (
	"net/http"
)

func (h *API) getVersion(w http.ResponseWriter, r *http.Request) {
	version := h.cfg.Version

	RespondJson(w, version)
}

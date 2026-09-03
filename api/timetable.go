package api

import (
	"net/http"
)

func (h *API) getTimetable(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("user")
	timetable := h.provider.GetTimetable(userID)

	RespondJson(w, timetable)
}

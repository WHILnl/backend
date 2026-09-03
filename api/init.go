package api

import (
	crand "crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/WHILnl/backend/pkg/config"
	"github.com/WHILnl/backend/pkg/logger"
	"github.com/WHILnl/backend/providers"
)

type API struct {
	cfg             config.Config
	db              *sql.DB
	provider        providers.Provider
	generatedEnrols map[uint]EnrollCode
}

func New(cfg config.Config, db *sql.DB, provider providers.Provider) *API {
	return &API{cfg: cfg, db: db, provider: provider}
}

func RespondJson(w http.ResponseWriter, data any) {
	if _, ok := data.(Response); !ok {
		data = Response{Data: data}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)

}

func GenerateSecureToken(n int) (string, error) {
	// n is the number of bytes, not characters
	b := make([]byte, n)
	_, err := crand.Read(b)
	if err != nil {
		return "", err
	}

	// Encode as hexadecimal string
	return hex.EncodeToString(b), nil
}

func (h *API) tokenAuth(next func(w http.ResponseWriter, r *http.Request)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		res := strings.Split(r.Header.Get("Authorization"), " ")
		if len(res) != 2 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		typeStr, tokenStr := res[0], res[1]
		if typeStr != "Bearer" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var tokenExists int
		err := h.db.QueryRow(`SELECT 1 FROM tokens WHERE token == $1`, tokenStr).Scan(&tokenExists)
		if tokenExists != 0 || err == sql.ErrNoRows {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		} else if err != nil {
			logger.Err(err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		next(w, r)
	}
}

func (h *API) Handler() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/version", h.getVersion)
	mux.HandleFunc("/timetable/{user}", h.tokenAuth(h.getTimetable))

	mux.HandleFunc("/admin/login", h.postAdminLogin)
	mux.HandleFunc("/admin/validate", h.adminAuth(h.getAdminValidate))
	mux.HandleFunc("/admin/generate-enroll", h.adminAuth(h.postAdminGenerateEnroll))

	return mux
}

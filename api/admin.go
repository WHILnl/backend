package api

import (
	"bytes"
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/WHILnl/backend/pkg/logger"
)

func (h *API) adminAuth(next func(w http.ResponseWriter, r *http.Request)) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		res := strings.Split(r.Header.Get("Authorization"), " ")
		if len(res) != 2 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		typeStr, encodedCredsStr := res[0], res[1]
		if typeStr != "Basic" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		credsBytes, err := base64.StdEncoding.DecodeString(encodedCredsStr)
		if err != nil {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		user, pass, ok := bytes.Cut(credsBytes, []byte(":"))
		if !ok {
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		userOk := subtle.ConstantTimeCompare(user, []byte("admin"))
		passOk := subtle.ConstantTimeCompare(pass, []byte(h.cfg.AdminPassword))

		if userOk == 0 || passOk == 0 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx = context.WithValue(ctx, "username", "admin")

		next(w, r.WithContext(ctx))
	}
}

func (h *API) postAdminLogin(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10) // 1 MiB

	if err := r.ParseForm(); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	username := r.FormValue("username")
	password := r.FormValue("password")

	logger.Info(r.Form)

	if username == "" || password == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	usernameBytes := []byte(username)
	adminUsernameBytes := []byte(h.cfg.AdminUser)
	passwordBytes := []byte(password)
	adminPasswordBytes := []byte(h.cfg.AdminPassword)

	userOk := subtle.ConstantTimeCompare(usernameBytes, adminUsernameBytes)
	passOk := subtle.ConstantTimeCompare(passwordBytes, adminPasswordBytes)

	if userOk == 0 || passOk == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	session_token, err := GenerateSecureToken(128)
	if err != nil {
		logger.Err(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	expires_at := time.Now().Add(h.cfg.AdminSessionDuration)

	statement, err := h.db.Prepare("INSERT INTO sessions (token, expiresAt) VALUES (?, ?)")
	if err != nil {
		logger.Err(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	_, err = statement.Exec(session_token, expires_at)
	if err != nil {
		logger.Err(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth_session_token",
		Value:    session_token,
		HttpOnly: true,
		Expires:  expires_at,
	})
	http.Redirect(w, r, "/admin", http.StatusFound)
}

func (h *API) getAdminValidate(w http.ResponseWriter, r *http.Request) {
	RespondJson(w, "Valid")
}

func (h *API) postAdminGenerateEnroll(w http.ResponseWriter, r *http.Request) {
	b := make([]byte, 16) // 16 bytes

	// Read random bytes into the byte slice
	_, err := rand.Read(b)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	enrollcode := EnrollCode{
		Code:       base64.StdEncoding.EncodeToString(b),
		ValidUntil: time.Now().Add(h.cfg.EnrollCodeDuration),
	}

	RespondJson(w, enrollcode)
}

package api

import "time"

type Response struct {
	Data any `json:"data"`
}

type ErrorResponse struct {
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type EnrollCode struct {
	Code       string    `json:"code"`
	ValidUntil time.Time `json:"valid_until"`
}

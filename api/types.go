package api

type Response struct {
	Data any `json:"data"`
}

type ErrorResponse struct {
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

package config

import "time"

type Config struct {
	Version string `env:"VERSION"`
	Port    string `env:"PORT"`

	Provider       string `env:"PROVIDER"`
	ProviderSecret string `env:"SECRET"`

	AdminUser            string        `env:"ADMIN_USER"`
	AdminPassword        string        `env:"ADMIN_PASSWORD"`
	AdminSessionDuration time.Duration `env:"ADMIN_SESSION_DURATION"`

	EnrollCodeDuration time.Duration `env:"ENROLL_CODE_DURATION"`
}

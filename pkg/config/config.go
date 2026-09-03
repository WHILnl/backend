package config

type Config struct {
	Version        string `env:"VERSION"`
	Port           string `env:"PORT"`
	Provider       string `env:"PROVIDER"`
	ProviderSecret string `env:"SECRET"`
}

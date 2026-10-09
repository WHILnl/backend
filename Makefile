run:
	go run main.go

gen_provider_imports:
	printf "package providers\n// THIS FILE IS AUTO GENERATED\n// CHANGES WILL BE OVERWRITEN\n\nimport (\n" > providers/provider_import/provider_import.go
	find providers -mindepth 1 -maxdepth 1 -type d ! -path "providers/provider_import" | sed -e 's/^.*$$/\t_ "github.com\/WHILnl\/backend\/&"/' | sed -e 's/\/"$$/"/' >> providers/provider_import/provider_import.go
	printf ")" >> providers/provider_import/provider_import.go
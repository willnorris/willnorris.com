include .env
export

dev: .cache/tandem .cache/caddy .cache/hugo ## Run a local dev server
	@# .env must define IMAGEPROXY_BASEURL, IMAGEPROXY_ALLOWHOSTS, IMAGEPROXY_SIGNATURE_KEY
	@.cache/tandem \
		'.cache/hugo --watch --buildDrafts --poll 1s' \
		'.cache/caddy run --config etc/Caddyfile'
.PHONY: dev

mentions: ## Fetch and update webmentions
	@# .env must define WEBMENTION_IO_TOKEN
	@go run ./cmd/mentions
.PHONY: mentions

deploy: ## Deploy site to Fly.io
	flyctl -c etc/fly.toml deploy --remote-only
.PHONY: deploy

.cache/tandem:
	@mkdir -p $$(dirname $@)
	@curl -fsSL https://raw.githubusercontent.com/rosszurowski/tandem/main/install.sh | bash -s -- --dest="$$(dirname $@)"

.cache/caddy:
	@go build -o ./.cache/caddy ./cmd/caddy

.cache/hugo:
	@CGO_ENABLED=1 go build --tags extended -o ./.cache/hugo ./cmd/hugo

help:
	@echo "\nSpecify a command:\n"
	@grep -hE '^[0-9a-zA-Z_-]+:.*?## .*$$' ${MAKEFILE_LIST} | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[0;36m%-12s\033[m %s\n", $$1, $$2}'
	@echo ""
.PHONY: help

.DEFAULT_GOAL := help

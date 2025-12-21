include .env
export

dev: .cache/tandem .cache/caddy .cache/hugo node_modules ## Run a local dev server
	@# .env must define IMAGEPROXY_BASEURL, IMAGEPROXY_ALLOWHOSTS, IMAGEPROXY_SIGNATURE_KEY
	@.cache/tandem \
		'.cache/hugo --watch --buildDrafts --environment development --poll 1s' \
		'.cache/caddy run --config etc/Caddyfile --watch'
.PHONY: dev

mentions: ## Fetch and update webmentions
	@# .env must define WEBMENTION_IO_TOKEN
	@go run ./cmd/mentions
.PHONY: mentions

public: .cache/hugo node_modules ## Build site in 'public' directory
	@.cache/hugo
.PHONY: public

deploy: ## Deploy site to Fly.io
	flyctl -c etc/fly.toml deploy --remote-only
.PHONY: deploy

.cache/tandem:
	@mkdir -p $$(dirname $@)
	@curl -fsSL https://raw.githubusercontent.com/rosszurowski/tandem/main/install.sh | bash -s -- --dest="$$(dirname $@)"

.cache/caddy: go.sum $(shell find cmd/caddy -name "*.go")
	@go build -o ./.cache/caddy ./cmd/caddy

.cache/hugo: go.sum $(shell find cmd/hugo -name "*.go")
	@CGO_ENABLED=1 go build --tags extended -o ./.cache/hugo ./cmd/hugo

.cache/bun/bin/bun:
	@curl -fsSL https://bun.sh/install | BUN_INSTALL=.cache/bun bash -s "bun-v1.3.5"

node_modules: package.json .cache/bun/bin/bun
	@.cache/bun/bin/bun install


help:
	@echo ""
	@echo "Specify a command:"
	@echo ""
	@grep -hE '^[0-9a-zA-Z_-]+:.*?## .*$$' ${MAKEFILE_LIST} | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[0;36m%-12s\033[m %s\n", $$1, $$2}'
	@echo ""
.PHONY: help

.DEFAULT_GOAL := help

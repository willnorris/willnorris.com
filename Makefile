# Default env vars for local development.
# Override by setting these in the environment with something like mise.
export IMAGEPROXY_BASEURL ?= http://localhost:8080/
export IMAGEPROXY_ALLOWHOSTS ?= localhost
export IMAGEPROXY_SIGNATUREKEY ?= secretkey
export FLY_REGION ?= dev

export PATH := .cache/bun/bin:$(PATH)

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
	.cache/hugo
.PHONY: public

deploy: ## Deploy site to Fly.io
	flyctl -c etc/fly.toml deploy --remote-only
.PHONY: deploy

.cache/tandem:
	@mkdir -p $$(dirname $@)
	@curl -fsSL https://raw.githubusercontent.com/rosszurowski/tandem/main/install.sh | bash -s -- --dest="$$(dirname $@)"

.cache/caddy: go.sum $(shell find cmd/caddy -name "*.go")
	go build -o ./.cache/caddy ./cmd/caddy

.cache/hugo: go.sum $(shell find cmd/hugo -name "*.go")
	CGO_ENABLED=1 go build --tags extended -o ./.cache/hugo ./cmd/hugo

.cache/bun/bin/bun:
	# Set SHELL=false so bun doesn't try to install shell completions
	@curl -fsSL https://bun.sh/install | BUN_INSTALL=.cache/bun SHELL=false bash -s "bun-v1.3.5"
	@ln -s bun ./.cache/bun/bin/node

node_modules: package.json bun.lock .cache/bun/bin/bun
	.cache/bun/bin/bun install

clean: ## Remove build artifacts
	rm -rf .cache hugo_stats.json node_modules public resources/_gen
.PHONY: clean

help:
	@echo ""
	@echo "Specify a command:"
	@echo ""
	@grep -hE '^[0-9a-zA-Z_-]+:.*?## .*$$' ${MAKEFILE_LIST} | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[0;36m%-12s\033[m %s\n", $$1, $$2}'
	@echo ""
.PHONY: help

.DEFAULT_GOAL := help

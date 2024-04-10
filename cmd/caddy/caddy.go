package main

import (
	caddycmd "github.com/caddyserver/caddy/v2/cmd"

	_ "github.com/caddyserver/caddy/v2/modules/standard"
	_ "github.com/tailscale/caddy-tailscale"
	_ "github.com/willnorris/willnorris.com/cmd/caddy/cspproxy"
	_ "willnorris.com/go/imageproxy/caddy"
)

func main() {
	caddycmd.Main()
}

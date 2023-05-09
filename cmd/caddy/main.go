package main

import (
	caddycmd "github.com/caddyserver/caddy/v2/cmd"

	_ "github.com/caddyserver/caddy/v2/modules/standard"
	_ "willnorris.com/go/imageproxy/caddy"
)

func main() {
	caddycmd.Main()
}

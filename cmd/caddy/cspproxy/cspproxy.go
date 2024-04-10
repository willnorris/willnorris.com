package cspproxy

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/httpcaddyfile"
	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
)

func init() {
	caddy.RegisterModule(CSPProxy{})
	httpcaddyfile.RegisterHandlerDirective("cspproxy", parseCaddyfile)
}

type CSPProxy struct {
	Upstream string `json:"upstream,omitempty"`

	rp *httputil.ReverseProxy
}

// CaddyModule returns the Caddy module information.
func (CSPProxy) CaddyModule() caddy.ModuleInfo {
	return caddy.ModuleInfo{
		ID:  "http.handlers.cspproxy",
		New: func() caddy.Module { return new(CSPProxy) },
	}
}

func (p *CSPProxy) Provision(ctx caddy.Context) error {
	u, err := url.Parse(p.Upstream)
	if err != nil {
		return err
	}
	p.rp = httputil.NewSingleHostReverseProxy(u)
	return nil
}

func (p *CSPProxy) ServeHTTP(w http.ResponseWriter, r *http.Request, _ caddyhttp.Handler) error {
	log.Printf("proxying request...")
	//p.rp.ServeHTTP(w, r)
	return nil
}

func parseCaddyfile(h httpcaddyfile.Helper) (caddyhttp.MiddlewareHandler, error) {
	p := new(CSPProxy)
	h.Next() // consume the directive name
	for nesting := h.Nesting(); h.NextBlock(nesting); {
		// TODO: setup config from caddyfile
	}
	return p, nil
}

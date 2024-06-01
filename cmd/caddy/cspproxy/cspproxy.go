// cspproxy is a Caddy modules for proxying CSP reports to a remote server.
// CSP reports are filtered to eliminate false positives.
package cspproxy

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/httpcaddyfile"
	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
)

func init() {
	caddy.RegisterModule(CSPProxy{})
	httpcaddyfile.RegisterHandlerDirective("cspproxy", parseCaddyfile)
	httpcaddyfile.RegisterDirectiveOrder("cspproxy", "after", "reverse_proxy")
}

type CSPProxy struct {
	Upstream string `json:"upstream,omitempty"`

	rp *httputil.ReverseProxy
}

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
	p.rp = &httputil.ReverseProxy{
		Rewrite: func(r *httputil.ProxyRequest) {
			r.SetURL(u)
		},
	}
	return nil
}

type cspRequest struct {
	Report cspReport `json:"csp-report"`
}

type cspReport struct {
	BlockedURI string `json:"blocked-uri"`
	SourceFile string `json:"source-file"`
	LineNumber *int   `json:"line-number,omitempty"`
}

func (p *CSPProxy) ServeHTTP(w http.ResponseWriter, r *http.Request, _ caddyhttp.Handler) error {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}

	var cr cspRequest
	if err := json.Unmarshal(body, &cr); err != nil {
		return err
	}
	if ignoreReport(cr.Report) {
		log.Printf("skipping CSP Report: %#v", cr.Report)
		return nil
	}

	// send request through proxy
	r.Body = io.NopCloser(bytes.NewReader(body))
	p.rp.ServeHTTP(w, r)
	return nil
}

// ignoreReport returns true if the CSP report should be ignored.
//
// TODO: Right now, all the rules are hard-coded. Maybe move these to config options?
func ignoreReport(r cspReport) bool {
	switch {
	// Mozilla extension issues.
	case r.SourceFile == "moz-extension" || r.SourceFile == "sandbox eval code":
		return true

	// Safari extension issues.
	case r.BlockedURI == "safari-web-extension" || strings.HasPrefix(r.SourceFile, "safari-web-extension"):
		return true

	// Chrome extension issues.
	case r.SourceFile == "chrome-extension":
		return true

	// Reports without line number are often injected scripts.
	// https://csper.io/blog/csp-report-filtering#line-number-column-number-analysis
	case r.LineNumber == nil:
		return true
	}
	return false
}

func parseCaddyfile(h httpcaddyfile.Helper) (caddyhttp.MiddlewareHandler, error) {
	p := new(CSPProxy)
	h.Next() // consume the directive name
	for nesting := h.Nesting(); h.NextBlock(nesting); {
		switch h.Val() {
		case "upstream":
			if !h.NextArg() {
				return nil, h.ArgErr()
			}
			p.Upstream = h.Val()
		}
	}
	return p, nil
}

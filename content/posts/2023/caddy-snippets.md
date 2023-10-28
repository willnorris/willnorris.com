---
title: Caddy snippets for static sites
date: "2023-10-27T21:20:28-07:00"
alias: /b/5Td1
---

I moved my website from WordPress [to a static site generator] in 2014,
and over the next few months, I wrote several posts about how I achieved
certain dynamic behavior using custom nginx configurations.
However, I [switched over to Caddy] as my web server in 2017,
but I never updated how I adapted my server configuration.
In basically all cases, I find the Caddy config much simpler and easier to read,
though that may be because it's all I ever use anymore.
So here is my long overdue updates to a few old blog posts about adding
some custom web server behavior for static sites.

[to a static site generator]: /2014/one-step-forward-two-steps-back/
[switched over to Caddy]: https://github.com/willnorris/willnorris.com/commit/6f2f7445c1242a531d7d9efe60f41e8b0f33a92a

## Supporting WebFinger

I July 2014, I wrote [Supporting WebFinger with Static Files and Nginx].
I still use Webfinger, now primarily for my custom Mastodon server and most recently with [OpenID Connect for Tailscale].
My old nginx config required lua support to be compiled in, which wasn't awful, but kind of annoying.
My Caddy configuration is mostly equivalent, though I didn't bother to return
the proper `400` and `405` status codes on an incorrect resource parameter or HTTP method.
Instead, they just return a `404` which suits me just fine.

I define a [named matcher] that matches on the webfinger well-known URL,
the HTTP methods I want to support, and one of several valid resource values.
Then I rewrite the request to a static file like before and set some response headers.

```caddy
@webfinger {
  path /.well-known/webfinger
  method GET HEAD
  query resource=acct:will@willnorris.com
  query resource=mailto:will@willnorris.com
  query resource=https://willnorris.com
  query resource=https://willnorris.com/
}
rewrite @webfinger /webfinger.json
header @webfinger {
  Content-Type "application/jrd+json"
  Access-Control-Allow-Origin "*"
  X-Robots-Tag "noindex"
}
```

[Supporting WebFinger with Static Files and Nginx]: /2014/webfinger-with-static-files-nginx/
[OpenID Connect for Tailscale]: https://tailscale.com/kb/1240/sso-custom-oidc/
[named matcher]: https://caddyserver.com/docs/caddyfile/matchers#named-matchers

## Proxying webmentions

In August 2014, I wrote [Proxying webmentions with nginx].
I still proxy my webmentions to an external service, though I now use webmention.io.
The config requires a tiny bit more work because my URL path didn't match where I needed to send it,
but it is still pretty straightforward.

Like before, I use a named matcher to match the relevant requests,
then use Caddy's reverse_proxy directive to send them to webmention.io.

```caddy
@webmention {
  method POST
  path /api/webmention/
}
handle @webmention {
  uri replace /api/webmention/ /willnorris.com/webmention
  reverse_proxy https://webmention.io {
    header_up Host {upstream_hostport}
  }
}
```

[Proxying webmentions with nginx]: /2014/proxying-webmentions-with-nginx/

## Fetching go packages

In February 2015, I wrote [Fetching Go Sub-Packages on Static Sites].
Unsurprisingly, I still use my own domain in the import path of all of my go packages.
I currently use Hugo to generate my site, so I have a [custom layout] for my go package files
which reads relevant metadata from the page front matter and populates the necessary meta tags.

To serve the right page on `go get` requests for sub-packages, the Caddy config is quite minimal.
A named matcher is used to match requests for go sub-packages that include the `go-get` parameter,
and then serve the contents of the top-level go package file without the sub-package.

```caddy
@gopkg {
  path_regexp gopkg (/go/\w+/).+
  query go-get=*
}
rewrite @gopkg {re.gopkg.1}
```

[Fetching Go Sub-Packages on Static Sites]: /2015/go-get-subpackages-nginx/
[custom layout]: https://github.com/willnorris/willnorris.com/blob/main/layouts/go/single.html

## Do more with custom Caddy modules

I've also done a lot more interesting things with custom Caddy modules
like embedding [my imageproxy service] as well as a Tailscale node directly into the Caddy binary.
But that will be a topic for another day.

[my imageproxy service]: /2014/a-self-hosted-alternative-to-jetpacks-photon-service/

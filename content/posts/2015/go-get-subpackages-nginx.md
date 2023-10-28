---
title: Fetching Go Sub-Packages on Static Sites
date: "2015-02-20T00:28:16-08:00"
aliases: /b/4_m1
---

One of my favorite things about Go is that there is no central repository for third-party libraries
and code. Instead, import paths resemble URLs and the `go get` command can fetch packages from
wherever it is that they are hosted. There is built-in support for popular services like GitHub and
Bitbucket, but you can also import packages from any custom URL by adding a simple `<meta>` tag on
the page. This makes it very straightforward to support, even on statically generated sites, and is
what allows me to host all of my personal go packages and tools under the namespace
[willnorris.com/go][]. What's not quite as straightforward is how to support fetching
sub-packages[^1] from a custom URL using `go get`. Here's how I did it for my static site using
nginx.

## Fetching From Remote Import Paths

The procedure for fetching from remote import paths is [documented as part of the go command][], but
here's a basic example. The import path for my [image proxy server][] is
`willnorris.com/go/imageproxy`. When you run `go get willnorris.com/go/imageproxy`, go fetches
<https://willnorris.com/go/imageproxy?go-get=1> and discovers the `go-import` meta tag:

```html
<meta
  name="go-import"
  content="willnorris.com/go/imageproxy git https://github.com/willnorris/imageproxy"
/>
```

That instructs go that any package with the prefix `willnorris.com/go/imageproxy` can be found in
the git repository at `https://github.com/willnorris.com/imageproxy`. This is the exact package we
were looking for, so go will then checkout the git repository. No problem.

## Fetching Sub-Packages

My image proxy also contains a command line utility in the `cmd/imageproxy` sub-package, which I
would like to be directly installable by running:

    go get willnorris.com/go/imageproxy/cmd/imageproxy

This instructs go to fetch <https://willnorris.com/go/imageproxy/cmd/imageproxy?go-get=1> which,
until very recently, would return `404 Not Found` and result in the error:

    package willnorris.com/go/imageproxy/cmd/imageproxy: unrecognized import path "willnorris.com/go/imageproxy/cmd/imageproxy"

That's because the page doesn't actually exist; I only have a page on my site for the main
imageproxy package, but not all of its sub-packages. What I need is to serve the same `meta` tag
above on the URL for the `cmd/imageproxy` package. Interestingly, the URL can [still return a
404][] so long as it contains the `meta` tag, though that's not actually how I implemented it.

It's also worth noting that the meta import for the `cmd/imageproxy` package URL should not be
modified from the main imageproxy package, even though it's for a different package. That is, it
should still read:

```html
<meta
  name="go-import"
  content="willnorris.com/go/imageproxy git https://github.com/willnorris/imageproxy"
/>
```

That's because the meta import identifies the package prefix that maps to the root of the source
control repository. When you request a sub-package, go will see the above `meta` tag and verify
that the prefix specified is a prefix of the requested package. Since it is not an exact match, go
will make a second request to <https://willnorris.com/go/imageproxy?go-get=1> to confirm that the
same meta import information is found there. Since it is, it will then proceed with checking out
the source repository and installing the requested package.

## Rewriting Requests with Nginx

**Update 2023:** I now use the Caddy instead of nginx,
and have an [equivalent Caddy snippet here](/2023/caddy-snippets/).

As I noted above, all of my go packages are located under [willnorris.com/go][]. The simplest way I
found to have requests for sub-packages include the same meta include as the top-level packages is
to just rewrite the request inside nginx. And in an attempt to ensure that I don't have multiple
URLs with duplicate content, I only do this for URLs that contain `?go-get=1`, which go appends to
all `go get` requests. Ideally these requests would also get a `X-Robots-Tag: noindex` response
header, but I don't think that's easily possible. Here's the nginx configuration I use for this:

```nginx
# Allow go subpackages to be fetchable with `go get`
location ~* ^/go/\w+/.+ {
  if ($arg_go-get) {
    rewrite ^(/go/\w+) $1? last;
  }
}
```

As noted on <http://wiki.nginx.org/IfIsEvil>, this is actually one of the few scenarios where
using an if directive inside a location context is safe. What we're doing here is first matching
any requests that start with `/go`, followed by at least two additional path segments: `/\w+` which
identifies our top-level package, and `/.+` that identifies some sub-package. Then we use nginx's
special `$arg_name` [embedded variables][] to check if the `go-get` query parameter is set, and if
so, rewrite the request to the page for the top-level package. Otherwise, nginx will return a 404.

This now means that <https://willnorris.com/go/imageproxy/cmd/imageproxy> (without the `go-get`
parameter) will properly return a `404`, but
<https://willnorris.com/go/imageproxy/cmd/imageproxy?go-get=1> will be rewritten to return the same
response as <https://willnorris.com/go/imageproxy>, meta include and all.

[^1]: Go doesn't technically have the notion of "sub-packages" in a formal sense, though I'll use that term here to refer to packages whose import paths are prefixed with the import path of another package. For the most part, there is nothing special about packages that happen to share a common prefix. The only real exceptions are the rules for importing [internal packages][] introduced in go1.4, and the fact that packages that share a common prefix may be installed by `go get` together, as noted in this post.

[willnorris.com/go]: /go
[documented as part of the go command]: https://golang.org/cmd/go/#hdr-Remote_import_paths
[image proxy server]: /2014/01/a-self-hosted-alternative-to-jetpacks-photon-service
[still return a 404]: https://github.com/golang/go/blob/1ae124b5ff38045008402b51017c8303eef2cda1/src/cmd/go/http.go#L81-L82
[internal packages]: https://golang.org/s/go14internal
[embedded variables]: http://nginx.org/en/docs/http/ngx_http_core_module.html#variables

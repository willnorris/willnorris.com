---
title: Supporting WebFinger with Static Files and Nginx
date: "2014-07-25T09:57:08-07:00"
syndication:
  - https://twitter.com/willnorris/status/492710476053094402
aliases: /b/4XG1
---

A few weeks ago, I [switched my website][] from WordPress to a staticly generated site. In doing so, I had to find
alternative solutions to some of the things I was doing with WordPress that can't be easily handled just using static
files. One of those things is [WebFinger][] (aka [RFC 7033][]), which is a simple discovery protocol for URIs that
might not be usable as locators otherwise, such as account or email URIs. It's actually not too heavily used right now
aside from [OpenID Connect][], but it's still something I want to continue supporting.

<figure class="alignright">
  <img src="webfinger.svg" height="200">
  <figcaption><a href="https://github.com/webfinger/assets/tree/gh-pages/logo">WebFinger logo by Eran Hammer</a></figcaption>
</figure>

In its simplest form, WebFinger involves sending a GET request to a well-known URL, `/.well-known/webfinger`, with an
identifier passed in the `resource` query parameter. The server responds with a JSON document describing the requested
resource. Given that the contents returned depend on the value of a query parameter, it can't really be done with _just_
static files, but it can with a little help from nginx.

## Requirements

I wanted to follow the WebFinger spec as closely as possible, so the basic requirements for my setup were:

- requests for any of my identifiers return my WebFinger document
- requests for unrecognized identifiers return a 404 (required by [section 4.2][])
- requests with a missing or malformed identifier return a 400 (required by [section 4.2][])
- responses include a content type of "application/jrd+json" (required by [section 4.2][])
- responses include an appropriate CORS header (required by [section 5][])

There were a few optional parts of the spec I explicitly chose not to support:

- no support for content negotiation to request a different response format (allowed in [section 4.2][])
- no support for the `rel` parameter to filter the contents of the response (allowed in [section 4.3][])

## My setup

So, my final nginx configuration for supporting WebFinger is:

```nginx
location = /.well-known/webfinger {
  if ($request_method !~ ^(GET|HEAD)$) { return 405; }
  set_by_lua $resource 'return ngx.unescape_uri(ngx.req.get_uri_args()["resource"])';
  if ($resource = "") { return 400; }
  if ($resource = "acct:will@willnorris.com")   { rewrite .* /webfinger.json last; }
  if ($resource = "mailto:will@willnorris.com") { rewrite .* /webfinger.json last; }
  if ($resource = "https://willnorris.com")     { rewrite .* /webfinger.json last; }
  if ($resource = "https://willnorris.com/")    { rewrite .* /webfinger.json last; }
}

location = /webfinger.json {
  types { application/jrd+json json; }
  add_header Access-Control-Allow-Origin "*";
}
```

{: #config}

My first location block is an exact match for the well-known WebFinger path. Within that block, I first enforce that
only `GET` and `HEAD` requests are accepted, all others receive a 405 response. This isn't required by the spec, but
seems like a good idea.

Next, I use a small lua snippet to URL decode the `resource` query parameter and store it in a variable. By default,
parameters are not URL decoded, but need to be for the string comparison in the next step. The [embedded lua module][]
is typically not included in standard nginx installations, but is part of the `nginx-extras` apt package in Debian and
Ubuntu. Alternately, this could be done with the [embedded perl module][] which may be more common, but is a little more
work to use since the `perl_set` directive can't be used inside location blocks. Or there is the [ngx_set_misc
module][] which provides a `set_unescape_uri` directive specifically for URL decoding values, but that typically
requires building nginx from source, which I didn't want to deal with.

Next, I compare the decoded resource value, returning a 400 response if empty, rewriting the request to my WebFinger
document if it matches one of my identifiers, or (implicitly) returning a 404 response if nothing else matched. Because
this is my personal domain, I can easily hardcode the identifiers I want to support, and rewrite these requests to a
single `webfinger.json` resource. If I needed to support multiple users or identities, I would likely rewrite the
request based on the `resource` value similar to what [Aaron Parecki][] does with his [Apache config][].

Finally, I have a location block for my `webfinger.json` document which adds the correct content type and CORS header.

## Possible alternatives

Instead of rewriting the original request, I could have just as easily returned a redirect to my `webfinger.json`
document, but I chose to do it in a single request. Similarly, I also tried moving this file to
`/.well-known/webfinger` directly which worked fine, but the nginx config to ensure that invalid `resource` values
returned a 404 wasn't quite as readable.

For Jekyll users, [Eric Mill][]'s [jekyll-webfinger][] plugin generates a WebFinger document from a yaml source file,
which is really nice. It just focuses on file generation, so it still requires additional webserver configuration like
the above to handle proper error codes and content types. Personally, I just edit the JSON file by hand.

[switched my website]: /2014/07/one-step-forward-two-steps-back
[WebFinger]: http://webfinger.net/
[RFC 7033]: https://tools.ietf.org/html/rfc7033
[OpenID Connect]: http://openid.net/specs/openid-connect-discovery-1_0.html
[section 4.2]: https://tools.ietf.org/html/rfc7033#section-4.2
[section 4.3]: https://tools.ietf.org/html/rfc7033#section-4.3
[section 5]: https://tools.ietf.org/html/rfc7033#section-5
[embedded lua module]: http://wiki.nginx.org/HttpLuaModule
[embedded perl module]: http://nginx.org/en/docs/http/ngx_http_perl_module.html
[ngx_set_misc module]: http://wiki.nginx.org/HttpSetMiscModule
[Aaron Parecki]: https://aaronparecki.com/
[Apache config]: https://gist.github.com/aaronpk/5846789
[Eric Mill]: https://konklone.com/
[jekyll-webfinger]: https://github.com/konklone/jekyll-webfinger

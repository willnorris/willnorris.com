---
title: Proxying webmentions with nginx
date: 2014-08-04T19:39:28-07:00
short_url: /b/4XT1
syndication:
 - https://twitter.com/willnorris/status/496486808859844608
---
In my ever-continuing attempt to [indiewebify][] my [new static website][], I wanted to share what I came up with for
receiving webmentions.  Being a static site, I have to use some kind of webmention sidecar to process and store the
mentions themselves.  I'm currently using [Pelle Wessman][]'s [webmention service][] on Heroku, which works pretty well.
But I was also interested in having a "[visible endpoint that teaches][]", as well as one that had a web form for
manually submitting webmentions.  And of course, I like the idea of hosting it on my own site, so I can customize it
exactly how I want.

What I ended up with is a hybrid approach.  My new webmention endpoint is <https://willnorris.com/api/webmention>.  All
HTTP `GET` requests to that URL are served by a static file on my webserver, while HTTP `POST` requests are forwarded to
Pelle's webmention service using nginx's proxy module.  I feel like this gives me the best of both worlds, and the
configuration to do it was surprisingly simple:

```
location = /api/webmention {
  if ($request_method = POST) {
    proxy_pass https://webmention.herokuapp.com;
  }
  try_files $uri $uri.html $uri/ =404;
}
```

I did luck out in that Pelle chose `/api/webmention` as the path for his webmention endpoint.  This is exactly what I was
wanting to use, which means the proxy just works.  Had I wanted to map a different path, it would have been a little more
complicated because nginx has some limits on how proxies can be configured inside `if` blocks ([this stackoverflow
post][] has some details).

[indiewebify]: http://indiewebify.me/
[new static website]: https://willnorris.com/2014/07/one-step-forward-two-steps-back
[Pelle Wessman]: http://voxpelli.com/
[webmention service]: https://webmention.herokuapp.com/
[visible endpoint that teaches]: http://indiewebcamp.com/irc/2014-05-04/line/1399233029
[this stackoverflow post]: https://stackoverflow.com/questions/10627596/nginx-proxy-or-rewrite-depending-on-user-agent

**Still to do:**  <s>Currently, when you submit the form on my webmention page it just returns a plaintext success
message, since that's what the webmention service returns.  I need to add a little javascript to the form so that it is
submitted in an XHR request and a nicer success message can be displayed.</s> (fixed)  

I'm also still not displaying received webmentions, but I'll get to that eventually.

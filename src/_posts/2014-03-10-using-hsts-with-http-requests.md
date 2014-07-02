---
layout: post
title: Using HSTS with HTTP requests
wordpress_id: 1150
date: 2014-03-10T15:41:17-07:00
categories:
- technology
tags:
- indieweb
- https
- ssl
- hsts
syndication:
- https://twitter.com/willnorris/status/443154975406166016
---
At IndieWebCamp this last weekend, [Ryan Barrett](https://snarfed.org/) noted that he serves both secure and non-secure
traffic on snarfed.org, and that instead of redirecting non-secure URLs to their secure equivalents, he sends an [HSTS
header](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security) for all content.  That way, browsers that
understand HSTS will eventually start switching over to the secure version of his site.  I thought this was certainly a
clever way to maintain support for older browsers that don't support SNI (IE on Windows XP, mainly), but I mentioned
that I was pretty sure that you weren't supposed to do that.  I couldn't remember where I read that, and it turns out
it's right out of RFC 6797 ([section 7.2](http://tools.ietf.org/html/rfc6797#section-7.2) to be exact):

> An HSTS Host MUST NOT include the STS header field in HTTP responses conveyed over non-secure transport.

And this makes sense.  The whole point of the header is to indicate to clients that they should always use a secure
transport.  If that's true, then you shouldn't ever send any content over non-secure channels.  There's no real way to
indicate that a secure option is available and is preferable, but not force clients to use it.

---
title: How well does your OpenID Provider stack up?
wordpress_id: 205
date: 2007-10-25T14:37:15-07:00
categories:
- identity
- technology
tags:
- openid
- yadis
- xrds
---
There are increasingly [more specs][] in the OpenID space, and many of the extensions rely on XRDS documents to
publicize support.  To help enable that, I've been looking to update my [yadis plugin][] for WordPress to automatically
include the correct protocol support for the major OpenID Providers.  Of course, in order to do that I have to actually
find out what all protocols they supported, so I pulled out [JanRain's OpenID library][openid library] and began writing
my script.  I first checked all the different ways in which you can request an XRDS document... using a request header
of `Accept: application/xrds+xml`, looking for a response header of `X-XRDS-Location`, looking in the `<meta />` tags,
etc.  Once I had the XRDS document, I checked which protocols they advertised support for, and compiled that all into a
[nice little table][openid support].  

See the [OpenID Support Table][openid support].

The results are about what I would expect... there are just a few front-runners that are really making an effort to
support the emerging technology (likely because they are also involved in authoring these new protocols).  Everyone else
is supporting some version of the (technically, still current) OpenID 1.x protocol and about half have also added sreg
support.  That same half have basic XRDS support (since it's required for sreg), but none of them are doing more than
the most basic XRDS discovery method.  Only a couple of the leaders are supporting the more advanced (and **much**
faster) XRDS discovery.

[more specs]: http://openid.net/developers/specs/
[yadis plugin]: http://willnorris.com/projects/wp-yadis
[openid library]: http://openidenabled.com/
[openid support]: http://willnorris.com/openid-support

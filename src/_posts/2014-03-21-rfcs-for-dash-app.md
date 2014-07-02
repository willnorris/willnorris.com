---
layout: post
title: RFCs for Dash.app
wordpress_id: 1152
date: 2014-03-21T14:27:29-07:00
categories:
- technology
tags:
- dash.app
- rfc
syndication:
- https://twitter.com/willnorris/status/447123638102138880
- https://plus.google.com/+willnorris/posts/L6LB7dfhQ6Q
---
I recently (re)discovered [Dash][], an OS X application that provides offline access to a number of popular
documentation sets.  I had done something similar myself many years ago by mirroring the php.net website locally, but
Dash provides a much better UI, provides good search functionality, and integrates nicely with text editors and
launchers like [Alfred][].  For me, having the offline access during my daily commute, as well as the ability to search
directly from Alfred made this well worth the twenty bucks it costs.

One documentation set that was missing however was RFCs published by the IETF.  I regularly find myself wanting to
reference the specifications for things like [HTTP](https://tools.ietf.org/html/rfc2616),
[timestamps](https://tools.ietf.org/html/rfc3339), or [URIs](https://tools.ietf.org/html/rfc3986).  So this week I put
together a Dash docset that includes every published RFC, indexed and marked up so that Dash can display tables of
contents.  It looks something like this:

<img src="rfcdash.png" alt="rfcdash" width="932" height="524" class="border" />

It's certainly not small... the expanded archive weighs a little over 500 MB.  But it's really nice to have readily
available if you reference RFCs a lot.  You can [install the docset directly into Dash][install] or find it [on
GitHub](https://github.com/willnorris/rfcdash).

[Dash]: http://kapeli.com/dash
[Alfred]: http://www.alfredapp.com/
[install]: dash-feed://https%3A%2F%2Fraw.githubusercontent.com%2Fwillnorris%2Frfcdash%2Fmaster%2FRFCs.xml

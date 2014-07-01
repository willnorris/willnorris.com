---
layout: post
title: Display likes in a facepile
wordpress_id: 1146
date: '2014-03-09T22:42:59-07:00'
categories:
- technology
tags:
- indieweb
- facepile
- webmention
syndication:
- https://twitter.com/willnorris/status/442898718824476673
---
This weekend I got webmentions working on my site again, and now thanks to [brid.gy](http://brid.gy) I have Twitter
likes, Google +1s, etc feeding back into my site.  By default though, they display as normal WordPress comments.
Tonight, I got them displaying as a facepile.  For example, see the bottom of my [IndieWebCamp 2014
post](https://willnorris.com/2014/03/indiewebcamp-2014).

There's still more I'd like to do with the UI, and the code needs to be cleaned up quite a bit so I can start sending it
upstream, but if anyone wants to take a look, here's the [interesting commit][]

[interesting commit]: https://github.com/willnorris/willnorris.com-wordpress/commit/d6061d6

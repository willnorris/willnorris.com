---
title: indie two-factor auth
wordpress_id: 968
date: 2012-06-13T11:26:41-07:00
categories:
- technology
syndication:
- https://plus.google.com/+willnorris/posts/ebkiiTnu297
---
I was noting to [Tantek Çelik](http://tantek.com/) this week while we were at [#pdf2012][] that as I've been moving to
Google alternatives to various services (namely Dropbox to Google Drive), I'm reminded that my Google account is one of
the most secure accounts I have anywhere.  It ranks up there with my bank,  Paypal, Facebook, and (somewhat ironically)
World of Warcraft, as one of the few accounts that have [multi-factor authentication][].

But what's the #indieweb  version of multi-factor authentication?  I want to power my own OpenID, but I want it to be as
secure as possible.  Is it at all practical to try and have a more "independent" multi-factor auth?  Or is it just best
left to the large companies that have the security resources to invest in this?  Tantek had the additional idea of an
indieweb solution where each deployment was slightly different in some way, making mass attacks far less practical since
it would be unique per site.

I don't know enough of the specifics of this problem space... mainly just thinking out loud.  Anyone ever tried to setup
a more secure auth mechanism on your own?

(Of course, the huge caveat also being that all of this is only as secure as the hardware you're running it on.  I'm
sure a standard off-the-shelf VPS pales in comparison to the security of Google's production infrastructure)

[#pdf2012]: http://personaldemocracy.com/conference
[multi-factor authentication]: http://goo.gl/SOHzX

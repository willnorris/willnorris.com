---
layout: post
title: Free Your ID
wordpress_id: 169
date: 2007-02-13T20:12:55-08:00
categories:
- identity
- technology
tags:
- openid
---
Wow, when Scott [said yesterday][] that JanRain was going to be making a cool announcement, he wasn't kidding.  Today
they, along with GNR, [announced][] a new service called [FreeYourID][], which provides identity services with a .name
domain.  This top level domain was [originally setup][] for use by individuals in this fashion, but it never really
seemed to catch on (at least from my perspective).  This new service allows you to register your name (typically
*first*.*last*.name), and they provide email forwarding, web forwarding, and best of all OpenID.  And referencing what I
talked about yesterday, they use delegation to power the OpenID component, by delegating to JanRain's [MyOpenID][].  As
can be seen in the comments on Scott's post, there are a few quirks in the system, but GNR is jumping right on them.  In
certain respects, I almost like this better than using my domain name as my OpenID... it better reflects the personal
nature of the ID (by using .name), and I have the [web redirect][] going to my ClaimID page.  From there people could
get to my personal homepage (here), or perhaps a more appropriate page of mine like my homepage at work.

FreeYourID is free for the first 90 days, and then $10.95 a year (at the time of this writing) after that.  An
incredibly reasonable price; I would go ahead and pay for the first year or two if only they'd let me -- my page only
includes the message "Free Trial active ... There is no need to pay anything yet".

In all, an exciting and very well implemented announcement.  Way to go, guys!

[said yesterday]: http://willnorris.com/2007/02/wp-xrds#comment-1219
[announced]: http://kveton.com/blog/2007/02/13/openid-name-great-news/
[FreeYourID]: http://freeyourid.com/
[originally setup]: http://www.icann.org/tlds/name1/
[MyOpenID]: http://myopenid.com/
[web redirect]: http://will.norris.name/

---
layout: post
title: OpenID delegation and XFN
wordpress_id: 200
date: '2007-10-12T12:51:34-07:00'
categories:
- identity
- technology
tags:
- openid
- yadis
- xfn
---
I contacted the [FreeYourID][] folks earlier this week to ask them about adding an XFN link to my forwarding page at [will.norris.name][].  They seemed receptive to the idea and should hopefully be adding that soon.  I was then telling [Chris Messina][] about it and I think he misunderstood me, but in the process got me thinking.  You see, FreeYourID does delegate OpenIDs off to [MyOpenID][], but the `openid.delegate` is the same as your FreeYourID URL.  In addition to this, they have a meta refresh tag to forward web traffic to a site of your choosing ([claimID][] in my case).  I was asking for a `rel="me"` link for this forwarded URL be added.

But what about OpenID delegate URLs?  Is there ever a case when it does **not** make sense to add `rel="me"` to an OpenID delegate?  I can't imagine that there is, since the very act of delegating is saying "this is my ID over at this other service".  With that in mind, I propose that openid delegates always include `rel="me"` in addition to `rel="openid.delegate"`.  Rel is a space delimited multi-valued attribute, and I've successfully tested a couple of different services.  Here's a concrete example of my OpenID delegation links here on willnorris.com...

    <link rel="openid.server" href="http://www.myopenid.com/server" />
    <link rel="openid.delegate me" href="http://will.norris.name/" /> 

I will be updating my [yadis plugin][] to behave in this manner as well.

[FreeYourID]: http://freeyourid.com/
[will.norris.name]: http://will.norris.name/
[Chris Messina]: http://factoryjoe.com/blog/
[MyOpenID]: http://myopenid.com/
[claimID]: http://claimid.com/willnorris
[yadis plugin]: http://willnorris.com/projects/wp-yadis/

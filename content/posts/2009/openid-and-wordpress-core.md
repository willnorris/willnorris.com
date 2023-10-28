---
title: OpenID and WordPress Core
date: "2009-09-29T13:17:19-07:00"
aliases: [/b/41w1, /b/Ed, /p/878]
categories:
  - identity
  - technology
tags:
  - wordpress
  - openid
  - wp-openid
---

_This was actually [a comment][] I left on my last post about the v3.3 release of the OpenID plugin. It is a topic that
comes up relatively often, and one in which most people are surprised when they hear my stance on it. It's worthy of a
separate discussion for those that are interested, so I've pulled it out into a separate post._

[a comment]: /2009/09/wordpress-openid-v3-3#comment-35595

I’ve talked with core team about this numerous times… in fact, I spoke at [WordCamp Portland][] and [Seattle][] these
last two weeks and talked with [Matt][] about it. For the most part, I actually agree with him that OpenID doesn’t
necessarily belong in core, at least not yet.

There’s a lot of thought being given to how WordPress can serve as your “digital hub” on the web. Right now, Automattic
is playing in that space in the form of [BuddyPress][]. Now right now, BP allows you to create another social network
silo. BP installations don’t talk to each other, and there’s no way to use your account on one BP network to login to a
different BP network. I talked with [Mark Jaquith][] this weekend about my desire to see this outward facing
functionality. For that, I think OpenID becomes painfully obvious.

I would also like to see this OpenID plugin deployed on WordPress.com to replace the existing plugin. Currently, [all
WP.com blogs are OpenIDs][], but you can’t login or leave comments using an external OpenID. And currently, almost no
one uses the existing OpenID provider. Of course, I would argue that this is because they haven’t done a good job of
promoting it or adding any new features like SReg or AX. Using my OpenID plugin would greatly enhance the OpenID
provider functionality on WP.com, and it would allow people to use OpenID when leaving comments. Some of the changes
that are included in 3.3 are actually steps toward cleaning up the plugin so that it is more suitable for deploying on
WordPress.com. There’s still more work to be done on this front, but it’s something I intend to continue pursuing.

As for inclusion in WordPress core, I just don’t think we’re there yet. The OpenID plugin is [pretty popular][], but it
is far from having the critical mass that would justify inclusion in core. I am a firm believer that WordPress should by
no means try and include every cool feature under the sun in core. It would quickly grow out of control. I do believe,
however, that the appropriate hooks should be provided in core to allow any cool feature under the sun to be added as a
plugin. The core dev team agrees with me on this, and they’ve been very good about making whatever changes were
necessary to allow plugins to provide that functionality. In fact, I overhauled how the [authentication system][] is
extended in WordPress 2.8 simply to make things like OpenID and OAuth much easier to implement.

A few other things I’d want to see fixed before considering inclusion in core… the OpenID plugin weighs in at what?
almost 900K? Remove the screenshots and readme.txt and you’ve got 700K left. Over 500K of that is the [JanRain OpenID
library][]. So size is an issue. Also, the biggest problem that people have with getting the plugin to work is related
to their environment. WordPress is known for having a very minimal set of requirements to get it running. I’d really
want to track down and fix a lot of these weird environment issues that continue to plague the plugin. Finally, we need
a **really** solid UI, both comment form integration and the admin side. I’m pretty happy with the new comment form
integration, but the current admin screens need work. More than anything, there is just a lot of functionality in the
plugin and it’s hard to boil it down. Especially when you consider both the OpenID consumer and provider options, both
site-wide and per-user.

[WordCamp Portland]: http://wordcampportland.org/
[Seattle]: http://wordcampseattle.com/
[Matt]: http://ma.tt/
[BuddyPress]: http://buddypress.org/
[Mark Jaquith]: http://markjaquith.com/
[all WP.com blogs are OpenIDs]: http://support.wordpress.com/settings/openid/
[authentication system]: /2009/03/authentication-in-wordpress-28
[JanRain OpenID library]: http://openidenabled.com/php-openid/
[pretty popular]: http://wordpress.org/extend/plugins/openid/stats/

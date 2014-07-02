---
layout: post
title: new features in wpopenid+
wordpress_id: 184
date: 2007-04-06T22:06:54-07:00
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
---
I had a little time to kill this evening here at my office while I'm waiting for some of the Los Angeles holiday weekend
traffic to clear out, and I spent a few hours on my little OpenID wordpress plugin.  First, I fixed the issue of users
not seeing the notification that their comment was awaiting moderation.  It turns out, it has do with the weird logic
wordpress uses to decide if they authored the comment; certainly a bug as far as I'm concerned and [filed
accordingly][].  I provided a simple patch with that bug report to fix the wordpress internal code, but I've also
patched my plugin to do the same thing using filters in the meantime.  That one wasn't too hard once I found the right
place for it, and I feel pretty comfortable with the approach.... it's not ideal, but it's at least consistent with how
the other internal WP code works in this area.

The second feature I added is definitely a bit more "beta"... there is now a checkbox in the option page to turn off the
creation of local wordpress accounts when people comment with their OpenID.   This actually didn't require writing a
whole lot of *new* code, but rather a ton of refactoring of the existing code.  This is not quite fully cleaned up, so
don't go installing this in your production environment, but it should be enough to play with it a little and make sure
it works like you think it should.  An interesting thing to note is that these two features are somewhat mutually
exclusive... the bug report I mentioned kind of explains why for those that are curious.  I do plan on trying to remedy
that, but I've spent about all I can on this tonight.

I'd love to have some folks check the latest copy of the plugin out of [subversion][] and give it a whirl (just please
do it in a test environment :-) ).  Feel free to leave comments on this post; if you're reporting problems please
include what version of wordpress and PHP you are using.  There is still a bit of work to be done on it before I do a
new release, and I may also wait for the 2.0 release of  JanRain's PHP OpenID library... they just published the first
release candidate yesterday and I'm really anxious to start playing with it.

[filed accordingly]: http://trac.wordpress.org/ticket/4108/
[subversion]: http://willnorris.com/svn/code/wpopenid/trunk/

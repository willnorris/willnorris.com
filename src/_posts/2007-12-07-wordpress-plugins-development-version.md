---
title: WordPress plugins - development version
wordpress_id: 216
date: 2007-12-07T09:52:46-08:00
categories:
- identity
- technology
tags:
- wordpress
- wp-openid
- plugin
---
I'm always hesitant to tell people to "grab the latest version of wp-openid from subversion".  That is often either
followed by questions of "What is subversion?", requests for help getting subversion to work, or the person whose bug
I'm trying to fix doesn't test the change because they don't want to deal with subversion.  Not that I can blame them...
Windows and pre-Leopard Macs don't ship with a subversion client, so it really is a bit of work for the end-user.

Somehow, I completely missed the fact that wordpress.org addresses this by providing a zip file of the latest trunk code
in subversion in addition to whatever you designate as the latest stable release.  On the plugin page, click on *Other
Versions*, then on the *Development Version* at the bottom of the page.  For wp-openid, that is [here][].  I imagine
many other plugin authors knew about this, but it was news to me, and very welcome news.  So if you've been holding off
testing some new changes I've made because you don't want to mess with subversion, you now have an easy alternative.

[here]: http://wordpress.org/extend/plugins/openid/download/

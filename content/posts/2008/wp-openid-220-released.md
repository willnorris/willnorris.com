---
title: wp-openid 2.2.0 released
date: '2008-07-23T18:44:50-07:00'
shortlink: [/b/3v, /p/235]
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
- eaut
---
I've just released version 2.2.0 of the OpenID plugin for WordPress.  Notable additions in this version:

 - POST replay for comments - this should fix all the compatibility issues with other comment related plugins like
 reCaptcha.
 - MUCH better memory usage - like no longer needlessly building a 2MB object on every page load!
 - support for [Email Address to URL Transformation](http://eaut.org) - now you can use an email address anywhere you
 normally use an OpenID
 - fixed [OpenID Spoofing vulnerability](http://plugins.trac.wordpress.org/ticket/702) - users' profile URLs must match
 one of their OpenIDs
 - using hooks for gathering user data - other plugins can now hook in and gather user info from FOAF, hCard, whatever
 - If OpenID authentication fails for whatever reason, the user is given the opportunity to submit their comment without
 OpenID
 - lots of little fixes, code refactoring and cleanup, and a lot of UI tweaks

Download at <http://wordpress.org/extend/plugins/openid/>.

I tested pretty thoroughly on WordPress 2.2 through 2.6 using PHP5.  I'm fairly certain I didn't break PHP4, but let me
know if you find any problems.

With this out the door, I'll be jumping right into my feature list for the next major release -- adding a native OpenID
Server and delegation capabilities.  At that point, it should be able to handle all of your OpenID related needs.

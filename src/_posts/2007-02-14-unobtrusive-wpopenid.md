---
title: Unobtrusive wpopenid
date: '2007-02-14T05:23:30-08:00'
shortlink: [/b/2q, /p/170]
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
---
I've been meaning to install Alan Castonguay's [wpopenid][] wordpress plugin to enable OpenID authenticated comments for
some time now.  I finally got around to it tonight, and was overall pleased with it, despite a few minor bugs.  More
importantly though, I later ran across Sam Ruby's post entitled "[Unobtrusive OpenID][]" in which he talks about using a
comment form's already-existing *website* field to get OpenIDs.  This made a whole lot of sense to me, and I am happy to
report that I was able to modify wpopenid to mimic this functionality without too much effort.  So the resulting plugin
now has an administrative option to enable "Unobtrusive Mode".  When this is turned on, the URL typed into the *website*
field will be checked to see if it is a valid OpenID.  If it is, the name and email address provided will be ignored and
login will continue as normal with the OpenID.  If the URL provided is *not* a valid OpenID, then it will be treated as
a normal comment, subject to your existing requirements for presence of name and email.  When "Unobtrusive Mode" is
disabled, the plugin functions exactly as it always has.  Feel free to post test comments on this post to make sure it
is working.

[wpopenid]: http://verselogic.net/projects/wordpress/wordpress-openid-plugin/
[Unobtrusive OpenID]: http://www.intertwingly.net/blog/2006/12/28/Unobtrusive-OpenID


This patch also includes two additional fixes:

- debug mode is now off by default.  You all might want to look at your `/wp-content/uploads/php.log` file... I've
noticed at least one person with one in excess of 500 MB large!
- fixed problem where OpenID would create an invalid return_to URL if your wordpress URL is different than the blog URL

Download the plugin from the [project page][].

[project page]: /projects/wpopenid/

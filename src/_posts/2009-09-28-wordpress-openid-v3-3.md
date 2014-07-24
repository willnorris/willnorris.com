---
title: WordPress OpenID v3.3
wordpress_id: 876
date: '2009-09-28T13:04:15-07:00'
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
---
I've finally gone ahead and released version 3.3 of the [WordPress OpenID plugin][].  This release includes three major
sets of changes.  First, it drops support for older versions of WordPress... the minimum required version is now 2.8.
Trying to maintain backwards compatibility requires a non-trivial amount of effort, and I'd rather spend that time
working on new features.  It also cleans up the code a fair bit, which I always like.  It also drops support for two
experimental OpenID extensions known as [EAUT][] and [IDIB][].  EAUT is effectively being replaced by [WebFinger][], and
IDIB never got too much traction.  Either could still be added pretty simply by another plugin if people still want
them.

Second, this release features a new user interface for the integrating OpenID into the WordPress comment form.  Instead
of simply advertising OpenID support on the "Website" field, and **always** attempting OpenID authentication, the plugin
now detects OpenID support for a URL, and gives the user the option to authenticate the comment.  This provides a
cleaner, less obtrusive interface that should work on most all themes.  It also gives the user the option to **not**
authentication that particular comment if they don't want (particularly useful if you're on a mobile device or in a
hurry and don't want to mess with OpenID).  Feel free to try it out on this post if want.  You really don't even have to
submit the comment to see it in action... just enter a valid OpenID URL for the website field, and move focus somewhere
else (ie, click in the comment box like you're going to type a comment).  There is currently no option to revert to the
old style of comment form integration, so hopefully folks will like this new UI.  If you really don't like it, you
always have the option of turning off comment form integration and modifying your theme to your heart's content.

Finally, this release includes a lot of minor bug fixes that people have been complaining about (sorry it took so long).
I'm sure I didn't get to all of them, so please let me know what I missed, and I'll try to do more regular minor
releases with these smaller fixes.

I'll additionally note that working on WordPress plugins is no longer part of my day job, so I currently work on them
rather sporadically as I have time.  The changes in this release have been developed a few hours at a time over the last
couple of months.  I've been running trunk here on my site for quite some time and haven't had problems, but you never
know.  Please use the [DiSo issue tracker][] to report any new bugs, or to remind me of existing tickets that are still
not fixed in this release.

[WordPress OpenID plugin]: http://wordpress.org/extend/plugins/openid
[EAUT]: http://eaut.org/
[IDIB]: http://code.google.com/p/idib/
[WebFinger]: http://code.google.com/p/webfinger/
[DiSo issue tracker]: http://code.google.com/p/diso/issues

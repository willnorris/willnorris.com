---
title: The Next Steps with wp-openid
wordpress_id: 265
date: '2008-09-16T14:17:21-07:00'
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
- xrds-simple
---
I'm really excited about what's been happening with the WordPress OpenID plugin the last couple of weeks.  When it's
ready to ship, I'm sure I'll do some really deep contemplative post about "how far we've come" or something like that.
In the meantime however, I think I've got something that is mostly feature complete and more or less ready for some
"alpha" level testing.  There's a lot that will be new in this release, which I'm going to try and cover in my next
couple of posts.  That should give people more manageable chunks to look at, test, and comment on.  If you've got a test
WordPress instance laying around and like playing with unreleased code, please dive right in.

### Here Be Dragons! ###

Let me say first and foremost, don't use this on a production blog.  I always say that when I blog about unreleased
code, but this time it's much more important.  There are major database changes in this version... changes which are
non-trivial to reverse.  There is a very good chance there will be more database changes before the final release, and
there will not be an upgrade path from this development version (there will however be an upgrade path from the last
stable version... 2.2.x).


### What's New ###

For now, I'm just going to have two follow-up posts talking about changes in the coming release.  I'm sure I'll overlook
something and may have to add a third post, but for now we're looking at:

 - [Making the plugin more stable, extensible, and overall simpler][stability]
 - [OpenID Providing and Delegation][provider]

[stability]: http://willnorris.com/2008/09/wp-openid-faster-stronger-better
[provider]: http://willnorris.com/2008/09/providing-and-delegating-openids


### Test it Out ###

The current plugin can be checked out from the DiSo subversion repository; grab the [3.0 branch][] .  In addition, it
requires a special branch of the [XRDS-Simple plugin][] to provide all the XRDS publishing stuff.  If you have a
previous version of wp-openid installed, you **must** deactivate and reactivate the plugin for the database changes to
be applied.  Again, keep in mind that these will be somewhat substantial changes to the OpenID portions of the database,
so don't do this on your production blog just yet. Please direct any support questions to the [DiSo Mailing List][].

[3.0 branch]: http://diso.googlecode.com/svn/wordpress/wp-openid/branches/3.0/
[XRDS-Simple plugin]: http://diso.googlecode.com/svn/wordpress/wp-xrds-simple/branches/refactoring/
[DiSo Mailing List]: http://groups.google.com/group/diso-project

---
layout: post
title: final push for wp-openid 2.0
wordpress_id: 211
date: '2007-11-08T11:35:28-08:00'
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
---
This morning I committed the one remaining update I was really holding off for in releasing wp-openid 2.0.  Previously, the plugin set a comment type of `openid` for OpenID comments, and then used some clever trickery to expose the expected value of `comment` to the rest of WordPress.  Well, *almost* the rest of WordPress... it still caused some problems with other plugins and such.  Even more than those issues, I really wanted to get this committed because it requires a database schema change, and I really don't want to  make schema changes in point release so it was now or never.  So now the plugin adds a new `openid` column to the comments table which stores a boolean value indicating whether the comment was left with an OpenID or not.  This simplifies the logic quite a bit, should fix any problems with other plugins, and will make it easier to migrate to a [real solution][] if and when that becomes available.  The logic to upgrade to the new schema is pretty simple, but as always I'd strongly recommend you backup your database first if you are attempting this in production.  You will want to deactivate the plugin, upgrade, and then reactivate... really, it likely won't work otherwise.

So this brings me to my request of all of you.  First of all, please grab this latest version out of svn and try it out.  But second, if you have any outstanding bugs please submit them to [Trac][], even if you have already emailed me about them, as we have multiple people working on the plugin now.  For those not aware, [Alan Castonguay][], the author of the original wp-openid plugin I forked, rejoined the development efforts several weeks ago.  He's focussing a lot on wordpress-mu compatibility, but as the original author he's quite qualified for fixing whatever bugs creep up.  If you have feature requests, go ahead and submit them to [Trac][] as well so that we don't forget about them, but don't be hurt if they are not in the 2.0 release.

[real solution]: http://trac.wordpress.org/ticket/5183
[trac]: http://dev.wp-plugins.org/report/9?COMPONENT=openid
[Alan Castonguay]: http://verselogic.net/

---
title: wp-openid moving to DiSo
date: '2007-12-10T12:59:03-08:00'
aliases: [/b/3qx1, /b/3c, /p/217]
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
- diso
---
In case you missed it last week, [Steve Ivy][] and [Chris Messina][] announced the [DiSo Project][] as an incubator of
sorts to develop distributed social applications.  Initially, they will be focussing on plugins for existing publishing
platforms like [WordPress][] and [Drupal][].  On the WordPress side, they are using [wp-openid][] as a foundation to
develop additional plugins that build on OpenID to bring other social functionality to WordPress powered blogs.  I am
therefore pleased to announce that wp-openid is moving under the umbrella of DiSo in an effort to allow better
integration with the other social plugins that are being developed, as well as get some other really smart people
working on the code.  I've been working with Chris on various identity projects for a while now, and have been very
impressed with Steve's ability to really grok this topic, so I have no doubt this move will be good for all involved.

Over the next week or two, I hope to get the wp-openid codebase migrated into the [DiSo subversion repository][].  The
plan is to synchronize changes made there back over to wp-plugins.org so that the wordpress.org [project
page][wp-openid] as well as plugin update notifications will continue to work as they do now.  Any existing bug reports
at wp-plugins will also be moved over to Google Code, which should provide some better features and flexibility.  If
you're interested in following the progress of wp-openid or the other DiSo projects, feel free to join the [DiSo Google
Group][].

[Steve Ivy]: https://web.archive.org/web/20071210/http://redmonk.net/archives/2007/12/05/diso/
[Chris Messina]: http://factoryjoe.com/blog/2007/12/06/oauth-10-openid-20-and-up-next-diso/
[DiSo Project]: http://www.diso-project.org/
[WordPress]: http://wordpress.org/
[Drupal]: http://drupal.org/
[wp-openid]: http://wordpress.org/extend/plugins/openid/
[DiSo subversion repository]: http://diso.googlecode.com/svn/wordpress/
[DiSo Google Group]: http://groups.google.com/group/diso-project

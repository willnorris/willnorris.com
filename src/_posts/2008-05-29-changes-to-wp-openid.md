---
title: Changes to wp-openid
wordpress_id: 227
date: 2008-05-29T17:10:47-07:00
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
- diso
---
Today I committed a few pretty substantial changes to wp-openid, changing how the OpenID flow happens.  Effectively,
I've created a new single endpoint which receives all OpenID responses, located at `/openid_consumer`.  Previously,
these response were sent to a number of different endpoints depending on whether you were simply logging in, leaving a
comment, or adding a new OpenID to your WordPress account.  Consolidating on a single endpoint has allowed me to cleanup
the wp-openid code considerably.

### Posting comments ###

OpenID is integrated into comment posting by intercepting a comment submission to see if it includes a valid OpenID.  If
it does, the user is sent to their OpenID provider to authenticate, and upon their return the comment is submitted.
Previously, the wp-openid plugin itself performed the comment submission, basically by copying the logic found in
`wp-comments-post.php`.  This introduced a number of problems, especially when using any other plugins that modify the
comment submission process such as [reCaptcha][].  Violating [DRY][] is bad, but necessary at times.  Breaking other
plugins is really bad and had to be fixed.

The current solution I'm using is to capture the comment submission POST, do the OpenID dance, and then replay the POST
(modified if necessary).  If the OpenID dance results in the commenter being authenticated as a valid WordPress user,
then the comment POST is modified to look like they were logged in all along.  If the OpenID dance results in user
attributes (via attribute exchange, sreg, hcard, foaf, whatever), then those values override what was included in the
original comment form.  If OpenID authentication fails for whatever reason, the idea is to give the user the option to
submit the post without OpenID.  This part isn't finish yet, but will be before the release.  Currently, if OpenID
authentication fails, then the comment is very likely lost unless you use other means to [save the comment][].  And of
course, if any other plugins include additional data in the original comment POST, it will be included in the replayed
POST.

### Still left to do ###

Because all of the OpenID responses are being sent to `/openid_consumer`, it's not quite as simple to display friendly
messages to the end user.  I'm may try to find a way to display error messages similar to how they look today (for
example, login errors are displayed on the wp-login.php page, etc).  Otherwise, I'll just have a somewhat generic error
pages that is specific to OpenID errors, and then include links back to whatever the user was doing.

### Need Testers ###

Right now, I'm in need of people to test this new version of the plugin to find any cases I may have overlooked.  Like I
said, the message display is in need of work, but everything is at least functional as best as I can tell.  If you're
interested in testing, checkout a copy of the latest code from the [Diso Repository][] and give it a shot.  If you have
an older version installed, you will most certainly need to disable it first, then re-enable after installing the new
version.  Otherwise, WordPress won't handle the `/openid_consumer` endpoint properly.  If you have any questions or
comments, you can leave a comment here or on the [Diso Mailing List][].  As always, I would strongly discourage you from
using this on your production WordPress installation (notice I'm not using it here).

[reCaptcha]: http://wordpress.org/extend/plugins/wp-recaptcha/
[DRY]: http://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[save the comment]: http://wordpress.org/extend/plugins/comment-saver/
[DiSo Repository]: http://diso.googlecode.com/svn/wordpress/wp-openid/trunk/
[Diso Mailing List]: http://groups.google.com/group/diso-project

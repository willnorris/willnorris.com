---
layout: post
title: wp-openid intelligent defaults
wordpress_id: 203
date: 2007-10-22T15:46:24-07:00
categories:
- identity
- technology
tags:
- openid
- wp-openid
---
Well, wp-openid is stabilizing and a 2.0 release is not far off, though there are still a few [outstanding bugs][] that
may get pushed off to version 2.1.  I think we've come to a fairly stable point, have a much cleaner product, and it
seems the community is anxious to have something they can drop into place.  I talked with [Chris][] a bit this weekend
and did a lot of thinking about the number of configurable options, default behavior, and the like.  The result is that
quite a few options have been removed from the wp-openid configuration page in favor of intelligent defaults.  Since
this is a fairly large curveball to throw in right before a release, I figured I'd give people a couple of days to
respond if they so desired.

[outstanding bugs]: http://dev.wp-plugins.org/report/9?COMPONENT=openid
[Chris]: http://factoryjoe.com/blog/

### Removed Options: ###

 - **trust root** -- I'm not sure that I would have made this configurable to begin with.  It's not something a user is
 likely to change, nor am I completely sure that it *should* be changed... the WordPress `home` option should be
 appropriate.

 - **create local accounts** -- Again, something that always seemed a little weird to me.  One of my goals in this
 release has been to simplify the plugin where at all possible and, more importantly, to make it feel and behave like
 native functionality.  In a normal WordPress installation, there are two ways for user accounts to be created - by an
 administrator in wp-admin, or by self registering at wp-register.php.  Adding OpenID to WordPress should simply enable
 an additional authentication mechanism, not change the entire account creation paradigm.  Leaving a comment and
 creating a local account are completely separate functions and should remain so, therefore I've completely removed the
 *create local accounts* options.  What **is** enabled however, is the same thing that has always existed in
 WordPress... self-registration.  If you have enabled the *anyone can register* general option, then users now have the
 choice of registering for a new account with a traditional username and password or simply by using an OpenID.  If they
 have a local account and leave a comment with their OpenID, they will be logged in to that account, but accounts will
 never be created by virtue of leaving a comment.

 - **add OpenID to login form** -- Previously, it was configurable whether you wanted the OpenID field to be added to
 the login form on wp-login.php.  It is now always displayed, and the reasoning somewhat relates to the previous option.
 Since wp-openid completely honors the "anyone can register" option, there is no harm in displaying the OpenID field any
 more than there is harm in having the username and password fields.  OpenID is simply another way to authenticate, it
 doesn't change the fundamental way in which WordPress operates.

 - **unobtrusive mode** -- for the sake of simplicity as well as striving for a consistent experience, "unobtrusive
 mode" is now the default.  If the plugin is enabled, the URL field will always be checked for a valid OpenID.  You
 still have the option of whether the plugin should modify your comment form to display the OpenID logo, or if you want
 to style it yourself.  If you **really** don't like unobtrusive mode, you can simply modify your comment form to
 include an additional input field named "openid_url".  If a field is present with that name, then it will be used for
 checking OpenIDs and the URL field will be completely left alone.  (I'll see about adding a real-world example of this
 later.)

### New Option: ###

- **automatic approval** -- this is really more of a sample implementation of a rather generic hook into the plugin.
The idea is to be able to plug in one or more trust engines that can make a decision about a particular OpenID.  The
current function simply approves all comments left by a user who authenticated with an OpenID.  This is relatively safe
for now, since I've not seen spammers using OpenIDs yet... as soon as they do, this option becomes useless.  However, it
should be relatively simple to instead hook into a simple whitelist managed within WordPress or perhaps a third-party
service like [BotBouncer][] or [Jyte][].  In fact, I have an idea for one such service rolling around in my head, which
will hopefully be integrated into a future version of the plugin.

[BotBouncer]: http://botbouncer.com/
[Jyte]: http://jyte.com/

All of this is implemented in subversion, so grab a copy from [trunk][] and see how you like it.

[trunk]: http://svn.wp-plugins.org/openid/trunk/

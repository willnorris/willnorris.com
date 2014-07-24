---
title: wp-openid - faster, stronger, better
wordpress_id: 268
date: '2008-09-16T14:17:48-07:00'
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
---
One of the primary focuses for this [next major release][] of wp-openid is stability.  While most people have had great
success with the plugin, there are a fair number that seem to have all kinds of strange problems, ranging from conflicts
with other plugins, data corruption, library issues, etc.  In order to reach the level of adoption I'd love to see, we
have to make this plugin as easy to install and run as WordPress itself.  This is certainly no easy task, but we've come
a very long way.  To this end, you'll find the following changes:

[next major release]: http://willnorris.com/2008/09/the-next-steps-with-wp-openid

### Simplified Database Structure ###

Version 1.0 of wp-openid added four new database tables and overloaded one of the comment table fields in a weird way.
Version 2.0 required only three of those four tables and added one column to the comment table to eliminate the
overloaded field.  The current development version doesn't add any columns or overload fields of existing tables, and
adds only one new table of its own, which I'm still hoping to eliminate.

The two removed tables were used to store OpenID associations and nonces, both of which are temporary data necessary to
make OpenID security actually work.  Instead of using these tables, I've opted to use an updated version of the OpenID
store used in Simon Willison's [mu-open-id][] plugin which uses the WordPress options table to store this data.  I've
updated his store to use the latest php-openid APIs as well as to reduce the potential for race conditions.

I've removed the column from the comments table that was tracking which comments were left using OpenIDs, and am instead
storing this in the postmeta table for the post the comment is associated with.  It would certainly be preferable to
have a commentmeta table, but I like this better than the previous solution.

The one remaining table is the identity table which tracks the identity URLs of each user.  I would like to store this
in the usermeta table, but because [it requires unique keys][] there's just not a real clean way to do this and keep the
plugin scalable to support large deployments.  If this is fixed in 2.7, we could theoretically eliminate any custom
database stuff in the plugin, which I'd absolutely love.

[mu-open-id]: http://wordpress.org/extend/plugins/mu-open-id/
[it requires unique keys]: http://trac.wordpress.org/ticket/7540

### Removed PEAR_LOG ###

For the time being I've removed PEAR\_LOG and am simply using error\_log() for what logging still remains.  The problem
is that most people weren't taking advantage of the logs anyway, so they were just taking up space.  I'll likely look at
making use of the WP\_DEBUG constant to allow more verbose logging when it's desired.  For now this just simplifies
things a bit, and eliminates at least one case of library conflict that was reported.


### Code Refactoring ###

Really?  More refactoring?  Didn't I just do a lot of this in the last point release?  Well yes, but more was needed...
MUCH more.  Previously, code was roughly divided based on the MVC (model, view, controller) model into store.php,
interface.php, and logic.php, respectively.  That worked for a while, but got to be pretty confusing as those individual
files became a bit unmanageable.  Instead, things are now broken into more logical segments... comments, admin panel,
logging in through wp-login.php, etc.  This seems to be a lot easier to manage and more importantly, easier to extend.

### More Hooks ###

I haven't sat down to document them all yet, but I'm adding in more hooks for other plugins to add functionality.  Want
to pull profile data from FOAF instead of sreg?  No problem, now you have a hook you can implement.  This makes
everything in the plugin much more lightweight and "loosely joined" which is always good.  All of the existing non-core
OpenID functionality (like SREG) is currently using these hooks.


### Bug Fixes ###

Though I'm not always good about replying, I generally do monitor [the conversations][] on the WordPress support forums.
I will try and put together a more exhaustive list of what bugs have been addressed, but I will simply say for now that
most of the major bugs people have reported there should be absent from the current development branch.

[the conversations]: http://wordpress.org/tags/openid

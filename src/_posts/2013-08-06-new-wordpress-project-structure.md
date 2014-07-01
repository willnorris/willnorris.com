---
layout: post
title: New WordPress project structure
wordpress_id: 1058
date: '2013-08-06T13:50:30-07:00'
categories:
- technology
tags:
- wordpress
syndication:
- https://plus.google.com/+willnorris/posts/19gDev77ofa
---
I've submitted maybe a few dozen patches to WordPress core, but must confess that I've never actually submitted tests
for those patches.  Part of the reason is that it's not entirely intuitive, given that tests are managed in a
[completely separate repository](http://unit-tests.svn.wordpress.org/).  

That's all about to change. A couple of weeks ago at WordCamp San Francisco, [Koop](http://darylkoop.com/) approached a
few of us with his idea for restructuring WordPress to have a "proper" project structure, with a real build system,
integrated tests, moving compiled artifacts out of version control, etc.  Basically, all the things that you would
expect of a modern open source project, but which WordPress has lacked for historical reasons.  Koop is a bit of a maven
of great development tools and workflows (check out his amazing [impromptu](https://github.com/Impromptu) project he
developed with [Evan Solomon](http://evansolomon.me/)), so he's absolutely the right person to be leading an effort like
this.

So suffice it to say, I'm really excited that it was announced today that this [project restructuring will happen for
the WordPress 3.7 development cycle](http://make.wordpress.org/core/2013/08/06/a-new-frontier-for-core-development/).

---
title: Best practice for commercial WordPress themes and version control
date: '2013-08-15T18:27:30-07:00'
shortlink: /b/Hn
categories:
- technology
tags:
- wordpress
- genesis
- gpl
---
<aside class="alignright outset"><figure>
  <a href="http://my.studiopress.com/themes/genesis/"><img src="genesis.png" alt="Genesis" width="200" /></a>
</figure></aside>

I've long kept my WordPress sites in version control (and if you're not doing the same, [let Mark Jaquith tell you why
you should][mj-video]), and I typically pull in themes and plugins as git submodules.  I recently purchased the [Genesis
Theme][] to use on a website I'm building for my church, and I'm trying to figure out how best to put it in version
control.

Because Genesis is a paid theme, I don't really want to put it in a public GitHub repository, and thereby allow anyone
to use it without paying.  Though to be clear, it's licensed under the GPL so I would have every right to post it
publicly, I just don't really want to.  But it also seems wasteful to use one of my few private repos on GitHub just for
this.  It'd be really great if StudioPress had a git repo that paying customers had read access to that they could use
for exactly this purpose.  They have a [GitHub account][], so maybe there's a private repo behind there and I just can't
see it?

I'm curious how others are handling this for Genesis, or any other paid WordPress plugin or theme that is also open
source.

[mj-video]: http://wordpress.tv/2013/07/28/mark-jaquith-confident-commits-delightful-deploys-2/
[Genesis Theme]: http://my.studiopress.com/themes/genesis/
[GitHub account]: https://github.com/studiopress

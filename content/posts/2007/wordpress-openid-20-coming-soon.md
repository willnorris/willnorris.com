---
title: WordPress OpenID 2.0 (coming soon?)
date: "2007-09-04T08:27:09-07:00"
aliases: [/b/3pL1, /b/3E, /p/194]
categories:
  - identity
  - technology
tags:
  - wordpress
  - microid
  - openid
  - wp-openid
---

I'm somewhat hesitant to pre-announce some of this, but maybe giving myself some kind of deadline is the only way to
actually get it done. In recent weeks I've spent some time on my [wordpress openid plugin][], which has gotten some
attention the last several months. A number of people have had trouble with WordPress 2.2.x and there were a number of
outstanding issues I'd been wanting to address, so I finally forced myself to devote some time to it. I've certainly
not finished everything yet, but it's worth noting that there's at least [one brave soul][] (and a quite notable one at
that) running it in production. There are a few notes to be aware of regarding this not-yet-released version 2.0 of the
plugin...

- version 2.0 will require WordPress 2.2 or greater. This is not likely to change, as the previous version continues
  to work in earlier versions of WordPress.
- version 2.0 currently requires PHP5. This **will** change before the final release, with the minimum PHP version
  moving to either 4.3 or 4.4.
- jQuery is used for all comment form manipulation... this means that this particular feature requires javascript, but
  should work out of the box on tons more themes.
- the latest version is available in the subversion repository 'trunk'. I'd love to get some feedback (keeping the
  above limitations in mind), but please to proceed with caution. Detailed feedback is needed and actual patches are
  certainly appreciated (though not required). My project page for the plugin had fallen horribly out of date, but I've
  updated the URLs to point to the current subversion repository and such.
- I'd like to have the plugin released around the same time as OpenID 2.0 being finalized (supposedly the first of
  October). Given how long it's taken me to get back at it thus far, this seems realistic.

[wordpress openid plugin]: /projects/wpopenid
[one brave soul]: http://kveton.com/blog/

I'll also note that I've made a project page for my [MicroID plugin][]. The plugin has actually been around for quite
some time, but somehow I missed making a page for it. This plugin builds on some ideas in existing MicroID plugins, but
goes a bit further to support a number of additional features.

[MicroID plugin]: /projects/wp-microid

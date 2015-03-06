---
title: WordPress OpenID v3.0
date: '2008-10-01T18:44:29-07:00'
shortlink: [/b/5c, /p/337]
categories:
- identity
- technology
tags:
- openid
- wp-openid
---
I'm happy to announce that version 3.0 of the WordPress OpenID plugin is [now available][].  As [previously
mentioned][], there are a lot of new features in this release:

  - **OpenID Provider** - Specific user roles can be given the capability of using the built-in OpenID provider, turning
  their author posts URL into a valid OpenID which can be used to login to other sites.  This includes support for
  OpenID 1.0 and 2.0 as well as Simple Registration 1.0, with hooks to add other OpenID extensions.

  - **OpenID Delegation** - Users authorized to use the built-in provider can optionally choose to delegate their OpenID
  to another provider instead.

  - **EAUT Mapper** - Support for the draft [Email Address to URL Transformation][eaut] protocol.  If you use an email
  address at the domain of your WordPress blog, you can now use use that email address to login wherever EAUT is
  supported.

  - **Extensibility** - the plugin now has a number of public functions and hooks that other plugins can use to
  integrate with or extend the OpenID plugin.  These are all [documented here][].

It's worth mentioning that pretty much all of the new features require that you also have the [XRDS-Simple plugin][]
installed.  There are also a number of other changes in regards to simplifying and stabilizing the plugin, than can be
read about [here][faster-stronger-better].

[now available]: http://wordpress.org/extend/plugins/openid/
[previously mentioned]: /2008/09/the-next-steps-with-wp-openid
[eaut]: http://eaut.org
[documented here]: http://wiki.diso-project.org/WordPress-OpenID
[XRDS-Simple plugin]: http://wordpress.org/extend/plugins/xrds-simple/
[faster-stronger-better]: /2008/09/wp-openid-faster-stronger-better

---
title: OSIS Interop Testing
date: '2008-03-03T11:06:51-08:00'
aliases: [/b/3f, /p/220]
categories:
- identity
- technology
tags:
- openid
- wp-openid
- diso
- osis
---
The [DiSo Project][] (well, wp-openid specifically) is participating in the [Open-Source Identity System Interop
Testing][interop-testing] happening now until the [RSA Conference][] in April.  WP-OpenID is an OpenID 1.1 and 2.0
consumer, and additionally uses the simple-registration extension.  We do not yet support attribute exchange.  Under the
covers, we use the [JanRain PHP Library][]... a version somewhere between the 2.0.1 release and the latest code in the
darcs repository.

Testers should be able to leave an authenticated comment on this page using any OpenID 1.1 or 2.0 provider.  We are
aware of a bug that prevents interop with [Vox][] OpenIDs in certain cases.  Please do limit OSIS testing to this blog
post.  If you run into trouble, you can [contact me][] directly, or the [DiSo Project List][].  Happy testing! :)

[DiSo Project]: http://diso-project.org/
[interop-testing]: http://osis.idcommons.net/wiki/I3_User-Centric_Identity_Interop_through_RSA_2008
[RSA Conference]: http://www.rsaconference.com/2008/US/home.aspx
[JanRain PHP Library]: http://openidenabled.com/php-openid/
[Vox]: http://www.vox.com/
[contact me]: /about
[DiSo Project List]: http://groups.google.com/group/diso-project

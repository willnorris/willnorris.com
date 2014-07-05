---
title: improving OpenID support
wordpress_id: 213
date: 2007-11-12T00:03:26-08:00
categories:
- identity
- technology
tags:
- openid
- yadis
- xrds
- myvidoop
- idtail
---
[Sam Alexander][] of [MyVidoop][] emailed me last week to say that they'd be rolling out some new features in regards to
OpenID support.  Sure enough, you can see on the [OpenID Support table][] that they've added support for xrds-header,
yadis-html, and most importantly, content-type.  Additionally, [IDtail][], a Korean OpenID provider, added support for
content-type as well since I last updated the table.  That's very exciting to see providers beefing up support, as
everyone really does win.  For those not aware of why I harp on content-type support so much, it is the only XRDS
discovery method that can be done in a single request.  It allows a consumer to include a header in the request and
immediately receive the XRDS document. The other two methods (using a response header, or embedding HTML code) simply
advertise the location of the document, which requires a second request to actually retrieve.  Sure it's not *that* much
more work, but every bit helps, and it reduces the risk of parser problems when using embedded HTML.

I really wish I had the time to setup some automatic detection of when provider support changes and make a blog post or
something... work that benefits the community should be recognized.


[Sam Alexander]: http://salexander.myvidoop.com/
[MyVidoop]: http://myvidoop.com/
[OpenID Support table]: http://willnorris.com/openid-support
[IDtail]: http://idtail.com/

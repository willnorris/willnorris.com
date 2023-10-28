---
title: Shibboleth 1.3 released
date: "2005-07-27T14:19:17-05:00"
aliases: [/b/3bX1, /b/w, /p/56]
categories:
  - identity
  - technology
tags:
  - ant
  - shibboleth
---

Just before going home on monday, Walter and I made the final release of [Shibboleth][] 1.3. Okay, so he did a few
things in CVS and I just kinda watched, but it was fun all the same. My last six months here at [UofM][] have been
focused on this release. I started off with some pretty cool unit test scripts, which led to the development of a nice
little embedded Tomcat class that can test pretty much an servlet. We squashed a couple of bugs due to my tests, but
the test code didn't end up going into this release. Most recently I developed new installation method that ended up
leading to some really cool methods for installing Shib plugins. Again, this led to some pretty nice [ant tasks][]
to create interactive input menus. I've thought about cleaning them up a little and submitting them
to [ant-contrib][], but haven't had the time or overwhelming desire yet.

Okay, so I didn't completely rewrite the IdP ProtocolHandler or anything near as significant, but it's been a lot of
fun working on a large distributed project, as opposed to the in-house work I normally do. Plus it's kinda neat knowing
that hundreds (thousands?) of people will be using my script to install Shibboleth. :-) Hopefully with focus now
shifting toward version 2.0, I'll be able to get my hands dirty in the program code a little more.

[shibboleth]: https://shibboleth.net
[uofm]: https://www.memphis.edu
[ant tasks]: https://git.shibboleth.net/view/?p=ant-extensions.git;a=tree
[ant-contrib]: http://ant-contrib.sf.net

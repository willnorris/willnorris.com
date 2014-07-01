---
layout: post
title: Why I'm going to Vidoop
wordpress_id: 226
date: '2008-05-15T00:52:25-07:00'
categories:
- identity
- personal
- technology
tags:
- shibboleth
- usc
- openid
- wp-openid
- diso
- vidoop
---
So it's [not][] [exactly][] [news][] [at][] [this][] point, but it is indeed true that as of today I am now employed by Vidoop.  This has been a few months in the making, so I figured I'd explain a little of why and how we got to this point.

I've been working in the Identity Management space for a few years now.  I started getting involved with the [Shibboleth][] project while at the University of Memphis.  After a year and a half, I moved to California and took a job at USC working in their middleware group.  I've spent the last two years there helping to develop and manage various parts of the Identity Management cloud including the LDAP directories, meta-directory processes, and their Shibboleth environment.  In October 2006 I formally joined the core Shibboleth development team, focusing on the Shibboleth 2.0 Identity Provider.

Meanwhile, I have also been toying with OpenID for a couple of years.  In early 2007 or so, I sort of took over development of Alan Castonguay's OpenID plugin for WordPress.  I started with a couple of new features, then worked to add support for the latest OpenID protocol, lots of code refactoring, etc.  I got to know characters like Chris Messina, Scott Kveton, and a host of others.  I continued making updates to the WordPress plugin as I had time, but it never felt like enough.  Don't get me wrong, I certainly enjoyed the work I was doing at USC and with Shibboleth... I just would have liked to have had more time for everything else as well.  Every now and then Chris or Scott would prod me about going to work at Google or somewhere to spend more time on OpenID and related technologies, but I wasn't ready to leave my work at USC.

Late last year, Chris Messina and Steve Ivy announced the DiSo Project, initially based on my updated wp-openid plugin.  Within the first week after it was announced, I sat down with Chris and Steve and we decided it would be best to officially move the wp-openid plugin under the DiSo umbrella to allow for tighter integration with the other planned work.  Then a lot happened this last February in the social networking space -- Google [announced][] the Social Graph API and [SGFoo][] really got people talking more about enriching the OpenID endpoint ([among other things][]).  Things were beginning to move pretty fast, and I felt like if I didn't jump in now then I'd end up watching all the great new developments from the sidelines.  I spent the next few months interviewing with a number of companies active in this space and made a couple of trips to San Francisco to talk with them in person.  

In the end, a dinner conversation with [Luke Sontag][] had me sold.  I was quite familiar with Vidoop and their OpenID provider, knew they had a great development team, but had always been a little skeptical of the company.  After Luke gave me a better picture of their overall vision and where technologies like DiSo fit into that picture, I knew that these guys really "get it".  They understand the importance of what DiSo is trying to do, and more importantly they are willing to do their part in making it a reality.  I love Vidoop's OpenID implementation and have been using it since before I took this job, but that's not why I did.  I took the job because the team at Vidoop know their shit, they know the kinds of problems we're up against, and they are ready to take a shot at developing some real solutions.  Well that and I really can't wait to get started working with Chris a lot more. :)


[not]: http://blog.vidoop.com/archives/111
[exactly]: http://www.readwriteweb.com/archives/messina_norris_vidoop.php
[news]: http://factoryjoe.com/blog/2008/05/13/im-joining-vidoop-to-work-on-diso-full-time/
[at]: http://kveton.com/blog/2008/05/14/solutions-more-than-technology/
[this]: http://redmonk.net/archives/2008/05/14/distributed-social-networkers/
[Shibboleth]: http://shibboleth.internet2.edu/
[announced]: http://google-code-updates.blogspot.com/2008/02/urls-are-people-too.html
[SGFoo]: http://sgfoocamp08.pbwiki.com/FrontPage
[among other things]: http://kveton.com/blog/2008/02/04/sg-foocamp-08-wrap-up/
[Luke Sontag]: http://www.vidoop.com/management.php

---
title: DiSo - One Year Later
date: '2008-12-18T12:35:13-08:00'
aliases: [/b/3xB1, /b/7Q, /p/444]
categories:
- identity
- technology
tags:
- openid
- diso
- xrds-simple
- oauth
- poco
- openstack
---
I'm not sure that anyone mentioned it really, but a couple of weeks ago was the [one][] [year][] [anniversary][] of the
[DiSo Project][].  In that time, Chris and I were both hired by [Vidoop][] to work on DiSo full-time, and Steve was
picked up by [Six Apart][].  We've also seen the entire discussion about these technologies, now dubbed the "Open
Stack", move forward tremendously.  Because of that, I've changed how I explain the DiSo Project to people.

Early in the project, it didn't seem like too many people were talking openly about the state of social networking.  We
all commonly referred to Facebook and MySpace as "silos" and "walled gardens", but few people were talking about what
the alternative would actually look like.  Now, I'm sure there were far more people working on this than I realized... I
have no doubt about that.  But for me, it seemed like we were somewhat alone out there trying to figure out what
protocols and technologies we could piece together to build a truly distributed social network.  Because of this, I
often described DiSo almost as a think-tank for developing the model and the technologies.  We were writing code as well
because we had to have a reference implementation that proved what we were talking about was possible, but I always
de-emphasized that.  Code comes and goes, dozens of implementations of these protocols will be written in different
languages for different platforms, and that's fine.  What's more important then, is the protocol itself.  That's what
DiSo was all about... gathering (and creating when necessary) the collection of protocols necessary to make this stuff
work.  At least that's how I viewed it, and explained it.

Today, the Open Stack is becoming very real.  We have agreed upon standards for [service and metadata discovery][],
[authentication][], [API access][], and [contact information][].  We have commitments and production deployments from
key players in this space including Google, Yahoo!, MySpace, AOL, Microsoft, and many others.  What seemed like a small
effort between a few individuals is now a full-scale shift of how we think about social interaction online.  Just to be
clear, I'm not trying to take credit for any of this stuff happening.  The DiSo Project has played a small role in
helping to shape and direct a few of the individual discussions, but this truly is a concerted effort between a lot of
people who see the real potential for what we're trying to do.

So where does this all leave DiSo today?  Well, it's obvious now that DiSo is not the think-tank for these
technologies... they're being developed all over the web, inside and between dozens of companies.  Instead, I now put
more emphasis on the code that we're writing, because I think we represent a key principal of this entire Open Stack
model.

The easiest example to give a layman for distributed social networking is "being able to interact with your Facebook
friends using your MySpace account."  In the future, most people will likely have accounts with one or two of the large
social networks or identity providers, and participate in the open web from there.  With these large networks and
providers at the table now, we can ensure that we develop a solution that will give users choice and the freedom to
participate from anywhere.  If this is truly going to be "user-centric", then in fact, a user shouldn't even have to
join one of these large social networks in order to participate.  Just like you can setup a server to host your own
email instead of using a provider like GMail, you should be able to run your own server which provides the various
pieces of the Open Stack.  And that's precisely where DiSo fits in -- we're working to provide the software that lets
you participate in the open web from the comfort of your own domain.  While there may be advantages to using one of the
large providers, in order for this system to be truly open, then users must always have the option of maintaining
complete control and running everything themselves.  As soon as DiSo users become second-class citizens because they are
not in one of the major social networks, then we've failed to achieve the level of openness we sought.  

Today, all of my development for DiSo is being done in PHP, and most of it specifically for [WordPress][].  Between
myself, Steve Ivy, and [Stephen Weber][], we have basic WordPress plugins for OpenID, OAuth, XRDS-Simple, rich profiles
(hCard), Activity Streams, contacts, and permissions.  Many of them have work yet to be done before they are really
stable and ready for mass consumption, but many can be seen right here on [willnorris.com][].  Six Apart is also
developing implementations on top of [Movable Type][], including the recently announced [Motion][], which provides some
real cool functionality around activity streams.

[one]: http://factoryjoe.com/blog/2007/12/06/oauth-10-openid-20-and-up-next-diso/
[year]: https://web.archive.org/web/20081218/http://redmonk.net/archives/2007/12/05/diso
[anniversary]: /2007/12/wp-openid-moving-to-diso
[DiSo Project]: http://diso-project.org/
[Vidoop]: https://web.archive.org/web/20081218/http://vidoop.com/
[Six Apart]: http://sixapart.com/
[service and metadata discovery]: https://web.archive.org/web/20081218/http://xrds-simple.net/
[authentication]: http://openid.net/
[API access]: http://oauth.net/
[contact information]: http://portablecontacts.net/
[WordPress]: http://wordpress.org/
[Stephen Weber]: http://singpolyma.net/
[willnorris.com]: /
[Movable Type]: http://www.movabletype.org/
[Motion]: http://www.movabletype.com/motion/

---
layout: post
title: Identity and Identifiers
wordpress_id: 897
date: 2010-01-01T13:23:07-08:00
categories:
- identity
- technology
tags:
- openid
- xri
- identifiers
---

<figure class="alignright">
  <img src="yearbook-photos.jpg" alt="Yearbook photo from 1994 with name listed as 'William Norris', alongside yearbook
  photo from 1995 with name listed as 'Will Norris'" width="250">
</figure>

I still remember when I made the conscious decision to go by the name "Will" instead of "William".  I was 11 or 12 years
old, and we were moving from Irving, Texas, where we had lived the last 7 years or so, to Olive Branch, Mississippi.

I don't honestly recall why I decided to go by a different name.  Name changes are common throughout history to mark a
new beginning in one's life.  In the Bible, Abram is given the name [Abraham][], Jacob is renamed [Israel][], and Saul
of Tarsus becomes [Paul][] the Apostle.  Converts to Islam will often take on a [new Islamic name][], and it is common
for monarchs and newly elected popes to take a [regnal name][] when they inherit the throne.  It is customary in many
cultures to take the surname of a spouse, or a blending of the two surnames, when one is married.  Perhaps at some level
I wanted to mark this new beginning in my life.  I was leaving behind everyone I knew, and would be starting fresh with
school, with friends... with everything.  Maybe I wanted a new name to represent this new part of my life.  Or perhaps I
was simply emulating my older brother Steven, who at the time had chosen to go by "Steve".

My immediate family was pretty good about respecting my decision.  My mom later told me that when they were picking
names for my brother and me, they went through all the possible nicknames and made sure they would be okay with them.
Occasionally my mom would slip and call me William, and I remember that I used to get really mad about that.  I don't
think my grandparents ever stopped calling me William, but after a while I got over it.

[Abraham]: http://read.ly/gen17.5.nkjv
[Israel]: http://read.ly/gen32.28.nkjv
[Paul]: http://read.ly/acts13.9.nkjv
[new Islamic name]: http://islamqa.com/en/ref/23273
[regnal name]: http://en.wikipedia.org/wiki/Regnal_name


## Identity Online

I think that I really started giving thought to my online identity when I was in college at George Tech.  When I was a
student, we were all given a "GT Number", which was simply an opaque username and email address.  Mine was *gte739u*,
and so my email address was *gte739u@prism.gatech.edu*.  Everyone had these numbers, and we all got used to them.
Papers and tests might have a place to put your name, but they **always** had a place to put your GT Number.  We weren't
names, we were numbers... we were simply `$student++`.  I've never been one for pseudonyms, maybe because I didn't have
any real issues with my name.  Up until this point, I had always used variations of my name for accounts: *wnorris*,
*wjnorris*, or *wjn730* if nothing else was available.  It was only when I no longer had that freedom to identify myself
how I chose that I became aware of how important it was to me.

It wasn't until my second or third semester that I was eligible to get an account in the College of Computing, which you
got to choose yourself.  I was quite happy when I could finally give out a decent school email address to people --
*wnorris@cc.gatech.edu*.  In a small way, I felt like [Equality 7-2521][anthem] asserting his individuality, taking the
name Prometheus.

When I began to realize the benefit of a personal homepage, I found that the domain willnorris.com was already
registered, so I settled on wirewater.org instead.  I thought it sounded cool and I liked the [definition][] in the
Jargon File.  I used that as my personal homepage as well as my main email address for several years, until I was able
to buy willnorris.com a few years later and switch everything over to that.  I had used wirewater.org so much during
those years that I decided to just keep it indefinitely.  I don't think I ever receive legitimate email on that account
anymore, but it costs so little that I don't really worry about it.  There is a competitive market for registering
".org" domains, so I can be assured that the price will always remain at a reasonable rate.  If I want to change my
registrar for whatever reason, I can easily do so.

[anthem]: http://en.wikipedia.org/wiki/Anthem_(novella)
[definition]: http://www.catb.org/jargon/html/W/wirewater.html


## A(nother) New Identity

In 2007, a new service called FreeYourID was [launched][] by GNR and Janrain.  For $11 a year, you could get a
third-level .name domain of the form *firstname*.*lastname*.name.  They would also forward email sent to
*firstname*@*lastname*.name, and later added a few other identity related services like XFN links and redirects to your
social network profiles.  The most exciting part of all this was that every FreeYourID domain was automatically an
OpenID, backed by [MyOpenID][].  It was a great example of putting individuals in control of their identity online, and
how OpenID delegation fit into that picture.  Seeing the potential for this, [I grabbed][] will.norris.name on the very
first day.  It wasn't long before I started using this new URL as my primary identifier online.  I still had
willnorris.com and continued to use it as a blog, but will.norris.name became my "identity site".  It was a simple
[landing page][] that had contact information and links to my profiles on various services.  Later I added an activity
stream, and XFN links to friends and colleagues.  More importantly though, I used it as my primary OpenID on any
services that supported it.

About a year and half (and hundreds of OpenID logins) later, I decided that I didn't want to maintain two sites.  I
[polled my friends][], and decided to migrate away from will.norris.name.  It was a very manual process of updating my
various online profiles, and presented even more [challenges with OpenID][].  But like my transition from wirewater.org
I had done several years earlier, I didn't worry too much about because the extra domain wasn't really costing me that
much.

That all changed this year when it was announced that FreeYourID was [shutting down][] after just two years of
operation, and that all accounts would be transitioned over to Key-Systems GmbH.  Never mind the fact that the new site
to manage your registration is absolutely terrible, the cost for renewal was also raised to 23.39 &#8364; (about $35).
And unlike my previous .org registration, hours of searching and phone calls have not revealed any way to transfer a
third-level .name to a different registrar (in fact, most registrars won't even transfer second-level .name domains).
My domain was scheduled to expire in a few weeks, and I would have liked to just let it go so I don't have to spend the
$35, but there's a little problem...

[launched]: http://blog.janrain.com/2007/02/openid-name-great-news.html
[MyOpenID]: http://www.myopenid.com/
[I grabbed]: http://willnorris.com/2007/02/free-your-id
[landing page]: http://web.archive.org/web/20080307175926/http://will.norris.name/
[polled my friends]: http://willnorris.com/2008/11/consolidating-domains
[challenges with OpenID]: http://willnorris.com/2008/12/challenges-in-changing-my-openid
[shutting down]: http://www.techcrunch.com/2009/07/25/freeyourid-gives-up-on-trying-to-monetize-openid/


## OpenID and Reusable Identifiers

I started the process of updating my OpenID on sites a year ago, but I've still identified three relying parties that do
not support changing your OpenID (at least not that I can find): [Disqus][], [Clickpass][], and [Pibb][].  I'm certain
there are many more, but these are the only ones that I know I have accounts with, and are currently set to use
will.norris.name.  So if I let my domain expire, and someone else buys it, they can immediately login to my account at
these three services.  This is the way OpenID is designed to work... whoever controls the domain is able to authenticate
as that URL.  So what does this mean for me?  Quite simply, it means that if I want to make sure that no one else is
able to access my account on any of these three services, I'm forced to pay $35 to renew a domain I don't use and don't
want.

Who's to blame for this?  Well, I could blame Key-Systems for tripling the price of .name accounts when they took over
the FreeYourId service.  I could blame myself for having bought the domain in the first place, instead of just sticking
with the .com I already had.  I could blame the services listed above for not supporting OpenID changes on accounts.
And I could [blame the OpenID protocol][] itself for keying on reusable identifiers, instead of using those as aliases
to unique, non-reusable identifiers like [XRI][] has been architected to do from the very beginning.  All of these would
be fair parties to place the blame on, but this post isn't about placing blame.  Instead, this post is about getting the
technologists developing and deploying this stuff to start thinking through the entire account lifecycle.

[Disqus]: http://disqus.com/
[Clickpass]: http://clickpass.com/
[Pibb]: http://pibb.com/
[blame the OpenID protocol]: http://groups.google.com/group/openid/browse_thread/thread/14be357ff51029c1/388ace21c099a221?#388ace21c099a221
[XRI]: http://en.wikipedia.org/wiki/Extensible_Resource_Identifier


## Identifiers Change

<figure class="alignright">
  <img src="wordcamp-portland-badge.jpg" alt="WordCamp Portland name badge with 'Twitter' label crossed out and replaced
  by handwritten label 'Blog URL'" width="300">
</figure>

We're living in a world where the identifiers we use to refer to people online are more important than ever.  From IRC
nicks to email addresses to Twitter handles.  These monikers are typically all that identifies us within a particular
service context, and sometimes between contexts.  This is particularly true of Twitter handles, which in recent years
have come to be seen by some as the de facto namespace for people. I was more than a little upset when my former
employer (a company focused on OpenID, no less) linked to my Twitter profile instead of my personal homepage when [they
announced][] my hiring.  And again this year at WordCamp Portland, it was disheartening to discover that the attendee
name badges had a place for your Twitter handle, but not for your blog URL.  At a [WordCamp][]!  The emphasis on our
identifiers on these services makes it increasingly difficult to change your identifier without breaking things.  But
the fact is, identifiers do change.  As our online and offline worlds collide, more and more people are moving away from
pseudonyms toward using real identities online (something Facebook had the forethought to *require* from the very
beginning).  While this is of course a personal decision, it's one that [Chris Messina][] recently undertook.
Similarly, [Tom Coates][] and [Ben Metcalfe][], two individuals who understand online identity and social media **very**
well, have considered doing the same.

I guess my point is just this.  Identity is important.  And identifiers change.  So we need to be ready for that as we
continue to build the "social web".

[they announced]: http://web.archive.org/web/20080523225546/blog.vidoop.com/archives/111
[WordCamp]: http://wordcamp.org/
[Chris Messina]: http://factoryjoe.com/blog/2009/03/02/rip-factoryjoe/
[Tom Coates]: http://twitter.com/plasticbagUK/status/6037730041
[Ben Metcalfe]: http://twitter.com/dotBen/status/6657847636

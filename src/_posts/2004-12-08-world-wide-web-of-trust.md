---
title: World Wide Web [of trust]
wordpress_id: 94
date: '2004-12-08T14:24:32-08:00'
categories:
- identity
- technology
---
So I spent Thanksgiving break with my brother and his wife in North Carolina.  The drive was long (especially for the
short couple of days that we spent there), but it was good all around.  Our last evening there, I was sitting and
talking with my sister-in-law Michelle who is a school teacher (elementary age I think).  We got to talking about the
internet and the massive amounts of useless and untrustworthy information that is out there, and how her students always
happen to use these sources for research papers and such.  I then explained to her the concept of a "web of trust" and
we just sat brainstorming for a while.  Here's a little of what we came up with...

A "web of trust" refers to the list of people (or some kind of entity) that you trust to be honest and reliable.  Not
only does it contain the people that you explicitly trust, but those that you implicitly trust based on the lists of
people on your list.  For example, if you completely trust your grandmother, and she completely trusts her old college
buddy (whom you've never met), you should still be able to trust her old college buddy to a pretty reasonable degree.
This "degree of separation" can go as far and deep as you want to take it, with the understanding that the most reliable
people are generally those that are the closest to you.  The concept is very simple and has always been around in the
real world in its most basic form.  In the computer realm, it is [presently used with PGP][] as well as a host of other
applications I'm probably not even aware of.

So what about searching the web?  What if google could use your web of trust to only return results from sources that
**you** say are reliable.  I'm not proposing an implementation of this idea, or suggesting an XML spec, but just tossing
out how ideas of what it might do.  Michelle uses the [ERIC][] database to do a lot of research, and explicitly trusts
the information she receives from there.  Because I trust Michelle *when it comes to educational research*, I also trust
the ERIC database.  Note the italicized part of that -- I trust her in regards to educational research.  I probably
would not trust her when it comes to the best fuel injector to replace the one in my car, nor would I likely trust her
recommendation for the best computer security policy.  Not that I believe she would ever lie to me, but those are not
her areas of expertise.

Just throwing out ideas here, but what if I was to assign a degree of trust as well?  For example, I might give Michelle
a 10 out 10 in the category of educational research, but only a 6 out of 10 when it comes to restaurants because she
likes a lot of food that I don't.  And how to define the degree of trust for people beyond your explicit list?  I'm not
sure, but here's on idea... say Michelle has a friend Connie whom Michelle trusts 80% regarding restaurants.  I only
trust Michelle 60%, so I might trust Connie 48% (60 * 80%).  Over time, I may decide that Connie and I have similar
tastes and I might add her to my own list with a trust of 80%.

Something like this would require a lot of effort to setup your initial web of trust and then to properly maintain it.
On top of that, I wouldn't even want to begin thinking about the nightmare of making applications "web of trust aware",
and ensuring the industry is all working with the same specification.

[presently used with PGP]: http://www.rubin.ch/pgp/weboftrust.en.html
[ERIC]: http://www.eric.ed.gov

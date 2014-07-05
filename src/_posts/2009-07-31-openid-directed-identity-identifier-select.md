---
title: Directed Identity vs Identifier Select
wordpress_id: 797
date: 2009-07-31T03:29:03-07:00
categories:
- identity
- technology
tags:
- openid
- directed identity
---
I initially started writing this post a couple months ago in response to the common misuse of the term "directed
identity" I was seeing in the OpenID community.  After reading Dirk Balfanz's guest post <cite>[Users vs. Identity
Providers in OpenID][]</cite> on [Eran Hammer-Lahav's blog][], I decided it was important to get this posted.  I think
some people who are relatively new to certain identity concepts genuinely misunderstand what is meant by "directed
identity", while others know the difference but are simply loose with the term.  In how it is most often used in the
OpenID community, the exact distinction between "directed identity" and other related concepts is not terribly important
for now.  But as we start seeing OpenID used in higher value transactions, and where higher degrees of privacy are
required, not understanding the difference can lead to great confusion.

[Users vs. Identity Providers in OpenID]: http://www.hueniverse.com/hueniverse/2009/07/users-vs-identity-providers-in-openid.html
[Eran Hammer-Lahav's blog]: http://www.hueniverse.com/

## OpenID History ##

It's important to understand a little bit of the history of OpenID.  The technology [was created in
2005][openid-sixapart] by [Brad Fitzpatrick][] while working at [Six Apart][] as a means for bloggers to leave
authenticated comments on each others blogs without having to create new accounts.  Since the target community was
bloggers, everyone already had a blog URL that they identified with, so that made for a convenient portable,
identifying, and globally unique identifier for users.  In slightly more technical terms, we would refer to these
identifiers as "omnidirectional" and "readable".

The *readability* of an identifier is exactly what you would think, and can be determined quite easily.  Does the
identifier itself give any clues as to the object it identifies?  Blog URLs were intentionally chosen as identifiers
because they were easily recognizable.  A non human-readable identifier is generally referred to as being *opaque*.  You
are not able to discern anything about the resource simply by looking at its identifier.  Take a UPC barcode for example
-- while it uniquely identifies a product in a store, the number itself is meaningless without looking it up in a
database.

The second important property of an OpenID is in being *omnidirectional*.  The direction of an identifier really just
refers to the contexts in which that identifier is used.  One of the original goals of OpenID was to have a single
portable identifier that users could use on many different sites across the web.  By contrast, a "directed" identifier
is one that can only be used in certain contexts (generally, just one).

[openid-sixapart]: http://www.sixapart.com/labs/openid/
[Brad Fitzpatrick]: http://bradfitz.com/
[Six Apart]: http://www.sixapart.com/

## New Use Cases ##

Over time, the use cases in which OpenID was applied expanded, and the technology was forced to mature.  Despite
[deliberate attempts][] NOT to include profile data in the original protocol, a new extension was soon created that
would allow [basic registration data][] like name and email address to be passed along on top of OpenID, revealing
additional data about the user.  Just as people are not one dimensional in real life, it was quickly apparent that there
was value in allowing users to maintain multiple sets of identity data, generally called "personas", that could be
presented to different websites.  I could have a "personal" persona which included different data than my "work"
persona.  If I really wanted to keep these parts of my life separated, I could even use different OpenIDs for different
sites.

I think you could say that this is where many of the current usability problems with OpenID began.  As users were having
to manage multiple identities, and sometimes not remembering their URL at all, a new mechanism was devised to make
things easier for users.  Instead of typing in their full OpenID URL at a consumer site, the user could simply enter the
URL of their **OpenID Provider**.  This would allow the consumer site to start the OpenID authentication flow and send
the user over to the right OpenID provider.  The user could then authenticate to the provider, select a particular
OpenID URL and persona if they have multiple, and the correct OpenID and data would be returned to the consumer site.
This new flow that was included in OpenID 2.0 was never really given a good name, but is [referred to in the spec][] as
"OpenID Provider driven identifier selection".  Just rolls right off the tongue doesn't it?  This is why almost no one
calls it by the right name, it's a mouthful.  But it is at least accurate -- the OpenID Provider is responsible for
having the user select the appropriate identifier for that particular transaction.

[deliberate attempts]: http://web.archive.org/web/20050716234818/http://openid.net/
[basic registration data]: http://openid.net/specs/openid-simple-registration-extension-1_0.html
[referred to in the spec]: http://openid.net/specs/openid-authentication-2_0.html#responding_to_authentication

## OpenID and Privacy ##

But there was another, perhaps more pressing, use-case that led to the development of the "identifier select" flow.
While I as a user can maintain different personas which I use at different sites, what if I want to remain completely
anonymous?  What if I don't want to reveal **anything** about myself, yet still be recognized as the same user each time
I login to a particular site with my OpenID?  Have you ever used Yahoo!'s OpenID provider by simply typing "yahoo.com"
into an OpenID field?  If you have, you may have noticed that Yahoo! gives you a choice of what OpenID URL you want to
use, including one that is completely opaque (remember talking about "readibility" earlier).  I am given two choices
when I login:

  * <http://www.flickr.com/photos/wnorris>
  * <https://me.yahoo.com/a/YN.TrVBnuIAvmAk7teEzbLW_MQ->

I can use my Flickr URL which links to my photo stream, and subsequently lots of other information about me, or I can
use this opaque URL that reveals nothing about me.  If I were to login to an OpenID enabled site using the second URL,
there would be no way to identify which Yahoo! user it belongs to, or anything else about me -- it is completely opaque.
Well... except for that fact that I've just publicly revealed what my "secret" Yahoo! OpenID URL is.  This means that
anywhere I have previously used this URL can now be linked back to me.  Not to worry, I'm pretty sure I've never used it
anywhere except for testing.

But even without me revealing what my URL is, you could begin to build a profile of me.  Without knowing anything else
but my OpenID, you could search for that URL on various websites and piece together different things I may have said or
done.  Maybe I mentioned my city on one site, and part of my name on another.  The more I use that "secret" OpenID, the
more I reveal about myself, and the less "secret" it becomes.  Even if my data on these sites was not publicly
accessible, what if multiple site owners where to start building such a profile about me behind the scenes without me
knowing?  What if multiple government websites were to build such a profile about me?  This is known as *collusion*, and
is precisely what our next and final measure is intended to protect against.


## Directed Identity ##

As we've seen above, OpenID Provider driven identifier selection does not necessarily imply anything about the
readability of the subsequent URL that is returned.  We've also seen that just because an identifier is opaque does not
necessarily guarantee our privacy online.  The final piece of our puzzle takes us right back to where this discussion
started -- directed identity.  If you recall, the "direction" of an identifier refers to the context in which it is
used.  And a *directed identifier* is one that is typically used within a single context, or with a single party.  So
when we talk about "directed identity" in terms of OpenID, we mean that a **different** OpenID URL is used for **every**
website you login to.  While this does not necessarily mean that the identifier is also opaque, it's pretty useless if
it isn't.

This concept isn't new to identity or to OpenID.  A very early identity company [Sxip provided exactly this feature][]:

> In our implementations of a Homesite, we let the user select which  persona they want to be at a new site. One of
> those is an "anonymous"  persona that will have a unique URL for each site.
>
> This lets the user decide on a site by site basis what is disclosed.
>
> -- Dick Hardt

To my knowledge, the only OpenID provider that implements true directed identity today is Google (and Sxip still, I
assume).  If there are others I'm not aware of, please leave a comment and let me know.  Remember that Yahoo! doesn't
implement directed identity because, even though they use "identifier select" along with an opaque identifier, that
identifier is **not** unique for each website you login to.

[Sxip provided exactly this feature]: http://lists.danga.com/pipermail/yadis/2006-August/002778.html

## Recap and Why this Matters ##

So to recap the three basic terms, and the way in which they build upon each other:

  * *OpenID Provider driven identifier selection* (or *identifier select* for short) refers to the ability for a user to
  enter the URL of their OpenID Provider into an OpenID field rather than their personal OpenID URL.  This is a feature
  of OpenID 2.0, and will result in an actual user OpenID URL being returned to the consuming site.  This says nothing
  about the nature of that URL, and can be implemented simply as a user convenience.

  * An *opaque* URL is one that does not itself reveal any information about the user it identifies.  Any practical use
  of opaque identifiers necessitates the use of identifier select, since it is not realistic to have a user remember and
  enter a long and meaningless OpenID URL.  Opaque identifiers protect user privacy.

  * A *directed identifier* is an opaque identifier which is unique for a given site.  The same OpenID URL is
  continually returned to a given consuming site, but no two consuming sites are ever given the same OpenID URL for a
  user.  Directed identity protects against collusion.

Today, identity data is being thrown around pretty loosely without much regard to how it is being used, but that is
quickly changing.  Slowly but surely, we are seeing reputable companies involved in high value transactions express
interest in what federated identity can offer.  Remember how much buzz the administration of then President Elect Obama
created when [they implemented OpenID][] via Intense Debate on Change.gov?  Just look at last week's [announcement from
the White House][] regarding HTTP cookie policies on federal websites.  Now tell me they are not going to be looking at
directed identity if and when they were ever to implement federated identity for real.  On that day, it will become
**very** important that the community (and especially OpenID Providers) understand the difference between "identifier
select" and "directed identity" if they want to play ball with the government.

[they implemented OpenID]: http://www.readwriteweb.com/archives/barack_obamas_changegov_adds_o.php
[announcement from the White House]: http://www.whitehouse.gov/blog/Federal-Websites-Cookie-Policy/

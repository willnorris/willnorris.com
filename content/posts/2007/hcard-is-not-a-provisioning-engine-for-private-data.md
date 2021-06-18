---
title: hCard is not a provisioning engine (for private data)
date: '2007-11-05T16:29:53-08:00'
aliases: [/b/3qP1, /b/3T, /p/207]
categories:
- identity
- technology
tags:
- shibboleth
- openid
- microformats
- openid-ax
- saml
- hcard
---
Last week I wrote about how hCard is much more appropriate than OpenID for [the provisioning use-case][provisioning] and
Chris [continued that discussion][hcard-sreg], questioning why we need SREG and Attribute Exchange when hCard works just
fine.

> So the question is, when OpenID is clearly a player in the future and part of that promise is about
> making things easier, more consistent and more citizen-centric, why would we go and introduce a **whole
> new format** for representing person-detail-data when a perfectly good one already exists and is so
> widely supported?

While I certainly agree with Chris that hCard has a role to play in the new world of online identity, I don't want SREG
or AX to be dismissed too quickly.  I don't believe he was suggesting that hCard would replace SREG/AX in all use cases,
but I want to labor this point just a little bit so that others are not confused.

[provisioning]: /2007/10/openid-is-not-a-provisioning-engine
[hcard-sreg]: http://factoryjoe.com/blog/2007/11/01/hcard-for-openid-simple-registration-and-attribute-exchange/

There is one huge benefit to SREG and AX that hCard doesn't (and by it's nature, can't) address... releasing different
attributes to different relying parties.  This can take a number of forms.  The one most commonly supported in OpenID
providers today is the idea of personas - a complete set of attribute values that reflect your online identity within a
particular context.  You may have a "work" persona that includes your formal name, work email address and website, etc.
Separately, you may have a "personal" persona that has some informal nickname along with a personal email address,
website. etc.  Separate still, you may have an "anonymous" persona that includes little (or fabricated) data about
yourself.  Depending on which relying party you are authenticating to, you may use a particular persona.

Varying this slightly, one can imagine a use case that will be become increasingly important as OpenID continues to
expand.  hCard is suitable for public attributes I want to post for the world to see, but what about not-so-public data?
It will likely be some time before we start transferring credit card numbers over OpenID+AX, but I have no doubt it will
happen eventually (as nervous as that makes even me).  But even before then, I can imagine a host of data that I may
need or want to provide to a relying party, but do not want to publish in my public hCard.  As I included in my [OpenID
provider wish-list][wish-list], OpenID providers will need to provide the tools to manage the policies controlling this
release of data, a feature that has the potential to really differentiate one provider from the rest of the pack.  This
fine-grained level of control has always been a core requirement for the [Shibboleth][] SAML Identity provider, and I
would argue that the (currently beta) Shibboleth 2.0 IdP has one of the most powerful and flexible (and admittedly,
verbose) [filtering engines][] of its kind anywhere.

[wish-list]: /2007/03/openid-provider-wish-list
[Shibboleth]: http://shibboleth.internet2.edu/
[filtering engines]: https://spaces.internet2.edu/display/SHIB2/AFPAttributeFilterPolicy

So there are really two issues at play in Chris's question, that of the data format and separately, the mechanism for
conveying that data.  I haven't really addressed the issue of the data format, because I agree with Chris in principal
at least.  His [comparison table][] of attribute names shows a very clear overlap between the different methods, and
perhaps it would be useful to work to consolidate some of that.  But the mechanisms for making that data available
address different, and equally valid, use cases and each play a role in making all of this stuff work.

[comparison table]: http://microformats.org/wiki/attribute-exchange

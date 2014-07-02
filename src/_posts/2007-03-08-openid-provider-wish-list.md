---
layout: post
title: OpenID provider wish-list
wordpress_id: 179
date: 2007-03-08T01:35:04-08:00
categories:
- identity
- technology
tags:
- shibboleth
- openid
- myopenid
- prooveme
---
A week or so ago, Nic Ferrier of [prooveme][] contacted me about a [previous post][] I made that referenced prooveme.com
in regards to strong authentication.  He ended the email,

> *We'd* like to be your provider of choice - so do tell us what you want to see.

I had been meaning to post a reply to this for several days, but now with Martin Atkins's [Relying Party Best
Practices][], it seems like an ideal time to discuss this.  Here is a short list of items I came up with that I'd like
to see in an OpenID provider, roughly in priority order.  A number of them are already addressed by one or more existing
providers, while several are not.

- **SSL** -- not having SSL is an immediate deal breaker.  If my password or my personal information is going over the
wire, it sure as hell better be over an encrypted connection.

- **Strong Authentication** -- this was the primary topic of the aforementioned post, and more details can be found
there.  The main point, however, is that I'd like some kind of stronger authentication mechanism than just a single
username and password.  As more OpenID enabled services come online, the more important it will become to have a
stronger mechanism to identify the user.  This might be in the form of an client SSL certificate like [prooveme][] and
[certifi.ca][] use, or a one-time-use password like [iamdentity][].

- **Auditing** -- It looks like a number of providers allow you to see and modify the list of all the relying parties
you trust, and while that's a good start, this could (and for some use cases, should) be expanded much beyond that.  I'd
like to see a log of every time I authenticated to a particular relying party, and perhaps some additional information
about that transaction such as IP address.  This could potentially help identify if and when my account has been
compromised.  When attributes are released via simple-reg I want to see that, and it might also be useful to know
exactly what values were released during a given transaction.  I may have updated an attribute a number of times since
it was released to that relying party months ago, and I might like to know what values were sent to them.

- **Real attribute release policies** -- Perhaps I'm just spoiled from working on [Shibboleth][] for several years, but
I would really like fine grained control over what attributes are delivered to a given relying party.  MyOpenID's
"persona" feature definitely comes pretty close on this, but I believe it is still an "all or nothing" choice -- I can't
approve the release of only a subset of the attributes an RP requested.

- **Modify attribute value for the current transaction** -- This somewhat carries over from the previous item.  MyOpenID
has the ability to edit your persona just before you send it to the relying party (although this is a bit broken,
because it completely breaks the OpenID flow if you do so).  In addition to making permanent modifications to a persona,
I'd like to be able to modify the values that are released for the given transaction only.  For example, I may want to
use my main persona for this relying party, but just change my email address to something different.

- **Identity Linking** -- This is certainly in the running for being the latest "holy grail" of OpenID... the ability to
link multiple OpenIDs in such a way that relying parties understand that they are equivalent.  I'm not even sure if the
provider is the right party to address this problem (I imagine it will require work on both sides) but if someone is
able to come up with a compelling solution, that would be very attractive.

So there's a few things I was able to think of in a short amount of time, but I'm sure I overlooked a bunch.  I'm
curious to know what kind of features others would like to see in an OpenID provider.  Don't limit yourself just to what
you think is realistic or easy to implement in the short term... think bigger than that, this is a wish-list after all.

[prooveme]: http://prooveme.com
[previous post]: http://willnorris.com/2007/02/strong-authentication-and-emailing-passwords
[Relying Party Best Practices]: http://openid.net/wiki/index.php/Relying_Party_Best_Practices
[certifi.ca]: http://certifi.ca
[iamdentity]: http://iamdentity.com
[Shibboleth]: http://shibboleth.internet2.edu

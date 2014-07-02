---
layout: post
title: A New Kind of OpenID Proxy
wordpress_id: 840
date: 2009-08-03T12:21:57-07:00
categories:
- identity
- technology
tags:
- privacy
- openid
- directed identity
- proxy
---
After writing last weeks post on [directed identity][], I really got to thinking on the topic a little more.  One of the
things that has always bothered me about the prospect of sites **requiring** the use of directed identity, is that it
means I can no longer use my self-hosted OpenID to login.  Currently, I have the [WordPress OpenID plugin][] installed,
and I use it as [my sole OpenID provider][].  While the plugin does support identifier select (mainly for blogs which
have multiple authors), it does not support directed identity.  But even if it did, it wouldn't make much sense... an
OpenID URL of the form "http://willnorris.com/openid/9eb4d59c1d488a4" doesn't do a very good job of masking who it
belongs to.  No matter how opaque the path, the URL is still rooted at the authority "willnorris.com" which means it can
belong to only one person -- me.  

So what am I to do?  The most obvious answer is to simply use one of the larger hosted OpenID providers that support
such a feature, like Google.  But I have some real problems with that, both philosophically and practically.
Fortunately, I think I may also have a better solution.

[directed identity]: http://willnorris.com/2009/08/best-practices-with-directed-identity
[WordPress OpenID plugin]: http://wordpress.org/extend/plugins/openid/
[my sole OpenID provider]: http://willnorris.com/wordpress/index.php/openid/server


## Maintaining Control ##

My first knee-jerk reaction to being forced to use an OpenID provider like Google is a purely philosophical argument.
If the whole point of OpenID was to create a completely distributed identity ecosystem, then isn't this a huge step
backwards if we're no longer allowing for self-hosted OpenIDs in certain cases?  While I think it's an unfortunate
situation, it is a completely understandable one.  There really is no good way to maintain the privacy of the user, as I
demonstrated above.  Remember that OpenID, unlike SAML, was never designed to mask the identity of the user... quite the
opposite, in fact!  When you take any technology and try to apply it in situations it was not originally intended for,
you have to be prepared for the reality that it's not going to fit quite as nicely as one might like.

So philosophical arguments aside (as valid as they may be), what other reasons might one have for not wanting to use a
third-party OpenID provider?  One of the biggest in my mind is privacy.  Have you ever looked at the "Visited Sites"
page on [MyOpenID][] or a similar provider?  It shows which sites you've logged into, how many times, when the last
login was, etc.  Pretty neat data to have at your disposal as a user, right?  But also potentially pretty scary data for
JanRain to have for every user.  Now, I'm not suggesting that JanRain or any other OpenID provider purge this data...
it's actually a really valuable feature and I think it's in the user's best interest to have access to it.  But let's
remember what started this conversation... directed identity.

<figure class="aligncenter">
  <img src="myopenid-visited-sites.png" alt="MyOpenID list of visited sites" width="638" height="139" class="border">
  <figcaption>MyOpenID's Visited Sites page</figcaption>
</figure>

While directed identity can be used for everyday logins, it really shines when maintaining user privacy becomes very
important.  What if I'm a whistleblower who wants to report unsafe business practices to the government?  What if I
participate in some taboo subject matter online that I want to keep hidden from family and friends.  What if I am a
political dissident, and revelation of my identity could result in imprisonment or even death?  What if I simply want to
exercise my constitutional right to privacy?  While some of these are rather exotic examples, they illustrate my point
pretty well.  There are cases where privacy is truly important.  As I demonstrated in my last post on [directed identity
implementations][], there are algorithms that can adequately protect the identity of the user from the site they are
logging in to.  But remember, those algorithms do absolutely nothing for protecting my identity from my identity
provider.  If privacy is my goal, then why would I trust Google or JanRain with my daily activities any more than anyone
else?

In Andy Oram's post on this topic <cite>[Shortening cookies: Using OpenID to improve government privacy
online][shortening cookies]</cite> and his follow-up <cite>[Privacy and open government: conversations with EPIC and
others about OpenID][privacy and government]</cite>, he talks about the possibility of the federal government running an
OpenID provider which is used to authenticate users to other government websites and services.  First of all, I don't
think the government needs to stand up yet another OpenID provider.  The private sector has done a pretty good job so
far of making sure people have portable identifiers, whether they actually realize it or not.  But more importantly, I
simply don't trust the government to [maintain and respect my privacy][].  In discussing whether the government is
actually the right party to run this service, Oram mentions:

> The problem is whether visitors can trust any particular server 1) to stay up, 2) not to go out of business, 3) not to
> leak information, 4) not to abuse the information for private gain, and 5) not to cave in to government pressure and
> release information outside of the scope of the law.

It's really the last point that bothers me.  This is a system that, by design, holds the links between the private
identities of citizens, and the anonymous identifiers they are using to communicate with the government.  Not only are
these individuals potentially screwed if the system is broken into, but also if some judge decides there is justifiable
cause for revealing these identities.  Privacy is a matter of policy, rather than technical design.  This is not
sufficient.  I think we need a system that protects user privacy as a technical feature, not simply as a policy
decision.  We need a system that couldn't reveal the identity of a user even if the Chief Justice himself were to order
it.

[MyOpenID]: http://myopenid.com/
[directed identity implementations]: http://willnorris.com/2009/08/best-practices-with-directed-identity
[shortening cookies]: http://broadcast.oreilly.com/2009/07/shortening-cookies-using-openi.html
[privacy and government]: http://radar.oreilly.com/2009/08/privacy-and-open-government-co.html
[maintain and respect my privacy]: http://www.google.com/search?q=warrantless+wiretapping


## OpenID Proxy ##

My idea for such a system is actually very simple in its design.  At a high level, it's not unlike [Emailtoid][],
JanRain's [RPX][], or the never really launched [Vidoop Connect][].  It is an OpenID proxy that stands between the
actual relying party and OpenID provider, so that the two never actually communicate directly to one another.  The proxy
faces both parties and therefore implements both sides of OpenID -- it provides an OpenID Provider implementing directed
identity which communicates with the actual relying party, and it also implements an OpenID relying party which
communicates with the actual OpenID provider.  Let's look at the basic user flow...

Our user, Alice, goes to OSHA.gov to report the unsafe work environments at her job.  Fearing retribution from her
employer if they were to find out she reported them, Alice wants to remain anonymous in her communication with OSHA.
When logging in to OSHA's whistleblower site, Alice enters the URL of an OpenID proxy, "proxy.example.net".  This proxy
could be run by the government itself, a private citizen's rights organization, it doesn't really matter.  OSHA's OpenID
relying party communicates with the OpenID Proxy's server, and begins an identifier select OpenID flow, which results in
Alice being sent over to the proxy.  Now, instead of having to create a new account at the proxy, Alice uses her real
OpenID URL, "alice.example.org" to login.  After successfully authenticating, the OpenID proxy uses a hashing algorithm
to generate an opaque URL for Alice, and returns that identifier back to OSHA.  So Alice was able to use her own
self-hosted OpenID URL in a privacy preserving manner -- OSHA has no way of identifying her based on the resulting
directed identity issued by the proxy.

But what about the proxy itself?  As we've already mentioned, the OpenID provider which **generates** the directed
identity is able to determine the user the identifier belongs to, even if a secret salt was used as part of the hashing
algorithm.  In order to protect Alice's identity from even the OpenID proxy, we need to do two more things.  Let's look
again at our hashing algorithm for generating directed identities:

    md5( username + openid_provider + relying_party + secret_salt )

For OpenID, that username would simply be Alice's OpenID, "alice.example.org".  If subpoenaed, the OpenID proxy would be
able to determine whether a given directed identity indeed belonged to "alice.example.org" simply be running it through
the above algorithm.  Remember that the secret salt is what prevents the relying party from using this same technique to
identify the user?  Well what if we add a little secret salt of our own to the username portion of the algorithm?  What
if we replaced "username" with "username + user_salt"?  That way, even the proxy itself wouldn't be able to replay the
hashing algorithm without actually knowing the correct salt value to plug in there.

Now, before I talk about the user salt itself, there is one caveat that must be pointed out... this is the second of the
"two more things" I mentioned above.  The user salt is not exactly secret, because it must be provided to the OpenID
Proxy so that it can be used to generate the directed identifier.  The thing that protects user privacy is that **the
proxy must not record the value of the user salt or the user OpenID**.  It can't log the values anywhere and it can't
store them in a database.  It must use the OpenID and salt to generate the directed identifier, and then get rid of
them.  Otherwise, it would still be technically possible to trace the identifier back to the actual user.  This would be
one reason why it might make sense for such a system to be run by a citizen's rights organization that is generally more
trusted to do everything possible to protect user privacy.  It's also worth noting that nothing in this architecture
suggests that there would be only one OpenID proxy... there can, and should, be several proxies for user's to choose
from, all using these same (or similar) techniques.

[Emailtoid]: http://emailtoid.net/
[RPX]: https://rpxnow.com/
[Vidoop Connect]: http://vidoop.com/vidoopconnect/


## Adding user salt ##

There are two methods I can think of to add the user salt mentioned above.  The first is certainly the most
straight-forward, but also a little more difficult for some users.  If Alice's OpenID provider were to itself return a
directed identity to the OpenID proxy, that would be sufficient for salting the proxy's hashing algorithm.  So long as
that directed identity is not being stored by the proxy, there would be no way to trace back any identifiers the proxy
generates.  It's worth noting that in this case, a self-hosted directed identity actually would be sufficient.  Remember
earlier when I mentioned that the URL "http://willnorris.com/openid/9eb4d59c1d488a4" wouldn't do much for protecting my
identity?  That is true, but for the purposes of salting the proxy's hashing algorithm, it would work just fine.  But
this of course still requires that the user have access to an OpenID provider that supports directed identity.  The
WordPress OpenID plugin which I use does not currently, so this wouldn't work for me.

The second method of providing a user salt requires a slight modification to the OpenID provider, but should be a bit
easier to do.  The salt could be provided separately by the OpenID provider as an extension on the OpenID transaction
itself.  To make things easier, it could simply be a new Attribute Exchange attribute.  No need for new OpenID
extensions, just a new attribute which represents a "user salt".  The OpenID proxy would then combine the user's OpenID
together with the salt value, and use that to generate the final directed identity that is returned to the relying
party.  If the proxy were subpoenaed to verify if a given directed identifier belonged to "alice.example.org", it would
be unable to do so without also knowing the user salt.  And as long as the salt was not being recorded anywhere, the
proxy would be completely incapable of verifying the user that an opaque identifier belonged to.

So what about using some other things as the user salt?  How about the association used in the OpenID transaction?
Remember that the point is still for Alice to be able to login to OSHA.gov over time and be recognized as the same
(possibly anonymous) user.  In order for this to work, she must return with the same directed identifier from the OpenID
proxy each time.  And in order for the proxy to ensure that it generates the same directed identifier, it must use the
same input values.  While an OpenID association **is** intended to be relatively long-lived, it can, and often does,
change over time.  When this happens, the proxy would end up generating a new directed identifier for Alice, and she
would no longer appear as the same user at OSHA.gov.


## Some practical matters ##

So there are some additional practical matters that I think must be considered for this solution to truly work.  First
of all, *what happens if the proxy's secret salt is compromised?*  This would certainly be a bad thing, but not quite as
bad as it would be in a standard directed identity situation.  Remember in our final algorithm from [last time][directed
identity implementations], the secret salt was the one and only key that protected the privacy of the user in a
generated directed identifier.  If the salt is compromised by a party, they could then brute-force the hashing algorithm
and identify the true identity of a user associated with a directed identifier.  But remember that one of the goals of
the proxy is to protect the true identity of the user from even the proxy itself... that's why we added the user salt.
So even if the secret salt of the proxy were compromised, an attacker would be unable to identify the user associated
with a given directed identifier.  Additionally, if the proxy were aware of the compromised salt, they could transition
over to a new secret salt using the same method I mentioned last time that USC uses to update relying parties of new
USCID values.  The proxy would simply inform the relying party that user X, identified by this opaque identifier, was
previously identified by this other opaque identifier, and their records should be updated.  Nothing about the user
herself is revealed, only the transition from one opaque identifier to another.

*What if the user still wants to maintain different personas for different relying parties?*  For example, what if Alice
wants to reveal the name of her employer via an AX attribute when communicating with OSHA.gov, but not when
communicating with WhiteHouse.gov?  Technically, the solution is pretty simple, but it's not as user friendly as I would
like.  The OpenID proxy would simply need to embed the trust root of the **actual** relying party inside its own trust
root that it presents to Alice's OpenID Provider.  Part of the OpenID flow is that a provider prompts the user if they
trust the site that is asking them to authenticate, and additionally if they want to release any additional attributes
to the party.  The relying party is identified using a URL known as the "trust root".  So a user may see a prompt
(borrowing from MyOpenID's language) along the lines of:

> You are signing in to **proxy.example.net/** as **http://alice.example.org/**.

Traditionally, the decision that Alice makes here is recorded so that she is not prompted each time she logs in.  So if
she wants to make a different decision depending on which site she is logging in to, then the OpenID proxy would need to
change its trust root.  One example might result in a prompt that looks like:

> You are signing in to **proxy.example.net/site/osha.gov** as **http://alice.example.org/**.

This would record her decision specifically for "OSHA.gov via proxy.example.net".  Using this method, she could easily
release different attributes for different relying parties, without any changes to her OpenID provider whatsoever.
While I don't like the idea of the user having to parse apart that URL to figure out what it means, it's at least
workable.  As a long term solution, a new OpenID extension could be defined which provides a more human friendly version
of the trust root which explains to the user more clearly where her data is going.  In fact, I think that has already
been proposed and being worked on.


## Proof of concept ##

Though the explanation of the concept ends up being a little wordy, the design itself is actually quite simple.  Because
of the strict requirement that identifiers **not** be stored, there is actually not much to it.  The only database
storage would be for OpenID associations and nonces... everything else is calculated in real time.  I'll be working with
[Michael Richardson][] this week to be build a working implementation to show how it would work.  I'm also beginning
conversations with [EPIC][] to help advise them on their recommendations to OMB regarding federal website cookie
policies.  I welcome any questions or comments on this approach to privacy with OpenID.  Some of the specifics I just
really thought about this last weekend, so I may be overlooking a few things.  But the overall architecture is nothing
that hasn't been done before, and has a strong, proven track record.

[Michael Richardson]: http://mtrichardson.com/
[EPIC]: http://epic.org/

---
layout: post
title: OpenID is not a provisioning engine
wordpress_id: 206
date: '2007-10-30T01:11:46-07:00'
categories:
- identity
- technology
tags:
- shibboleth
- ldap
- openid
- microformats
- openid-ax
- saml
- hcard
- provisioning
---
In talking about the future possibilities of OpenID 2.0 and the [Attribute Exchange][ax] extension, [James Henstridge][]
mentions,

> Imagine being able to update your shipping address in one place when you move house and having all the online
> retailers you use receive the updated address immediately. Or changing your email address and having all the bugzilla
> instances you use pick up the new address instantly (perhaps requiring you to verify the new address first, of
> course).

[ax]: http://openid.net/specs/openid-attribute-exchange-1_0-07.html
[James Henstridge]: http://blogs.gnome.org/jamesh/2007/10/23/openid-20/

While I agree this kind of experience would be very neat, it is not a use case for OpenID nor the Attribute Exchange
extension.<!--more-->  I am not surprised to hear someone say this, as this is a common point of confusion here at USC
in regards to [Shibboleth][].  When it comes to attribute delivery, both OpenID and SAML are primarily designed to
provide data *at the time of login* [^1].  So this means that if a user never logs in to your service, you never get any
data about them.  And if a user's data changes since their last login, you don't find out about until they *next* login,
since that is the only time attribute delivery occurs.  It is also important to note that you are typically only getting
data about the user that is logging in, no one else.  You can't treat an OpenID provider as a lookup service to get data
about some other user.

[Shibboleth]: http://shibboleth.internet2.edu/
[^1]: SAML is actually a little more flexible here, but it's not the common use case

So how does a relying party update their data without waiting on the user to login again?  One option is to have the
data pushed to each service using some kind of messaging hub.  There is a whole market for enterprise messaging complete
with its own set of acronyms like [ESB][], [EMS][], [EAI][], and many many more.  I'm particularly interested in a
project developed by a colleague of mine in Sweden called [JEvent][], which uses the XMPP [Publish-Subscribe][pubsub]
protocol to deliver these types of messages using a standard XMPP server in the middle.  Your Jabber messaging window
becomes your console. :)

[ESB]: http://en.wikipedia.org/wiki/Enterprise_service_bus
[EMS]: http://en.wikipedia.org/wiki/Enterprise_messaging_system
[EAI]: http://en.wikipedia.org/wiki/Enterprise_application_integration
[JEvent]: http://devel.it.su.se/pub/jsp/polopoly.jsp?d=1227
[pubsub]: http://www.xmpp.org/extensions/xep-0060.html

The other method of getting at user data is for each relying party to pull the data.  This is the model we use at USC,
where that mechanism for pulling data is LDAP.  A number of services on campus use LDAP to address both use cases
mentioned above -- refreshing data about users, as well as looking up data about someone other than the user who logged
in.  So what's the equivalent in the decentralized OpenID world?  Well honestly there isn't anything just yet but we
have a good foundation.  Thanks to [microformats][] like [hCard][], you can publish your data in a standard,
machine-parsable format that your online retailers or bugzilla instances could watch periodically.  When you update your
hCard on your homepage they can respond in kind, perhaps by immediately updating their databases or sending you a
confirmation email of the change.  Right now all of this data is decentralized, published on personal blogs and
webpages.  I don't argue that this data should certainly be under individual control, but it puts an awful large burden
on the individual service providers to do all that spidering.  I don't know what the answer is, but I've been thinking
about an hCard crawler with an LDAP front-end as a simple place to start.  Configure Apple AddressBook or Outlook to use
LDAP, and you're off and running.

[microformats]: http://microformats.org/
[hCard]: http://microformats.org/wiki/hcard

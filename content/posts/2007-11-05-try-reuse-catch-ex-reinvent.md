---
title: try { reuse; } catch (Ex) { reinvent; }
date: '2007-11-05T20:49:45-08:00'
shortlink: [/b/3U, /p/208]
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
---
Earlier today, I wrote about the [limitations of hCard][] primarily in regards to private data.  After talking with
[Chris][] briefly and then reading [Tantek's thoughts][] on the topic, it clicked with me.  I wouldn't normally make two
posts so close together about such similar topics, but I realize now these really are two different topics.  The
concerns about hCard and privacy are very real and certainly worth consideration, but what Chris was really getting at
was attribute naming.

[limitations of hCard]: /2007/11/hcard-is-not-a-provisioning-engine-for-private-data
[Chris]: http://factoryjoe.com/blog/2007/11/01/hcard-for-openid-simple-registration-and-attribute-exchange/
[Tantek's thoughts]: http://tantek.com/log/2007/11.html#d02t2318

### OpenID attributes ###

The OpenID [Simple Registration Extension][sreg] was designed, much like OpenID itself, to address a very specific use
case -- providing the most common data requested when registering at a new website (things like name, email, gender,
etc).  It defines a fixed list of nine attributes that can be provided, and it works well for what it does, but it's a
bit rigid when one tries to do anything more with it.  Even before the final draft of the SREG extension had been
published, work was already being done on a more flexible extension for [attribute exchange][].  This new extension
defined only a mechanism for transferring attributes, but didn't prescribe a fixed list of attributes.  But in order to
be at all useful, two parties must be assured that they are both talking about the same attribute.  Therefore an
attribute registry was established at [axschema.org][] and a number of attributes (formatted as URLs) have [already been
defined][] which will likely be useful in common scenarios.

[sreg]: http://openid.net/specs/openid-simple-registration-extension-1_0.html
[attribute exchange]: http://openid.net/specs/openid-attribute-exchange-1_0-07.html
[axschema.org]: http://www.axschema.org/
[already been defined]: http://www.axschema.org/types/


### Attributes in Higher Education ###

Developed in the early 90s at the University of Michigan, LDAP quickly grew favor with higher education institutions to
replace heavier-weight directory protocols.  A number of LDAP object classes were defined to provide attributes deemed
useful in certain contexts, for example [rfc2798][] defined `inetOrgPerson` which addressed the needs of "Internet and
Intranet directory service deployments".  Higher Education had its own unique needs, so in 2001 Internet2 published the
first version of the [eduPerson Object Class][].  If (and only if) institutions required additional attributes beyond
those provided by some already published object class, it was common practice to define a local object class to house
those attributes.

Within a few years, the SAML specification was published and [Shibboleth][] began finding its way onto many college
campuses.  Though not required by SAML, Shibboleth recommended the use of URIs for SAML attribute names, and
subsequently established a [collection of URN values][] to represent common LDAP attributes, including those defined in
the eduPerson object class.  As before, if campuses needed to include additional attributes in a SAML assertion, they
were defined within a local namespace.  Today, it is very common to see a mix of attributes at USC including those
defined by Internet2:

 - `urn:mace:dir:attribute-def:displayName`
 - `urn:mace:dir:attribute-def:eduPersonAffiliation`

as well as those we have defined locally at USC:

 - `urn:mace:usc.edu:gds:attribute-def:uscUSCID`
 - `urn:mace:usc.edu:gds:attribute-def:uscStudentDegreeProgram`

[eduperson Object Class]: http://www.educause.edu/eduperson/
[rfc2798]: http://tools.ietf.org/html/rfc2798
[Shibboleth]: http://shibboleth.internet2.edu/
[collection of URN values]: http://www.google.com/search?q=cache:http://middleware.internet2.edu/dir/docs/internet2-mace-dir-saml-attributes-200604.pdf


### Applying Precedence ###

No one is pretending that the fixed set of attributes defined in [rfc2426][] is the definitive list of attributes that
could possibly be useful in OpenID, no more than eduPerson was the exhaustive list of attributes for every university
that used it.  All that is being questioned is why did Attribute Exchange redefine all that was already established in
vCard?  I would strongly support Tantek's third proposal of hosting the official hCard XMDP profile at
`http://microformats.org/profile/hcard`, so that AX can leverage the hCard specification while maintaining URL based
attribute names.  And given that it appears as though [no one is currently supporting AX][openid-support], **now** is
the time to make this change.

[rfc2426]: http://tools.ietf.org/html/rfc2426
[openid-support]: /openid-support

(For the non-technical, the title roughly reads "First try to reuse.  Only if that doesn't work, then reinvent.")

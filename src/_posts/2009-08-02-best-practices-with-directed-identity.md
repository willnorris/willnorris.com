---
title: Best Practices with Directed Identity
wordpress_id: 831
date: '2009-08-02T17:27:43-07:00'
categories:
- identity
- technology
tags:
- shibboleth
- openid
- saml
- directed identity
---
Given the current discussion happening right now around federal website [cookie policies][], and the good response I got
from my [last post][], I wanted to continue talking about directed identity a little bit.  In this post, I want to talk
about how directed identity has actually been implemented in projects I've been involved with, and what lessons can be
learned from that.

[cookie policies]: http://blog.ostp.gov/2009/07/24/cookiepolicy/
[last post]: http://willnorris.com/2009/07/openid-directed-identity-identifier-select


## Shibboleth and SAML ##

[Shibboleth][] is an open source web single sign-on product which is very popular with universities around the world.
It is primarily an implementation of the [Security Assertion Markup Language][SAML] (SAML), but supports other identity
protocols as well.  SAML v2 defines a specific type of identifier that may be used to identify a user within a
transaction known as a *Persistent Identifier*.  The name itself does not convey it's full meaning, but it is defined as
"a persistent opaque identifier for a principal that is specific to an identity provider and a service provider or
affiliation of service providers."  This is SAML's *directed identity*.

Shibboleth's implementation of persistent identifiers has matured a bit over the years, but the main algorithm remains
the same.  At it's simplest, the identifier is simply a hash of three things: an identifier for the user, an identifier
for the identity provider, and an identifier for the relying party.  Using md5 as our hashing algorithm, and using a few
made up values, this would look like:

    md5( "jsmith" + "http://idp.example.com/" + "http://sp.example.com/" ) = 
        2f6bc52c7527747eff263f4183c7f402

When a relying party receives the string "2f6bc52c7527747eff263f4183c7f402", it is completely opaque and reveals nothing
about the identity of the user.

[Shibboleth]: http://shibboleth.internet2.edu/
[SAML]: http://saml.xml.org/saml-specifications

## Working with known algorithms ##

As I mentioned before, Shibboleth is open source software.  All of our code is publicly available, including [the way
that we calculate persistent identifiers][transientid].  So how could a relying party use this knowledge to take the
above opaque identifier and decipher the identity of the user it belongs to?  Pretty simply, if they have a list of
possible usernames, or can reasonably guess them.  A list of usernames is far easier to get than you might imagine from
unprotected university LDAP directories.  Then you simply iterate through the list and run the same algorithm until you
find the matching hash value.  And even given a population of 30,000 usernames (the approximate number of students at
[USC][] where I worked), the following shell script churns through them in about 90 seconds:

    ~$ date && for i in `head -n 30000 /usr/share/dict/web2`; 
        do echo $i | md5 >/dev/null; done && date
    Sun Aug  2 16:25:53 PDT 2009
    Sun Aug  2 16:27:35 PDT 2009

To protect against such a brute-force attach to reveal the identity of a user, we added a secret salt to the hashing
algorithm.  That way, you can't regenerate the hash without also knowing the salt value:

    md5( "jsmith" + "http://idp.example.com/" + "http://sp.example.com/" 
        + "my-secret-salt" ) = cf79282c587897fb733d8338fe7bc9c2

It's worth pointing out that, while use of a secret salt prevents a relying party from brute forcing the hash, it in no
way prevents the identity provider from doing so, since they do of course know the secret salt.  Though we never ended
up needing to do this at USC, we built the tools that would enable us to identify the user a persistent identifier
belonged to.  In the event that a relying party reported that a particular user was abusing their system, we wanted to
make sure we could identify who it was.

[transientid]: http://svn.middleware.georgetown.edu/view/java-shib-common/branches/REL_1/src/main/java/edu/internet2/middleware/shibboleth/common/attribute/resolver/provider/attributeDefinition/TransientIdAttributeDefinition.java?view=markup
[USC]: http://www.usc.edu/

## The realities of deployment ##

The above algorithm actually works pretty well for generating unique and secure opaque values for tuples of user,
identity provider, and service provider.  But what happens when one of those values change?  At USC, users could request
that their username be changed for a variety of reasons, and approximately 300 such requests were made each year.  So
using the above algorithm, a username change would change every one of the user's generated persistent identifiers.  And
the reality is, businesses are often bought out by other businesses.  What happens when "http://sp.example.com/" needs
to change to "http://sp.new-company.com/"?  That will effect the generated persistent identifier for **every** user.
How do you deal with these realities?  There are a number of ways, and I'll outline just a few.  There is no one *right*
solution, as the policy and practices of a particular institution will greatly impact their decision of how to address
these situations.

Perhaps the simplest option in some respects would be to simply not change which identifiers are used for generating the
hash and instead **map the new identifiers** to the old values.  Even if a user's username has changed to "jjones", you
map it back to "jsmith" for the purposes of generated persistent identifiers.  While this allows a deployment to
continue using the same hashes, it does introduce the burden of maintaining this map of identifiers.  And what is the
institution's policy with regards to re-issuing identifiers?  If "jsmith" is allowed to be re-issued to a different user
at some point in the future, that is going to create problems.

An alternate solution would be to simply **use better identifiers**.  At USC, we had another user attribute called the
"uscPVID" which we used instead of username.  This was itself an opaque identifier that effectively served as the
primary key within the enterprise directory.  Even if all the other data for a user changed like their name and
username, the uscPVID would remain the same.  The same kind of persistent key can be obtained for relying parties by
creating a lookup table that maps the relying party's public ID to some more persistent internal ID.  If and when a
relying party changes their public ID, you simply modify, or add a new entry in your lookup table.

Finally, an identity provider could **migrate from old to new identifiers**, either with a one time update, or
gradually.  For a one time update, the identity provider would generate the old and new identifier for a user or set of
users, and provide that information to the relying part out of band.  The relying party would then be responsible for
updating their database accordingly.  Alternately, the new and old mapping could be provided gradually at the time of
user login by using attributes.  This was the technique used at USC for updating relying parties of changes to a
different user attribute known as the USCID.  For reasons I won't bother explaining here, this 10 digit ID could change
for a user when certain events occurred.  To alert relying parties, we would include two attributes -- the current USCID
for the user, along with a list of "historical" USCIDs for that user.  Relying parties were then responsible for
updating any records they had for one of the historical USCIDs to the current USCID of the user.


## Application to OpenID ##

The above hashing method could be used with little or no modification to create directed identity URLs for OpenID users.
You could of course simply generate completely random IDs and store them in the database... that works too.  In my next
post however, I'll be talking about a new kind of OpenID service I've been doing a lot of thinking about, an OpenID
proxy which works to protect the privacy of OpenIDs that don't support directed identity themselves.  We'll be using the
above hashing algorithm, but doing some interesting things with the user identifier.

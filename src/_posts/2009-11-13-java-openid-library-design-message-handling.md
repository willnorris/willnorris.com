---
title: Java OpenID Library Design - Message Handling
wordpress_id: 888
date: '2009-11-13T16:16:52-08:00'
categories:
- identity
- technology
tags:
- shibboleth
- java
- openid
- openid4java
- joid
- internet2
---
This past June I contracted with [Internet2][] to work on adding OpenID support to the [Shibboleth][] Identity Provider.
I had actually started to work on this over a year prior while working at USC.  At the time there were (and still are)
two primary OpenID libraries in Java, Verisign's [JOID][], and Sxip's [OpenID4Java][].  I spent a fair amount of time
looking at both libraries, but ultimately decided they weren't going to work for what Shibboleth needed.  There were
architectural issues with the existing libraries, which I pointed out in [my post][] to the OpenID4Java mailing list.
But there were also significant design decisions that I felt could be improved upon, so I began work on a new OpenID
library in Java.  Now that this library is nearing a usable state, I wanted to talk about some of the architectural
decisions that were made, and how it differs from the existing Java libraries for OpenID.

Let me first preface this by clarifying that I'm not saying the existing OpenID libraries are not usable.  Quite the
contrary, I know that the OpenID4Java library is used for AOL's OpenID provider, on Google's Blogger, as part of Sun's
[OpenSSO][], and countless other projects.  Additionally, JOID powers Verisign's very usable [PIP][].  There is no
question that they work for many use cases.  However, they lack the clean architecture I was looking for, which can
really only be corrected by starting from a blank canvas.

(I'm not sure how many posts this will take, or how sensical the order of things will be, but better to go ahead and get
it written down in *some* form.)

[Internet2]: http://internet2.edu/
[Shibboleth]: https://shibboleth.net/
[JOID]: http://code.google.com/p/joid/
[OpenID4Java]: http://code.google.com/p/openid4java/
[my post]: http://groups.google.com/group/openid4java/browse_thread/thread/f0775348b3b7f3f/f93d22fe21a6e37e
[OpenSSO]: https://opensso.dev.java.net/
[PIP]: https://pip.verisignlabs.com/


## Message Handling Flow ##

One of the most immediate differences you'll see in the Internet2 library is the very clear separation of logic in the
message handling code.  I wanted the core message objects to be simple Java beans that provide access to strongly typed
properties, and nothing more.  When I'm processing an OpenID message, I don't want to be thinking about how that message
was encoded during transit.  Additionally, I don't want to duplicate code if at all possible, so there needs to be one
very clear place where any particular process is implemented.  To achieve this, messages are transformed into three
distinct formats as they are being processed.

When a message comes in to an OpenID provider, it is in some kind of transport specific format.  Typically that will be
a URL-encoded string that is taken either from an HTTP POST request body, or from an HTTP GET request query string.
Alternately, it may be a Map retrieved by calling [ServletRequest.getParameterMap][].  This transport specific format
needs to first be converted into some kind of common intermediary format so that the next step in the process can deal
with all messages in the same way, regardless of transport method.  In the Internet2 library, this common format is a
ParameterMap.  

[ServletRequest.getParameterMap]: http://java.sun.com/javaee/5/docs/api/javax/servlet/ServletRequest.html#getParameterMap()


### ParameterMap ###

A [ParameterMap][] is simply a [LinkedHashMap][] with [QName][] keys, String values, and a little additional logic.  Why
QNames for keys?  Aren't those for XML?  Yes they are, but they actually work beautifully for OpenID message parameters
as well.  You see, an OpenID message is really just a collection of namespace qualified parameters, and can be quite
easily represented in XML.  (Yes, this is a little bit of a rabbit trail, but it's interesting nonetheless).  Let's
start with a really simple KVF encoded OpenID message:

```
openid.ns:http://specs.openid.net/auth/2.0
openid.mode:checkid_setup
openid.claimed_id:http://example.com/
openid.identity:http://example.com/
openid.ns.sreg:http://openid.net/extensions/sreg/1.1
openid.sreg.required:email,fullname
```

Yeah it has no signature, etc, but that's not the point.  What might this look like in XML?

``` xml
<message xmlns="http://specs.openid.net/auth/2.0" 
            xmlns:sreg="http://openid.net/extensions/sreg/1.1">
    <mode>checkid_setup</mode>
    <claimed_id>http://example.com/</claimed_id>
    <identity>http://example.com/</identity>
    <sreg:required>email,fullname</sreg:required>
</message>
```

See how cleanly it maps?  This is no accident.  This is a very common pattern for handling namespace qualified
parameters.  First you assign your namespace to an alias, then you use that alias as a prefix for any parameters that
are part of that namespace.  The simple registration 'required' parameter name has three parts: there's the base
parameter name ("required"), the namespace alias ("sreg"), and the actual namespace URI which is declared separately
("http://openid.net/extensions/sreg/1.1").  A Java QName object consists of three parts: a namespace URI, a local part,
and a namespace prefix.  Slightly different terms, but **exactly** the same concepts.

Okay, so back to our OpenID library.  We've taken our transport specific encoding, passed it through an appropriate
[MessageDecoder][], and ended up with a ParameterMap.  Before we move on, I want to point out one more thing about the
parameters in a ParameterMap.  None of the parameter names contain the "openid." prefix.  This prefix is specific to
messages that are encoded using [URL Form encoding][], since that's the only way to identify which parameters are part
of the OpenID message.  One of the jobs of the [URLFormCodec][] is to strip this prefix as messages come in, and add the
prefix as messages go out.  The message encoder and decoder is the **only** part of the entire library that knows
anything about this prefix, and quite frankly it's the only part that should.

Okay, so now that we have our ParameterMap, it needs to be converted into an actual message object, which is the job for
a MessageUnmarshaller.

[ParameterMap]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/common/ParameterMap.java?view=markup
[LinkedHashMap]: http://java.sun.com/j2se/1.5.0/docs/api/java/util/LinkedHashMap.html
[QName]: http://java.sun.com/j2se/1.5.0/docs/api/javax/xml/namespace/QName.html
[MessageDecoder]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/message/encoding/MessageDecoder.java?view=markup
[URL Form encoding]: http://openid.net/specs/openid-authentication-2_0.html#rfc.section.4.1.2
[URLFormCodec]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/message/encoding/impl/URLFormCodec.java?view=markup


### Unmarshalling messages ###

[Message unmarshallers][] are responsible for taking a ParameterMap and using it to populate a specific kind of message
object.  Remember the desire for message objects to have strongly typed properties?  The corresponding unmarshaller for
that message type is the one and only place that needs to worry with how the parameter passed on the wire gets converted
into that strong type.  For example, [AssociationRequest][] messages may include the Diffie-Hellman public key of the
OpenID relying party.  Java provides a very specific object just for that called [DHPublicKey][], so that's what we want
our AssociationRequest object to use.  Parameters can only be passed as strings during transit, so the
[AssociationRequestUnmarshaller][] (and nothing else) is responsible for knowing how to convert that string into a
DHPublicKey.

Similarly, Attribute Exchange fetch requests may include a list of required attributes it wants for a user.  These
attributes are identified by URIs, so Attribute Exchange does it's own aliasing similar to the namespace declarations we
saw above.  This way, the "ax.required" message parameter need only contain a comma-separated list of attribute aliases
rather than the full namespace URIs.  But when you get right down to it, these aliases are just an optimization that is
used during transport.  Really all that's being represented is a list of attributes URIs.  This is why the
[FetchRequest][] object in the Internet2 library exposes this particular message parameter simply as a List of attribute
URIs.  It's the [FetchRequestUnmarshaller][] that is responsible for taking the AX message parameters, dereferencing the
attribute aliases, and populating the FetchRequest object appropriately.

[Message unmarshallers]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/message/io/MessageUnmarshaller.java?view=markup
[DHPublicKey]: http://java.sun.com/j2se/1.5.0/docs/api/javax/crypto/interfaces/DHPublicKey.html
[AssociationRequest]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/message/AssociationRequest.java?view=markup
[AssociationRequestUnmarshaller]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/message/impl/AssociationRequestUnmarshaller.java?view=markup
[FetchRequest]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/extensions/ax/FetchRequest.java?view=markup
[FetchRequestUnmarshaller]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/extensions/ax/impl/FetchRequestUnmarshaller.java?view=markup


### Reversing the process ###

What about returning OpenID response messages?  We just do the same process in reverse.  The message object is passed
through an appropriate [MessageMarshaller][] which populates a ParameterMap.  And the ParamerMap is in turn passed
through a [MessageEncoder][] that produces some kind of transport specific format.  That may be a Key-Value form encoded
string, as is the case with direct responses, it may be a URL suitable for redirecting the user to, or it may be an HTML
response to use for HTML form submission.

[MessageMarshaller]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/message/io/MessageMarshaller.java?view=markup
[MessageEncoder]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/message/encoding/MessageEncoder.java?view=markup


## Uniformity over brevity ##

Depending on how you separate them, there are roughly nine different message types in the core OpenID 2.0 spec, and for each of these message types, the Internet2 library has five files that handle the processing.  There's the message interface, the concrete implementation, the message builder (which I didn't actually talk about in this post), the message marshaller, and the message unmarshaller.  At times all these files may seem needlessly verbose, especially when you see that some of them are only a few lines long.  It turns out that this separation doesn't necessarily result in more lines of code, just that the code is broken up into smaller chunks.  Besides, the goal here is not conciseness.  The goal is uniformity and predictability in how messages are processed, as well as clean, logical separation of duties.  When every message is processed in exactly the same way, bugs tend to expose themselves much earlier in the process, and strange edge cases are far rarer.  When things are logically separated, it makes the overall architecture much easier to understand.  And perhaps more importantly, it makes it possible to fully understand one part of the library without needing to be concerned with others.  You can go in and look at the code for [signing messages][], and not have to wade through code dealing with transport encodings.

[signing messages]: https://github.com/willnorris/java-openid/blob/master/src/main/java/edu/internet2/middleware/openid/security/SecurityUtils.java?view=markup

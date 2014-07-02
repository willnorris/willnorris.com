---
layout: post
title: Java OpenID Library - Configuration and Custom Messages
wordpress_id: 893
date: 2009-11-15T20:34:00-08:00
categories:
- identity
- technology
tags:
- java
- openid
- internet2
---
I [previously described][] how message handling works in the Internet2 OpenID library, and how each OpenID message type
requires a half dozen or so classes to handle everything.  While this may seem like overkill to some, one of the nice
things about this separation of logic is that it makes it quite simple to provide custom implementations of specific
kinds of messages.  While this was not specifically a core requirement of the library, it was an added bonus of the
design, and just seemed like a good thing to support.  I want to talk about it here, because it illustrates how this
portion of the library is configured, which will be important to understand later.

[previously described]: http://willnorris.com/2009/11/java-openid-library-design-message-handling

## Central Registry ##

As we mentioned, every OpenID message type has a number of supporting classes.  Let's take the authentication request
message as an example.  You have:

 - [AuthenticationRequest][] -- interface that defines this specific OpenID message type
 - [AuthenticationRequestImpl][] -- default implementation of this message type
 - [AuthenticationRequestBuilder][] -- builder of AuthenticationRequest instances
 - [AuthenticationRequestMarshaller][] -- converts AuthenticationRequest message into a ParameterMap
 - [AuthenticationRequestUnmarshaller][] -- converts ParameterMap into an AuthenticationRequest message
 - [AuthenticationRequestValidator][] -- this wasn't talked about last time, but is responsible for validating that an
 AuthenticationRequest message contains all of the requisite parameters

All classes except for the actual message implementation must be thread-safe, as only a single instance is maintained by
the library (technically they don't follow a singleton pattern, but only one instance is typically used).  All of these
are stored in central registries, so that they can be retrieved to marshall or unmarshall a message as needed.  Each one
has it's own factory that allows registering and looking up of specific implementations:

 - [MessageBuilderFactory][]
 - [MessageMarshallerFactory][]
 - [MessageUnmarshallerFactory][]
 - MessageValidatorFactory (not yet implemented as of this writing)

MessageValidator implementations are registered based on the message class that it validates. For the other three
factories, implementations are registered based on a [QName][] which consists of the OpenID protocol namespace URI, and
the value of the mode parameter.  Yes, there are three OpenID message types that don't actually have a 'mode' parameter,
but I'll save that discussion for another post.  Also, the QName here doesn't exactly represent a namespaced parameter
name like it does in the [ParameterMap][], instead it is just a container for a namespace URI and a string value.
Perhaps this is technically a misuse of the QName object, but it's working fine for now.  A static instance of each
factory is available from the [Configuration][] class.

[AuthenticationRequest]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/message/AuthenticationRequest.java?view=markup
[AuthenticationRequestImpl]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/message/impl/AuthenticationRequestImpl.java?view=markup
[AuthenticationRequestBuilder]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/message/impl/AuthenticationRequestBuilder.java?view=markup
[AuthenticationRequestMarshaller]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/message/impl/AuthenticationRequestMarshaller.java?view=markup
[AuthenticationRequestUnmarshaller]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/message/impl/AuthenticationRequestUnmarshaller.java?view=markup
[AuthenticationRequestValidator]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/message/impl/AuthenticationRequestValidator.java?view=markup
[MessageBuilderFactory]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/message/MessageBuilderFactory.java?view=markup
[MessageMarshallerFactory]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/message/io/MessageMarshallerFactory.java?view=markup
[MessageUnmarshallerFactory]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/message/io/MessageUnmarshallerFactory.java?view=markup
[QName]: http://java.sun.com/j2se/1.5.0/docs/api/javax/xml/namespace/QName.html
[ParameterMap]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/common/ParameterMap.java?view=markup
[Configuration]: http://svn.middleware.georgetown.edu/view/java-openid/trunk/src/main/java/edu/internet2/middleware/openid/Configuration.java?view=markup

## Message Flow (redux) ##

So now let's go through a message flow like we did last time, and look at how each of the factories are used.  (At the
time of this writing, I'm still working on hooking in the MessageValidators, so I won't be talking much about that).

Remember that when a message comes in, it is in some kind of transport specific encoding.  Depending on how the message
was received and the format it is in, an appropriate MessageDecoder is used to convert it into a ParameterMap.  The next
step is to find an appropriate MessageUnmarshaller to convert this ParameterMap into an actual Message object.  The
MessageUnmarshallerFactory has a `getUnmarshaller(ParameterMap)` method that will lookup exactly what we
need.  Once we have an unmarshaller, we can call its `unmarshall(ParameterMap)`.  This method is responsible
for building an appropriate Message object, and then populating it based on the data provided in the ParameterMap.
Internally, the unmarshaller uses the MessageBuilderFactory to find an appropriate MessageBuilder using the
`getBuilder(ParameterMap)` method.  Once the correct builder is obtained, its `buildObject()`
method is called to get an instance of the Message object.  This instance is then populated using data from the
ParameterMap and returned.  (If anyone wants to volunteer a flow chart that illustrates this, I'd be greatly
appreciative!)

When it comes time to send a message back out, the MessageMarshallerFactory's `getMarshaller(Message)` method is called
to get the correct MessageMarshaller for a given message.  The marshaller's `marshall(Message)` method is called and
returns a ParameterMap, and that is passed through an appropriate MessageEncoder to send it out on the wire.

## Custom Implementations ##

The library comes with default implementations for all of this, so a user can simply choose to ignore all of this
plumbing and be just fine.  But just in case you **do** want to customize part of this, how would you go
about doing so?  Simply by registering them with the appropriate factory.  Let's say you want to provide your own
AssociationRequest implementation for whatever reason.  But maybe you don't necessarily care to customize the way the
data is unmarshalled into and marshalled out of the object... the default implementations for those are fine.  You would
of course have your custom AssociationRequest:

``` java
public class MyAssociationRequest implements AssociationRequest {
    /* implementation here */
}
```

Then to make sure that your custom implementation is built instead of the default implementation provided by the
library, you would also need to provide a MessageBuilder:

``` java
public class MyAssociationRequestBuilder implements 
             MessageBuilder&lt;AssociationRequest&gt; {

    public AssociationRequest buildObject() {
        /* build and return an instance of MyAssociationRequest */
    }
}
```

Then register your message builder:

``` java
MessageBuilder myBuilder = new MyAssociationRequestBuilder();
QName qname = new QName(OpenIDConstants.OPENID_20_NS, AssociationRequest.MODE);
Configuration.getMessageBuilders().registerBuilder(qname, myBuilder);
```

Once your builder is registered, it will be used to build AssociationRequest objects for all incoming messages of that
type.  However, the default marshaller and unmarshaller for that type will continue to be used... you don't need to
worry about that.  And once I get the validators hooked in, that will *just work* as well with your custom class.
Or, you could provide your own Validators if you like. You can customize as much or as little of the library as you
want.

I don't imagine that anyone will want to provide custom message implementations very often, but the option is most
certainly there.  What is far more likely is providing a custom message extension like Attribute Exchange or PAPE.  That
works in very much the same way, which I'll explain next.

---
layout: post
title: The Open Stack (in PHP)
wordpress_id: 533
date: '2009-03-19T12:35:43-07:00'
categories:
- identity
- technology
tags:
- openid
- xrds
- diso
- xrds-simple
- oauth
- xrd
- open stack
- lrdd
---
A couple of months or so ago, I made a conscious shift in my focus with the [DiSo Project][].  Instead of continuing to
concentrate on some of the higher level deliverables like WordPress plugins, I decided it was time to step back and
evaluate where the development community (specifically the PHP development community) is with the Open Stack.  For the
purposes of this discussion, I'm going to use [Johannes Ernst's][] redux of [John McCrea's][] Open Stack graphic.  I'm
also only going to concentrate on three of the middle components: Metadata Discovery, Authentication, and Access
Control.

<figure class="aligncenter">
  <img src="open-stack.png" alt="The Open Stack">
</figure>

[DiSo Project]: http://diso-project.org/
[Johannes Ernst's]: http://netmesh.info/jernst/2008/11/05
[John McCrea's]: http://www.flickr.com/photos/56624456@N00/3020508770/

## PHP ##

First a quick note, to make sure this discussion does not get derailed.  There is a time and a place to talk about these
topics in the abstract.  That is incredibly important work, especially in the development of these specifications, but
that's not what I'm currently interested in.  I'm focused on developing solid PHP libraries to implement these
technologies.  Why PHP?  Because that's what WordPress uses, which is the current platform I'm targeting with the work
I'm doing in DiSo.  I know that PHP isn't as sexy as Python or Ruby, but it's what we're using.  I agree that we need
solid libraries written in these other languages as well, but that's not my focus.  PHP is widely deployed and used,
including companies very involved in implementing the Open Stack like Facebook and Plaxo (Luke, Joseph -- I'm expecting
some help from you guys :) ).

I'll also note that I'm specifically targeting PHP 5.  PHP 4 is no longer supported, and maintaining backwards
compatibility (especially when talking about XML parsing) is a complete pain.  This creates a problem with getting code
into WordPress core, but I'm okay with that... they'll move to PHP 5 eventually.


## OpenID ##

Let's start with the most mature library we've got.  JanRain made a huge name for themselves in the OpenID community a
couple of years ago by providing [open source libraries][] in a number of different languages, including of course PHP.
Like any library, there are a few weird things here and there, but by and large it is an excellent implementation that
has served the community (including this developer) very well.  Last week, [JanRain announced][] that they were
restructuring the development process of the PHP library to make it more open to developers.  The code itself has moved
from their internal darcs repository [to github][], they've added [Luke Shepard][] of Facebook and myself as committers,
and releases, bug tracking, etc will eventually be moved to the Google Code project.  Going forward, we'll be looking at
trimming down the library a bit, removing support in core for older protocol versions and edge cases that weren't really
used, and overall making it easier for developers to use.

[open source libraries]: http://openidenabled.com/
[JanRain announced]: http://openid.net/pipermail/code/2009-March/000000.html
[Luke Shepard]: http://www.sociallipstick.com/
[to github]: http://github.com/bce/php-openid/


## OAuth ##

There are two OAuth PHP libraries that I'm aware of, the "official" library stored in the [OAuth Google Code project][],
and the [Mediamatic library][] from Marc Worrell.  The former library seems to have more users because of it's exposure
from the OAuth website, and is **much** lighter weight than the Mediamatic library (too much so for my taste).  I
initially chose the Mediamatic library for my work in getting OAuth working with WordPress, but eventually found some
problems with the general library architecture.  After [some discussion][] with developers of both libraries, I've begun
work on a [new OAuth library][].  I re-architected the library from scratch, and then used a combination of the two
libraries for much of the actual implementations.  It's probably about 80+ percent done, and should hopefully provide
something both communities can work with.

[OAuth Google Code project]: http://code.google.com/p/oauth/source/browse/#svn/code/php
[Mediamatic library]: http://code.google.com/p/oauth-php/source/browse/#svn/trunk/library
[some discussion]: http://groups.google.com/group/oauth-php/browse_thread/thread/e78feefe1d568c87
[new OAuth library]: http://github.com/willnorris/oauth-php/


## Metadata Discovery ##

Discovery has certainly received the least amount of love from the development community, which is a bit ironic given
that it's a foundational part of almost every application of the Open Stack.  There's no shortage of metadata discovery
and parsing libraries: Joseph Smarr contributed one to the [xrds-simple Google Code repository][], the OpenID library
[has its own][openid-discovery], and the Mediamatic OAuth library [has its own][oauth-discovery].  Yet amazingly, none
of these help you at all if you're wanting to manipulate or publish a metadata document.  They're all half-baked, each
written for a very specific use-case.  What we need is a full implementation of the discovery protocols.  And that, of
course, is where it gets a little more complicated...

**Disclaimer**: If you really want everything there is to know about this subject, go read the writings of [Eran
Hammer-Lahav][]... I'm just going to gloss over it a bit.

Metadata discovery includes two steps: you need to know how to get the metadata about a resource, and you need to know
what format that metadata is in so that you can parse it and make sense of it.  OpenID uses a technology known as
[Yadis][] to retrieve the metadata document, which is in an XML language known as [XRDS][] (Extensible Resource
Descriptor Sequence).  [OAuth Discovery][] uses a combined and simplified version of these two known as [XRDS-Simple][].
Discovery for OpenID and OAuth is more-or-less compatible.

Now, there is also work being done in the [OASIS XRI TC][] (of which I'm a member) to develop the simpler, and more
uniform successor to these protocols.  Retrieval of the metadata will use a collection of methods known as [LRDD][]
(pronounced "lard"), while the metadata 	itself will be in a much simpler format known as [XRD][].  While identical in
spirit, these are complete rewrites of the previous specs.  The new specs are not compatible with the old, but they are
also designed so that they do not conflict either, so that both may be used simultaneously.  Shifting to these new
discovery protocols will certainly not be easy, but believe me when I tell you that it will be worth it.  In fact, it's
absolutely essential for players like Google to implement OP-driven identifier selection (allowing users to login with
OpenID by simply entering "gmail.com").

So as I said earlier, we don't have any real good discovery libraries for PHP.  As part of my work on WordPress, I
started development on a [XRDS-Simple library][] in PHP.  More recently, I created a [separate branch][] of the code
which implements LRDD+XRD exclusively.  Realistically, we'll probably need a library which handles both the old and new
protocols for a while.  The idea would be that none of the higher level libraries like OpenID or OAuth need worry about
metadata discovery, except for maybe a lightweight wrapper around the discovery library.  The new OAuth library I'm
working on will do this from day one; the existing OpenID library will take a little while, but I think we'll eventually
see it rely on a separate library for discovery.

[xrds-simple Google Code repository]: http://code.google.com/p/xrds-simple/source/browse/code/php/XrdsSimpleParser.php
[openid-discovery]: http://github.com/bce/php-openid/tree/master/Auth/Yadis
[oauth-discovery]: http://code.google.com/p/oauth-php/source/browse/trunk/library/discovery/xrds_parse.php
[Eran Hammer-Lahav]: http://www.hueniverse.com/
[Yadis]: http://yadis.org/
[XRDS]: http://en.wikipedia.org/wiki/XRDS
[OAuth Discovery]: http://oauth.net/discovery/
[XRDS-Simple]: http://xrds-simple.net/
[OASIS XRI TC]: http://www.oasis-open.org/committees/xri/
[LRDD]: http://www.hueniverse.com/hueniverse/2009/03/the-discovery-protocol-stack.html
[XRD]: http://www.hueniverse.com/hueniverse/2009/03/xrd-document-structure.html
[XRDS-Simple library]: http://github.com/willnorris/php-xrd/tree/master
[separate branch]: http://github.com/willnorris/php-xrd/tree/XRD

## Feedback and Help ##

First of all, I welcome any feedback on the implementations that currently exist, especially the OAuth and discovery
libraries I'm working on.  They are not complete and most certainly not production ready, but they're getting close.
I'd also like to solicit development help, especially from people with larger deployments and/or a vested interest in
this technology.  All the new development is happening on github, so creating a clone to hack on is incredibly simple.
Even if you don't have development cycles you can put into this, I've already got at least one technical decision I need
to make that I'd love feedback on, which I'll be covering in my next post: "[Why Does HTTP Suck So Much in
PHP][http-php]".

[http-php]: http://willnorris.com/2009/03/http-client-library-for-php

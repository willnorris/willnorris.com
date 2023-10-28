---
title: Providing and Delegating OpenIDs
date: "2008-09-16T14:18:00-07:00"
aliases: [/b/3vd1, /b/4W, /p/270]
categories:
  - identity
  - technology
tags:
  - wordpress
  - openid
  - wp-openid
---

The [next major release][] of wp-openid includes a built-in OpenID provider and delegation engine. This will certainly
be the most exciting feature of this release for most people, so let me explain a bit how it works. Each authorized
user on the WordPress blog will have an OpenID at the author posts URL (ie. http://example.com/author/admin).
Authorization to use the OpenID provider is controlled based on user roles and is managed in the main OpenID settings
page. Each user can choose between one of three options for their OpenID:

- Don't use OpenID at all
- Use the local OpenID provider built in to the plugin
- Delegate to another OpenID

If a the local OpenID provider is used, it also supports transmitting sreg attributes pulled from the user's WordPress
profile and the DiSo Profiles plugin, if it's installed. The user can update this data before releasing it to the
relying party, but those changes aren't currently stored. In addition, trust decisions are recorded and stored for the
user, and can be modified from their config page at any time.

If a user chooses to delegate to another OpenID, they need only provide the delegate OpenID itself. All server
configuration and supported extensions from that provider are discovered and published in the local XRDS document. Of
course this data will have to be cached and probably updated on some interval, but it makes setting up delegation a
breeze.

[next major release]: /2008/09/the-next-steps-with-wp-openid

### Server Modes

Remember that every user's OpenID is their author posts URL. So what about the home URL for the blog itself? Well, the
OpenID server can operate in two basic modes: **multi-user** and **blog-owner**... perhaps not the best names, but
they'll work for now.

In multi-user, the default configuration, the server supports a feature in OpenID 2.0 called _OpenID Provider driven
identifier selection_. What this means is that ANY user on that blog can enter the home URL as their OpenID, and the
OpenID provider itself will make sure that the correct identifier is returned to the relying party. The final
identifier will still be something like *http://example.com/author/admin/*, but the user only needs to enter
_example.com_ at a relying party. If you've used ever used Yahoo's OpenID provider, then you've probably seen how this
works.

I suspect the more common mode will be blog-owner, which is appropriate for personal blogs. Even if there are multiple
users in the system, the blog is basically owned by one individual and it makes sense for that individual to use the
blog home URL as their OpenID. This mode is activated by selecting a "Blog Owner" on the main plugin configuration
page. Once set, this user's personal OpenID configuration (whether turned off, using the local provider, or delegated
to another OpenID) will be used at the blog home URL. Other user's on the blog could still use their OpenIDs, but they
would need to type in the full URL each time... they just lose the convenience of being able to use the blog home URL.

For security, once a blog owner is set, no other user can update the setting. The blog owner can set someone else as
the new blog owner (a push mechanism), but no-one can take ownership away (a pull mechanism). Additionally, if a
multi-user blog wants to ensure no-one is ever set as the blog owner, they can add the following to their wp-config.php
file:

    define("OPENID_DISALLOW_OWNER", 1);

### What's left to do

The main outstanding work to be done before release is the user interface. You'll notice that the user's configuration
screen (where they manage their external OpenIDs, OpenID Provider preference, and Trusted Sites) is a bit confusing if
you're not to familiar with OpenID. The current layout was done simply for convenience while developing the OpenID
Provider, and will be overhauled to some degree before the release.

I'm also not too sure about compatibility with older versions of PHP and WordPress. I've been developing using PHP
5.2.6, MySQL 5.0.51, and WordPress 2.6.1. I do intend to remain as backwards compatible on these as possible (within
reason), but make no guarantees for the current development code. I'll also be working to make everything compatible
with WordPressMU and BuddyPress. For now, I just wanted to get the code out there, and get people playing with it a
little bit.

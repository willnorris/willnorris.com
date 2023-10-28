---
title: Authentication in WordPress 2.8
date: "2009-03-10T12:50:07-07:00"
aliases: [/b/3yZ1, /b/8U, /p/508]
categories:
  - identity
  - technology
tags:
  - wordpress
  - openid
  - diso
  - oauth
  - xmlrpc
---

## Use Case

I've spent a **lot** of time working with the WordPress authentication system. I took over the [OpenID plugin][] for
WordPress two years ago, and [was hired by Vidoop][] last May to work on the [DiSo Project][] full time. Last summer,
Matt Mullenweg invited me to talk at [WordCamp SF 2008][] about OAuth. As you can see in my [slidedeck][], it was a lot
of smoke and mirrors at that point... we didn't have OAuth in WordPress, although it was on the roadmap for 2.7.

We've had an OAuth plugin for a little while that [Stephen Paul Weber][] wrote, but it wasn't until a couple of months
ago that I finally sat down to polish it up. The first use-case we wanted to tackled was XML-RPC, so I got to work with
[Joseph Scott][]. Having OAuth authentication with XML-RPC would allow for blog clients like MarsEdit or the WordPress
iPhone app to communicate with your blog without having to share your WordPress password.

[OpenID plugin]: http://wordpress.org/extend/plugins/openid/
[was hired by Vidoop]: /2008/05/why-im-going-to-vidoop
[DiSo Project]: http://diso-project.org/
[WordCamp SF 2008]: http://2008.sf.wordcamp.org/
[slidedeck]: http://www.slideshare.net/willnorris/wordpress-oauth-presentation
[Stephen Paul Weber]: http://singpolyma.net/
[Joseph Scott]: http://josephscott.org/

## Problem

It wasn't very long before we butted up against my biggest complaint about the WordPress authentication system -- it is
very "username/password" centric. There are places in the authentication code where it bails out prematurely if the
username or password are missing. This isn't a problem if your plugin simply wants to authenticate the user against a
different password store like LDAP; in fact that works quite well.

The problem is that there are a number of authentication systems widely deployed in the wild (SAML, OpenID, OAuth, etc)
that do not fit the standard model of username and password. You can look at the OpenID plugin to see some of the more
_interesting_ things that need to be done in order to make it work on the various versions of WordPress. However, when
it came to hooking OAuth into the WordPress XML-RPC endpoint, there simply was no way to hack around it... we had to
change some of the underlying assumptions.

It's worth noting one additional requirement we had. Because the `wp_authenticate()` function, which does most of the
heavy lifting for WordPress authentication, resides in `pluggable.php` it is possible for a plugin to replace the
function entirely and authenticate the user however they want. The problem with this solution is that many
authentication mechanisms don't know if they should be invoked without examining the request. If `wp_authenticate` is
replaced, and then the plugin determines it shouldn't intervene, then it's already too late. There is no way to pass
the function call back to the standard version of `wp_authenticate()`. This is actually the case for all functions in
`pluggable.php`. One possible solution is to create wrapper functions for everything, which I initially [advocated][].
Instead, [Peter Westwood][] came up with a better solution using a well-established model, which we ended up using for
the new authentication system.

[advocated]: https://core.trac.wordpress.org/ticket/8833
[Peter Westwood]: https://web.archive.org/web/20090310/peter.westwood.name

## Solution

It took far more planning than actual coding, but we finally developed a solution that breaks the dependence on a
username and password, but maintains backward compatibility with existing plugins that hook into the authentication
code. WordPress 2.8 includes a new filter called _authenticate_ which is passed three parameters: a mixed value (either
a `WP_User` object, a `WP_Error` object, or `null`), along with the username and password (either or both of which may
be `null`). All of the standard WordPress authentication logic has been moved into two functions that implement this
filter, both with relatively low priority.

- `wp_authenticate_username_password()` (priority 20) includes the standard logic for authenticating using a standard
  username and password. It still calls the `wp_authenticate_user` filter, so plugins that rely on that should be fine.
  This function also performs the check for an empty username or password.

- `wp_authenticate_cookie()` (priority 30) is only added into the filter chain when the user is authenticating via
  `wp-login.php` and does the normal checking for the WordPress authentication cookie.

Both of these functions first check to see if the first parameter passed in is a valid `WP_User` object, and immediately
stop if it is. This allows plugins to add their own functions into the filter chain which populate the `WP_User` object
using whatever means they see fit. WordPress still takes care of setting the authentication cookie when appropriate, so
plugins need only worry with authenticating the user and returning a valid `WP_User` object.

So what will this look like for plugins? Well, the OAuth plugin for WordPress isn't finished yet, but the function
below should be pretty close to the final version. While there is of course a lot more code for actually implementing
OAuth, this is the only hook into the WordPress authentication system needed to make it work. Note that this function
doesn't care about the username and password parameters that are available from the `authenticate` hook... other plugins
may use them.

```php
add_filter('authenticate', 'oauth_authenticate');

/**
  * If the current request was signed using a valid OAuth access token, verify
  * the request and return the associated user.
  *
  * @param WP_User|WP_Error|null $user authenticated user
  * @return WP_User|WP_Error|null OAuth authenticated user, if request was signed
  */
function oauth_authenticate($user) {
    if (Auth_OAuth_Signer::requestIsSigned()) {
        $oauth_server = oauth_server();
        $user_id = $oauth_server->verify();
        if ($user_id !== false) {
            $user = new WP_User($user_id);
        }
    }

    return $user;
}
```

## For Plugin Authors

If you're currently hooking into the WordPress authentication system, **especially** if you're providing a custom
implementation of `wp_authenticate()`, take a look at the new `authenticate` hook. If you are relying on the
`wp_authenticate` action hook, you should also look closely to see if the new hook will do what you need. We left the
`wp_authenticate` hook in place for now, but I'm pretty sure it's no longer necessary and will likely be removed in
future releases. If you are using the `wp_authenticate_user` hook exclusively, then you're probably fine, but it's
probably still a good idea to take a look at the new stuff.

## So, OAuth in WordPress?

We made additional changes to the WordPress XML-RPC code to make it use the new authentication system appropriately, so
it is now possible to hook OAuth into WordPress without any core modifications. We do in fact have a basic [OAuth
plugin][] that works with the trunk version of WordPress. However, I don't think I'm going to push to have the OAuth
code included in WordPress 2.8 for two reasons:

- the OAuth libraries are in flux right now. There have been two main PHP libraries that people have used for OAuth,
  both with their own strengths and weaknesses. I'm currently working with the [oauth-php community][] to combine these
  libraries using the best parts from each, and a new clean architecture. This effort can be found [on github][].
  (This library also requires PHP5 which is a deal breaker for WordPress... not sure how we'll manage that.)

- Because OAuth has the potential to be such an important part of how third party clients interact with a WordPress
  blog, I want to make sure we get this right. Personally, I'd feel much more comfortable getting some real world
  experience with this code in a slightly more constrained environment by releasing it as a plugin first. Once we've
  done that and are comfortable with how it integrates into WordPress (plugin API, admin interface, database schema,
  etc), I'm all for making it a core part of WordPress.

[OAuth plugin]: http://diso.googlecode.com/svn/wordpress/oauth/trunk/
[oauth-php community]: http://groups.google.com/group/oauth-php
[on github]: http://github.com/willnorris/oauth-php/

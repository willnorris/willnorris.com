---
title: Challenges in changing my OpenID
date: '2008-12-19T14:35:21-08:00'
shortlink: [/b/7c, /p/457]
categories:
- identity
- technology
tags:
- wordpress
- openid
- xrds-simple
- xrd
---
I recently decided to combine two personal websites I had (this one, willnorris.com, and will.norris.name) so that I had
a single web presence.  I chose to use willnorris.com as my canonical URL, but this presented two problems:

 - I have been listing will.norris.name as my homepage in my various social networks profiles and on blog comments.
 I've built up some Google page rank love through these links, and I want to make sure that is transferred over to
 willnorris.com.  I also want any visitors that go to will.norris.name to be sent over to willnorris.com.  The easiest
 (and correct) way to accomplish both of these is to setup a simple 301 "Moved Permanently" redirect.

 - I have also been using will.norris.name as my primary OpenID to login to numerous websites.  Many OpenID consumers
 will allow you to connect multiple OpenIDs or at least change your OpenID, so I can go through them all and update my
 account.  But that will take a while, and I'd like to combine my domains now.  The problem is that if I go ahead and
 setup a 301 redirect (as mentioned above), then it breaks my ability to use will.norris.name as an OpenID (see #4 under
 [OpenID Normalization][]).

So I want Google and other visitors to see a permanent redirect to willnorris.com, but I don't want to break my ability
to use will.norris.name as an OpenID.  I was originally planning to use Apache to perform the redirect, and I wasn't
sure if I'd actually be able to find a solution to my problem.  Then I started thinking about WordPress request
processing, and came up with the following bit of code:

``` php
add_action('wp', 'redirect_wp');

function redirect_wp($wp) {
    // only redirect plain home page requests
    if (!is_front_page() && !is_home()) return;
    if (!empty($_SERVER['QUERY_STRING'])) return;

    // don't redirect OpenID requests
    if (stripos($_SERVER['HTTP_ACCEPT'], 'application/xrds+xml') !== FALSE) return;
    if (stripos($_SERVER['HTTP_USER_AGENT'], 'openid') !== FALSE) return;
    if (empty($_SERVER['HTTP_USER_AGENT'])) return;

    wp_redirect('http://willnorris.com/', 301);
    exit;
}
```

So it's pretty simple really... First, we only care about requests to the front page.  Because I was only using
will.norris.name as a one-page identity site, not a full blog, I only need to worry with requests to the front page.  If
I had been writing blog posts or other pages on this site, I would need to have different logic here.  Second, we do
some basic detection for OpenID requests -- things like the content negotiation header for XRDS, or the "openid" string
that appears in the user agent of JanRain OpenID libraries.  If it doesn't look like an OpenID request, we go ahead and
redirect to willnorris.com.

Now of course this only works in my specific use case, but perhaps it will prove useful for others.  For what it's
worth, the new work we're doing on [metadata discovery][] with XRD would prevent this problem, since we're moving away
from overloading normal HTTP requests where possible.

**Update:** I now also treat an empty user agent string as an OpenID request.  This covers Blogger, which uses the
[OpenID4Java][] library.  I'm fairly certain all major search engine spiders include a user agent, so this should be a
fairly safe addition.

[OpenID4Java]: http://openid4java.org

### Additional Note for FastCGI Users ###

It's worth noting as well that WordPress loses the HTTP status code when using FastCGI, as is used at Joyent.  A
[comment in the code][] claims that it causes problems with some FastCGI setups, but I've not experienced that.  This is
very important, because Google will not transfer your page rank repuation if only using a 302 "Moved Temporarily"
redirect; it must be a 301.  A quick fix for this is to add the following to the very beginning of the above code:

``` php
add_filter('wp_redirect_status',
    create_function('$s', 'status_header($s); return $s;'));
```

[OpenID Normalization]: http://openid.net/specs/openid-authentication-2_0.html#normalization
[metadata discovery]: http://groups.google.com/group/metadata-discovery
[comment in the code]: http://trac.wordpress.org/browser/tags/2.7/wp-includes/pluggable.php#L848

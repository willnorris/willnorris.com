---
title: Hum – A Personal URL shortener for WordPress
date: '2011-01-27T09:02:46-08:00'
aliases: [/b/4A11, /b/FJ]
categories:
- technology
---
While I haven't had much time over the last year or so to spend actually writing code for [DiSo][], I've been really
interested in the new direction [Tantek][] has been taking things with his [DiSo 2.0] concepts.  Many of the early
efforts in DiSo were focused just on how to move social data around the web (data formats, protocols, authentication
mechanisms, etc).  Tantek is taking a slightly different approach to this by first emphasizing the importance of data
ownership.  It's not enough to simply pull in a **copy** of your content from social networks into your local
repository.  In order to truly own your data, the **original** should be on your site, and then copies pushed *out* to
whatever social networks, with links pointing back to the original where appropriate.  It may sound like a purely
academic distinction, but it's the difference between [sharecropping and homesteading].

So just to prove that I don't actually spend all of my time in the belly of the [beast](http://www.google.com/), I'm
happy to announce a new project I've been working on – Hum.  It's a personal URL shortener for WordPress, inspired by
[Whistle][].  It's important to note that this is not a traditional URL shortener like [bit.ly][] or [goo.gl][] that is
designed for creating links to any arbitrary site on the web.  Instead, a personal URL shortener is intended to link to
your own content... your blog posts, your status updates, your photos.  When pushing content from your site out to
social networks, you often need the ability to link back to the original.  Thanks to Twitter this means short URLs, and
following DiSo principles, this means controlling those URLs.  A URL shortener may not be sexy, but it's necessary
infrastructure for DiSo 2.0.

Hum is like Whistle in a lot of ways.  It's designed to be run on a personal domain.  It use [NewBase60] encodings to
keep the URLs both short and human readable.  And it uses the same content-type [partitioning][] of the URL space.  The
key difference is in the use of database keys.  One of the design principles of Whistle is to have algorithmically
reversible URLs.  That means that anyone who knows the algorithm can convert the short URL back to the fully expanded
form without actually having to make an HTTP request.  It also means that you don't need any kind of datastore to lookup
the mapping.  You can easily store everything in flat files.  This results in a more stable and overall faster system.
But because we're building on WordPress, which is tied to a database anyway, there wasn't as much of a benefit in
avoiding the use of database keys in the short URLs.

## How it Works ##

Hum is actually pretty simple.  It's very lightweight and currently uses no data storage of its own, as there are no
configuration options.  It registers a few URL patterns like `/b/*` and then handles any requests to those paths.  For
example, the short URL for this blog post is <http://wjn.me/b/FJ>.  It also hooks into the built-in WordPress shortlink
functionality to expose these new shortlinks in the metadata for each page.  

Doing nothing else, this should give you reasonably short URLs, depending on your domain name.  But the real value comes
when you couple it with a personal short domain, and it's incredibly simple to do.  Buy a short domain, and set it to
redirect to your primary domain.  I did this by putting the following in my `.htaccess` for my short domain:

    RewriteEngine On
    RewriteBase /
    RewriteRule (.*) http://willnorris.com/$1 [L,R=permanent]

Then you want to tell Hum that you have a short domain that it should use for generating URLs.  To do that, add
something like the following to your theme's `functions.php` file:

``` php
add_filter('hum_shortlink_base', create_function('', 'return "http://wjn.me/";'));
```

And that's it.  You now have simple short URLs for all of your WordPress content.  Hum includes additional hooks to make
it very easy to link to offsite content, which I'll hopefully cover in a future post.  In the meantime, [read the
source][]... it's pretty well documented.

This is only the first step in what I'd like to build for a WordPress implementation of DiSo 2.0, but a necessary one.
If you're interested in this, please contact me.  You should also consider coming to [IndieWebCamp][] in Portand, Oregon
where we'll be discussing this stuff for a full weekend.

Download Hum on GitHub: <https://github.com/willnorris/wordpress-hum>  
Also on WordPress Extend: <http://wordpress.org/extend/plugins/hum/>

[Tantek]: http://tantek.com/
[DiSo]: http://diso-project.org/
[DiSo 2.0]: http://tantek.com/2010/034/t2/diso-2-personal-domains-shortener-hatom-push-relmeauth
[sharecropping and homesteading]: http://nomoresharecropping.org/2010/12/no-more-sharecropping/
[Whistle]: http://ttk.me/w/Whistle
[bit.ly]: http://bit.ly/
[goo.gl]: http://goo.gl/
[NewBase60]: http://ttk.me/w/NewBase60
[partitioning]: http://ttk.me/w/Whistle#design
[read the source]: https://github.com/willnorris/wordpress-hum

[IndieWebCamp]: https://web.archive.org/web/20110127/http://plancast.com/p/3cos/indiewebcamp

---
title: A self-hosted alternative to Jetpack's Photon service
date: '2014-01-10T08:20:32-08:00'
shortlink: /b/J_
categories:
- technology
tags:
- wordpress
- golang
- jetpack
- photon
- image proxy
image:
  url: jetpack-kid.jpg
  alt: Young boy wearing an aviator outfit and a homemade jetpack
  position: 30% 15%
---

Like many people, I've long had a bit of a love/hate relationship with [Jetpack][], the WordPress plugin from Automattic
that adds a slew of features like pretty photo galleries, WordPress.com stats, automatic sharing to Google+ and Twitter,
etc.  A lot of these are incredibly useful and implemented really well, but due to some philosophical issues I have with
things that the plugin does, as well as a desire to have more control of various aspects of my website, I've been
looking for alternatives to the parts of Jetpack I used most.  Today I'd like to share the self-hosted alternative I
built to replace [Photon][], Jetpack's image proxy and editing service.

If you want to jump straight to the goods, you can [find the code on GitHub][willnorris/imageproxy].

[Jetpack]: http://jetpack.me/
[Photon]: http://developer.wordpress.com/docs/photon/
[willnorris/imageproxy]: https://github.com/willnorris/imageproxy


## Image proxy services ##

<aside class="alignleft outset"><figure>
  {{<img src="wordpress-cogs.png" alt="WordPress logo" width="350">}}
</figure></aside>

One of the greatest features of Photon is that the service itself is hosted on WordPress.com infrastructure, which means
that it's very fast and stable, and frees you from having to worry about it.  The downside is that, since Automattic is
providing it as a free service, there are some stipulations on its use, namely that it is only for sites hosted on
WordPress.com or using the Jetpack plugin.  Since I'd been working to migrate off of Jetpack, I could no longer use the
service.

My requirements for an image proxy were pretty simple.  First and foremost, it had to serve traffic over https, since
[all of my content is https][https].  Next, I wanted a service that supports [origin pull][], in order to keep the
integration fairly light.  The original copy of all images should *always* live on my site, with the proxy server
fetching them as needed.  That way, if I ever disable the WordPress plugin that is rewriting my image URLs, things
should still work as normal, just pulling the images from their original location.  I also needed a service that
supports basic image resizing.  I disable WordPress's automatic resizing, so the proxy service needs to dynamically
resize images to whatever size I need.  Some of the [extras that Photon supports][photon-extras] like image filters and
brightness are neat, but I don't ever use them.  Finally, I strongly preferred a service that doesn't rely on URL query
parameters, since that can have [caching implications][].

That left me with three main services I looked at: [resize.ly][], [embed.ly][], and [cloudinary][].  There are probably
others as well, but those are the ones I looked at.  Ultimately, I wasn't completely happy with any of them, either
because of their use of URL query parameters or they charged more than I really wanted to spend for this.  Instead, I
started looking at self-hosted options.

[https]: /2012/12/all-https-all-the-time
[origin pull]: http://www.whoishostingthis.com/blog/2010/06/30/cdns-push-vs-pull/
[photon-extras]: http://developer.wordpress.com/docs/photon/api/
[caching implications]: http://www.stevesouders.com/blog/2008/08/23/revving-filenames-dont-use-querystring/
[resize.ly]: https://resize.ly/
[embed.ly]: http://embed.ly/display
[cloudinary]: http://cloudinary.com/


## Self-hosted image proxies ##

<aside class="alignright outset"><figure>
  {{<img src="ghillied-up.jpg" alt="Man wearing a ghillie camouflage suit" width="350">}}
  <figcaption><a href="https://secure.flickr.com/photos/divinenephron/4857328881/">Ghillied Up, by Devon Buchanan</a></figcaption>
</figure></aside>

There is no shortage of open source [image proxies on GitHub][], including [atmos/camo][] which actually powers GitHub's
image proxy.  However, since I was looking to self-host, it needed to be something I felt comfortable hacking on and
that didn't require much work to run.  I'm not comfortable enough with ruby or node.js, so that eliminated a good number
of the available projects.  Photon itself is [open source][photon-server], and I actually ran that locally for a few
weeks while I was working on my eventual solution.  Ultimately I didn't like Photon's use of query parameters, its
assumption that remote images are served over "http", and the fact that it doesn't provide any caching out of the box (I
suspect that WordPress.com adds caching at a different layer).

[image proxies on GitHub]: https://github.com/search?q=imageproxy+OR+image-proxy&type=Repositories
[atmos/camo]: https://github.com/atmos/camo
[photon-server]: http://code.svn.wordpress.org/photon/


## willnorris/imageproxy ##

Most of my development at work is done in Go these days, and I had been looking for an opportunity to run a real Go
service myself (versus just deploying my code to App Engine or something), so this was a great project to do that.

The final result is just [a few hundred lines of Go code][willnorris/imageproxy], utilizing [gregjones/httpcache][]
together with [peterbourgon/diskv] for caching remote images on disk, and [disintegration/imaging] for basic image
manipulation like resizing and rotation.  All options are specified in the URL path, mimicking the format that
[resize.ly][] uses, and it supports whitelisting of remote hosts, so the instance that I run is locked down to only
serve images from my own sites.  And because it's written in Go, it compiles to a statically linked binary that is
incredibly simple to deploy and manage; I've included the [upstart init script][] I use on my Ubuntu server.

<figure class="aligncenter">
  <a href="https://github.com/willnorris/imageproxy"><img src="open-source-imageproxy.png"
    alt="GitHub screenshot stating, 'willnorris open sourced willnorris/imageproxy'" width="450"></a>
</figure>

I've been running it here on my own site for the last month or so, and generally have been really happy with the
results.  There's certainly still some work to do: it doesn't yet do any image optimization using something like
`pngcrush` or `jpegoptim` and I believe color profiles are getting lost on resize.  But on the whole, it's in pretty
good shape.

The final missing piece at this point is the WordPress plugin that rewrites my image URLs to be loaded from the proxy
server.  I'm currently using a severely hacked up version of the photon module from the Jetpack plugin which I hope to
clean up and release soon.  In the meantime, take a look at the proxy server at
<https://github.com/willnorris/imageproxy>.

[gregjones/httpcache]: https://github.com/gregjones/httpcache
[peterbourgon/diskv]: https://github.com/peterbourgon/diskv
[disintegration/imaging]: https://github.com/disintegration/imaging
[upstart init script]: https://github.com/willnorris/imageproxy/blob/main/etc/imageproxy.conf

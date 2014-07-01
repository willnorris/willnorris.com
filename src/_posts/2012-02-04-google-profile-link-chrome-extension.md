---
layout: post
title: Google+ Profile Link Chrome Extension
wordpress_id: 958
date: '2012-02-04T20:41:21-08:00'
categories:
- technology
tags:
- google
- chrome
syndication:
- https://plus.google.com/+willnorris/posts/9Xb3gx8xoQw
---
One of the goals I set for myself this quarter was to get more familiar with the various development platforms that we
support at Google.  I use a number of Chrome extensions on a regular basis, and I've built a simple "Hello World" style
extension before, but never anything that was all that useful.  So over the last few weekends I built a simple extension
called [+Profile Link][] that tries to detect and identify the Google+ profile for the page you're currently viewing.

The extension is itself is pretty straightforward and tries to address a problem I've run into quite a few times.  I'll
come across an interesting blogger or website via Hacker News or wherever, and want to add them to my circles on
Google+.  But first I actually have to _find_ them on Google+.  If I'm lucky, they have a visible link or Google+ badge
somewhere on the site and I can just that.  But some sites (like my own, currently) have only a non-visible link to the
associated Google+ profile.  This non-visible link is really all Google needs to power [author information in search
results][rel-author] or [direct connect][], but doesn't do much for visitors to a site.  And even with a visible link or
badge, the design of some sites are so cluttered that the link may be difficult to find.

<figure class="aligncenter">
  <img src="willnorris.com-profile-link.png" alt="Screenshot of profile link on willnorris.com" width="458" height="274" />
</figure>

The +Profile Link extension scans pages as you browse the web looking for links to a Google+ profile.  This can be a
visible `<a>` or non-visible `<link>` element with a `rel` value of 'me', 'author', or 'publisher', or a [Google+
badge][].  When it detects a link, a small icon appears in the Chrome address bar.  When clicked, a popup window
displays some basic profile data pulled from the public [Google+ API][], including a link to the full profile where you
can add the person to your circles.  I've toyed with adding a [Google+ badge][] directly in the popup, but just haven't
been happy with the way it looks so far... that should be coming in the future.

But what about sites that don't link to their Google+ profile at all?  My goal with this plugin was to try and find the
associated Google+ profile with a very high degree of certainty, so there's only so much you can do.  One experimental
feature I added (which can be activated in the extension's options page) is to use the [Social Graph API][] to find the
Google+ profile for a URL.  This actually works pretty well for the very small percentage of people that have `rel="me"`
links setup on their site.  For example, this would allow the address bar icon to be displayed even on a user's Twitter
profile page as seen here for Tantek.

<figure class="aligncenter">
  <img src="twitter.com-profile-link.png" alt="Screenshot of profile link on twitter.com" width="458" height="274" />
</figure>

Unfortunately, the Social Graph API was [recently deprecated][] and announced that it will be retired on April 20, 2012.
If I can find an alternative solution by then I'll migrate over, otherwise I'll likely remove this feature.  It's not
entirely practical anyway, since it fires off an API lookup for **every** URL you visit.  This has both performance and
potential privacy implications, so I'm not sure that I'd recommend that people leave it running all the time.  It does
provide a nice proof of concept, though.

I'm sure there are plenty of best practices I didn't follow, but I'm generally pretty happy with how it all turned out.
It demonstrates quite a few of the basic functions of a Chrome extension, including:

 - [background pages](http://code.google.com/chrome/extensions/background_pages.html)
 - [content scripts](http://code.google.com/chrome/extensions/content_scripts.html)
 - [page actions](http://code.google.com/chrome/extensions/pageAction.html) with a popup window
 - a very simple [options page](http://code.google.com/chrome/extensions/options.html)
 - light use of the [tabs](http://code.google.com/chrome/extensions/tabs.html) and
 [windows](http://code.google.com/chrome/extensions/windows.html) APIs
 - [message passing](http://code.google.com/chrome/extensions/messaging.html) between the content script, popup window,
 and background page
 - calling remote APIs like the Google+ and Social Graph APIs.  Here, I actually just used jQuery to do a JSONP request
 rather than doing a true [cross-origin XMLHttpRequest](http://code.google.com/chrome/extensions/xhr.html)
 - unit tests for much of the code using [QUnit](http://docs.jquery.com/QUnit)

The whole extension is released under the Apache 2.0 license, so hopefully it will be a useful example to a few folks.
You can find the extension itself in the [Chrome Web Store][+Profile Link] and the source code on GitHub at
[willnorris/plus-profile-link][source].

[+Profile Link]: https://chrome.google.com/webstore/detail/godamdbajiipofehfhedfbebdflpdemn
[rel-author]: http://support.google.com/webmasters/bin/answer.py?hl=en&answer=1408986
[direct connect]: http://support.google.com/plus/bin/answer.py?hl=en&answer=1711199
[Google+ badge]: https://developers.google.com/+/plugins/badge/
[Google+ API]: https://developers.google.com/+/api/
[Social Graph API]: http://code.google.com/apis/socialgraph/
[recently deprecated]: http://googleblog.blogspot.com/2012/01/renewing-old-resolutions-for-new-year.html
[source]: https://github.com/willnorris/plus-profile-link

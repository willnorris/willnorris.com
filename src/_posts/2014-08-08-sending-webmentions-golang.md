---
title: Sending Webmentions with Go
date: '2014-08-08T08:18:49-07:00'
syndication:
 - https://twitter.com/willnorris/status/497774634238885888
 - http://www.reddit.com/r/golang/comments/2czy43/sending_webmentions_with_go/
---

Earlier this week, I wrote about [how I receive webmentions][] on my site by proxying them to an external service.
Today, I'd like to share how I send webmentions using a simple library and command line tool I wrote.

<figure class="alignright outset">
  <img src="webmention.svg" width="200">
</figure>

There are of course already numerous [webmention libraries][] in a variety of languages, many with their own simple
command line interfaces.  However, no one that I'm aware of has done a Go client, which is what I've been using for most
all my tools recently, so I decided to give it a shot. 

The library itself is pretty simple and performs the basic webmention operations: discover the webmention endpoint for a
given URL, send the actual webmention to the endpoint, and discover the URLs that a page links to.  The last operation
is used both for verification of received webmentions (to make sure that the source really does link to the target), as
well as for finding candidates to send webmentions to, which is what my command line tool does.

The command line tool takes a URL as input and discovers all the links from that page.  You can provide a CSS-style
filter to specify the root element to look for links in; by default it looks inside elements that match `.h-entry`.  You
are then presented with the list of discovered links, and you select which ones to send webmentions to.  This step is
especially important right now because it's pretty dumb in which links it selects, so you probably don't want to send
webmentions to all of them.  After that, it does endpoint discovery on each link and if the URL supports webmentions, it
sends the mention.  Nothing too fancy.  You can see a simple demo here:

<figure class="aligncenter">
  <script type="text/javascript" src="https://asciinema.org/a/11344.js" id="asciicast-11344" async=""></script>
</figure>

There's still a lot [more I want to do][] with this, such as improving the UI by making this a "full screen" terminal
app using termbox (an ncurses alternative), doing a better job of selecting candidate links, speeding things up by
sending webmentions asynchronously, and being smarter about brid.gy's responses for POSSE mentions.  In the meantime,
it's already in a very usable state, as this is what I've been using to send webmentions for the last couple of weeks.
And in case it's not apparent, the command line tool doesn't care at all what publishing platform you use.

You can find links to source, docs, and install instructions at [https://willnorris.com/go/webmention](/go/webmention),
as well as some of my other go projects (mostly indieweb related) at [https://willnorris.com/go/](/go/).

[how I receive webmentions]: /2014/08/proxying-webmentions-with-nginx
[webmention libraries]: http://indiewebcamp.com/webmention#Libraries
[more I want to do]: https://github.com/willnorris/go-webmention/issues

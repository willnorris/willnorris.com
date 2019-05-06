---
title: The Links We Lost
date: '2012-12-14T14:46:33-08:00'
shortlink: /b/GN
categories:
- technology
tags:
- shortlinks
- pocket
syndication:
- https://plus.google.com/+willnorris/posts/MQiRMGzuoYy
---
Yesterday, I [shared][] an article from Anil Dash entitled <cite>[The Web We Lost][]</cite> on Google+.  The article is
great, and covers a topic that I have cared very deeply about for a long time.  However, today I noticed that it turns
out that I didn't actually share a direct link to Anil's article, but rather to a pocket.co shortlink that redirected to
the article.  I didn't *mean* to do this; I simply used the normal share button from within the Pocket app on my Android
device and this is what got shared.

<figure class="aligncenter">
  <img src="pocket-share-to-google.png" alt="Screenshot of a Google+ post linking to a pocket.co URL">
</figure>

A number of others apps pull these kinds of shenanigans too like Pulse News and even Google's own Currents app, and it
annoys me to no end.  I mean, I get why they do it (statistics tracking, purported [security protections][t.co], etc),
but it still doesn't change the fact that it feels like we're continuing to propagate a [very dangerous model][].  What
happens when Pocket goes under, or even if their redirect service is temporarily offline?  My post on Google+ is now
broken with no real remedy.  In this case you could try searching for the title of the article, but what if I only
shared the link without a rich snippet that included the title?

Much has been said about the dangers of these kinds of redirects, but that's not actually why I decided to post this.
What really got my attention was the fact that the Pocket app for Android only seems to use the shortened pocket.co URLs
when sharing to Google+ and Twitter.  All other apps I tried sharing to (Facebook, Gmail, WordPress, etc) all included
the full link.  For the first couple, I thought maybe the destination app was quietly following the redirects to expand
the URL, but that doesn't seem to be the case.  So the thing I'm left wondering is why does Pocket choose to use the
pocket.co shortlinks for some apps and not others?  And more importantly, **how** is it able to do so?  I was always
under the impression that the OS itself handles delivery of the ACTION_SEND intent, and that the app doesn't necessarily
know where the shared content is going.  Is that not the case?

[shared]: https://plus.google.com/+willnorris/posts/Hwfibs334wq
[The Web We Lost]: http://dashes.com/anil/2012/12/the-web-we-lost.html
[t.co]: https://support.twitter.com/articles/109623
[very dangerous model]: http://joshua.schachter.org/2009/04/on-url-shorteners.html

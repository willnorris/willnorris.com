---
title: New WordPress plugin - FullFeed
date: "2007-11-07T16:05:23-08:00"
aliases: [/b/3qR1, /b/3W, /p/210]
categories:
  - technology
tags:
  - rss
  - wordpress
  - atom
  - plugin
---

**Update** - thirteen minutes after I posted this, Carsten pointed out there is another plugin that does this exact same
thing (and is in fact named the same!). Go check out [cavemonkey's plugin][cavemonkey].

[cavemonkey]: https://web.archive.org/web/20071107/http://cavemonkey50.com/code/full-feed/

I noticed an interesting phenomenon this last week -- [Mint][] recorded a 400% increase in page hits on Tuesday, the day
after I made two blog posts about OpenID. Now it's not unusual for the hits to go up after a new OpenID post since I'm
part of the [OpenID Planet feed][], but never like this. Since these were slightly longer posts, I included a
[more-tag][] so that only the first paragraph or so was shown on my index page. I do this not to artificially increase
my page-views (I don't run any ads), but simply to keep the front page somewhat lean. Unfortunately, WordPress also
clips the post content in your syndication feeds, even if you have selected the option to show the full text. In
fairness, the admin page is very clear that it will cut off posts, but there is still no option to disable this. So
since I included more-tags in my posts this week, everyone who subscribes to the OpenID Planet feed had to click through
to my website in order to read the rest of my posts. I personally hate summary feeds, and I certainly didn't mean to do
that myself, sorry folks. So last night I whipped together a little WordPress plugin that, when activated, will ignore
more-tags when full-text syndication feeds are enabled. It's a little bit of a weird way to do it, but until
wordpress-core changes to include more-tag splitting as a filter on `the_content`, there's no elegant way of doing this.
<strike>For now the plugin can be found on my local project page, but I've requested a project space on
wp-plugins.org.</strike>

[Mint]: https://haveamint.com/
[OpenID Planet feed]: https://web.archive.org/web/20071107/http://planet.openid.net
[more-tag]: http://codex.wordpress.org/Customizing_the_Read_More

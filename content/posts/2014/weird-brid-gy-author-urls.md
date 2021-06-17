---
layout: aside
title: weird brid.gy author URLs
date: '2014-05-28T13:50:27-07:00'
aliases: /t/KN
categories:
- technology
tags:
- indieweb
- brid.gy
syndication:
- https://github.com/snarfed/bridgy/issues/160
---
For a while, I've noticed that [brid.gy][] was providing `profiles.google.com` URLs for authors for some Google+
activities.  Today, I dug into it a little and discovered that it's only doing this for +1s; Google+ reshares have the
expected `plus.google.com` author URLs.  For example, compare the links on the two rows of faces in the "Likes and
Reposts" of [this post][].

Next I looked at the markup brid.gy generates for these webmentions.  Compare an [example +1][] versus an [example
reshare][].  The +1 contains the following snippet:

``` html
<div class="h-card p-author">
    <div class="p-name"><a class="u-url" href="https://profiles.google.com/105078911987805797425">Cristian Gary Bufadel</a></div>
<a class="u-url" href="https://plus.google.com/105078911987805797425"></a>
```

The author h-card contains two URLs, one with `profiles.google.com` and one with `plus.google.com`.  And the latter has
no link text, it's just empty.

This certainly looks like a bug. I glanced at the [brid.gy code][] briefly, but didn't immediately find the culprit.
[Ryan][], you have any thoughts?

[brid.gy]: https://www.brid.gy/
[this post]: /2014/05/go-rest-apis-and-pointers#comments
[example +1]: https://brid-gy.appspot.com/like/googleplus/111832530347449196055/z13btbeotxa1xlagq04cjrvwdoeagrwasvc0k/105078911987805797425
[example reshare]: https://brid-gy.appspot.com/repost/googleplus/111832530347449196055/z12fcrxzklu1vrctk23xyz2h2ln5z1qau04/103038387682807517504
[brid.gy code]: https://github.com/snarfed/bridgy
[Ryan]: https://snarfed.org/

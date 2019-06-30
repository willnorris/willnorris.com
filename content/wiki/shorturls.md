---
title: Short URLs
---

Most all content on this site has an associated short URL which is advertised on the page in a
`rel="shortlink"` link.  Those short URLs are resolved using a small server called [gum][].

Short URLs on this site generally follow the design of [Whistle][], [Tantek Çelik][]'s short URL
resolver.  URLs take the form of `/<type>/<id>` where `<type>` is a single-character identifier for
the content type, and `<id>` is either a name or encoded ID for the resource.

## Content Types ##

Tantek documents his design for content types at <http://ttk.me/w/Whistle#design>.  I use the
following types:

- **b** - blog post, longer form article
- **c** - code
- **p** - photo or gallery; previously used for posts, which now use b
- **s** - slides
- **t** - short text note;  pretty much all text content that would not be considered a blog post
- **w** - wiki

## IDs ##

Many types, particularly `b`, `p`, and `t` use ID values of the form `SSSn`, where `SSS` is the date
in sexagesimal epoch days (the number of days since 1970-01-01, encoded in [NewBase60][]) and `n` is
a count of how many posts of that type I've made on that day.

For example, given the URL <https://wjn.me/b/4_e1>:

 - **b** - this is a blog post
 - **4_e** - the sexagesimal epoch day representing 2015-02-13
 - **1** - this is the first post of this type on this date

[gum]: /go/gum
[Whistle]: http://ttk.me/w/Whistle
[Tantek Çelik]: http://tantek.com/
[NewBase60]: http://ttk.me/w/NewBase60

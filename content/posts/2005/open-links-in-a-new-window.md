---
title: Open links in a new window
date: "2005-04-22T10:36:10-05:00"
aliases: [/b/3_v1, /b/9, /p/9]
categories:
  - technology
tags:
  - web
  - javascript
---

In the transistion to XHTML, many webmasters are shocked to discover that links with `target="_blank"` (which would
typically cause the link to open in a new window) prevent their page from validating. This is actually part of the
_behavior_ of the link, and (to use proper <acronym title="Model View Controller">MVC</acronym> seperation) therefore
should be handled by a scripting language instead of embedded into the markup. One common approach to this is to use
the relation attribute by setting `rel="external"`. A bit of javascript is then used to walk over your page looking for
links with this "external" designation and setting them to open in a new window.

After using this technique for a while, I discovered the links I typically (but not always) wanted to open in a new
window were those that left my site. I then alterred my javascript function to allow for this and ended up with...

```javascript
function externalLinks() {
  host = (document.location + "").replace(/^(https?:\/\/)([^/]+).*/i, "$2");

  if (!document.getElementsByTagName) return;
  var anchors = document.getElementsByTagName("a");
  for (var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i];
    if (anchor.getAttribute("href")) {
      if (anchor.getAttribute("rel") != "local") {
        if (anchor.getAttribute("rel") == "external") {
          anchor.target = "_blank";
        } else {
          hrefData = anchor
            .getAttribute("href")
            .match(/^https?:\/\/([^/]+).*/i);
          if (hrefData && hrefData[1] != host) anchor.target = "_blank";
        }
      }
    }
  }
}
```

Call this function when the page loads by changing your `body` tag to be `<body onload="externalLinks();">`. This will
implicitly cause all links that go off-site to open in a new window while still allowing you to explicitly force any
link to open in a new window by using `rel="external"`. Additionally, you can use `rel="local"` to explicitly force an
off-site link to NOT open in a new window. For example, if your site were hosted at `www.foo.com`, then

```html
<a href="http://www.foo.com/"></a>
```

would open in the same window,

```html
<a href="http://www.foo.com/" rel="external"></a>
```

would open in a new window,

```html
<a href="http://www.bar.com/"></a>
```

would open in a new window, and

```html
<a href="http://www.bar.com/" rel="local"></a>
```

would open in the same window.

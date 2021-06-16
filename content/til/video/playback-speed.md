---
title: Video playback speed on the web
syndication:
 - https://twitter.com/willnorris/status/1401327852444741636
---

Control the playback speed of video elements on the web, even when controls
aren't present, by entering this into the browser console:

``` js
document.querySelector('video').playbackRate=2.0;
```

Bookmarklet with prompt:
<a href="javascript: var speed=prompt('Playback speed', '2');document.querySelector('video').playbackRate=speed;">Playback Speed</a>

From: <https://stackoverflow.com/questions/3027707>

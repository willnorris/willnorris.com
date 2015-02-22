---
title: Nightly WebKit builds
wordpress_id: 73
date: '2005-10-13T19:33:36-05:00'
categories:
- technology
tags:
- osx
- apple
- safari
- webkit
---
The WebKit team [announced][] a [new site][] today where you can download nightly builds of the latest WebKit -- very
cool.  I went ahead and wrote the following simple shell script to automate the process of downloading and installing
the latest build:

``` sh
#!/bin/sh

curl -o /tmp/webkit.dmg http://nightly.webkit.org/builds/Latest-WebKit-CVS.dmg

hdiutil mount /tmp/webkit.dmg

if [ -d /Volumes/WebKit/WebKit.app ]; then 
    rm -rf /Applications/WebKit.app
    cp -pR /Volumes/WebKit/WebKit.app /Applications/
fi

hdiutil detach /Volumes/WebKit
```

Sure, it could be a little more robust (or you might prefer one of the other two builds), but it works.  Put this in a
new file, `chmod +x` it, and drop it into /etc/daily to have it run each morning.

_(updated 2005-12-21 to reflect new webkit packaging and fix minor bugs)_

[announced]: http://webkit.opendarwin.org/blog/?p=29
[new site]: http://nightly.webkit.org/builds/

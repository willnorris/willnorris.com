---
layout: post
title: Lock Screen
wordpress_id: 55
date: '2005-07-18T12:07:21-07:00'
categories:
- technology
tags:
- applescript
- quicksilver
- growl
- locktight
---
Yet another application ([locktight][]) that I've replaced with [Quicksilver][]...

After reading the comments in [this hint][] at macosxhints.com, I discovered this little bit of applescript. 

	tell application "ScreenSaverEngine" to activate

You'll want to add this to a Quicksilver trigger so you can it from the keyboard (I use Cmd-Opt-Shift-L because that was the default in locktight and I'm kinda used to it)


[locktight]: http://mac.pieters.cx/
[quicksilver]: http://quicksilver.blacktree.com/
[this hint]: http://www.macosxhints.com/article.php?story=20050706194219822

---
title: Lock Screen revisited
wordpress_id: 58
date: '2005-07-28T16:30:10-05:00'
categories:
- technology
tags:
- quicksilver
- osx
---
So just a couple of days ago I talked about [locking your screen with Quicksilver][lockscreen].  Today I discovered that
Quicksilver actually has a lock screen in the "Extra Scripts" plugin, but it's not visible by default in Tiger (seems to
work out of the box on Panther).  The problem is with the file types filtering -- it is setup to only look for .script,
text files, and applescripts.  LockScreen is a "unix executable" and therefore isn't included.  To make matters worse
there doesn't seem to be a way to add this file type to the Types list, so we need to simply have it include all files
(not filtering any).

[Update: I discovered my previous solution didn't persist between restarts of Quicksilver, so here is a working
solution] It's pretty simple...

* First make sure you have the "Extra Scripts" plugin installed
* open your Quicksilver Preferences and go to your catalog.  
* Add a new "File & Folder Scanner" and point it to `~/Library/Application Support/Quicksilver/PlugIns/Extra
Scripts.qsplugin/Contents/Resources/ExtraScripts`
* Set "Include Contents: Folder Contents" and "Depth: infinite"

[lockscreen]: /2005/07/lock-screen

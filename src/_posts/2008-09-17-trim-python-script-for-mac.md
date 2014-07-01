---
layout: post
title: tr.im python script (for Mac)
wordpress_id: 305
date: '2008-09-17T17:52:26-07:00'
categories:
- technology
tags:
- quicksilver
- python
- gtd
- tr.im
---
For a while I have been using a simple AppleScript script to convert URLs into shortened URLs.  The flow goes something
like:

 - Initiate script from [Quicksilver][]
 - Grab URL from the front-most window in Safari
 - Submit URL to URL shortening service (previously [xrl.us][], but more recently [bit.ly][])
 - Copy shortened URL to system clipboard (for pasting into [Twitterific][])
 - Notify of process completion via [Growl][]

I've tried a number of different workflows including bookmarklets and the like, but this one works best for me (read: I
honestly don't care what you think of this flow or what you do instead... this is what I prefer).

Recently I discovered a new URL shortening service, [tr.im][], and decided to give them a try.  However, unlike most
services, tr.im doesn't simply return the shortened URL. Instead it returns either an XML or JSON structure that
includes the shortened URL along with some other data.  Quickly realizing that AppleScript doesn't handle JSON very
well, I decided that this would be a good opportunity to start learning Python.  The result was the following Python
script:

<http://willnorris.com/svn/homedir/packages/tools/local/bin/trimURL>

It follows the same flow as mentioned above, making use of a couple of Python modules (which are required for running
this script): [simplejson][] and [appscript][].  Put this script in a directory that Quicksilver scans (I think the
Terminal Quicksilver plugin is also required).  If you want to authenticate to tr.im, add your username and password to
your `~/.netrc` file.  I also set the script's file icon to be the [tr.im icon][], so it will be displayed in the Growl
notification.

[Quicksilver]: http://www.blacktree.com/
[xrl.us]: http://xrl.us/
[bit.ly]: http://bit.ly/
[Twitterific]: http://iconfactory.com/software/twitterrific
[Growl]: http://growl.info/
[tr.im]: http://tr.im/
[simplejson]: http://pypi.python.org/pypi/simplejson
[appscript]: http://appscript.sourceforge.net/
[tr.im icon]: http://willnorris.com/svn/homedir/packages/tools/local/bin/.trim.png

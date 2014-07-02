---
layout: post
title: Bottom posting in Mail.app (with Quicksilver)
wordpress_id: 191
date: 2007-07-18T13:23:43-07:00
categories:
- technology
tags:
- applescript
- netiquette
- mail.app
- top-posting
- bottom-posting
---
John Gruber posted [his applescript][] for Mail.app to "bottom-post" reply to an email last week (and I'm just now
reading it, *sigh*).  However, he talks about using [FastScripts][] to invoke the script whereas I prefer
[Quicksilver][] for things like this if possible.  The advantage of FastScripts is that it grabs the keystroke before
the application does, so no other modification is necessary.  It's still possible with Quicksilver, but you need to take
a few extra steps.

First set alternate shortcuts for the normal menu options by opening the Keyboard Preference Pane and click on the last
tab "Keyboard Shortcuts".  Add a new shortcut, selecting "Mail" as the application, "Reply" as the menu title, and give
it some obscure shortcut (I'm using &#8984;&#8997;R).  Repeat to remap "Reply All" as well (I'm adding a &#8679; to the
previous shortcut).  Relaunch Mail.app for the changes to take effect.  Then you can setup the scripts and assign them
as triggers within Quicksilver for use specifically within Mail.app.

[his applescript]: http://daringfireball.net/2007/07/non_top_posting_scripts
[FastScripts]: http://www.red-sweater.com/fastscripts/
[Quicksilver]: http://quicksilver.blacktree.com/

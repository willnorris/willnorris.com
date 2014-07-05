---
title: Double Click-Throughs
wordpress_id: 69
date: 2005-08-22T10:57:01-07:00
categories:
- technology
tags:
- design
- apple
- ui
- netnewswire
---
### Preface ###

When I started thinking about this topic about a week ago, it was originally going to be a rant about [NetNewsWire][]
and how its click-through behavior was so frustrating.  Upon doing a little research however, I discovered this problem
is not specific to NNW, but all OS X applications, and I'm certainly not the first person to talk about it (John Gruber
has a number of [interesting reads][]).  I have stumbled upon something however that I've been unable to find mentioned
elsewhere online, and that's the inconsistency between single and double click-throughs in an application.

First, a definition from the Apple [Human Interface Guidelines][HIG] to make sure we're all on the same page, and not
talking about [banner ads][] --

> An item that provides **click-through** is one that a user can activate on an inactive window with one click, instead
> of clicking first to make the window active and then clicking the item.

Often, click-through is discussed in terms of whether or not an inactive application "receives" the click.  Developers
have the choice of making click-through active on most any object within an application, and there are various schools
of thought on what should and should not allow click-throughs.  I'm more interested however in "double click-throughs",
or whether an application receives a "double click" message when it is inactive.


### An illustration ###

As I've already mentioned, this all begin with an annoyance I discovered in NetNewsWire; here's my basic workflow

* browse through headlines in NNW
* open full article text in Safari
* after reading article, close Safari window and click back to NNW

This works okay, unless in clicking back to NNW I want to select something other than what is currently selected.  For
example, if I currently have _CNN.com_ as my selected feed, and I click on my _Slashdot_ feed with NNW being inactive,
then all that happens is that NNW becomes the active window.  I must then click once again to actually select the
Slashdot feed -- this is completely expected behavior when click-throughs are turned off.  What is __not__ expected
however, is that if I perform this second click too quickly, then NNW receives a double-click action and opens the
Slashdot homepage in my browser.  The problem is that NNW does __not__ allow single click-throughs but it __does__ allow
double click-throughs.  The only way to make a new selection in NNW while it is inactive is to click once to make it
active, pause for a moment, and then make your actual selection.  _Talk about annoying!_

I realize I'm kind of picking on NetNewsWire, but that's only because this is where I first noticed the issue. Apple
applications are no exception - this inconsistency in click-throughs can also be found in iChat's Buddy List window and
Mail message listings (though I'm sure there are many others).  iTunes' track window seems to behave consistently
however -- neither single or double click-throughs are registered -- so apparently it is possible.

### The Remedy ###

I'm certainly not a skilled interface designer, so I'm not about to jump into the debate (religious war?) of when
click-throughs should and should not be allowed.  I am however quite skilled at the role of "end-user" and can recognize
inconsistency when I see it.  I've only toyed in Interface Builder quite briefly, so I don't know if it has different
properties for single and double click throughs.  If not, I would suggest some mechanism for consistency be added, and
if it's already there then I would suggest to developers to use the same value for both.

[NetNewsWire]: http://ranchero.com/netnewswire
[interesting reads]: http://www.google.com/search?q=click-through+site%3Adaringfireball.net
[HIG]: http://developer.apple.com/documentation/UserExperience/Conceptual/OSXHIGuidelines/
[banner ads]: http://en.wikipedia.org/wiki/Click-through_rate

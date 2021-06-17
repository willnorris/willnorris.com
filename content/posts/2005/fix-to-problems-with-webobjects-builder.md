---
title: fix to problems with webobjects builder
date: '2005-07-05T22:30:02-05:00'
aliases: [/b/p, /p/49]
categories:
- technology
tags:
- webobjects
- wobuilder
---
With all the recent happenings in the WebObjects world the last month or two, I've been all kinds of ADD in trying to
decide how to procede with a project I'm working on, but discovered something very useful tonight.  In using Eclipse &
WOProject for development, I've occasionally run into some problems, one in particular with my "Application" and
"Session" objects not appearing in WebObjects Builder.  One hint I've picked up along the way is to open the project in
Xcode and leave it running in the background -- this enables the inter-application communication WOBuilder requires.
Tonight I also discovered that WOComponents must extend a class named "WOComponent" and must also import
"com.webobjects.appserver.\*".  Now this may seems really obvious, but allow me to explain.

Components ultimately extend from `com.webobjects.appserver.WOComponent`, but WOBuilder looks to the direct parent class
expecting to find 'WOComponent'.  I have a base component class that all of my components extend,
`com.hedmaster.components`, which then extends `com.webobjects.appserver.WOComponent` in turn.  This isn't enough for
WOBuilder... I had to rename my component base class to `com.hedmaster.WOComponent`.  This can get tricky when you have
a class extending another class of the same name, and also causes other interesting problems you'll surely run into, but
it can be done.

The other strange thing is that Components must include the line `import com.webobjects.appserver.*`.  Even if your
component doesn't use any of the classes in this package directly, you have to import them for WOBuilder's benefit.
They have to be imported directly by the Component... I tried importing them in my component base class, but it was a no
go.  If anyone knows of ways around either of these, I'd more than welcome the hints.

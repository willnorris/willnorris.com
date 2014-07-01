---
layout: post
title: embedding data into podcasts
wordpress_id: 37
date: '2005-06-17T17:20:39-07:00'
categories:
- technology
tags:
- itunes
- podcasts
- apple
---
> As a teacher, I'd love to have lectures podcasted and have the ability to embed Word or Keynote docs or hyperlinks
> somehow as well! I know album art and links to the iTMS are what will pay for some of this, but why not add capacity
> and watch a new market emerge?! 
>
> <footer>– [message board post](http://forums.appleinsider.com/showthread.php?postid=782254#post782254)</footer>

During his [WWDC Keynote][], Steve Jobs demoed the podcasting capabilities of the upcoming version of iTunes and
displayed a "New Music Tuesdays" podcast setup by Apple.  What made this one particularly interesting is that album
artwork changed _during_ the podcast to display the currently playing track.  They've apparently extended their album
art metadata to support multiple images that each span a very specific portion of the file.  It's certainly a very
interesting case of what can potentially be done.

However, I'm not so sure that embedding a Keynote presentation into an audio file is the best idea -- it definitely
seems to be taking the wrong approach.  Podcasting aside, an excellent language called [SMIL][] exists to create
multimedia presentations consisting of multiple types of embedded media files, and since [Quicktime already plays
nice][quicktime+smil] it would seem that iTunes could play the files without much work.  One could certainly enclose a
SMIL file into an RSS feed, but I don't know if it would integrate as easily as existing podcasts; it would certainly be
interesting to find out.

[WWDC Keynote]: http://www.apple.com/quicktime/qtv/wwdc05/
[SMIL]: http://en.wikipedia.org/wiki/Synchronized_Multimedia_Integration_Language
[quicktime+smil]: http://developer.apple.com/documentation/QuickTime/IQ_InteractiveMovies/quicktimeandsmil/chapter_10_section_4.html

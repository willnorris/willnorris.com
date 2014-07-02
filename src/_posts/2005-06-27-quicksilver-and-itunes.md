---
layout: post
title: quicksilver and itunes
wordpress_id: 43
date: 2005-06-27T12:26:01-07:00
categories:
- technology
tags:
- itunes
- applescript
- quicksilver
- osx
---
I'm generally a big fan of the Unix axiom of applications doing one thing and doing it well, but when each of those
applications is running all the time and takes up 20MB of active memory I tend to make an exception and [Quicksilver][]
is providing an excellent alternative to several smalls apps I use.

[Quicksilver]: http://quicksilver.blacktree.com

I originally used [MenuTunes][], and most recently [Synergy][] to provide global "hotkeys" to do some simple things like
play/pause iTunes, skip to next or previous track, and display some information about the current track.  Quicksilver's
triggers are ideal for this -- it allows you to create keyboard shortcuts to perform any Quicksilver action.  This let
me setup keys for play/pause and next/previous track.

Additionally I setup the iTunes Quicksilver plugin to display track notifications and to send those notifications to
[Growl][], however the plugin only displays notifications when something happens like the track changes.  I want to be
able to display track info at any time so I whipped up this simple Applescript, saved it to my scripts folder, and
assigned it to a Quicksilver trigger.  This will display the exact same as the built-in iTunes notification in
Quicksilver with the addition of track time, current position, and ratings stars.  It's a very simple matter of
displaying more or less info for the track.

<figure class="aligncenter">
  <img src="itunes-notification.jpg" alt="Screenshot of Growl notification showing the current song playing in iTunes">
</figure>

[updated 09 Aug 2005 to work when no artwork is present]

``` applescript
tell application "iTunes"
    set currentTrack to current track
    set theArtworks to artworks of currentTrack

    if ((count of theArtworks) > 0) then
        set theArtworkData to data of item 1 of theArtworks
    else
        set theArtworkData to null
    end if

    set theArtist to artist of currentTrack
    set theAlbum to album of currentTrack
    set theTime to time of currentTrack

    -- set the rating stars
    set theStars to ""
    set theRating to rating of currentTrack
    set bStar to Â«data utxt2605Â» as Unicode text
    set wStar to Â«data utxt2606Â» as Unicode text
    repeat 5 times
        if (theRating > 0) then
            set theStars to theStars & bStar
            set theRating to (theRating - 20)
        else
            set theStars to theStars & wStar
        end if
    end repeat

    -- get player position and format to MM:SS
    set positionMinutes to (player position div 60)
    if (positionMinutes < 10) then Â¬
        set positionMinutes to "0" & positionMinutes
    set positionSeconds to (player position mod 60)
    if (positionSeconds < 10) then Â¬
        set positionSeconds to "0" & positionSeconds
    set thePosition to positionMinutes & ":" & positionSeconds
end tell

tell application "GrowlHelperApp"
    if (theArtworkData is not null) then
        notify with name Â¬
            "iTunes Notification" title Â¬
            name of currentTrack description Â¬
            theArtist & return & theAlbum & return & thePosition Â¬
                & " / " & theTime & "     " & theStars application name Â¬
            "Quicksilver" pictImage theArtworkData
    else
        notify with name Â¬
            "iTunes Notification" title Â¬
            name of currentTrack description Â¬
            theArtist & return & theAlbum & return & thePosition Â¬
            & " / " & theTime & "     " & theStars application name Â¬
            "Quicksilver" icon of application "iTunes"
    end if
end tell
```

[Growl]: http://www.growl.info/
[MenuTunes]: http://www.ithinksw.com/products/menutunes/
[Synergy]: http://synergy.wincent.com/

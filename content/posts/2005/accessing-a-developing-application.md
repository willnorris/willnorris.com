---
title: Accessing a Developing Application
date: '2005-01-26T20:12:00-06:00'
aliases: [/b/3ZW1, /b/G, /p/16]
categories:
- technology
tags:
- webobjects
---
This isn't a very involved tip, but I could have really saved my butt a few weeks ago when I couldn't get an updated
version of [hedmaster][] deployed, just hours before it was scheduled to go live.  This explains how to make a
WebObjects application on your development mac temporarily available to outside users, either for testing or a very
quick-and-dirty production site.

Add the launch option `-WOPort 50000` (or some other port) to your run configuration in whatever IDE you use to develop
WebObjects.  Normally WebObjects will randomly choose a port to use in this upper range, but it's nice to have a static
port it always launches on.  Then open your "Sharing Preference Panel", go to "Firewall" (you do have your firewall
turned on don't you?), and click "New".  Select "Port Name: Other", "Port Number: 50000", and "Description: WebObjects".
Then it is a simple matter of enabling this new firewall rule in order to give others temporary access to your
developing application; when you're done, just turn it off and don't worry about others snooping in on your
"not-quite-ready-for-primetime" build.

[hedmaster]: /projects/hedmaster

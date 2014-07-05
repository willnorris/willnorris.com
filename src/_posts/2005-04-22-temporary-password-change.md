---
title: Temporary Password Change
wordpress_id: 10
date: 2005-04-22T09:39:12-07:00
categories:
- technology
tags:
- osx
- ldap
- opendirectory
---
I was thinking about something this morning and wanted to write it down before I forget... here at [Visible School][] we
often need to login to a user's machine as that user while we're working on it to ensure proper file permissions, set
preferences, etc.  Typically, the easiest thing to do is to change the user's password to something generic, and then
have them change it back when we're done with their machine.  Wouldn't it be much easier though to create a new LDAP
attribute called 'password_bak'; then copy the user's password into that new attribute, change 'password' to something
temporary, and then copy the user's password back into place when you're done.  We could login with their account while
we were working on the computer, and everything would be completely transparent to the user.  I'm pretty sure [Open
Directory][] does some weird things with the password attribute in LDAP so I'm not sure how easy it would be with OS X,
but it's certainly an idea worth pursuing.

[visible school]: http://www.visibleschool.com
[open directory]: http://www.apple.com/server/macosx/open_directory.html

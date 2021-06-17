---
title: Address Book features in Tiger
date: '2005-04-12T09:59:17-05:00'
aliases: [/b/C, /p/12]
categories:
- technology
tags:
- osx
- ldap
---
*After reading back through this, I realize this has less to do with the new Address Book features and more to do with
structuring your enterprise correctly...  the new features just really got me thinking about it I guess.*

So Apple just announced today that Tiger would ship on April 29, and I'm just giddy like a little school girl... it's
quite ridiculous really.  I've been looking at all the new features that are to be included and was really impressed by
the new stuff in [Address Book][].  Because of some recent stuff we've been doing at Visible, I had this great vision of
how things could (and should) work.

Visible School is holding a large fundraiser later this month and Rick has been working on sending out personlized
invitations to a rather large group of people.  He's been keeping track of everyone's information in an Excel
spreadsheet and is then doing a mail merge in Word to create the letters and all.  He could have done the same for
envelope labels, but they opted to just hand-write them (not sure why).  Anyway, the problem is that the only copy the
school has of these people's contact info is in the spreadsheet on Rick's computer.  These could be potential future
donors so it would be nice to have them in a more permanent spot, so imagine this scenario --

All of these guests are entered into Visible's master LDAP directory... they could be in their own branch if need be,
but it would likely suffice to simply put them in the main users branch with an [eduPersonAffiliation][] of "donor" or
something.  Some of the contact information for some of these people may be private so we would set permission levels
accordingly (and because Address Book allows you to authenticate to LDAP it would all be transparent to the end user).
Rick could then just open Address Book and search for "donor" (some customization would need to be done so that the
eduPersonAffiliation field would show up), then use the new label printing feature that will be added in Tiger to print
out labels.  I would imagine he could also export them in a format to be used for a mail merge to do the covers letters.

So how is this different than just using a spreadsheet?  Well, on the front-end it wouldn't be much different...
probably about the same amount of work (if not a tad bit more).  However, all of these donor's information would now be
stored where they belong... in Visible School's master contact database.  As we get more donors they are simply added as
well, and when the next fundraiser comes along, Rick simply searches for "donor" again.  It doesn't seem all that
revolutionary, but if you could see the way things are done now you'd understand how great this would be.

[address book]: https://web.archive.org/web/20050412/http://www.apple.com/macosx/features/addressbook/
[eduPersonAffiliation]: http://www.nmi-edit.org/eduPerson/draft-internet2-mace-dir-eduperson-00.html

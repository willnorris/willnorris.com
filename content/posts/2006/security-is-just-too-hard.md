---
title: security is just too hard
date: '2006-01-22T19:21:46-06:00'
aliases: [/b/2C, /p/132]
categories:
- identity
tags:
- ssn
- privacy
- security
---
I take protecting my personal privacy and security very seriously.  I burn old bank statements and receipts, refuse to
give my SSN to almost every company that asks for it, and wouldn't give my computer password to my own mother.  So when
I was asked to fax a document containing lots of personal information, I had a real problem with it.  The document in
question came from a company where I'm applying for a job, and was a standard form for doing a background check.  While
I understand the need to do these checks on potential employees and don't have too much of a problem with it, I do have
a problem with sending my personal information (including SSN, driver's license number, and birthdate) over an
unencrypted fax machine.  Being the security-concious person that I am, and also out of morbid curiosity, I decided to
see how much extra effort it would take to transmit this form in a completely secure manner.

I should note however, that I realize this company probably faxed that document on to whatever agency they hire to do
these background checks in a completely insecure fasion.  My information is probably being stored in a unlocked (or
poorly locked at best) file cabinet, with a digital copy stored on a poorly protected computer running Microsoft Windows
without the latest security updates.  Given the attitude toward personal privacy and security that exists in the typical
workplace today, there was really very little point in taking the extra effort to transmit my information to them
securely.

### Mission <s>Impossible</s> Really Difficult ###

I first contacted the company and explained to them my concerns with sending such sensitive information over a fax
machine, and verified that it would be okay to scan the completed document and transfer that to them.  Immediately I was
met with my first hurdle - scanning the completed form.  You wouldn't expect this to be all that difficult, except that
all of the scanners at my current employer are network based.  This means they scan the document, and then either
transmit it directly to your computer (if you have their special software installed) or simply email it to you as an
attachment.  These are very convenient when you have a lot of people using the scanners, however they are incredibly
insecure when the document your are scanning has sensitive information because they don't use any type of encryption
(such as SSL).  I spent a good 30 minutes hunting around for a standard USB scanner I could connect to my laptop, and
the only one I found was rather old and didn't have OS X drivers.

I was finally reminded that the student computer labs have scanner workstations, but how would I then securely get the
file off that machine and onto my laptop?  Plain email was out of the question, as was scp (since these were Windows
machines).  The best solution was of course the simplest - a flash drive.  I first attempted to use two different iPods,
but both were identified as not being formatted.  On my third trip to the computer lab, I brought a standard USB flash
drive (as well as a blank CD just in case), and finally got my document scanned.  Due to the workstation not properly
recognizing the iPods and having to wait in line to use the one scanner, this took almost an hour.

Finally, I had to get this document sent back to the company.  Of course, they don't have email certificates setup, so I
can't simply send an encrypted email.  The easiest secure way would be to put the document on a password-protected,
secure website.  Fortunately for me, my current employer offers web space for all students and staff which only works
over SSL anyway.  This system ([Xythos WFS][]) also allows pretty fine grained control over file access permissions, as
well as the ability to create a time-based "ticket" to allow access.  I then emailed this ticket to the company, and
called them to give them the password -- it wouldn't make any sense to include the password in the email since it wasn't
encrypted.  The link, however, was something like 70 characters long and ended up getting split between two lines and
Microsoft Outlook, together with all the King's horses, couldn't manage to put it back together again.  I then setup a
much shorter URL on my local workstation that simply redirected to the previous URL and emailed this shorter URL to
their HR department.  After calling them back and giving them the proper password for the ticket, they were finally able
to securely download my completed document.


### In an Ideal World... ##

So how _should_ this transaction have gone down?  Ideally, one of two very simple things should have happened.  First,
they could have setup email certifcates to allow for encrypted email.  Outlook actually handles certificates very
gracefully and there are a number of companies that offer email certs [for free][Thawte].  The original they sent
containing the blank form to fill out would have also included their public email certificate.  My mail client would
have recognized that and automatically installed it into my keychain so that when I replied, it would immediately detect
that I had the option of encrypting it for that recipient.  Perhaps an easier solution would have been for their HR
department to setup a secure website where I could upload the files into a "dropbox" where they could then access it.

All in all, it took right at 2 hours to do something that should have taken about 30 seconds.  Given today's technology
and how easy it is to setup secure websites and email (neither of the above solutions would take more than an hour to
setup), it's ridiculous that more companies aren't doing it.  But given how difficult was for me to securely send some
basic information (and I work with this stuff everyday), it's no wonder people just shrug it off and don't worry about
it.  I think the real problem here is that people simply don't understand the importance of this, or they are terminally
infected with "it wouldn't happen to me" syndrome.  In either case, all it takes is a little education on how serious
this matter is and how easy it really is to protect themselves and others.  Oh, how I look forward to the day when truly
secure transmission of personal data is the rule instead of the exception.

[Xythos WFS]: http://www.xythos.com/home/xythos/products/products_wfs.html
[thawte]: http://www.thawte.com/secure-email/personal-email-certificates/index.html

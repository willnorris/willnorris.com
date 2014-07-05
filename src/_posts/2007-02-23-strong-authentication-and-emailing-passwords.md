---
title: strong authentication and emailing passwords
wordpress_id: 176
date: 2007-02-23T17:24:36-08:00
categories:
- identity
- technology
tags:
- openid
- myopenid
- dreamhost
- textdrive
---
So this afternoon, I happened across [i@mdentity][] listed in the [OpenID Directory][].  They seem to be some kind of identity provider in the UK that has their own authentication protocol that they have a small number of vendors using.  In addition to this centralized authentication, they also support OpenID.  What really caught my attention was first that they emailed me my initial password... never a good idea, but I'll come back to that later.  The other very interesting thing was the proprietary authentication model they setup.  From the looks of it, you enter your iamdentity username and password at the service provider website, instead of being redirected to the identity provider (...not good).  But then, you are immediately emailed another one time use token (a five digit number) that you must immediately use to complete the authentication.  Alternately, you can have them send the token as an SMS message to your phone (for a fee, I believe).  So in order to compromise your account, someone would not only need to know your username and password, but actually have physical access to your cell phone (or the ability to hack the wireless phone network, I guess).  The way I read it, it sounds like a new token is necessary each time you sign into a different service provider.  While this may be a little bit overboard for most OpenID transactions and effectively kills single-sign-on, this certainly is a different way to raise the level of assurance of the authentication.  

Of course, [prooveme.com][] provides another way -- client certificates, although I never got it to work under Safari.  I guess it tried to automatically install the certificate for me, because I now have a couple of prooveme keys in my MacOS X keychain, but none of them appear in Safari. By the way, Safari's support for dealing with multiple client certificates absolutely sucks and filing a bug with Apple like a year ago got no reply.  And why the heck doesn't prooveme allow me to upload my existing SSL client cert that I have with Thawte?  So anyway, if and when OpenID really starts to see usage outside the blogosphere, and even just as the number of services a single password can get you into grows, I think stronger authentication like this is going to become much more important.  So \*poke, poke\* at my [OpenID provider of choice][MyOpenID] -- I'd love to see some kind of stronger authentication along this line that is beyond simple username and password.

And what originally prompted this post... I've always thought fairly highly of the folks at [TextDrive][], and was strongly considering returning to my TxD VC account after [Dreamhost announced][] their **entire** datacenter was going down for four hours this weekend (which means this site will be down).  But TextDrive certainly lost a couple of cool points with me this morning in response to my forgotten password request...

<blockquote><pre>
To: will@willnorris.com
Subject: Update on Your Request {64999}
Date: Fri, 23 Feb 2007 16:54:03 +0000
From: "Help @ TextDrive" <help@textdrive.com>

Hi Will,

the current password appears to be '********'.

Regards,

Filip Hajny
Customer Support Manager
Joyent Inc.
</pre></blockquote>

Yes, they emailed me my password in plaintext.  The single password that accesses all services at TextDrive -- email, website, SSH, all mysql databases, everything.  The only one of those that really irks me is the fact that mysql uses your main password, but the fact that they emailed it to me unencrypted in plaintext just kills me.  I'd love to see a company, hell **any** company, that allows me to upload my public PGP key or SSL certificate and choose to have them encrypt all communication like this that they send to me.

[update] I should add that it's not the fact that someone would email my password unencrypted... sadly, that happens all the time.  The thing that shocks me is actually **who** did it... I generally regard the TextDrive guys as really smart and on top of their game, but if this is their general policy then maybe I gave them too much credit in some areas.

[update2] The other annoyance with TxD was the fact that they did nothing to vet my identity.  They could have easily had me verify a billing address, phone number, or whatever other information I gave them when I signed up years ago.  Generally I despise the use of person-based data for authentication (particularly those "what is your favorite sports team" security questions) because of the **very** false sense of security they create, but anything would have been better than just blindly sending someone's password in response to an unverified email request.

[i@mdentity]: http://iamdentity.com/
[OpenID Directory]: http://openiddirectory.com/
[prooveme.com]: http://prooveme.com/
[MyOpenID]: http://myopenid.com/
[TextDrive]: http://textdrive.com/
[Dreamhost announced]: http://www.dreamhoststatus.com/2007/02/22/planned-power-outage/

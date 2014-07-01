---
layout: post
title: All https, all the time
wordpress_id: 985
date: '2012-12-16T21:10:09-08:00'
categories:
- technology
tags:
- https
syndication:
- https://plus.google.com/+willnorris/posts/ACBL82ZPXNF
---

<aside class="alignleft"><figure>
  <img src="https-willnorris-com.png" alt="willnorris.com secure URL" />
</figure></aside>

This weekend, inspired by Tim Bray's recent post <cite>[Private By Default][]</cite>, I changed my website
[willnorris.com][] to serve all traffic using HTTPS.  At least for the time being (read: until I find something I've
terribly broken), all non-HTTPS traffic will be redirected to the secure version of the site.

I've had HTTPS support enabled on my site for about a year, primarily for ensuring that my own credentials were secure
when logging into the WordPress admin section of the site.  You could always manually browse to the secure version of
any page if you manually typed in the 'https', I just never really advertised it.  Now this site is all HTTPS, all the
time.

[Private By Default]: https://www.tbray.org/ongoing/When/201x/2012/12/02/HTTPS
[willnorris.com]: https://willnorris.com/

## Why ##

Tim has an [excellent list][] of reasons why privacy should be the default, but it was his first point that really
resonated with me:

> This blog isn’t terribly controversial. But if only the “controversial” stuff is private, then privacy is itself
> suspicious. Thus, privacy should be on by default.

In a free society, one shouldn't have to justify their right to privacy.  Our view on privacy has gotten so mixed up
that "Well, what have you got to hide?" is accepted as an almost *reasonable* question.  As Bruce Schneier puts it so
eloquently in his essay <cite>[The Eternal Value of Privacy][]</cite>,

>  A future in which privacy would face constant assault was so alien to the framers of the Constitution that it never
>  occurred to them to call out privacy as an explicit right. Privacy was inherent to the nobility of their being and
>  their cause [...] It's intrinsic to the concept of liberty.

So why make communication with this little site private?  Because I can; it's the one small part of the Internet that I
do have complete control of.  It doesn't protect *my* privacy in any way... my site is accessible by anyone.  But it
does help protect *your* privacy, as anyone listening in on your Internet traffic won't know what you're looking at.
And more importantly, it helps combat the notion that privacy is reserved for controversial stuff.

One of the things I've really appreciated about [Indie Web Camp][] is its focus on *builders*, people actively working
to further the principles of owning one's own identity and content online.  While there is certainly effort spent on
making these solutions usable for a non-technical audience, the first step must be to get things working on our own
sites.  If, like Tim Bray, I believe that the web should be private by default, then I first have to make my own site
private by default.

[excellent list]: https://www.tbray.org/ongoing/When/201x/2012/12/02/HTTPS#p-2
[The Eternal Value of Privacy]: https://www.schneier.com/essay-114.html
[Indie Web Camp]: http://indiewebcamp.com/

## Flipping the Switch ##

There's basically three steps to having a secure website: finding a web host in your budget that will support HTTPS,
getting an SSL certificate, and configuring your site to use HTTPS.

Until relatively recently, you effectively needed a private IP address to run a secure website.  And for the last year,
I've been doing just that by running my site from a virtual private server at Joyent, and it's a much more expensive
hosting option.  However, client support for [Server Name Indication][], which allows multiple secure sites to share an
IP address, is now at a point that shared hosting providers are beginning to support secure sites for reasonable prices.
This weekend, I moved my site to the [new TextDrive][], which easily supports SNI on their shared hosting accounts at no
additional cost.

As for the SSL certificate itself, Tim recommends a few sources in his article.  Personally, I use a [certificate from
Gandi][], which is also where I register my domains.  Certificates are free for the first year when you register or
transfer your domain there, and then $16 a year thereafter.  A far cry from the $100+ certificates used to cost.  There
are of course free options as well, though in my experience (particularly with StartSSL), their sites tend to be much
harder to navigate and understand.

Finally, Apache and WordPress make it very easy to use SSL.  Within WordPress, you can simply set your site URL to
include 'https' at the beginning, and all generated URLs will be secure.  Unlike Tim, I additionally chose to redirect
all HTTP traffic to HTTPS.  I did this with a simple rewrite rule in my `.htaccess` file:

    RewriteCond %{HTTPS} off
    RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [L,R]

We're finally at the point that it's not prohibitively expensive to run a secure website.  A certificate costs about the
same as a domain registration, and web hosting companies are beginning to support SNI.  There are still non-trivial
technical hurdles to get over, and perhaps more importantly, education as to why "privacy by default" on the web
matters.  But it's now at least possible.

[Server Name Indication]: http://en.wikipedia.org/wiki/Server_Name_Indication
[new TextDrive]: http://textdrive.com/
[certificate from Gandi]: https://www.gandi.net/ssl

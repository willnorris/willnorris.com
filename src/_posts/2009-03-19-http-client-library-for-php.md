---
title: HTTP Client Library for PHP
date: '2009-03-19T15:18:02-07:00'
shortlink: [/b/96, /p/546]
categories:
- technology
tags:
- open stack
- php
- http
---

**Update (Dec 2013):** If you're just looking for a good HTTP library in PHP, I currently recommend [Requests][].

As I mentioned in my [last post][], I'm currently spending a lot of time thinking about and coding PHP libraries for the
various Open Stack protocols.  I've recently hit a common roadblock with a couple of the libraries, and wanted to
solicit some feedback from the community.  Ironically enough, I'm stuck with regards to the absolutely lowest level in
the technology stack that most developers have to deal with: HTTP.  We need good HTTP support in the Open Stack
libraries to do basic things like fetching metadata documents, and sending OAuth and OpenID requests.  Some things to
think consider:

 - we don't need to worry about PHP 4
 - we need to be able to attach custom headers in the request
 - we need to be able to view the headers from the response
 - SSL support is a must
 - gzip compression is highly desirable as well
 - we need to limit any external dependencies outside of a standard PHP 5 installation, or as few as possible. (this of
 course doesn't include any code we ship as part of the library itself)
 - I'm not aware of any need for support of HTTP cookies
 - it might be nice if particular platforms could provide their own HTTP handler.  eh, maybe?
 - if we're going to redistribute code with the libraries, the license is very important

Now PHP has myriad ways to make an HTTP request, which turns out to be the problem.  Some of them are more robust than
others, some are PHP extensions that are not bundled with the main distribution, some are bundled with PHP but rely on
external libraries being linked into PHP when it's built, and some rely on specific PHP configurations.  Let's review
some of the most popular ones (and do leave a comment if I missed any):

 - **[sockets](http://php.net/sockets)** -- this is the lowest level way of doing HTTP and uses basic Internet sockets.
 As such, if provides the most flexibility, but also the largest burden in having to deal with all of the low-level
 intricacies of HTTP.  It has no external dependencies (aside from OpenSSL of course for SSL/TLS support).

 - **[file resource](http://php.net/filesystem)** -- uses `fopen` and related functions.  Requires that the PHP
 configuration option `allow_url_fopen` be enabled.  I don't believe this supports custom request headers, but would
 love to be corrected on that.  If it doesn't, this is an obvious deal breaker.

 - **[streams](http://php.net/streams)** -- this is effectively a wrapper around `fopen` but adds the concept of a
 *request context* which can be used to include custom headers and such.  Because this uses `fopen` under the covers, it
 also requires that `allow_url_fopen` be enabled.

 - **[HTTP extension](http://php.net/http)** -- this is a PECL extension that does exactly what we need.  Unfortunately,
 it's not included in the standard PHP distribution, so we certainly can't rely on it being present.

 - **[curl](http://php.net/curl)** -- one of the more popular methods, this uses the external library libcurl.  This is
 a very robust and flexible URL library that can handle everything we want to do and more.  It is relatively common on
 most PHP deployments, but because it relies on an external library, its availability is not guaranteed.

So there is no single solution that we can count on.  What's that you say?  Provide an interface and then have multiple
implementations that utilize several of the above methods?  That's a brilliant idea, but which one do we use?

 - **[php-openid](http://github.com/bce/php-openid/blob/master/Auth/Yadis/HTTPFetcher.php)** -- the current JanRain
 library currently has it's own HTTPFetcher interface with support for libcurl and sockets.  It's written pretty
 specifically for the OpenID library, so would need some cleanup to be used in any other setting.

 - **[HttpClient](http://scripts.incutio.com/httpclient/)** -- in my searching, I found this HTTP client library from
 Simon Willison.  Don't know much about the library, but I know Simon's reputation and have seen his excellent XML-RPC
 library.

 - **[Snoopy](http://snoopy.sourceforge.net/)** -- this seems to be a pretty popular HTTP client library.  It has
 support for sockets and curl.  No not libcurl, but curl the executable.  Apparently, the developers weren't comfortable
 with the stability of PHP's curl functions, so they make a system call out to the curl executable.

 - **[WP_Http](http://core.trac.wordpress.org/browser/trunk/wp-includes/http.php)** -- WordPress has a pretty robust
 HTTP client library they wrote to replace Snoopy.  It supports all of the above mechanisms (that's actually where I got
 the list).  That of course means that it's pretty hefty, and probably provides more functionality than we really need.
 It is also pretty tightly integrated with WordPress, and would require a bit of work to re-use it in any other context.

 - **[HTTP_Request](http://pear.php.net/package/HTTP_Request)** -- PEAR extension that provides seemingly pretty robust
 support.  I'm not sure what methods it supports, but I'd guess sockets and libcurl.  The downside of course is that it
 comes with all the extra weight that a PEAR extension includes.

 - **[HTTP_Request2](http://pear.php.net/package/HTTP_Request2)** -- the successor to HTTP_Request above, written with
 PHP5 style objects.  Looks like about the same level of support for HTTP, but less tested.  And of course a PEAR
 extension.

 - **[NIH](http://en.wikipedia.org/wiki/Not_Invented_Here)** -- we could, of course, always roll our own.

I'm sure there are others here that I've missed.  If you have a serious suggestion that might work for what we need,
please do include it in the comments below.  If you have another to throw on the pile, but isn't really realistic for
the Open Stack libraries, don't bother... I know there are a bunch out there.

So honestly, I'm at a loss.  As with the Open Stack libraries themselves, the most important part is the interface.  We
can always switch out the implementation later, but I really don't want to be rewriting code on a regular basis to match
the HTTP interface du jour.  I don't have terribly strong feelings for or against any of the above, I just know we need
something.  So here it is... what do you all prefer in terms of an HTTP client library for PHP?

[Requests]: http://requests.ryanmccue.info/
[last post]: /2009/03/the-open-stack-in-php

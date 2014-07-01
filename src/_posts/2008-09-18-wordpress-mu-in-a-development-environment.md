---
layout: post
title: WordPress MU in a development environment
wordpress_id: 311
date: '2008-09-18T22:44:44-07:00'
categories:
- technology
tags:
- wordpress
- mu
- buddypress
- localhosting
- wpmu
---
Most of the development I do for my job is within WordPress, so I have quite a few WordPress instances running on my local workstation.  I've been using the same [custom Apache setup][] for three years, and have been developing on WordPress for almost as long, so I've been a bit bewildered with the amount of trouble I've had the several times I've attempted to get [WordPress MU][] running on my laptop.  I identified a couple of specific problems and solutions, which I wanted to outline here.

[custom Apache setup]: http://willnorris.com/2005/05/dev_environment
[WordPress MU]: http://mu.wordpress.org/

<!--more-->
### Choosing the right hostname ###

Part of my custom setup is that I have a whole slew of bogus hostnames pointing to localhost, which Apache then dynamically maps to the correct document root.  For the most part, I just drop the TLD from the actual hostname... so *http://willnorris/* is my locally hosted development site for this blog *http://willnorris.com/*, and *http://will.norris/* is my development site for *http://will.norris.name/*.  I also keep a handful of WordPress versions running locally, so I can test plugins in those different environments -- *http://wordpress-2.3/*, *http://wordpress-2.5/*, etc.  When I began to setup my WordPress MU (and [BuddyPress][]) instance, I used the site *http://wpmu/*.  The installation went fine, but when I tried to login it failed every time.  Given that this same setup worked fine with single-user WordPress, I was quite confused.  I quickly realized though, that the authentication cookies were never being set for WPMU... in fact no cookies were.

The difference between the two versions of WordPress is the value of `COOKIE_DOMAIN` which is passed to [setcookie()][].  Both flavors of WordPress allow you to define this constant in `wp-config.php`, but they differ in what happens if it is not defined there.  WordPress sets it to the boolean false, whereas WordPress MU sets it to `'.'.$current_site->domain`.  This results in a different `Set-Cookie` HTTP header between the two.  Take for example the `wordpress_test_cookie` cookie.  WordPress sends the response header

    Set-Cookie: wordpress_test_cookie=WP+Cookie+check; path=/

whereas WordPress MU sends the response header

    Set-Cookie: wordpress_test_cookie=WP+Cookie+check; path=/; domain=.wpmu

The difference of course is the `domain=.wpmu` there on the end.  In a production environment, this wouldn't make a bit of difference.  But because I'm using fake hostnames in a development environment, this makes all the difference in the world.  You see, the [HTTP Cookie Spec][] (Section 4.3.2 Rejecting Cookies) requires that the domain attribute includes an "embedded dot".  This is a security feature that prevents a site from setting a cookie on a top level domain like ".com".  Since single-user WordPress wasn't specifying a domain attribute, it didn't have any problem setting the cookie.  Because my hostname *wpmu* doesn't contain an embedded dot, the browser was properly rejecting the cookies, preventing me from being able to login.  So our solution here was to use the site *http://wp.mu/* (note the added dot in the middle) for hosting our WordPress MU development site.

[setcookie()]: http://php.net/setcookie
[BuddyPress]: http://buddypress.org/
[HTTP Cookie Spec]: http://www.ietf.org/rfc/rfc2109.txt

### Sending Mail ###

The other main problem I had with WordPress MU was that none of the notification emails were being delivered.  This was actually a problem with single-user WordPress as well, but it didn't matter as much then.  Now I'm needing to test the account sign-up process a bit more, and so I need the activation emails that are being sent out.  It's been a long time since I've administered an email server, so I won't embarrass myself by trying to explain what the problem was (something along the lines of my ISP's SMTP server not liking what [mail()][] was sending) .  I was however able to fix it by writing a very simple plugin, [Development Mailer][], that changes a few configuration options of PHPMailer.  This works for me on Mac OS X (Leopard), but I make no guarantees for anyone else.  Keep in mind that his plugin should only ever be needed for a development environment... if you're unable to send notification emails from your production blog, then you've got other problems.

[Development Mailer]: http://willnorris.com/svn/will.norris.name/trunk/public/wordpress-content/plugins/development-mailer.php
[mail()]: http://php.net/mail

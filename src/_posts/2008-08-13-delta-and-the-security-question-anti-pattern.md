---
title: Delta and the Security Question Anti-Pattern
wordpress_id: 251
date: '2008-08-13T17:47:49-07:00'
categories:
- identity
- technology
tags:
- delta
- anti-pattern
- security questions
- antipattern
---
High on my list of most aggravating anti-patterns is that of setting up (in)security questions.  You know, where you
have to choose three questions along the lines of:

 - What is your father's middle name?
 - What is the name of your first pet?

Questions which, if answered truthfully, are incredibly easy to guess with just a modicum of research.  But if you make
something up, then you're likely to forget what answer you gave.  It is [widely agreed][] that these kinds of questions
do not provide any real security, and there are a number of tricks people recommend for creating more secure answers.  I
have my own solution, so that's not really the point of this post.  This post is about what happened when I logged onto
the [Delta website][] today.  

<figure class="aligncenter">
  <img src="delta-security-questions.jpg" alt="Screenshot of Delta Airlines website prompting to setup security
  questions" class="border" width="700">
</figure>

After logging in with my four digit PIN (no, I'm not kidding... their website only
supports four digit passwords), I was prompted to setup security questions for my account.  My account which I've had
since 2001, where I've deliberately chosen not to setup the optional security questions.  However this time, I was
notified that if I don't setup security questions by September 17th, then I will lose access to my account.  Delta has
decided to make security questions mandatory now for all of their SkyMiles customers.  That wouldn't be so bad if it
weren't for [what happens][] when you forget your security questions:

> **What happens if I can't remember my security questions or answers?**
>
> If you forget the answers to the security questions, and you exceed the maximum
> allowable attempts to answer your security questions, your PIN will be emailed
> to the address stored in your SkyMiles profile. If you don't have an email address
> on file then you can reset your PIN online provided you remember your personal
> information.

They simply email the PIN to you (in plain text) anyway!  I'm not sure what kind of "personal information" you would
have to provide if you don't have an email address on your account, but it can't be much more than address and phone
number.

So I'm left wondering why on earth they are now forcing security questions down their customers' throats.  It would be
one thing if they didn't already have an automated password retrieval process, and this was an effort to cut support
costs associated with forgotten passwords, but that's not the case.  It might also be acceptable if they recognized the
danger of simply emailing passwords around in plain text, and so enforced this based on the incorrect belief that it's
more secure.  But again, that is also not the case.  All they've managed to do is to provide someone with yet another
way to potentially gain unauthorized access to my account.  If they really wanted to beef up security, how about
allowing for more than a four digit PIN.  If you really want to make things more secure, allow me to sign in using my
OpenID which supports [multi-factor authentication][].

Of course I know this is not a unique problem by any means.  Delta is not the only, nor the worst, offender.  And I'm
not really sure why someone would want to break into my Delta account anyway... there's really nothing in there of any
value.  I know it was probably some schmuck at Delta with a three letter title and no clue about online security who
forced the delta.com team to implement this.  I know all this... it's just really aggravating.

[widely agreed]: http://www.google.com/search?q=%22security+questions%22
[Delta website]: http://www.delta.com/
[what happens]: https://www.delta.com/help/faqs/security_questions_faqs/index.jsp#cant_remember
[multi-factor authentication]: http://www.myvidoop.com/

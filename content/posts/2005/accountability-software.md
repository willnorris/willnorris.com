---
title: Accountability Software
date: '2005-05-04T09:43:50-05:00'
aliases: [/b/3a71, /b/7, /p/7]
categories:
- technology
tags:
- osx
- development
- x3watch
---
Last Fall, I started working with the developers of [x3watch][] on creating a Mac version of the software.  I had a
pretty decent working solution, but they've since contracted the work out to some firm.  I don't particularly mind that
they went with someone else, but if they attack the problem in any way similar to how the Windows version works, I think
they're gonna have trouble.

> Windows provides access to all program windows via the window handles.  Think in terms of each program has a window
> number.  That program has invisible sub-windows that each has a number.  I parse all the window handles every few
> seconds and grab the URL in the address bar where the window is id'd as a browser.  
>
> <footer>– email from lead x3watch developer</footer>

I've run across a couple of posts on the [x3church forums][] where people are using browsers that aren't supported (at
the time of the above email, Firefox was the only "major" browser known not to work).  The problem is that the above
approach relies on a specific API of a specifc operating system, as well as the browser identifying itself properly.
And what about when you don't have any browsers open, or aren't actively surfing the web?  x3watch is still processing
every window you have open every few seconds -- very inefficient.  Additionally, x3watch only grabs the URL from the
browser and must download the page _again_ in order to parse it for keywords.

The solution I created for the Mac version relies on packet sniffing.  Essentially, a process is run in the background
that listens for all incoming web traffic.  The contents of the packets can then be analyzed on the fly and logged.  I
believe this to be a much better solution, as it

- is OS and application independent -- packet analysis exists on all platforms.  This is the biggest one to me, since
the same core engine can be shared across every version of x3watch.
- does not require the page to be downloaded more than once
- could easily be expanded to include other transfer methods such as FTP (though this would use more domain matching,
and not as much content analysis)

[x3watch]: https://www.x3watch.com/
[x3church forums]: https://web.archive.org/web/20050504/http://www.xxxchurch.com/forum/

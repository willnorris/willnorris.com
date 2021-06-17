---
title: Cached Commons
date: '2010-10-15T21:38:59-07:00'
aliases: [/b/FF, /p/915]
categories:
- technology
tags:
- javascript
- cached commons
- github
---
I've been working on rebuilding the theme for my site as I find a free hour or two every now and then.  Eventually I'd
like to do a new design, but for now I'm just working on rewriting the code itself.  That will be a post for another
day, but one of my focuses is to make things leaner and faster.  One of the ways I'm looking to do that is by offloading
as much as I can, using things like the [Google Libraries API][] to load jQuery from a CDN.  I've also been thinking
about using [Modernizr][], though it [has not yet been added][] to the Google CDN (or any other CDN that I can find).  I
did however find a very interesting project tonight that is trying to address this kind of problem.

[Cached Commons][] was [setup by][] Lance Pollard earlier this summer to provide a common repository of popular (and
some not-quite-as-popular) javascript and CSS libraries.  This is a great idea, and one I'm a little surprised hasn't
been done before, at least not quite like this.  I do have a few random thoughts and concerns though that struck me as I
debated whether or not to use Cached Commons' hosted version of Modernizr:

 1. I don't know Lance Pollard.  I've never heard of him before, and I have no real reason to trust him.  Looking at his
    website and GitHub profile, he seems to be very active in the open source (and specifically ruby) community, which
    is a big credit.  By relying on his hosted version of any of these libraries, I'm taking a risk that he could change
    the hosted files and do some nefarious things to my site.  I have absolutely no reason to believe that he would, but
    it's always possible.  I don't really have this worry with Google.

 2. What happens if Lance loses interest in maintaining this project, or gets too busy to keep things up to date?
    Again, not something I worry about with a company like Google.  Now in reality this isn't really an issue for a
    number of reasons.  First of all, it's not likely that I would absolutely **need** the latest version of a given
    library sooner than Lance would get around to adding it to Cached Commons.  And because all of his work is being
    done in the open, especially being hosted in GitHub, I or anyone else could make a complete copy of all his work in
    a matter of minutes and maintain it ourselves.

 3. Cached Commons is powered by [GitHub pages][], which is certainly faster than pulling the files directly out of the
    git repository as Lance [points out].  However, I'm pretty sure it's not actually a CDN in the traditional sense, so
    it's not as likely to have the same speed or reliability over time.  That being said, I have no reason to believe
    that GitHub would be any less reliable than my own site, which is hosted with [Joyent][].

 4. One of the biggest benefits of using javascript libraries from the Google Libraries API has nothing to do with the
    speed at which the data can download, but rather the fact that it may not need to be downloaded at all.  As more and
    more sites begin to use the same exact copy of a particular library, the higher the likelihood that a given user
    will already have the file in their browser cache.  So if a user has visited **any** site in the last year or so
    that uses the Google Library API to host jQuery for example, there's a decent chance that it won't need to be
    downloaded again and your site will load all that much faster.  This is really more in reply to Lance's [comment][]
    about jQuery loading faster from Cached Commons than from Google... it's about more than just transfer speed.  But
    for things like Modernizr that aren't included on the Google CDN at all, Cached Commons is certainly a good
    potential alternative.

 5. Another important principal when trying to optimize speed is to serve static content from a [cookie-less domain].
    Cached Commons is not cookie-less because Lance uses Google Analytics on the site.  Of course, the only way that a
    user would have a cookie set for Cached Commons is if they had visited the site directly, which for most users will
    be pretty unlikely.  However, it is something to consider.  This could be addressed by using different hostnames for
    the website and the file repository, but at this stage it's probably not worth the effort.

 6. Finally, I'm very curious how the folks at GitHub feel about this project.  I'm sure they didn't exactly intend for
    GitHub pages to serve as a blind file server for the world, but then again, maybe this is the kind of project they
    had in mind... GitHub pages is certainly optimized for hosting static files.  But it's still not quite the same as
    Google committing to support their Library API, and designing the service for exactly that purpose.  GitHub is,
    without a doubt, one of my favorite services in recent years, and I certainly wouldn't want to abuse that service in
    any way.

In the end, I'll quite likely use Cached Commons for hosting various libraries like Modernizr... you have to find a
balance in all these things, and the ease of just linking off to them is quite attractive.  I'd love to see GitHub
actually work with Lance and make this a real service that they offer similar to [GitHub RubyGems][] (and others?).  All
in all, the work Lance has done on this is great... I've been wanting something like this for a long time, and am very
pleased with what he's come up with.


[Google Libraries API]: http://code.google.com/apis/libraries/
[Modernizr]: http://www.modernizr.com/
[has not yet been added]: http://code.google.com/p/google-ajax-apis/issues/detail?id=299
[Cached Commons]: http://cachedcommons.org/
[setup by]: http://viatropos.com/blog/github-as-a-cdn/
[GitHub repository]: http://github.com/viatropos/cached-commons
[GitHub pages]: http://pages.github.com/
[points out]: http://viatropos.com/blog/github-as-a-cdn/#gotchas
[Joyent]: http://www.joyent.com/
[comment]: http://viatropos.com/blog/github-as-a-cdn/#comment-78181598
[cookie-less domain]: http://code.google.com/speed/page-speed/docs/request.html#ServeFromCookielessDomain
[GitHub RubyGems]: http://gems.github.com/

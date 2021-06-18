---
title: Fix old broken URLs with mod_rewrite
date: '2005-01-13T15:03:57-06:00'
aliases: [/b/3ZG1, /b/H, /p/17]
categories:
- technology
tags:
- apache
- web
- modrewrite
---
> Despite the tons of examples and docs, mod_rewrite is voodoo. Damned cool voodoo, but still voodoo. 
>
> <footer>– Brian Moore</footer>

I've been using [mod_rewrite][modrewrite] for some time now for various things, but just recently I've really started
diving into it in order to make [cool URIs][] for skillet.com.  The document root is presently a mess, and I want to
clean that up for so many reasons, but at the same time I can't risk breaking existing URLs.  It took a good little bit
of reading and experimenting, but I finally got mod_rewrite to do what I want.

[modrewrite]: http://httpd.apache.org/docs/mod/mod_rewrite.html
[cool URIs]: http://www.w3.org/Provider/Style/URI.html

What I was trying to do was pretty simple... I simply wanted to provide a list of old URLs and have them be redirected
to a list of new URLs.  This is precisely what [RewriteMap][]s are for, but it took me a little while to really get the
hang of them.  To save anyone else who is working on this a little time, allow me to explain what I did.

[rewritemap]: http://httpd.apache.org/docs/mod/mod_rewrite.html#RewriteMap

I first created a map file that contained a list of file replacements -- first the old file, then some whitespace, then
the new file...

    #/home/skillet/domains/skillet.com/rewrite-map.txt

    /news2/westwood_jan_05.html     /news2/westwood
    /news2/grammy-nomination.html   /news2/grammy
    /skilletnews.gif                /images/titles/news.gif
    /skillet-chat.gif               /images/titles/chat.gif
    /skillet-photos.gif             /images/titles/photos.gif
    /skillet-pics.gif               /images/titles/pics.gif
    /skillet-press.gif              /images/titles/press.gif
    /skillet-promo.gif              /images/titles/promo.gif
    /skillet-tour.gif               /images/titles/tour.gif
    /skillet-video.gif              /images/titles/video.gif

I then added a new [RewriteMap][], which I chose to name "rewrite-map" (but you can name it anything you want), inside
of the skillet VirtualHost.  This is the only thing you might have trouble with if you use a shared hosting provider,
most of the time you don't have access to the httpd.conf file, just your .htaccess.  (RewriteMaps __have__ to be defined
inside the server config or virtual host, though they can actually be used elsewhere)

    <virtualhost>
        ...

        RewriteEngine On
        RewriteMap rewrite-map txt:/home/skillet/domains/skillet.com/rewrite-map.txt

        ...
    </virtualhost>


Finally, I added the RewriteRule to the .htaccess.

    #/home/skillet/domains/skillet.com/public_html/.htaccess

    RewriteEngine On

    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule .* - [L]

    RewriteCond ${rewrite-map:%{REQUEST_URI}} (.+)
    RewriteRule .* %1 [L,R]

Now this doesn't make quite as much sense, so let's analyze what we're doing here.  The first rewrite condition checks
to see if the requested file exists on the file system.  If it does, then we simply exit with no changes (that's what
the RewriteRule does) -- no sense in looking through the rewrite-map if we don't have to right?  The next RewriteCond
takes the requested URI and looks it up in the rewrite-map.  If the result is non-null, we continue on; without this
RewriteCond, we'd go into a nasty infinite loop of rewrites.  Finally, the last RewriteRule replaces the entire URI with
the result of the lookup we just performed in the RewriteCond and redirects the user.  If the requested file doesn't
exist on the filesystem and there is no entry for it in the rewrite-map, a 404 Error is returned.

If you have a lot of entries in your map, you might consider using a hash file.  It provides quicker lookups, but the
downside is that you have to rebuild the hash anytime you add new entries.  With the plain text map, you can add entries
at any time and they'll automatically be grabbed by apache.  If you're interested in hash files, search
[here][modrewrite] for "hash file".

So does it work?  Try going to `http://www.skillet.com/skilletnews.gif` and you should be redirected to
`http://www.skillet.com/images/titles/news.gif`.  [Perhaps ironically, in the years since this post was
written, the site has changed and neither link works any longer.]

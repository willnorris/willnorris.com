---
title: Setting up a web development environment
wordpress_id: 5
date: '2005-05-07T01:52:48-07:00'
categories:
- technology
tags:
- apache
- web
- development
---
At any given time, there are about a dozen or so websites that I help develop in some form or another.  The easiest way
to work on a site is to maintain a copy of it on my local machine... nothing special there.  However, what if you want
to view the development version of the site?  Just fire it up in your web browser.  What if you use server side
scripting like PHP that needs to be run?  OS X has a built-in webserver making this fairly simple by placing the files
in your `~/Sites/` folder.  But what if your site contains links that are relative to the site root such as `<img
src="/images/logo.jpg" />`?  Because you would be accessing this site as `http://localhost/~username/test_site/`, your
image will fail do load.  You could setup VirtualHosts for each of your development sites, and in fact I did this for a
long time.  The problem is that this can become a big annoyance and is an awful lot of work, especially if you have a
large number of sites in development.

Apache's [VirtualDocumentRoot][] directive allows you to dynamically set the document root  based on the host name that
was used to request the document.  So what we want to do is to create a unique host name for each website that we're
working on, and have apache find the appropriate document root for that particular site.  We'll start with just one
development site - example.com.  First we need a place to store the files for this site.. how about
`~/Sites/example/public_html/`.  I put everything in a 'public\_html' folder because I will often intentionally store
some files _outside_ of the document root, such as configuration files that contain passwords and such (for that I would
use `~/Sites/example/include/` which I would also then add to my php include\_path).

Next we need a unique host name that we can use to access our site.  Apache will use parts of the hostname to determine
what folder to use, so the easiest thing is to just make them the same... so we will use "example".  (An important thing
to note here is that you _can't_ use a real domain name to access the development site.  You could however create your
own top level domain to use such as "example.dev", but it's certainly not necessary.)  Once you've decided on a host
name, you need to tell your computer that this name should resolve to the local machine.  Do this by adding an entry to
your `/etc/hosts` file along the lines of

    127.0.0.1   example

If you have more than one development site, they can all be on one line seperated by spaces...

    127.0.0.1   example1 example2 example3


Finally, you need to tell Apache to use virtual document roots.  Based on the example setup we are using, you'll want to
add the following line to your apache configuration file (`/etc/httpd/httpd.conf`)

    VirtualDocumentRoot /Users/username/Sites/%0/public_html/

In OS X, the virtual host module is not on by default so you will need to uncomment the following lines

    # Around Line 205
    LoadModule vhost_alias_module libexec/httpd/mod_vhost_alias.so
    ...
    # Around Line 248
    AddModule mod_vhost_alias.c

Additionally, you will need to turn off canonical names

    # Around Line 503
    UseCanonicalNames   Off

Then just restart apache and you _should_ be on your way.  For each additional site now, you just need to create a
folder in `~/Sites/` and add an appropriate entry to `/etc/hosts`.

__Notes:__

- the DOCUMENT_ROOT that your scripts see will still be whatever one is
explicitly defined in your Apache config file (something like
`/Library/WebServer/Documents/`), so you may run into problems if your scripts
rely on this variable.  There is no way that I know of to get around
this.

- <strike>it is not possible to have separate cgi-bin directories for each site
that I am aware of.  They will all use the system default one
(`/Library/WebServer/CGI-Executables/`).</strike>

    To allow for per-site CGI bins, comment out the ScriptAlias directive
    in the main apache config file

        # Around Line 672
        ScriptAlias /cgi-bin/ "/Library/WebServer/CGI-Executables/"

    and create an .htaccess file in each site's cgi-bin with the following:

        Options +ExecCGI
        SetHandler cgi-script

- <strike>reading of .htaccess files seems to be inconsistent.  I thought I had
them working at one time, but they don't seem to be right now.</strike>  

    By default, OS X sets `AllowOverride None` for user sites, so that .htaccess
    files are ignored -- update this in `/etc/httpd/users/[username].conf` (not
    in the main apache config file as one might expect).

- these sites will not be accessible from any other machine unless they know to
setup those host names to resolve to your computer's IP address.  This may or
may not be what you want -- it prevents someone from stumbling upon your
development site (security by obscurity), but it makes it slightly more
difficult to _intentionally_ show a site to someone else.

- if you still want to run a "main" website for your computer, you can create a
virtual host with the name of your machine.  For example, if your machine were
named "aquinas" and people would normally get to your machine's website by going
to `http://aquinas.local/`, then you just need to create your site in
`~/Sites/aquinas.local/public_html/`.  You could even just make this a symlinked
directory back to `/Library/WebServer/Documents/` if you wish for your "main"
site to reside there.

- all of the examples here are referring to file locations and configurations
that come on a stock OS X Tiger box.  Nothing about this is specific to OS X, so
just apply the same principles to whatever OS you have apache running on.

[VirtualDocumentRoot]: http://httpd.apache.org/docs/mod/mod_vhost_alias.html#virtualdocumentroot

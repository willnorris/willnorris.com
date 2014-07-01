---
layout: post
title: 'WordPress Plugin Pet Peeve #3: Not being extensible'
wordpress_id: 671
date: '2009-06-04T08:53:25-07:00'
categories:
- technology
tags:
- wordpress
- plugin
- pet-peeve
---
So this is one that is incredibly easy to implement, and yet goes a **really** long way in keeping people happy with
your plugin.  The very reason that WordPress has a [plugin API][] is because they know that different people want
different things from their blog.  Some people are satisfied with just the core functionality that WordPress provides,
but most people want a little more.  Perhaps they are using WordPress as a photo blog, and need better support for
handling that kind of data.  Perhaps they need WordPress to integrate with some other system, or pull in data from
elsewhere.  Whatever their needs, there is no possible way WordPress could address them all in the core package.  And
even if they were to try, people have different ideas on how the same feature should be implemented, so there would be
no way to please everyone.  And unless your plugin is very simple, I can pretty well assure you that some of your users
probably want it to do something more than it does today, or do it in a slightly different way.

The very same mechanisms that makes WordPress extensible can be used to make your plugin extensible as well.  Most of
the time this will mean action and filter hooks.  As a plugin author, you are no doubt familiar with how these hooks
work, since your plugin is using them to hook into WordPress.  But what some newer developers may not realize is just
how easy it is to provide your own hooks to extend the functionality of your plugin.


## Where to add hooks ##

When you're getting started with your plugin it may not be obvious where to add hooks, and that's okay.  If you already
have a number of people using your plugin, then perhaps you may have already received requests from people wanting to
add some kind of functionality to the plugin or change how something works.  Oftentimes these changes are appropriate to
add directly into your plugin, and you are most certainly encouraged to do so when it makes sense.  But sometimes the
request represents an edge-case... something that one individual is wanting to do, but is very likely *not* going to be
useful to most people using your plugin.  Even worse, making such a change may be confusing or even undesirable by other
users.  In these cases, see if you can provide the appropriate hooks to allow people to extend your plugin to suit their
needs.  

[Extended Profile][] is a good example which provides quite a few hooks for people to extend.  One of the core features
of the plugin is that it allows you to output an hCard Profile on a page, like I have on the front page of
[willnorris.com][].  The plugin provides most of the common hCard attributes that we thought an individual might be
interested in like name, website, address, telephone number, etc. To collect this data from the user, the plugin extends
the standard WordPress Profile administration page.  But we knew that users might already have a different plugin
capable of providing this data, or that they may want to pull the data form some other source. Additionally, the [hCard
microformat][] supports a number of other attributes that we didn't include in the plugin.  In order to support these
use-cases, we used a combination of action and filter hooks (mostly filters, in our case) to allow the hCard profile to
be supplemented, or outright replaced. This is actually how I added the "Last Seen" geo data to my hCard, which pulls
data from [Brightkite][].

As a general rule of thumb, action hooks are used to alert other plugins that you are at a particular point within a
process.  Perhaps that you're about to begin doing something, or that you've just finished doing something which other
code may care about.  If you're printing things to the screen, an action hook may be a good place to allow other plugins
to print things as well at a very particular point in your plugin's processing.

Filters are intended to allow other pieces of code to actually modify something that your plugin has done.  As mentioned
above, the Extended Profile plugin makes heavy use of filters to allow other plugins to modify various aspects of the
generated hCard before it is printed to the screen.  In fact, the plugin hooks into its own filters in order to provide
most of the functionality, just like any other plugin would.  

That last point is worth underscoring: **hooks are not just for other plugins to use, you should be using them
yourself**.  WordPress makes extensive use of its own actions and filters, just take a look at [default-filters.php][].
This has a number of benefits -- it allows you to keep your own code fairly clean and modular, but perhaps more
importantly it allows other plugins to actually *remove* functionality they don't want using the `remove_action` and
`remove_filter` methods. When it comes to making your plugin extensible, being able to remove functionality is just as
important as the ability to add it.


## How to add hooks ##

Adding new action or filter hooks is deceptively simple -- there is no registration of hooks, you simply call
`do_action` or `apply_filters` as needed.  A simplified version of what happens in the Extended Profile plugin might
look like this:

``` php
function get_extended_profile($user_id) {
    // start output buffering
    ob_start();

    // call the action hook which actually builds the profile
    do_action('extended_profile', $user_id);

    // get buffered content
    $profile = '<div id="profile">' . ob_get_contents() . '</div>';
    ob_end_clean();

    // filter everything before returning
    return apply_filters('post_extended_profile', $profile, $user_id);
}
```

Here you can see both a custom action and filter being used, first to build the profile and then to filter it.  When
adding hooks to your plugin, its important to think about what data those hook functions may need in order to do
something useful.  For example, functions which hook into the 'extended\_profile' action need to know the ID of the user
the profile is being built for so that they can fetch the appropriate data.  The same user ID is also passed to the
'post\_extended\_profile' filter for the same reason.  With filters it's important to remember that only the first
parameter passed into the hooking functions gets filtered.  You can certainly pass other data as well to provide
context, but only the first one is filtered (which is actually the second parameter passed to `apply_filters`, since the
first one is the filter name).

The real beauty of WordPress action and filter hooks is in how lightweight the entire system is.  Calling a hook that
has no registered functions returns almost immediately.  And registering a function to a non-existent hook has basically
no overhead, and absolutely no consequence... the function simply never gets executed.  While you should certainly think
through your plugin and add hooks at the logical points, don't worry too much about adding too many.  Consider this: on
a standard, out of the box WordPress installation with no plugins activated, a page load can easily cause over 1,000
calls to `do_action` and `apply_filter`.  Having your plugin add in a handful more is not going to have any kind of
adverse effect on WordPress performance, and you will potentially make your plugin users much happier.


## Custom Constants ##

Another way to expose additional functionality within your plugin is through the use of custom constants.  This is
generally most appropriate to enable advanced functionality that you don't want to expose through the normal WordPress
option pages.  For example, suppose you have a plugin which makes API calls to some service.  The URL for that API
endpoint is constant, but you might want to allow it to be overridden for testing purposes.  Use a PHP constant for your
API URL, but check to see if it is already defined:

``` php
// near the beginning of your plugin
if ( !defined('MY_PLUGIN_API_URL') ) {
    define('MY_PLUGIN_API_URL', 'http://api.example.com/service'); // default value
}

// throughout the rest of your plugin, always use the constant
file_get_contents( MY_PLUGIN_API_URL . '?user=joe' );
```

In this way, the API URL can be overridden by defining the constant in `wp-config.php`:

``` php
define('MY_PLUGIN_API_URL', 'http://testing.example.net/test-service');
```

This is not as common as using action and filter hooks, but is still useful especially when you want to ensure that
other plugins are not able to manipulate the value.  Unless you do some additional checking, you never know what
functions may be hooking into your filter or what they're going to do with the value... in fact that's kind of the
point, you're not supposed to know or care.  But in cases where you want to allow the user to define a custom value, but
also ensure that other plugins don't manipulate the data in any way, constants are the way to go.

A final note if you do end up adding hooks or constants to your plugin.  Because so many plugins **aren't** able to be
extended in these ways, it is well worth drawing attention to the fact in your plugin's readme.txt.  You can even go so
far as to document all of the extension points as I did [with the OpenID plugin][], but you don't necessarily have to.
Just pointing out that hooks exist is often enough, developers can quickly scan your code for them.

[plugin API]: http://codex.wordpress.org/Plugin_API
[Extended Profile]: http://wordpress.org/extend/plugins/extended-profile/
[willnorris.com]: http://willnorris.com/
[hCard microformat]: http://microformats.org/wiki/hCard
[Brightkite]: http://brightkite.com/
[default-filters.php]: http://core.trac.wordpress.org/browser/trunk/wp-includes/default-filters.php
[with the OpenID plugin]: http://wiki.diso-project.org/wordpress-openid-api

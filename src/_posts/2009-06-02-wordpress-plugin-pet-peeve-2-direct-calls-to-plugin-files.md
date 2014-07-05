---
title: 'WordPress Plugin Pet Peeve #2: Direct Calls to Plugin Files'
wordpress_id: 637
date: 2009-06-02T13:05:45-07:00
categories:
- technology
tags:
- wordpress
- pet-peeve
- plugins
---
This is actually very similar to my first pet peeve of [hardcoding the path to wp-content][pet-peeve-1], in that it
makes assumptions about where files are placed on the filesystem.  Oftentimes, plugins need to handle certain kinds of
requests, maybe for some specific protocol, or to handle an AJAX request.  Some plugins will do this by making an HTTP
request directly to one of the files in the plugin... something like:

``` php
echo '<script type="text/javascript">
    jQuery.get("' . plugins_url('my-plugin/ajax-handler.php') . '");
    // do something with AJAX data ...
</script>';
```

This is not a problem in and of itself, in fact it's great that the plugin developer is actually using the `plugins_url`
function!  The problem arises in the `my-plugin/ajax-handler.php` file itself.  <!--more--> If that plugin needs to make
use of any WordPress data or functions, then the developer is certain to do something very ugly.  You'll know it when
you see it:

``` php
require_once('../../../wp-load.php');

// or sometimes you'll see...
require_once('../../../wp-config.php');
```

So what is this, and why is it so bad?  Well, the `wp-load.php` is a file provided by WordPress core that bootstraps the
WordPress environment.  It loads in the `wp-config.php` file, loads all the common WordPress functions and classes,
initializes the database connection, and gets everything in place to process the request.  These are all important
things, and provides a lot of functionality that the plugin developer may need.  The problem is that in the
`require_once` call above, the plugin developer is assuming that the `wp-load.php` file is in a directory exactly three
levels up in the filesystem from their plugin directory.  In a standard WordPress deployment, this will be true and
everything will work fine (for the most part).  But [as we've already seen][pet-peeve-1], WordPress allows deployers to
move where their `wp-content` or their plugins directory lives, so the above code will break completely.  Yes, there are
files in WordPress core that do something similar to the above, for example `wp-admin/admin.php`.  But these are safe
for WordPress core files because they **do** know where certain files will be.  It is **never** safe to make this
assumption from a plugin.  I think it's pretty safe to say that if you have a `require` or `include` call that goes up
more than a couple of directories ("`../../`"), you're almost certainly doing it wrong.

A couple of points to emphasize before moving on: if your plugin files are **not** accessing any built-in WordPress
functions, classes, or data, calling them directly should be just fine.  Also, if you're doing [AJAX calls on admin
pages][], use the built-in functionality WordPress core provides.

### The Right Way ###

So the right way of doing this is actually pretty straightforward conceptually, but in practice there are a couple of
ways to do it depending on your needs.  The short answer is that instead of calling your plugin file directly, you must
send the request through the standard WordPress request handling mechanisms.  This requires two things: constructing
your request properly, and then hooking into the WordPress request handling code at the appropriate time to take over
the request handling yourself.

All standard WordPress requests eventually get broken down to a request to `/index.php` with a bunch of URL parameters.
For example, when someone goes to your blog post at 

    http://example.com/2009/01/hello-world

WordPress uses the configured permalink structure to break this down to

    http://example.com/index.php?year=2008&monthnum=01&name=hello-world

And from that, WordPress can determine which post the request is for, and serve that up accordingly.  So what we want to
do is be able to construct a request along the lines of

    http://example.com/index.php?my-plugin=ajax-handler

and then hook into the WordPress request handling logic so that we can process this request ourselves.  Fortunately,
WordPress provides an action hook for exactly that purpose, called `process_request`.  Functions that hook into this
action are passed one parameter, an instance of the `WP` class, which encapsulates most of the specific parameters for
the current request.  If we want to process only the requests which include `my-plugin=ajax-handler`, we would add
something like this to the plugin:

``` php
function my_plugin_parse_request($wp) {
    // only process requests with "my-plugin=ajax-handler"
    if (array_key_exists('my-plugin', $wp->query_vars) 
            && $wp->query_vars['my-plugin'] == 'ajax-handler') {

        // process the request.
        // For now, we'll just call wp_die, so we know it got processed
        wp_die('my-plugin ajax-handler!');
    }
}
add_action('parse_request', 'my_plugin_parse_request');
```

If you're following along at home, try accessing `http://example.com/index.php?my-plugin=ajax-handler`.  What happens?
Most likely, nothing at all... it still loads your normal blog index page.  So what went wrong?  In order to have the
WordPress request handling code process custom URL parameters, we have to register them.  This is necessary for a number
of reasons including security, performance, and also to ensure that WordPress doesn't accidentally process something it
wasn't meant to.  Fortunately, registering a new query variable is very simple using the `query_vars` filter hook:

``` php
function my_plugin_query_vars($vars) {
    $vars[] = 'my-plugin';
    return $vars;
}
add_filter('query_vars', 'my_plugin_query_vars');
```

This simply registers 'my-plugin' as a valid query variable to be processed by WordPress, but says nothing about valid
values for that variable.  So now try reloading the page, and you should be greeted with a simple styled page reading
"my-plugin ajax-handler!".  Now you just need to modify the `my_plugin_parse_request` function to actually do your
custom request logic, and you're good to go.

I mentioned earlier that there are a couple of ways to do this.  The one caveat to be aware of with the above approach
is that you are hooking into the WordPress request processing logic **before** WordPress has processed the query itself.
WordPress's query handling logic is responsible for examining the request and figuring out what page or post within
WordPress the request maps to.  This is also what makes the `is_*` functions work: `is_page`, `is_front_page`,
`is_feed`, etc.  If your plugin is actually doing things on normal WordPress page requests and needs access to these
functions, then instead of hooking into the `parse_request` action, you should use the `wp` action.  You are still
passed an instance of the `WP` class, so all you need to modify is the `add_action` call:

``` php
add_action('wp', 'my_plugin_parse_request');
```

I would recommend that you **not** make this change unless you know that you need to.  Otherwise, you're having
WordPress perform a lot of logic that isn't necessary (including hits against the database), potentially making the
request take longer than it needs to be.  Though the difference is likely to be imperceptible, it's just good practice
to keep things as fast as possible.  And when dealing with custom request handling, you can keep things fast by hooking
into as soon in the flow as possible.

### Additional Exercise for the reader ###

If you don't like the look of URL containing `index.php?my-plugin=ajax-handler`, and instead want something pretty like

    http://example.com/my-plugin/ajax-handler

that is certainly possible with just a little bit more work (see [WP_Rewrite][]).  The [WordPress OpenID Plugin][] does
this to achieve nice endpoint URLs for the OpenID authentication protocol.  A word of caution with this however: if you
want to make sure that your plugin works on the widest number of deployments, where you have no idea what their
permalink structure is going to be, there is a bit more work that is necessary.  You can see the rewrite rules I setup
for the OpenID plugin in the [common.php][] file.  There's a lot of other stuff in there, and the rewrite code is a
little confusing at parts, but it's all there.  I will actually be changing this in the future to simplify things a bit,
so avoid complicating matters unless there is a real reason to.

Further codex reading:

  - <http://codex.wordpress.org/Query_Overview>
  - <http://codex.wordpress.org/Custom_Queries>

[pet-peeve-1]: http://willnorris.com/2009/05/wordpress-plugin-pet-peeve-hardcoding-wp-content
[AJAX calls on admin pages]: http://codex.wordpress.org/AJAX_in_Plugins#Ajax_on_the_Administration_Side
[WP_Rewrite]: http://codex.wordpress.org/Function_Reference/WP_Rewrite
[common.php]: http://code.google.com/p/diso/source/browse/wordpress/openid/trunk/common.php
[WordPress OpenID Plugin]: http://wordpress.org/extend/plugins/openid/

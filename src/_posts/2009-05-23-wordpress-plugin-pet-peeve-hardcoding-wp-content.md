---
title: 'WordPress Plugin Pet Peeve #1: Hardcoding wp-content'
wordpress_id: 618
date: '2009-05-23T15:50:31-07:00'
categories:
- technology
tags:
- wordpress
- pet-peeve
- plugins
---
Perhaps my biggest pet peeves I run across with WordPress plugins is when developers hardcode the URL or path to the
WordPress content folder.  By default this folder is named 'wp-content', and resides at the root of the primary
WordPress folder.  However, since WordPress 2.6 (released July 2008), this location [can be moved][] by simply defining
a constant in `wp-config.php`.  That's precisely what I do on my website: my WordPress installation lives at
[/wordpress][], while my content folder is at [/wordpress-content][].  I like having this separation of core WordPress
files from the themes, plugins, and uploads I've added myself.  It also makes it easier for me to upgrade WordPress,
since I don't use the built-in upgrade system added in 2.7.  Any plugins that still hardcode the path of the
`wp-content` folder break in often spectacular ways on my site.

So what should plugins do instead?  In order to make moving your content folder possible, WordPress 2.6 added a number
of constants and functions which refer to the correct location of several often used folders.  So instead of including
an image using something like:

``` php
<img src="<?php bloginfo('wpurl') ?>/wp-content/plugins/my-plugin/images/logo.png" />
```

you would have:

``` php
<img src="<?php echo WP_PLUGIN_URL ?>/my-plugin/images/logo.png" />
```

or even better:

``` php
<img src="<?php echo plugins_url('my-plugin/images/logo.png') ?>" />
```

Since these constants were added in WordPress 2.6, they obviously won't work in earlier versions.  No problem, you can
define them yourself in your plugin.  The WordPress Codex page [Determining Plugin and Content Directories][] includes 8
lines of code (plus 1 comment) that you can add to your plugin to ensure these constants are set, even in older versions
of WordPress:

``` php
// Pre-2.6 compatibility
if ( ! defined( 'WP_CONTENT_URL' ) )
    define( 'WP_CONTENT_URL', get_option( 'siteurl' ) . '/wp-content' );
if ( ! defined( 'WP_CONTENT_DIR' ) )
    define( 'WP_CONTENT_DIR', ABSPATH . 'wp-content' );
if ( ! defined( 'WP_PLUGIN_URL' ) )
    define( 'WP_PLUGIN_URL', WP_CONTENT_URL. '/plugins' );
if ( ! defined( 'WP_PLUGIN_DIR' ) )
    define( 'WP_PLUGIN_DIR', WP_CONTENT_DIR . '/plugins' );
```

Everywhere else in your plugin, make sure that you use the constants, not the hardcoded path.  If the string
'wp-content' appears anywhere in your plugin that isn't defining one of the constants above, you're doing it wrong.  If
you also want to make sure the functions like `plugins_url` are available in older versions of WordPress, see the
[compatibility.php][] file the ships with the [WordPress OpenID Plugin][].

So plugin authors, please go and fix this in your plugins.  Please?  Otherwise I can't use your plugin at all on my
site.

[can be moved]: http://codex.wordpress.org/Editing_wp-config.php#Moving_wp-content
[/wordpress]: /wordpress/
[/wordpress-content]: /wordpress-content/
[Determining Plugin and Content Directories]: http://codex.wordpress.org/Determining_Plugin_and_Content_Directories
[compatibility.php]: http://code.google.com/p/diso/source/browse/wordpress/openid/trunk/compatibility.php
[WordPress OpenID Plugin]: http://wordpress.org/extend/plugins/openid/

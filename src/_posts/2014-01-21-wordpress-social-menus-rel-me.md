---
layout: post
title: Adding rel="me" to WordPress Social Menus
wordpress_id: 1132
date: '2014-01-21T23:06:32-08:00'
categories:
- identity
- technology
tags:
- wordpress
- xfn
- indieauth
- rel=me
---
**Update:** As Kaspars points out in the comments below, it is indeed possible to set the rel value on menu links
directly from within WordPress.  I just had the option hidden for some reason.  So definitely implement a Social menu
location in any themes you're working on, and just ignore my code snippet below.

Tonight I came across  Konstantin Kovshenin's post, [WordPress Social Menus][][^1], where he describes a technique he
noticed in one of [Justin Tadlock][]'s themes.  I must say that looking at it now it seems so obvious, and I'm sort of
embarrassed that it never occurred to me before.

It's common for blogs to link to the individual's various social media profiles, and there are dozens of themes and
plugins that each have their own way of handling this.  What Justin does, and what Konstantin is now trying to promote,
is to setup a special "social" menu location within WordPress that users can assign a menu to (or fallback to using the
standard Custom Menu widget if the theme doesn't have the social menu location).  Using a few conventions and CSS
techniques, it becomes very easy for a theme to provide custom icons or styling of the social menu without having a
dozen incompatible ways to store the data.  It's actually quite brilliant, and I really hope this becomes more commonly
supported in WordPress themes.

## rel="me" ##

<aside class="alignright"><figure>
  <img src="rel-me-shirt.jpg" alt="T-shirt with slogan: I love me some rel=&quot;me&quot;" width="200" /> 
  <figcaption><a href="http://www.zazzle.com/i_love_me_some_rel_me_shirt-235414618479188408">I love me some rel="me" shirt, by Zazzle</a></figcaption>
</figure></aside>

The one thing that I haven't seen mentioned so far, however, is adding [rel="me"][] values to the profile links.
Together with links from those profiles back to your site, this allows others verify that these really are your
profiles, and is the foundation for things like [IndieAuth][].

Adding rel="me" tags to your social menus is actually quite simple using WordPress's `wp_nav_menu_objects` filter.  Just
add the following code snippet to your theme, or better yet in a simple [must-use plugin][] so it will stick around even
when you change themes.

``` php
/** Add rel="me" to social menu items. */
function social_menu_objects($items, $args) {
    if ( 'social' == $args->menu->name ) {
    foreach ( $items as $i ) {
        $i->xfn .= ' me';
    }
    }
    return $items;
}
add_filter('wp_nav_menu_objects', 'social_menu_objects', 10, 2);
```

(As Konstantin points out in the comments below, you'd want to change the above code to check against
`$args->theme_location` if your theme is defining a dedicated social menu location.)

I'm now using this technique to power my social media links in the footer of this site, so you can see it live there.

[WordPress Social Menus]: http://kovshenin.com/2014/social-menus-in-wordpress-themes/
[Justin Tadlock]: http://justintadlock.com/
[rel="me"]: http://microformats.org/wiki/rel-me
[IndieAuth]: https://indieauth.com/
[must-use plugin]: https://codex.wordpress.org/Must_Use_Plugins

[^1]: What's particularly interesting to me is exactly *how* I came across Konstantin's post – via a [Google Now website update][] card.  I have these cards pop up in Google Now all the time, but never have I had one quite as relevant to my interests as this.

[Google Now website update]: https://support.google.com/websearch/answer/3536954?hl=en

---
title: Custom Keycaps
date: 2026-05-09T02:24:52-07:00
aliases: /b/5i21
image:
  url: keyboard.jpg
  position: center bottom
---

For the last couple of months, I've been working on a set of custom keycaps from [Yuzu].
They finally arrived last week, and they are just about perfect!
I'm so happy with the design choices I made,
and the extra time I took to experiment with colors, icons, and layout was well worth it.

Here's the [final result], and I'll explain how I arrived at this.

<figure class="alignfull outset">
  {{<img options="cx50,cy450,ch1350" src="keyboard.jpg" alt="Mechanical keyboard with custom keycaps">}}
</figure>

[Yuzu]: https://yuzukeycaps.com/
[final result]: https://yuzukeycaps.com/c/61681151-aca9-4c15-b09e-a348e6ec6010

## Trying out different keyboards

I've been using a mechanical keyboard for a few years, but I didn't **really** start exploring different options until late last year.
I had been using the Logitech 915 TKL, which is a low profile mechanical gaming keyboard.
It was okay, but I think I really didn't know enough to know what I was missing.

<figure class="alignright">
  <a href="bridge75.jpg">{{<img width=250 src="bridge75.jpg"
     alt="Closeup of keyboard arrow keys, tucked tightly against the right shift and enter key">}}</a>
  <figcaption>Bridge75 arrow keys</figcaption>
</figure>

In November of last year, I got a [Bridge75], based on the recommendation of a coworker.
It had a great feel, but I discovered the 75% keyboard is just a bit too small for me.
It's not even the lack of the extra navigation keys that bothered me,
but instead how close the arrow keys are to the main section, sort of tucked under the enter key, cutting into the right shift key.

I then tried the [Keychron Q3 Ultra 8k].
It's a generally nice keyboard and very well made, but I immediately discovered how much I dislike the KSA keycap profile.
I'd honestly never given a ton of thought to [keycap profiles], but these keys made me very aware of how much I prefer cherry keys.
I even immediately bought a super cheap set of cherry keys while I sorted out a longer term solution.
Their [launcher] software also had issues that wouldn't let me customize keys quite how I wanted,
and the switches they came with were also a little too light.
I often found my self accidentally pressing keys as I simply rested my fingers on the home row.
I did switch them out with a set of [Cherry Nixie] switches, but those ended up being too stiff.


That led me to look into magnetic switches that could customize the key depth.
I settled on the [Wooting 80HE], mainly because of reports of how good their software is.
That's proven to be pretty true, and I'm quite happy with the degree of control I have.
I don't care at all for their gaming focused features, but really like being able to customize the key depth.
I set the home row keys to not actuate until a bit deeper travel (2.0mm),
and each row away from the home row gets progressively shallower (back to 1.5mm), requiring slightly less force.
The spacebar is set deeper at 2.5mm.
This may not be my final keyboard, but I'm very happy with it for now.

[Bridge75]: https://shortcutofficial.com/
[keycap profiles]: https://thekeeblog.com/overview-of-different-keycap-profiles/
[Keychron Q3 Ultra 8k]: https://www.keychron.com/products/keychron-q3-ultra-8k-wireless-custom-mechanical-keyboard
[launcher]: https://launcher.keychron.com/
[Cherry Nixie]: https://www.cherry.de/en-us/product/mx-black-clear-top
[Wooting 80HE]: https://wooting.io/wooting-80he

## Media keys / Function keys

It was definitely the Keychron keyboard that got me thinking about custom keycaps.
Aside from just the profile, it seems that all Keychron keyboards are preconfigured to match Apple's media keys.
Of course the mappings can be changed, but they also print the media icons on all of their keycaps.
For example, F1 and F2 are brightness, F7 through F9 are media controls, and the volume keys are F10 through F12.
That's great if you use a Macbook, but I've been using a Framework laptop for the last two years.
Their media keys are in wildly different locations, with volume at F1 through F3, media controls at F4 through F6, and brightness at F7 and F8.
Truly, no two keys are the same between the Apple and Framework layouts,
and I really wanted my external keyboard to have the same mappings as the laptop itself.

<figure>
  <a href="function-key-comparison.jpg">{{<img width=900 src="function-key-comparison.jpg"
     alt="Rows of function keys on three different keyboards. The top two, Apple and Keychron, have similar layouts.">}}</a>
  <figcaption>Function keys on Apple Macbook Pro (top), Keychron Q3 Ultra (middle), and Framework 13 (bottom)</figcaption>
</figure>

I spent a little bit of time trying to find sticker labels I could put on regular keycaps to identify the media keys,
but I didn't like any of my options.
So I began looking at custom keycaps, initially so my media keys would match my laptop.

However, when I began to design my custom keycaps to match the Framework media keys,
it wasn't immediately obvious how to design some of the keys.
There were multiple possibilities, and I wasn't sure which I would want long-term.
Because I could simply add more keys, I ended up with multiple variations of several keys.

<figure>
  <a href="media-key-variations.jpg">{{<img width=600 src="media-key-variations.jpg"
     alt="Tray of loose keycaps with variations of media key icons">}}</a>
  <figcaption>Media key variations</figcaption>
</figure>

 - Framework's mute key (F1) shows a lone speaker icon with nothing else. Apple does the same.
   However, on my laptop I have both [SwayOSD] and [waybar] configured to display a speaker with an "×", which I really like.
   So I got both.

 - Framework's previous and next keys (F4 and F6) uses two left and right facing arrows. Apple does the same.
   However, those are actually the icons typically used for rewind and fast-forward.
   The icons for previous and next track (which is what these keys typically do) are a single arrow and a line.
   I wasn't sure which I would prefer so I got both, along with another variation with the double arrows touching.

 - Framework's play/pause key (F5) has both the play icon and a pause icon next to each other.
   That's pretty standard, and Apple does the same.
   However, the icon set I was using didn't have that icon (or at least not one I liked).
   Yuzu supports uploading arbitrary SVG icons, but I didn't really want to deal with that,
   so I fashioned a few variations in Yuzu's web-based editor by combining and overlapping multiple icons.
   It was hard to know how they would turn out, so I got several different ones,
   along with a standalone play button without the additional pause icon.

 - Framework's airplane mode key (F10) triggers `rfkill` which disables bluetooth and wifi.
   It wasn't clear that I'd ever want to do that when plugged into my external keyboard,
   so I got a key with an airplane as well as an empty F10 key.
   I did the same for F9, which I use for screen mirroring.

 - Framework's print screen key (F11) has the letters "PRT SCR" on the key.
   So I got one like that, as well as one with an icon that I thought best represented print screen.

 - Framework's F12 key originally had the Framework logo on the key, which is what I have on my first Framework laptop.
   They later switched to a generic gear icon and moved the Framework logo to the Windows key.
   So I got versions with both.

Adding all of these extra media keys was certainly a bit silly, but at about $0.80 each,
I could avoid being stuck with a decision for just a few extra dollars, which was really nice.

[SwayOSD]: https://github.com/ErikReider/SwayOSD
[waybar]: https://github.com/willnorris/dotfiles/blob/e779b3f7157b5262de8b22ace0836775178fb1f3/tag-linux-desktop/config/waybar/config.jsonc#L64
[Material Icons]: https://fonts.google.com/icons

## Colors

My preferred color palette is generally pretty lacking in color, with a strong preference for greys in nearly everything.
Probably 90% of the clothes in my closet are black, white, or grey, and my last two vehicles have been grey.
Both my computer and phone have minimalist UIs with greyscale backgrounds.

<div style="display:flex; flex-flow:row wrap; align-items:center; justify-content:space-evenly;">
  <figure>
    <a href="linux-desktop.png">{{<img width=600 src="linux-desktop.png"
       alt="Screenshot of an empty computer desktop, showing only a black and white desert background and a simple system tray at the top">}}</a>
    <figcaption>My Linux desktop (<a href="https://github.com/willnorris/dotfiles/tree/main/config/wallpapers">wallpaper source</a>)</figcaption>
  </figure>
  <figure>
    <a href="android-desktop.png">{{<img width=250 src="android-desktop.png"
       alt="Screenshot of a simple Android home screen, showing a black and white desert background and a list of apps">}}</a>
    <figcaption>My Android home screen (<a href="https://niagaralauncher.com/">Niagara Launcher</a>)</figcaption>
  </figure>
</div>

When I do bring in color, I very much prefer the [One Dark] color scheme from the Atom editor.
It has clear neutral colors that are reasonably soft, but without being overly pastel.

<figure>
  {{<img src="kitty-terminal-colors.png" alt="Terminal window showing a sample of the 16 ANSI color codes with the One Dark theme">}}
  <figcaption>One Dark color scheme shown in Kitty terminal
  (<a href="https://github.com/willnorris/dotfiles/blob/e779b3f7157b5262de8b22ace0836775178fb1f3/config/kitty/themes/dark.conf">config</a>)</figcaption>
</figure>

A few of the icons in the Linux desktop screenshot above use the One Dark colors as well.
Anytime I need a basic color palette, particularly on my computer, I turn to One Dark.
(Though I use a pretty heavily modified version of One Dark [on this website]
to achieve a reasonable contrast ratio and better accessibility.)

So when it came time to choose colors for my custom keycaps, of course I wanted to match One Dark as closely as possible.
Yuzu has a pretty good color selection, but it's a little hard to be sure how things are going to look on a physical key.
Fortunately, they also have very affordable [color sample kits].
I made the best guess I could based on their website, and ordered a few variations of each color I wanted.
After seeing the physical keys and comparing them, I ended up choosing RD18, PL20, YW24, BL1, and GN18.

<figure>
  <a href="keycap-color-sample.jpg">{{<img width=600 src="keycap-color-sample.jpg"
     alt="Tray of loose keycaps in different colors with color codes on the keys">}}</a>
  <figcaption>Keycap color samples</figcaption>
</figure>

I used color sparingly, only on the function keys, escape, and enter.
For the function keys, I used color to group related keys:

 - volume keys (F1-F3) are blue
 - media keys (F4-F6) are green
 - brightness keys (F7-F8) are yellow
 - other system keys (F9-F12) are purple

Prior to this grouping, I would find it difficult to look down and quickly find the media pause button.
Even though the icons are clear, I still found myself scanning the full function row because I forgot the general proximity of the key.
Now, my brain is able to very quickly find the group of green keys, and I know the pause button is in the middle of that group.
I really don't even need the label on the key, as I find the color grouping far more effective.

[One Dark]: https://github.com/atom/atom/tree/master/packages/one-dark-syntax
[on this website]: https://github.com/willnorris/willnorris.com/blob/3c3a62dedf7af8e84e6e5a3449303cb72027ea3c/assets/css/_colors.css#L11-L21
[color sample kits]: https://yuzukeycaps.com/colors/samples

## Custom labels

I ended up using Yuzu's default font in the keycap builder, [Proxima Nova Soft] Bold.
I tried several others, as well as uploading a few custom ones, but their default actually looked really nice.

<figure class="alignright">
  <div>
    {{<img style="display:inline" width=100 src="framework-a.jpg"
           alt="A single 'A' keyboard key. The A is uppercase and located in the upper left corner of the key">}}
    {{<img style="display:inline" width=100 src="custom-a.jpg"
           alt="A single 'A' keyboard key. The A is lowercase and located in the center of the key">}}
  </div>
  <figcaption>Framework (left), custom key (right)</figcaption>
</figure>

Almost all keyboards have uppercase letters on their keycaps, but I always find that a little bit too loud.
So I went with lowercase letters throughout.
Keycaps also often place letters in the upper left corner of the key (including Framework's keyboard, and which is maybe due to [ISO 9995]?).
I find the centered letters like Apple uses far more pleasant.

Since I was doing custom keycaps, this was also my opportunity to address another small thing that has bothered me about keyboards.
Any keyboard you buy will always use Windows and/or Mac modifier keys.
You will typically have a "Windows" key with the little logo, which might also be labelled "option" for Mac.
The "alt" key is also often "command" for Mac, or will have the little clover icon.
But on Linux, the "Windows" keys is more typically referred to as the [super key].
So I definitely wanted to have that modifier key properly labelled as "super" on my keycaps.

I also remap the caps lock key to control.
I've done this for as long as I can remember, since I use control regularly in vim and basically never use caps lock.
I've always wanted that key's label to match what it actually does on my setup.
It's not a big deal, but if I have the opportunity to do it, I'm definitely taking it.
I also map the right ctrl key to the compose key to allow entering a variety of special characters,
so again it'd be great to label that key properly.

[Proxima Nova Soft]: https://www.marksimonson.com/fonts/view/proxima-soft/
[ISO 9995]: https://en.wikipedia.org/wiki/ISO/IEC_9995#Depictions_on_the_keytops
[super key]: https://en.wikipedia.org/wiki/Super_key_(keyboard_button)

### Function modifiers

Because my keyboard has a number of features that use the function key in combination with other keys
(and of course, you can customize that to add more), I wanted to capture some of those on the keycaps.
I put a small diamond on the `fn` key, and then similar icons on other keys to indicate what they do when pressed with `fn`.
But this proved to be one of the toughest decisions, since I'm not 100% sure which keyboard I'll be using long-term,
and many of these function modifiers are keyboard specific.

I was originally designing this keycap set for the Keychron keyboard which has shortcuts like `fn+b` to display the battery status.
So I had a tiny battery icon on the `b` key.
The numbers 1 through 4 were used together with the `fn` key to switch between bluetooth and RF connections, so I had little icons for that.
None of those make sense on the Wooting keyboard, since it is wired only and doesn't have a battery.

In the end, I only added a few relatively generic modifier icons.
I'd love to have more for other key combinations, but I just wasn't ready to commit to that on my keycaps.

### Extra keys

In addition to the different media key variations mentioned above, I got a few extra keys.

 - I got a [Tailscale] logo key in black, white, and grey backgrounds.
   Right now, I have that key mapped to open <http://100.100.100.100> which loads the Tailscale web client for the local device.

 - I got my [personal logo](/2023/logo/) that I designed a couple of years ago,
   mostly just for fun and because it fit really nicely.

 - I have a coffee key and an eye key, only one of which I'll use and hook up to my caffeine style app to keep my computer awake.

 - And then I have a bunch of goemetric shapes in various key sizes so I can put them in different places.
   There's so many of these because of the different background colors, different shapes, and different heights for different keyboard rows.
   No plan for them yet, but it fills the space nicely and I can assign them to different things later.

 - I have the traditional home, end, etc navigation keys, even though I'm not currently using them.
   I originally planned these keycaps for an 80% keyboard with those spaces,
   and the extra white del and page down keys allow for making a Tailscale logo with the 9 keys.

<figure>
  <a href="extra-fun-keys.jpg">{{<img width=600 src="extra-fun-keys.jpg"
     alt="Tray of assorted loose keycaps. Most of different icons or geometric shapes on them.">}}</a>
  <figcaption>Extra keys</figcaption>
</figure>

<figure>
  <a href="navigation-tailscale.jpg">{{<img width=300 src="navigation-tailscale.jpg"
     alt="Mixed dark and light navigation keys forming a Tailscale logo">}}</a>
  <figcaption>On a regular 80% keyboard, you can make a Tailscale logo with the navigation keys</figcaption>
</figure>

[Tailscale]: https://tailscale.com

## Overall impressions

The whole process took a little over 2 months from when I picked out colors and ordered the samples to when I got my final set of keycaps.
Making the keys, reviewing the proof, and then shipping from China takes 3-4 weeks.
That worked out okay, since I had plenty of time to tweak things while I was waiting on the color samples.
The final cost was $129.50 with shipping, which is certainly expensive for keycaps, but a fun little splurge.
It would have been about $30 less without all the extra keys I added.

I think my only complaint about the keycaps themselves is that the surface feels a little bit too smooth.
The keycaps that came with the Wooting keyboard had a very slight texture to them that felt really nice.
If I had the option to get these with that texture, I absolutely would.
But regardless, I'm super happy with the process and the result.

You can review my final set on Yuzu at [FW80 OneDark (With Extras)].

[FW80 OneDark (With Extras)]: https://yuzukeycaps.com/c/61681151-aca9-4c15-b09e-a348e6ec6010

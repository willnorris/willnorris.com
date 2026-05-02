---
title: linux console
---

After setting up a Linux desktop for the first time in a while,
I had to hunt down docs to adjust the Linux console.
Not a terminal emulator like xterm or alacritty, but the virtual console shown **before** you launch X.
It's much easier to find docs on setting keymaps and custom colors for virtual terminals or window managers,
but it took a little extra digging to figure out how to do it for the console.

## Keymaps

Following [ArchWiki docs](https://wiki.archlinux.org/title/Linux_console/Keyboard_configuration),
make Caps Lock key act as an additional control key:

```conf
# create /usr/share/kbd/keymaps/i386/qwerty/personal.map

include "us.map"
keycode 58 = Control
```

```conf
# in /etc/vconsole.conf

KEYMAP=personal
```

## Color

### Option 1 (early boot process)

This sets the color very early in the boot process so that it applies to all of the boot logs.

Install `mkinitcpio-colors` AUR package.

Add `sd-colors` to /etc/mkinitcpio.conf `HOOKS`, just after `sd-vconsole`.

Set colors in `/etc/vconsole.conf`. For my onedark colors, I use:

```
# colors for mkinitcpio-colors
COLOR_0=1e1f24
COLOR_1=e06c75
COLOR_2=98c379
COLOR_3=e5c07b
COLOR_4=61afef
COLOR_5=c678dd
COLOR_6=56b6c2
COLOR_7=abb2bf
COLOR_8=3e4452
COLOR_9=e06c75
COLOR_10=98c379
COLOR_11=e5c07b
COLOR_12=61afef
COLOR_13=c678dd
COLOR_14=56b6c2
COLOR_15=abb2bf
```

### Option 2 (post-login)

This sets the color after login, but doesn't require messing with the boot process.

Following [ArchWiki docs](https://wiki.archlinux.org/title/Color_output_in_console#Virtual_console),
[set colors](https://github.com/willnorris/dotfiles/blob/main/config/zsh/startup/term.zsh) in virtual console.

## Boot screen resolution

Not technically part of the linux console, but my systemd-boot screen was using using too high a resolution
and the text was unreadably small.

Following [man 5 loader.conf](https://man.archlinux.org/man/loader.conf.5#OPTIONS):

```conf
# in /etc/loader/loader.conf

console-mode 1
```

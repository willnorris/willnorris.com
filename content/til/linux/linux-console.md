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
# create /usr/local/share/kbd/keymaps/personal.map

include "/usr/share/kbd/keymaps/i386/qwerty/us.map"
keycode 58 = Control
```

```conf
# in /etc/vconsole.conf

KEYMAP=/usr/local/share/kbd/keymaps/personal.map
```

## Color

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

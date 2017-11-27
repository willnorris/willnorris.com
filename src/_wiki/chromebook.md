---
title: Chromebook
---

* TOC
{:toc}

## Termux

(Instructions adapted from [Lessons
Learned](https://blog.lessonslearned.org/building-a-more-secure-development-chromebook/)).

Install Termux apps:
 - [termux](https://play.google.com/store/apps/details?id=com.termux)
 - [termux:styling](https://play.google.com/store/apps/details?id=com.termux.styling)
 - [termux:api](https://play.google.com/store/apps/details?id=com.termux.api)

Right click in termux window to set color and font. Pinch to set font size.
Long press to paste text below.

Install packages:

    pkg install coreutils man net-tools openssh proot termux-tools util-linux
    pkg install curl fzf git golang tmux vim zsh

Basic setup:

    termux-setup-storage
    chsh -s zsh

Setup SSH server:

    mkdir -p ~/storage/downloads/.termux/ssh
    ssh-keygen -t rsa -b 4096 -f ~/storage/downloads/.termux/ssh/termux-id_rsa
    cat ~/storage/downloads/.termux/ssh/termux-id_rsa.pub >> ~/.ssh/authorized_keys
    termux-chroot
    sshd

Connect from Secure Shell:
 - **name:** termux
 - **username:** willnorris (actually doesn't matter)
 - **hostname:** 100.115.92.2 (or correct local IP)
 - **port:** 8022
 - **identity:** import termux-id_rsa generated above

## Dotfiles

Follow standard instructions from <https://github.com/willnorris/dotfiles#readme>.

To install rcm in termux:

    curl -O https://apt.thoughtbot.com/debian/pool/main/r/rcm/rcm_1.3.1-1_all.deb
    dpkg -i rcm_1.3.1-1_all.deb

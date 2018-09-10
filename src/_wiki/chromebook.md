---
title: Chromebook
---

Chrome OS automatically restores Chrome apps and settings on new machines, so this guide is really
about setting up crostini, also known as "Linux Apps for Chromebook".

* TOC
{:toc}

## Crostini

Enable Linux Apps for Chromebook at `chrome://settings/crostini/details`and launch the Terminal app.

## Basic Setup

Install common packages:

    sudo apt-get update
    sudo apt-get install git keychain man manpages mosh tmux zsh

Basic setup:

    sudo passwd $USER
    chsh -s /usr/bin/zsh

## Dotfiles

Follow standard instructions from <https://github.com/willnorris/dotfiles#readme>:

    git clone https://github.com/willnorris/dotfiles ~/.dotfiles
    path=(~/.dotfiles/rcm/bin $path) rcup

## Apps

Some additional programs I install manually:

 - [gcloud](https://cloud.google.com/sdk/downloads#apt-get)
 - [go](https://golang.org/dl/)
 - [node](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
 - [vscode](https://code.visualstudio.com/docs/setup/linux)

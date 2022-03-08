---
title: Chromebook
---

Chrome OS automatically restores Chrome apps and settings on new machines, so this guide is really
about setting up crostini, also known as "Linux Apps for Chromebook".

{{<toc>}}

## Crostini

Enable Linux Apps for Chromebook at `chrome://os-settings/crostini/details`and launch the Terminal app.

## Basic Setup

Install common packages:

    sudo apt-get update
    sudo apt-get install git keychain lsb-release man manpages mosh tmux zsh

Basic setup:

    sudo chsh -s /usr/bin/zsh $USER

## Dotfiles

Follow standard instructions from <https://github.com/willnorris/dotfiles#readme>:

    git clone https://github.com/willnorris/dotfiles ~/.dotfiles
    PATH="~/.dotfiles/rcm/bin:$PATH" rcup

## Apps

Some additional programs I install manually:

 - asdf: `git clone https://github.com/asdf-vm/asdf.git ${XDG_DATA_HOME}/asdf`
 - [gcloud](https://cloud.google.com/sdk/downloads#apt-get)
 - [vscode](https://code.visualstudio.com/docs/setup/linux)

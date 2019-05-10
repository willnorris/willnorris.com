---
title: Chromebook
---

Chrome OS automatically restores Chrome apps and settings on new machines, so this guide is really
about setting up crostini, also known as "Linux Apps for Chromebook".

{{<toc>}}

## Crostini

Enable Linux Apps for Chromebook at `chrome://settings/crostini/details`and launch the Terminal app.

## Basic Setup

Install common packages:

    sudo apt-get update
    sudo apt-get install git keychain lsb-release man manpages mosh zsh

Some packages need to be installed from backports to get the desired version:

    echo "deb http://ftp.debian.org/debian $(lsb_release -c -s)-backports main" | sudo tee -a /etc/apt/sources.list.d/backports.list
    sudo apt-get update
    sudo apt-get -t $(lsb_release -c -s)-backports install tmux


Basic setup:

    sudo chsh -s /usr/bin/zsh $USER

## Dotfiles

Follow standard instructions from <https://github.com/willnorris/dotfiles#readme>:

    git clone https://github.com/willnorris/dotfiles ~/.dotfiles
    PATH="~/.dotfiles/rcm/bin:$PATH" rcup

## Apps

Some additional programs I install manually:

 - [gcloud](https://cloud.google.com/sdk/downloads#apt-get)
 - [go](https://golang.org/dl/)
 - [node](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
 - [vscode](https://code.visualstudio.com/docs/setup/linux)

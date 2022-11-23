---
title: macOS Workstation
---

{{<toc>}}

## Host Configuration

Set the Computer Name in the macOS Sharing Preference Pane.

## Homebrew

``` sh
sudo mkdir /opt/homebrew
sudo chown `whoami` /opt/homebrew
git clone https://github.com/Homebrew/brew.git /opt/homebrew
```

Install [Homebrew packages](https://github.com/willnorris/dotfiles/blob/main/Brewfile) (this will
take a while):

``` sh
brew tap Homebrew/bundle

cd ~/.dotfiles
brew bundle
```

## Common workstation setup

Follow [common workstation setup](../workstation/)

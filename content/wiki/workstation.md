---
title: Workstation
---

This page contains configuration that is common to all Mac or Linux style workstations.
For platform specific configuration, see:

- [Chromebook](../chromebook/)
- [macOS](../macos/)
- [Windows](../windows/)

## SSH key

If needed, create a new SSH key:

```sh
ssh-keygen -t ed25519
```

## Shell

Set shell to zsh if needed:

    sudo chsh -s /usr/bin/zsh $USER

## Dotfiles

Follow standard instructions from <https://github.com/willnorris/dotfiles#readme>:

    git clone https://github.com/willnorris/dotfiles ~/.dotfiles
    ~/.dotfiles/install.sh

## Development tools

[Install mise](https://mise.jdx.dev/installing-mise.html).

    mise use -g neovim@latest

Language toolchains (make sure dev libraries are installed first if needed):

    mise use -g (go|ruby|python|nodejs)

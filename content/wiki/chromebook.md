---
title: Chromebook
---

Chrome OS automatically restores Chrome apps and settings on new machines.
This page focuses on the Linux development environment.

{{<toc>}}

## Setup Linux environment

Launch the Terminal app to initiate setting up Linux.

## Basic Packages

Install common packages:

    sudo apt-get update
    sudo apt-get install bat fzf git keychain lsb-release man manpages mosh ncdu ripgrep tmux tree zsh

Install development libraries and build tools:

    sudo apt-get install build-essential libreadline-dev libssl-dev zlib1g-dev

## Common workstation setup

Follow [common workstation setup](../workstation/)

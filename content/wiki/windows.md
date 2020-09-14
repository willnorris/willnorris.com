---
title: Windows Workstation
---

{{<toc>}}

## Host Configuration

- [Set the computer name](ms-settings:about)
- [Enable Windows Insider (Slow)](ms-settings:windowsinsider-optin)
- [Run Windows Update](ms-settings:windowsupdate)

## Windows Subsystem for Linux

- [Installation instructions for WSL 2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install)
- Install [Windows Terminal](ms-windows-store://pdp/?ProductId=9n0dx20hk701)
  - Copy [settings.jsonc](https://github.com/willnorris/dotfiles/blob/master/tag-windows/terminal/settings.jsonc)
- Install Linux distro(s):
  [Ubuntu](ms-windows-store://pdp/?ProductId=9nblggh4msv6),
  [Debian](ms-windows-store://pdp/?ProductId=9msvkqc78pk6)
- Follow linux setup for each distro

## SSH key

If needed, create a new SSH key in PowerShell

```sh
ssh-keygen -t rsa -b 4096
```

## Mouse settings

View scroll direction for all input devices:

    Get-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Enum\HID\*\*\Device` Parameters FlipFlopWheel -EA 0

Use inverted scroll direction for all devices:

    Get-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Enum\HID\*\*\Device` Parameters FlipFlopWheel -EA 0 | ForEach-Object { Set-ItemProperty $_.PSPath FlipFlopWheel 1 }


Change `FlipFlopWheel 0` to go back to standard scroll direction.

## Dotfiles

Follow standard instructions from
<https://github.com/willnorris/dotfiles#readme>:

```sh
git clone https://github.com/willnorris/dotfiles ~/.dotfiles
```

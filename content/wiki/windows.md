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
- Install [Windows Terminal Preview](https://www.microsoft.com/store/productId/9N8G5RFZ9XK3)
  - Copy [settings.jsonc](https://github.com/willnorris/dotfiles/blob/main/tag-windows/config/windowsterminal/settings.jsonc)
- Install Linux distro(s):
  [Ubuntu](https://www.microsoft.com/store/productId/9PDXGNCFSCZV),

## SSH key

If needed, create a new SSH key in PowerShell

```sh
ssh-keygen -t ed25519
```

## Mouse settings

View scroll direction for all input devices:

    Get-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Enum\HID\*\*\Device` Parameters FlipFlopWheel -EA 0

Use inverted scroll direction for all devices:

    Get-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Enum\HID\*\*\Device` Parameters FlipFlopWheel -EA 0 | ForEach-Object { Set-ItemProperty $_.PSPath FlipFlopWheel 1 }


Change `FlipFlopWheel 0` to go back to standard scroll direction.

## Keyboard settings

Map caps lock key to control.  (Save to `caps.reg` file and run)

    Windows Registry Editor Version 5.00

    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
    "Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00

## Dotfiles

Follow standard instructions from
<https://github.com/willnorris/dotfiles#readme>:

```sh
git clone https://github.com/willnorris/dotfiles ~/.dotfiles
```

---
title: Fix missing notification icons
---

My desktop notifications for Firefox on Arch Linux have not included the application icon since I set up this machine.
When viewed in swaync, they showed a generic application icon.

<img src="firefox-notifications.png" width="400">

I inspected the notifications with `dbus-monitor`:

```
% dbus-monitor --session interface='org.freedesktop.Notifications'

method call time=1721883080.674668 sender=:1.2234 -> destination=:1.703 serial=57 path=/org/freedesktop/Notifications; interface=org.freedesktop.Notifications; member=Notify
   string "Firefox"
   uint32 0
   string ""
   string "New message from Slackbot"
   string "What do you know, it works?"
   array [
      string "default"
      string "Activate"
   ]
   array [
      dict entry(
         string "desktop-entry"
         variant             string "Firefox"
      )
      dict entry(
         string "suppress-sound"
         variant             boolean false
      )
      dict entry(
         string "sender-pid"
         variant             int64 797881
      )
   ]
   int32 -1
```

The notable value here is `Firefox` for `desktop-entry`.
This value is supposed to reference the desktop entry file containing
application information such as name and icon.
This value is also (apparently) case-sensitive, so in my case the capital "F" in "Firefox"
was causing an issue since my desktop entry has a lowercase "f":

```
% head -n3 /usr/share/applications/firefox.desktop
[Desktop Entry]
Version=1.0
Name=Firefox Web Browser
```

Since this file is part of the managed package, I didn't want to simply rename it,
so I created a new desktop entry named `Firefox.desktop` in my home directory:

```
% cat ~/.local/share/applications/Firefox.desktop
[Desktop Entry]
Name=Firefox
Icon=firefox
Type=Application
```

Just include Name, Icon, and Type.
Including an Exec line will result in duplicate entries in launchers and application menus.

I had an identical issue with Slack Desktop, so I created a similar entry named `Slack.desktop`.

## A bug in Firefox or Arch Linux?

I'm still not entirely sure **why** firefox was sending notifications with the wrong `desktop-entry` value.
Here is the [relevant source code] in Firefox for setting `desktop-entry` on notifications:

```cpp
    // If MOZ_DESKTOP_FILE_NAME variable is set, use it as the application id,
    // otherwise use gAppData->name
    if (getenv("MOZ_DESKTOP_FILE_NAME")) {
      // Send the desktop name to identify the application
      // The desktop-entry is the part before the .desktop
      notify_notification_set_hint(
          mNotification, "desktop-entry",
          g_variant_new("s", getenv("MOZ_DESKTOP_FILE_NAME")));
    } else {
      notify_notification_set_hint(mNotification, "desktop-entry",
                                   g_variant_new("s", gAppData->remotingName));
    }
```

So use the value of the `MOZ_DESKTOP_FILE_NAME` variable if it is set, otherwise use `gAppData->remotingName`.
I tried setting `MOZ_DESKTOP_FILE_NAME=firefox`, and sure enough that fixes the problem.

What about about `gAppData->remotingName`?
As best as I can tell, It appears that is set by `MOZ_APP_REMOTINGNAME` at build time.
Loading `about:buildconfig` lists `MOZ_APP_REMOTINGNAME=firefox` under Configure options.
And that is clearly set by the [Arch PKGBUILD for firefox].
Loading `about:support` doesn't show any environment variables that would be relevant for this.

So I'm currently a bit stumped as to why these notifications have the wrong `desktop-entry`.
Arch seems to be packaging it correctly, and there doesn't seem to be anything in my environment that would influence it.

[relevant source code]: https://github.com/mozilla/gecko-dev/blob/84e10a11f0bf536b734c8d519db2f2bb73462a0c/toolkit/system/gnome/nsAlertsIconListener.cpp#L188-L199
[Arch PKGBUILD for firefox]: https://gitlab.archlinux.org/archlinux/packaging/packages/firefox/-/blob/7b66eca822f8581891d1cc978faf4f4a97c4eaab/PKGBUILD#L157

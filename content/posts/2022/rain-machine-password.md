---
title: RainMachine Default Password
date: 2022-03-07T21:45:03-08:00
aliases: /b/5He1
---

**The default password on a [RainMachine Pro-16][] (and presumably all device versions?) is an empty string.**
Not `password`, not `admin`, and not `hunter2`. Just an empty string.
When you get a screen prompting you for a password, don't enter anything, just click 'OK'.
Hopefully that will save future me (and maybe current you) an hour of headache.

(_Update:_ Or at least this was my experience after resetting my RainMachine.
[This article][quick-setup] seems to suggest that the default password **is** in
fact `admin`? So try both.)

[RainMachine Pro-16]: https://www.rainmachine.com/products/rainmachine-pro.html
[quick-setup]: https://support.rainmachine.com/hc/en-us/articles/360007505074-RainMachine-Pro-Quick-Setup

This evening, I accidentally reset the password on my RainMachine Pro 16.
I was trying to reboot it through the on-device screen, but the touch sensor misinterpreted my selection.
And then I didn't read the confirmation screen closely, and ended up resetting the password.

The next hour or so was spent trying to reset the password following the [instructions provided by RainMachine][instructions].
My RainMachine sits about 5 feet away from my network switch, so it is wired via ethernet.
But the instructions seem to assume wifi, and certainly imply that this is the only way to reset the password.
This is a lie. A bald-faced lie.

I don't know whether to blame Android, iOS, or RainMachine
for the abysmal experience that resulted in trying to re-configure the device over wifi.
Android simply refused to configure the device and iOS insisted on trying to set up HomeKit,
and then still refused to set things up properly.
But it really doesn't matter, because in the end it wasn't necessary.
Once the device is reset, you can simply login with an empty string, whether that's over ethernet or wifi.

It turns out that this is mentioned on the [documentation for the RainMachine Mini-8][mini-8]:

> Leave the password field empty since the password for the RainMachine device has been erased.

But that's not the version I have, and so I didn't initially read that.
Why they didn't include this on the [documentation for the Pro-16][instructions] is beyond me.
Maybe they'll update that. But in the meantime, hopefully this page will guide folks in the right direction.

[instructions]: https://www.rainmachine.com/reset/how-to-reset-the-password-for-the-RainMachine-Pro.html
[mini-8]: https://www.rainmachine.com/reset/how-to-reset-the-password-for-the-RainMachine-Mini-8.html

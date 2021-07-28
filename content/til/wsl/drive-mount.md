---
title: Mount drives in WSL
syndication:
 - https://twitter.com/willnorris/status/1420456600926523393
---

[Mount Windows drives in WSL]:

```
$ sudo mkdir /mnt/d
$ sudo mount -t drvfs D: /mnt/d
```

The new [Google Drive for Desktop] mounts to `G:` by default, so the above
technique makes it trivial to access Google Drive from within WSL.

[Google Drive for Desktop]: https://blog.google/products/drive/drive-for-desktop/
[Mount Windows drives in WSL]: https://docs.microsoft.com/en-us/archive/blogs/wsl/file-system-improvements-to-the-windows-subsystem-for-linux

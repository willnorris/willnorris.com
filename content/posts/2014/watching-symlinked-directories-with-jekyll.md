---
layout: post
title: Watching Symlinked Directories with Jekyll
date: '2014-12-09T17:19:43-08:00'
---

When you pass the `--watch` flag to Jekyll, it loads the [jekyll-watcher][] gem to automatically rebuild
your site when any of its files change.  Under the covers, this behavior is powered by the [listen
gem][], which uses a variety of adapters to detect these file changes and notify jekyll.  One thing
the listen maintainers [have struggled with][] is the best way to handle symlinks in a way that works
across platforms and meets users' expectations.  In reality, there's just no easy solution here.
At the time of this writing, listen will dereference symlinked directories it is explicitly told to
watch, but will not recursively dereference symlinked subdirectories.

Jekyll itself seems to have no problems follow symlinks when building a site, but as noted above,
it's not able to know to rebuild the site when a file in a symlinked directory changes.  While I
keep my site itself in a git repository, my `_drafts` folder is a symlink out to a Google Drive
folder.  There are certainly [different philosophies][] on how Jekyll should handle drafts, but
keeping them in Google Drive works really well for me.  The problem was just getting `jekyll
--watch` to rebuild my site while I'm editing drafts.

My current solution is a really simple jekyll plugin named [symlink_watcher] that overrides
jekyll-watcher to additionally instruct the listen gem to listen to any symlinked subdirectories.
It doesn't currently respect ignored paths (mainly because I don't use them myself), but otherwise
seems to work pretty well.

[jekyll-watcher]: https://github.com/jekyll/jekyll-watch
[listen gem]: https://github.com/guard/listen
[have struggled with]: https://github.com/guard/listen/issues/25
[different philosophies]: https://github.com/jekyll/jekyll/issues/1469#issuecomment-23831358
[symlink_watcher]: https://github.com/willnorris/willnorris.com/blob/jekyll/src/_plugins/symlink_watcher.rb

---
title: "git: Duplicate Signed-off-by lines"
date: "2009-02-14T15:05:25-08:00"
aliases: [/b/3y91, /b/8F, /p/495]
categories:
  - technology
tags:
  - bash
  - git
---

I've been playing around with [git][] a lot as an alternative to subversion and am really loving it. However, I'm
getting an error every time I try to commit:

    Duplicate Signed-off-by lines.

I can see where this is being thrown inside `.git/hooks/commit-msg`, but it wasn't immediately obvious what the problem
was. I did a quick google search and found that others have had the same problem, but at least some members of the git
community have been [less than helpful][]. I did figure out the problem, and figured I'd share it here for others.

The commit-msg script is written using bash style [shell expansions][],

    foo = $(bar)

while the [shebang][] at the top of the file is set to `/bin/sh`. On many systems, this is not a bash shell. The
solution is to simply modify the shebang to wherever bash is on your system (probably `/usr/bin/bash` or similar).

[git]: http://git-scm.com/
[less than helpful]: http://n2.nabble.com/duplicate-sign-off-by-error-td2259305.html#nabble.msgtxt2260129
[shell expansions]: http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_03_04.html
[shebang]: http://en.wikipedia.org/wiki/Shebang_(Unix)

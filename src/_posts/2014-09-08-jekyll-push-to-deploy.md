---
title: Static Site Push to Deploy
date: 2014-09-08T17:44:25-07:00
shortlink: /b/4Y21
syndication:
 - https://twitter.com/willnorris/status/509141063479459840
 - https://plus.google.com/+willnorris/posts/MLLHumYrYob
---
When I moved my site to Jekyll, I knew that one thing I wanted to setup was a good push-to-deploy
workflow.  Coming from WordPress, where publishing a post is a single mouse click, I knew that the
harder it is to publish a post, the less likely I am to do it.  This is how I ended up setting it
all up.

The vast majority of the work I do on my site is done locally on my laptop and then pushed to the
server when it's ready.  However, there are occasions where I want to try something directly on the
live site.  It's a personal site, so I don't care as much about accidentally breaking something.
But what this means is that I have a full checkout of my website source on the server, not just a
bare repository as is often [discussed in posts][search] about setting up push-to-deploy.  However, 
git really doesn't like you pushing into the current branch of a non-bare repository, and by default
won't let you do it:

```
% git push origin master
Total 0 (delta 0), reused 0 (delta 0)
remote: error: refusing to update checked out branch: refs/heads/master
remote: error: By default, updating the current branch in a non-bare repository
remote: error: is denied, because it will make the index and work tree inconsistent
remote: error: with what you pushed, and will require 'git reset --hard' to match
remote: error: the work tree to HEAD.
```

As the error message indicates, there's good reason for this, since it will leave the repository in
an inconsistent state.  Performing a `git reset --hard` will reset the state, but if there were any
local changes in the remote repository, they will be completely lost.

## refs/push/master ##

So instead of pushing to the current branch, I have a dedicated ref on the server named
`push/master` that I use just for pushing changes live.  In my git client on my laptop, I have the
following config:

```
[remote "live"]
  url = judah:/var/www/willnorris.com
  push = refs/heads/master:refs/push/master
```

This allows me to simply run `git push live` to push my changes into `push/master`.  Then I can use
hooks on the server to merge those changes into the master branch and rebuild the site.

## pre-receive hook ##

First, I have a pre-receive hook that verifies that my working copy on the server is clean.  If I
have any changes in the server's working copy that haven't been checked in yet, the push immediately
fails.  This doesn't happen often, but when it does I want it to fail quickly since it's something I
want to fix right then.  This is done using the `require_clean_work_tree` shell function that ships
with git.  My full [pre-receive hook][] is:

``` bash
#!/bin/bash

source "$(git --exec-path)/git-sh-setup"
export GIT_WORK_TREE=..

require_clean_work_tree "push changes"
```

Attempting to push when I have uncommitted changes on the server will fail with the message:

```
% git push live
Total 0 (delta 0), reused 0 (delta 0)
remote: Cannot push changes: Your index contains uncommitted changes.
To judah:/var/www/willnorris.com
 ! [remote rejected] master -> refs/push/master (pre-receive hook declined)
 error: failed to push some refs to 'judah:/var/www/willnorris.com'
```

## post-receive hook ##

If the pre-receive hook passes, I then have a post-receive hook that merges the changes from
`push/master` and runs jekyll to build the site.  But what if instead of uncommitted changes, I have
committed changes in the server's working copy?  I don't want to overwrite those changes, so I pass
the `--ff-only` flag to `git merge` to ensure it only performs fast-forward merges.  If it's unable
to fast-forward merge, then the post-receive hook fails with a message like:

```
% git push live
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 311 bytes | 0 bytes/s, done.
Total 3 (delta 2), reused 0 (delta 0)
remote: fatal: Not possible to fast-forward, aborting.
To judah:/var/www/willnorris.com
   bdb2c1a..a2727f4  master -> refs/push/master
```

In this case I have to manually fix it, often by force pushing, then manually rebasing the changes
on the server.  Again, this doesn't happen often, and so is not something I've bothered to try and
automate.

If the merge succeeds, then the post-receive hook runs jekyll to rebuild the site.  My full
[post-receive hook][] is:

``` bash
#!/bin/bash

export GIT_WORK_TREE=..

git merge --ff-only push/master || exit $?
pushd $GIT_WORK_TREE
export JEKYLL_ENV="production"
jekyll build
popd
```

A couple of lines (like setting `JEKYLL_ENV` and calling `popd` at the end) are not strictly
necessary, but also don't harm anything.  Assuming all goes well, a successful push looks like:

```
% git push live
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 311 bytes | 0 bytes/s, done.
Total 3 (delta 2), reused 0 (delta 0)
remote: Updating bdb2c1a..a2727f4
remote: Fast-forward
remote:  _config.yml | 2 +-
remote:  1 file changed, 1 insertion(+), 1 deletion(-)
remote: /var/www/willnorris.com /var/www/willnorris.com/.git
remote: Configuration file: /var/www/willnorris.com/_config.yml
remote:             Source: src
remote:        Destination: public
remote:       Generating...
remote:                     done.
remote: /var/www/willnorris.com/.git
To judah:/var/www/willnorris.com
   bdb2c1a..a2727f4  master -> refs/push/master
```

And that's it... a few lines in `.git/config` on my laptop and two small hooks on the server.  There
is still some room for improvement; for example, right now the post-receive hook runs regardless of
what ref I push to.  This could be updated to only run when I push to `push/master`, but as it is,
that's all I ever do so I'm not too worried about it.  This is good enough to give me very easy
push-to-deploy while making sure I don't overwrite any changes on the server.

_Thanks to [Junio Hamano][] for recommending much of the above approach based on some of his own
projects._

[search]: https://www.google.com/search?q=jekyll+push+to+deploy
[Jekyll docs]: http://jekyllrb.com/docs/deployment-methods/#git-post-receive-hook
[site repository]: https://github.com/willnorris/willnorris.com
[pre-receive hook]: https://github.com/willnorris/willnorris.com/blob/master/tools/pre-receive
[post-receive hook]: https://github.com/willnorris/willnorris.com/blob/master/tools/post-receive
[Junio Hamano]: http://git-blame.blogspot.com/

---
title: Accessing go links across tailnets
date: "2023-11-02T22:31:11-07:00"
aliases: /b/5Tj1
---

One of the more fun projects I've worked on at Tailscale is [golink],
which provide simple, private shortcuts that you can share with others on your tailnet.
We have hundreds of go links at Tailscale that we use on a daily basis.

But I also run a personal golink server in my homelab with some links that don't really make sense to add to our corporate golink instance.
I'd really like to be able to access my personal go links, even when I'm logged in to my work Tailscale profile.
And it turns out, it's incredibly simple to do.

Tailscale allows you to [share devices] to individuals on other tailnets.
You can control exactly what level of access those users have in your [ACLs] just like any other user.
For the share recipient, they see the device in their list of machines with a "shared in" label.
Because the device is in a different tailnet, they can't use the MagicDNS short name to access it,
but they can still use the fully qualified `host.tailnetXXXX.ts.net` address.

As I noted previously, I've also [setup DNS] so that I can access my devices on a custom domain.
So my personal golink server is at `go.willnorris.net`, but still only accessible on my tailnet.
So once I've shared my golink server to my work account, I can access all of my personal go links using URLs like `go.willnorris.net/deploy`.
But that's still a lot of typing, and I'd like to have something a little closer to the convenience of the short `go` hostname.

[golink]: https://tailscale.com/blog/golink/
[share devices]: https://tailscale.com/kb/1084/sharing/
[ACLs]: https://tailscale.com/kb/1018/acls/
[setup DNS]: /2023/tailscale-custom-domain/

## Chaining go links

What I ended up doing is creating a chain of go links on our corporate go link server
which allows any employee to access their personal go links.
All go links have a short name and a destination URL.
The destination URL can actually use [go templates] to do dynamic resolution.
One of the variables that the template has access to is `.User`,
which provides the username (typically an email address) of the user resolving the link.

So for example, we have a link named `go/me`, which resolves as:

```
go/me  =>  http://who/{{TrimSuffix .User "tailscale.com"}}
```

This will take the username of the person visiting `go/me`,
trim off the "tailscale.com" from the end of their email address, and send them to our `who` service.
So when I visit `go/me`, it sends me to `http://who/will@`, which shows my personal profile in our company directory.
(This was one of the go links I brought over from my time at Twitter.)

So back to accessing my personal go link server.
We have a very similarly named go link, `go/my`, which resolves as:

```
go/my  =>  /{{TrimSuffix .User "@tailscale.com"}}-go{{with .Path}}/{{.}}{{end}}
```

Let's break this down:

- `{{TrimSuffix .User "@tailscale.com"}}` is almost identical to our `go/me` link but it strips off the `@` as well.
  So when I visit this link, this portion will simply resolve to `will`.

- `-go` means that we just add the literal string `-go`, so now we have `will-go`

- `{{with .Path}}/{{.}}{{end}}` means that if I added an additional path, we'll add a slash and then whatever path was specified.
  So if I visited `go/my/deploy`, then the `deploy` would be the extra path that gets added to the end.

There's one more thing to call out: this destination is a relative URL.
It doesn't have a scheme or a host, it just starts with a `/`.
That means that it gets resolved relative to the current host, which is `http://go/`.
This is how you chain multiple go links together, and it's actually important that you do it this way.
So if I visit `http://go/my`, using the expansion explained above,
I would be sent to `/will-go`, which then expands to the absolute URL `http://go/will-go`.

So where does `/will-go` resolve to? Well, to my personal go link server of course!
Any Tailscale employee can create a link named `{user}-go` with their username, and point that at their personal golink server.
So for example, I have:

```
go/will-go  =>  http://go.willnorris.net/
```

I don't need to use any `.Path` template variables, since golink will append any extra path by default.
And if I hadn't setup a custom domain, this could just as easily be `http://go.tailXXXX.ts.net`.

So now this means when I visit `go/my/deploy`, it ends up resolving to `http://go.willnorris.net/deploy`
as you can see in this truncated curl output:

```
% curl -isL http://go/my/deploy

HTTP/1.1 302 Found
Location: /will-go/deploy

HTTP/1.1 302 Found
Location: http://go.willnorris.net/deploy

HTTP/1.1 302 Found
Location: https://github.com/willnorris/willnorris.com/actions/workflows/deploy.yml
```

[go templates]: https://pkg.go.dev/text/template

## Why relative links matter

This approach for accessing personal go links involved chaining multiple go links together to get to the final destination.
This is also commonly done to create alias go links.
For example, you might have `go/bugs` that links to your bug tracker.
But you may also want to have `go/b`, `go/bug`, and `go/issues` link there.
You could copy the same destination URL to all of the links, or you could just have the aliases link to the first.

```
go/bugs  =>  http://bugtracker/

go/b  =>  /bugs
go/bug  =>  /bugs
go/issues  =>  /bugs
```

Then, if you ever move your bug tracker, you only need to update the main `go/bugs` link.
This is also helpful to do for go links that have common misspellings.

So imagine I had created an alias on my personal golink server for `go/b`.
But instead of using a relative link `/bugs`, I used the absolute URL `http://go/bugs`.
Now what happens when I resolve that from my work account using `go/my/b`?

```
% curl -isL http://go/my/b

HTTP/1.1 302 Found
Location: /will-go/b

HTTP/1.1 302 Found
Location: http://go.willnorris.net/b

HTTP/1.1 302 Found
Location: http://go/bugs

HTTP/1.1 302 Found
Location: http://bugs.corp.example.com
```

When I resolved `http://go.willnorris.net/b`, it redirected to `http://go/bugs`.
But because I'm logged into my company account, `http://go/` points to my company golink server,
which then redirects `http://go/bugs` to the company bug tracker, not my own.
Using relative links ensures that chained links are always resolved by the same server.
This is also helpful if you name your server something other than `go`, or you decide to rename it at some point.

Finally, because I've gotten accustomed to using `go/my` links for my personal links,
I've also setup a `go/my` link on my personal golink server.
Since those links should just resolve locally, the destination URL is literally just a slash:

```
go/my  =>  /
```

So now, if I use `go/my/deploy` when I'm on my personal Tailscale account,
even though I could have just used `go/deploy`, it still gets me there.

## Nothing extra to build

What's particularly neat about this approach is that it didn't require building anything extra.
Device sharing, MagicDNS, user identity, and access controls are all just core features of Tailscale.
They're just building blocks you can use to build and access all kinds of services.
And once I had those, it was just a matter of setting up a few go links.

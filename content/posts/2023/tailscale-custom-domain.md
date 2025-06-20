---
title: Tailscale devices with a custom domain
date: 2023-11-01T00:10:53-07:00
aliases: /b/5Th1
---

One of the things that [kinda blew my mind] my first week at Tailscale was [MagicDNS].
I had been using Tailscale at home for a while, but just hadn't actually used MagicDNS at that point.
It runs a local DNS server in every Tailscale client that can answer queries about other devices in your network.
Every tailnet is given a name of the form `tailnetNNNN.ts.net`,
and so every device can be addressed as `<device>.tailnetNNNN.ts.net`.
If you want, you can instead choose a [fun tailnet name] which is randomly picked
from a list of things with [tails], and a list of things with [scales].
So you might end up with something like `<device>.orca-lizard.ts.net`.

While the fun tailnet names are cute and all, I really wanted to use my own domain.
For quite a while, I just manually maintained DNS records for the handful of hosts I cared about.
Tailscale IP addresses don't change, so this wasn't actually too much work.
But I recently got around to switching to a new tailnet using my own domain with [custom OIDC],
which meant I needed to reregister all of my devices.

I decided to take this opportunity to try and sort out my DNS properly.
What I found was [coredns-tailscale], a plugin for [coredns]
that effectively maps Tailscale device names onto a custom domain.
The coredns-tailscale project has been around for about a year,
and I later discovered that it had been mentioned in the Tailscale newsletter from [October 2022].
I guess I either missed seeing it or just wasn't looking for a tool like that at the time.

[kinda blew my mind]: /tweets/1532881581475368960
[MagicDNS]: https://tailscale.com/kb/1081/magicdns/
[fun tailnet name]: https://tailscale.com/kb/1217/tailnet-name/
[tails]: https://github.com/tailscale/tailscale/blob/main/words/tails.txt
[scales]: https://github.com/tailscale/tailscale/blob/main/words/scales.txt
[custom OIDC]: https://tailscale.com/kb/1240/sso-custom-oidc/
[coredns-tailscale]: https://github.com/damomurf/coredns-tailscale
[coredns]: https://github.com/coredns/coredns
[October 2022]: https://tailscale.com/blog/2022-10-newsletter/

## Delegating DNS

When I started manually maintaining DNS records for my Tailscale devices,
I chose the zone `ipn.willnorris.net`.
(IPN was the abbreviation for a Tailscale network before it was called a "tailnet",
and is [still present] in parts of the code base.)
So I basically wanted to delegate the entire `ipn.willnorris.net` zone to my coredns server.
I use [Porkbun] for domain registration and DNS hosting, so it was a simple matter of adding NS records.
I already knew I wanted to host coredns on [Fly], so I created the Fly app and got a public IP address.

I didn't have to, but I decided to go ahead and add names for my nameservers rather than bare IPs.
I cleverly chose `ns1.ipn.willnorris.net` and `ns2.ipn.willnorris.net`.
I added A records pointing each hostname to my Fly IP address, and
added NS records for `ipn.willnorris.net` pointing to those two hosts.

```bind
ns1.ipn.willnorris.net. 600 IN A 37.16.12.98
ns2.ipn.willnorris.net. 600 IN A 37.16.12.98

ipn.willnorris.net. 600 IN NS ns1.ipn.willnorris.net.
ipn.willnorris.net. 600 IN NS ns2.ipn.willnorris.net.
```

[still present]: https://pkg.go.dev/tailscale.com/ipn
[Porkbun]: https://porkbun.com/
[Fly]: https://fly.io/

## Tailscale configuration

I needed the coredns server to join my Tailnet (explained below), so I created an [auth key] for that purpose.
I made one that is reusable, ephemeral, pre-approved, and tagged with `tag:dns`.
I also added an ACL entry to my policy file to make sure that all of the devices on my network can do DNS queries.
This same entry also causes the DNS server to be aware of all of the other devices on the network,
which is needed to populate its internal mappings.

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["*"],
      "dst": ["tag:dns:53"]
    }
  ],

  "tagOwners": {
    "tag:dns": []
  }
}
```

[auth key]: https://tailscale.com/kb/1085/auth-keys/

## Build and configure coredns

The source for my personal coredns server can be found at <https://github.com/willnorris/ipn-dns>.
There's really not a whole lot to it.
My [main.go] simply registers the tailscale plugin and starts coredns.
My [Dockerfile] builds everything in a wolfi build image and copies the final binary and config to a static image.
(Don't miss calling `setcap cap_net_bind_service=+ep` so that you can listen on port 53).
My [fly config] is also pretty boring, adding a single volume mount for Tailscale state files and listening on port 53.
I also set my Tailscale auth key to the `TS_AUTHKEY` secrets variable using `fly secrets`.

The only interesting bit is the [coredns config] itself:

```caddyfile
ipn.willnorris.net {
  records {
    # Some resolvers will recheck for NS records at the delegate nameserver.
    # Manually specify these here, since they won't appear in the Tailscale node list.
    @   300 IN NS ns1.ipn.willnorris.net.
    @   300 IN NS ns2.ipn.willnorris.net.

    ns1 300 IN A  37.16.12.98
    ns2 300 IN A  37.16.12.98

    $OPTION fallthrough
  }
  tailscale ipn.willnorris.net {
    authkey {$TS_AUTHKEY}
  }
  log
  errors
}
```

I manually respecify records for my nameservers since some resolvers will check for that.
I then configure the coredns-tailscale plugin to use my `ipn.willnorris.net` zone,
and register itself with my Tailscale auth key.

(Edit: soon after publication, these changes were merged upstream, so this entire paragraph is outdated.
However, I do now use [a fork](https://github.com/willnorris/records) of the records coredns plugin.)
Now this auth key is the one really non-standard bit, and relies on a [local change] I made to coredns-tailscale.
Normally, it requires that a Tailscale client be running on the host system (the docker image in my case).
I added support for having coredns join the tailnet directly using [tsnet],
so that everything can be self-contained in the single coredns binary, including the Tailscale client itself.
I also made [another change] to respond to tailnet changes more quickly.
If you want to try those changes out yourself, see the `replace` directive in my [go.mod].

Once deployed, you can see that DNS queries for my MagicDNS hostname and my custom hostname match.
Though in practice, I typically create a CNAME without the `ipn` component
and use that for actually accessing services when I need to:

```shell
% dig +short go.tail27e07.ts.net
100.69.62.103

% dig +short go.ipn.willnorris.net
100.69.62.103

% dig +short go.willnorris.net
go.ipn.willnorris.net.
100.69.62.103
```

[main.go]: https://github.com/willnorris/ipn-dns/blob/main/main.go
[Dockerfile]: https://github.com/willnorris/ipn-dns/blob/main/Dockerfile
[fly config]: https://github.com/willnorris/ipn-dns/blob/main/fly.toml
[coredns config]: https://github.com/willnorris/ipn-dns/blob/main/Corefile
[local change]: https://github.com/damomurf/coredns-tailscale/pull/54
[tsnet]: https://tailscale.com/blog/tsnet-virtual-private-services/
[another change]: https://github.com/damomurf/coredns-tailscale/pull/53
[go.mod]: https://github.com/willnorris/ipn-dns/blob/main/go.mod

## What's missing and why bother?

There are a few additional things that MagicDNS gets you that is missing here.
First, MagicDNS also automatically sets up a DNS search path so that you can typically just use bare hostnames.
This is what makes [go links] like [go/meet](http://go/meet) work without needing the fully qualified domain name.
You can also have Tailscale automatically get certificates for your ts.net hostname,
even for private services that can't typically get Let's Encrypt certs using the HTTP challenge.
This is possible because Tailscale uses the DNS challenge on the ts.net domain.
And Tailscale [serve and funnel] build on top of this HTTPS support
to make services available to your tailnet or even publicly on the internet.
None of these things work with the custom DNS approach I've described here.

However, there are still reasons why you might want custom names as a supplement to your ts.net hostnames.
I often share some devices between my personal and work tailnet.
While bare hostnames work for devices in your own tailnet, they don't work for shared devices.
For that, you have to use the fully qualified hostname,
and I can never remember (or want to type) my full ts.net name.
If I want to access a personal go link while logged into my work tailnet,
it's much simpler to remember _go.willnorris.net_.
(Actually, I have an even simpler method with go links [I'll talk about later][personal-golinks].)

Or you may have existing hostnames that you've been using for a while and want to migrate them to a private Tailscale network.
Or you're possibly migrating from a different VPN product that was using a custom domain.
Setting up a DNS server like this could help keep those old hostnames active with their new Tailscale IP addresses.

It's also worth noting that I'm serving my custom DNS server publicly.
That means anyone can poke around to discover my Tailscale device names as well as their Tailscale IPs.
But those hostnames already end up getting written to public transparency logs whenever HTTPS certs are issued,
so I'm not too worried about that.
And Tailscale IP addresses themselves are generally pretty useless,
though they do theoretically make certain types of attacks a little easier.
So depending on the network setup and what you're trying to do,
you could just host this DNS server privately instead.

[go links]: https://tailscale.com/blog/golink
[serve and funnel]: https://tailscale.com/blog/reintroducing-serve-funnel/
[personal-golinks]: /2023/golinks-across-tailnets/

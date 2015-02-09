---
title: tools
go:
  pkg: willnorris.com/go/tools
  vcs: git
  src: https://github.com/willnorris/go-tools
excerpt: Assorted command line tools
---
This package contains assorted command line tools that aren't quite big
enough to justify their own repository.

## timestamp ##

The `timestamp` tool prints time in a variety of formats including unix
timestamp, RFC 3339, ordinal date, and epoch days.  Install by running:

    go get willnorris.com/go/tools
    go install willnorris.com/go/tools/timestamp

Run `timestamp -help` for complete usage.

## License ##

These tools are copyright Google, but are not an official Google products.
They are available under a [BSD License][].

[BSD License]: https://github.com/willnorris/go-tools/blob/master/LICENSE

---
title: canon
excerpt: Canon is a tool to add canonical import paths to Go packages
---
Source code: <https://github.com/willnorris/tools/tree/master/canon>

Canon is a tool to add [canonical import paths][] to Go packages.  

[canonical import paths]: https://golang.org/doc/go1.4#canonicalimports

For example, given a file located at `$GOPATH/example.com/foo/foo.go` with the
following contents:

```go
// Package foo docs here.
package foo
```

Canon will update this file as:

```go
// Package foo docs here.
package foo // import "example.com/foo"
```

Canon will only modify a single go source file per package.  If there are
multiple source files for the package, it will try to use the file that declares
the package-level documentation.  If there is no package documentation, it will
then try to find a source file with the same name as the package.  For example,
for `package main`, it will try `main.go`.  If that still fails, it will print
an error message.

## Install

```
go get willnorris.com/go/tools/canon
```

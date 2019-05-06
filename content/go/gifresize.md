---
title: gifresize
go:
  pkg: willnorris.com/go/gifresize
  vcs: git
  src: https://github.com/willnorris/gifresize
description: Simple package for transforming animated GIFs
---
gifresize is a simple go package for transforming animated GIFs.

Import using:

```go
import "willnorris.com/go/gifresize"
```

Then call `gifresize.Process` with the source io.Reader and destination
io.Writer as well as the transformation to be applied to each frame in the GIF.
See [example/main.go][] for a simple example.

[example/main.go]: https://github.com/willnorris/gifresize/blob/master/example/main.go

## License ##

This application is distributed under the Apache 2.0 license found in the
[LICENSE](https://github.com/willnorris/gifresize/blob/master/LICENSE) file.

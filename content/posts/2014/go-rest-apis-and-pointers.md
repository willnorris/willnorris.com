---
title: Go, REST APIs, and Pointers
date: '2014-05-27T15:34:24-07:00'
aliases: /b/KL
categories:
- technology
tags:
- github
- golang
- go-github
syndication:
- https://twitter.com/willnorris/status/471420969504878592
- https://plus.google.com/+willnorris/posts/95MAsi2ZPfs
- http://www.reddit.com/r/golang/comments/26od40/go_rest_apis_and_pointers/
- https://news.ycombinator.com/item?id=7817092
---
One of the more interesting design challenges with [go-github][] (and subsequently the one that results in the most
questions) is the use of pointers for most all of the fields in our structs that are marshaled and passed to the GitHub
API.  After a fair amount of trial and error, I settled on the approach that I'm going to talk about below, and it's
something I think more API clients written in Go ought to consider.  The original bug for this is
[google/go-github#19][], and the full discussion there may be interesting for some; this post attempts to lay out the
problem into a more consumable form.  It's a lesson on the interaction between Go's zero values, the `omitempty` option
on JSON or XML field tags, and the semantics of the `PATCH` HTTP method.

[go-github]: https://github.com/google/go-github
[google/go-github#19]: https://github.com/google/go-github/issues/19


## Starting Simple ##

The way Go handles most data encoding is very nice and simple.  You define a standard Go struct, and for each field in
the struct you can add a tag that specifies how that field should be encoded in particular formats.  For example, here's
a simplified struct to represent a GitHub repository:

``` go
type Repository struct {
    Name        string `json:"name"`
    Description string `json:"description"`
    Private     bool   `json:"private"`
}
```

Each of the fields on this struct specify the key name the value should be marshaled to in the resulting JSON object.
We could then build a new Repository and marshal it as JSON:

``` go
r := new(Repository)
b, _ := json.Marshal(r)
println(string(b))

outputs >>> {"name":"","description":"","private":false}
```

[Try it in the Go Playground.](https://play.golang.org/p/jT8_RVjWfN)
{ .small }

When we created the new Repository, each of its fields were set to their [zero value][]: the empty string `""` for
string types, and `false` for bool types.  There is no notion in Go of a declared but uninitialized variable.
At the time of declaration, if an initial value is not assigned, then the variable is initialized to its zero value.
Remember that, it will be important in a moment.

[zero value]: http://golang.org/ref/spec#The_zero_value


## Understanding PATCH ##

As its name implies, a REST-based API involves passing around the representation of the state of a resource.  This is
most commonly applied to HTTP, which is very straightforward: to read the current state of a resource, perform a `GET`
operation on the resource's URI.  To update a resource, pass the new representation of the resource to its URI in a
`PUT` operation.  The `PUT` method is defined as a complete replacement of the resource at a given URI, meaning you must
always provide the full representation that you want to set.  But what if you only want to update a few fields in the
resource?  That's done with the `PATCH` method, which is defined by [RFC 5789][patch].

The exact semantics of how the body of a `PATCH` request is applied to the requested resource are determined by the
media type of the request.  The way GitHub (and many other JSON APIs) handles `PATCH` requests is that you provide the
JSON representation of the resource to update, omitting any fields that should be left unchanged.  So for example, to
update only the description of a repository, the HTTP request might look something like:

``` http
PATCH /repos/google/go-github HTTP/1.1
Host: api.github.com

{"description": "new description"}
```

To delete the description entirely, simply set it to an empty string:

``` http
PATCH /repos/google/go-github HTTP/1.1
Host: api.github.com

{"description": ""}
```

What if you were to perform a `PATCH` request with every field specified?  That would actually be semantically
equivalent to a `PUT` request with the same request body.  In fact, because of this, all resource updates in the GitHub
API are done using `PATCH`.  They don't even support (or at least, don't document) using `PUT` at all for these types of
requests.

[PATCH]: http://tools.ietf.org/html/rfc5789.html


## Omitting empty values ##

The go-github library has a method for updating a repository named [Edit][repositories.edit] which takes the owner and
name of the repository to edit, as well as a `Repository` struct which contains the fields to be updated.  So the Go
code to update the description of a repository would simply be:

``` go
r := &github.Repository{Description:"new description"}
client.Repositories.Edit("google", "go-github", r)
```

What would the resulting HTTP request look like?  If you recall the previous discussion about JSON marshaling, it would
be something like:

``` http
PATCH /repos/google/go-github HTTP/1.1
Host: api.github.com

{"name": "", "description": "new description", "private": false}
```

Well that's not what was specified... the `name` and `private` fields were included even though they weren't part of the
`Repository` struct.  But remember that those fields are set to their zero value, so this really is what was specified.
The `name` field is not actually a big deal since it's immutable and GitHub will ignore it.  However the `private` field
is a big problem.  If this were a private repository, this seemingly innocuous change would have accidentally made it
public!

To address this, we can update our `Repository` type to omit empty values when marshaling to JSON:

``` go
type Repository struct {
    Name        string `json:"name,omitempty"`
    Description string `json:"description,omitempty"`
    Private     bool   `json:"private,omitempty"`
}
```

[Try it in the Go Playground.](https://play.golang.org/p/R_bGLOiJP3)
{ .small }

Now the empty string for `name` and the false value for `private` are omitted, resulting in the desired HTTP request:

``` http
PATCH /repos/google/go-github HTTP/1.1
Host: api.github.com

{"description": "new description"}
```

[repositories.edit]: http://godoc.org/github.com/google/go-github/github#RepositoriesService.Edit

So far so good.

## Intentionally empty values ##

Now let's go back to a previous example and see what it would look like in code.  Let's delete the description for a
repository by setting it to an empty string:

``` go
r := &github.Repository{Description:""}
client.Repositories.Edit("google", "go-github", r)
```

Given the `omitempty` option we added to our struct fields, what will happen?  Unfortunately, not what we want:

``` http
PATCH /repos/google/go-github HTTP/1.1
Host: api.github.com

{}
```

[Try it in the Go Playground.](https://play.golang.org/p/P57mxpmkPR)
{ .small }

Because all fields on our `Repository` struct are now set to their zero value, this marshals to an empty JSON object.
This request would have no effect whatsoever.

What we need is a way to identify which fields are set to their zero value simply because that's how they were
initialized (and omit those from our JSON serialization), versus those that were intentionally set to a zero value by
the developer (and include those in our JSON serialization).  And that's where pointers come in.

## Pointers ##

The zero value for a pointer is `nil`, regardless of what it is a pointer for.  So by using pointers for our struct
fields, we can unambiguously differentiate between an unset value, `nil`, and an intentional zero value, such as `""`,
`false`, or `0`.  This is exactly what [golang/protobuf][] does, for exactly this reason.  So this results in our final
`Repository` type of:

``` go
type Repository struct {
    Name        *string `json:"name,omitempty"`
    Description *string `json:"description,omitempty"`
    Private     *bool   `json:"private,omitempty"`
}
```

This does come at a cost however, both in terms of memory allocation and the developer experience, since it's a little
annoying to have to create pointers to a string or bool.  You end up with overly verbose code such as:

``` go
d := "new description"
r := &github.Repository{Description:&d}
client.Repositories.Edit("google", "go-github", r)
```

[Try it in the Go Playground.](https://play.golang.org/p/1oSPiyrcoY)
{ .small }

To make this easier, go-github provides a handful of convenience functions copied over from the protobuf package for
creating pointer types:

``` go
r := &github.Repository{Description: github.String("new description")}
client.Repositories.Edit("google", "go-github", r)
```

Using pointers also means that clients of the library will need to perform their own nil checks where appropriate to
prevent panics.  The protobuf library generates accessor methods to help make this a little easier, but go-github hasn't
added those yet.

[golang/protobuf]: https://github.com/golang/protobuf

## Other libraries ##

So does any of this matter for your Go API client?  Well, it depends.  If the API doesn't do any kind of partial updates
like `PATCH`, then you can probably leave off `omitempty`, not worry with pointers, and go on about your way.  If you
never need to send a zero value such as empty string, `false`, or `0` in a JSON or XML request (not likely), then you
can set `omitempty` and move on.  But for most modern APIs, those won't be the case, and you should experiment to see if
your current library prevents you from performing certain actions.

(I'll also note that [google/go-github#19][] discusses alternative solutions that weren't explored here, such as using
a field mask or using the protobuf package directly.  It may be worth looking at those.  Pointers just made sense for
this library; use what works for you.)

### Related Reading ###

 - [JSON and Go](http://blog.golang.org/json-and-go), The Go Blog
 - [json package](http://golang.org/pkg/encoding/json/), The Go Programming Language

*[REST]: Representational State Transfer

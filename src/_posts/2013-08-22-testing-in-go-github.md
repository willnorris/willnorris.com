---
title: Testing in go-github
date: '2013-08-22T18:23:17-07:00'
shortlink: /b/Hs
categories:
- technology
tags:
- github
- golang
- go-github
- testing
---
I haven't really talked about it much, but at the beginning of 2013 I moved from the Google+ API team to work in
Google's Open Source office, with the task of figuring out how to manage Googlers releasing open source projects on
GitHub.  I had already been working on this for close to year in my 20% time, but it was becoming clear that this was
going to require full-time focus.

<aside class="alignright outset"><figure>
  <img src="codercat.jpg" alt="Coder Octocat holding a cup of coffee and laptop" width="400" style="max-width: 200px;" />
</figure></aside>

One thing I realized very early on was that the standard tools that GitHub provides for managing organizations and
repositories were not really going to work for a company of Google's size.  For example, we have a lot of internal
infrastructure, both technical and policy/legal, that we need to integrate with.  Fortunately, just about everything
GitHub exposes on github.com is also available in their [API][github-api], so we were able to build tools to bridge our
internal infrastructure to GitHub.

While it's unlikely that we'll open source the entire application we're building, mainly because it will be tied very
tightly to our internal systems and wouldn't be of much use to others, I have been developing the Go client library for
GitHub in the open at [google/go-github][].  And though I'm still relatively new to Go myself, I wanted to write a few
posts on things I think we did well with the library, some challenges we've faced, and some of the rationale behind
certain design decisions in hopes that it might be of use to others.


## Testing HTTP client code ##

There are several different ways you can test http client code in Go (or any language for that matter).  The most naive
way would be to call the live API directly.  Now if your intent is to actually test the API itself, this might make
sense.  For example, we have one set of tests for the Google+ API that call the live endpoints with varying sets of
credentials and request parameters to make sure the API is responding at all, and to ensure that certain business logic
is being applied appropriately.

However, if your goal is to just test the client library, *don't call the live API*.  Doing so puts undue stress on the
API, dramatically increases the time it takes to run your full test suite (which means you probably won't run them as
often), and introduces your tests to all kinds of false failures.  Are your tests failing because you just introduced a
bug in your code, because of network problems, because you're over your hourly request quota, or because the service is
down from another DoS attack?  And what if the specific data you were testing for was inadvertently changed or removed?
Now your tests are failing for reasons having nothing to do with your client code.

While there are ways to mitigate some of these risks, for your basic unit tests of a client library, you absolutely do
not want to call a live API.  Besides, the actual behavior of the API is generally outside the purview of a client
library.  Most often, the kinds of things you want to test in your client include:

 - **Are requests being constructed properly?**  This includes checking all parts of the request: the HTTP method, any
 custom HTTP headers, the URL, and the request body.
 - **Are success responses being handled properly?**  This may include handling custom response headers as well as
 parsing the response body.
 - **Are error responses being handled properly?**  What are the different ways the API indicates an error, and what are
 the different kinds of errors that can occur?  Is your client doing the right thing in these cases?

You will of course want to test any other business logic that your library is responsible for, but when it comes to
talking to the API, this is generally all you need to test.  Are your requests being constructed properly, and are
varying responses being handled properly?


## Using Go's httptest package ##

<aside class="alignleft outset"><figure>
  <img src="gopher.png" alt="The Go Gopher" height="200" />
</figure></aside>

Within Go, there are a couple of ways you can perform the above tests.  One approach is to create a custom
[`http.RoundTripper`][roundtripper] implementation that inspects the request and returns a known response.  In this
case, no actual HTTP request is ever sent anywhere; the RoundTripper intercepts it and just checks for expected values.

The approach I took however, was to use Go's [`net/http/httptest`][httptest] package to run a real HTTP server listening
on localhost that effectively mocks the GitHub API.  I found that this resulted in slightly clearer code in most cases,
and additionally allowed for testing custom transports like our
[`UnauthenticatedRateLimitedTransport`][rate-limited-transport].  And because the library already supported overriding
the base URL used for API calls (originally added to support GitHub Enterprise), I could easily point a client at my
test server and send real HTTP requests.  As far as the client is concerned, there is absolutely no difference between
running during tests and running in production; the requests are simply being sent to a different URL.  The [setup
code][] for my tests looks like this:

``` go
var (
    mux *http.ServeMux
    client *Client
    server *httptest.Server
)

func setup() {
    // test server
    mux = http.NewServeMux()
    server = httptest.NewServer(mux)

    // github client configured to use test server
    client = NewClient(nil)
    client.BaseURL, _ = url.Parse(server.URL)
}
```

This simply starts up a new test server, builds a `github.Client`, and points that client at the test server.  My
individual tests look something [like this][users_test]:

``` go
func TestUsersService_Get_specifiedUser(t *testing.T) {
    setup()
    defer teardown()

    mux.HandleFunc("/users/u", 
        func(w http.ResponseWriter, r *http.Request) {
            testMethod(t, r, "GET")
            fmt.Fprint(w, `{"id":1}`)
        }
    )

    user, _, err := client.Users.Get("u")
    if err != nil {
        t.Errorf("Users.Get returned error: %v", err)
    }

    want := &User{ID: Int(1)}
    if !reflect.DeepEqual(user, want) {
        t.Errorf("Users.Get returned %+v, want %+v", 
            user, want)
    }
}
```

The interesting bit here is the `mux.HandleFunc()` call.  This sets up an HTTP handler on an expected path, tests
various request values, and then returns an expected response.  If the client library constructs the request URL
improperly, there won't be an HTTP handler for the path and the test server will return a 404.  If the request is sent
with the wrong HTTP method, the `testMethod()` call will fail.  Other helper methods check for expected [URL
parameters][], [custom HTTP headers][], and the request body.  This covers all of the components of the request that we
would want to test.

Additionally, we want to test that responses are handled properly.  In the example above, we're returning a successful
response with a very minimal JSON representation of a GitHub User object.  The main thing we are checking for here is
that the JSON is properly unmarshalled into a `github.User` and that no errors are returned.  In other tests, we
intentionally return various HTTP error codes from the handler and test that they are handled properly.

### A new server for every test ###

To ensure that each test is hermetic, we spin up a new test server every time.  This is particularly important when
testing clients for REST APIs, since many methods will make requests with only very subtle differences.  For example,
the get, update, and delete methods for a resource will likely use identical URLs, but differ only in the HTTP method
used (and possibly different request bodies).  To ensure tests don't interfere with each other and give incorrect
results, start with a fresh server for each test.  As of this writing, the tests for the go-github library start up and
shutdown 177 HTTP servers, and the entire test suite still runs in around 100 milliseconds on my Macbook Pro.
Performance is *not* an issue.

You could probably cut down on some of the boilerplate code in each test by using [table driven tests][], but I honestly
found the above approach to be more readable.  For what it's worth, we do use table driven tests in other parts of the
library.


## Areas for improvement ## {#improvement}

As you can see in the example above, our test response body includes a very minimal representation of the resource (only
the "id" field).  The library doesn't enforce the presence of any fields, so this allows us to write very succinct test
cases.  However, it also means that we aren't testing that all struct fields are being marshalled and unmarshalled
properly.  There have already been a couple cases where there was a typo in the `json:` tag on a struct field, so the
field was being missed.  This can be addressed by having at least one test for each resource that includes all fields.
And in most cases, you really only need to do it in one test, otherwise your just making things needlessly verbose with
no additional benefit.

Most of the Go projects I come across tend to be focused on implementing various types of servers, but far less is being
written for HTTP clients.  So if you have any tips to share for testing HTTP clients in Go, I'd love to hear about it.

[github-api]: http://developer.github.com/v3/
[google/go-github]: https://github.com/google/go-github
[roundtripper]: http://golang.org/pkg/net/http/#RoundTripper
[httptest]: http://golang.org/pkg/net/http/httptest/
[rate-limited-transport]: https://github.com/google/go-github/blob/3bb8a96d4846d1bef2f45e0b27eef4bcbbca2df0/github/github.go#L378
[setup code]: https://github.com/google/go-github/blob/3bb8a96d4846d1bef2f45e0b27eef4bcbbca2df0/github/github_test.go#L21-L43
[users_test]: https://github.com/google/go-github/blob/182cb7f67ded579fb7038c0194c2784e2fff9ccf/github/users_test.go#L36-L54
[URL parameters]: https://github.com/google/go-github/blob/3bb8a96d4846d1bef2f45e0b27eef4bcbbca2df0/github/github_test.go#L58-L64
[custom HTTP headers]: https://github.com/google/go-github/blob/3bb8a96d4846d1bef2f45e0b27eef4bcbbca2df0/github/github_test.go#L66-L70
[table driven tests]: https://golang.org/wiki/TableDrivenTests

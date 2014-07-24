---
title: iTunes 9, now with more WebKit
wordpress_id: 864
date: '2009-09-09T13:26:12-07:00'
categories:
- technology
---
As [John Gruber predicted][] yesterday, iTunes 9 certainly uses WebKit much more than the last version.  I used
wireshark to do a [packet trace][] when I clicked on the Rock Music section. Sure enough, if you gunzip the response, it
is effectively standard HTML (though they do declare a custom XML namespace for everything).  It looks like this new
HTML based format is triggered by the request header:

    X-Apple-Store-Front: 143441-1,5

For example, the following simple curl command will retrieve this Rock page:

    curl -H "X-Apple-Store-Front: 143441-1,5" \
        http://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewGrouping?id=24

To further verify that iTunes was doing little more than rendering the result with WebKit, I went through the response
HTML, fixed a couple of URLs, and got [this result][] -- exactly what you see in iTunes 9.  Of course, the "Quick View"
for each album doesn't work, but you can see how it is all pieced together.

[John Gruber predicted]: http://daringfireball.net/2009/09/rock_and_roll_prelude
[packet trace]: itunes-http.txt
[this result]: itunes-response.html

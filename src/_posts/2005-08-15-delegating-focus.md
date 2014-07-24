---
title: delegating focus
wordpress_id: 68
date: '2005-08-15T21:14:04-05:00'
categories:
- technology
tags:
- web
- javascript
---
So here's the problem -- you have a web based application that uses multiple forms, often on the same page.  Any
arbitrary combination or number of forms may appear on the same page at the same time.  For example, you may have a
small login box as well as a form to subscribe to a newsletter, as well as a form to perform a search.  In order to make
things easier for the user, you'd like one of these input boxes to have focus when the page loads, but how do you
determine which one to give it to?  If the login form is by itself on the page then it should have focus, but if there
is another more dominant or more important form also on the page, then it should have focus instead.

Here's a very simple solution I came up with this evening.  Any input box on the page should be able to "request focus"
with a certain level of importance.  Whichever input box declares itself to be most important gets focus when the page
loads.  First, include the following javascript into your page...

``` javascript
var topObjectId; var topLevel = 0;
function requestFocus(objectId, level) {
    if (level > topLevel) { topObjectId = objectId; topLevel = level; }
}
function giveFocus() {
    if (topObjectId) { document.getElementById(topObjectId).focus(); }
}
```

This sets up a couple of variables to keep track of which object is currently the most important and what its request
level is.  It also provides a function for an element to request focus and a function to finally grant focus after all
is said and done.  Now in your website, call requestFocus for each element necessary.  It might look something like...

``` markup
<form id="loginForm">
    <input type="text" id="username" />
    <input type="password" id="password" />
</form>
<script>requestFocus("username", 10)</script>

<!-- ... -->

<form id="searchForm">
    <input type="input" id="searchTerm" />
</form>
<script>requestFocus("searchTerm", 15)</script>

<!-- ... -->

<script>giveFocus()</script>
```

Here we have two forms, one to login and one to search.  In this case, the search form is more important than the login
form (15 > 10) and therefore should have focus when the page loads.  At the very bottom of the page call giveFocus to
actually, ya know, __give focus__.  Deciding the appropriate request level is of course up to the developer, and he will
have to come up with his own rules as to what constitutes a more important form.

This certainly isn't complicated or advanced by any means, but is still nonetheless quite useful.  I don't particularly
like throwing these little `<script>` statements all over the place, but apparently `onload` doesn't work for inputs.
If anyone has a suggestion for a less intrusive method, I'd love to hear it.

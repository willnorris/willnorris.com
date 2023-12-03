---
title: webmention
---

This site does not support traditional comments.
Instead, you can post a comment on your own site and send a [webmention][] notifying me of the reply.

If your publishing software doesn't send webmentions automatically, you can use the form below to send one my way.

[webmention]: https://indieweb.org/webmention

<form id="webmention-form" action="/api/webmention">
  <p><label>URL of your post (the webmention <code>source</code>):
  <input type="url" name="source" required></label></p>

  <p><label>URL of my post that you are replying to (the webmention <code>target</code>):
  <input type="url" name="target" required></label></p>

  <p><input type="submit" /></p>

  <p result></p>
</form>

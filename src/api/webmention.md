---
layout: default
title: webmention
---

This site does not support traditional comments.  [Indie Web comments][] are much better since they allow you to fully
own your comment by posting it on your own site first and then sending it to me as a [webmention][].  

I'm not actually displaying comments currently, but I do receive webmentions so that I can display them in the future.
If your publishing software doesn't send webmentions automatically, you can use the form below to send one my way.

[Indie Web comments]: http://indiewebcamp.com/comment
[webmention]: http://indiewebcamp.com/webmention

<form method="POST">
  <p><label>URL of your post (the webmention <code>source</code>):<br>
  <input type="url" name="source" style="width: 100%"></label></p>

  <p><label>URL of my post that you are replying to (the webmention <code>target</code>):<br>
  <input type="url" name="target" style="width: 100%"></label></p>

  <p><input type="submit"></p>
</form>


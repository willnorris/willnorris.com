---
title: webmention
---

This site does not support traditional comments.
Instead, you can post a comment on your own site and send a [webmention][] notifying me of the reply.

If your publishing software doesn't send webmentions automatically, you can use the form below to send one my way.

[webmention]: https://indieweb.org/webmention

<form id="webmention" method="POST">
  <p><label>URL of your post (the webmention <code>source</code>):
  <input type="url" name="source" required></label></p>

  <p><label>URL of my post that you are replying to (the webmention <code>target</code>):
  <input type="url" name="target" required></label></p>

  <p><input type="submit"><span id="result"></span></p>
</form>

<script>
  const form = document.getElementById("webmention")
  const result = document.getElementById("result")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    params.set("source", form.querySelector("[name=source]").value)
    params.set("target", form.querySelector("[name=target]").value)

    const response = await fetch(form.action, { method: 'post', body: params })
    if (response.ok) {
      const data = await response.json()
      result.className = "success"
      result.innerText = data.summary
    } else {
      result.className = "error"
      result.innerText = "Error: " + response.statusText
    }
  })
</script>

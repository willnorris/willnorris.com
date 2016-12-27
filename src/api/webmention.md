---
title: webmention
---

This site does not support traditional comments.  [Indie Web comments][] are much better since they allow you to fully
own your comment by posting it on your own site first and then sending it to me as a [webmention][].

I'm not actually displaying comments currently, but I do receive webmentions so that I can display them in the future.
If your publishing software doesn't send webmentions automatically, you can use the form below to send one my way.

[Indie Web comments]: https://indieweb.org/comment
[webmention]: https://indieweb.org/webmention

<form id="webmention" method="POST">
  <p><label>URL of your post (the webmention <code>source</code>):
  <input type="url" name="source"></label></p>

  <p><label>URL of my post that you are replying to (the webmention <code>target</code>):
  <input type="url" name="target"></label></p>

  <p><input type="submit"><span class="response"></span></p>
</form>

<script>
  $(function(){
    $('form#webmention').submit(function(event) {
      $('.response').removeClass('success').removeClass('error').text("");
      $.post(this.action, $(this).serialize(),
        function(data) {
          $('.response').addClass('success').text(data.message);
        }).fail(function(data) {
          message = data.responseJSON.message;
          $('.response').addClass('error').text("Error: " + message);
        });

      event.preventDefault();
    });
  });
</script>

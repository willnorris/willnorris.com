---
layout: post
title: Deciphering Twitter @replies
wordpress_id: 596
date: 2009-05-13T10:38:43-07:00
categories:
- technology
---
So I've been as confused as anyone as to what the current Twitter reply system is *actually* doing, so I decided to try
a quick experiment.  Just like email replies (which I recently [ranted about][]), there are two ways to designate a
reply in Twitter.  Akin to the subject of an email, you can prepend @username to your tweet, which is what most people
are talking about with this recent change.  However, the API also supports a hidden parameter named
`in_reply_to_status_id`, which is pretty much like In-Reply-To in SMTP.  This parameter is appended by twitter clients
when you actually click "reply" on a specific tweet instead of just starting a new tweet.  This is how message threading
in Tweetie and other clients works.  This is described in the [Twitter API][]:

> `in_reply_to_status_id`. Optional. The ID of an existing status that the update is in
> reply to.  Note: This parameter will be ignored unless the author of the tweet this 
> parameter references is @replied within the status text. Therefore, you must 
> start the status with @username, where username is the author of the referenced 
> tweet.

Now that note above is a little confusing.  Can the @reply appear **anywhere** in the status text, or does it
necessarily have to be at the beginning?  I decided to take two twitter accounts -- [my own][], and one I setup for a
friend's [bridal shop][] -- and see what combination of @username syntax and `in_reply_to_status_id` do and don't get
hidden.

I tried five different variations...

  - `in_reply_to` but no @replies at all -- shows up just fine.  This is consistent with the note above about
  `in_reply_to`, that if the tweet does not also include an @reply of the other person, `in_reply_to` is ignored.

  - `in_reply_to` with @reply mid-tweet -- this is hidden, suggesting that the @reply can be anywhere in the status text.

  - `in_reply_to` with @reply at beginning -- this is hidden, as expected.

  - no `in_reply_to` with @reply at front of tweet -- this is hidden, also as expected, since many people don't make use
  their client's Reply feature, and just start new tweets with "@username".  However, this addresses the use case of a
  tweet that mentions a person, but it isn't actually part of a conversation.  Like "@mtrichardson is a django rockstar,
  you people should hire him!".

  - `in_reply_to` with @reply for a different person -- this is not hidden, which is also consistent with the note
  above.  You must include an @reply for the author of the tweet that is identified by `in_reply_to`.

You can see the two twitter streams below.  First, the control, which shows all of my above tweets:

<img src="twitter-control-case.png" class="aligncenter border">

And then the experimental case, which is following me, but not [Kevin Marks][] or [Gabe Wachob][]:

<img src="twitter-experimental-case.png" class="aligncenter border">


## Conclusion

So it looks like Twitter has at least done their best to be consistent, though it may not seem like it at first.  As
best as I can tell, two things will cause a tweet to be identified as a reply:

  - the tweet begins with "@username"

  - the tweet uses the `in_reply_to` parameter, and the @username of the author of the tweet you're replying to is somewhere in your tweet.

Including the `in_reply_to` paramter without the @username of the person you're replying to, or including someone elses
@username, or including @usernames anywhere else in the tweet, do **not** mark a tweet as a reply.

So if a tweet is marked as a reply, then the rules kick in which everyone is now complaining about... that you don't see
the replies of your friends if you're not following the targeted user of the reply.

[ranted about]: http://willnorris.com/2008/12/email-etiquette-replying-to-mailing-lists
[Twitter API]: http://apiwiki.twitter.com/
[my own]: http://twitter.com/willnorris
[bridal shop]: http://twitter.com/bellemariee
[Kevin Marks]: http://twitter.com/kevinmarks
[Gabe Wachob]: http://twitter.com/gwachob

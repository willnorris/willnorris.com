---
layout: post
title: wordpress microID plugin
wordpress_id: 153
date: '2006-07-07T13:13:49-07:00'
categories:
- identity
tags:
- wordpress
- microid
- claimid
- openid
- microformats
---
(I was going to post this as a comment to [Richard's post][] which I found from the [microID blog][], but then it started to get kinda long so I decided to just write this here).

I'm a little confused by his use of microID in the comments.  In addition to adding microIDs to the blog HEAD and posts, Richard's plugin (which I have installed here) adds a microID to blog comments that is computed using the commenter's email and webpage.  I see two different use cases when it comes to microIDs and blog comments...

<!--more-->

### Verifying email/URL couplet ###

Richard quotes something [Jeremie][] says on the [microID homepage][] --

> Blog comment systems can check the given email address 
> against a MicroID from the entered home page link to help 
> reduce link spamming and blatant spoofing.

So this means a blog could potentially use a microID to verify the authenticity of an email/url claimed by a commenter.  That is, when I make a comment on someone's blog, their comment filtering system would compute a microID using the email and URL I claimed, and would make an out-of-band call back to my blog and compare the microID that I have on my site there.  If it matches, then the email and URL are "valid" so to speak, and we're done.  If it doesn't match, then the email addresses used to compute each ID are obviously different.

However, I do disagree with Jeremie's claim that this could help reduce blatant spoofing (Jeremie even mentions this himself in an [FAQ][]).  Nothing prevents me from entering someone else's email address and URL into a comment box.  When they compare microIDs, of course they will match.  This simply verifies a valid email/url couplet, but does not verify that the person making the comment actually owns either of those items.  Put simply, *microID does not do authentication* (which the webpage mentions).  Use [openID][] for that!

### Attributing ownership ###

The second use case is that of attributing ownership of a given comment to the author of that comment (which I think is what Richard was going after with his plugin).  A microID is basically an assertion of ownership with three distinct parts.

- The _authority_ making the assertion -- this is the actual webpage that the content is hosted on.  If you have the ability to manipulate the content of a given website, then it is assumed that you have some kind of authority over that security domain (or at least a small portion of it).  This authority is the URL used to compute the microID.
- The _person_ who owns the content -- in the microID world, people are identified by email address, and this email address is used to compute the microID.
- The _content_ for which ownership is being asserted -- this is not part of the microID itself, but rather is implied based on the placement of the ID.  If I am asserting ownership of an entire website, then the microID should appear within the HEAD tag.  If ownership is being asserted for a small portion of content (such as a specific blog comment), then class values are used.

Back to Richard's plugin, the content is obviously the actual comment itself and the person is the commenter, but where I think his plugin goes astray is the authority.  In this case, the authority is not the commenter's URL, but rather the URL of where this comment is hosted (most likely the URL of the original blog post the comment was made on).  This would allow the commenter to make a claim of ownership of that comment on a system such as [claimID][] (although I believe claimID only supports page level claims right now... not sections of content like this.  Speaking of which, how *would* you specify which portion of a webpage you were claiming ownership of?  Maybe use an #anchor in the URL?  The microID verifier would certainly have to know how to deal with that).

So all that to say, I think the following function:

	function add_microid_on_comment($comment = '')
	{
	    $microid = microid_hash(get_comment_author_email(), get_comment_author_url());
	    return "<div class='microid-$microid'>$comment</div>";
	}

should instead be changed to

	function add_microid_on_comment($comment = '')
	{
	    $microid = microid_hash(get_comment_author_email(), get_permalink());
	    return "<div class='microid-$microid'>$comment</div>";
	}

(Wasn't trying to pick on Richard in this post... actually I really like his plugin and find it very useful.  Explaining all this in this fashion actually helped clear it up in my head as well).

[Richard's post]: http://www.richardkmiller.com/blog/archives/2006/03/microid-plugin-for-wordpress
[microID blog]: http://microid.org/blog/?p=8
[Jeremie]: http://jeremie.com/
[microID homepage]: http://microid.org/
[claimID]: http://claimid.com/
[FAQ]: http://microid.org/blog/?p=5
[openID]: http://openid.com/

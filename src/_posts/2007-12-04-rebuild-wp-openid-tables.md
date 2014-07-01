---
layout: post
title: rebuild wp-openid tables
wordpress_id: 215
date: '2007-12-04T20:27:07-08:00'
categories:
- identity
- technology
tags:
- wordpress
- openid
- wp-openid
---
A number of people have reported problems with wp-openid in which the tables are not being built properly.  This is often manifested as an error message along the lines of...

    [You have an error in your SQL syntax; check the manual that corresponds to your 
    MySQL server version for the right syntax to use near 'WHERE comment_post_ID = 
    '12' AND openid = 1 AND ...

In the past, I've recommended that people deactivate and reactivate the plugin a couple of times to try and force the method which builds the tables to run again.  I'm now trying an utility in the wp-openid option page that will do just this... rebuild the tables.  It will essentially delete the openid_associations and openid_nonces tables, and then retry the entire table creation routine.  These two tables only hold temporary data, so you won't lose anything (the real data is stored in openid_identities and elsewhere).  If you are one of the unfortunate few that have been having this problem, please grab the latest version from [SVN][] and let me know if it fixes your problem.  If it does seem to fix it, then I'll go ahead and release this as 2.0.1.

[SVN]: http://svn.wp-plugins.org/openid/trunk/

---
title: One year at USC
date: '2007-02-15T12:25:34-08:00'
shortlink: [/b/2s, /p/172]
categories:
- identity
- personal
- technology
tags:
- shibboleth
- life
- usc
- openid
---
<figure class="alignright">
  <img src="/2006/01/usc.png" alt="USC logo">
</figure>

One year ago today, February 15, 2006, was my first official day here at USC.  If I recall correctly, I spent most of
that day filling out HR paperwork and then leaving a little early to hunt for an apartment, but it marked the beginning
nonetheless.  I generally like to look back on my birthdays and think about what I've accomplished that year and what I
want to do different the next, and this seems like an appropriate enough time to reflect on my work related stuff.  So
why the hell did I move out here to Los Angeles?  What have I been doing these last 12 months?

 - setup new Shibboleth IdP at USC with updated version of Shibboleth and more important new policy.  It's been a rocky
 road, and will continue to be, since we're running two different IdPs in parallel right now, but we're slowly working
 on migrating everyone over to the new environment.
 - developed a number of small patches and extensions for Shibboleth to customize it how we wanted it to work, two of
 which were committed upstream (ARP Constraints and Deny Anonymous) and included in the Shibboleth IdP release
 as of version 1.3.1.
 - in October, was asked to join the core Shibboleth development team.  That took a couple of months to work out the
 details with my management, but now a portion of my time at USC is spent helping to develop Shibboleth 2.0.  My primary
 focus is the attribute resolver and the attribute release policy engine, which will be included in the IdP and the Java
 implementation of the SP.
 - we've made significant updates to the meta-directory processes at USC that populate our LDAP directory.  I'm
 currently working on fully taking over the development of those processes so the previous developer can take more of an
 architectural role, which is what he's really good at.
 - attended seven conferences across the US and Canada, giving a couple of sessions myself.  I'm enjoying the
 conferences and seeing the cities, just not the actual act of traveling.
 - not directly work related, but I'm finally getting a little more serious about working on OpenID stuff.  It's mainly
 just small implementations at this point, but there's been talk for a while about trying to achieve some
 interoperability between OpenID and SAML.  We're already trying to make Shibboleth work with Cardspace, so who really
 knows.

So this next year should see moving to our new offices (probably in the next few weeks), the deployment of a new guest
system at USC, the release of Shibboleth 2.0, working on Shibboleth 2.1, and who knows what else.  So for those of you
back home that have wondered if I'm actually doing anything out here on the west coast, the answer is yes (though not as
much as I'd like).

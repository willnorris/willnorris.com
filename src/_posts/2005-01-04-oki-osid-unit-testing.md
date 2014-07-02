---
layout: post
title: OKI OSID Unit Testing
wordpress_id: 18
date: 2005-01-04T01:31:37-08:00
categories:
- technology
tags:
- java
- osid
---
As part of [hedmaster] [] I've tried to implement as many of the [OKI Specs] [] as have made sense.  I'm working on
writing extensive JUnit test cases to thoroughly test hedmaster, and I got to thinking about writing a test suite to
check for adherence to the OKI Specs.  Because the OSID interfaces are designed to enable "drop in replacement" of each
component, this shouldn't be too difficult.  There would be a test case for each OsidManager that would create and
manipulate objects and simply test that they are instances of the appropriate OSID.  The user would then write their own
test case that passed their specific implementation of each OsidManger to OsidUnitTest.

[hedmaster]: http://willnorris.com/projects/hedmaster
[oki specs]: http://www.okiproject.org/specs

As the OSIDs gradually gain acceptance, I think some simple automation like this would really help people develop proper
implementations.

---
title: OKI OSID Unit Testing
date: '2005-01-04T01:31:37-06:00'
aliases: [/b/3Z71, /b/J, /p/18]
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

[hedmaster]: https://web.archive.org/web/20050104/willnorris.com/projects/hedmaster
[oki specs]: https://web.archive.org/web/20050104/http://okiproject.org/specs/

As the OSIDs gradually gain acceptance, I think some simple automation like this would really help people develop proper
implementations.

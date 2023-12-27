---
title: "A class needed by class <...> cannot be found: org/apache/tools/ant/Task"
date: "2005-03-22T08:36:46-06:00"
aliases: [/b/3_Q1, /b/E, /p/14]
categories:
  - technology
tags:
  - ant
  - java
---

(I spent quite a few hours fighting this one, so hopefully Google will help others find this page...) After toying
around with maven a bit, I discovered that none of my ant tasks would run. I hadn't made any changes to anything in
$ANT_HOME, but all of sudden things broke. What I had done without thinking about it was to place `woproject.jar` in
`/Library/Java/Extensions`. This jar contains the classes to create a few Ant task definitions. So here's the rule...

> Never place jars that are necessary for Ant task definitions in your Java classpath
> (`/System/Library/Java/Extensions`, `/Library/Java/Extensions/`, `~/Library/Java/Extensions`)

The problem is that Java tries to load these jars before it has loaded the Ant jars that they rely on. These jars that
contain task definitions should either be placed in the Ant classpath (`$ANT_HOME/lib`, `~/.ant/lib`) or in your
project's lib directory and referenced directly using the `classpath` attribute of the `taskdef`.

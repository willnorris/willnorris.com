---
layout: default
title: wiki
---
This is space for my personal notes.  Despite the URL, it's not really a wiki in the traditional
sense, as it's not intended to be collaborative and there is no front-end editor.  It's just a set
of pages like any other.

### Pages ###

<ul>
{% for p in site.pages %}{% if p.url contains "/wiki/" and p.url != page.url %}
    <li><a href="{{ p.url }}">{{ p.title }}</a></li>
{% endif %}{% endfor %}
</ul>

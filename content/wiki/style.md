---
Title: Page Style
---

## Headings (This is h2)

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## Content

This is a paragraph of text.
It contains multiple sentences and on most screen widths will span across multiple lines.
This helps visualize the spacing between adjacent paragraphs.

This paragraph has an [inline link](#) that goes nowhere.
Text can be formatted in various ways including <b>bold</b>, <strong>strong</strong>, <i>italics</i>, <em>emphasis</em>, and <s>strikethrough</s>.
It can also be <small>small</small>, <sub>subscript</sub> and <sup>superscript</sup>.

> Block quotes have special formatting.

## Images with text

<aside class="alignleft outset"><figure>
  {{<img src="/2014/a-self-hosted-alternative-to-jetpacks-photon-service/jetpack-kid.jpg" alt="Jetpack kid" width="200">}}
</figure></aside>

This paragraph has an outset floating image to the left of the text.
The left side of the image extends into the empty margin of the page,
and text that exceeds the height of the image should wrap around to the next line.

<aside class="aligncenter"><figure>
  <a href="/2016/books-i-read-in-2015/kindle.jpg">
  {{<img src="/2016/books-i-read-in-2015/kindle.jpg" alt="Kindle" width="350">}}
  </a>
  <figcaption>This image is centered on the page.</figcaption>
</figure></aside>

<aside class="alignright"><figure>
  <a href="/2021/intentionally-positive/hand-heart.jpg">
  {{<img src="/2021/intentionally-positive/hand-heart.jpg" alt="Hand and heart" width="150" height="50">}}
  </a>
</figure></aside>

This paragraph has a floating image to the right of the text.
The right side of the image should align with the page content width,
and text that exceeds the height of the image should wrap around to the next line.

<aside class="full"><figure>
  {{<img src="/images/imageproxy/small-things.jpg" alt="Small things" width="1000">}}
  <figcaption>This image is the full width of the page</figcaption>
</figure></aside>

## Lists and Tables

- unordered list item 1
- unordered list item 2
  - sub list item
    - sub list item
      - sub list item

1. ordered list item 1
1. ordered list item 2
   1. sub list item
      1. sub list item
         1. sub list item

definition list term 1
: definition

definition list term 2
: definition

| table heading 1 | table heading 2 |
| --------------- | --------------- |
| data cell 1     | data cell 2     |
| data cell 3     | data cell 4     |

## Code and pre-formatted text.

Content with `some code` inline.

    preformatted text with four space indentation

```go
// go code sample inside a code fence (three backticks)
package sample

import "fmt"

func main() {
    var s string
    n := 123
    fmt.Println("this is sample go code")
}
```

Code sample with line numbers and highlighting:

```html {linenos=inline,hl_lines=[2,"7-9"],linenostart=199}
<!doctype html>
<!-- html code sample -->
<html>
  <head>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <h1>Heading</h1>
  </body>
</html>
```

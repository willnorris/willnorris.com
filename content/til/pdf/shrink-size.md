---
title: Shrink PDF size
---

[Shrink large PDFs] (especially those with embedded images) using ghostscript:

```
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
-dNOPAUSE -dBATCH -dColorImageResolution=150 \
-sOutputFile=output.pdf large-file.pdf
```

[Shrink large PDFs]: https://opensource.com/article/20/8/reduce-pdf

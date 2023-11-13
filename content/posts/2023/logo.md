---
title: A fun little personal logo
date: 2023-10-27T00:33:18-07:00
aliases: /b/5Tc1
---

Like many kids, I remember drawing out the letters of my name
in interesting ways in the margin of my notebook or on random scrap paper.
I always liked the symmetry of the W and M in "William",
and how the two letters could continuously flow into one another.
The N in "Norris" had a similar shape, and so I would doodle my initials
in different geometric designs, sometimes 3-dimensional or with celtic knots.

<figure class="alignleft">
<svg width="80" height="80" viewBox="0 0 300 300"><path fill="#132448" stroke="#132448" d="M31.554 86.643c3.799.142 23.85-21.491 26.791-23.703 21.438 29.347 22.032 39.505 71.449 84.088-2.975-20.317-38.262-80.601-56.562-99.327 8.932-9.029 27.56-27.152 32.744-33.296 5.491 15.799 25.006 77.316 45.252 114.563 15.479-29.347 42.52-103.844 42.271-115.128 8.849 8.192 22.393 25.94 32.153 34.427-19.056 14.673-51.801 81.83-63.711 113.435-3.451 9.167-.593 14.673-.593 14.673 10.674 8.192 46.44 41.762 52.991 47.97-13.096-84.652 14.291-141.088 33.343-161.405 3.053 3.219 12.271 10.933 22.03 20.881-10.12 13.544-30.136 48.92-30.96 85.782-1.192 53.049 7.738 76.188 22.027 97.069-6.391 7.835-11.179 7.321-20.241 18.06-14.338-13.164-68.987-62.478-78.596-71.109l1.79 40.069c.456 2.339.969 23.352 10.12 33.299-20.102.026-23.964.028-44.059.563 6.71-9.071 8.778-28.845 8.932-34.989l-.598-63.773c-7.932-7.607-47.121-43.191-50.606-46.842 4.165 21.446 4.764 88.04-25.004 138.27-2.443-3.514-27.299-33.074-26.797-33.863 9.15-14.338 25.295-46.615 25.601-76.752.559-55.033-20.922-69.503-29.767-82.962"/></svg>
<figcaption>New York Yankees logo</figcaption>
</figure>

I was really into baseball as a kid, and so I really enjoyed the way
some teams would overlay their city initials as their team logo.
The most famous, of course, being the stacked "NY" for the New York Yankees
(which apparently came from a [Tiffany-designed NYPD medal]),
but also "SD" for the San Diego Padres, and "LA" for the Los Angeles Dodgers.

[Tiffany-designed NYPD medal]: https://www.mlb.com/news/yankees-new-york-logo-origin

<figure class="alignright">
  <svg width="60" viewBox="0 0 516 560"><path fill-rule="evenodd" d="M515.581 157.65h-3.243c-52.639 0-105.277-.005-157.916.01-4.254.001-3.134-.577-5.413 3.047-29.802 47.386-59.584 94.783-89.373 142.177-.463.736-.949 1.458-1.632 2.504-.635-.929-1.17-1.659-1.65-2.424-19.447-30.941-38.889-61.887-58.333-92.83-10.509-16.725-21.049-33.43-31.494-50.194-1.061-1.704-2.184-2.336-4.192-2.334-52.958.055-105.917.044-158.876.044H.467C-.093 155.599-.169 2.473.347 0h515.127c.461 1.749.598 154.398.107 157.65zm-164.71 357.815h-185.66V323.999c31.098 46.323 61.768 92.876 92.434 139.324.233 0 .309.013.378-.003a.451.451 0 0 0 .216-.094c.166-.169.342-.335.472-.531 30.49-46.175 60.978-92.353 91.468-138.528.041-.063.122-.103.184-.152.077.014.161.013.229.045.061.029.145.093.148.146.051.714.126 1.428.126 2.143.006 62.938.005 125.879.005 189.116z" clip-rule="evenodd" fill="000" /></svg>
  <figcaption>Personal logo of <a href="http://terrymun.com/">Terry Mun</a>.</figcaption>
</figure>

In more recent years, I've seen a few of these types of logos that really stood out.
Probably the most memorable for me is [Terry Mun]'s "TM" logo using the negative space for the M.
Terry also does some really tasteful animations with his logo and the rest of his site,
but even the static logo is quite something.

[Terry Mun]: http://terrymun.com/

<figure class="alignleft">
  <svg viewBox="0 0 40 35" width="60" fill="#666666"><path d="M20 .528L0 34.973h12.392L20 21.87l7.608 13.103H40L20 .528"></path></svg>
  <figcaption>Personal logo of <a href="https://andy-bell.co.uk/">Andy Bell</a>.</figcaption>
</figure>

I had also recently rediscovered some of [Andy Bell]'s CSS work
(notably his [method for managing flow]),
and was struck by the simplicity of his triangular "A" logo on his website.
It certainly fits with the minimalist aesthetic of the rest of his site,
and it inspired me to start doodling again.

[Andy Bell]: https://andy-bell.co.uk/
[method for managing flow]: https://andy-bell.co.uk/my-favourite-3-lines-of-css/

I started with the same equilateral triangle, notched on one side using a second triangle one-third the base size.
I added the notch on the top to form a "V", then created a second one and combined them to form a "W".
Finally, I separated the left arm of the "W" to allow it to also be read as a slanted "N".

<style>
  .logo-progression svg {
    margin-inline: 1em;
  }
  .logo-progression svg path {
    background-color: #000;
    opacity: 60%;
  }
</style>

<figure class="logo-progression aligncenter">
  <svg width="60" height="51.96">
    <path d="M0 0 H60 L30 51.96 Z" />
  </svg>

  <svg width="60" height="51.96">
    <path d="M0 0 H60 L30 51.96 Z" fill="red" />
    <path d="M20 0 H40 L30 17.32 Z" fill="blue" />
  </svg>

  <svg width="60" height="51.96">
    <path d="M0 0 h20 l10 17.32 l10 -17.32 h20 l-30 51.96 Z" />
  </svg>

  <svg width="120" height="51.96">
    <path d="M0 0 h20 l10 17.32 l10 -17.32 h20 l-30 51.96 Z" fill="red" />
    <path d="M60 0 h20 l10 17.32 l10 -17.32 h20 l-30 51.96 Z" fill="blue" />
  </svg>

  <svg width="80" height="51.96">
    <path d="M0 0 h20 l10 17.32 l10 -17.32 h20 l-30 51.96 Z" fill="red" />
    <path d="M20 0 h20 l10 17.32 l10 -17.32 h20 l-30 51.96 Z" fill="blue" />
  </svg>

  <svg width="80" height="51.96">
    <path d="M0 0 H20 L30 17.32 L40 0 L50 17.32 L60 0 H80 L50 51.96 L40 34.64 L30 51.96 Z" />
  </svg>

  <svg width="80" height="51.96">
    <path d="M0 0 H20 L27 12.12 L17 29.44 Z M40 0 L50 17.32 L60 0 H80 L50 51.96 L40 34.64 L30 51.96 L20 34.64 Z" />
  </svg>
  <figcaption>Progression from simple equilateral triangle to final WN logo</figcaption>
</figure>

<figure class="alignright">
<svg width="150" height="69.796"><path d="M975.734 603.361H692.611a46.706 46.706 0 0 0-1.634-.023c-8.736 0-53.757 2.692-81.987 55.733l-34.739 63.247-60.891-110.92-13.364-24.342-13.374 24.341-60.899 110.921-34.633-63.07c-28.338-53.218-73.36-55.91-82.104-55.91-.702 0-1.252.01-1.619.023H0l10.517 21.858c1.375 2.86 13.836 28.344 27.352 42.466 9.57 10.007 19.448 14.44 26.467 16.415l4.04 8.391c1.376 2.86 13.848 28.34 27.353 42.47 11.614 12.147 23.684 16.092 30.518 17.394l3.145 6.523c1.38 2.847 13.847 28.331 27.357 42.453 16.312 17.061 33.575 17.996 35.891 18.04h85.934c.815.023 19.997.797 31.014 21.786l69.823 127.57 32.435 59.227 13.358 24.39 13.373-24.377 32.48-59.19 28.925-52.691 28.938 52.69 32.48 59.192 13.374 24.394 13.36-24.408 32.422-59.226 69.956-127.805c10.893-20.755 30.076-21.53 30.692-21.552h86.53c1.922-.044 19.183-.979 35.5-18.04 13.507-14.122 25.972-39.606 27.354-42.453l3.126-6.5c6.66-1.267 18.828-5.173 30.54-17.417 13.498-14.13 25.963-39.61 27.336-42.47l4.03-8.36c6.947-1.966 16.87-6.39 26.488-16.446 13.506-14.122 25.972-39.606 27.353-42.466L1000 603.36h-24.266" style="display:inline;fill:#000;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="matrix(.15 0 0 .15 0 -88.058)"/><path d="M305.785 737.742h-174.16s-12.444-.31-24.879-13.32c-12.222-12.788-24.638-38.542-24.638-38.542H285.45s25.108.615 36.227 22.845c11.128 22.233 21.928 41.372 21.928 41.372s-16.517-12.355-37.82-12.355M694.188 737.742h174.168s12.434-.31 24.868-13.32c12.23-12.788 24.643-38.542 24.643-38.542h-203.34s-25.108.615-36.232 22.845c-11.124 22.233-21.928 41.372-21.928 41.372s16.526-12.355 37.82-12.355" style="display:inline;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="matrix(.15 0 0 .15 0 -88.058)"/><path d="M692.186 618.603s-42.909-2.776-69.845 47.81l-48.103 87.567-74.247-135.257-74.257 135.257-48.1-87.566c-26.938-50.587-69.848-47.811-69.848-47.811H24.25s12.413 25.759 24.642 38.547c12.435 13.019 24.872 13.324 24.872 13.324h213.28s28.613 0 44.19 29.709l62.042 112.926 32.48 59.125 32.459-59.138 41.775-76.089 41.767 76.09 32.462 59.137 32.48-59.125 62.03-112.926c15.587-29.709 44.198-29.709 44.198-29.709h213.286s12.43-.305 24.873-13.324c12.226-12.788 24.634-38.547 24.634-38.547H692.186" style="display:inline;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="matrix(.15 0 0 .15 0 -88.058)"/><path d="M700.467 752.262s-42.914-2.78-69.85 47.802l-55.919 102.153-74.707-136.09-74.717 136.09-55.918-102.153c-26.93-50.583-69.845-47.802-69.845-47.802H143.12s12.418 25.75 24.64 38.538c12.442 13.01 24.879 13.33 24.879 13.33h86.135s28.604 0 44.184 29.703l69.833 127.57 32.423 59.227 32.487-59.191 42.29-77.032 42.279 77.032 32.49 59.191 32.423-59.227 69.831-127.57c15.583-29.704 44.189-29.704 44.189-29.704h86.136s12.426-.319 24.873-13.329c12.226-12.788 24.638-38.538 24.638-38.538H700.467" style="display:inline;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="matrix(.15 0 0 .15 0 -88.058)"/></svg>
  <figcaption>Wonder Woman logo</figcaption>
</figure>

I ended up with something that is most certainly inspired by Andy's logo,
but with some additional character I really like for combining the W and N.
The final result also reminds me a bit of the Wonder Woman logo,
which was not intentional but I'm kind of okay with.
I certainly don't need a personal logo, and it's somewhat of a vanity project,
but it was certainly fun to design and build.

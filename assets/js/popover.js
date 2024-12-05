const imageAnchors = Array.from(document.querySelectorAll(".e-content a"))
  .filter((a) => a.href.match(/.(jpg|jpeg|png|webp)$/))
  .filter((a) => a.querySelector("img"));
if (imageAnchors.length) {
  const popover = document.createElement("div");
  popover.setAttribute("popover", "");
  const img = document.createElement("img");
  popover.appendChild(img);
  document.body.append(popover);

  for (const a of imageAnchors) {
    a.addEventListener("click", (event) => {
      event.preventDefault();
      img.src = ""; // prevent flash of previous image
      img.src = a.href;
      popover.showPopover();
    });
  }

  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", (event) => {
    const deltaS = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    // close popover if scrolled more than 10px
    if (Math.abs(deltaS) > 10) {
      popover.hidePopover();
    }
  });
}

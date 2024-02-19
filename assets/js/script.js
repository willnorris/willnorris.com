// set scrollbar width CSS variable
document.documentElement.style.setProperty(
  "--scrollbar-width",
  window.innerWidth - document.documentElement.clientWidth + "px",
);

// load fragmention if URL fragment is present
(async () => {
  if (window.location.hash !== "") {
    await import(
      '{{ (resources.Get "js/fragmention.js" | resources.Fingerprint).RelPermalink }}'
    );
  }
})();

// run off-site links through unrot to detect dead links
(async () => {
  const links = document.querySelectorAll("a[href^=http]");
  if (links.length) {
    await import(
      '{{ (resources.Get "js/unrot.js" | resources.Fingerprint).RelPermalink }}'
    );
  }
})();

// display popover for linked images
// https://caniuse.com/popover
(async () => {
  if (!HTMLElement.prototype.hasOwnProperty("popover")) {
    return;
  }
  const imageAnchors = Array.from(document.querySelectorAll(".e-content a"))
    .filter((a) => a.href.match(/.(jpg|jpeg|png|webp)$/))
    .filter((a) => a.querySelector("img"));
  if (imageAnchors.length) {
    await import(
      '{{ (resources.Get "js/popover.js" | resources.Fingerprint).RelPermalink }}'
    );
  }
})();

// display galleries in masonry grid
// https://caniuse.com/mdn-css_properties_grid-template-rows_masonry
(async () => {
  const galleries = document.querySelectorAll(".gallery");
  if (galleries.length && !CSS.supports("grid-template-rows", "masonry")) {
    // fallback to masonry polyfill
    await import(
      '{{ (resources.Get "js/masonry.js" | resources.Fingerprint).RelPermalink }}'
    );
  }
})();

// webmention form handler
(async () => {
  const form = document.getElementById("webmention-form");
  if (form) {
    const result = form.querySelector("[result]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const params = new URLSearchParams();
      params.set("source", form.querySelector("[name=source]").value);
      params.set("target", form.querySelector("[name=target]").value);

      console.log("submitted form with params", params);
      const response = await fetch(form.action, {
        method: "post",
        body: params,
      });
      if (response.ok) {
        const data = await response.json();
        result.className = "success";
        result.innerText = data.summary;
      } else {
        result.className = "error";
        result.innerText = "Error: " + response.statusText;
      }
    });
  }
})();

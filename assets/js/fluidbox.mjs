!function(a, b, c, d) {
  function e(b2, c2) {
    this.element = b2;
    var d2 = {};
    a.each(a(this.element).data(), function(a2, b3) {
      var c3 = function(a3) {
        return a3 && a3[0].toLowerCase() + a3.slice(1);
      }, e2 = c3(a2.replace("fluidbox", ""));
      (e2 !== "" || e2 !== null) && (b3 == "false" ? b3 = false : b3 == "true" && (b3 = true), d2[e2] = b3);
    }), this.settings = a.extend({}, h, c2, d2), this.settings.viewportFill = Math.max(Math.min(parseFloat(this.settings.viewportFill), 1), 0), this.settings.stackIndex < this.settings.stackIndexDelta && (settings.stackIndexDelta = settings.stackIndex), this._name = g, this.init();
  }
  var f = a(b), g = (a(c), "fluidbox"), h = {immediateOpen: false, loader: false, maxWidth: 0, maxHeight: 0, resizeThrottle: 500, stackIndex: 1e3, stackIndexDelta: 10, viewportFill: 0.95}, i = {}, j = 0;
  (typeof console == "undefined" || console.warn === "undefined") && (console = {}, console.warn = function() {
  }), a.isFunction(a.throttle) || console.warn("Fluidbox: The jQuery debounce/throttle plugin is not found/loaded. Even though Fluidbox works without it, the window resize event will fire extremely rapidly in browsers, resulting in significant degradation in performance upon viewport resize.");
  var k = function() {
    var a2, b2 = c.createElement("fakeelement"), e2 = {transition: "transitionend", OTransition: "oTransitionEnd", MozTransition: "transitionend", WebkitTransition: "webkitTransitionEnd"};
    for (a2 in e2)
      if (b2.style[a2] !== d)
        return e2[a2];
  }, l = k(), m = {dom: function() {
    var b2 = a("<div />", {class: "fluidbox__wrap", css: {zIndex: this.settings.stackIndex - this.settings.stackIndexDelta}});
    if (a(this.element).addClass("fluidbox--closed").wrapInner(b2).find("img").first().css({opacity: 1}).addClass("fluidbox__thumb").after('<div class="fluidbox__ghost" />'), this.settings.loader) {
      var c2 = a("<div />", {class: "fluidbox__loader", css: {zIndex: 2}});
      a(this.element).find(".fluidbox__wrap").append(c2);
    }
  }, prepareFb: function() {
    var b2 = this, c2 = a(this.element);
    c2.trigger("thumbloaddone.fluidbox"), m.measure.fbElements.call(this), b2.bindEvents(), c2.addClass("fluidbox--ready"), b2.bindListeners(), c2.trigger("ready.fluidbox");
  }, measure: {viewport: function() {
    i.viewport = {w: f.width(), h: f.height()};
  }, fbElements: function() {
    var b2 = this, c2 = a(this.element), d2 = c2.find("img").first(), e2 = c2.find(".fluidbox__ghost"), f2 = c2.find(".fluidbox__wrap");
    b2.instanceData.thumb = {natW: d2[0].naturalWidth, natH: d2[0].naturalHeight, w: d2.width(), h: d2.height()}, e2.css({width: d2.width(), height: d2.height(), top: d2.offset().top - f2.offset().top + parseInt(d2.css("borderTopWidth")) + parseInt(d2.css("paddingTop")), left: d2.offset().left - f2.offset().left + parseInt(d2.css("borderLeftWidth")) + parseInt(d2.css("paddingLeft"))});
  }}, checkURL: function(a2) {
    var b2 = 0;
    return /[\s+]/g.test(a2) ? (console.warn("Fluidbox: Fluidbox opening is halted because it has detected characters in your URL string that need to be properly encoded/escaped. Whitespace(s) have to be escaped manually. See RFC3986 documentation."), b2 = 1) : /[\"\'\(\)]/g.test(a2) && (console.warn("Fluidbox: Fluidbox opening will proceed, but it has detected characters in your URL string that need to be properly encoded/escaped. These will be escaped for you. See RFC3986 documentation."), b2 = 0), b2;
  }, formatURL: function(a2) {
    return a2.replace(/"/g, "%22").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
  }};
  a.extend(e.prototype, {init: function() {
    var b2 = this, c2 = a(this.element), d2 = c2.find("img").first();
    if (m.measure.viewport(), (!b2.instanceData || !b2.instanceData.initialized) && c2.is("a") && c2.children().length === 1 && (c2.children().is("img") || c2.children().is("picture") && c2.find("img").length === 1) && c2.css("display") !== "none" && c2.children().css("display") !== "none" && c2.parents().css("display") !== "none") {
      c2.removeClass("fluidbox--destroyed"), b2.instanceData = {}, b2.instanceData.initialized = true, b2.instanceData.originalNode = c2.html(), j += 1, b2.instanceData.id = j, c2.addClass("fluidbox__instance-" + j), c2.addClass("fluidbox--initialized"), m.dom.call(b2), c2.trigger("init.fluidbox");
      var e2 = new Image();
      d2.width() > 0 && d2.height() > 0 ? m.prepareFb.call(b2) : (e2.onload = function() {
        m.prepareFb.call(b2);
      }, e2.onerror = function() {
        c2.trigger("thumbloadfail.fluidbox");
      }, e2.src = d2.attr("src"));
    }
  }, open: function() {
    var b2 = this, c2 = a(this.element), d2 = c2.find("img").first(), e2 = c2.find(".fluidbox__ghost"), f2 = c2.find(".fluidbox__wrap");
    b2.instanceData.state = 1, e2.off(l), a(".fluidbox--opened").fluidbox("close");
    var g2 = a("<div />", {class: "fluidbox__overlay", css: {zIndex: -1}});
    if (f2.append(g2), c2.removeClass("fluidbox--closed").addClass("fluidbox--loading"), m.checkURL(d2.attr("src")))
      return b2.close(), false;
    e2.css({"background-image": "url(" + m.formatURL(d2.attr("src")) + ")", opacity: 1}), m.measure.fbElements.call(b2);
    var h2;
    b2.settings.immediateOpen ? (c2.addClass("fluidbox--opened fluidbox--loaded").find(".fluidbox__wrap").css({zIndex: b2.settings.stackIndex + b2.settings.stackIndexDelta}), c2.trigger("openstart.fluidbox"), b2.compute(), d2.css({opacity: 0}), a(".fluidbox__overlay").css({opacity: 1}), e2.one(l, function() {
      c2.trigger("openend.fluidbox");
    }), h2 = new Image(), h2.onload = function() {
      if (c2.trigger("imageloaddone.fluidbox"), b2.instanceData.state === 1) {
        if (b2.instanceData.thumb.natW = h2.naturalWidth, b2.instanceData.thumb.natH = h2.naturalHeight, c2.removeClass("fluidbox--loading"), m.checkURL(h2.src))
          return b2.close({error: true}), false;
        e2.css({"background-image": "url(" + m.formatURL(h2.src) + ")"}), b2.compute();
      }
    }, h2.onerror = function() {
      b2.close({error: true}), c2.trigger("imageloadfail.fluidbox"), c2.trigger("delayedloadfail.fluidbox");
    }, h2.src = c2.attr("href")) : (h2 = new Image(), h2.onload = function() {
      return c2.trigger("imageloaddone.fluidbox"), c2.removeClass("fluidbox--loading").addClass("fluidbox--opened fluidbox--loaded").find(".fluidbox__wrap").css({zIndex: b2.settings.stackIndex + b2.settings.stackIndexDelta}), c2.trigger("openstart.fluidbox"), m.checkURL(h2.src) ? (b2.close({error: true}), false) : (e2.css({"background-image": "url(" + m.formatURL(h2.src) + ")"}), b2.instanceData.thumb.natW = h2.naturalWidth, b2.instanceData.thumb.natH = h2.naturalHeight, b2.compute(), d2.css({opacity: 0}), a(".fluidbox__overlay").css({opacity: 1}), void e2.one(l, function() {
        c2.trigger("openend.fluidbox");
      }));
    }, h2.onerror = function() {
      b2.close({error: true}), c2.trigger("imageloadfail.fluidbox");
    }, h2.src = c2.attr("href"));
  }, compute: function() {
    var b2 = this, c2 = a(this.element), d2 = c2.find("img").first(), e2 = c2.find(".fluidbox__ghost"), g2 = c2.find(".fluidbox__wrap"), h2 = b2.instanceData.thumb.natW, j2 = b2.instanceData.thumb.natH, k2 = b2.instanceData.thumb.w, l2 = b2.instanceData.thumb.h, m2 = h2 / j2, n = i.viewport.w / i.viewport.h;
    b2.settings.maxWidth > 0 ? (h2 = b2.settings.maxWidth, j2 = h2 / m2) : b2.settings.maxHeight > 0 && (j2 = b2.settings.maxHeight, h2 = j2 * m2);
    var o, p, q, r, s;
    n > m2 ? (o = j2 < i.viewport.h ? j2 : i.viewport.h * b2.settings.viewportFill, q = o / l2, r = h2 * (l2 * q / j2) / k2, s = q) : (p = h2 < i.viewport.w ? h2 : i.viewport.w * b2.settings.viewportFill, r = p / k2, q = j2 * (k2 * r / h2) / l2, s = r), b2.settings.maxWidth && b2.settings.maxHeight && console.warn("Fluidbox: Both maxHeight and maxWidth are specified. You can only specify one. If both are specified, only the maxWidth property will be respected. This will not generate any error, but may cause unexpected sizing behavior.");
    var t = f.scrollTop() - d2.offset().top + 0.5 * (l2 * (s - 1)) + 0.5 * (f.height() - l2 * s), u = 0.5 * (k2 * (s - 1)) + 0.5 * (f.width() - k2 * s) - d2.offset().left, v = parseInt(100 * r) / 100 + "," + parseInt(100 * q) / 100;
    e2.css({transform: "translate(" + parseInt(100 * u) / 100 + "px," + parseInt(100 * t) / 100 + "px) scale(" + v + ")", top: d2.offset().top - g2.offset().top, left: d2.offset().left - g2.offset().left}), c2.find(".fluidbox__loader").css({transform: "translate(" + parseInt(100 * u) / 100 + "px," + parseInt(100 * t) / 100 + "px) scale(" + v + ")"}), c2.trigger("computeend.fluidbox");
  }, recompute: function() {
    this.compute();
  }, close: function(b2) {
    var c2 = this, e2 = a(this.element), f2 = e2.find("img").first(), g2 = e2.find(".fluidbox__ghost"), h2 = e2.find(".fluidbox__wrap"), i2 = e2.find(".fluidbox__overlay"), j2 = a.extend(null, {error: false}, b2);
    return c2.instanceData.state === null || typeof c2.instanceData.state == typeof d || c2.instanceData.state === 0 ? false : (c2.instanceData.state = 0, e2.trigger("closestart.fluidbox"), e2.removeClass(function(a2, b3) {
      return (b3.match(/(^|\s)fluidbox--(opened|loaded|loading)+/g) || []).join(" ");
    }).addClass("fluidbox--closed"), g2.css({transform: "translate(0,0) scale(1,1)", top: f2.offset().top - h2.offset().top + parseInt(f2.css("borderTopWidth")) + parseInt(f2.css("paddingTop")), left: f2.offset().left - h2.offset().left + parseInt(f2.css("borderLeftWidth")) + parseInt(f2.css("paddingLeft"))}), e2.find(".fluidbox__loader").css({transform: "none"}), g2.one(l, function() {
      g2.css({opacity: 0}), f2.css({opacity: 1}), i2.remove(), h2.css({zIndex: c2.settings.stackIndex - c2.settings.stackIndexDelta}), e2.trigger("closeend.fluidbox");
    }), j2.error && g2.trigger("transitionend"), void i2.css({opacity: 0}));
  }, bindEvents: function() {
    var b2 = this, c2 = a(this.element);
    c2.on("click.fluidbox", function(a2) {
      a2.preventDefault(), b2.instanceData.state && b2.instanceData.state !== 0 ? b2.close() : b2.open();
    });
  }, bindListeners: function() {
    var b2 = this, c2 = a(this.element), d2 = function() {
      m.measure.viewport(), m.measure.fbElements.call(b2), c2.hasClass("fluidbox--opened") && b2.compute();
    };
    a.isFunction(a.throttle) ? f.on("resize.fluidbox" + b2.instanceData.id, a.throttle(b2.settings.resizeThrottle, d2)) : f.on("resize.fluidbox" + b2.instanceData.id, d2), c2.on("reposition.fluidbox", function() {
      b2.reposition();
    }), c2.on("recompute.fluidbox, compute.fluidbox", function() {
      b2.compute();
    }), c2.on("destroy.fluidbox", function() {
      b2.destroy();
    }), c2.on("close.fluidbox", function() {
      b2.close();
    });
  }, unbind: function() {
    a(this.element).off("click.fluidbox reposition.fluidbox recompute.fluidbox compute.fluidbox destroy.fluidbox close.fluidbox"), f.off("resize.fluidbox" + this.instanceData.id);
  }, reposition: function() {
    m.measure.fbElements.call(this);
  }, destroy: function() {
    var b2 = this.instanceData.originalNode;
    this.unbind(), a.data(this.element, "plugin_" + g, null), a(this.element).removeClass(function(a2, b3) {
      return (b3.match(/(^|\s)fluidbox[--|__]\S+/g) || []).join(" ");
    }).empty().html(b2).addClass("fluidbox--destroyed").trigger("destroyed.fluidbox");
  }, getMetadata: function() {
    return this.instanceData;
  }}), a.fn[g] = function(b2) {
    var c2 = arguments;
    if (b2 === d || typeof b2 == "object")
      return this.each(function() {
        a.data(this, "plugin_" + g) || a.data(this, "plugin_" + g, new e(this, b2));
      });
    if (typeof b2 == "string" && b2[0] !== "_" && b2 !== "init") {
      var f2;
      return this.each(function() {
        var d2 = a.data(this, "plugin_" + g);
        d2 instanceof e && typeof d2[b2] == "function" ? f2 = d2[b2].apply(d2, Array.prototype.slice.call(c2, 1)) : console.warn('Fluidbox: The method "' + b2 + '" used is not defined in Fluidbox. Please make sure you are calling the correct public method.');
      }), f2 !== d ? f2 : this;
    }
    return this;
  };
}(jQuery, window, document);
export default null;

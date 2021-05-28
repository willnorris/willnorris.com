/* macy.js v2.5.1 - MIT License - module from https://www.skypack.dev/view/macy */
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function(path, base) {
      return commonjsRequire(path, base === void 0 || base === null ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}
function commonjsRequire() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var macy = createCommonjsModule(function(module, exports) {
  !function(t, n) {
    module.exports = n();
  }(commonjsGlobal, function() {
    function t(t2, n2) {
      var e2 = void 0;
      return function() {
        e2 && clearTimeout(e2), e2 = setTimeout(t2, n2);
      };
    }
    function n(t2, n2) {
      for (var e2 = t2.length, r2 = e2, o2 = []; e2--; )
        o2.push(n2(t2[r2 - e2 - 1]));
      return o2;
    }
    function e(t2, n2) {
      var e2 = arguments.length > 2 && arguments[2] !== void 0 && arguments[2];
      if (window.Promise)
        return A(t2, n2, e2);
      t2.recalculate(true, true);
    }
    function r(t2) {
      for (var n2 = t2.options, e2 = t2.responsiveOptions, r2 = t2.keys, o2 = t2.docWidth, i2 = void 0, s2 = 0; s2 < r2.length; s2++) {
        var a2 = parseInt(r2[s2], 10);
        o2 >= a2 && (i2 = n2.breakAt[a2], O(i2, e2));
      }
      return e2;
    }
    function o(t2) {
      for (var n2 = t2.options, e2 = t2.responsiveOptions, r2 = t2.keys, o2 = t2.docWidth, i2 = void 0, s2 = r2.length - 1; s2 >= 0; s2--) {
        var a2 = parseInt(r2[s2], 10);
        o2 <= a2 && (i2 = n2.breakAt[a2], O(i2, e2));
      }
      return e2;
    }
    function i(t2) {
      var n2 = t2.useContainerForBreakpoints ? t2.container.clientWidth : window.innerWidth, e2 = {columns: t2.columns};
      b(t2.margin) ? e2.margin = {x: t2.margin.x, y: t2.margin.y} : e2.margin = {x: t2.margin, y: t2.margin};
      var i2 = Object.keys(t2.breakAt);
      return t2.mobileFirst ? r({options: t2, responsiveOptions: e2, keys: i2, docWidth: n2}) : o({options: t2, responsiveOptions: e2, keys: i2, docWidth: n2});
    }
    function s(t2) {
      return i(t2).columns;
    }
    function a(t2) {
      return i(t2).margin;
    }
    function c(t2) {
      var n2 = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1], e2 = s(t2), r2 = a(t2).x, o2 = 100 / e2;
      if (!n2)
        return o2;
      if (e2 === 1)
        return "100%";
      var i2 = "px";
      if (typeof r2 == "string") {
        var c2 = parseFloat(r2);
        i2 = r2.replace(c2, ""), r2 = c2;
      }
      return r2 = (e2 - 1) * r2 / e2, i2 === "%" ? o2 - r2 + "%" : "calc(" + o2 + "% - " + r2 + i2 + ")";
    }
    function u(t2, n2) {
      var e2 = s(t2.options), r2 = 0, o2 = void 0, i2 = void 0;
      if (++n2 === 1)
        return 0;
      i2 = a(t2.options).x;
      var u2 = "px";
      if (typeof i2 == "string") {
        var l2 = parseFloat(i2, 10);
        u2 = i2.replace(l2, ""), i2 = l2;
      }
      return o2 = (i2 - (e2 - 1) * i2 / e2) * (n2 - 1), r2 += c(t2.options, false) * (n2 - 1), u2 === "%" ? r2 + o2 + "%" : "calc(" + r2 + "% + " + o2 + u2 + ")";
    }
    function l(t2) {
      var n2 = 0, e2 = t2.container, r2 = t2.rows;
      v(r2, function(t3) {
        n2 = t3 > n2 ? t3 : n2;
      }), e2.style.height = n2 + "px";
    }
    function p(t2, n2) {
      var e2 = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r2 = !(arguments.length > 3 && arguments[3] !== void 0) || arguments[3], o2 = s(t2.options), i2 = a(t2.options).y;
      M(t2, o2, e2), v(n2, function(n3) {
        var e3 = 0, o3 = parseInt(n3.offsetHeight, 10);
        isNaN(o3) || (t2.rows.forEach(function(n4, r3) {
          n4 < t2.rows[e3] && (e3 = r3);
        }), n3.style.position = "absolute", n3.style.top = t2.rows[e3] + "px", n3.style.left = "" + t2.cols[e3], t2.rows[e3] += isNaN(o3) ? 0 : o3 + i2, r2 && (n3.dataset.macyComplete = 1));
      }), r2 && (t2.tmpRows = null), l(t2);
    }
    function f(t2, n2) {
      var e2 = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r2 = !(arguments.length > 3 && arguments[3] !== void 0) || arguments[3], o2 = s(t2.options), i2 = a(t2.options).y;
      M(t2, o2, e2), v(n2, function(n3) {
        t2.lastcol === o2 && (t2.lastcol = 0);
        var e3 = C(n3, "height");
        e3 = parseInt(n3.offsetHeight, 10), isNaN(e3) || (n3.style.position = "absolute", n3.style.top = t2.rows[t2.lastcol] + "px", n3.style.left = "" + t2.cols[t2.lastcol], t2.rows[t2.lastcol] += isNaN(e3) ? 0 : e3 + i2, t2.lastcol += 1, r2 && (n3.dataset.macyComplete = 1));
      }), r2 && (t2.tmpRows = null), l(t2);
    }
    var h = function t2(n2, e2) {
      if (!(this instanceof t2))
        return new t2(n2, e2);
      if (n2 && n2.nodeName)
        return n2;
      if (n2 = n2.replace(/^\s*/, "").replace(/\s*$/, ""), e2)
        return this.byCss(n2, e2);
      for (var r2 in this.selectors)
        if (e2 = r2.split("/"), new RegExp(e2[1], e2[2]).test(n2))
          return this.selectors[r2](n2);
      return this.byCss(n2);
    };
    h.prototype.byCss = function(t2, n2) {
      return (n2 || document).querySelectorAll(t2);
    }, h.prototype.selectors = {}, h.prototype.selectors[/^\.[\w\-]+$/] = function(t2) {
      return document.getElementsByClassName(t2.substring(1));
    }, h.prototype.selectors[/^\w+$/] = function(t2) {
      return document.getElementsByTagName(t2);
    }, h.prototype.selectors[/^\#[\w\-]+$/] = function(t2) {
      return document.getElementById(t2.substring(1));
    };
    var v = function(t2, n2) {
      for (var e2 = t2.length, r2 = e2; e2--; )
        n2(t2[r2 - e2 - 1]);
    }, m = function() {
      var t2 = arguments.length > 0 && arguments[0] !== void 0 && arguments[0];
      this.running = false, this.events = [], this.add(t2);
    };
    m.prototype.run = function() {
      if (!this.running && this.events.length > 0) {
        var t2 = this.events.shift();
        this.running = true, t2(), this.running = false, this.run();
      }
    }, m.prototype.add = function() {
      var t2 = this, n2 = arguments.length > 0 && arguments[0] !== void 0 && arguments[0];
      return !!n2 && (Array.isArray(n2) ? v(n2, function(n3) {
        return t2.add(n3);
      }) : (this.events.push(n2), void this.run()));
    }, m.prototype.clear = function() {
      this.events = [];
    };
    var d = function(t2) {
      var n2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.instance = t2, this.data = n2, this;
    }, y = function() {
      var t2 = arguments.length > 0 && arguments[0] !== void 0 && arguments[0];
      this.events = {}, this.instance = t2;
    };
    y.prototype.on = function() {
      var t2 = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], n2 = arguments.length > 1 && arguments[1] !== void 0 && arguments[1];
      return !(!t2 || !n2) && (Array.isArray(this.events[t2]) || (this.events[t2] = []), this.events[t2].push(n2));
    }, y.prototype.emit = function() {
      var t2 = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], n2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (!t2 || !Array.isArray(this.events[t2]))
        return false;
      var e2 = new d(this.instance, n2);
      v(this.events[t2], function(t3) {
        return t3(e2);
      });
    };
    var g = function(t2) {
      return !("naturalHeight" in t2 && t2.naturalHeight + t2.naturalWidth === 0) || t2.width + t2.height !== 0;
    }, E = function(t2, n2) {
      var e2 = arguments.length > 2 && arguments[2] !== void 0 && arguments[2];
      return new Promise(function(t3, e3) {
        if (n2.complete)
          return g(n2) ? t3(n2) : e3(n2);
        n2.addEventListener("load", function() {
          return g(n2) ? t3(n2) : e3(n2);
        }), n2.addEventListener("error", function() {
          return e3(n2);
        });
      }).then(function(n3) {
        e2 && t2.emit(t2.constants.EVENT_IMAGE_LOAD, {img: n3});
      }).catch(function(n3) {
        return t2.emit(t2.constants.EVENT_IMAGE_ERROR, {img: n3});
      });
    }, w = function(t2, e2) {
      var r2 = arguments.length > 2 && arguments[2] !== void 0 && arguments[2];
      return n(e2, function(n2) {
        return E(t2, n2, r2);
      });
    }, A = function(t2, n2) {
      var e2 = arguments.length > 2 && arguments[2] !== void 0 && arguments[2];
      return Promise.all(w(t2, n2, e2)).then(function() {
        t2.emit(t2.constants.EVENT_IMAGE_COMPLETE);
      });
    }, I = function(n2) {
      return t(function() {
        n2.emit(n2.constants.EVENT_RESIZE), n2.queue.add(function() {
          return n2.recalculate(true, true);
        });
      }, 100);
    }, N = function(t2) {
      if (t2.container = h(t2.options.container), t2.container instanceof h || !t2.container)
        return !!t2.options.debug && console.error("Error: Container not found");
      t2.container.length && (t2.container = t2.container[0]), t2.options.container = t2.container, t2.container.style.position = "relative";
    }, T = function(t2) {
      t2.queue = new m(), t2.events = new y(t2), t2.rows = [], t2.resizer = I(t2);
    }, L = function(t2) {
      var n2 = h("img", t2.container);
      window.addEventListener("resize", t2.resizer), t2.on(t2.constants.EVENT_IMAGE_LOAD, function() {
        return t2.recalculate(false, false);
      }), t2.on(t2.constants.EVENT_IMAGE_COMPLETE, function() {
        return t2.recalculate(true, true);
      }), t2.options.useOwnImageLoader || e(t2, n2, !t2.options.waitForImages), t2.emit(t2.constants.EVENT_INITIALIZED);
    }, _ = function(t2) {
      N(t2), T(t2), L(t2);
    }, b = function(t2) {
      return t2 === Object(t2) && Object.prototype.toString.call(t2) !== "[object Array]";
    }, O = function(t2, n2) {
      b(t2) || (n2.columns = t2), b(t2) && t2.columns && (n2.columns = t2.columns), b(t2) && t2.margin && !b(t2.margin) && (n2.margin = {x: t2.margin, y: t2.margin}), b(t2) && t2.margin && b(t2.margin) && t2.margin.x && (n2.margin.x = t2.margin.x), b(t2) && t2.margin && b(t2.margin) && t2.margin.y && (n2.margin.y = t2.margin.y);
    }, C = function(t2, n2) {
      return window.getComputedStyle(t2, null).getPropertyValue(n2);
    }, M = function(t2, n2) {
      var e2 = arguments.length > 2 && arguments[2] !== void 0 && arguments[2];
      if (t2.lastcol || (t2.lastcol = 0), t2.rows.length < 1 && (e2 = true), e2) {
        t2.rows = [], t2.cols = [], t2.lastcol = 0;
        for (var r2 = n2 - 1; r2 >= 0; r2--)
          t2.rows[r2] = 0, t2.cols[r2] = u(t2, r2);
      } else if (t2.tmpRows) {
        t2.rows = [];
        for (var r2 = n2 - 1; r2 >= 0; r2--)
          t2.rows[r2] = t2.tmpRows[r2];
      } else {
        t2.tmpRows = [];
        for (var r2 = n2 - 1; r2 >= 0; r2--)
          t2.tmpRows[r2] = t2.rows[r2];
      }
    }, V = function(t2) {
      var n2 = arguments.length > 1 && arguments[1] !== void 0 && arguments[1], e2 = !(arguments.length > 2 && arguments[2] !== void 0) || arguments[2], r2 = n2 ? t2.container.children : h(':scope > *:not([data-macy-complete="1"])', t2.container);
      r2 = Array.from(r2).filter(function(t3) {
        return t3.offsetParent !== null;
      });
      var o2 = c(t2.options);
      return v(r2, function(t3) {
        n2 && (t3.dataset.macyComplete = 0), t3.style.width = o2;
      }), t2.options.trueOrder ? (f(t2, r2, n2, e2), t2.emit(t2.constants.EVENT_RECALCULATED)) : (p(t2, r2, n2, e2), t2.emit(t2.constants.EVENT_RECALCULATED));
    }, R = function() {
      return !!window.Promise;
    }, x = Object.assign || function(t2) {
      for (var n2 = 1; n2 < arguments.length; n2++) {
        var e2 = arguments[n2];
        for (var r2 in e2)
          Object.prototype.hasOwnProperty.call(e2, r2) && (t2[r2] = e2[r2]);
      }
      return t2;
    };
    Array.from || (Array.from = function(t2) {
      for (var n2 = 0, e2 = []; n2 < t2.length; )
        e2.push(t2[n2++]);
      return e2;
    });
    var k = {columns: 4, margin: 2, trueOrder: false, waitForImages: false, useImageLoader: true, breakAt: {}, useOwnImageLoader: false, onInit: false, cancelLegacy: false, useContainerForBreakpoints: false};
    !function() {
      try {
        document.createElement("a").querySelector(":scope *");
      } catch (t2) {
        !function() {
          function t3(t4) {
            return function(e3) {
              if (e3 && n2.test(e3)) {
                var r3 = this.getAttribute("id");
                r3 || (this.id = "q" + Math.floor(9e6 * Math.random()) + 1e6), arguments[0] = e3.replace(n2, "#" + this.id);
                var o2 = t4.apply(this, arguments);
                return r3 === null ? this.removeAttribute("id") : r3 || (this.id = r3), o2;
              }
              return t4.apply(this, arguments);
            };
          }
          var n2 = /:scope\b/gi, e2 = t3(Element.prototype.querySelector);
          Element.prototype.querySelector = function(t4) {
            return e2.apply(this, arguments);
          };
          var r2 = t3(Element.prototype.querySelectorAll);
          Element.prototype.querySelectorAll = function(t4) {
            return r2.apply(this, arguments);
          };
        }();
      }
    }();
    var q = function t2() {
      var n2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : k;
      if (!(this instanceof t2))
        return new t2(n2);
      this.options = {}, x(this.options, k, n2), this.options.cancelLegacy && !R() || _(this);
    };
    return q.init = function(t2) {
      return console.warn("Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) "), new q(t2);
    }, q.prototype.recalculateOnImageLoad = function() {
      var t2 = arguments.length > 0 && arguments[0] !== void 0 && arguments[0];
      return e(this, h("img", this.container), !t2);
    }, q.prototype.runOnImageLoad = function(t2) {
      var n2 = arguments.length > 1 && arguments[1] !== void 0 && arguments[1], r2 = h("img", this.container);
      return this.on(this.constants.EVENT_IMAGE_COMPLETE, t2), n2 && this.on(this.constants.EVENT_IMAGE_LOAD, t2), e(this, r2, n2);
    }, q.prototype.recalculate = function() {
      var t2 = this, n2 = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], e2 = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
      return e2 && this.queue.clear(), this.queue.add(function() {
        return V(t2, n2, e2);
      });
    }, q.prototype.remove = function() {
      window.removeEventListener("resize", this.resizer), v(this.container.children, function(t2) {
        t2.removeAttribute("data-macy-complete"), t2.removeAttribute("style");
      }), this.container.removeAttribute("style");
    }, q.prototype.reInit = function() {
      this.recalculate(true, true), this.emit(this.constants.EVENT_INITIALIZED), window.addEventListener("resize", this.resizer), this.container.style.position = "relative";
    }, q.prototype.on = function(t2, n2) {
      this.events.on(t2, n2);
    }, q.prototype.emit = function(t2, n2) {
      this.events.emit(t2, n2);
    }, q.constants = {EVENT_INITIALIZED: "macy.initialized", EVENT_RECALCULATED: "macy.recalculated", EVENT_IMAGE_LOAD: "macy.image.load", EVENT_IMAGE_ERROR: "macy.image.error", EVENT_IMAGE_COMPLETE: "macy.images.complete", EVENT_RESIZE: "macy.resize"}, q.prototype.constants = q.constants, q;
  });
});
export default macy;

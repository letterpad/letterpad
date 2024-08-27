!(function () {
  "use strict";
  const t = (t) => parseInt(t, 10),
    e = (t, e) => {
      const n = t - e;
      return 0 === n ? 0 : n > 0 ? 1 : -1;
    },
    n = (t, e, n) => ({ major: t, minor: e, patch: n }),
    o = (e) => {
      const o = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(e);
      return o ? n(t(o[1]), t(o[2]), t(o[3])) : n(0, 0, 0);
    },
    r =
      ("string",
      (t) =>
        "string" ===
        ((t) => {
          const e = typeof t;
          return null === t
            ? "null"
            : "object" === e && Array.isArray(t)
              ? "array"
              : "object" === e &&
                  ((n = o = t),
                  (r = String).prototype.isPrototypeOf(n) ||
                    (null === (s = o.constructor) || void 0 === s
                      ? void 0
                      : s.name) === r.name)
                ? "string"
                : e;
          var n, o, r, s;
        })(t));
  const s = (t) => !((t) => null == t)(t),
    i = (t) => "number" == typeof t;
  class l {
    constructor(t, e) {
      (this.tag = t), (this.value = e);
    }
    static some(t) {
      return new l(!0, t);
    }
    static none() {
      return l.singletonNone;
    }
    fold(t, e) {
      return this.tag ? e(this.value) : t();
    }
    isSome() {
      return this.tag;
    }
    isNone() {
      return !this.tag;
    }
    map(t) {
      return this.tag ? l.some(t(this.value)) : l.none();
    }
    bind(t) {
      return this.tag ? t(this.value) : l.none();
    }
    exists(t) {
      return this.tag && t(this.value);
    }
    forall(t) {
      return !this.tag || t(this.value);
    }
    filter(t) {
      return !this.tag || t(this.value) ? this : l.none();
    }
    getOr(t) {
      return this.tag ? this.value : t;
    }
    or(t) {
      return this.tag ? this : t;
    }
    getOrThunk(t) {
      return this.tag ? this.value : t();
    }
    orThunk(t) {
      return this.tag ? this : t();
    }
    getOrDie(t) {
      if (this.tag) return this.value;
      throw new Error(null != t ? t : "Called getOrDie on None");
    }
    static from(t) {
      return s(t) ? l.some(t) : l.none();
    }
    getOrNull() {
      return this.tag ? this.value : null;
    }
    getOrUndefined() {
      return this.value;
    }
    each(t) {
      this.tag && t(this.value);
    }
    toArray() {
      return this.tag ? [this.value] : [];
    }
    toString() {
      return this.tag ? `some(${this.value})` : "none()";
    }
  }
  l.singletonNone = new l(!1);
  const a = (t) => (e) => e.options.get(t),
    c = a("tableofcontents_class"),
    d = a("tableofcontents_header"),
    u = a("tableofcontents_depth"),
    h = a("tableofcontents_includeheader"),
    f = a("tableofcontents_orderedlist"),
    g = a("tableofcontents_orderedlist_type"),
    m = ((t) => {
      let e = 0;
      return () =>
        "mcetoc_" + new Date().getTime().toString(32) + (e++).toString(32);
    })(),
    p = (t) => {
      const e = c(t),
        n = d(t),
        o = ((t) => {
          const e = [];
          for (let n = 1; n <= t; n++) e.push("h" + n);
          return e.join(",");
        })(u(t));
      let r = t.dom.select(o);
      return (
        r.length &&
          /^h[1-9]$/i.test(n) &&
          (r = ((t, e) => {
            const n = [];
            for (let o = 0, r = t.length; o < r; o++) {
              const r = t[o];
              e(r) && n.push(r);
            }
            return n;
          })(r, (n) => {
            const o = n.parentElement;
            return s(o) && !t.dom.hasClass(o, e) && !t.dom.isEmpty(n);
          })),
        ((t, e) => {
          const n = t.length,
            o = new Array(n);
          for (let r = 0; r < n; r++) {
            const n = t[r];
            o[r] = e(n);
          }
          return o;
        })(r, (t) => ({
          id: t.id || m(),
          level: parseInt(t.nodeName.replace(/^H/i, ""), 10),
          title: t.innerText,
          element: t,
        }))
      );
    },
    b = (t, e) => {
      let n = "";
      const o = p(t),
        r = f(t) ? "ol" : "ul",
        s = [r];
      let i =
        ((t) => {
          let e = 9;
          for (const n of t)
            if ((n.level < e && (e = n.level), 1 === e)) return e;
          return e;
        })(o) - 1;
      if (!o.length) return "";
      if ((f(t) && s.push(`type="${g(t)}"`), h(t))) {
        const o = e.getOr(t.translate("Table of Contents"));
        n += ((t, e) => {
          const n = "</" + t + ">";
          return (
            "<" + t + ' contenteditable="true">' + tinymce.DOM.encode(e) + n
          );
        })(d(t), o);
      }
      for (let t = 0; t < o.length; t++) {
        const e = o[t];
        e.element.id = e.id;
        const l = o[t + 1] && o[t + 1].level;
        if (i === e.level) n += "<li>";
        else for (let t = i; t < e.level; t++) n += `<${s.join(" ")}><li>`;
        if (
          ((n += '<a href="#' + e.id + '">' + e.title + "</a>"),
          l !== e.level && l)
        )
          for (let t = e.level; t > l; t--)
            n += t === l + 1 ? `</li></${r}><li>` : `</li></${r}>`;
        else (n += "</li>"), l || (n += `</${r}>`);
        i = e.level;
      }
      return n;
    },
    v = (t) => {
      const e = c(t),
        n = t.dom.select("." + e);
      n.length &&
        t.undoManager.transact(() => {
          var e, o;
          t.dom.setHTML(
            n,
            b(
              t,
              ((e = n[0]),
              l.from(
                null === (o = e.firstElementChild) || void 0 === o
                  ? void 0
                  : o.innerHTML
              ))
            )
          );
        });
    },
    _ = (t) => (e) => {
      const n = () => {
        const n = t.selection.isEditable();
        e.setEnabled(!t.readonly && n && ((t) => p(t).length > 0)(t));
      };
      return (
        t.on("NodeChange LoadContent SetContent change", n),
        n(),
        () => t.off("NodeChange LoadContent SetContent change", n)
      );
    },
    y = (t) => (e) => t.dom.is(e, "." + c(t)) && t.getBody().contains(e);
  tinymce.PluginManager.requireLangPack(
    "tableofcontents",
    "ar,bg_BG,ca,cs,da,de,el,es,eu,fa,fi,fr_FR,he_IL,hi,hr,hu_HU,id,it,ja,kk,ko_KR,ms,nb_NO,nl,pl,pt_BR,pt_PT,ro,ru,sk,sl_SI,sv_SE,th_TH,tr,uk,vi,zh_CN,zh_TW"
  ),
    tinymce.PluginManager.add("tableofcontents", (t) => {
      ((t, n) =>
        !!t &&
        -1 ===
          ((t, n) => {
            const o = e(t.major, n.major);
            if (0 !== o) return o;
            const r = e(t.minor, n.minor);
            if (0 !== r) return r;
            const s = e(t.patch, n.patch);
            return 0 !== s ? s : 0;
          })(
            ((t) =>
              o(
                ((t) =>
                  [t.majorVersion, t.minorVersion]
                    .join(".")
                    .split(".")
                    .slice(0, 3)
                    .join("."))(t)
              ))(t),
            o(n)
          ))(tinymce, "6.4.0")
        ? console.error(
            "The tinydrive plugin requires at least version 6.4.0 of TinyMCE."
          )
        : (((t) => {
            const e = t.options.register;
            e("tableofcontents_class", {
              processor: "string",
              default: "mce-toc",
            }),
              e("tableofcontents_header", {
                processor: (t) => r(t) && /^h[1-6]$/.test(t),
                default: "h2",
              }),
              e("tableofcontents_depth", {
                processor: (t) => i(t) && t >= 1 && t <= 9,
                default: 3,
              }),
              e("tableofcontents_includeheader", {
                processor: "boolean",
                default: !0,
              }),
              e("tableofcontents_orderedlist", {
                processor: "boolean",
                default: !1,
              }),
              e("tableofcontents_orderedlist_type", {
                processor: (t) => r(t) && ["1", "A", "a", "I", "i"].includes(t),
                default: "1",
              });
          })(t),
          ((t) => {
            t.addCommand("mceInsertToc", () => {
              ((t) => {
                const e = c(t),
                  n = t.dom.select("." + e);
                ((t, e) =>
                  !e.length ||
                  t.dom.getParents(e[0], ".mce-offscreen-selection").length >
                    0)(t, n)
                  ? t.insertContent(
                      ((t, e) => {
                        const n = b(t, e);
                        return (
                          '<div class="' +
                          t.dom.encode(c(t)) +
                          '" contenteditable="false" data-mce-toc="true">' +
                          n +
                          "</div>"
                        );
                      })(t, l.none())
                    )
                  : v(t);
              })(t);
            }),
              t.addCommand("mceUpdateToc", () => {
                v(t);
              });
          })(t),
          ((t) => {
            const e = () => t.execCommand("mceInsertToc");
            t.ui.registry.addButton("tableofcontents", {
              icon: "toc",
              tooltip: "Table of contents",
              onAction: e,
              onSetup: _(t),
            }),
              t.ui.registry.addButton("tableofcontentsupdate", {
                icon: "reload",
                tooltip: "Update",
                onAction: () => t.execCommand("mceUpdateToc"),
              }),
              t.ui.registry.addMenuItem("tableofcontents", {
                icon: "toc",
                text: "Table of contents",
                onAction: e,
                onSetup: _(t),
              }),
              t.ui.registry.addContextToolbar("tableofcontents", {
                items: "tableofcontentsupdate",
                predicate: y(t),
                scope: "node",
                position: "node",
              });
          })(t),
          ((t) => {
            const e = c(t),
              n = "data-mce-toc";
            t.on("PreProcess", (n) => {
              const o = t.dom,
                r = o.select("." + e, n.node)[0];
              r &&
                ((t, e) => {
                  for (let e = 0, r = t.length; e < r; e++)
                    (n = t[e]), o.setAttrib(n, "contentEditable", null);
                  var n;
                })([r].concat(o.select("[contenteditable]", r)));
            }),
              t.on("PreInit", () => {
                t.serializer.addTempAttr(n);
              }),
              t.on("SetContent", () => {
                const o = t.dom,
                  r = o.select("." + e)[0];
                if (r) {
                  o.setAttribs(r, { contentEditable: !1, [n]: !0 });
                  const t = r.firstElementChild;
                  s(t) && o.setAttrib(t, "contentEditable", !0);
                }
              });
          })(t));
    });
})();

!(function () {
  "use strict";
  const e = (e) => parseInt(e, 10),
    t = (e, t) => {
      const n = e - t;
      return 0 === n ? 0 : n > 0 ? 1 : -1;
    },
    n = (e, t, n) => ({ major: e, minor: t, patch: n }),
    r = (t) => {
      const r = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(t);
      return r ? n(e(r[1]), e(r[2]), e(r[3])) : n(0, 0, 0);
    },
    o = (e) => (t) =>
      ((e) => {
        const t = typeof e;
        return null === e
          ? "null"
          : "object" === t && Array.isArray(e)
            ? "array"
            : "object" === t &&
                ((n = r = e),
                (o = String).prototype.isPrototypeOf(n) ||
                  (null === (s = r.constructor) || void 0 === s
                    ? void 0
                    : s.name) === o.name)
              ? "string"
              : t;
        var n, r, o, s;
      })(t) === e,
    s = (e) => (t) => typeof t === e,
    i = o("string"),
    a = o("object"),
    l = o("array"),
    c = s("boolean"),
    p = (e) => !((e) => null == e)(e),
    u = s("function"),
    m = () => {};
  function d(e, ...t) {
    return (...n) => {
      const r = t.concat(n);
      return e.apply(null, r);
    };
  }
  const g = (e) => {
      e();
    },
    h = () => !1;
  class y {
    constructor(e, t) {
      (this.tag = e), (this.value = t);
    }
    static some(e) {
      return new y(!0, e);
    }
    static none() {
      return y.singletonNone;
    }
    fold(e, t) {
      return this.tag ? t(this.value) : e();
    }
    isSome() {
      return this.tag;
    }
    isNone() {
      return !this.tag;
    }
    map(e) {
      return this.tag ? y.some(e(this.value)) : y.none();
    }
    bind(e) {
      return this.tag ? e(this.value) : y.none();
    }
    exists(e) {
      return this.tag && e(this.value);
    }
    forall(e) {
      return !this.tag || e(this.value);
    }
    filter(e) {
      return !this.tag || e(this.value) ? this : y.none();
    }
    getOr(e) {
      return this.tag ? this.value : e;
    }
    or(e) {
      return this.tag ? this : e;
    }
    getOrThunk(e) {
      return this.tag ? this.value : e();
    }
    orThunk(e) {
      return this.tag ? this : e();
    }
    getOrDie(e) {
      if (this.tag) return this.value;
      throw new Error(null != e ? e : "Called getOrDie on None");
    }
    static from(e) {
      return p(e) ? y.some(e) : y.none();
    }
    getOrNull() {
      return this.tag ? this.value : null;
    }
    getOrUndefined() {
      return this.value;
    }
    each(e) {
      this.tag && e(this.value);
    }
    toArray() {
      return this.tag ? [this.value] : [];
    }
    toString() {
      return this.tag ? `some(${this.value})` : "none()";
    }
  }
  y.singletonNone = new y(!1);
  const f = (e, t) => {
      for (let n = 0, r = e.length; n < r; n++) t(e[n], n);
    },
    b = Object.hasOwnProperty,
    v = (e, t) => b.call(e, t),
    w = (e, t) => (e ? y.some(t) : y.none()),
    A = "generate",
    T = "insert",
    I = "discard",
    E = "stop",
    S = "regenerate",
    x = "prompt",
    C = "AI shortcuts",
    R = "ai-prompt",
    k = "Integration Error: {0}.",
    O = "Response was not a string",
    D = "respondWith was not used",
    _ = "An error occurred.",
    N = [
      {
        title: "Summarize content",
        prompt:
          "Provide the key points and concepts in this content in a succinct summary.",
        selection: !0,
      },
      {
        title: "Improve writing",
        prompt:
          "Rewrite this content with no spelling mistakes, proper grammar, and with more descriptive language, using best writing practices without losing the original meaning.",
        selection: !0,
      },
      {
        title: "Simplify language",
        prompt:
          "Rewrite this content with simplified language and reduce the complexity of the writing, so that the content is easier to understand.",
        selection: !0,
      },
      {
        title: "Expand upon",
        prompt:
          "Expand upon this content with descriptive language and more detailed explanations, to make the writing easier to understand and increase the length of the content.",
        selection: !0,
      },
      {
        title: "Trim content",
        prompt:
          "Remove any repetitive, redundant, or non-essential writing in this content without changing the meaning or losing any key information.",
        selection: !0,
      },
      {
        title: "Change tone",
        subprompts: [
          {
            title: "Professional",
            prompt:
              "Rewrite this content using polished, formal, and respectful language to convey professional expertise and competence.",
            selection: !0,
          },
          {
            title: "Casual",
            prompt:
              "Rewrite this content with casual, informal language to convey a casual conversation with a real person.",
            selection: !0,
          },
          {
            title: "Direct",
            prompt:
              "Rewrite this content with direct language using only the essential information.",
            selection: !0,
          },
          {
            title: "Confident",
            prompt:
              "Rewrite this content using compelling, optimistic language to convey confidence in the writing.",
            selection: !0,
          },
          {
            title: "Friendly",
            prompt:
              "Rewrite this content using friendly, comforting language, to convey understanding and empathy.",
            selection: !0,
          },
        ],
      },
      {
        title: "Change style",
        subprompts: [
          {
            title: "Business",
            prompt:
              "Rewrite this content as a business professional with formal language.",
            selection: !0,
          },
          {
            title: "Legal",
            prompt:
              "Rewrite this content as a legal professional using valid legal terminology.",
            selection: !0,
          },
          {
            title: "Journalism",
            prompt:
              "Rewrite this content as a journalist using engaging language to convey the importance of the information.",
            selection: !0,
          },
          {
            title: "Medical",
            prompt:
              "Rewrite this content as a medical professional using valid medical terminology.",
            selection: !0,
          },
          {
            title: "Poetic",
            prompt:
              "Rewrite this content as a poem using poetic techniques without losing the original meaning.",
            selection: !0,
          },
        ],
      },
    ],
    M = (e) => (t) => t.options.get(e),
    q =
      ((j = "ai_request"),
      (e) =>
        (
          (e) => (t) =>
            y.from(M(e)(t)).filter(u)
        )(j)(e).getOrDie(j + " has not been implemented."));
  var j;
  const L = (e) => y.from(M("ai_shortcuts")(e)).filter((e) => e.length > 0),
    $ = M("body_class"),
    P = M("content_style"),
    B = M("content_css_cors"),
    z = (e, t) => t.parse(e, { insert: !0 }),
    U = (e, t) => {
      e.execCommand("mceAiDialog", !1, t);
    },
    H = (e, t) => (n) => {
      const r = (e) => () => n.setEnabled(e),
        o = r(!0),
        s = r(!1);
      return (
        e.on("AIResponse AIError AIDialogClose", o),
        e.on("AIRequest", s),
        t.isInProgress() ? s() : o(),
        () => {
          e.off("AIResponse AIError AIDialogClose", o), e.off("AIRequest", s);
        }
      );
    },
    K = (e, t) => (n) => (
      n.setEnabled(
        y.from(t.selection).forall((t) => e.selection.isCollapsed() !== t)
      ),
      m
    ),
    W = (e, t) =>
      ((t, n) => {
        const r = t.length,
          o = new Array(r);
        for (let n = 0; n < r; n++) {
          const r = t[n];
          o[n] = ((e) => {
            return (
              v((t = e), (n = "subprompts")) && void 0 !== t[n] && null !== t[n]
            );
            var t, n;
          })((s = r))
            ? ((e, t) => ({
                type: "nestedmenuitem",
                text: t.title,
                getSubmenuItems: () => W(e, t.subprompts),
              }))(e, s)
            : ((e, t) => ({
                type: "menuitem",
                text: t.title,
                value: t.prompt,
                onSetup: K(e, t),
                onAction: () =>
                  U(e, { prompt: t.prompt, generate: !0, display: !1 }),
              }))(e, s);
        }
        var s;
        return o;
      })(t),
    J = (e) => (t, n) => {
      const r =
        ((o = i(n) ? z(n, t.parser) : n),
        (s = t.schema),
        tinymce.html.Serializer({ validate: !0 }, s).serialize(o));
      var o, s;
      const a = y
          .from(P(t))
          .map((e) => `<style type="text/css">${e}</style>`)
          .getOr(""),
        l = y
          .from(B(t))
          .map((e) => (e ? ' crossorigin="anonymous"' : ""))
          .getOr(""),
        c =
          ((p = t.contentCSS),
          (u = (e, n) =>
            `${e}<link type="text/css" rel="stylesheet" href="${t.documentBaseURI.toAbsolute(n)}"${l}>`),
          (m = ""),
          f(p, (e, t) => {
            m = u(m, e);
          }),
          m);
      var p, u, m;
      const d = t.dom.encode,
        g = `<body${y
          .from($(t))
          .map((e) => ` class="${d(e)}"`)
          .getOr("")}${y
          .from(t.getBody())
          .map((e) => d(e.dir))
          .bind((e) => w("" !== e, ` dir="${e}"`))
          .getOr("")}>`,
        h = tinymce.Env.os,
        b =
          '<script>document.addEventListener && document.addEventListener("click", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === "A" && !(' +
          (h.isMacOS() || h.isiOS() ? "e.metaKey" : "e.ctrlKey && !e.altKey") +
          ")) {e.preventDefault();}}}, false);</script> ",
        v = e ? "<style>* { opacity: 80% }</style>" : "";
      return (
        `<!DOCTYPE html><html><head><base href="${d(t.documentBaseURI.getURI())}">` +
        c +
        a +
        "<style>table, table td, table th, table caption { border: 1px dashed #bbb }</style>" +
        v +
        b +
        "</head>" +
        g +
        r +
        "</body></html>"
      );
    },
    F = J(!1),
    G = J(!0),
    V = { prompt: "", generate: !1, display: !0 },
    Q = (e) => {
      let t = e;
      return {
        get: () => t,
        set: (e) => {
          t = e;
        },
      };
    },
    Y = () => {
      const e = ((e) => {
        const t = Q(y.none()),
          n = () => t.get().each(e);
        return {
          clear: () => {
            n(), t.set(y.none());
          },
          isSet: () => t.get().isSome(),
          get: () => t.get(),
          set: (e) => {
            n(), t.set(y.some(e));
          },
        };
      })(m);
      return { ...e, on: (t) => e.get().each(t) };
    },
    X = (e, t) => e.dispatch("AIResponse", { response: t }),
    Z = (e, t) => e.dispatch("AIError", { error: t }),
    ee = (e, t) => {
      const n = tinymce.util.I18n,
        r = q(e),
        o = Y(),
        s = o.isSet,
        a = (e) => () => o.get().exists((t) => t === e),
        l = a("stream"),
        c = a("string"),
        u = Y();
      return {
        isInProgress: s,
        isStream: l,
        isString: c,
        closeStream: () => u.on(g),
        submitRequest: (s, a, l, c, m) => {
          const d = new window.AbortController(),
            g = d.signal;
          let h = !1;
          const y = {
              string: (r) => {
                (async (r) => {
                  const p = "string";
                  o.set(p), (h = !0);
                  try {
                    const o = await r(g);
                    if (!i(o)) {
                      const e = n.translate([k, O]);
                      throw (console.error(e, o), new TypeError(e));
                    }
                    const l = { type: p, data: o };
                    t.addNewThreadEvent(s, a, { response: l }),
                      X(e, l),
                      c(l.data);
                  } catch (n) {
                    const r = n;
                    t.addNewThreadEvent(s, a, { error: { type: p, error: r } }),
                      Z(e, r),
                      l(r);
                  } finally {
                    o.clear();
                  }
                })(r);
              },
              stream: (r) => {
                (async (r) => {
                  const p = "stream";
                  o.set(p), (h = !0);
                  let y = "";
                  const f = () => {
                      g.removeEventListener("abort", b), u.clear();
                    },
                    b = () => {
                      const n = { type: p, data: y };
                      t.addNewThreadEvent(s, a, { response: n }),
                        X(e, n),
                        c(y),
                        f();
                    };
                  g.addEventListener("abort", b), u.set(() => d.abort());
                  try {
                    await r(g, (e) => {
                      if (!i(e)) {
                        const t = n.translate([k, O]);
                        throw (console.error(t, e), new TypeError(t));
                      }
                      (y += e), m(y);
                    }).then(b);
                  } catch (n) {
                    u.on((e) => {
                      f(), e();
                    });
                    const r = { type: p, data: y },
                      o = n;
                    t.addNewThreadEvent(s, a, {
                      response: r,
                      error: { type: p, error: o },
                    }),
                      X(e, r),
                      Z(e, o),
                      l(o);
                  } finally {
                    o.clear();
                  }
                })(r);
              },
            },
            f = r(
              ((n, r) => {
                const o = ((e, n) => ({
                  thread: t.getThread(n).getOr([]),
                  ...e,
                }))(n, r);
                return (
                  ((e, t) => {
                    e.dispatch("AIRequest", { request: t });
                  })(e, o),
                  o
                );
              })(s, a),
              y
            );
          if (
            (p(f) &&
              console.warn(
                "Integration Warning: ai_request return type was not void."
              ),
            !h)
          ) {
            const r = n.translate([k, D]);
            console.error(r),
              t.addNewThreadEvent(s, a, {
                error: { type: "invalid", error: r },
              }),
              Z(e, r),
              l(r);
          }
        },
      };
    };
  let te = 0;
  const ne = (e) => {
      const t = new Date().getTime(),
        n = Math.floor(1e9 * Math.random());
      return te++, e + "_" + n + te + String(t);
    },
    re = () => {
      const e = Q({}),
        t = e.get,
        n = e.set,
        r = (e) => y.from(t()[e]),
        o = (e, r) => {
          const o = t();
          return (o[e] = r), n(o), r;
        };
      return {
        getThreadLog: t,
        setThreadLog: n,
        createThread: (e = []) => {
          const t = ne("mce-aithread");
          return o(t, e), t;
        },
        getThread: r,
        setThread: o,
        getLatestThreadEvent: (e) =>
          r(e).bind((e) =>
            ((e, t, n) => {
              for (let r = 0, o = e.length; r < o; r++) {
                const o = e[r];
                if (t(o, r)) return y.some(o);
                if (n(o, r)) break;
              }
              return y.none();
            })(e, (e) => v(e, "response"), h)
          ),
        addNewThreadEvent: (e, t, n) => {
          ((e, t) => {
            r(e).map((n) => o(e, t.concat(n)));
          })(t, [
            {
              eventUid: ne("mce-aithreadevent"),
              timestamp: new Date().toISOString(),
              request: e,
              ...n,
            },
          ]);
        },
      };
    },
    oe = [
      "Answer the question based on the context below.",
      "The response should be in HTML format.",
      "The response should preserve any HTML formatting, links, and styles in the context.",
    ],
    se = (e, t) =>
      `${oe.join("\n")}\n\nContext:${t.map((e) => `"""${e}"""`).getOr('""')}\n\nQuestion: """${e}"""\n\nAnswer:`,
    ie = {
      type: "input",
      name: x,
      placeholder: "Ask AI to edit or generate...",
      maximized: !0,
    },
    ae = (e) => ({
      type: "button",
      name: A,
      text: "Generate",
      icon: "send",
      buttonType: e ? "primary" : "secondary",
    }),
    le = { type: "bar", items: [ie, ae(!0)] },
    ce = [le],
    pe = (e) => ({
      type: "iframe",
      name: "preview",
      border: !0,
      sandboxed: !1,
      streamContent: e,
      transparent: !0,
    }),
    ue = { type: "button", name: T, text: "Insert", buttonType: "primary" },
    me = { type: "button", name: I, text: "Discard", buttonType: "secondary" },
    de = { ...me, name: E, text: "Stop" },
    ge = {
      type: "button",
      name: S,
      text: "Try again",
      buttonType: "secondary",
    },
    he = (e) => ({ type: "bar", items: [ue, ge, e ? de : me] }),
    ye = {
      type: "label",
      items: [],
      label: "AI responses can be inaccurate",
      align: "end",
    },
    fe = (e) => ({ type: "grid", columns: 2, items: [he(e), ye] }),
    be = { type: "htmlpanel", html: "" },
    ve = { type: "bar", items: [ie, ae(!1)] },
    we = (e) => [pe(e), fe(e), be, ve],
    Ae = we(!0),
    Te = we(!1),
    Ie = (e, t, n) => {
      const r = Y(),
        o = Y(),
        s = Y(),
        a = Q(""),
        l = (e) => (t) => {
          t.setEnabled(E, !e), f([A, T, x, S], (n) => t.setEnabled(n, e));
        },
        c = l(!1),
        p = l(!0),
        u = (e, t) => {
          t.setEnabled(A, "" !== e);
        },
        m = (t, r) => {
          const o = Q(!1),
            l = (e, t) => ({ ...r, prompt: e, preview: t }),
            m = (e, n) => {
              t.unblock(), t.redial(k(e, n));
            },
            d =
              ("error",
              (n) => {
                const o = ((e, t) => ({
                  type: "label",
                  label: "",
                  items: [
                    { type: "alertbanner", level: t, text: e, icon: "warning" },
                  ],
                }))(n, "error");
                s
                  .get()
                  .map((t) => F(e, t))
                  .fold(
                    () => m(((e) => [e, be, le])(o), l(r.prompt)),
                    (e) =>
                      m(((e) => [pe(!1), fe(!1), e, be, ve])(o), l(r.prompt, e))
                  ),
                  t.focus(x);
              });
          const g = (e) => {
              const t = i(e) ? e : e instanceof Error ? e.message : _;
              d(t);
            },
            h = (r) => {
              if (e.removed) return;
              const o = n.isStream();
              s.set(r);
              const i = F(e, r);
              if (o) t.setData({ preview: i }), p(t);
              else {
                const e = l("", i);
                m(Te, e);
              }
              u("", t), t.focus(x);
            },
            y = (n) => {
              s.set(n),
                o.get()
                  ? t.setData({ preview: G(e, n) })
                  : ((e, t) => {
                      const n = ((e, t) => {
                        const n = z(e, t);
                        let r = n;
                        do {
                          8 === (null == r ? void 0 : r.type) && r.remove();
                        } while ((r = null == r ? void 0 : r.walk()));
                        return n;
                      })(t, e.parser);
                      return w(
                        ((r = n),
                        (o = e.schema),
                        !r.isEmpty(
                          o.getNonEmptyElements(),
                          o.getWhitespaceElements()
                        )),
                        G(e, n)
                      );
                      var r, o;
                    })(e, n).each((e) => {
                      const n = l("", e);
                      m(Ae, n), c(t), o.set(!0);
                    });
            };
          if ("" !== r.prompt) {
            t.block("Awaiting response");
            const e =
              ((f = r.prompt),
              (b = r.context),
              { prompt: se(f, b), query: f, context: b.getOr(""), system: oe });
            n.submitRequest(e, a.get(), g, h, y);
          }
          var f, b;
        },
        g = (t, n = t.getData()) => {
          const r = {
            ...n,
            context: s
              .get()
              .or(
                ((e) =>
                  w(!e.selection.isCollapsed(), e.selection.getContent()))(e)
              ),
          };
          o.set(r), m(t, r);
        },
        h = (e) => {
          r.set(e), r.on(g);
        },
        y = (t, r) => {
          switch (t.name) {
            case A:
              g(r);
              break;
            case T:
              s.on((t) => {
                r.close(),
                  ((e, t) => {
                    e.insertContent(t);
                  })(e, t);
              });
              break;
            case E:
              n.closeStream();
              break;
            case I:
              r.close();
              break;
            case S:
              o.get().each((e) => m(r, e));
          }
        },
        b = (e, t) => {
          r.set(e), r.on(d(y, t));
        },
        v = (e, t) => {
          const n = t.getData();
          e.name === x && u(n.prompt, t);
        },
        C = (e, t) => {
          r.set(e), r.on(d(v, t));
        },
        R = () => {
          n.closeStream(),
            ((e) => {
              e.dispatch("AIDialogClose");
            })(e),
            o.clear(),
            s.clear(),
            r.clear();
        },
        k = (e, t) => ({
          title: "AI Assistant",
          body: { type: "panel", items: e },
          size: "medium",
          initialData: t,
          onSubmit: h,
          onAction: b,
          onChange: C,
          onClose: R,
        }),
        O = (t) => {
          const n = t.display ? ce : [],
            o = ((e) => ({ prompt: e.prompt }))(t),
            s = k(n, o);
          r.set(e.windowManager.open(s, { inline: "bottom", persistent: !0 })),
            r.on(d(u, t.prompt)),
            t.generate && r.on((e) => g(e, o));
        },
        D = () => r.on((e) => e.close());
      return {
        open: (n) => {
          r.isSet()
            ? ((e) => !(e.generate && e.prompt.length > 0))(n)
              ? r.on((e) => {
                  e.focus(x);
                })
              : ((e) => {
                  r.on(D), O(e);
                })(n)
            : ((n) => {
                a.set(t.createThread()),
                  ((e) => {
                    e.dispatch("AIDialogOpen");
                  })(e),
                  O(n);
              })(n);
        },
        close: D,
      };
    };
  tinymce.PluginManager.requireLangPack(
    "ai",
    "ar,bg_BG,ca,cs,da,de,el,es,eu,fa,fi,fr_FR,he_IL,hi,hr,hu_HU,id,it,ja,kk,ko_KR,ms,nb_NO,nl,pl,pt_BR,pt_PT,ro,ru,sk,sl_SI,sv_SE,th_TH,tr,uk,vi,zh_CN,zh_TW"
  ),
    tinymce.PluginManager.add("ai", (e) => {
      if (
        ((e, n) =>
          !!e &&
          -1 ===
            ((e, n) => {
              const r = t(e.major, n.major);
              if (0 !== r) return r;
              const o = t(e.minor, n.minor);
              if (0 !== o) return o;
              const s = t(e.patch, n.patch);
              return 0 !== s ? s : 0;
            })(
              ((e) =>
                r(
                  ((e) =>
                    [e.majorVersion, e.minorVersion]
                      .join(".")
                      .split(".")
                      .slice(0, 3)
                      .join("."))(e)
                ))(e),
              r(n)
            ))(tinymce, "6.6.0")
      )
        return (
          console.error(
            "The ai plugin requires at least version 6.6.0 of TinyMCE."
          ),
          {}
        );
      ((e) => {
        const t = e.options.register;
        t("ai_request", { processor: "function" }),
          t("ai_shortcuts", {
            processor: (e) => {
              if (c(e)) return { valid: !0, value: e ? N : [] };
              {
                const t = ((e, t) => {
                  if (l(e)) {
                    for (let n = 0, r = e.length; n < r; ++n)
                      if (!t(e[n])) return !1;
                    return !0;
                  }
                  return !1;
                })(e, a);
                return t
                  ? { value: e, valid: t }
                  : {
                      valid: !1,
                      message:
                        "Must be a boolean, empty array, or an array of objects.",
                    };
              }
            },
            default: N,
          });
      })(e);
      const n = re(),
        o = ee(e, n);
      return (
        ((e, t) => {
          e.addCommand("mceAiDialog", (e, n) => {
            const r = { ...V, ...n };
            t.open(r);
          }),
            e.addCommand("mceAiDialogClose", t.close);
        })(e, Ie(e, n, o)),
        ((e, t) => {
          e.ui.registry.addMenuItem("aidialog", {
            icon: "ai",
            text: "Ask AI...",
            shortcut: "Meta+J",
            onSetup: H(e, t),
            onAction: () => U(e),
          }),
            L(e).each((n) => {
              e.ui.registry.addNestedMenuItem("aishortcuts", {
                icon: R,
                text: C,
                onSetup: H(e, t),
                getSubmenuItems: () => W(e, n),
              });
            });
        })(e, o),
        ((e, t) => {
          e.ui.registry.addButton("aidialog", {
            icon: "ai",
            tooltip: "Ask AI",
            onSetup: H(e, t),
            onAction: () => U(e),
          }),
            L(e).each((n) => {
              e.ui.registry.addMenuButton("aishortcuts", {
                icon: R,
                tooltip: C,
                onSetup: H(e, t),
                fetch: (t) => t(W(e, n)),
              });
            });
        })(e, o),
        ((e) => {
          e.ui.registry.addContextToolbar("ai", {
            predicate: (t) => !e.selection.isCollapsed() && e.dom.isEditable(t),
            items: "aidialog aishortcuts",
            position: "selection",
            scope: "editor",
          });
        })(e),
        ((e) => {
          e.addShortcut("Meta+J", "Open Ai Dialog", () => {
            e.execCommand("mceAiDialog");
          });
        })(e),
        ((e) => ({ getThreadLog: e.getThreadLog }))(n)
      );
    });
})();

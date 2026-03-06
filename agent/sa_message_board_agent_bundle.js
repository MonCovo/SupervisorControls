/*! For license information please see sa_message_board_agent_bundle.js.LICENSE.txt */
(() => {
  "use strict";
  const t = globalThis,
    e =
      t.ShadowRoot &&
      (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) &&
      "adoptedStyleSheets" in Document.prototype &&
      "replace" in CSSStyleSheet.prototype,
    s = Symbol(),
    i = new WeakMap();
  class r {
    constructor(t, e, i) {
      if (((this._$cssResult$ = !0), i !== s))
        throw Error(
          "CSSResult is not constructable. Use `unsafeCSS` or `css` instead."
        );
      (this.cssText = t), (this.t = e);
    }
    get styleSheet() {
      let t = this.o;
      const s = this.t;
      if (e && void 0 === t) {
        const e = void 0 !== s && 1 === s.length;
        e && (t = i.get(s)),
          void 0 === t &&
            ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText),
            e && i.set(s, t));
      }
      return t;
    }
    toString() {
      return this.cssText;
    }
  }
  const o = (t, ...e) => {
      const i =
        1 === t.length
          ? t[0]
          : e.reduce(
              (e, s, i) =>
                e +
                ((t) => {
                  if (!0 === t._$cssResult$) return t.cssText;
                  if ("number" == typeof t) return t;
                  throw Error(
                    "Value passed to 'css' function must be a 'css' function result: " +
                      t +
                      ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                  );
                })(s) +
                t[i + 1],
              t[0]
            );
      return new r(i, t, s);
    },
    n = (s, i) => {
      if (e)
        s.adoptedStyleSheets = i.map((t) =>
          t instanceof CSSStyleSheet ? t : t.styleSheet
        );
      else
        for (const e of i) {
          const i = document.createElement("style"),
            r = t.litNonce;
          void 0 !== r && i.setAttribute("nonce", r),
            (i.textContent = e.cssText),
            s.appendChild(i);
        }
    },
    a = e
      ? (t) => t
      : (t) =>
          t instanceof CSSStyleSheet
            ? ((t) => {
                let e = "";
                for (const s of t.cssRules) e += s.cssText;
                return ((t) =>
                  new r("string" == typeof t ? t : t + "", void 0, s))(e);
              })(t)
            : t,
    {
      is: l,
      defineProperty: h,
      getOwnPropertyDescriptor: d,
      getOwnPropertyNames: c,
      getOwnPropertySymbols: p,
      getPrototypeOf: u,
    } = Object,
    g = globalThis,
    f = g.trustedTypes,
    m = f ? f.emptyScript : "",
    $ = g.reactiveElementPolyfillSupport,
    _ = (t, e) => t,
    y = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? m : null;
            break;
          case Object:
          case Array:
            t = null == t ? t : JSON.stringify(t);
        }
        return t;
      },
      fromAttribute(t, e) {
        let s = t;
        switch (e) {
          case Boolean:
            s = null !== t;
            break;
          case Number:
            s = null === t ? null : Number(t);
            break;
          case Object:
          case Array:
            try {
              s = JSON.parse(t);
            } catch (t) {
              s = null;
            }
        }
        return s;
      },
    },
    b = (t, e) => !l(t, e),
    x = {
      attribute: !0,
      type: String,
      converter: y,
      reflect: !1,
      hasChanged: b,
    };
  (Symbol.metadata ??= Symbol("metadata")),
    (g.litPropertyMetadata ??= new WeakMap());
  class A extends HTMLElement {
    static addInitializer(t) {
      this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t, e = x) {
      if (
        (e.state && (e.attribute = !1),
        this._$Ei(),
        this.elementProperties.set(t, e),
        !e.noAccessor)
      ) {
        const s = Symbol(),
          i = this.getPropertyDescriptor(t, s, e);
        void 0 !== i && h(this.prototype, t, i);
      }
    }
    static getPropertyDescriptor(t, e, s) {
      const { get: i, set: r } = d(this.prototype, t) ?? {
        get() {
          return this[e];
        },
        set(t) {
          this[e] = t;
        },
      };
      return {
        get() {
          return i?.call(this);
        },
        set(e) {
          const o = i?.call(this);
          r.call(this, e), this.requestUpdate(t, o, s);
        },
        configurable: !0,
        enumerable: !0,
      };
    }
    static getPropertyOptions(t) {
      return this.elementProperties.get(t) ?? x;
    }
    static _$Ei() {
      if (this.hasOwnProperty(_("elementProperties"))) return;
      const t = u(this);
      t.finalize(),
        void 0 !== t.l && (this.l = [...t.l]),
        (this.elementProperties = new Map(t.elementProperties));
    }
    static finalize() {
      if (this.hasOwnProperty(_("finalized"))) return;
      if (
        ((this.finalized = !0),
        this._$Ei(),
        this.hasOwnProperty(_("properties")))
      ) {
        const t = this.properties,
          e = [...c(t), ...p(t)];
        for (const s of e) this.createProperty(s, t[s]);
      }
      const t = this[Symbol.metadata];
      if (null !== t) {
        const e = litPropertyMetadata.get(t);
        if (void 0 !== e)
          for (const [t, s] of e) this.elementProperties.set(t, s);
      }
      this._$Eh = new Map();
      for (const [t, e] of this.elementProperties) {
        const s = this._$Eu(t, e);
        void 0 !== s && this._$Eh.set(s, t);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(t) {
      const e = [];
      if (Array.isArray(t)) {
        const s = new Set(t.flat(1 / 0).reverse());
        for (const t of s) e.unshift(a(t));
      } else void 0 !== t && e.push(a(t));
      return e;
    }
    static _$Eu(t, e) {
      const s = e.attribute;
      return !1 === s
        ? void 0
        : "string" == typeof s
        ? s
        : "string" == typeof t
        ? t.toLowerCase()
        : void 0;
    }
    constructor() {
      super(),
        (this._$Ep = void 0),
        (this.isUpdatePending = !1),
        (this.hasUpdated = !1),
        (this._$Em = null),
        this._$Ev();
    }
    _$Ev() {
      (this._$Eg = new Promise((t) => (this.enableUpdating = t))),
        (this._$AL = new Map()),
        this._$ES(),
        this.requestUpdate(),
        this.constructor.l?.forEach((t) => t(this));
    }
    addController(t) {
      (this._$E_ ??= new Set()).add(t),
        void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
    }
    removeController(t) {
      this._$E_?.delete(t);
    }
    _$ES() {
      const t = new Map(),
        e = this.constructor.elementProperties;
      for (const s of e.keys())
        this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
      t.size > 0 && (this._$Ep = t);
    }
    createRenderRoot() {
      const t =
        this.shadowRoot ??
        this.attachShadow(this.constructor.shadowRootOptions);
      return n(t, this.constructor.elementStyles), t;
    }
    connectedCallback() {
      (this.renderRoot ??= this.createRenderRoot()),
        this.enableUpdating(!0),
        this._$E_?.forEach((t) => t.hostConnected?.());
    }
    enableUpdating(t) {}
    disconnectedCallback() {
      this._$E_?.forEach((t) => t.hostDisconnected?.());
    }
    attributeChangedCallback(t, e, s) {
      this._$AK(t, s);
    }
    _$EO(t, e) {
      const s = this.constructor.elementProperties.get(t),
        i = this.constructor._$Eu(t, s);
      if (void 0 !== i && !0 === s.reflect) {
        const r = (
          void 0 !== s.converter?.toAttribute ? s.converter : y
        ).toAttribute(e, s.type);
        (this._$Em = t),
          null == r ? this.removeAttribute(i) : this.setAttribute(i, r),
          (this._$Em = null);
      }
    }
    _$AK(t, e) {
      const s = this.constructor,
        i = s._$Eh.get(t);
      if (void 0 !== i && this._$Em !== i) {
        const t = s.getPropertyOptions(i),
          r =
            "function" == typeof t.converter
              ? { fromAttribute: t.converter }
              : void 0 !== t.converter?.fromAttribute
              ? t.converter
              : y;
        (this._$Em = i),
          (this[i] = r.fromAttribute(e, t.type)),
          (this._$Em = null);
      }
    }
    requestUpdate(t, e, s, i = !1, r) {
      if (void 0 !== t) {
        if (
          ((s ??= this.constructor.getPropertyOptions(t)),
          !(s.hasChanged ?? b)(i ? r : this[t], e))
        )
          return;
        this.C(t, e, s);
      }
      !1 === this.isUpdatePending && (this._$Eg = this._$EP());
    }
    C(t, e, s) {
      this._$AL.has(t) || this._$AL.set(t, e),
        !0 === s.reflect && this._$Em !== t && (this._$Ej ??= new Set()).add(t);
    }
    async _$EP() {
      this.isUpdatePending = !0;
      try {
        await this._$Eg;
      } catch (t) {
        Promise.reject(t);
      }
      const t = this.scheduleUpdate();
      return null != t && (await t), !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
          for (const [t, e] of this._$Ep) this[t] = e;
          this._$Ep = void 0;
        }
        const t = this.constructor.elementProperties;
        if (t.size > 0)
          for (const [e, s] of t)
            !0 !== s.wrapped ||
              this._$AL.has(e) ||
              void 0 === this[e] ||
              this.C(e, this[e], s);
      }
      let t = !1;
      const e = this._$AL;
      try {
        (t = this.shouldUpdate(e)),
          t
            ? (this.willUpdate(e),
              this._$E_?.forEach((t) => t.hostUpdate?.()),
              this.update(e))
            : this._$ET();
      } catch (e) {
        throw ((t = !1), this._$ET(), e);
      }
      t && this._$AE(e);
    }
    willUpdate(t) {}
    _$AE(t) {
      this._$E_?.forEach((t) => t.hostUpdated?.()),
        this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
        this.updated(t);
    }
    _$ET() {
      (this._$AL = new Map()), (this.isUpdatePending = !1);
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$Eg;
    }
    shouldUpdate(t) {
      return !0;
    }
    update(t) {
      (this._$Ej &&= this._$Ej.forEach((t) => this._$EO(t, this[t]))),
        this._$ET();
    }
    updated(t) {}
    firstUpdated(t) {}
  }
  (A.elementStyles = []),
    (A.shadowRootOptions = { mode: "open" }),
    (A[_("elementProperties")] = new Map()),
    (A[_("finalized")] = new Map()),
    $?.({ ReactiveElement: A }),
    (g.reactiveElementVersions ??= []).push("2.0.2");
  const v = globalThis,
    E = v.trustedTypes,
    w = E ? E.createPolicy("lit-html", { createHTML: (t) => t }) : void 0,
    S = "$lit$",
    C = `lit$${(Math.random() + "").slice(9)}$`,
    k = "?" + C,
    P = `<${k}>`,
    U = document,
    T = () => U.createComment(""),
    M = (t) => null === t || ("object" != typeof t && "function" != typeof t),
    N = Array.isArray,
    O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    H = /-->/g,
    R = />/g,
    z = RegExp(
      ">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)",
      "g"
    ),
    B = /'/g,
    I = /"/g,
    L = /^(?:script|style|textarea|title)$/i,
    j =
      (t) =>
      (e, ...s) => ({ _$litType$: t, strings: e, values: s }),
    D = j(1),
    W = (j(2), Symbol.for("lit-noChange")),
    G = Symbol.for("lit-nothing"),
    V = new WeakMap(),
    q = U.createTreeWalker(U, 129);
  function J(t, e) {
    if (!Array.isArray(t) || !t.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return void 0 !== w ? w.createHTML(e) : e;
  }
  const F = (t, e) => {
    const s = t.length - 1,
      i = [];
    let r,
      o = 2 === e ? "<svg>" : "",
      n = O;
    for (let e = 0; e < s; e++) {
      const s = t[e];
      let a,
        l,
        h = -1,
        d = 0;
      for (; d < s.length && ((n.lastIndex = d), (l = n.exec(s)), null !== l); )
        (d = n.lastIndex),
          n === O
            ? "!--" === l[1]
              ? (n = H)
              : void 0 !== l[1]
              ? (n = R)
              : void 0 !== l[2]
              ? (L.test(l[2]) && (r = RegExp("</" + l[2], "g")), (n = z))
              : void 0 !== l[3] && (n = z)
            : n === z
            ? ">" === l[0]
              ? ((n = r ?? O), (h = -1))
              : void 0 === l[1]
              ? (h = -2)
              : ((h = n.lastIndex - l[2].length),
                (a = l[1]),
                (n = void 0 === l[3] ? z : '"' === l[3] ? I : B))
            : n === I || n === B
            ? (n = z)
            : n === H || n === R
            ? (n = O)
            : ((n = z), (r = void 0));
      const c = n === z && t[e + 1].startsWith("/>") ? " " : "";
      o +=
        n === O
          ? s + P
          : h >= 0
          ? (i.push(a), s.slice(0, h) + S + s.slice(h) + C + c)
          : s + C + (-2 === h ? e : c);
    }
    return [J(t, o + (t[s] || "<?>") + (2 === e ? "</svg>" : "")), i];
  };
  class K {
    constructor({ strings: t, _$litType$: e }, s) {
      let i;
      this.parts = [];
      let r = 0,
        o = 0;
      const n = t.length - 1,
        a = this.parts,
        [l, h] = F(t, e);
      if (
        ((this.el = K.createElement(l, s)),
        (q.currentNode = this.el.content),
        2 === e)
      ) {
        const t = this.el.content.firstChild;
        t.replaceWith(...t.childNodes);
      }
      for (; null !== (i = q.nextNode()) && a.length < n; ) {
        if (1 === i.nodeType) {
          if (i.hasAttributes())
            for (const t of i.getAttributeNames())
              if (t.endsWith(S)) {
                const e = h[o++],
                  s = i.getAttribute(t).split(C),
                  n = /([.?@])?(.*)/.exec(e);
                a.push({
                  type: 1,
                  index: r,
                  name: n[2],
                  strings: s,
                  ctor:
                    "." === n[1]
                      ? tt
                      : "?" === n[1]
                      ? et
                      : "@" === n[1]
                      ? st
                      : Q,
                }),
                  i.removeAttribute(t);
              } else
                t.startsWith(C) &&
                  (a.push({ type: 6, index: r }), i.removeAttribute(t));
          if (L.test(i.tagName)) {
            const t = i.textContent.split(C),
              e = t.length - 1;
            if (e > 0) {
              i.textContent = E ? E.emptyScript : "";
              for (let s = 0; s < e; s++)
                i.append(t[s], T()),
                  q.nextNode(),
                  a.push({ type: 2, index: ++r });
              i.append(t[e], T());
            }
          }
        } else if (8 === i.nodeType)
          if (i.data === k) a.push({ type: 2, index: r });
          else {
            let t = -1;
            for (; -1 !== (t = i.data.indexOf(C, t + 1)); )
              a.push({ type: 7, index: r }), (t += C.length - 1);
          }
        r++;
      }
    }
    static createElement(t, e) {
      const s = U.createElement("template");
      return (s.innerHTML = t), s;
    }
  }
  function X(t, e, s = t, i) {
    if (e === W) return e;
    let r = void 0 !== i ? s._$Co?.[i] : s._$Cl;
    const o = M(e) ? void 0 : e._$litDirective$;
    return (
      r?.constructor !== o &&
        (r?._$AO?.(!1),
        void 0 === o ? (r = void 0) : ((r = new o(t)), r._$AT(t, s, i)),
        void 0 !== i ? ((s._$Co ??= [])[i] = r) : (s._$Cl = r)),
      void 0 !== r && (e = X(t, r._$AS(t, e.values), r, i)),
      e
    );
  }
  class Y {
    constructor(t, e) {
      (this._$AV = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = e);
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t) {
      const {
          el: { content: e },
          parts: s,
        } = this._$AD,
        i = (t?.creationScope ?? U).importNode(e, !0);
      q.currentNode = i;
      let r = q.nextNode(),
        o = 0,
        n = 0,
        a = s[0];
      for (; void 0 !== a; ) {
        if (o === a.index) {
          let e;
          2 === a.type
            ? (e = new Z(r, r.nextSibling, this, t))
            : 1 === a.type
            ? (e = new a.ctor(r, a.name, a.strings, this, t))
            : 6 === a.type && (e = new it(r, this, t)),
            this._$AV.push(e),
            (a = s[++n]);
        }
        o !== a?.index && ((r = q.nextNode()), o++);
      }
      return (q.currentNode = U), i;
    }
    p(t) {
      let e = 0;
      for (const s of this._$AV)
        void 0 !== s &&
          (void 0 !== s.strings
            ? (s._$AI(t, s, e), (e += s.strings.length - 2))
            : s._$AI(t[e])),
          e++;
    }
  }
  class Z {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, s, i) {
      (this.type = 2),
        (this._$AH = G),
        (this._$AN = void 0),
        (this._$AA = t),
        (this._$AB = e),
        (this._$AM = s),
        (this.options = i),
        (this._$Cv = i?.isConnected ?? !0);
    }
    get parentNode() {
      let t = this._$AA.parentNode;
      const e = this._$AM;
      return void 0 !== e && 11 === t?.nodeType && (t = e.parentNode), t;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t, e = this) {
      (t = X(this, t, e)),
        M(t)
          ? t === G || null == t || "" === t
            ? (this._$AH !== G && this._$AR(), (this._$AH = G))
            : t !== this._$AH && t !== W && this._(t)
          : void 0 !== t._$litType$
          ? this.g(t)
          : void 0 !== t.nodeType
          ? this.$(t)
          : ((t) => N(t) || "function" == typeof t?.[Symbol.iterator])(t)
          ? this.T(t)
          : this._(t);
    }
    k(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    $(t) {
      this._$AH !== t && (this._$AR(), (this._$AH = this.k(t)));
    }
    _(t) {
      this._$AH !== G && M(this._$AH)
        ? (this._$AA.nextSibling.data = t)
        : this.$(U.createTextNode(t)),
        (this._$AH = t);
    }
    g(t) {
      const { values: e, _$litType$: s } = t,
        i =
          "number" == typeof s
            ? this._$AC(t)
            : (void 0 === s.el &&
                (s.el = K.createElement(J(s.h, s.h[0]), this.options)),
              s);
      if (this._$AH?._$AD === i) this._$AH.p(e);
      else {
        const t = new Y(i, this),
          s = t.u(this.options);
        t.p(e), this.$(s), (this._$AH = t);
      }
    }
    _$AC(t) {
      let e = V.get(t.strings);
      return void 0 === e && V.set(t.strings, (e = new K(t))), e;
    }
    T(t) {
      N(this._$AH) || ((this._$AH = []), this._$AR());
      const e = this._$AH;
      let s,
        i = 0;
      for (const r of t)
        i === e.length
          ? e.push((s = new Z(this.k(T()), this.k(T()), this, this.options)))
          : (s = e[i]),
          s._$AI(r),
          i++;
      i < e.length && (this._$AR(s && s._$AB.nextSibling, i), (e.length = i));
    }
    _$AR(t = this._$AA.nextSibling, e) {
      for (this._$AP?.(!1, !0, e); t && t !== this._$AB; ) {
        const e = t.nextSibling;
        t.remove(), (t = e);
      }
    }
    setConnected(t) {
      void 0 === this._$AM && ((this._$Cv = t), this._$AP?.(t));
    }
  }
  class Q {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, s, i, r) {
      (this.type = 1),
        (this._$AH = G),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = i),
        (this.options = r),
        s.length > 2 || "" !== s[0] || "" !== s[1]
          ? ((this._$AH = Array(s.length - 1).fill(new String())),
            (this.strings = s))
          : (this._$AH = G);
    }
    _$AI(t, e = this, s, i) {
      const r = this.strings;
      let o = !1;
      if (void 0 === r)
        (t = X(this, t, e, 0)),
          (o = !M(t) || (t !== this._$AH && t !== W)),
          o && (this._$AH = t);
      else {
        const i = t;
        let n, a;
        for (t = r[0], n = 0; n < r.length - 1; n++)
          (a = X(this, i[s + n], e, n)),
            a === W && (a = this._$AH[n]),
            (o ||= !M(a) || a !== this._$AH[n]),
            a === G ? (t = G) : t !== G && (t += (a ?? "") + r[n + 1]),
            (this._$AH[n] = a);
      }
      o && !i && this.O(t);
    }
    O(t) {
      t === G
        ? this.element.removeAttribute(this.name)
        : this.element.setAttribute(this.name, t ?? "");
    }
  }
  class tt extends Q {
    constructor() {
      super(...arguments), (this.type = 3);
    }
    O(t) {
      this.element[this.name] = t === G ? void 0 : t;
    }
  }
  class et extends Q {
    constructor() {
      super(...arguments), (this.type = 4);
    }
    O(t) {
      this.element.toggleAttribute(this.name, !!t && t !== G);
    }
  }
  class st extends Q {
    constructor(t, e, s, i, r) {
      super(t, e, s, i, r), (this.type = 5);
    }
    _$AI(t, e = this) {
      if ((t = X(this, t, e, 0) ?? G) === W) return;
      const s = this._$AH,
        i =
          (t === G && s !== G) ||
          t.capture !== s.capture ||
          t.once !== s.once ||
          t.passive !== s.passive,
        r = t !== G && (s === G || i);
      i && this.element.removeEventListener(this.name, this, s),
        r && this.element.addEventListener(this.name, this, t),
        (this._$AH = t);
    }
    handleEvent(t) {
      "function" == typeof this._$AH
        ? this._$AH.call(this.options?.host ?? this.element, t)
        : this._$AH.handleEvent(t);
    }
  }
  class it {
    constructor(t, e, s) {
      (this.element = t),
        (this.type = 6),
        (this._$AN = void 0),
        (this._$AM = e),
        (this.options = s);
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      X(this, t);
    }
  }
  (0, v.litHtmlPolyfillSupport)?.(K, Z),
    (v.litHtmlVersions ??= []).push("3.1.0");
  class rt extends A {
    constructor() {
      super(...arguments),
        (this.renderOptions = { host: this }),
        (this._$Do = void 0);
    }
    createRenderRoot() {
      const t = super.createRenderRoot();
      return (this.renderOptions.renderBefore ??= t.firstChild), t;
    }
    update(t) {
      const e = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
        super.update(t),
        (this._$Do = ((t, e, s) => {
          const i = s?.renderBefore ?? e;
          let r = i._$litPart$;
          if (void 0 === r) {
            const t = s?.renderBefore ?? null;
            i._$litPart$ = r = new Z(
              e.insertBefore(T(), t),
              t,
              void 0,
              s ?? {}
            );
          }
          return r._$AI(t), r;
        })(e, this.renderRoot, this.renderOptions));
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(!0);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(!1);
    }
    render() {
      return W;
    }
  }
  (rt._$litElement$ = !0),
    (rt.finalized = !0),
    globalThis.litElementHydrateSupport?.({ LitElement: rt }),
    (0, globalThis.litElementPolyfillSupport)?.({ LitElement: rt }),
    (globalThis.litElementVersions ??= []).push("4.0.2");
  const ot = o`:host{display:grid;grid-template-rows:auto auto auto}.light{--color: #2d599c;--bkg: #c7eeff;--news: #d4371c}.dark{--color: #c7eeff;--bkg: #2d599c;--news: #d97f00}header{display:flex;justify-content:center;align-items:center;grid-row:1;grid-column:1/-1;text-align:center}main{grid-row:2;grid-template-columns:repeat(2, 1fr);display:grid;margin-left:7%}.large-card{grid-column:1}.small-card-container{display:flex;flex-direction:column}.small-card{width:100%}.mainCard{width:600px;height:fit-content;padding-top:20px;padding-bottom:20px;padding-left:35px;padding-right:35px;border:1px solid var(--mainCardBorder);background-color:var(--mainCardbkg);margin-bottom:20px;margin-left:10px;margin-right:10px;border-radius:10px;position:relative}form{display:grid;gap:10px;grid-template-columns:max-content 1fr;align-items:center}label{text-align:right;padding-right:10px;font-weight:bold;font-family:"Inter",sans-serif;letter-spacing:1px;align-items:center;color:var(--label)}input{padding:8px;box-sizing:border-box;border:1px solid var(--inputborder);border-radius:4px;width:100%;align-items:center;font-family:"Inter",sans-serif;font-size:18px;background:var(--inputbackground);outline:none}.board-container{width:310px;min-height:47px;max-height:47px;overflow:hidden;background:var(--bkg);color:var(--color);border-radius:6px}p{margin-top:10px;white-space:nowrap;width:fit-content;display:flex;justify-content:center;align-items:center;color:var(--color);font-size:1.2rem;font-family:"Inter",sans-serif;animation:scroll 10s linear infinite}@keyframes scroll{from{transform:translateX(100%)}to{transform:translateX(-100%)}}input:focus{background:var(--inputFocusBkg);color:var(--inputFocusColor)}.space{height:20px}.mainCard-footer{text-align:center;padding:10px;margin-top:20px}.button{padding:.55rem 1.5rem;width:fit-content;background-color:var(--button);color:#fff;text-decoration:none;border-radius:6.25rem;border:none;cursor:pointer;font-family:"Inter",sans-serif}.button:hover{background-color:var(--butonHover)}.alerts{text-align:center;padding:15px;width:100%;display:flex;justify-content:center;align-items:center;position:relative}.alerts .close-button{cursor:pointer;font-size:30px;position:absolute;top:30%;right:.05%;transform:translateY(-50%);padding:5px}.alert-area{height:50px;padding:10px;display:flex;justify-content:center;align-items:center;margin-bottom:10px;width:100%}.title{display:flex;justify-content:center;align-items:center;margin-bottom:30px}h2{font-family:"Inter",sans-serif;letter-spacing:2px;color:var(--h2Color)}.info-button{padding:5px;font-size:24px;margin-bottom:10px;cursor:pointer;color:#3498db;font-family:"Material Symbols Outlined",sans-serif}.card-images-email{position:absolute;top:0;right:100px;margin:10px}.card-images-sms{position:absolute;top:0;right:27%;margin:10px}.card-images-GPT{position:absolute;top:0;right:23%;margin:10px}.svg{font-family:"Material Symbols Outlined",sans-serif;font-size:30px;color:var(--div);cursor:pointer}.chatGPT-input-container{position:relative}.chatGPT-button-area{margin-top:20px;float:right}.chatGPT-answer-area{margin-top:100px}.chatGPT-answer{padding:20px 30px;border:1px solid #ddd;border-radius:12px;width:540px;min-height:200px;max-height:200px;overflow:auto;font-family:"Inter",sans-serif;color:var(--color)}.chatGPT-clear-button{position:absolute;top:50%;right:10px;transform:translateY(-50%);cursor:pointer;font-size:16px;color:#999}.overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:999;display:none}.modal{position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:1000;display:none;font-family:"Inter",sans-serif}.visible{display:block}.tox-notifications-container{display:none}.tox .tox-notification--in{display:none}.tox .tox-statusbar a{display:none}.tox:not([dir=rtl]){border-radius:12px;width:100%;border:1px solid var(--mceBorder)}.tox .tox-menubar{background:var(--mceBkg)}.tox .tox-menubar+.tox-toolbar-overlord .tox-toolbar__primary{border-top:1px solid var(--mceBorder)}.tox .tox-toolbar-overlord{background:var(--mceBkg);border-bottom:1px solid var(--mceBorder)}.tox .tox-edit-area__iframe{background:var(--mceBkg)}.tox .tox-toolbar__primary{background:var(--mceBkg);border-top:1px solid var(--mceBorder)}@media(max-width: 1300px){.board-container{width:300px}}`;
  class nt extends rt {
    static styles = o([ot]);
    static properties = {
      messages: { type: Array },
      darkMode: { type: Boolean },
    };
    constructor() {
      super(),
        (this.darkMode = !1),
        (this.messages = []),
        (this.ws = new WebSocket("wss://sa-messageboard.onrender.com"));
      const t = document.createElement("link");
      (t.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300&family=Material+Symbols+Outlined:wght@100&family=Montserrat:wght@300&display=swap"),
        (t.rel = "stylesheet"),
        document.head.append(t),
        this.ws.addEventListener("message", (t) => {
          const e = JSON.parse(t.data);
          if ("INITIAL_MESSAGES" === e.type) {
            this.messages = e.messages;
            let t = JSON.parse(e.messages);
            this.messages = t.text;
          } else if ("NEW_MESSAGE" === e.type) {
            this.messages = e.message;
            let t = JSON.parse(e.stringMessage);
            this.messages = t.text;
          }
          this.requestUpdate();
        });
    }
    attributeChangedCallback(t, e, s) {
      super.attributeChangedCallback(t, e, s),
        "darkMode" === t &&
          e !== s &&
          ((this.darkMode = "true" === s), this.requestUpdate());
    }
    updated(t) {
      super.updated(t);
    }
    render() {
      const t = this.darkMode ? "dark" : "light";
      return D`
      <div class="${t}">
        <div class="board-container">
          <p>${this.messages}</p>
        </div>
      </div>
    `;
    }
  }
  window.customElements.define("sa-message-board-agent", nt);
})();

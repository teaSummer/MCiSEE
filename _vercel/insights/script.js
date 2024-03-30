"use strict";
(() => {
    function e(e) {
        let t = location.href;
        if (e) {
            let n = new URL(t);
            if (n.pathname !== e) return n.pathname = e, n.search = "", n.href
        }
        return t
    }
    var t, n, a, i, r = (a = () => {}, () => (a && (i = a(a = 0)), i));
    (t = () => {
        r(),
            function() {
                let t = e => e,
                    n = document.currentScript,
                    a = (null == n ? void 0 : n.dataset.endpoint) || (null != n && n.src.includes("/va/") ? "/va" : "/_vercel/insights"),
                    i = null == n ? void 0 : n.dataset.disableAutoTrack,
                    r = null,
                    o = null,
                    l = !0;
                async function s({
                    type: i,
                    data: l,
                    options: s
                }) {
                    var u, d;
                    let c = e(o),
                        h = document.referrer,
                        p = t({
                            type: i,
                            url: c
                        });
                    if (!1 === p || null === p) return;
                    p && (c = p.url);
                    let f = h.includes(location.host),
                        v = {
                            o: c,
                            sv: "0.1.2",
                            sdkn: null != (u = null == n ? void 0 : n.dataset.sdkn) ? u : void 0,
                            sdkv: null != (d = null == n ? void 0 : n.dataset.sdkv) ? d : void 0,
                            ts: Date.now(),
                            ...r && {
                                dp: r
                            },
                            ...null != s && s.withReferrer && !f ? {
                                r: h
                            } : {},
                            ..."event" === i && l && {
                                en: l.name,
                                ed: l.data
                            }
                        };
                    try {
                        await fetch(`${a}/${"pageview"===i?"view":"event"}`, {
                            method: "POST",
                            keepalive: !0,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(v)
                        })
                    } catch (w) {}
                }
                async function u(e = {}) {
                    return s({
                        type: "pageview",
                        options: {
                            withReferrer: e.withReferrer
                        }
                    })
                }
                async function d(e, t) {
                    return s({
                        type: "event",
                        data: {
                            name: e,
                            data: t
                        },
                        options: {
                            withReferrer: !0
                        }
                    })
                }
                async function c() {
                    await fetch(`${a}/session`, {
                        method: "GET",
                        keepalive: !0
                    }).catch(() => {})
                }

                function h(e) {
                    return e.pathname === new URL(f).pathname
                }

                function p(e) {
                    let t = e ? "string" == typeof e ? new URL(e, location.origin) : new URL(e.href) : null;
                    !t || h(t) || Boolean(t.hash) && h(t) || u()
                }
                let f = e(),
                    v = () => {
                        var e;
                        window.va = function(e, n) {
                            "beforeSend" === e ? t = n : "event" === e ? n && d(n.name, n.data) : "pageview" === e && n && (n.route && (r = n.route), n.path && (o = n.path), u({
                                withReferrer: l
                            }), l = !1), "enableCookie" === e && c()
                        }, null == (e = window.vaq) || e.forEach(([e, t]) => {
                            window.va(e, t)
                        })
                    };
                (() => {
                    if (window.vai || (window.vai = !0, v(), i)) return;
                    u({
                        withReferrer: !0
                    });
                    let t = history.pushState.bind(history);
                    history.pushState = function(...n) {
                        t(...n);
                        try {
                            p(n[2]), f = e()
                        } catch (a) {}
                    }, window.addEventListener("popstate", function() {
                        p(e()), f = e()
                    })
                })()
            }()
    }, () => (n || t((n = {
        exports: {}
    }).exports, n), n.exports))()
})();
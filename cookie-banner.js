/* ═══════════════════════════════════════════════════════════════
   O ALQUIMISTA · COOKIE BANNER
   Vanilla JS autónomo. Injeta o seu próprio <style> e markup.
   Partilhado por todas as páginas — basta:
     <script src="cookie-banner.js" defer></script>
   O consentimento fica em localStorage (alq_ck_v1), por isso só
   aparece uma vez por visitante, em qualquer página.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var KEY = "alq_ck_v1";
  try {
    if (localStorage.getItem(KEY)) return;
  } catch (e) {}

  var reduce = window.matchMedia(
    "(prefers-reduced-motion:reduce)",
  ).matches;

  /* ── Estilo (usa os design tokens da página, com fallback) ── */
  var css = [
    ".alq-ck{position:fixed;right:24px;bottom:24px;z-index:60;width:348px;",
    "max-width:calc(100vw - 32px);padding:22px 22px 20px;",
    "background:linear-gradient(160deg,rgba(26,24,20,.72) 0%,rgba(10,10,10,.7) 60%);",
    "backdrop-filter:blur(16px) saturate(120%);",
    "-webkit-backdrop-filter:blur(16px) saturate(120%);",
    "border:1px solid rgba(212,168,90,.28);border-radius:16px;",
    "box-shadow:0 24px 60px -22px rgba(0,0,0,.8),0 0 42px -24px rgba(212,168,90,.35),",
    "inset 0 1px 0 rgba(232,230,224,.04);",
    "font-family:var(--sans,'Inter',system-ui,sans-serif);color:var(--ink,#e8e6e0);",
    "opacity:0;transform:translateY(20px) scale(.985);pointer-events:none;",
    "transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)}",
    ".alq-ck::before{content:'';position:absolute;left:18px;right:18px;top:0;height:1px;",
    "background:linear-gradient(90deg,transparent,rgba(212,168,90,.55),transparent)}",
    ".alq-ck.show{opacity:1;transform:none;pointer-events:auto}",
    ".alq-ck.hide{opacity:0;transform:translateY(14px) scale(.985);pointer-events:none;",
    "transition:opacity .55s ease,transform .55s ease}",
    ".alq-ck-corner{position:absolute;width:9px;height:9px;",
    "border-color:rgba(212,168,90,.45);border-style:solid;border-width:0}",
    ".alq-ck-corner.tl{left:9px;top:9px;border-left-width:1px;border-top-width:1px}",
    ".alq-ck-corner.br{right:9px;bottom:9px;border-right-width:1px;border-bottom-width:1px}",
    ".alq-ck-x{position:absolute;top:12px;right:14px;background:transparent;border:none;",
    "color:var(--ink-muted,#807c76);font-size:18px;line-height:1;cursor:pointer;padding:4px;",
    "transition:color .25s ease}",
    ".alq-ck-x:hover{color:var(--gold,#d4a85a)}",
    ".alq-ck-tag{font-family:var(--mono,'JetBrains Mono',ui-monospace,monospace);",
    "font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold,#d4a85a);",
    "opacity:.75;margin-bottom:12px}",
    ".alq-ck-title{font-size:16px;font-weight:500;line-height:1.4;margin:0 0 8px;",
    "letter-spacing:-.01em}",
    ".alq-ck-title em{font-family:var(--serif,'Cormorant Garamond',Garamond,serif);",
    "font-style:italic;font-weight:400;font-size:19px;color:var(--gold,#d4a85a)}",
    ".alq-ck-text{font-size:12.5px;line-height:1.6;color:var(--ink-soft,#a8a59c);",
    "margin:0 0 18px}",
    ".alq-ck-prefs{max-height:0;overflow:hidden;opacity:0;margin:0;",
    "transition:max-height .5s cubic-bezier(.16,1,.3,1),opacity .45s ease,margin .45s ease}",
    ".alq-ck.open .alq-ck-prefs{max-height:220px;opacity:1;margin:0 0 18px}",
    ".alq-ck-prow{display:flex;align-items:center;justify-content:space-between;gap:16px;",
    "padding:11px 0;border-top:1px solid var(--rule,rgba(232,230,224,.1))}",
    ".alq-ck-pname{font-size:12.5px;color:var(--ink,#e8e6e0)}",
    ".alq-ck-pdesc{font-family:var(--mono,'JetBrains Mono',ui-monospace,monospace);",
    "font-size:9.5px;letter-spacing:.04em;color:var(--ink-muted,#807c76);margin-top:2px}",
    ".alq-ck-sw{flex-shrink:0;width:36px;height:19px;border-radius:20px;",
    "border:1px solid var(--rule-strong,rgba(232,230,224,.22));",
    "background:rgba(232,230,224,.04);cursor:pointer;padding:0;position:relative;",
    "transition:border-color .3s ease,background .3s ease}",
    ".alq-ck-sw span{position:absolute;top:50%;left:3px;width:12px;height:12px;",
    "border-radius:50%;background:var(--ink-muted,#807c76);transform:translateY(-50%);",
    "transition:left .3s cubic-bezier(.16,1,.3,1),background .3s ease}",
    ".alq-ck-sw[aria-checked='true']{border-color:var(--gold,#d4a85a);",
    "background:rgba(212,168,90,.16)}",
    ".alq-ck-sw[aria-checked='true'] span{left:18px;background:var(--gold,#d4a85a)}",
    ".alq-ck-sw[disabled]{cursor:default;opacity:.85}",
    ".alq-ck-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}",
    ".alq-ck-btn{font-family:var(--mono,'JetBrains Mono',ui-monospace,monospace);",
    "font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;",
    "border:1px solid transparent;transition:background .28s ease,color .28s ease,",
    "border-color .28s ease,transform .28s ease}",
    ".alq-ck-btn.primary{background:var(--gold,#d4a85a);color:var(--bg,#0a0a0a);",
    "font-weight:600;padding:11px 20px;flex:1 1 auto}",
    ".alq-ck-btn.primary:hover{background:var(--ink,#e8e6e0)}",
    ".alq-ck-btn.ghost{background:transparent;color:var(--ink-soft,#a8a59c);",
    "border-color:var(--rule-strong,rgba(232,230,224,.22));padding:11px 16px}",
    ".alq-ck-btn.ghost:hover{color:var(--gold,#d4a85a);border-color:var(--gold,#d4a85a)}",
    ".alq-ck-btn.text{background:transparent;color:var(--ink-muted,#807c76);padding:11px 8px}",
    ".alq-ck-btn.text:hover{color:var(--ink,#e8e6e0)}",
    ".alq-ck-btn:focus-visible,.alq-ck-sw:focus-visible,.alq-ck-x:focus-visible{",
    "outline:1px solid var(--gold,#d4a85a);outline-offset:2px}",
    "@media(max-width:560px){.alq-ck{left:12px;right:12px;bottom:12px;width:auto;",
    "max-width:none;padding:18px 16px 16px;border-radius:14px}",
    ".alq-ck-title{font-size:15px}.alq-ck-title em{font-size:18px}",
    ".alq-ck-text{font-size:12px;margin-bottom:16px}",
    ".alq-ck-btn.primary{flex:1 1 100%;order:-1;padding:13px 20px}",
    ".alq-ck-btn.ghost{flex:1 1 auto}}",
    "@media(prefers-reduced-motion:reduce){.alq-ck,.alq-ck.hide,.alq-ck-prefs,",
    ".alq-ck-sw span{transition:none}}",
  ].join("");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ── Markup ── */
  var el = document.createElement("div");
  el.className = "alq-ck";
  el.id = "alqCk";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "Aviso de cookies");
  el.setAttribute("aria-live", "polite");
  el.innerHTML = [
    '<span class="alq-ck-corner tl" aria-hidden="true"></span>',
    '<span class="alq-ck-corner br" aria-hidden="true"></span>',
    '<button class="alq-ck-x" data-act="reject" aria-label="Rejeitar cookies não essenciais">×</button>',
    '<div class="alq-ck-tag">// laboratório · consentimento</div>',
    '<p class="alq-ck-title">Sabes o que acompanha bem café? <em>Cookies.</em></p>',
    '<p class="alq-ck-text">Usamos cookies para melhorar a experiência no laboratório.</p>',
    '<div class="alq-ck-prefs" id="alqCkPrefs" aria-hidden="true">',
    '<div class="alq-ck-prow"><div>',
    '<div class="alq-ck-pname">Essenciais</div>',
    '<div class="alq-ck-pdesc">necessários ao funcionamento</div></div>',
    '<button class="alq-ck-sw" role="switch" aria-checked="true" ',
    'aria-label="Cookies essenciais (sempre ativos)" disabled><span></span></button></div>',
    '<div class="alq-ck-prow"><div>',
    '<div class="alq-ck-pname">Análise &amp; desempenho</div>',
    '<div class="alq-ck-pdesc">ajuda-nos a afinar a fórmula</div></div>',
    '<button class="alq-ck-sw" data-sw="analytics" role="switch" aria-checked="false" ',
    'aria-label="Cookies de análise e desempenho"><span></span></button></div>',
    "</div>",
    '<div class="alq-ck-actions">',
    '<button class="alq-ck-btn primary" data-act="accept">Aceitar</button>',
    '<button class="alq-ck-btn ghost" data-act="custom" aria-expanded="false">Personalizar</button>',
    '<button class="alq-ck-btn text" data-act="reject">Rejeitar</button>',
    "</div>",
  ].join("");

  function mount() {
    document.body.appendChild(el);

    var prefs = el.querySelector("#alqCkPrefs");
    var swA = el.querySelector('[data-sw="analytics"]');

    function analyticsOn() {
      return !!swA && swA.getAttribute("aria-checked") === "true";
    }
    function persist(choice) {
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify({
            choice: choice,
            analytics: choice === "accept" ? analyticsOn() : false,
            ts: Date.now(),
          }),
        );
      } catch (e) {}
    }
    function dismiss(choice) {
      persist(choice);
      el.classList.remove("show");
      el.classList.add("hide");
      document.removeEventListener("keydown", onKey);
      var done = function () {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      };
      if (reduce) done();
      else setTimeout(done, 620);
    }
    function onKey(e) {
      if (e.key === "Escape") dismiss("reject");
    }

    el.addEventListener("click", function (e) {
      var sw = e.target.closest(".alq-ck-sw");
      if (sw && !sw.hasAttribute("disabled")) {
        var on = sw.getAttribute("aria-checked") !== "true";
        sw.setAttribute("aria-checked", on ? "true" : "false");
        return;
      }
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var a = b.getAttribute("data-act");
      if (a === "accept") {
        if (!el.classList.contains("open") && swA)
          swA.setAttribute("aria-checked", "true");
        dismiss("accept");
      } else if (a === "reject") {
        if (swA) swA.setAttribute("aria-checked", "false");
        dismiss("reject");
      } else if (a === "custom") {
        var open = !el.classList.contains("open");
        el.classList.toggle("open", open);
        b.setAttribute("aria-expanded", open ? "true" : "false");
        if (prefs)
          prefs.setAttribute("aria-hidden", open ? "false" : "true");
      }
    });

    document.addEventListener("keydown", onKey);
    setTimeout(
      function () {
        el.classList.add("show");
      },
      reduce ? 0 : 950,
    );
  }

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();

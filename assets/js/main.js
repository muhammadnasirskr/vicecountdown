/* =========================================================================
   VICE COUNTDOWN — main.js
   Vanilla JS. No libraries. No localStorage.
   ========================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
     1. COUNTDOWN
     Target: 2026-11-19T00:00:00 (midnight on release day).
     - "ET" mode  → fixed instant 2026-11-19T00:00:00-05:00 (Eastern, EST in Nov).
     - "local" mode → local midnight of Nov 19, 2026 in the viewer's own zone.
     One setInterval @ 1000ms. Only changed digits are written to the DOM.
     ----------------------------------------------------------------------- */
  var RELEASE_LABEL = "November 19, 2026";
  var targets = {
    et: new Date("2026-11-19T00:00:00-05:00").getTime(),
    local: new Date(2026, 10, 19, 0, 0, 0, 0).getTime()  // month 10 = November
  };
  var mode = "local"; // default to viewer's local time
  var lastDays = null;

  var els = {
    days:    document.getElementById("cd-days"),
    hours:   document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
    badge:   document.getElementById("tminus-val"),
    live:    document.getElementById("cd-live"),
    note:    document.getElementById("tz-note")
  };

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function setDigit(el, value) {
    if (!el) return;
    if (el.textContent !== value) {
      el.textContent = value;
      if (!reduceMotion) {
        el.classList.add("flip");
        // force reflow then release so the fade-in plays
        void el.offsetWidth;
        el.classList.remove("flip");
      }
    }
  }

  function goLive() {
    document.body.classList.add("is-live");
    setDigit(els.days, "00");
    setDigit(els.hours, "00");
    setDigit(els.minutes, "00");
    setDigit(els.seconds, "00");
    if (els.badge) els.badge.textContent = "LIVE";
    document.title = "IT'S HERE — GTA 6 Countdown | Vice Countdown";
    if (els.live) els.live.textContent = "Grand Theft Auto VI has launched.";
    clearInterval(timer);
  }

  function tick() {
    var now = Date.now();
    var diff = targets[mode] - now;

    if (diff <= 0) { goLive(); return; }

    var totalSeconds = Math.floor(diff / 1000);
    var days    = Math.floor(totalSeconds / 86400);
    var hours   = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    setDigit(els.days, pad(days));
    setDigit(els.hours, pad(hours));
    setDigit(els.minutes, pad(minutes));
    setDigit(els.seconds, pad(seconds));

    // Nav mini-badge + document title mirror the day count.
    if (days !== lastDays) {
      var dText = days + (days === 1 ? " day" : " days");
      if (els.badge) els.badge.textContent = "T-" + days + "d";
      document.title = days + " Days Until GTA 6 — Countdown to Nov 19, 2026 | Vice Countdown";
      // Announce only the days value to screen readers.
      if (els.live) els.live.textContent = dText + " until the GTA 6 release on " + RELEASE_LABEL + ".";
      lastDays = days;
    }
  }

  var timer = null;
  if (els.days) {
    tick();
    timer = setInterval(tick, 1000);
  }

  /* Timezone toggle */
  var tzButtons = document.querySelectorAll("[data-tz]");
  function updateNote() {
    if (!els.note) return;
    if (mode === "et") {
      els.note.textContent = "Showing Eastern Time (00:00 ET on release day).";
    } else {
      var zone = "your local time";
      try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || zone; } catch (e) {}
      els.note.textContent = "Showing your local time (" + zone + ").";
    }
  }
  tzButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      mode = btn.getAttribute("data-tz");
      tzButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      lastDays = null;      // force badge/title refresh
      updateNote();
      if (!document.body.classList.contains("is-live")) tick();
    });
  });
  updateNote();

  /* -----------------------------------------------------------------------
     2. STICKY NAV — frost after 80px
     ----------------------------------------------------------------------- */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > 80) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  onScrollNav();

  /* -----------------------------------------------------------------------
     3. MOBILE MENU
     ----------------------------------------------------------------------- */
  var burger = document.getElementById("burger");
  var mobileLinks = document.querySelectorAll(".mobile-menu a");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) {
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  mobileLinks.forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* -----------------------------------------------------------------------
     4. PARALLAX — grid + skyline at different rates.
        rAF-throttled transform only. Disabled for reduced motion.
     ----------------------------------------------------------------------- */
  var grid = document.querySelector(".hero__grid");
  var skyline = document.querySelector(".hero__skyline");
  var ticking = false;

  function applyParallax() {
    var y = window.scrollY;
    if (y < window.innerHeight) {           // only while hero is in view
      if (grid) grid.style.transform =
        "translateX(-50%) perspective(340px) rotateX(68deg) translateY(" + (y * 0.15) + "px)";
      if (skyline) skyline.style.transform = "translate3d(0," + (y * -0.08) + "px,0)";
    }
    ticking = false;
  }

  function onScroll() {
    onScrollNav();
    if (reduceMotion) return;
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* -----------------------------------------------------------------------
     5. REVEAL ON SCROLL
     ----------------------------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* -----------------------------------------------------------------------
     6. FAQ — single-open behaviour + JSON-LD already static in <head>
        Native <details>; here we just allow one open at a time (optional UX).
     ----------------------------------------------------------------------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* -----------------------------------------------------------------------
     7. CONTACT FORM — AJAX submit to Formspree with inline status
     ----------------------------------------------------------------------- */
  var cform = document.getElementById("contact-form");
  if (cform) {
    var statusEl = document.getElementById("form-status");
    var setStatus = function (msg, kind) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = "form-status " + (kind === "ok" ? "is-ok" : "is-err");
    };
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      // honeypot: if filled, silently drop (bot)
      var hp = cform.querySelector('[name="_gotcha"]');
      if (hp && hp.value) return;

      var action = cform.getAttribute("action") || "";
      if (action.indexOf("your-form-id") !== -1 || action === "") {
        setStatus("This form isn't connected yet — add your Formspree ID (see README), or email us directly at the address above.", "err");
        return;
      }
      var btn = cform.querySelector('button[type="submit"]');
      var oldText = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(action, {
        method: "POST",
        body: new FormData(cform),
        headers: { "Accept": "application/json" }
      }).then(function (res) {
        if (res.ok) {
          cform.reset();
          setStatus("Thanks — your message has been sent. We'll get back to you soon.", "ok");
        } else {
          setStatus("Sorry, something went wrong sending your message. Please email us directly instead.", "err");
        }
      }).catch(function () {
        setStatus("Network error — please email us directly instead.", "err");
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = oldText; }
      });
    });
  }

  /* -----------------------------------------------------------------------
     8. FOOTER YEAR (progressive)
     ----------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

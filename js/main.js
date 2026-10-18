/* The Match Report — website interactions */
(function () {
  "use strict";

  /* ------------------------------------------------------------
     STORE LINKS — edit these two lines once the listings are live.
     Every App Store / Google Play button on the site updates.
     ------------------------------------------------------------ */
  var APP_STORE_URL = "https://apps.apple.com/app/idYOUR_APP_ID"; // TODO: replace with your App Store link
  var GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.thematchreport.app";

  document.querySelectorAll('[data-store="ios"]').forEach(function (a) { a.href = APP_STORE_URL; a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll('[data-store="android"]').forEach(function (a) { a.href = GOOGLE_PLAY_URL; a.target = "_blank"; a.rel = "noopener"; });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Year */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
    });
  }

  /* Reveal-on-scroll + counters */
  function countUp(el) {
    var to = parseInt(el.getAttribute("data-to"), 10) || 0;
    if (reduceMotion) { el.textContent = to; return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var siblings = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.transitionDelay = (siblings % 4) * 90 + "ms";
        el.classList.add("in");
        el.querySelectorAll(".count").forEach(countUp);
        io.unobserve(el);
      });
    }, { threshold: 0.18 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".count").forEach(countUp);
  }

  /* ------------------------------------------------------------
     LIVE GAME DEMO
     ------------------------------------------------------------ */
  var pitch = document.getElementById("demo-pitch");
  if (!pitch) return;

  var homeEl = document.getElementById("demo-home");
  var awayEl = document.getElementById("demo-away");
  var clockEl = document.getElementById("demo-clock");
  var phaseEl = document.getElementById("demo-phase");
  var timeline = document.getElementById("demo-timeline");
  var trail = document.getElementById("pass-trail");
  var overlay = document.getElementById("goal-overlay");
  var canvas = document.getElementById("confetti");
  var players = Array.prototype.slice.call(pitch.querySelectorAll(".pp"));
  var keeper = players[0];
  var outfield = players.slice(1);

  var home = 0, away = 0, seconds = 0, running = false, timer = null;

  function minute() { return Math.floor(seconds / 60); }
  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r; }

  function startClock() {
    if (running) return;
    running = true;
    timer = setInterval(function () {
      seconds += 37; // demo time runs fast
      if (seconds >= 35 * 60 && phaseEl.textContent === "1ST HALF") {
        phaseEl.textContent = "2ND HALF";
        log("HALF-TIME. Oranges and a team talk.");
      }
      if (seconds >= 70 * 60) {
        seconds = 70 * 60;
        clearInterval(timer);
        running = false;
        phaseEl.textContent = "FULL-TIME";
        log("FULL-TIME. Report ready for WhatsApp ✔");
      }
      clockEl.textContent = fmt(seconds);
    }, 1000);
  }

  function log(text) {
    var li = document.createElement("li");
    li.innerHTML = "<b>" + minute() + "′</b> " + text;
    timeline.insertBefore(li, timeline.firstChild);
    while (timeline.children.length > 6) timeline.removeChild(timeline.lastChild);
  }

  function pick(arr, not) {
    var pool = arr.filter(function (p) { return p !== not; });
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function label(p) { return "#" + p.dataset.no + " " + p.dataset.name; }

  function flash(p) {
    p.classList.add("active");
    setTimeout(function () { p.classList.remove("active"); }, 1100);
  }

  function pos(p) {
    return { x: parseFloat(p.style.getPropertyValue("--x")), y: parseFloat(p.style.getPropertyValue("--y")) };
  }

  function drawTrail(chain, toGoal) {
    var pts = chain.map(pos);
    if (toGoal) pts.push({ x: 50, y: 2 });
    var d = pts.map(function (pt, i) { return (i ? "L" : "M") + pt.x + " " + pt.y; }).join(" ");
    trail.innerHTML = '<path d="' + d + '"/>';
    setTimeout(function () { trail.innerHTML = ""; }, 2200);
  }

  function bump(el) {
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }

  /* Confetti — echoes the app's goal celebration */
  var ctx = canvas.getContext("2d");
  var colours = ["#D6071A", "#FFDE0D", "#FAF2D1", "#0F0D0A", "#1F6B33"];
  function confetti() {
    if (reduceMotion) return;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; canvas.height = rect.height * 2;
    var cx = canvas.width / 2, cy = canvas.height * 0.32;
    var parts = [];
    for (var i = 0; i < 70; i++) {
      var a = Math.random() * Math.PI * 2, v = 6 + Math.random() * 14;
      parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 8, r: Math.random() * 6, s: (Math.random() - .5) * .4, w: 8 + Math.random() * 10, h: 5 + Math.random() * 6, c: colours[i % colours.length] });
    }
    var t = 0;
    (function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(function (p) {
        p.vy += 0.5; p.x += p.vx; p.y += p.vy; p.r += p.s;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(0, 1 - t / 90);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (++t < 90) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    })();
  }

  function celebrate() {
    overlay.classList.add("show");
    confetti();
    if (navigator.vibrate) { try { navigator.vibrate([40, 30, 80]); } catch (e) {} }
    setTimeout(function () { overlay.classList.remove("show"); }, 1700);
  }

  var actions = {
    goal: function () {
      var a = pick(outfield), s = pick(outfield, a);
      drawTrail([a, s], true); flash(s);
      setTimeout(function () {
        home++; homeEl.textContent = home; bump(homeEl);
        celebrate();
        log("⚽ GOAL! " + label(s) + ", assist " + label(a));
      }, 500);
    },
    pass: function () {
      var a = pick(outfield), b = pick(outfield, a), c = pick(outfield, b);
      drawTrail([keeper, a, b, c], false); flash(c);
      log("↗ Passing move: " + [keeper, a, b, c].map(function (p) { return p.dataset.name; }).join(" → "));
    },
    save: function () {
      flash(keeper);
      log("🧤 Shot saved! " + label(keeper) + " gets down well");
    },
    corner: function () {
      log("🚩 Corner to Riverside");
    },
    yellow: function () {
      var p = pick(outfield); flash(p);
      log("🟨 Yellow card: " + label(p));
    },
    away: function () {
      away++; awayEl.textContent = away; bump(awayEl);
      log("Goal for Hillcrest. Heads up, Riverside!");
    }
  };

  document.querySelectorAll("[data-demo]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (phaseEl.textContent === "FULL-TIME") {
        home = 0; away = 0; seconds = 0;
        homeEl.textContent = "0"; awayEl.textContent = "0"; clockEl.textContent = "00:00";
        phaseEl.textContent = "1ST HALF";
        timeline.innerHTML = "<li><b>00′</b> Kick-off. Here we go again!</li>";
      }
      startClock();
      actions[btn.getAttribute("data-demo")]();
    });
  });

  /* Tap a player on the pitch → quick event */
  players.forEach(function (p) {
    p.addEventListener("click", function () {
      startClock(); flash(p);
      log(p === keeper ? "🧤 Big save from " + label(p) : "👟 Shot from " + label(p) + "… just wide!");
    });
  });
})();

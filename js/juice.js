/* ============================================================================
 * WELD ACADEMY — JUICE
 * ----------------------------------------------------------------------------
 * The feel of the thing: spark bursts, celebration moments, counting numbers,
 * haptics on Android, and synthesised sound (no audio files — it's all
 * WebAudio, so the app stays a few hundred KB and works offline).
 *
 * Confetti here is welding sparks, not paper. On brand, and it reads as
 * designed rather than bolted on.
 * ==========================================================================*/

window.WA_JUICE = (function () {
  'use strict';

  var canvas, ctx, particles = [], raf = null, dpr = 1;
  var audio = null, soundOn = true, reduced = false;
  var queue = [], showing = false;

  /* ------------------------------------------------------------- setup */

  function init() {
    reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);

    try {
      soundOn = localStorage.getItem('weldAcademy.sound') !== 'off';
    } catch (e) { /* storage blocked, keep default */ }

    // AudioContext must be created inside a gesture on mobile.
    var unlock = function () {
      ensureAudio();
      document.removeEventListener('pointerdown', unlock);
    };
    document.addEventListener('pointerdown', unlock);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ------------------------------------------------------------ sparks */

  /* Sparks are read from the theme tokens rather than fixed, so they match
     whatever colours she picked in her profile. Re-read on demand and cached,
     because getComputedStyle in the particle loop would be wasteful. */
  var SPARK_FALLBACK = ['#ffd27a', '#ff9f1c', '#fff3d6', '#ffb54a', '#ffffff'];
  var sparkCache = null;

  function sparkColours() {
    if (sparkCache) return sparkCache;
    var cs = getComputedStyle(document.documentElement);
    var a = (cs.getPropertyValue('--accent') || '').trim();
    var b = (cs.getPropertyValue('--accent-2') || '').trim();
    sparkCache = (a && b) ? [b, a, '#ffffff', b, a] : SPARK_FALLBACK;
    return sparkCache;
  }

  /* Called when her theme changes so the next burst uses the new colours. */
  function refreshTheme() { sparkCache = null; }

  function burst(x, y, count, power) {
    if (reduced) return;
    count = count || 26;
    power = power || 1;
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = (2 + Math.random() * 7) * power;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2 * power,
        life: 1,
        decay: 0.008 + Math.random() * 0.016,
        size: 1 + Math.random() * 2.4,
        colour: sparkColours()[(Math.random() * 5) | 0],
        spin: (Math.random() - 0.5) * 0.3
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  // A wide curtain of sparks from the top — used for the big moments.
  function shower(count) {
    if (reduced) return;
    var w = window.innerWidth;
    for (var i = 0; i < (count || 70); i++) {
      particles.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2 + Math.random() * 5,
        life: 1,
        decay: 0.004 + Math.random() * 0.006,
        size: 1 + Math.random() * 2.6,
        colour: sparkColours()[(Math.random() * 5) | 0],
        spin: 0
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'lighter';

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vy += 0.16;              // gravity
      p.vx *= 0.992;             // drag
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > window.innerHeight + 40) {
        particles.splice(i, 1);
        continue;
      }

      // Sparks streak in the direction they travel, like real grinder sparks.
      var len = Math.min(14, Math.hypot(p.vx, p.vy) * 1.6);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.strokeStyle = p.colour;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx / Math.hypot(p.vx, p.vy) * len, p.y - p.vy / Math.hypot(p.vx, p.vy) * len);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    if (particles.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function burstFrom(el, count, power) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, count, power);
  }

  /* ------------------------------------------------------------- sound */

  function ensureAudio() {
    if (audio) return audio;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { audio = new AC(); } catch (e) { audio = null; }
    return audio;
  }

  function blip(freq, start, dur, type, gain) {
    var a = ensureAudio();
    if (!a || !soundOn) return;
    if (a.state === 'suspended') a.resume();
    var osc = a.createOscillator();
    var g = a.createGain();
    osc.type = type || 'triangle';
    osc.frequency.setValueAtTime(freq, a.currentTime + start);
    g.gain.setValueAtTime(0, a.currentTime + start);
    g.gain.linearRampToValueAtTime(gain == null ? 0.16 : gain, a.currentTime + start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
    osc.connect(g); g.connect(a.destination);
    osc.start(a.currentTime + start);
    osc.stop(a.currentTime + start + dur + 0.02);
  }

  var SOUNDS = {
    tap:      function () { blip(520, 0, 0.06, 'sine', 0.07); },
    correct:  function () { blip(660, 0, 0.10, 'triangle'); blip(990, 0.07, 0.16, 'triangle'); },
    wrong:    function () { blip(220, 0, 0.14, 'sawtooth', 0.09); blip(165, 0.1, 0.2, 'sawtooth', 0.07); },
    xp:       function () { blip(880, 0, 0.07, 'sine', 0.1); },
    badge:    function () { blip(587, 0, 0.10); blip(880, 0.09, 0.10); blip(1174, 0.18, 0.26); },
    level:    function () { [523, 659, 784, 1046].forEach(function (f, i) { blip(f, i * 0.085, 0.3); }); },
    complete: function () { [523, 659, 784, 1046, 1318].forEach(function (f, i) { blip(f, i * 0.09, 0.42); }); }
  };

  function sound(name) {
    var fn = SOUNDS[name];
    if (fn) try { fn(); } catch (e) { /* audio can fail silently */ }
  }

  function setSound(on) {
    soundOn = !!on;
    try { localStorage.setItem('weldAcademy.sound', on ? 'on' : 'off'); } catch (e) { /* ignore */ }
  }

  function soundEnabled() { return soundOn; }

  /* ----------------------------------------------------------- haptics */

  var HAPTICS = {
    tap: 8,
    correct: [0, 18],
    wrong: [0, 40, 60, 40],
    badge: [0, 22, 70, 22, 70, 45],
    level: [0, 30, 60, 30, 60, 70]
  };

  function haptic(name) {
    if (!navigator.vibrate) return;
    var p = HAPTICS[name];
    if (p) try { navigator.vibrate(p); } catch (e) { /* not permitted */ }
  }

  /* ---------------------------------------------------------- count up */

  function countUp(el, from, to, dur) {
    if (!el) return;
    if (reduced || from === to) { el.textContent = to; return; }
    dur = dur || 700;
    var start = performance.now();
    function step(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = to;
    }
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------ celebrations */

  /* celebrate({ kind, icon, title, subtitle, note }) — queued so several
     unlocks at once play one after another instead of on top of each other. */
  function celebrate(opts) {
    queue.push(opts);
    if (!showing) next();
  }

  function next() {
    if (!queue.length) { showing = false; return; }
    showing = true;
    var o = queue.shift();

    var wrap = document.createElement('div');
    wrap.className = 'celebrate celebrate--' + (o.kind || 'badge');
    wrap.innerHTML =
      '<div class="celebrate-card">' +
        '<div class="celebrate-glow"></div>' +
        '<div class="celebrate-icon">' + (o.icon || '🏅') + '</div>' +
        '<div class="celebrate-kicker">' + (o.kicker || '') + '</div>' +
        '<div class="celebrate-title">' + (o.title || '') + '</div>' +
        (o.subtitle ? '<div class="celebrate-sub">' + o.subtitle + '</div>' : '') +
        (o.note ? '<div class="celebrate-note">' + o.note + '</div>' : '') +
        '<button class="btn btn--primary celebrate-btn">' + (o.button || 'Nice') + '</button>' +
      '</div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('is-in'); });

    var r = { x: window.innerWidth / 2, y: window.innerHeight / 2 - 40 };
    if (o.kind === 'level' || o.kind === 'complete') {
      shower(90);
      burst(r.x, r.y, 46, 1.5);
    } else {
      burst(r.x, r.y, 30, 1.1);
    }
    sound(o.kind === 'level' ? 'level' : o.kind === 'complete' ? 'complete' : 'badge');
    haptic(o.kind === 'level' ? 'level' : 'badge');

    function close() {
      wrap.classList.remove('is-in');
      setTimeout(function () {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        next();
      }, 280);
    }
    wrap.querySelector('.celebrate-btn').addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
  }

  return {
    init: init,
    burst: burst,
    burstFrom: burstFrom,
    shower: shower,
    sound: sound,
    setSound: setSound,
    soundEnabled: soundEnabled,
    haptic: haptic,
    countUp: countUp,
    celebrate: celebrate,
    refreshTheme: refreshTheme,
    reducedMotion: function () { return reduced; }
  };
})();

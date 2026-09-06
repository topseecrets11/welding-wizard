/* ============================================================================
 * WELD ACADEMY — APP
 * ----------------------------------------------------------------------------
 * Hash-routed single page app. No build step, no framework, no server.
 *
 *   #/home                     map, daily challenge, badges
 *   #/course                   all modules
 *   #/module/:id               lessons + drills in a module
 *   #/lesson/:mod/:id          a lesson, in whichever of the five modes she likes
 *   #/quiz/:mod                the module checkpoint
 *   #/doctor                   Weld Doctor (symptoms, and the camera if set up)
 *   #/kit/:tab                 checklist | sheets | log
 *   #/settings                 sound, AI weld scan, install, reset
 * ==========================================================================*/

(function () {
  'use strict';

  var C = window.WA_CONTENT;
  var R = window.WA_REFERENCE;
  var P = window.WA_PROGRESS;
  var J = window.WA_JUICE;
  var DG = window.WA_DIAGRAMS;
  var PR = window.WA_PRACTICE;
  var V = window.WA_VISION;
  var N = window.WA_NARRATOR;
  var MK = window.WA_MARKET;
  var PF = window.WA_PROFILE;
  var DR = window.WA_DRIVE;
  var TL = window.WA_TALLY;
  var TD = window.WA_TEARDOWN;
  var DL = window.WA_DOLLS;
  var PERSONAL = window.WA_PERSONAL;
  var SY = window.WA_SYNC;

  var view, header, tabbar, toastHost;
  var autoReadTimer = null;        // pending auto-start of the reader
  var shownXp = 0;                 // what the header is currently displaying
  var installPrompt = null;        // Android "add to home screen" event

  /* ============================ helpers ================================= */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function fmt(text) {
    return esc(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function moduleById(id) {
    return C.modules.filter(function (m) { return m.id === id; })[0];
  }

  function lessonById(mod, id) {
    return mod ? mod.lessons.filter(function (l) { return l.id === id; })[0] : null;
  }

  function go(hash) { location.hash = hash; }
  function scrollTop() { window.scrollTo(0, 0); }
  function $(sel) { return document.querySelector(sel); }

  function tap() { J.sound('tap'); J.haptic('tap'); }

  /* Already running as an installed app (Android's real check, iOS's own
     flag) — if so, she is already where we want her and no banner is owed. */
  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;
  }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent || '') && !window.MSStream;
  }

  /* One obvious button on the very first screen, not a menu item she would
     have to go looking for. iOS gives no programmatic install hook at all,
     so it gets plain words instead of a button; Android/Chrome/Brave gets
     the real one-tap install, shown the moment the browser says it is
     allowed (see the beforeinstallprompt listener in boot()) — hidden until
     then rather than absent, so it can appear without a full re-render. */
  function installBanner() {
    if (isIOS()) {
      return '<div class="install-banner">' +
        '<p><b>📲 On iPhone:</b> tap <b>Share</b> below, then <b>Add to Home Screen</b> — ' +
        'then always open it from there. No browser bar, full screen, just the app.</p>' +
      '</div>';
    }
    return '<div class="install-banner"' + (installPrompt ? '' : ' hidden') + ' id="wInstallBanner">' +
      '<button class="btn btn--primary btn--big" id="wInstallBtn">📲 Put this on the home screen</button>' +
      '<p class="welcome-fine">One tap now, and it opens full screen from here on — no browser, no address bar, just the app.</p>' +
    '</div>';
  }

  /* ========================= tiles and sheets ===========================
   * Long pages lose her. Everything that used to be a wall of stacked cards
   * is now a grid of tiles, and the detail lives in a sheet that slides up
   * over the top — so no page is longer than a couple of thumb-flicks and she
   * always knows how to get back (tap outside, swipe down, or the ✕).
   * ====================================================================== */

  var sheetEl = null;

  /* tiles([{ icon, title, sub, key }]) — the grid. Handling of taps is left to
     the caller, which reads data-tile off the clicked element. */
  function tiles(items) {
    return '<div class="tiles">' +
      items.map(function (t) {
        return '<button class="tile-btn" data-tile="' + esc(t.key) + '">' +
          '<span class="tile-ico">' + (t.icon || '•') + '</span>' +
          '<span class="tile-t">' + esc(t.title) + '</span>' +
          (t.sub ? '<span class="tile-s">' + esc(t.sub) + '</span>' : '') +
        '</button>';
      }).join('') +
    '</div>';
  }

  function closeSheet() {
    if (!sheetEl) return;
    var el = sheetEl;
    sheetEl = null;
    el.classList.remove('is-open');
    if (N.supported()) N.stop();
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 220);
  }

  /* openSheet(title, bodyHtml) — one bottom sheet, reused everywhere. */
  function openSheet(title, bodyHtml) {
    closeSheet();
    var el = document.createElement('div');
    el.className = 'sheet';
    el.innerHTML =
      '<div class="sheet-back"></div>' +
      '<div class="sheet-panel" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">' +
        '<div class="sheet-grab"></div>' +
        '<div class="sheet-head">' +
          '<h2>' + esc(title) + '</h2>' +
          '<button class="sheet-x" aria-label="Close">✕</button>' +
        '</div>' +
        '<div class="sheet-body">' + bodyHtml + '</div>' +
      '</div>';
    document.body.appendChild(el);
    sheetEl = el;
    // Next frame, so the slide-up transition actually runs.
    requestAnimationFrame(function () { el.classList.add('is-open'); });

    el.querySelector('.sheet-back').addEventListener('click', closeSheet);
    el.querySelector('.sheet-x').addEventListener('click', function () { tap(); closeSheet(); });

    // Swipe down to dismiss, the way every other sheet on the phone works.
    var panel = el.querySelector('.sheet-panel');
    var startY = null;
    panel.addEventListener('touchstart', function (e) {
      startY = panel.scrollTop <= 0 ? e.touches[0].clientY : null;
    }, { passive: true });
    panel.addEventListener('touchmove', function (e) {
      if (startY == null) return;
      var dy = e.touches[0].clientY - startY;
      if (dy > 0) panel.style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    panel.addEventListener('touchend', function (e) {
      if (startY == null) return;
      var dy = (e.changedTouches[0].clientY - startY);
      panel.style.transform = '';
      startY = null;
      if (dy > 90) closeSheet();
    });

    tap();
    return el;
  }

  // Escape closes it, same as the ✕.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheetEl) closeSheet();
  });

  /* ============================ toasts ================================== */

  function toast(msg, kind) {
    var el = document.createElement('div');
    el.className = 'toast' + (kind ? ' toast--' + kind : '');
    el.innerHTML = msg;
    toastHost.appendChild(el);
    setTimeout(function () { el.classList.add('toast--out'); }, 2400);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3000);
  }

  /* Small wins toast; big wins get the full celebration overlay. */
  function announce(result, opts) {
    opts = opts || {};
    if (result.xp) {
      toast('<span class="toast-xp">+' + result.xp + ' XP</span>' +
            (opts.xpNote ? '<span class="toast-note">' + esc(opts.xpNote) + '</span>' : ''), 'xp');
      J.sound('xp');
      if (opts.from) J.burstFrom(opts.from, 18, 0.9);
    }

    if (result.levelUp) {
      J.celebrate({
        kind: 'level',
        icon: '⚡',
        kicker: 'Level ' + P.level(),
        title: P.levelTitle(),
        subtitle: 'You just moved up a rung.',
        note: nextLevelNote(),
        button: 'Back to it'
      });
    }

    (result.newBadges || []).forEach(function (b) {
      J.celebrate({
        kind: b.id === 'ticket-ready' ? 'complete' : 'badge',
        icon: b.icon,
        kicker: 'Badge earned',
        title: b.name,
        subtitle: b.desc,
        button: 'Got it'
      });
    });

    /* Finishing a whole unit is a bigger moment than finishing a lesson, so it
       gets the Mick celebration rather than another badge card. */
    if (result.moduleComplete) {
      var mod = moduleById(result.moduleComplete);
      J.celebrate({
        kind: 'complete',
        character: 'mick',
        icon: '💰',
        kicker: 'Unit complete',
        title: mod ? mod.title : 'Unit done',
        subtitle: PF.line('unit'),
        note: PERSONAL.unitNote(result.moduleComplete),
        button: 'Cheers'
      });
    }

    /* Anything above may have completed a doll's condition. */
    DL.check().forEach(function (d) {
      J.celebrate({
        kind: 'badge',
        art: DL.svg(d, { width: 96, suffix: 'cel' }),
        kicker: 'Collection',
        title: d.name,
        subtitle: 'One more for the set. ' + DL.progress().have + ' of ' + DL.progress().total + '.',
        note: (function () {
          var n = DL.nextUp();
          return n ? 'Next one: ' + n.hint + '.' : 'That is the whole set.';
        })(),
        button: 'Have a look'
      });
    });

    renderHeader();
  }

  function nextLevelNote() {
    var lvl = P.level();
    var titles = R.levelTitles;
    if (lvl >= titles.length) return 'Top of the tree. Now go and earn it on steel.';
    return 'Next up: ' + titles[lvl] + ' at ' + (lvl * 100) + ' XP.';
  }

  /* ============================ chrome ================================== */

  function ring(pct, colour, size, stroke) {
    size = size || 48; stroke = stroke || 4;
    var r = (size - stroke) / 2 - 1;
    var circ = 2 * Math.PI * r;
    var off = circ * (1 - Math.max(0, Math.min(100, pct)) / 100);
    var c = size / 2;
    return '<svg class="ring" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" class="ring-bg" stroke-width="' + stroke + '"></circle>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" class="ring-fg" stroke="' + colour + '" stroke-width="' + stroke + '" ' +
        'stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"></circle>' +
      '</svg>';
  }

  function renderHeader() {
    var lvl = P.level();
    var pct = Math.round((P.xpIntoLevel() / P.xpForNextLevel()) * 100);
    var s = P.state;

    header.innerHTML =
      '<button class="hdr-menu" id="menuBtn" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '<a class="hdr-left" href="#/home">' +
        '<div class="hdr-ring">' + ring(pct, 'var(--accent)', 40, 3) +
          '<span class="hdr-lvl">' + lvl + '</span>' +
        '</div>' +
        '<div class="hdr-meta">' +
          '<div class="hdr-title">' + esc(P.levelTitle(lvl)) + '</div>' +
          '<div class="hdr-xp"><b id="hdrXp">' + shownXp + '</b> / ' + (lvl * 100) + ' XP</div>' +
        '</div>' +
      '</a>' +
      '<div class="hdr-right">' +
        '<div class="hdr-streak' + (s.streak.count > 1 ? ' is-live' : '') + '">' +
          '<span class="flame">🔥</span><b>' + s.streak.count + '</b>' +
        '</div>' +
        '<a class="hdr-cog" href="#/settings" aria-label="Settings">⚙</a>' +
      '</div>';

    if (s.xp !== shownXp) {
      J.countUp($('#hdrXp'), shownXp, s.xp, 650);
      shownXp = s.xp;
    }

    $('#menuBtn').addEventListener('click', openMenu);
  }

  /* ============================ the menu ================================ */

  /* A proper contents page. The bottom tabs are for the four places she goes
     constantly; this is everything, in one list, always one tap away. */
  function openMenu() {
    tap();
    var wrap = document.createElement('div');
    wrap.className = 'drawer';
    wrap.innerHTML =
      '<div class="drawer-panel">' +
        '<div class="drawer-head">' +
          '<div>' +
            '<div class="drawer-name">' + esc(P.state.name || 'Welder') + '</div>' +
            '<div class="drawer-sub">' + esc(P.levelTitle()) + ' · Level ' + P.level() + ' · ' + P.state.xp + ' XP</div>' +
          '</div>' +
          '<button class="drawer-x" aria-label="Close">✕</button>' +
        '</div>' +

        '<div class="drawer-scroll">' +
          '<div class="drawer-sec">The course</div>' +
          C.modules.map(function (m, i) {
            var pct = P.modulePercent(m.id);
            var locked = !P.moduleUnlocked(m.id);
            return '<a class="drawer-item' + (locked ? ' is-locked' : '') + '" href="#/module/' + m.id + '">' +
              '<span class="drawer-ico">' + m.icon + '</span>' +
              '<span class="drawer-txt"><b>' + (i + 1) + '. ' + esc(m.title) + '</b>' +
                '<i>' + esc(m.subtitle) + (m.tier === 'mastery' ? ' · mastery' : '') + '</i></span>' +
              '<span class="drawer-pct">' + pct + '%</span>' +
            '</a>';
          }).join('') +

          '<div class="drawer-sec">In the shed</div>' +
          [['#/doctor', '👷', 'Ask Old Mate', 'Something wrong with a weld'],
           ['#/kit/checklist', '✅', 'Pre-flight checklist', 'Before the helmet goes down'],
           ['#/kit/sheets', '📋', 'Cheat sheets', 'Amps, volts, gas, sizes'],
           ['#/kit/log', '📓', 'Weld log', 'Your own record'],
           ['#/kit/scrap', '💰', 'Prices', 'What metal is worth today'],
           ['#/kit/tally', '⚖️', 'My pile', 'What is on your scales, and what it is worth'],
           ['#/kit/teardown', '🔩', 'Worth stripping?', 'What is inside it, and is it worth the hour'],
           ['#/drive', '🚗', 'Drive Mode', 'A whole unit read out loud']
          ].map(function (r) {
            return '<a class="drawer-item" href="' + r[0] + '">' +
              '<span class="drawer-ico">' + r[1] + '</span>' +
              '<span class="drawer-txt"><b>' + r[2] + '</b><i>' + r[3] + '</i></span></a>';
          }).join('') +

          '<div class="drawer-sec">Yours</div>' +
          '<a class="drawer-item" href="#/home"><span class="drawer-ico">🗺️</span>' +
            '<span class="drawer-txt"><b>The map</b><i>Progress, badges, daily challenge</i></span></a>' +
          '<a class="drawer-item" href="#/ticket"><span class="drawer-ico">🎓</span>' +
            '<span class="drawer-txt"><b>Getting the ticket</b><i>What counts, and how RPL works</i></span></a>' +
          '<a class="drawer-item" href="#/sources"><span class="drawer-ico">📚</span>' +
            '<span class="drawer-txt"><b>Where this comes from</b><i>Every source, linked — check it yourself</i></span></a>' +
          '<a class="drawer-item" href="#/settings"><span class="drawer-ico">⚙️</span>' +
            '<span class="drawer-txt"><b>Settings</b><i>Voice, sound, AI scan, reset</i></span></a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('is-in'); });

    function close() {
      wrap.classList.remove('is-in');
      setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 260);
    }
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap || e.target.closest('.drawer-x') || e.target.closest('.drawer-item')) close();
    });
  }

  function renderTabs(active) {
    var tabs = [
      { id: 'home', href: '#/home', icon: '🗺️', label: 'Map' },
      { id: 'course', href: '#/course', icon: '📚', label: 'Course' },
      { id: 'doctor', href: '#/doctor', icon: '👷', label: 'Old Mate' },
      { id: 'kit', href: '#/kit/checklist', icon: '🧰', label: 'Kit' }
    ];
    tabbar.innerHTML = tabs.map(function (t) {
      return '<a class="tab' + (t.id === active ? ' is-active' : '') + '" href="' + t.href + '">' +
        '<span class="tab-i">' + t.icon + '</span><span class="tab-l">' + t.label + '</span></a>';
    }).join('');
  }

  /* ============================ onboarding ============================== */

  /* Onboarding is one screen at a time: the pitch and her name, then the eight
     questions as one-tap cards. Answering advances automatically — nothing to
     scroll, nothing to submit, no way to be halfway through a form. */
  function renderWelcome() {
    tabbar.classList.add('hidden');
    header.classList.add('hidden');
    var answers = {};
    var QS = PF.QUESTIONS;
    // A retake keeps her name and goes straight to the questions.
    var retake = !!P.state.name;
    var step = retake ? 1 : 0;          // 0 = the pitch, 1..8 = the questions
    var pending = P.state.name || '';
    var showInstall = !isStandalone() && !retake;   // only the first time, never once it's an app

    function paintIntro() {
      view.innerHTML =
        '<div class="welcome">' +
          '<div class="welcome-arc">⚡</div>' +
          '<h1>Weld Academy</h1>' +
          '<p class="welcome-sub">Stick, MIG and TIG — taught properly, drilled at the bench, and a shed companion for when it goes wrong.</p>' +
          (showInstall ? installBanner() : '') +
          '<div class="welcome-points">' +
            '<div><span>📚</span><b>Nine modules, 39 lessons.</b> The same knowledge a trade course teaches. Metric, Australian standards.</div>' +
            '<div><span>🔧</span><b>Bench drills.</b> Every lesson has a job to go and do, with pass marks you can judge yourself against.</div>' +
            '<div><span>👷</span><b>Old Mate.</b> Something wrong? Tick what you see — he names it, and tells you how to fix it. Works with no signal.</div>' +
            '<div><span>🎧</span><b>Listen in the ute.</b> Whole units read out loud, podcast style, so the driving counts as study.</div>' +
          '</div>' +
          '<label class="welcome-label" for="wname">What should I call you?</label>' +
          '<input id="wname" class="input" type="text" placeholder="Your name" maxlength="24" autocomplete="off">' +
          '<button class="btn btn--primary btn--big" id="wstart">Start →</button>' +
          '<p class="welcome-fine">Eight quick questions next, so this teaches you the way you actually learn. Two minutes, then you are in.</p>' +
          '<p class="welcome-fine">Everything stays on this device. No account, no internet needed.</p>' +
        '</div>';

      var input = $('#wname');
      function next() {
        pending = (input.value || '').trim() || 'Welder';
        step = 1;
        J.sound('tap');
        paintQuestion();
      }
      $('#wstart').addEventListener('click', next);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') next(); });
      input.focus();

      var wInstallBtn = $('#wInstallBtn');
      if (wInstallBtn) {
        wInstallBtn.addEventListener('click', function () {
          if (!installPrompt) return;
          var p = installPrompt;
          installPrompt = null;
          p.prompt();
          p.userChoice.then(function () {
            var banner = $('#wInstallBanner');
            if (banner) banner.hidden = true;
          });
        });
      }
    }

    function paintQuestion() {
      var q = QS[step - 1];
      view.innerHTML =
        '<div class="welcome welcome--q">' +
          '<div class="q-progress"><i style="width:' + Math.round((step / QS.length) * 100) + '%"></i></div>' +
          '<p class="q-count">Question ' + step + ' of ' + QS.length + '</p>' +
          '<h2 class="q-ask">' + esc(q.q) + '</h2>' +
          '<div class="q-opts" id="qOpts">' +
            q.opts.map(function (o) {
              return '<button class="q-opt" data-v="' + esc(o.v) + '">' +
                  '<b>' + esc(o.label) + '</b><i>' + esc(o.sub) + '</i>' +
                '</button>';
            }).join('') +
          '</div>' +
          (step > 1 ? '<button class="btn btn--ghost btn--sm" id="qBack">← Back</button>' : '') +
        '</div>';

      $('#qOpts').addEventListener('click', function (e) {
        var btn = e.target.closest('[data-v]');
        if (!btn) return;
        answers[q.id] = btn.getAttribute('data-v');
        btn.classList.add('is-on');
        J.sound('tap');
        J.haptic('tap');
        // Let the press register visually before the screen changes.
        setTimeout(function () {
          if (step < QS.length) { step++; paintQuestion(); }
          else finish(btn);
        }, 160);
      });

      var back = $('#qBack');
      if (back) back.addEventListener('click', function () { step--; paintQuestion(); });
    }

    function finish(fromEl) {
      P.setName(pending);
      var d = PF.save(answers);          // stores answers, repaints the theme
      P.setPrefMode(d.defaultMode);      // her answers pick the opening mode
      header.classList.remove('hidden');
      tabbar.classList.remove('hidden');
      J.sound('level');
      if (fromEl) J.burstFrom(fromEl, 40, 1.3);
      go('#/home');
      render();
    }

    if (retake) paintQuestion(); else paintIntro();
  }

  /* ============================ home / map ============================== */

  /* Plain and time-aware, using her name — not a slogan. */
  function greeting() {
    var h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    if (h < 21) return 'Evening';
    return 'Late one';
  }

  function renderHome() {
    renderTabs('home');
    var s = P.state;
    var next = P.nextUp();
    var overall = P.overallPercent();

    var continueCard;
    if (next) {
      var label = next.type === 'lesson' ? next.lesson.title : next.module.title + ' — checkpoint';
      var href = next.type === 'lesson'
        ? '#/lesson/' + next.moduleId + '/' + next.lessonId
        : '#/quiz/' + next.moduleId;
      continueCard =
        '<a class="continue" href="' + href + '">' +
          '<div class="continue-shine"></div>' +
          '<div class="continue-kicker">' + (next.type === 'lesson' ? 'Pick up where you left off' : 'Ready for the checkpoint') + '</div>' +
          '<div class="continue-title">' + esc(label) + '</div>' +
          '<div class="continue-foot"><span>' + next.module.icon + ' ' + esc(next.module.title) + '</span><span class="continue-go">Continue →</span></div>' +
        '</a>';
    } else {
      continueCard =
        '<div class="continue continue--done">' +
          '<div class="continue-kicker">Course complete</div>' +
          '<div class="continue-title">You have done the lot. 🎓</div>' +
          '<div class="continue-foot"><span>Every module is open for practice — retakes are free.</span></div>' +
        '</div>';
    }

    /* She told us what keeps her coming back, so that is what sits highest on
       the screen. Everything is still here — only the order changes. */
    var lead = PF.derive().leadWith;
    var tickerHtml =
      '<a class="ticker" href="#/kit/scrap" id="ticker">' +
        '<span class="ticker-tag">💰 Metal</span>' +
        '<span class="ticker-rail" id="tickerRail"><span class="ticker-load">checking prices…</span></span>' +
      '</a>';
    var badgesHtmlBlock = '<h2 class="section-h">Badges</h2><div class="badges">' + badgesHtml() + '</div>';

    // Chips lead with whatever she said matters, so the first glance answers it.
    var chips = [
      { k: 'streak', html: '<span class="chip">🔥 ' + s.streak.count + ' day' + (s.streak.count === 1 ? '' : 's') + '</span>' },
      { k: 'badges', html: '<span class="chip">🏅 ' + s.badges.length + '/' + R.badges.length + '</span>' },
      { k: 'progress', html: '<span class="chip">🔧 ' + P.drillCount() + ' drills</span>' }
    ].sort(function (a, b) { return (b.k === lead) - (a.k === lead); })
     .map(function (c) { return c.html; }).join('');

    view.innerHTML =
      '<div class="hero">' +
        '<div class="hero-bg"></div>' +
        '<div class="hero-row">' +
          '<div class="hero-ring">' + ring(overall, 'var(--accent)', 76, 6) +
            '<span class="hero-pct">' + overall + '<i>%</i></span></div>' +
          '<div>' +
            '<div class="hero-hi" id="heroHi">' + esc(greeting()) + (s.name ? ', ' + esc(s.name) : '') + '</div>' +
            '<div class="hero-lvl">' + esc(P.levelTitle()) + ' · Level ' + P.level() + '</div>' +
            '<div class="hero-chips">' + chips + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      // Money first if that is her reason for opening it at all.
      (lead === 'money' ? tickerHtml + continueCard : continueCard + tickerHtml) +
      (DR.supported() ? '<a class="drive-cta" href="#/drive">' +
          '<span class="drive-cta-i">🚗</span>' +
          '<span class="drive-cta-t"><b>Drive Mode</b>' +
            '<i>A whole unit read out loud. Turn the drive into study.</i></span>' +
          '<span class="drive-cta-go">→</span>' +
        '</a>' : '') +
      dailyCardHtml() +
      (lead === 'badges' ? badgesHtmlBlock : '') +
      '<h2 class="section-h">The road to a ticket</h2>' +
      '<div class="map">' + mapHtml() + '</div>' +
      optionalHtml() +
      collectionHtml() +
      (lead === 'badges' ? '' : badgesHtmlBlock) +
      '<div class="footer-note">' +
        '<p>Weld Academy teaches the knowledge, not the ticket. When you want the paper, that is an RTO and a coded test on a real coupon — and you will walk in already knowing the job.</p>' +
        '<p>Written by an AI, built on published standards, and <a href="#/sources">every source is linked</a> so you can check any of it yourself.</p>' +
        '<a class="btn btn--ghost btn--sm" href="#/ticket">Getting the ticket</a> ' +
        '<a class="btn btn--ghost btn--sm" href="#/sources">Sources</a> ' +
        '<a class="btn btn--ghost btn--sm" href="#/settings">Settings</a>' +
      '</div>';

    wireDaily();
    view.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-tile^="opt:"]');
      if (btn) go('#/module/' + btn.getAttribute('data-tile').split(':')[1]);
    });

    /* Nothing on screen points at this. Press and hold her name, three times.
       Not spoken, not logged, not written down anywhere. */
    PERSONAL.attachHiddenNote($('#heroHi'), openHiddenNote);
    paintTicker();
    afterPaint(function () { MK.refresh().then(paintTicker); });
  }

  /* Prices are the least important thing on any screen — never let fetching
     them hold up the load event or first paint on a bad connection. */
  function afterPaint(fn) {
    if (document.readyState === 'complete') setTimeout(fn, 60);
    else window.addEventListener('load', function () { setTimeout(fn, 60); }, { once: true });
  }

  function paintTicker() {
    var rail = $('#tickerRail');
    if (!rail) return;
    var rows = MK.rows().filter(function (r) { return r.have; });
    if (!rows.length) {
      rail.innerHTML = '<span class="ticker-load">' +
        (navigator.onLine ? 'checking prices…' : 'no signal — tap for the scrap guide') + '</span>';
      return;
    }
    rail.innerHTML = rows.map(function (r) {
      var chg = r.change == null ? '' :
        '<i class="' + (r.change >= 0 ? 'up' : 'down') + '">' +
          (r.change >= 0 ? '▲' : '▼') + Math.abs(r.change).toFixed(1) + '%</i>';
      return '<span class="tick"><b>' + r.icon + ' ' + esc(r.name) + '</b> ' + r.primary + chg + '</span>';
    }).join('');
  }

  /* ============================ scrap & prices ========================== */

  function kitScrap() {
    var rows = MK.rows();
    var ago = MK.fetchedAgo();

    return '<p class="page-sub">Spot prices in Australian dollars, in the units a yard weighs in. ' +
        'Metal is the trade around your trade — and knowing what it is worth is the same skill as knowing what it is.</p>' +

      '<div class="prices" id="prices">' +
        rows.map(function (r) {
          var chg = r.change == null ? '' :
            '<span class="price-chg ' + (r.change >= 0 ? 'up' : 'down') + '">' +
              (r.change >= 0 ? '▲ ' : '▼ ') + Math.abs(r.change).toFixed(1) + '% today</span>';
          return '<div class="price' + (r.scrap ? ' is-star' : '') + '">' +
            '<div class="price-top"><span class="price-ico">' + r.icon + '</span>' +
              '<span class="price-name">' + esc(r.name) + '</span>' + chg + '</div>' +
            '<div class="price-val">' + r.primary + '</div>' +
            '<div class="price-unit">' + esc(r.secondary) + '</div>' +
            '<div class="price-note">' + esc(r.note) + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +

      '<div class="price-foot" id="priceFoot">' +
        '<span>' + (ago ? 'Updated ' + ago : 'Not fetched yet') + '</span>' +
        '<button class="btn btn--ghost btn--sm" id="priceRefresh">Refresh</button>' +
      '</div>' +
      (MK.state.error ? '<p class="muted small">' + esc(MK.state.error) + '</p>' : '') +

      '<div class="card card--warn">' +
        '<b>Read this before you load the trailer</b>' +
        '<p>Those are world spot prices — the ceiling, not the offer. A yard buys at a discount because they sort, cart and on-sell it. ' +
        'And no oil price up there: there is no free source a phone can call directly, so rather than fake it, it is left out.</p>' +
      '</div>' +

      '<h2 class="section-h">The metal trade</h2>' +
      tiles(R.scrapGuide.map(function (sec, i) {
        return { key: 'scrap:' + i, icon: sec.icon, title: sec.title,
                 sub: sec.points.length + ' things worth knowing' };
      }));
  }

  /* One scrap-guide section, opened from its tile. */
  function openScrapSheet(i) {
    var sec = R.scrapGuide[i];
    if (!sec) return;
    openSheet(sec.icon + ' ' + sec.title,
      sec.body.map(function (b) { return '<p>' + fmt(b) + '</p>'; }).join('') +
      '<ul>' + sec.points.map(function (pt) { return '<li>' + fmt(pt) + '</li>'; }).join('') + '</ul>');
  }

  /* Prices can take seconds to land on a bad connection, and by then she may
     have moved on to another tab. Re-rendering blind would wipe the screen she
     is actually using — including anything she had typed into the weld log. */
  function stillOnScrap() {
    return location.hash.replace(/^#\/?/, '') === 'kit/scrap';
  }

  function wireScrap() {
    afterPaint(function () {
      MK.refresh().then(function () { if (stillOnScrap()) renderKit('scrap'); });
    });
    var btn = $('#priceRefresh');
    if (btn) {
      btn.addEventListener('click', function () {
        tap();
        btn.textContent = 'Checking…';
        MK.refresh({ force: true }).then(function () {
          if (stillOnScrap()) renderKit('scrap');
        });
      });
    }
  }

  /* The dolls she has, nested the way the real things sit — biggest outside,
     smallest hidden inside. Unearned ones show as silhouettes so there is
     always a visible next one. */
  function collectionHtml() {
    var p = DL.progress();
    var next = DL.nextUp();
    return '<a class="collection" href="#/dolls">' +
      '<div class="collection-row">' +
        DL.dolls.map(function (d) {
          return DL.svg(d, { width: 42, locked: !DL.has(d.id), suffix: 'home' });
        }).join('') +
      '</div>' +
      '<div class="collection-meta">' +
        '<b>🪆 The collection · ' + p.have + ' of ' + p.total + '</b>' +
        '<i>' + (next ? esc(next.hint) + ' for the next one' : 'Complete set') + '</i>' +
      '</div>' +
    '</a>';
  }

  /* The optional units, offered rather than pushed. Anything in here is real
     and useful, but leading with it at someone who has not asked reads as a
     lecture — so it sits under the map, clearly marked, and stays shut until
     she goes looking. */
  function optionalHtml() {
    var opt = C.modules.filter(function (m) { return m.tier === 'advanced'; });
    if (!opt.length) return '';
    return '<h2 class="section-h">If you want it</h2>' +
      tiles(opt.map(function (m) {
        var pct = P.modulePercent(m.id);
        return { key: 'opt:' + m.id, icon: m.icon, title: m.title,
                 sub: pct ? pct + '% done · optional' : m.lessons.length + ' lessons · optional' };
      }));
  }

  /* The road to a ticket. Optional units are deliberately not on it — they get
     their own tile underneath, so the main path stays the main path. */
  function mapHtml() {
    return C.modules.filter(function (m) { return m.tier !== 'advanced'; }).map(function (m, i) {
      var pct = P.modulePercent(m.id);
      var prof = P.proficiency(m.id);
      var unlocked = P.moduleUnlocked(m.id);
      var complete = P.moduleComplete(m.id);
      var current = !complete && unlocked;

      return '<a class="node' +
          (unlocked ? '' : ' is-locked') + (complete ? ' is-complete' : '') + (current ? ' is-current' : '') +
          '" href="#/module/' + m.id + '" style="--mc:' + m.colour + '">' +
        (i > 0 ? '<div class="node-track"></div>' : '') +
        '<div class="node-dot">' +
          ring(pct, complete ? 'var(--ok)' : 'var(--mc)', 62, 5) +
          '<span class="node-icon">' + m.icon + '</span>' +
          (complete ? '<span class="node-tick">✓</span>' : '') +
          (unlocked ? '' : '<span class="node-lock">' + lockSvg() + '</span>') +
        '</div>' +
        '<div class="node-card">' +
          '<div class="node-num">Unit ' + (i + 1) + (m.tier === 'mastery' ? ' · mastery' : '') + '</div>' +
          '<div class="node-title">' + esc(m.title) + '</div>' +
          '<div class="node-sub">' + esc(m.subtitle) + '</div>' +
          '<div class="node-bars">' +
            '<span class="mini"><i style="width:' + pct + '%"></i></span>' +
            '<span class="node-prof">' + prof + '% proficient</span>' +
          '</div>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  // Drawn rather than an emoji: 🔒 has no glyph in some rendering stacks.
  function lockSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
      '<rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor"/>' +
      '</svg>';
  }

  function badgesHtml() {
    return R.badges.map(function (b) {
      var got = P.hasBadge(b.id);
      return '<div class="badge' + (got ? ' is-earned' : '') + '" title="' + esc(b.desc) + '">' +
        '<span class="badge-i">' + b.icon + '</span>' +
        '<span class="badge-n">' + esc(b.name) + '</span>' +
      '</div>';
    }).join('');
  }

  function dailyCardHtml() {
    var daily = P.dailyChallenge();
    if (daily.answered) {
      return '<div class="card card--daily is-done">' +
        '<div class="card-head"><h2>Daily challenge</h2><span class="pill pill--ok">Done today ✓</span></div>' +
        '<p class="muted">' + (daily.correct
          ? 'Got it. Fresh one tomorrow — keep the streak alive.'
          : 'Not this time. The answer is in the module, and there is a new question tomorrow.') + '</p>' +
      '</div>';
    }
    return '<div class="card card--daily" id="dailyCard">' +
      '<div class="card-head"><h2>Daily challenge</h2><span class="pill">+20 XP</span></div>' +
      '<p class="q-text">' + esc(daily.item.question.q) + '</p>' +
      '<div class="choices">' +
        daily.item.question.choices.map(function (c, i) {
          return '<button class="choice" data-daily="' + i + '">' + esc(c) + '</button>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function wireDaily() {
    var dc = $('#dailyCard');
    if (!dc) return;
    var daily = P.dailyChallenge();
    dc.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-daily]');
      if (!btn) return;
      var picked = parseInt(btn.getAttribute('data-daily'), 10);
      var correct = daily.item.question.correct;
      dc.querySelectorAll('.choice').forEach(function (b, i) {
        b.disabled = true;
        if (i === correct) b.classList.add('is-correct');
        else if (i === picked) b.classList.add('is-wrong');
      });
      var right = picked === correct;
      J.sound(right ? 'correct' : 'wrong');
      J.haptic(right ? 'correct' : 'wrong');
      if (right) J.burstFrom(btn, 24, 1.1);

      var res = P.recordDaily(right);
      var expl = document.createElement('p');
      expl.className = 'explain';
      expl.innerHTML = '<b>' + esc(PF.line(right ? 'right' : 'wrong')) + '</b> ' + esc(daily.item.question.explain);
      dc.appendChild(expl);
      announce(res, { from: btn });
    });
  }

  /* ============================ course ================================== */

  function renderCourse() {
    renderTabs('course');
    var tiers = [
      { id: 'core', title: 'Core units', sub: 'Get proficient in each process' },
      { id: 'mastery', title: 'Mastery units', sub: 'Go past competent — the knowledge that separates trades from hobbyists' },
      // Optional, and said so plainly. Nothing here is needed for the welding,
      // and it is not put in front of her as though it were.
      { id: 'advanced', title: 'If you want it', sub: 'Optional. Not needed for any of the above — here for when you feel like going deeper' }
    ];

    view.innerHTML =
      '<h1 class="page-h">The course</h1>' +
      '<p class="page-sub">' + C.modules.length + ' modules · ' +
        C.modules.reduce(function (n, m) { return n + m.lessons.length; }, 0) + ' lessons · ' +
        Object.keys(PR).length + ' bench drills</p>' +
      tiers.map(function (t) {
        var mods = C.modules.filter(function (m) { return (m.tier || 'core') === t.id; });
        if (!mods.length) return '';
        return '<h2 class="section-h">' + t.title + '</h2>' +
          '<p class="page-sub small">' + t.sub + '</p>' +
          '<div class="grid">' + mods.map(moduleCardHtml).join('') + '</div>';
      }).join('');
  }

  function moduleCardHtml(m) {
    var pct = P.modulePercent(m.id);
    var prof = P.proficiency(m.id);
    var unlocked = P.moduleUnlocked(m.id);
    return '<a class="card card--module' + (unlocked ? '' : ' is-locked') + '" href="#/module/' + m.id + '" style="--mc:' + m.colour + '">' +
      '<div class="mod-top">' +
        '<span class="mod-icon">' + m.icon + '</span>' +
        '<span class="mod-pct">' + pct + '%</span>' +
      '</div>' +
      '<h3>' + esc(m.title) + '</h3>' +
      '<p class="mod-sub">' + esc(m.subtitle) + '</p>' +
      '<div class="mod-bar"><span style="width:' + pct + '%"></span></div>' +
      '<div class="mod-foot">' + P.lessonsDone(m.id) + '/' + m.lessons.length + ' lessons · ' +
        P.drillsDone(m.id) + '/' + m.lessons.length + ' drills · ' + prof + '% proficient</div>' +
    '</a>';
  }

  /* ============================ module ================================== */

  function renderModule(moduleId) {
    var m = moduleById(moduleId);
    if (!m) return go('#/course');
    renderTabs('course');

    var allDone = P.lessonsDone(m.id) === m.lessons.length;
    var quiz = P.state.quizzes[m.id];

    var lessons = m.lessons.map(function (l, i) {
      var done = P.isLessonDone(l.id);
      var drilled = P.isDrillDone(l.id);
      return '<a class="lesson-row' + (done ? ' is-done' : '') + '" href="#/lesson/' + m.id + '/' + l.id + '">' +
        '<span class="lesson-num">' + (done ? '✓' : i + 1) + '</span>' +
        '<span class="lesson-meta">' +
          '<span class="lesson-title">' + esc(l.title) + '</span>' +
          '<span class="lesson-blurb">' + esc(l.blurb) + '</span>' +
        '</span>' +
        '<span class="lesson-flags">' + (drilled ? '<span class="flag flag--drill" title="Bench drill done">🔧</span>' : '') + '</span>' +
        '<span class="lesson-go">›</span>' +
      '</a>';
    }).join('');

    var quizStatus = quiz
      ? 'Best ' + quiz.best + '/' + quiz.total + (P.moduleComplete(m.id) ? ' · passed ✓' : ' · not passed yet')
      : '5 questions · ' + P.XP.quizAnswer + ' XP per correct answer';

    view.innerHTML =
      '<a class="back" href="#/course">‹ All modules</a>' +
      '<div class="mod-head" style="--mc:' + m.colour + '">' +
        '<span class="mod-head-icon">' + m.icon + '</span>' +
        '<div><h1>' + esc(m.title) + '</h1><p>' + esc(m.subtitle) + '</p></div>' +
      '</div>' +
      '<div class="prof-bar">' +
        '<div class="prof-fill" style="width:' + P.proficiency(m.id) + '%"></div>' +
        '<span>' + P.proficiency(m.id) + '% proficient — reading, quiz and bench drills combined</span>' +
      '</div>' +
      '<blockquote class="mentor">' + esc(m.intro) + '</blockquote>' +
      '<div class="lessons">' + lessons + '</div>' +
      '<a class="card card--quiz' + (allDone ? '' : ' is-dim') + '" href="#/quiz/' + m.id + '">' +
        '<div class="quiz-icon">🎯</div>' +
        '<div><h3>Checkpoint quiz</h3><p>' + esc(quizStatus) + '</p></div>' +
        '<div class="quiz-go">›</div>' +
      '</a>' +
      checkedAgainstHtml(m);
  }

  /* The claim attached to the content rather than buried three taps away: what
     this particular unit is built on, with the links right there. */
  function checkedAgainstHtml(m) {
    var S = window.WA_SOURCES;
    if (!S) return '';
    var hits = S.byUnit(m.id);
    if (!hits.length) return '<p class="checked"><a href="#/sources">Where all of this comes from →</a></p>';
    return '<div class="checked">' +
      '<b>Checked against</b>' +
      hits.map(function (s) {
        return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
          esc(s.title) + ' ↗</a>';
      }).join('') +
      '<a class="checked-all" href="#/sources">All sources →</a>' +
    '</div>';
  }

  /* ============================ lesson + modes ========================== */

  var MODES = [
    { id: 'read',   icon: '📖', label: 'Read',   hint: 'The full lesson, in plain English' },
    { id: 'guts',   icon: '⚡', label: 'Guts',   hint: 'Just the points that matter — 30 seconds' },
    { id: 'show',   icon: '👁️', label: 'Show',   hint: 'Diagrams first, words second' },
    { id: 'do',     icon: '🔧', label: 'Do',     hint: 'Go to the bench and do this' },
    { id: 'recall', icon: '🧠', label: 'Recall', hint: 'Cards — get tested, do not just re-read' }
  ];

  function renderLesson(moduleId, lessonId) {
    var m = moduleById(moduleId);
    var l = lessonById(m, lessonId);
    if (!m || !l) return go('#/course');
    renderTabs('course');

    var mode = P.state.prefMode || 'read';
    if (!MODES.some(function (x) { return x.id === mode; })) mode = 'read';

    var idx = m.lessons.indexOf(l);
    var done = P.isLessonDone(l.id);
    var isLast = idx === m.lessons.length - 1;

    view.innerHTML =
      '<a class="back" href="#/module/' + m.id + '">‹ ' + esc(m.title) + '</a>' +
      '<div class="lesson-head" style="--mc:' + m.colour + '">' +
        '<div class="lesson-kicker">' + m.icon + ' Lesson ' + (idx + 1) + ' of ' + m.lessons.length + '</div>' +
        '<h1>' + esc(l.title) + '</h1>' +
      '</div>' +
      '<div class="modes" id="modes">' +
        MODES.map(function (x) {
          return '<button class="mode' + (x.id === mode ? ' is-active' : '') + '" data-mode="' + x.id + '">' +
            '<span class="mode-i">' + x.icon + '</span><span class="mode-l">' + x.label + '</span></button>';
        }).join('') +
      '</div>' +
      '<div class="mode-hint" id="modeHint">' + esc((MODES.filter(function (x) { return x.id === mode; })[0] || {}).hint || '') + '</div>' +
      narratorBarHtml() +
      '<div id="lessonBody">' + lessonBody(m, l, mode) + '</div>' +
      '<div class="lesson-actions">' +
        '<button class="btn btn--primary btn--big" id="doneBtn">' +
          (done ? (isLast ? 'On to the checkpoint →' : 'Next lesson →') : 'Mark done · +10 XP →') +
        '</button>' +
      '</div>';

    $('#modes').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-mode]');
      if (!btn) return;
      var id = btn.getAttribute('data-mode');
      P.setPrefMode(id);
      tap();
      $('#modes').querySelectorAll('.mode').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-mode') === id);
      });
      $('#modeHint').textContent = (MODES.filter(function (x) { return x.id === id; })[0] || {}).hint || '';
      $('#lessonBody').innerHTML = lessonBody(m, l, id);
      wireLessonBody(m, l, id);
      buildScript();
    });

    wireLessonBody(m, l, mode);
    wireNarrator();

    $('#doneBtn').addEventListener('click', function (e) {
      var res = P.completeLesson(m.id, l.id);

      /* One wink, in one place: the tile that closes out her very first unit.
         It goes ahead of the standard celebrations so it lands first. */
      if (res.xp && PERSONAL.isUnicornLesson(m.id, l.id)) {
        J.celebrate({
          kind: 'complete',
          character: 'unicorn',
          icon: PERSONAL.unicorn().emoji,
          kicker: 'First unit done',
          title: PERSONAL.unicorn().line,
          button: '🦄'
        });
      }

      announce(res, { from: e.currentTarget });
      var nextHref = isLast ? '#/quiz/' + m.id : '#/lesson/' + m.id + '/' + m.lessons[idx + 1].id;
      setTimeout(function () { go(nextHref); }, res.xp ? 420 : 0);
    });
  }

  /* ---- read it to me ---- */

  var RATES = [0.8, 1, 1.15, 1.35, 1.6];

  function narratorBarHtml() {
    if (!N.supported()) return '';
    return '<div class="reader" id="reader">' +
      '<button class="reader-btn reader-play" id="readPlay" aria-label="Read aloud">▶</button>' +
      '<button class="reader-btn" id="readBack" aria-label="Back a sentence">↺</button>' +
      '<button class="reader-btn" id="readFwd" aria-label="Forward a sentence">↻</button>' +
      '<div class="reader-meta">' +
        '<div class="reader-label" id="readLabel">Read it to me</div>' +
        '<div class="reader-track"><span id="readBar"></span></div>' +
      '</div>' +
      '<button class="reader-btn reader-rate" id="readRate">' + N.getRate() + '×</button>' +
    '</div>';
  }

  /* The script is built from what is actually on screen, so it follows her
     into whichever mode she is reading in. */
  function buildScript() {
    if (!N.supported()) return;
    var els = [];
    var head = $('.lesson-head h1');
    if (head) els.push(head);
    var body = $('#lessonBody');
    if (body) {
      body.querySelectorAll('.prose p, .gut, .tile, .tipbox p, .keybox li, .drill-head h2, .drill-why, .drill-steps li, .drill-pass li, .flip-front p, .flip-back p, .mode-lead')
        .forEach(function (el) { els.push(el); });
    }
    N.setScript(els);
    paintReader(N.status());

    /* She told us she learns by being told, or that she opens this in the ute.
       Either way the lesson starts reading itself rather than waiting to be
       asked. One tap on the reader bar stops it. */
    if (PF.derive().autoRead && els.length) {
      autoReadTimer = setTimeout(function () {
        if ($('#reader')) { N.play(0); paintReader(N.status()); }
      }, 700);
    }
  }

  function paintReader(st) {
    var bar = $('#reader');
    if (!bar) return;
    $('#readPlay').textContent = st.playing && !st.paused ? '❚❚' : '▶';
    bar.classList.toggle('is-live', st.playing);
    $('#readRate').textContent = st.rate + '×';
    $('#readLabel').textContent = !st.total ? 'Nothing to read here'
      : st.playing ? (st.paused ? 'Paused' : 'Reading') + ' · ' + (st.index + 1) + ' of ' + st.total
      : 'Read it to me · ' + st.total + ' bits';
    $('#readBar').style.width = st.total ? Math.round((st.index / st.total) * 100) + '%' : '0%';

    document.querySelectorAll('.is-reading').forEach(function (el) { el.classList.remove('is-reading'); });
    if (st.playing && st.current && st.current.el) {
      st.current.el.classList.add('is-reading');
      if (!J.reducedMotion()) {
        var r = st.current.el.getBoundingClientRect();
        if (r.top < 90 || r.bottom > window.innerHeight - 90) {
          st.current.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }

  function wireNarrator() {
    if (!N.supported()) return;
    buildScript();

    N.offChange(paintReader);
    N.onChange(paintReader);

    $('#readPlay').addEventListener('click', function () { tap(); N.toggle(); });
    $('#readBack').addEventListener('click', function () { tap(); N.skip(-1); });
    $('#readFwd').addEventListener('click', function () { tap(); N.skip(1); });
    $('#readRate').addEventListener('click', function () {
      tap();
      var i = RATES.indexOf(N.getRate());
      N.setRate(RATES[(i + 1) % RATES.length]);
      paintReader(N.status());
    });
  }

  function diagramsFor(lessonId) {
    var ids = (window.WA_DIAGRAM_MAP || {})[lessonId] || [];
    return ids.filter(function (id) { return DG.has(id); });
  }

  function lessonBody(m, l, mode) {
    if (mode === 'guts') return gutsHtml(l);
    if (mode === 'show') return showHtml(l);
    if (mode === 'do') return doHtml(m, l);
    if (mode === 'recall') return recallHtml(l);
    return readHtml(l);
  }

  function readHtml(l) {
    var diagrams = diagramsFor(l.id).map(function (id) { return DG.get(id); }).join('');
    return '<article class="prose">' + l.body.map(function (p) { return '<p>' + fmt(p) + '</p>'; }).join('') + '</article>' +
      diagrams +
      (l.tip ? '<div class="tipbox"><b>From the shed floor</b><p>' + fmt(l.tip) + '</p></div>' : '') +
      '<div class="keybox"><b>Worth remembering</b><ul>' +
        l.keyPoints.map(function (k) { return '<li>' + fmt(k) + '</li>'; }).join('') + '</ul></div>';
  }

  function gutsHtml(l) {
    return '<p class="mode-lead">Everything that matters in this lesson, nothing else.</p>' +
      '<div class="guts">' +
        l.keyPoints.map(function (k, i) {
          return '<div class="gut"><span class="gut-n">' + (i + 1) + '</span><span>' + fmt(k) + '</span></div>';
        }).join('') +
      '</div>' +
      (l.tip ? '<div class="tipbox"><b>And one from the shed floor</b><p>' + fmt(l.tip) + '</p></div>' : '');
  }

  function showHtml(l) {
    var ds = diagramsFor(l.id);
    return '<p class="mode-lead">' + (ds.length
        ? 'Look at the picture first. The words underneath only have to confirm what you already saw.'
        : 'No drawing for this one — here it is as big blocks instead.') + '</p>' +
      ds.map(function (id) { return DG.get(id); }).join('') +
      '<div class="tiles">' +
        l.keyPoints.map(function (k) { return '<div class="tile">' + fmt(k) + '</div>'; }).join('') +
      '</div>';
  }

  function doHtml(m, l) {
    var p = (PR[l.id] || {}).practice;
    if (!p) {
      return '<p class="mode-lead">No bench drill for this lesson — take it to the Kit tab and run the pre-flight checklist instead.</p>';
    }
    var done = P.isDrillDone(l.id);
    return '<div class="drill' + (done ? ' is-done' : '') + '">' +
      '<div class="drill-head">' +
        '<span class="drill-badge">' + (done ? '✓ Drill done' : 'Bench drill · +20 XP') + '</span>' +
        '<h2>' + esc(p.task) + '</h2>' +
        '<p class="drill-why">' + esc(p.why) + '</p>' +
      '</div>' +
      (p.kit ? '<div class="drill-kit"><b>You need</b><span>' + p.kit.map(esc).join(' · ') + '</span></div>' : '') +
      '<ol class="drill-steps">' +
        p.steps.map(function (s, i) {
          return '<li><label class="step"><input type="checkbox" data-step="' + i + '"><span class="clue-box"></span><span>' + esc(s) + '</span></label></li>';
        }).join('') +
      '</ol>' +
      '<div class="drill-pass"><b>You have got it when</b><ul>' +
        p.pass.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="drill-actions">' +
        '<button class="btn btn--primary" id="drillBtn"' + (done ? ' disabled' : '') + '>' +
          (done ? 'Logged ✓' : 'I did this drill · +20 XP') + '</button>' +
        '<a class="btn btn--ghost" href="#/kit/log">📓 Log it with a photo</a>' +
      '</div>' +
    '</div>';
  }

  function recallHtml(l) {
    var cards = (PR[l.id] || {}).recall || [];
    if (!cards.length) return '<p class="mode-lead">No cards for this lesson yet.</p>';
    return '<p class="mode-lead">Try to answer before you flip. Getting it wrong and then seeing why is what makes it stick.</p>' +
      '<div class="cards" id="recallCards">' +
        cards.map(function (c, i) {
          return '<div class="flip" data-flip="' + i + '">' +
            '<div class="flip-inner">' +
              '<div class="flip-front"><span class="flip-n">Card ' + (i + 1) + '</span><p>' + esc(c.q) + '</p><span class="flip-hint">Tap to flip</span></div>' +
              '<div class="flip-back"><p>' + esc(c.a) + '</p></div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<button class="btn btn--primary btn--big" id="recallBtn"' + (P.isRecallDone(l.id) ? ' disabled' : '') + '>' +
        (P.isRecallDone(l.id) ? 'Cards done ✓' : 'I have worked through these · +5 XP') + '</button>';
  }

  function wireLessonBody(m, l, mode) {
    if (mode === 'do') {
      var body = $('#lessonBody');
      body.addEventListener('change', function (e) {
        var cb = e.target.closest('[data-step]');
        if (!cb) return;
        cb.closest('.step').classList.toggle('is-on', cb.checked);
        tap();
      });
      var btn = $('#drillBtn');
      if (btn && !btn.disabled) {
        btn.addEventListener('click', function (e) {
          var res = P.completeDrill(l.id);
          J.burstFrom(e.currentTarget, 34, 1.3);
          J.sound('correct');
          J.haptic('correct');
          announce(res, { xpNote: 'Bench work counts double' });
          $('#lessonBody').innerHTML = doHtml(m, l);
          wireLessonBody(m, l, 'do');
        });
      }
    }

    if (mode === 'recall') {
      var host = $('#recallCards');
      if (host) {
        host.addEventListener('click', function (e) {
          var card = e.target.closest('[data-flip]');
          if (!card) return;
          card.classList.toggle('is-flipped');
          tap();
        });
      }
      var rb = $('#recallBtn');
      if (rb && !rb.disabled) {
        rb.addEventListener('click', function (e) {
          var res = P.completeRecall(l.id);
          J.burstFrom(e.currentTarget, 20, 1);
          announce(res);
          $('#lessonBody').innerHTML = recallHtml(l);
          wireLessonBody(m, l, 'recall');
        });
      }
    }
  }

  /* ============================ quiz ==================================== */

  var quizRun = null;

  function renderQuiz(moduleId) {
    var m = moduleById(moduleId);
    if (!m) return go('#/course');
    renderTabs('course');

    if (!quizRun || quizRun.moduleId !== moduleId) {
      quizRun = { moduleId: moduleId, i: 0, answers: [] };
    }
    if (quizRun.i >= m.quiz.length) return renderQuizResults(m);

    var q = m.quiz[quizRun.i];
    var picked = quizRun.answers[quizRun.i];

    view.innerHTML =
      '<a class="back" href="#/module/' + m.id + '">‹ ' + esc(m.title) + '</a>' +
      '<div class="quiz-progress">' +
        m.quiz.map(function (_, i) {
          var cls = i < quizRun.i ? (quizRun.answers[i] === m.quiz[i].correct ? 'is-right' : 'is-wrong')
            : (i === quizRun.i ? 'is-current' : '');
          return '<span class="qp ' + cls + '"></span>';
        }).join('') +
      '</div>' +
      '<div class="quiz-kicker">Question ' + (quizRun.i + 1) + ' of ' + m.quiz.length + '</div>' +
      '<h1 class="q-h">' + esc(q.q) + '</h1>' +
      '<div class="choices choices--big" id="qChoices">' +
        q.choices.map(function (c, i) {
          return '<button class="choice" data-q="' + i + '">' + esc(c) + '</button>';
        }).join('') +
      '</div>' +
      '<div id="qFeedback"></div>';

    if (picked !== undefined) showQuizFeedback(m, q, picked);

    $('#qChoices').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-q]');
      if (!btn || quizRun.answers[quizRun.i] !== undefined) return;
      var pick = parseInt(btn.getAttribute('data-q'), 10);
      quizRun.answers[quizRun.i] = pick;
      var right = pick === q.correct;
      J.sound(right ? 'correct' : 'wrong');
      J.haptic(right ? 'correct' : 'wrong');
      if (right) J.burstFrom(btn, 22, 1);
      showQuizFeedback(m, q, pick);
    });
  }

  function showQuizFeedback(m, q, picked) {
    var host = $('#qChoices');
    host.querySelectorAll('.choice').forEach(function (b, i) {
      b.disabled = true;
      if (i === q.correct) b.classList.add('is-correct');
      else if (i === picked) b.classList.add('is-wrong');
    });
    var right = picked === q.correct;
    var last = quizRun.i === m.quiz.length - 1;
    $('#qFeedback').innerHTML =
      '<div class="feedback ' + (right ? 'is-right' : 'is-wrong') + '">' +
        '<b>' + (right ? '✓ ' : '✗ ') + esc(PF.line(right ? 'right' : 'wrong')) + '</b>' +
        '<p>' + esc(q.explain) + '</p>' +
      '</div>' +
      '<button class="btn btn--primary btn--big" id="qNext">' + (last ? 'See your score →' : 'Next question →') + '</button>';

    $('#qNext').addEventListener('click', function () {
      quizRun.i += 1;
      renderQuiz(m.id);
      scrollTop();
    });
  }

  function renderQuizResults(m) {
    var correct = quizRun.answers.filter(function (a, i) { return a === m.quiz[i].correct; }).length;
    var total = m.quiz.length;
    var res = P.recordQuiz(m.id, correct, total);
    var passed = correct >= Math.ceil(total * 0.6);
    quizRun = null;

    var verdict = correct === total ? 'Perfect. Every single one.'
      : passed ? 'Passed. Good work.'
      : 'Not there yet — go back over the lessons and have another crack.';

    view.innerHTML =
      '<div class="result ' + (passed ? 'is-pass' : 'is-fail') + '">' +
        '<div class="result-ring">' + ring(Math.round(correct / total * 100), passed ? 'var(--ok)' : 'var(--bad)', 150, 10) +
          '<span class="result-score">' + correct + '<i>/' + total + '</i></span></div>' +
        '<h1>' + esc(verdict) + '</h1>' +
        (res.xp ? '<p class="result-xp">+' + res.xp + ' XP</p>'
                : '<p class="muted">Retakes are free practice — no XP, but every explanation is still there.</p>') +
        '<div class="result-actions">' +
          '<button class="btn btn--primary" id="retryBtn">Try again</button>' +
          '<a class="btn btn--ghost" href="#/course">Back to the course</a>' +
        '</div>' +
      '</div>';

    if (passed) { J.shower(60); J.sound('complete'); }
    announce(res);

    $('#retryBtn').addEventListener('click', function () {
      quizRun = { moduleId: m.id, i: 0, answers: [] };
      renderQuiz(m.id);
      scrollTop();
    });
  }

  /* ============================ weld doctor ============================= */

  var doctorPicks = {};
  var pendingLogDiagnosis = '';
  var pendingLogPhoto = null;

  function renderDoctor() {
    renderTabs('doctor');

    var groups = {};
    R.clues.forEach(function (c) { (groups[c.group] = groups[c.group] || []).push(c); });

    var cluesHtml = Object.keys(groups).map(function (g) {
      return '<h2 class="section-h">' + esc(g) + '</h2>' +
        '<div class="clues">' +
          groups[g].map(function (c) {
            var on = !!doctorPicks[c.id];
            return '<label class="clue' + (on ? ' is-on' : '') + '">' +
              '<input type="checkbox" data-clue="' + c.id + '"' + (on ? ' checked' : '') + '>' +
              '<span class="clue-box"></span>' +
              '<span class="clue-label">' + esc(c.label) + '</span>' +
            '</label>';
          }).join('') +
        '</div>';
    }).join('');

    view.innerHTML =
      '<div class="mate-head">' +
        '<div class="mate-face">👷</div>' +
        '<div><h1>Ask Old Mate</h1>' +
        '<p>Been welding since before you were born. Tell him what you can see, hear or remember — you do not need to know the names, that is his end.</p></div>' +
      '</div>' +
      askCardHtml() +
      (V.isConfigured() ? cameraCardHtml() : '') +
      '<h2 class="section-h">Or tick what you can see</h2>' +
      '<div id="clueHost">' + cluesHtml + '</div>' +
      '<div class="doctor-actions">' +
        '<button class="btn btn--primary btn--big" id="dxBtn">Diagnose it →</button>' +
        '<button class="btn btn--ghost btn--sm" id="dxClear">Clear all</button>' +
      '</div>' +
      '<div id="dxResults"></div>' +
      (V.isConfigured() ? '' :
        '<p class="footer-note small">Want Old Mate to look at a photo and tick these for you? ' +
        '<a href="#/settings">Set up the camera scan</a> — optional, and the checklist works fine without it.</p>');

    $('#clueHost').addEventListener('change', function (e) {
      var cb = e.target.closest('[data-clue]');
      if (!cb) return;
      var id = cb.getAttribute('data-clue');
      if (cb.checked) doctorPicks[id] = true; else delete doctorPicks[id];
      cb.closest('.clue').classList.toggle('is-on', cb.checked);
      tap();
    });

    $('#dxClear').addEventListener('click', function () {
      doctorPicks = {};
      renderDoctor();
      scrollTop();
    });

    $('#dxBtn').addEventListener('click', function () {
      if (!Object.keys(doctorPicks).length) {
        toast('Tick at least one thing you can see first.', 'warn');
        J.haptic('wrong');
        return;
      }
      showDiagnosis(Object.keys(doctorPicks));
    });

    wireAsk();
    if (V.isConfigured()) wireCamera();
  }

  function cameraCardHtml() {
    return '<div class="card card--camera" id="cameraCard">' +
      '<label class="file-btn file-btn--cam">' +
        '<input type="file" accept="image/*" capture="environment" id="scanPhoto">' +
        '<span><b>📸 Show Old Mate a photo</b><i>Point the camera at the weld — it spots it, he names it</i></span>' +
      '</label>' +
      '<div id="scanResult"></div>' +
    '</div>';
  }

  /* ---- ask him in her own words ---- */

  function speechRecognition() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    return SR ? new SR() : null;
  }

  function askCardHtml() {
    var canHear = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    return '<div class="card card--ask">' +
      '<div class="ask-row">' +
        '<input class="input ask-input" id="askBox" type="text" autocomplete="off" ' +
          'placeholder="Why is my weld full of little holes?">' +
        (canHear ? '<button class="ask-mic" id="askMic" aria-label="Ask out loud">🎤</button>' : '') +
      '</div>' +
      '<button class="btn btn--primary" id="askGo">Ask him</button>' +
      '<div id="askOut"></div>' +
    '</div>';
  }

  function renderAnswer(res) {
    var host = $('#askOut');
    if (!host) return;

    var first = res.answers[0];
    host.innerHTML =
      '<div class="ask-answer' + (res.ok ? '' : ' is-stumped') + '">' +
        '<p class="ask-text">' + esc(first.text) + '</p>' +
        (first.href ? '<a class="ask-src" href="' + first.href + '">' +
          (first.title ? esc(first.title) : 'Read it properly') +
          (first.where ? ' · ' + esc(first.where) : '') + ' →</a>' : '') +
        (res.source === 'ai' ? '<span class="ask-badge">answered by ' + esc(WA_ASK.providerName()) +
          ', from the app\'s own notes</span>' : '') +
      '</div>' +
      ((res.also || res.answers.slice(1)).length
        ? '<div class="ask-more"><b>He also reckons these are related</b>' +
          tiles((res.also || res.answers.slice(1)).map(function (a, i) {
            return { key: 'askmore:' + i, icon: '📖', title: a.title || 'Related', sub: a.where };
          })) + '</div>'
        : '');

    // Read it back, because half the time she is not looking at the screen.
    if (N.supported()) {
      N.setScript([{ text: first.text }]);
      N.play(0);
    }

    var more = (res.also || res.answers.slice(1));
    var moreHost = host.querySelector('.ask-more');
    if (moreHost) {
      moreHost.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-tile^="askmore:"]');
        if (!btn) return;
        var a = more[+btn.getAttribute('data-tile').split(':')[1]];
        if (!a) return;
        openSheet(a.title || 'Related',
          '<p>' + esc(a.text) + '</p>' +
          (a.href ? '<a class="btn btn--primary" href="' + a.href + '">Open it →</a>' : ''));
      });
    }
  }

  function askHim(question) {
    question = (question || '').trim();
    if (!question) { toast('Ask him something first.', 'warn'); return; }
    var host = $('#askOut');
    host.innerHTML = '<div class="ask-thinking"><span class="scan-bar"></span>Having a think…</div>';
    WA_ASK.answer(question).then(renderAnswer);
  }

  function wireAsk() {
    var box = $('#askBox');
    if (!box) return;
    $('#askGo').addEventListener('click', function () { tap(); askHim(box.value); });
    box.addEventListener('keydown', function (e) { if (e.key === 'Enter') askHim(box.value); });

    var mic = $('#askMic');
    if (!mic) return;
    mic.addEventListener('click', function () {
      var rec = speechRecognition();
      if (!rec) return;
      rec.lang = 'en-AU';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      mic.classList.add('is-live');
      tap();
      rec.onresult = function (e) {
        var said = e.results[0][0].transcript;
        box.value = said;
        askHim(said);
      };
      rec.onerror = function () {
        toast('Did not catch that — type it instead.', 'warn');
      };
      rec.onend = function () { mic.classList.remove('is-live'); };
      try { rec.start(); } catch (err) { mic.classList.remove('is-live'); }
    });
  }

  function wireCamera() {
    var input = $('#scanPhoto');
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      shrinkImage(file, function (dataUrl) {
        if (!dataUrl) { toast('Could not read that image.', 'warn'); return; }
        pendingLogPhoto = dataUrl;
        var host = $('#scanResult');
        host.innerHTML =
          '<img class="scan-photo" src="' + dataUrl + '" alt="The weld you photographed">' +
          '<div class="scanning"><span class="scan-bar"></span>Looking at it…</div>';

        V.analyse(dataUrl).then(function (out) {
          if (!out.ok) {
            host.innerHTML = '<img class="scan-photo" src="' + dataUrl + '" alt="The weld you photographed">' +
              '<div class="scan-fail">⚠️ ' + esc(out.error) + '<br><span>Tick the symptoms below instead — that always works.</span></div>';
            return;
          }
          out.clues.forEach(function (c) { doctorPicks[c] = true; });
          document.querySelectorAll('[data-clue]').forEach(function (cb) {
            var on = !!doctorPicks[cb.getAttribute('data-clue')];
            cb.checked = on;
            cb.closest('.clue').classList.toggle('is-on', on);
          });
          host.innerHTML =
            '<img class="scan-photo" src="' + dataUrl + '" alt="The weld you photographed">' +
            '<div class="scan-out">' +
              (out.labels.length
                ? '<div class="scan-labels">' + out.labels.slice(0, 4).map(function (l) {
                    return '<span class="scan-label">' + esc(l.label) +
                      (l.score != null ? ' <i>' + Math.round(l.score * 100) + '%</i>' : '') + '</span>';
                  }).join('') + '</div>'
                : '') +
              '<p>' + esc(out.note) + '</p>' +
              (out.clues.length ? '<p class="scan-ticked">Ticked ' + out.clues.length + ' symptom' +
                (out.clues.length === 1 ? '' : 's') + ' below for you — add anything else you can see, then diagnose.</p>' : '') +
            '</div>';
          J.sound('correct');
          J.haptic('correct');
        });
      });
    });
  }

  function diagnose(clueIds) {
    return R.defects.map(function (d) {
      var score = 0;
      clueIds.forEach(function (c) { if (d.match[c]) score += d.match[c]; });
      return { defect: d, score: score };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  /* The full write-up on one defect: why it happened, what to do about it now,
     and how to stop it next time. */
  function openDefectSheet(id) {
    var d = R.defects.filter(function (x) { return (x.id || x.name) === id; })[0];
    if (!d) return;
    openSheet(d.icon + ' ' + d.name,
      '<p class="dx-sev">' + esc(d.severity) + '</p>' +
      '<p class="dx-plain">' + esc(d.plain) + '</p>' +
      '<div class="dx-sec"><b>Why it happened</b><ul>' +
        d.causes.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="dx-sec dx-sec--fix"><b>Fix it now</b><ul>' +
        d.fixNow.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="dx-sec"><b>Stop it happening again</b><ul>' +
        d.prevent.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>' +
      '<p class="dx-note">' + esc(d.processNote) + '</p>');
  }

  function showDiagnosis(clueIds) {
    var results = diagnose(clueIds).slice(0, 3);
    var host = $('#dxResults');

    if (!results.length) {
      host.innerHTML = '<div class="card"><p>Old Mate is stumped — nothing in his book matches that combination. Photograph it into the weld log and put it in front of someone who can get hands on it. That is the honest answer.</p></div>';
      return;
    }

    var maxScore = results[0].score;
    var top = results[0].defect;

    /* His call goes on screen straight away — she is standing at the bench
       wanting an answer, not a reading list. The detail is one tap behind it,
       and the runners-up are tiles rather than another two screens of prose. */
    host.innerHTML =
      '<h2 class="section-h">What Old Mate reckons</h2>' +
      '<div class="card card--dx is-top">' +
        '<div class="dx-head">' +
          '<span class="dx-icon">' + top.icon + '</span>' +
          '<div><h3>' + esc(top.name) + '</h3>' +
            '<div class="dx-conf"><span style="width:100%"></span></div>' +
            '<div class="dx-sev">' + esc(top.severity) + '</div>' +
          '</div>' +
        '</div>' +
        '<p class="dx-plain">' + esc(top.plain) + '</p>' +
        '<button class="btn btn--primary" data-dx="' + esc(top.id || top.name) + '">Why, and how to fix it →</button>' +
      '</div>' +
      (results.length > 1
        ? '<h2 class="section-h">Also worth a look</h2>' +
          '<p class="page-sub small">Two faults often ride together, so read past the first one.</p>' +
          tiles(results.slice(1).map(function (r) {
            return { key: 'dx:' + (r.defect.id || r.defect.name), icon: r.defect.icon,
                     title: r.defect.name,
                     sub: Math.round((r.score / maxScore) * 100) + '% as likely' };
          }))
        : '') +
      '<div class="doctor-actions">' +
        '<a class="btn btn--primary" href="#/kit/log">📓 Log this weld with a photo</a>' +
        '<button class="btn btn--ghost btn--sm" id="dxAgain">Start again</button>' +
      '</div>';

    pendingLogDiagnosis = results[0].defect.name;
    announce(P.markDoctorUsed());

    host.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-dx],[data-tile]');
      if (!btn) return;
      var id = btn.getAttribute('data-dx') ||
               (btn.getAttribute('data-tile') || '').replace(/^dx:/, '');
      openDefectSheet(id);
    });

    $('#dxAgain').addEventListener('click', function () {
      doctorPicks = {};
      renderDoctor();
      scrollTop();
    });

    host.scrollIntoView({ behavior: J.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  /* ============================ field kit =============================== */

  function renderKit(tab) {
    renderTabs('kit');
    tab = tab || 'checklist';

    var tabs = [
      { id: 'checklist', label: '✅ Pre-flight' },
      { id: 'sheets', label: '📋 Cheat sheets' },
      { id: 'log', label: '📓 Weld log' },
      { id: 'scrap', label: '💰 Prices' },
      { id: 'tally', label: '⚖️ My pile' },
      { id: 'teardown', label: '🔩 Worth stripping?' }
    ];

    var body = tab === 'sheets' ? kitSheets()
             : tab === 'log' ? kitLog()
             : tab === 'scrap' ? kitScrap()
             : tab === 'tally' ? kitTally()
             : tab === 'teardown' ? kitTeardown()
             : kitChecklist();

    view.innerHTML =
      '<h1 class="page-h">🧰 Field Kit</h1>' +
      '<div class="subtabs">' +
        tabs.map(function (t) {
          return '<a class="subtab' + (t.id === tab ? ' is-active' : '') + '" href="#/kit/' + t.id + '">' + t.label + '</a>';
        }).join('') +
      '</div>' +
      '<div id="kitBody">' + body + '</div>';

    if (tab === 'checklist') wireChecklist();
    if (tab === 'log') wireLog();
    if (tab === 'scrap') wireScrap();
    if (tab === 'tally') wireTally();

    // One delegated handler for every tile on this page.
    $('#kitBody').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-tile]');
      if (!btn) return;
      var parts = btn.getAttribute('data-tile').split(':');
      if (parts[0] === 'scrap') openScrapSheet(+parts[1]);
      else if (parts[0] === 'cheat') openCheatSheet(+parts[1]);
      else if (parts[0] === 'check') openCheckSheet(+parts[1]);
      else if (parts[0] === 'td') openTeardownSheet(parts[1]);
    });
  }

  /* ---- what's in this thing? ---- */

  function kitTeardown() {
    return '<p class="page-sub">Someone has handed you an alternator. Is it worth the hour? ' +
      'Every one of these ends with the same call: strip it, sell it whole, or leave it.</p>' +
      tiles(TD.items.map(function (it) {
        var v = TD.verdict(it.verdict);
        return { key: 'td:' + it.id, icon: it.icon, title: it.name, sub: v.icon + ' ' + v.label };
      })) +
      '<div class="card card--warn">' +
        '<b>These are ranges, not promises</b>' +
        '<p>A big truck alternator and a little Japanese one are different animals, and prices ' +
        'move. Weigh what you actually get and keep your own notes in the tally — after a few ' +
        'loads yours will beat any table.</p>' +
      '</div>';
  }

  function openTeardownSheet(id) {
    var it = TD.byId(id);
    if (!it) return;
    var v = TD.verdict(it.verdict);
    openSheet(it.icon + ' ' + it.name,
      '<div class="td-verdict ' + v.cls + '">' + v.icon + ' ' + esc(v.label) + '</div>' +
      '<p>' + esc(it.plain) + '</p>' +
      '<div class="td-hook"><span>Remember it as</span><b>' + esc(it.hook) + '</b></div>' +
      '<div class="dx-sec"><b>What is in it</b><p>' + esc(it.metals) + '</p></div>' +
      '<div class="dx-sec"><b>What it takes</b><p>About ' + it.time + ' minutes once you have ' +
        'done a few. ' + esc(it.tools) + '</p></div>' +
      '<div class="dx-sec dx-sec--fix"><b>' + esc(v.label) + '</b><p>' + esc(it.verdictWhy) + '</p></div>' +
      (it.danger ? '<div class="td-danger"><b>⚠️ Read this bit</b><p>' + esc(it.danger) + '</p></div>' : '') +
      '<div class="dx-sec"><b>Worth knowing</b><ul>' +
        it.notes.map(function (nn) { return '<li>' + esc(nn) + '</li>'; }).join('') + '</ul></div>');
  }

  /* ---- her scales, her ledger ---- */

  function money(n) {
    return '$' + Math.round(n).toLocaleString('en-AU');
  }

  function kitTally() {
    var v = TL.valuePile();
    var costs = TL.tripCost();
    var life = TL.lifetime();

    var pileHtml = v.lines.length
      ? '<div class="tally-lines">' + v.lines.map(function (l) {
          return '<div class="tally-line">' +
            '<span class="tally-ico">' + l.icon + '</span>' +
            '<span class="tally-metal"><b>' + esc(l.label) + '</b>' +
              '<i>' + (Math.round(l.kg * 10) / 10) + ' kg</i></span>' +
            '<span class="tally-val">' +
              (l.known
                ? '<b>' + money(l.yardLow) + '–' + money(l.yardHigh) + '</b>' +
                  '<i>' + money(l.spot) + ' at spot' + (l.live ? '' : ' · estimate') + '</i>'
                : '<i>no price</i>') +
            '</span>' +
          '</div>';
        }).join('') + '</div>'
      : '<p class="muted">Nothing weighed in yet. Add what is on your scales.</p>';

    return '<p class="page-sub">What you are sitting on, valued two ways — because the ' +
      'number on the world market and the number a yard hands you are not the same, and ' +
      'the gap is the business.</p>' +

      '<div class="card card--tally">' +
        '<div class="tally-head">' +
          '<div><span class="tally-kicker">Yard would pay</span>' +
            '<span class="tally-big">' + (v.total.spot
              ? money(v.total.yardLow) + '–' + money(v.total.yardHigh) : '—') + '</span></div>' +
          '<div class="tally-spot">' + (v.total.spot ? money(v.total.spot) + ' at spot' : '') + '</div>' +
        '</div>' +
        pileHtml +
        (costs > 0 ? '<div class="tally-costs">Less ' + money(costs) + ' of running around · ' +
          '<b>' + money(Math.max(0, v.total.yardLow - costs)) + '–' +
          money(Math.max(0, v.total.yardHigh - costs)) + ' actually yours</b></div>' : '') +
        (v.total.anyEstimate ? '<p class="muted small">Some of those have no live feed, so they ' +
          'use a rough standing figure — marked as an estimate rather than dressed up as a price.</p>' : '') +
        '<div class="tally-actions">' +
          '<button class="btn btn--primary" id="tallyAdd">＋ Weigh something in</button>' +
          '<button class="btn btn--ghost btn--sm" id="tallyTrip">⛽ Log a run</button>' +
          (v.lines.length ? '<button class="btn btn--ghost btn--sm" id="tallySell">Mark as sold</button>' : '') +
        '</div>' +
      '</div>' +

      (life.loads ? '<h2 class="section-h">What you have actually made</h2>' +
        '<div class="card">' +
          '<div class="life-row"><span>' + life.loads + ' load' + (life.loads === 1 ? '' : 's') +
            ' · ' + Math.round(life.kg) + ' kg</span></div>' +
          '<div class="life-row"><span>Paid</span><b>' + money(life.paid) + '</b></div>' +
          '<div class="life-row"><span>Fuel and running</span><b>−' + money(life.costs) + '</b></div>' +
          '<div class="life-row is-total"><span>Actually made</span><b>' + money(life.profit) + '</b></div>' +
          (life.ratio ? '<p class="muted small">Across every load you have been paid about ' +
            Math.round(life.ratio * 100) + '% of spot. Watch that number: if one yard drags it ' +
            'down, that is the yard, not the metal.</p>' : '') +
        '</div>' : '') +

      '<div class="card card--warn">' +
        '<b>Why the two numbers</b>' +
        '<p>Spot is the world price — the ceiling. A yard buys under it because they sort it, ' +
        'cart it and on-sell it, and because they can. Knowing both means you can tell a fair ' +
        'offer from a rubbish one instead of guessing.</p>' +
      '</div>';
  }

  function wireTally() {
    var addBtn = $('#tallyAdd');
    if (addBtn) addBtn.addEventListener('click', function () {
      openSheet('Weigh something in',
        '<label class="field"><span>What is it</span><select class="input" id="tlMetal">' +
          TL.metals().map(function (m) {
            return '<option value="' + m.id + '">' + m.icon + ' ' + esc(m.label) + '</option>';
          }).join('') +
        '</select></label>' +
        '<label class="field"><span>Kilos on the scales</span>' +
          '<input class="input" id="tlKg" type="number" inputmode="decimal" step="0.1" min="0" ' +
          'placeholder="0.0"></label>' +
        '<label class="field"><span>Note (optional)</span>' +
          '<input class="input" id="tlNote" type="text" placeholder="Off the Smiths job"></label>' +
        '<div id="tlGrades" class="muted small"></div>' +
        '<button class="btn btn--primary" id="tlSave">Add to the pile</button>');

      function grades() {
        var m = TL.metals().filter(function (x) { return x.id === $('#tlMetal').value; })[0];
        $('#tlGrades').textContent = m ? m.grades : '';
      }
      $('#tlMetal').addEventListener('change', grades);
      grades();

      $('#tlSave').addEventListener('click', function () {
        var kg = parseFloat($('#tlKg').value);
        if (!(kg > 0)) { toast('How many kilos?', 'warn'); return; }
        TL.add($('#tlMetal').value, kg, $('#tlNote').value);
        J.sound('xp'); J.haptic('tap');
        closeSheet();
        renderKit('tally');
      });
    });

    var tripBtn = $('#tallyTrip');
    if (tripBtn) tripBtn.addEventListener('click', function () {
      openSheet('Log a run',
        '<p class="muted small">A drive out to pick something up is a cost against the load, ' +
        'whether it feels like one or not. Log it and the ledger shows what you actually made.</p>' +
        '<label class="field"><span>Kilometres</span>' +
          '<input class="input" id="tlKm" type="number" inputmode="decimal" step="1" min="0" ' +
          'placeholder="0"></label>' +
        '<label class="field"><span>Litres of fuel (optional)</span>' +
          '<input class="input" id="tlLitres" type="number" inputmode="decimal" step="0.1" min="0"></label>' +
        '<label class="field"><span>Price per litre (optional)</span>' +
          '<input class="input" id="tlFuel" type="number" inputmode="decimal" step="0.01" min="0" ' +
          'placeholder="1.85"></label>' +
        '<p class="muted small">Leave the fuel blank and it estimates at about 22 cents a ' +
        'kilometre for a ute, which covers fuel and a bit of the wear.</p>' +
        '<button class="btn btn--primary" id="tlTripSave">Add the run</button>');

      $('#tlTripSave').addEventListener('click', function () {
        var km = parseFloat($('#tlKm').value);
        if (!(km > 0)) { toast('How far did you go?', 'warn'); return; }
        TL.addTrip(km, $('#tlLitres').value, $('#tlFuel').value);
        J.sound('tap');
        closeSheet();
        renderKit('tally');
      });
    });

    var sellBtn = $('#tallySell');
    if (sellBtn) sellBtn.addEventListener('click', function () {
      var v = TL.valuePile();
      openSheet('Mark it sold',
        '<p class="muted small">What did they actually hand you? Recording it against what it ' +
        'was worth is how you find out which yards are straight with you.</p>' +
        (v.total.spot ? '<p>Expected: <b>' + money(v.total.yardLow) + '–' +
          money(v.total.yardHigh) + '</b></p>' : '') +
        '<label class="field"><span>Paid</span>' +
          '<input class="input" id="tlPaid" type="number" inputmode="decimal" step="0.01" min="0" ' +
          'placeholder="0.00"></label>' +
        '<label class="field"><span>Which yard (optional)</span>' +
          '<input class="input" id="tlWhere" type="text"></label>' +
        '<button class="btn btn--primary" id="tlSold">Bank it</button>');

      $('#tlSold').addEventListener('click', function () {
        var paid = parseFloat($('#tlPaid').value);
        if (!(paid >= 0)) { toast('What did they pay?', 'warn'); return; }
        var load = TL.sell(paid, $('#tlWhere').value);
        closeSheet();
        renderKit('tally');
        if (load && load.spot) {
          var pct = Math.round((load.paid / load.spot) * 100);
          J.sound('complete'); J.burst(window.innerWidth / 2, 240, 30, 1.1);
          toast('Banked. That is ' + pct + '% of spot.', 'xp');
        }
      });
    });
  }

  /* How many of a pre-flight section are ticked right now. */
  function checkTally(sec) {
    var checked = P.checklistState();
    var done = 0;
    sec.items.forEach(function (_, i) { if (checked[sec.id + ':' + i]) done++; });
    return { done: done, total: sec.items.length };
  }

  function checkTotals() {
    var t = { done: 0, total: 0 };
    R.preflight.forEach(function (sec) {
      var c = checkTally(sec);
      t.done += c.done; t.total += c.total;
    });
    return t;
  }

  function kitChecklist() {
    var t = checkTotals();
    return '<p class="page-sub">Run this before the helmet comes down. It resets itself each day.</p>' +
      '<div class="check-progress"><span id="checkCount">' + t.done + ' of ' + t.total + '</span> ticked' +
      '<button class="btn btn--ghost btn--sm" id="checkReset">Reset</button></div>' +
      tiles(R.preflight.map(function (sec, i) {
        var c = checkTally(sec);
        return { key: 'check:' + i, icon: c.done === c.total ? '✅' : sec.icon, title: sec.title,
                 sub: c.done + ' of ' + c.total + ' ticked' };
      }));
  }

  /* One pre-flight section. Ticking inside the sheet writes straight through,
     so closing it is never "losing" anything. */
  function openCheckSheet(i) {
    var sec = R.preflight[i];
    if (!sec) return;
    var checked = P.checklistState();
    var el = openSheet(sec.icon + ' ' + sec.title,
      sec.items.map(function (item, n) {
        var key = sec.id + ':' + n;
        var on = !!checked[key];
        return '<label class="check' + (on ? ' is-on' : '') + '">' +
          '<input type="checkbox" data-check="' + key + '"' + (on ? ' checked' : '') + '>' +
          '<span class="clue-box"></span><span>' + esc(item) + '</span>' +
        '</label>';
      }).join(''));

    el.addEventListener('change', function (e) {
      var cb = e.target.closest('[data-check]');
      if (!cb) return;
      P.toggleChecklist(cb.getAttribute('data-check'), cb.checked);
      cb.closest('.check').classList.toggle('is-on', cb.checked);
      tap();
      var t = checkTotals();
      var count = $('#checkCount');
      if (count) count.textContent = t.done + ' of ' + t.total;
      // Keep the tile behind the sheet honest while she works.
      var tile = document.querySelector('[data-tile="check:' + i + '"]');
      if (tile) {
        var c = checkTally(sec);
        tile.querySelector('.tile-s').textContent = c.done + ' of ' + c.total + ' ticked';
        tile.querySelector('.tile-ico').textContent = c.done === c.total ? '✅' : sec.icon;
      }
      if (t.done === t.total) {
        J.shower(50); J.sound('complete'); J.haptic('badge');
        toast('Whole list ticked. Go and weld. 🔥', 'xp');
      }
    });
  }

  function wireChecklist() {
    $('#checkReset').addEventListener('click', function () {
      P.resetChecklist();
      renderKit('checklist');
    });
  }

  function kitSheets() {
    return '<p class="page-sub">Starting points, not gospel. Set the machine here, run a test bead on scrap, then trust your eyes and ears.</p>' +
      tiles(R.cheatsheets.map(function (s, i) {
        return { key: 'cheat:' + i, icon: s.icon, title: s.title,
                 sub: s.rows.length + ' settings' };
      }));
  }

  /* One cheat sheet, opened from its tile. The table scrolls inside the sheet
     rather than pushing the page sideways. */
  function openCheatSheet(i) {
    var s = R.cheatsheets[i];
    if (!s) return;
    openSheet(s.icon + ' ' + s.title,
      '<p class="sheet-note">' + esc(s.note) + '</p>' +
      '<div class="table-wrap"><table>' +
        '<thead><tr>' + s.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead>' +
        '<tbody>' + s.rows.map(function (r) {
          return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
        }).join('') + '</tbody>' +
      '</table></div>' +
      '<ul class="sheet-extras">' + s.extras.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>');
  }

  function kitLog() {
    var entries = P.state.log;
    var list = entries.length
      ? entries.map(function (e) {
          var d = new Date(e.ts);
          return '<div class="card card--log">' +
            (e.photo ? '<img class="log-photo" src="' + e.photo + '" alt="Weld photo">' : '') +
            '<div class="log-body">' +
              '<div class="log-date">' + d.toLocaleDateString() + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</div>' +
              (e.diagnosis ? '<div class="log-dx">🩺 ' + esc(e.diagnosis) + '</div>' : '') +
              '<p>' + esc(e.note || '') + '</p>' +
              '<button class="btn btn--ghost btn--sm" data-del="' + e.id + '">Delete</button>' +
            '</div>' +
          '</div>';
        }).join('')
      : '<p class="muted">Nothing logged yet. Photograph your welds — the good ones and the ugly ones. In six months this is the most convincing thing you own.</p>';

    return '<p class="page-sub">Your own record. Stays on this phone.</p>' +
      '<div class="card card--logform">' +
        '<label class="file-btn">' +
          '<input type="file" accept="image/*" capture="environment" id="logPhoto">' +
          '<span>📷 Take or choose a photo</span>' +
        '</label>' +
        '<img id="logPreview" class="log-preview' + (pendingLogPhoto ? '' : ' hidden') + '" ' +
          (pendingLogPhoto ? 'src="' + pendingLogPhoto + '" ' : '') + 'alt="Preview">' +
        '<input class="input" id="logDx" type="text" maxlength="80" placeholder="What is it? (optional)" value="' + esc(pendingLogDiagnosis) + '">' +
        '<textarea class="input" id="logNote" rows="3" maxlength="600" placeholder="Process, settings, what you were trying, what happened..."></textarea>' +
        '<button class="btn btn--primary" id="logSave">Save to log</button>' +
      '</div>' +
      '<h2 class="section-h">' + entries.length + ' entr' + (entries.length === 1 ? 'y' : 'ies') + '</h2>' + list;
  }

  // Shrink to 1000 px and re-encode so a few photos don't fill localStorage.
  function shrinkImage(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 1000;
        var scale = Math.min(1, max / Math.max(img.width, img.height));
        var w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        try { cb(canvas.toDataURL('image/jpeg', 0.7)); } catch (e) { cb(null); }
      };
      img.onerror = function () { cb(null); };
      img.src = reader.result;
    };
    reader.onerror = function () { cb(null); };
    reader.readAsDataURL(file);
  }

  function wireLog() {
    var photoData = pendingLogPhoto;
    var input = $('#logPhoto');
    var preview = $('#logPreview');

    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      shrinkImage(file, function (data) {
        if (!data) { toast('Could not read that image.', 'warn'); return; }
        photoData = data;
        preview.src = data;
        preview.classList.remove('hidden');
      });
    });

    $('#logSave').addEventListener('click', function (e) {
      var note = $('#logNote').value.trim();
      var dx = $('#logDx').value.trim();
      if (!note && !photoData && !dx) {
        toast('Add a photo or a note first.', 'warn');
        return;
      }
      var res = P.addLogEntry({ note: note, diagnosis: dx, photo: photoData });
      if (!res.ok) {
        toast('Storage is full on this device — delete an old entry with a photo and try again.', 'warn');
        return;
      }
      pendingLogDiagnosis = '';
      pendingLogPhoto = null;
      announce(res, { from: e.currentTarget });
      renderKit('log');
      scrollTop();
    });

    $('#kitBody').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-del]');
      if (!btn) return;
      if (!confirm('Delete this log entry?')) return;
      P.deleteLogEntry(btn.getAttribute('data-del'));
      renderKit('log');
    });
  }

  /* ============================ drive mode ==============================
   * Big, glanceable, three controls. Nothing on this screen needs reading at
   * 100 km/h — the point is that she does not look at it at all.
   * ====================================================================== */

  function driveUnitPicker() {
    var last = DR.saved();
    var lastMod = last && moduleById(last.module);
    return '<a class="back" href="#/home">‹ Back</a>' +
      '<h1 class="page-h">🚗 Drive Mode</h1>' +
      '<p class="page-sub">A whole unit read out end to end, like a podcast. ' +
      'Plug into the stereo, put the phone down, and the drive counts as study. ' +
      'The wheel buttons work: skip is the next lesson.</p>' +
      (lastMod ? '<a class="continue" href="#/drive/' + lastMod.id + '">' +
          '<div class="continue-shine"></div>' +
          '<div class="continue-kicker">Pick up where you stopped</div>' +
          '<div class="continue-title">' + esc(lastMod.title) + '</div>' +
          '<div class="continue-foot"><span>' + lastMod.icon + ' Part way through</span>' +
            '<span class="continue-go">Resume →</span></div>' +
        '</a>' : '') +
      '<h2 class="section-h">Pick a unit</h2>' +
      tiles(C.modules.filter(function (m) { return P.moduleUnlocked(m.id); }).map(function (m) {
        var mins = Math.max(1, Math.round(WA_SCRIPT.seconds(WA_SCRIPT.unit(m)) / 60));
        return { key: 'drive:' + m.id, icon: m.icon, title: m.title,
                 sub: m.lessons.length + ' lessons · about ' + mins + ' min' };
      })) +
      '<div class="card card--warn">' +
        '<b>Before you set off</b>' +
        '<p>Start it while you are parked, then leave it alone. Speech with the screen off is ' +
        'unreliable on some Android versions — the app holds the screen awake to work around it, ' +
        'so plug the phone in. And it is talk, not a test: nothing here needs you to look.</p>' +
      '</div>';
  }

  function renderDrive(moduleId) {
    renderTabs('');
    if (!DR.supported()) {
      view.innerHTML = '<a class="back" href="#/home">‹ Back</a>' +
        '<h1 class="page-h">🚗 Drive Mode</h1>' +
        '<div class="card"><p>This phone\'s browser cannot read out loud, so Drive Mode has ' +
        'nothing to play. Everything else still works.</p></div>';
      return;
    }
    if (!moduleId) { view.innerHTML = driveUnitPicker(); wireDriveTiles(); return; }

    var m = moduleById(moduleId);
    if (!m) return go('#/drive');

    DR.build(m);
    var last = DR.saved();
    if (last && last.module === m.id) DR.resumeAt(last.at);

    // Listening all the way through a lesson counts like reading it.
    DR.setCreditHandler(function (res) { announce(res); });

    view.innerHTML =
      '<div class="drive">' +
        '<a class="back" href="#/drive">‹ Units</a>' +
        '<div class="drive-unit" id="drUnit"></div>' +
        '<div class="drive-lesson" id="drLesson"></div>' +
        '<div class="drive-track"><span id="drBar"></span></div>' +
        '<div class="drive-times" id="drTimes"></div>' +
        '<div class="drive-controls">' +
          '<button class="drive-btn" id="drPrev" aria-label="Previous lesson">⏮</button>' +
          '<button class="drive-btn drive-btn--go" id="drPlay" aria-label="Play or pause">▶</button>' +
          '<button class="drive-btn" id="drNext" aria-label="Next lesson">⏭</button>' +
        '</div>' +
        '<div class="drive-now" id="drNow"></div>' +
        '<p class="drive-fine">Keep the phone plugged in. Skip on the wheel jumps a lesson.</p>' +
      '</div>';

    function paint(p) {
      var unit = $('#drUnit');
      if (!unit) { DR.offChange(paint); return; }      // she has navigated away
      unit.textContent = p.unit;
      // The unit intro plays before lesson one, so it has no lesson number.
      $('#drLesson').textContent = p.lessonNumber
        ? 'Lesson ' + p.lessonNumber + ' of ' + p.lessonCount + ' · ' + p.lessonTitle
        : 'Starting up…';
      $('#drBar').style.width = p.percent + '%';
      $('#drTimes').textContent = p.intoLesson + ' in · ' + p.lessonLeft +
        ' left in this one · ' + p.unitLeft + ' left in the unit';
      $('#drPlay').textContent = p.playing ? '❚❚' : '▶';
      $('#drNow').textContent = p.line;
      $('#drNow').classList.toggle('is-live', p.playing);
    }

    DR.onChange(paint);
    paint(DR.position());

    $('#drPlay').addEventListener('click', function () { tap(); DR.toggle(); });
    $('#drNext').addEventListener('click', function () { tap(); DR.nextLesson(); });
    $('#drPrev').addEventListener('click', function () { tap(); DR.prevLesson(); });
  }

  function wireDriveTiles() {
    view.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-tile^="drive:"]');
      if (!btn) return;
      go('#/drive/' + btn.getAttribute('data-tile').split(':')[1]);
    });
  }

  /* A note from Mick, full screen, until she closes it. It is deliberately not
     a sheet, not spoken by the narrator, and not recorded in progress — it
     leaves no trace once closed. */
  function openHiddenNote() {
    if ($('.note')) return;
    var n = PERSONAL.note();
    var el = document.createElement('div');
    el.className = 'note';
    el.innerHTML =
      '<div class="note-inner">' +
        n.lines.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') +
        '<div class="note-sign">' + esc(n.signoff) + '</div>' +
        '<button class="btn btn--ghost btn--sm note-x">Close</button>' +
      '</div>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    J.haptic('badge');
    J.burst(window.innerWidth / 2, window.innerHeight / 2, 26, 1);

    function close() {
      el.classList.remove('is-in');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
    }
    el.querySelector('.note-x').addEventListener('click', close);
    el.addEventListener('click', function (e) { if (e.target === el) close(); });
  }

  /* =========================== the collection ===========================
   * A collection layer, not a game engine — it reuses the celebration that
   * already exists rather than building a match-3 loop, and says so plainly
   * on the page so nobody is expecting Candy Crush.
   * ===================================================================== */

  function renderDolls() {
    renderTabs('');
    var p = DL.progress();
    var next = DL.nextUp();

    view.innerHTML =
      '<a class="back" href="#/home">‹ Back</a>' +
      '<h1 class="page-h">🪆 The collection</h1>' +
      '<p class="page-sub">' + p.have + ' of ' + p.total + '. They nest biggest to smallest, ' +
      'so the set fills inward — and the little one is the hard one.</p>' +

      '<div class="dolls">' +
        DL.dolls.map(function (d) {
          var have = DL.has(d.id);
          return '<button class="doll-cell' + (have ? '' : ' is-locked') + '" data-doll="' + d.id + '">' +
            DL.svg(d, { width: 84, locked: !have }) +
            '<span class="doll-name">' + (have ? esc(d.name) : '???') + '</span>' +
          '</button>';
        }).join('') +
      '</div>' +

      (next ? '<div class="card"><h3>Next one</h3>' +
        '<p>' + esc(next.hint) + '.</p></div>'
            : '<div class="card"><h3>That is the lot</h3>' +
              '<p>Every doll in the set. There is nothing else hiding.</p></div>') +

      '<div class="card card--warn">' +
        '<b>What this is</b>' +
        '<p>A set to collect, not a game to play — they unlock as you get through the course ' +
        'and turn up at the bench. If you were expecting something to tap at, that is not what ' +
        'this is, and saying so beats letting you find out.</p>' +
      '</div>';

    $('.dolls').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-doll]');
      if (!btn) return;
      var d = DL.byId(btn.getAttribute('data-doll'));
      if (!d) return;
      var have = DL.has(d.id);
      tap();
      openSheet(have ? d.name : 'Not yet',
        '<div class="doll-big">' + DL.svg(d, { width: 150, locked: !have, suffix: 'big' }) + '</div>' +
        (have
          ? '<p>Number ' + d.size + ' of ' + DL.dolls.length + ' in the set.</p>' +
            '<p class="muted">Earned for: ' + esc(d.hint.toLowerCase()) + '.</p>'
          : '<p>Still hidden. You get this one for: <b>' + esc(d.hint.toLowerCase()) + '</b>.</p>'));
    });
  }

  /* ====================== where this comes from =========================
   * The answer to "how do I know any of this is right" is not an argument.
   * It is a list of links she can tap and check herself.
   * ===================================================================== */

  function renderSources() {
    renderTabs('');
    var S = window.WA_SOURCES;

    view.innerHTML =
      '<a class="back" href="#/home">‹ Back</a>' +
      '<h1 class="page-h">Where this comes from</h1>' +
      '<p class="page-sub">Every claim in here is built on something published. These are the ' +
      'actual sources — tap any of them and check it yourself.</p>' +

      S.kinds().map(function (k) {
        var list = S.sources.filter(function (s) { return s.kind === k.id; });
        if (!list.length) return '';
        return '<h2 class="section-h">' + k.icon + ' ' + k.label + '</h2>' +
          list.map(function (s) {
            return '<a class="src" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
              '<div class="src-title">' + esc(s.title) + '</div>' +
              '<div class="src-what">' + esc(s.what) + '</div>' +
              '<div class="src-foot"><span class="src-where">' + esc(s.where) + '</span>' +
                '<span class="src-go">Open ↗</span></div>' +
            '</a>';
          }).join('');
      }).join('') +

      '<h2 class="section-h">⚖️ Where this app is estimating</h2>' +
      '<p class="page-sub small">Not everything here has a standard behind it. These are ' +
      'experience and arithmetic, and saying so is what keeps the rest of the page worth ' +
      'anything.</p>' +
      S.estimates.map(function (e) {
        return '<div class="card"><h3>' + esc(e.what) + '</h3><p>' + esc(e.why) + '</p></div>';
      }).join('') +

      '<h2 class="section-h">📄 What this is</h2>' +
      '<div class="card">' +
        S.statement.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
        '<a class="btn btn--primary" href="#/ticket">The path to an actual ticket →</a>' +
      '</div>';
  }

  /* ======================= the path to a ticket ==========================
   * She will not get certified by an app, and the app says so. But
   * recognition of prior learning is real, and the evidence for it is
   * exactly what she has been quietly collecting all along.
   * ===================================================================== */

  function renderTicketPath() {
    renderTabs('');
    var log = P.state.log || [];
    var withPhotos = log.filter(function (e) { return !!e.photo; });
    var drills = P.drillCount();
    var mods = C.modules.filter(function (m) { return m.tier !== 'advanced'; });
    var doneMods = mods.filter(function (m) { return P.moduleComplete(m.id); });

    view.innerHTML =
      '<a class="back" href="#/home">‹ Back</a>' +
      '<h1 class="page-h">🎓 Getting the actual ticket</h1>' +
      '<p class="page-sub">This app does not certify you and never will. But it is not a ' +
      'dead end either — here is the honest route from here to paper.</p>' +

      '<div class="card">' +
        '<h3>What recognition of prior learning is</h3>' +
        '<p>RPL means a registered training organisation assesses skills you already have ' +
        'instead of making you sit through teaching you do not need. It is a normal, funded ' +
        'part of the system, not a loophole. You turn up, you show what you can do and what ' +
        'you know, and they credit the units you can already evidence.</p>' +
        '<p>It matters here because the gap between "knows the theory cold and has done the ' +
        'drills" and "holds a certificate" is much smaller than the gap between knowing ' +
        'nothing and holding one.</p>' +
      '</div>' +

      '<h2 class="section-h">What you have got so far</h2>' +
      '<div class="card card--portfolio">' +
        '<div class="port-row"><span>Units finished</span><b>' + doneMods.length + ' of ' + mods.length + '</b></div>' +
        '<div class="port-row"><span>Bench drills done</span><b>' + drills + '</b></div>' +
        '<div class="port-row"><span>Weld log entries</span><b>' + log.length + '</b></div>' +
        '<div class="port-row"><span>With dated photos</span><b>' + withPhotos.length + '</b></div>' +
        '<div class="port-row"><span>Badges earned</span><b>' + P.state.badges.length + '</b></div>' +
        (log.length
          ? '<a class="btn btn--ghost btn--sm" href="#/kit/log">Open the log</a>'
          : '<p class="muted small">The weld log is the bit that counts most and it is empty. ' +
            'Photograph what you weld, dated, from now on — that is the evidence.</p>') +
      '</div>' +

      '<div class="card">' +
        '<h3>What an assessor actually wants to see</h3>' +
        '<p>Not a certificate from an app. Evidence that you can do the work:</p>' +
        '<ul>' +
          '<li><b>Dated photographs of your own welds</b>, ideally showing progression over ' +
          'months rather than one good day. This is what the weld log is for.</li>' +
          '<li><b>Cut-and-etched coupons and bend tests</b> — a weld cut through, polished and ' +
          'etched shows penetration and fusion in a way a photo of the surface cannot.</li>' +
          '<li><b>A record of what you have practised</b>, which is what the drill log is.</li>' +
          '<li><b>Any workplace or supervisor statements</b> you can get, if you have welded ' +
          'for anyone.</li>' +
          '<li><b>Knowledge</b>, which they will test by asking. That is the part this app is ' +
          'genuinely good at.</li>' +
        '</ul>' +
      '</div>' +

      '<div class="card">' +
        '<h3>The realistic shape of it</h3>' +
        '<p>Keep learning in the ute and at the bench. Do the drills, photograph them, and ' +
        'keep the coupons. When the log has months in it, ring a few RTOs and ask what they ' +
        'would credit through RPL and what gap training they would want.</p>' +
        '<p>Most likely it is a small number of gap units and a coded test on a real coupon — ' +
        'months rather than years, and you walk in already knowing the job instead of learning ' +
        'it in front of an assessor.</p>' +
        '<p class="muted small">No promises on time or cost: both depend entirely on the RTO ' +
        'and your state, and anyone who quotes you a number without seeing your evidence is ' +
        'guessing.</p>' +
      '</div>' +

      '<div class="card">' +
        '<h3>Where to look</h3>' +
        '<p>The national register lists every RTO and exactly what each qualification requires.</p>' +
        '<a class="btn btn--primary" href="https://training.gov.au/Training/Details/MEM31420" ' +
          'target="_blank" rel="noopener noreferrer">MEM31420 Certificate III ↗</a>' +
        '<a class="btn btn--ghost btn--sm" href="#/sources">All the sources →</a>' +
      '</div>';
  }

  /* ============================ settings ================================ */

  function renderSettings() {
    renderTabs('');
    var c = V.config();
    var provider = c.provider || 'off';

    view.innerHTML =
      '<a class="back" href="#/home">‹ Back</a>' +
      '<h1 class="page-h">Settings</h1>' +

      '<div class="card">' +
        '<h3>🎨 How this teaches you</h3>' +
        '<p class="muted small">Your answers set the colours, which lesson mode opens first, how much Old Mate says, and what the home screen leads with. Change your mind whenever you like.</p>' +
        '<div class="theme-row" id="themeRow">' +
          Object.keys(PF.THEMES).map(function (k) {
            var t = PF.THEMES[k];
            return '<button class="theme-dot' + (PF.derive().theme === k ? ' is-on' : '') + '" data-theme="' + k + '" ' +
              'title="' + esc(t.name) + '" aria-label="' + esc(t.name) + '" ' +
              'style="background:linear-gradient(135deg,' + t.accent2 + ',' + t.accent + ')"></button>';
          }).join('') +
        '</div>' +
        '<button class="btn btn--ghost btn--sm" id="retakeQ">Retake the questions</button>' +
      '</div>' +

      '<div class="card">' +
        '<h3>Sound &amp; feel</h3>' +
        '<label class="switch"><input type="checkbox" id="soundToggle"' + (J.soundEnabled() ? ' checked' : '') + '>' +
          '<span class="switch-track"><i></i></span><span>Sound effects</span></label>' +
        '<p class="muted small">Haptics follow your phone\'s own vibration setting.</p>' +
      '</div>' +

      (N.supported() ? '<div class="card">' +
        '<h3>🔊 Read it to me</h3>' +
        '<p class="muted small">Every lesson has a play button. It uses your phone\'s own voice, so it keeps working with no signal — good for studying in the ute.</p>' +
        '<div class="persona-row" id="personaRow">' +
          N.personas().map(function (p) {
            return '<button class="persona' + (N.currentPersona().id === p.id ? ' is-on' : '') + '" data-persona="' + p.id + '">' +
              '<b>' + esc(p.name) + '</b><i>' + esc(p.blurb) + '</i></button>';
          }).join('') +
        '</div>' +
        '<p class="muted small">Your phone decides how many voices it has, so these pick the closest match it can find. Override it below if you would rather.</p>' +
        '<label class="field"><span>Voice</span><select class="input" id="voicePick">' +
          '<option value="">Phone default</option>' +
          N.voices().map(function (v) {
            return '<option value="' + esc(v.name) + '"' + (v.name === N.currentVoiceName() ? ' selected' : '') + '>' +
              esc(v.name) + ' (' + esc(v.lang) + ')' + (v.localService ? ' · offline' : '') + '</option>';
          }).join('') +
        '</select></label>' +
        '<label class="field"><span>Speed</span><select class="input" id="ratePick">' +
          [0.8, 1, 1.15, 1.35, 1.6].map(function (r) {
            return '<option value="' + r + '"' + (r === N.getRate() ? ' selected' : '') + '>' + r + '×</option>';
          }).join('') +
        '</select></label>' +
        '<button class="btn btn--ghost btn--sm" id="voiceTest">Hear it</button>' +
      '</div>' : '') +

      '<div class="card">' +
        '<h3>🔄 Sync across devices <span class="pill pill--dim">optional</span></h3>' +
        '<p class="muted small">Off by default — everything already lives on this phone and stays ' +
        'there. If you run the little server that ships with this app (<code>node server</code>, ' +
        'see the README), pick any word as a code and the same code on a second device pulls your ' +
        'progress across. That is the entire account system — no email, no password. Anyone who ' +
        'knows your code could read it too, so pick something nobody would guess, the same as you ' +
        'would a house key hidden under a pot.</p>' +
        '<label class="field"><span>Server address</span>' +
          '<input class="input" id="syncUrl" type="url" value="' + esc(SY.config().url || '') + '" ' +
          'placeholder="http://192.168.1.20:8787"></label>' +
        '<label class="field"><span>Your code</span>' +
          '<input class="input" id="syncCode" type="text" value="' + esc(SY.config().code || '') + '" ' +
          'placeholder="a word only you would pick" autocomplete="off"></label>' +
        '<label class="switch"><input type="checkbox" id="syncAuto"' +
          (SY.config().auto ? ' checked' : '') + '>' +
          '<span class="switch-track"><i></i></span><span>Keep it synced automatically</span></label>' +
        '<div class="tally-actions">' +
          '<button class="btn btn--primary btn--sm" id="syncPush">Push this device’s progress</button>' +
          '<button class="btn btn--ghost btn--sm" id="syncPull">Pull from that code instead</button>' +
        '</div>' +
        '<p class="muted small" id="syncStatus"></p>' +
      '</div>' +

      '<div class="card">' +
        '<h3>💬 Let Old Mate talk properly (optional)</h3>' +
        '<p class="muted small">He already answers from what is in this app, with no signal and ' +
        'without inventing anything — that is the default and it needs nothing set up. Adding a key ' +
        'lets him put the same answers in his own words. He is still only allowed to use what is in ' +
        'here, and if there is no signal he falls straight back to the offline answer.</p>' +
        '<label class="field"><span>Service</span><select class="input" id="chatProvider">' +
          [['off', 'Off — offline answers only'],
           ['anthropic', 'Claude (Anthropic)'],
           ['custom', 'Your own endpoint']].map(function (o) {
            return '<option value="' + o[0] + '"' +
              (WA_ASK.config().provider === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
          }).join('') +
        '</select></label>' +
        '<div id="chatFields"></div>' +
        (SY.config().url ? '<button class="btn btn--ghost btn--sm" id="chatUseSync">' +
          'Use my sync server instead of a key</button>' : '') +
      '</div>' +

      (installPrompt ? '<div class="card card--install">' +
        '<h3>📲 Install on this device</h3>' +
        '<p class="muted">Adds it to your home screen and lets it run full screen, offline, like any other app.</p>' +
        '<button class="btn btn--primary" id="installBtn">Install Weld Academy</button>' +
      '</div>' : '') +

      '<div class="card">' +
        '<h3>📸 Camera scan <span class="pill pill--dim">optional</span></h3>' +
        '<p class="muted small">Off by default, and the app is complete without it. Turn it on and Old Mate gets a camera button: a model looks at the photo and ticks the symptoms it spots, then Old Mate still does the naming and the fix.</p>' +
        '<label class="field"><span>Provider</span>' +
          '<select class="input" id="visProvider">' +
            [['off', 'Off'], ['hfapi', 'Hugging Face Inference API'], ['space', 'Hosted Space / server'], ['custom', 'Custom endpoint']]
              .map(function (o) {
                return '<option value="' + o[0] + '"' + (provider === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
              }).join('') +
          '</select>' +
        '</label>' +
        '<div id="visFields"></div>' +
        '<button class="btn btn--primary" id="visSave">Save</button>' +
        '<p class="muted small" id="visHelp"></p>' +
      '</div>' +

      '<div class="card">' +
        '<h3>Your progress</h3>' +
        '<p class="muted small">' + P.state.xp + ' XP · ' + P.state.badges.length + ' badges · ' +
          Object.keys(P.state.lessons).length + ' lessons read · ' + P.drillCount() + ' drills · ' +
          P.state.log.length + ' log entries. All of it lives in this browser only.</p>' +
        '<button class="btn btn--ghost btn--sm" id="resetBtn">Reset everything</button>' +
      '</div>';

    $('#soundToggle').addEventListener('change', function (e) {
      J.setSound(e.target.checked);
      if (e.target.checked) J.sound('badge');
    });

    // Colours change under her thumb, without leaving the page.
    $('#themeRow').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-theme]');
      if (!btn) return;
      var ans = PF.answers() || {};
      ans.colour = btn.getAttribute('data-theme');
      PF.save(ans);
      J.sound('tap');
      J.haptic('tap');
      J.burstFrom(btn, 18, 0.9);
      $('#themeRow').querySelectorAll('.theme-dot').forEach(function (b) {
        b.classList.toggle('is-on', b === btn);
      });
    });

    $('#retakeQ').addEventListener('click', function () {
      if (!confirm('Run through the eight questions again? Your progress, badges and log are not touched.')) return;
      P.setSetting('profile', null);
      go('#/home');
      render();
    });

    /* The chat key fields: nothing shown at all while it is off, so there is
       no half-finished AI panel sitting there looking broken. */
    function paintChat() {
      var c = WA_ASK.config();
      var host = $('#chatFields');
      if (!host) return;
      if (!c.provider || c.provider === 'off') { host.innerHTML = ''; return; }
      host.innerHTML =
        (c.provider === 'custom'
          ? '<label class="field"><span>Endpoint URL</span>' +
            '<input class="input" id="chatUrl" type="url" value="' + esc(c.url || '') + '" ' +
            'placeholder="https://…"></label>'
          : '') +
        '<label class="field"><span>Key</span>' +
          '<input class="input" id="chatKey" type="password" value="' + esc(c.key || '') + '" ' +
          'placeholder="Paste it here" autocomplete="off"></label>' +
        '<label class="field"><span>Model (optional)</span>' +
          '<input class="input" id="chatModel" type="text" value="' + esc(c.model || '') + '" ' +
          'placeholder="Leave blank for the default"></label>' +
        '<p class="muted small">The key is stored on this phone only, and is sent to that service ' +
        'and nowhere else.</p>';

      ['chatUrl', 'chatKey', 'chatModel'].forEach(function (id) {
        var el = $('#' + id);
        if (!el) return;
        el.addEventListener('change', function () {
          var cfg = WA_ASK.config();
          cfg[id.replace('chat', '').toLowerCase()] = el.value.trim();
          WA_ASK.save(cfg);
        });
      });
    }

    $('#chatProvider').addEventListener('change', function (e) {
      var cfg = WA_ASK.config();
      cfg.provider = e.target.value;
      WA_ASK.save(cfg);
      paintChat();
    });
    paintChat();

    var useSyncBtn = $('#chatUseSync');
    if (useSyncBtn) useSyncBtn.addEventListener('click', function () {
      var cfg = WA_ASK.config();
      cfg.provider = 'custom';
      cfg.url = SY.config().url.replace(/\/+$/, '') + '/api/ask';
      WA_ASK.save(cfg);
      $('#chatProvider').value = 'custom';
      paintChat();
      toast('Pointed at your sync server. It needs ANTHROPIC_API_KEY set there.', 'xp');
    });

    /* ---- sync ---- */

    ['syncUrl', 'syncCode'].forEach(function (id) {
      var el = $('#' + id);
      el.addEventListener('change', function () {
        var cfg = SY.config();
        cfg[id === 'syncUrl' ? 'url' : 'code'] = el.value.trim();
        SY.save(cfg);
      });
    });
    $('#syncAuto').addEventListener('change', function (e) {
      var cfg = SY.config();
      cfg.auto = e.target.checked;
      SY.save(cfg);
    });

    function syncStatus(msg) { var el = $('#syncStatus'); if (el) el.textContent = msg; }

    $('#syncPush').addEventListener('click', function () {
      if (!SY.isConfigured()) { toast('Fill in the server address and a code first.', 'warn'); return; }
      syncStatus('Pushing…');
      SY.push().then(function (r) {
        syncStatus(r.ok
          ? (r.reason === 'unchanged' ? 'Already up to date.' : 'Pushed just now.')
          : 'Could not push: ' + r.reason);
        if (r.ok) { J.sound('xp'); J.haptic('tap'); }
      });
    });

    $('#syncPull').addEventListener('click', function () {
      if (!SY.isConfigured()) { toast('Fill in the server address and a code first.', 'warn'); return; }
      if (!confirm('This replaces everything on THIS device with whatever is saved under that code. Sure?')) return;
      syncStatus('Pulling…');
      SY.pullAndApply().then(function (r) {
        if (r.ok) {
          syncStatus('Pulled. Reloading…');
          setTimeout(function () { location.reload(); }, 500);
        } else {
          syncStatus('Could not pull: ' + r.reason);
        }
      });
    });

    var personaRow = $('#personaRow');
    if (personaRow) {
      personaRow.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-persona]');
        if (!btn) return;
        N.setPersona(btn.getAttribute('data-persona'));
        tap();
        personaRow.querySelectorAll('.persona').forEach(function (b) {
          b.classList.toggle('is-on', b === btn);
        });
        // Let her hear the difference straight away — that is the whole point.
        N.setScript([{ textContent: WA_SCRIPT.forSpeech(
          'Right. Hold the arc about one electrode diameter off the work, and keep it moving.') }]);
        N.play(0);
      });
    }

    var voicePick = $('#voicePick');
    if (voicePick) {
      voicePick.addEventListener('change', function (e) { N.setVoiceByName(e.target.value); });
      $('#ratePick').addEventListener('change', function (e) { N.setRate(parseFloat(e.target.value)); });
      $('#voiceTest').addEventListener('click', function () {
        N.setScript([{ textContent: 'Hold the arc about one electrode diameter off the work. Too long and you get spatter, a wandering arc, and porosity.' }]);
        N.play(0);
      });
    }

    var installBtn = $('#installBtn');
    if (installBtn) {
      installBtn.addEventListener('click', function () {
        installPrompt.prompt();
        installPrompt.userChoice.then(function () { installPrompt = null; renderSettings(); });
      });
    }

    function visFields() {
      var p = $('#visProvider').value;
      var host = $('#visFields');
      var help = $('#visHelp');
      if (p === 'off') {
        host.innerHTML = '';
        help.innerHTML = 'Nothing is sent anywhere while this is off.';
        return;
      }
      if (p === 'hfapi') {
        host.innerHTML =
          '<label class="field"><span>Model id</span><input class="input" id="visModel" type="text" ' +
            'placeholder="owner/model-name" value="' + esc(c.model || '') + '"></label>' +
          '<label class="field"><span>Access token</span><input class="input" id="visToken" type="password" ' +
            'placeholder="hf_..." value="' + esc(c.token || '') + '"></label>';
        help.innerHTML = 'An image-classification or object-detection model. The free open weld models are coarse ' +
          '(good weld / bad weld / defect) — good enough to spot and localise, which is all Old Mate needs from it. ' +
          'Photos are sent to Hugging Face when you press scan, so it needs signal.';
        return;
      }
      host.innerHTML =
        '<label class="field"><span>Endpoint URL</span><input class="input" id="visEndpoint" type="url" ' +
          'placeholder="https://..." value="' + esc(c.endpoint || '') + '"></label>' +
        '<label class="field"><span>Token (optional)</span><input class="input" id="visToken" type="password" ' +
          'value="' + esc(c.token || '') + '"></label>';
      help.innerHTML = 'Your endpoint receives <code>POST { "image": "data:image/jpeg;base64,..." }</code> and should ' +
        'reply with <code>[{ "label": "porosity", "score": 0.9 }]</code>. Labels are matched to the Doctor\'s symptom list.';
    }

    $('#visProvider').addEventListener('change', visFields);
    visFields();

    $('#visSave').addEventListener('click', function () {
      var p = $('#visProvider').value;
      var cfg = { provider: p };
      if (p === 'hfapi') {
        cfg.model = ($('#visModel').value || '').trim();
        cfg.token = ($('#visToken').value || '').trim();
      } else if (p !== 'off') {
        cfg.endpoint = ($('#visEndpoint').value || '').trim();
        cfg.token = ($('#visToken').value || '').trim();
      }
      V.save(cfg);
      toast(p === 'off' ? 'Camera scan switched off.' : 'Saved. Old Mate has a camera button now.', 'xp');
      J.sound('correct');
    });

    $('#resetBtn').addEventListener('click', function () {
      if (confirm('Wipe all progress, badges and weld log entries on this device? This cannot be undone.')) {
        P.resetAll();
        shownXp = 0;
        go('#/home');
        render();
      }
    });
  }

  /* ============================ router ================================== */

  function render() {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);

    // No name yet means a first run; a name with no profile means she asked to
    // retake the questions from Settings.
    if (!P.state.name || !PF.isDone()) return renderWelcome();

    header.classList.remove('hidden');
    tabbar.classList.remove('hidden');
    renderHeader();

    switch (parts[0]) {
      case 'course':   renderCourse(); break;
      case 'module':   renderModule(parts[1]); break;
      case 'lesson':   renderLesson(parts[1], parts[2]); break;
      case 'quiz':     renderQuiz(parts[1]); break;
      case 'doctor':   renderDoctor(); break;
      case 'kit':      renderKit(parts[1]); break;
      case 'settings': renderSettings(); break;
      case 'drive':    renderDrive(parts[1]); break;
      case 'sources':  renderSources(); break;
      case 'ticket':   renderTicketPath(); break;
      case 'dolls':    renderDolls(); break;
      default:         renderHome();
    }
  }

  /* ============================ boot ==================================== */

  function boot() {
    view = document.getElementById('view');
    header = document.getElementById('header');
    tabbar = document.getElementById('tabbar');
    toastHost = document.getElementById('toasts');

    P.load();
    shownXp = P.state.xp;
    PF.apply();                    // her colours, before anything paints
    J.init();
    MK.load();
    if (N.supported()) N.loadPrefs();

    var newDay = P.touchDay();
    var badges = P.checkBadges();

    window.addEventListener('hashchange', function () {
      if (autoReadTimer) { clearTimeout(autoReadTimer); autoReadTimer = null; }
      if (N.supported()) N.stop();
      render();
      scrollTop();
    });

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      installPrompt = e;
      // The event usually arrives a beat after first paint, not before it —
      // reveal the banner in place rather than wait for her to navigate
      // back to a screen that would render it fresh.
      var banner = document.getElementById('wInstallBanner');
      if (banner) banner.hidden = false;
    });

    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      navigator.serviceWorker.register('service-worker.js').catch(function () { /* offline still fine */ });
    }

    render();

    if (newDay && P.state.streak.count > 1) {
      setTimeout(function () {
        J.celebrate({
          kind: 'badge',
          icon: '🔥',
          kicker: 'Streak',
          title: P.state.streak.count + ' days running',
          subtitle: 'Turning up is the whole trick. Best run so far: ' + P.state.streak.best + '.',
          button: 'Let\'s go'
        });
      }, 600);
    }

    badges.forEach(function (b) {
      J.celebrate({ kind: 'badge', icon: b.icon, kicker: 'Badge earned', title: b.name, subtitle: b.desc, button: 'Got it' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

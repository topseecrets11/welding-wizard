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

  var view, header, tabbar, toastHost;
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
  }

  function renderTabs(active) {
    var tabs = [
      { id: 'home', href: '#/home', icon: '🗺️', label: 'Map' },
      { id: 'course', href: '#/course', icon: '📚', label: 'Course' },
      { id: 'doctor', href: '#/doctor', icon: '🩺', label: 'Doctor' },
      { id: 'kit', href: '#/kit/checklist', icon: '🧰', label: 'Kit' }
    ];
    tabbar.innerHTML = tabs.map(function (t) {
      return '<a class="tab' + (t.id === active ? ' is-active' : '') + '" href="' + t.href + '">' +
        '<span class="tab-i">' + t.icon + '</span><span class="tab-l">' + t.label + '</span></a>';
    }).join('');
  }

  /* ============================ onboarding ============================== */

  function renderWelcome() {
    tabbar.classList.add('hidden');
    header.classList.add('hidden');
    view.innerHTML =
      '<div class="welcome">' +
        '<div class="welcome-arc">⚡</div>' +
        '<h1>Weld Academy</h1>' +
        '<p class="welcome-sub">Stick, MIG and TIG — taught properly, drilled at the bench, and a shed companion for when it goes wrong.</p>' +
        '<div class="welcome-points">' +
          '<div><span>📚</span><b>Nine modules, 39 lessons.</b> The same knowledge a trade course teaches. Metric, Australian standards.</div>' +
          '<div><span>🔧</span><b>Bench drills.</b> Every lesson has a job to go and do, with pass marks you can judge yourself against.</div>' +
          '<div><span>🩺</span><b>Weld Doctor.</b> Something wrong? Tick what you see — it names it, and tells you how to fix it. Works with no signal.</div>' +
          '<div><span>🎯</span><b>Five ways in.</b> Read it, skim it, see it, do it, or get tested on it. Whatever makes it stick for you.</div>' +
        '</div>' +
        '<label class="welcome-label" for="wname">What should I call you?</label>' +
        '<input id="wname" class="input" type="text" placeholder="Your name" maxlength="24" autocomplete="off">' +
        '<button class="btn btn--primary btn--big" id="wstart">Strike an arc →</button>' +
        '<p class="welcome-fine">Everything stays on this device. No account, no internet needed.</p>' +
      '</div>';

    var input = $('#wname');
    function start() {
      P.setName((input.value || '').trim() || 'Welder');
      header.classList.remove('hidden');
      tabbar.classList.remove('hidden');
      J.sound('level');
      J.burstFrom($('#wstart'), 40, 1.3);
      go('#/home');
      render();
    }
    $('#wstart').addEventListener('click', start);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
    input.focus();
  }

  /* ============================ home / map ============================== */

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

    view.innerHTML =
      '<div class="hero">' +
        '<div class="hero-bg"></div>' +
        '<div class="hero-row">' +
          '<div class="hero-ring">' + ring(overall, 'var(--accent)', 76, 6) +
            '<span class="hero-pct">' + overall + '<i>%</i></span></div>' +
          '<div>' +
            '<div class="hero-hi">G\'day' + (s.name ? ', ' + esc(s.name) : '') + '</div>' +
            '<div class="hero-lvl">' + esc(P.levelTitle()) + ' · Level ' + P.level() + '</div>' +
            '<div class="hero-chips">' +
              '<span class="chip">🔥 ' + s.streak.count + ' day' + (s.streak.count === 1 ? '' : 's') + '</span>' +
              '<span class="chip">🏅 ' + s.badges.length + '/' + R.badges.length + '</span>' +
              '<span class="chip">🔧 ' + P.drillCount() + ' drills</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      continueCard +
      dailyCardHtml() +
      '<h2 class="section-h">The road to a ticket</h2>' +
      '<div class="map">' + mapHtml() + '</div>' +
      '<h2 class="section-h">Badges</h2>' +
      '<div class="badges">' + badgesHtml() + '</div>' +
      '<div class="footer-note">' +
        '<p>Weld Academy teaches the knowledge, not the ticket. When you want the paper, that is TAFE and a coded test on a real coupon — you will walk in already knowing the job.</p>' +
        '<a class="btn btn--ghost btn--sm" href="#/settings">Settings</a>' +
      '</div>';

    wireDaily();
  }

  function mapHtml() {
    return C.modules.map(function (m, i) {
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
      expl.innerHTML = '<b>' + (right ? 'Correct.' : 'Not quite.') + '</b> ' + esc(daily.item.question.explain);
      dc.appendChild(expl);
      announce(res, { from: btn });
    });
  }

  /* ============================ course ================================== */

  function renderCourse() {
    renderTabs('course');
    var tiers = [
      { id: 'core', title: 'Core units', sub: 'Get proficient in each process' },
      { id: 'mastery', title: 'Mastery units', sub: 'Go past competent — the knowledge that separates trades from hobbyists' }
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
      '</a>';
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
    });

    wireLessonBody(m, l, mode);

    $('#doneBtn').addEventListener('click', function (e) {
      var res = P.completeLesson(m.id, l.id);
      announce(res, { from: e.currentTarget });
      var nextHref = isLast ? '#/quiz/' + m.id : '#/lesson/' + m.id + '/' + m.lessons[idx + 1].id;
      setTimeout(function () { go(nextHref); }, res.xp ? 420 : 0);
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
        '<b>' + (right ? '✓ Correct' : '✗ Not quite') + '</b>' +
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
      '<h1 class="page-h">🩺 Weld Doctor</h1>' +
      '<p class="page-sub">Something not right? Tick what you can see, hear or remember. You do not need to know the names — that is my end.</p>' +
      (V.isConfigured() ? cameraCardHtml() : '') +
      '<div id="clueHost">' + cluesHtml + '</div>' +
      '<div class="doctor-actions">' +
        '<button class="btn btn--primary btn--big" id="dxBtn">Diagnose it →</button>' +
        '<button class="btn btn--ghost btn--sm" id="dxClear">Clear all</button>' +
      '</div>' +
      '<div id="dxResults"></div>' +
      (V.isConfigured() ? '' :
        '<p class="footer-note small">Want it to look at a photo and tick these for you? ' +
        '<a href="#/settings">Set up AI weld scan</a> — optional, and the checklist works fine without it.</p>');

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

    if (V.isConfigured()) wireCamera();
  }

  function cameraCardHtml() {
    return '<div class="card card--camera" id="cameraCard">' +
      '<label class="file-btn file-btn--cam">' +
        '<input type="file" accept="image/*" capture="environment" id="scanPhoto">' +
        '<span><b>📸 Scan the weld</b><i>Point the camera at it — the model spots it, the Doctor names it</i></span>' +
      '</label>' +
      '<div id="scanResult"></div>' +
    '</div>';
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

  function showDiagnosis(clueIds) {
    var results = diagnose(clueIds).slice(0, 3);
    var host = $('#dxResults');

    if (!results.length) {
      host.innerHTML = '<div class="card"><p>Nothing in my book matches that combination. Photograph it into the weld log and show someone who can put hands on it — that is the honest answer.</p></div>';
      return;
    }

    var maxScore = results[0].score;

    host.innerHTML =
      '<h2 class="section-h">What I reckon it is</h2>' +
      (results.length > 1 ? '<p class="page-sub small">Ranked most to least likely. Two faults often ride together, so read past the first one.</p>' : '') +
      results.map(function (r, i) {
        var d = r.defect;
        var confidence = Math.round((r.score / maxScore) * 100);
        return '<div class="card card--dx' + (i === 0 ? ' is-top' : '') + '">' +
          '<div class="dx-head">' +
            '<span class="dx-icon">' + d.icon + '</span>' +
            '<div><h3>' + esc(d.name) + '</h3>' +
              '<div class="dx-conf"><span style="width:' + confidence + '%"></span></div>' +
              '<div class="dx-sev">' + esc(d.severity) + '</div>' +
            '</div>' +
          '</div>' +
          '<p class="dx-plain">' + esc(d.plain) + '</p>' +
          '<div class="dx-sec"><b>Why it happened</b><ul>' +
            d.causes.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>' +
          '<div class="dx-sec dx-sec--fix"><b>Fix it now</b><ul>' +
            d.fixNow.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>' +
          '<div class="dx-sec"><b>Stop it happening again</b><ul>' +
            d.prevent.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>' +
          '<p class="dx-note">' + esc(d.processNote) + '</p>' +
        '</div>';
      }).join('') +
      '<div class="doctor-actions">' +
        '<a class="btn btn--primary" href="#/kit/log">📓 Log this weld with a photo</a>' +
        '<button class="btn btn--ghost btn--sm" id="dxAgain">Start again</button>' +
      '</div>';

    pendingLogDiagnosis = results[0].defect.name;
    announce(P.markDoctorUsed());

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
      { id: 'log', label: '📓 Weld log' }
    ];

    var body = tab === 'sheets' ? kitSheets() : tab === 'log' ? kitLog() : kitChecklist();

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
  }

  function kitChecklist() {
    var checked = P.checklistState();
    var total = 0, done = 0;

    var sections = R.preflight.map(function (sec) {
      var items = sec.items.map(function (item, i) {
        var key = sec.id + ':' + i;
        var on = !!checked[key];
        total++; if (on) done++;
        return '<label class="check' + (on ? ' is-on' : '') + '">' +
          '<input type="checkbox" data-check="' + key + '"' + (on ? ' checked' : '') + '>' +
          '<span class="clue-box"></span><span>' + esc(item) + '</span>' +
        '</label>';
      }).join('');
      return '<div class="card card--check"><h3>' + sec.icon + ' ' + esc(sec.title) + '</h3>' + items + '</div>';
    }).join('');

    return '<p class="page-sub">Run this before the helmet comes down. It resets itself each day.</p>' +
      '<div class="check-progress"><span id="checkCount">' + done + ' of ' + total + '</span> ticked' +
      '<button class="btn btn--ghost btn--sm" id="checkReset">Reset</button></div>' + sections;
  }

  function wireChecklist() {
    var body = $('#kitBody');
    body.addEventListener('change', function (e) {
      var cb = e.target.closest('[data-check]');
      if (!cb) return;
      P.toggleChecklist(cb.getAttribute('data-check'), cb.checked);
      cb.closest('.check').classList.toggle('is-on', cb.checked);
      tap();
      var all = body.querySelectorAll('[data-check]');
      var on = body.querySelectorAll('[data-check]:checked');
      $('#checkCount').textContent = on.length + ' of ' + all.length;
      if (on.length === all.length) {
        J.shower(50); J.sound('complete'); J.haptic('badge');
        toast('Whole list ticked. Go and weld. 🔥', 'xp');
      }
    });
    $('#checkReset').addEventListener('click', function () {
      P.resetChecklist();
      renderKit('checklist');
    });
  }

  function kitSheets() {
    return '<p class="page-sub">Starting points, not gospel. Set the machine here, run a test bead on scrap, then trust your eyes and ears.</p>' +
      R.cheatsheets.map(function (s) {
        return '<div class="card card--sheet">' +
          '<h3>' + s.icon + ' ' + esc(s.title) + '</h3>' +
          '<p class="sheet-note">' + esc(s.note) + '</p>' +
          '<div class="table-wrap"><table>' +
            '<thead><tr>' + s.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead>' +
            '<tbody>' + s.rows.map(function (r) {
              return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
            }).join('') + '</tbody>' +
          '</table></div>' +
          '<ul class="sheet-extras">' + s.extras.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>' +
        '</div>';
      }).join('');
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

  /* ============================ settings ================================ */

  function renderSettings() {
    renderTabs('');
    var c = V.config();
    var provider = c.provider || 'off';

    view.innerHTML =
      '<a class="back" href="#/home">‹ Back</a>' +
      '<h1 class="page-h">Settings</h1>' +

      '<div class="card">' +
        '<h3>Sound &amp; feel</h3>' +
        '<label class="switch"><input type="checkbox" id="soundToggle"' + (J.soundEnabled() ? ' checked' : '') + '>' +
          '<span class="switch-track"><i></i></span><span>Sound effects</span></label>' +
        '<p class="muted small">Haptics follow your phone\'s own vibration setting.</p>' +
      '</div>' +

      (installPrompt ? '<div class="card card--install">' +
        '<h3>📲 Install on this device</h3>' +
        '<p class="muted">Adds it to your home screen and lets it run full screen, offline, like any other app.</p>' +
        '<button class="btn btn--primary" id="installBtn">Install Weld Academy</button>' +
      '</div>' : '') +

      '<div class="card">' +
        '<h3>🤖 AI weld scan <span class="pill pill--dim">optional</span></h3>' +
        '<p class="muted small">Off by default, and the app is complete without it. Turn it on and the Doctor gets a camera button: a model looks at the photo, ticks the symptoms it spots, and the offline Weld Doctor still does the naming and the fix.</p>' +
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
          '(good weld / bad weld / defect) — good enough to spot and localise, which is all this needs. ' +
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
      toast(p === 'off' ? 'AI scan switched off.' : 'Saved. The Doctor now has a camera button.', 'xp');
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

    if (!P.state.name) return renderWelcome();

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
    J.init();

    var newDay = P.touchDay();
    var badges = P.checkBadges();

    window.addEventListener('hashchange', function () { render(); scrollTop(); });

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      installPrompt = e;
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

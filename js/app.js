/* ============================================================================
 * WELD ACADEMY — APP
 * ----------------------------------------------------------------------------
 * Hash-routed single page app. No build step, no framework, no server.
 * Routes:
 *   #/home                     dashboard, daily challenge, skill path, badges
 *   #/course                   all modules
 *   #/module/:moduleId         lesson list for a module
 *   #/lesson/:moduleId/:id     a lesson
 *   #/quiz/:moduleId           the module checkpoint quiz
 *   #/doctor                   Weld Doctor symptom checker
 *   #/kit/:tab                 checklist | sheets | log
 * ==========================================================================*/

(function () {
  'use strict';

  var C = window.WA_CONTENT;
  var R = window.WA_REFERENCE;
  var P = window.WA_PROGRESS;

  var view, header, tabbar, toastHost;

  /* ============================ helpers ================================= */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Lesson copy uses **bold** and newline-separated bullet lines.
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

  /* ============================ toasts ================================== */

  function toast(msg, kind) {
    var el = document.createElement('div');
    el.className = 'toast' + (kind ? ' toast--' + kind : '');
    el.innerHTML = msg;
    toastHost.appendChild(el);
    setTimeout(function () { el.classList.add('toast--out'); }, 2600);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3200);
  }

  // Standard reward announcement used after lessons, quizzes and log entries.
  function announce(result) {
    if (result.xp) toast('<span class="toast-xp">+' + result.xp + ' XP</span>', 'xp');
    if (result.levelUp) {
      toast('🎉 <strong>Level ' + P.level() + '</strong><br>' + esc(P.levelTitle()), 'level');
    }
    (result.newBadges || []).forEach(function (b, i) {
      setTimeout(function () {
        toast('<span class="toast-badge">' + b.icon + '</span> <strong>Badge earned</strong><br>' + esc(b.name), 'badge');
      }, 400 * (i + 1));
    });
  }

  /* ============================ chrome ================================== */

  function renderHeader() {
    var lvl = P.level();
    var pct = Math.round((P.xpIntoLevel() / P.xpForNextLevel()) * 100);
    var s = P.state;
    header.innerHTML =
      '<div class="hdr-left">' +
        '<div class="hdr-lvl">' + lvl + '</div>' +
        '<div class="hdr-meta">' +
          '<div class="hdr-title">' + esc(P.levelTitle(lvl)) + '</div>' +
          '<div class="hdr-bar"><span style="width:' + pct + '%"></span></div>' +
        '</div>' +
      '</div>' +
      '<div class="hdr-right">' +
        '<div class="hdr-stat"><b>' + s.xp + '</b><span>XP</span></div>' +
        '<div class="hdr-stat hdr-streak' + (s.streak.count > 0 ? ' is-live' : '') + '">' +
          '<b>🔥 ' + s.streak.count + '</b><span>day' + (s.streak.count === 1 ? '' : 's') + '</span>' +
        '</div>' +
      '</div>';
  }

  function renderTabs(active) {
    var tabs = [
      { id: 'home', href: '#/home', icon: '🏠', label: 'Home' },
      { id: 'course', href: '#/course', icon: '📚', label: 'Course' },
      { id: 'doctor', href: '#/doctor', icon: '🩺', label: 'Doctor' },
      { id: 'kit', href: '#/kit/checklist', icon: '🧰', label: 'Field Kit' }
    ];
    tabbar.innerHTML = tabs.map(function (t) {
      return '<a class="tab' + (t.id === active ? ' is-active' : '') + '" href="' + t.href + '">' +
        '<span class="tab-i">' + t.icon + '</span><span class="tab-l">' + t.label + '</span></a>';
    }).join('');
  }

  /* ============================ onboarding ============================== */

  function renderWelcome() {
    renderTabs('');
    tabbar.classList.add('hidden');
    header.classList.add('hidden');
    view.innerHTML =
      '<div class="welcome">' +
        '<div class="welcome-arc">⚡</div>' +
        '<h1>Weld Academy</h1>' +
        '<p class="welcome-sub">Learn to weld properly. Stick, MIG and TIG — the same knowledge a trade course teaches, in bites you can do on the couch.</p>' +
        '<div class="welcome-points">' +
          '<div><b>📚 Six modules.</b> Safety, reading drawings, stick, MIG, TIG, and how to spot a bad weld.</div>' +
          '<div><b>🩺 A shed companion.</b> Something wrong with your weld? Tick what you can see and it tells you why and how to fix it.</div>' +
          '<div><b>🔥 Show up daily.</b> XP, levels, streaks and badges, because turning up beats talent.</div>' +
        '</div>' +
        '<label class="welcome-label" for="wname">What should I call you?</label>' +
        '<input id="wname" class="input" type="text" placeholder="Your name" maxlength="24" autocomplete="off">' +
        '<button class="btn btn--primary btn--big" id="wstart">Strike an arc →</button>' +
        '<p class="welcome-fine">Everything stays on this device. No account, no internet needed.</p>' +
      '</div>';

    var input = document.getElementById('wname');
    function start() {
      P.setName((input.value || '').trim() || 'Welder');
      header.classList.remove('hidden');
      tabbar.classList.remove('hidden');
      go('#/home');
      render();
    }
    document.getElementById('wstart').addEventListener('click', start);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
    input.focus();
  }

  /* ============================ home ==================================== */

  function progressRing(pct, colour) {
    var r = 20, circ = 2 * Math.PI * r;
    var off = circ * (1 - pct / 100);
    return '<svg class="ring" viewBox="0 0 48 48" aria-hidden="true">' +
      '<circle cx="24" cy="24" r="' + r + '" class="ring-bg"></circle>' +
      '<circle cx="24" cy="24" r="' + r + '" class="ring-fg" stroke="' + colour + '" ' +
        'stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"></circle>' +
      '</svg>';
  }

  function renderHome() {
    renderTabs('home');
    var s = P.state;
    var next = P.nextUp();
    var overall = P.overallPercent();

    var continueCard;
    if (next) {
      var label = next.type === 'lesson'
        ? next.lesson.title
        : next.module.title + ' — checkpoint quiz';
      var href = next.type === 'lesson'
        ? '#/lesson/' + next.moduleId + '/' + next.lessonId
        : '#/quiz/' + next.moduleId;
      continueCard =
        '<a class="card card--continue" href="' + href + '">' +
          '<div class="cc-kicker">' + (next.type === 'lesson' ? 'Next lesson' : 'Ready for the checkpoint') + '</div>' +
          '<div class="cc-title">' + esc(label) + '</div>' +
          '<div class="cc-mod">' + next.module.icon + ' ' + esc(next.module.title) + '</div>' +
          '<div class="cc-go">Continue →</div>' +
        '</a>';
    } else {
      continueCard =
        '<div class="card card--continue card--done">' +
          '<div class="cc-kicker">Course complete</div>' +
          '<div class="cc-title">You\'ve done the lot. 🎓</div>' +
          '<div class="cc-mod">Go back over any module any time — retakes are free practice.</div>' +
        '</div>';
    }

    var daily = P.dailyChallenge();
    var dailyCard;
    if (daily.answered) {
      dailyCard =
        '<div class="card card--daily is-done">' +
          '<div class="card-head"><h2>Daily challenge</h2><span class="pill pill--ok">Done today</span></div>' +
          '<p class="muted">' + (daily.correct ? 'Got it. Back tomorrow for the next one.' : 'Not this time — the answer\'s in the module. Fresh question tomorrow.') + '</p>' +
        '</div>';
    } else {
      dailyCard =
        '<div class="card card--daily" id="dailyCard">' +
          '<div class="card-head"><h2>Daily challenge</h2><span class="pill">+20 XP</span></div>' +
          '<p class="q-text">' + esc(daily.item.question.q) + '</p>' +
          '<div class="choices">' +
            daily.item.question.choices.map(function (c, i) {
              return '<button class="choice" data-daily="' + i + '">' + esc(c) + '</button>';
            }).join('') +
          '</div>' +
        '</div>';
    }

    var path = C.modules.map(function (m, i) {
      var pct = P.modulePercent(m.id);
      var unlocked = P.moduleUnlocked(m.id);
      var complete = P.moduleComplete(m.id);
      return '<a class="path-row' + (unlocked ? '' : ' is-locked') + (complete ? ' is-complete' : '') + '" href="#/module/' + m.id + '">' +
        '<div class="path-ring">' + progressRing(pct, m.colour) + '<span class="path-icon">' + m.icon + '</span></div>' +
        '<div class="path-meta">' +
          '<div class="path-title">' + esc(m.title) + (complete ? ' <span class="tick">✓</span>' : '') + '</div>' +
          '<div class="path-sub">' + esc(m.subtitle) + '</div>' +
          '<div class="path-prog"><span style="width:' + pct + '%;background:' + m.colour + '"></span></div>' +
        '</div>' +
        '<div class="path-right">' + (unlocked ? pct + '%' : '🔒') + '</div>' +
      '</a>' + (i < C.modules.length - 1 ? '<div class="path-link"></div>' : '');
    }).join('');

    var badges = R.badges.map(function (b) {
      var got = P.hasBadge(b.id);
      return '<div class="badge' + (got ? ' is-earned' : '') + '" title="' + esc(b.desc) + '">' +
        '<span class="badge-i">' + b.icon + '</span>' +
        '<span class="badge-n">' + esc(b.name) + '</span>' +
      '</div>';
    }).join('');

    view.innerHTML =
      '<div class="hero">' +
        '<div class="hero-hi">G\'day' + (s.name ? ', ' + esc(s.name) : '') + '</div>' +
        '<div class="hero-lvl">' + esc(P.levelTitle()) + ' · Level ' + P.level() + '</div>' +
        '<div class="hero-stats">' +
          '<div><b>' + overall + '%</b><span>course done</span></div>' +
          '<div><b>' + s.streak.count + '</b><span>day streak</span></div>' +
          '<div><b>' + s.badges.length + '/' + R.badges.length + '</b><span>badges</span></div>' +
        '</div>' +
      '</div>' +
      continueCard +
      dailyCard +
      '<h2 class="section-h">Your path</h2>' +
      '<div class="path">' + path + '</div>' +
      '<h2 class="section-h">Badges</h2>' +
      '<div class="badges">' + badges + '</div>' +
      '<div class="footer-note">' +
        '<p>Weld Academy teaches the knowledge, not a ticket. Nothing here is a certification — when you\'re ready for that, it\'s TAFE and a coded test on a real coupon. This is how you walk in already knowing what you\'re doing.</p>' +
        '<button class="btn btn--ghost btn--sm" id="resetBtn">Reset all progress</button>' +
      '</div>';

    var dc = document.getElementById('dailyCard');
    if (dc) {
      dc.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-daily]');
        if (!btn) return;
        var picked = parseInt(btn.getAttribute('data-daily'), 10);
        var correct = daily.item.question.correct;
        var buttons = dc.querySelectorAll('.choice');
        buttons.forEach(function (b, i) {
          b.disabled = true;
          if (i === correct) b.classList.add('is-correct');
          else if (i === picked) b.classList.add('is-wrong');
        });
        var res = P.recordDaily(picked === correct);
        var expl = document.createElement('p');
        expl.className = 'explain';
        expl.innerHTML = '<b>' + (picked === correct ? 'Correct.' : 'Not quite.') + '</b> ' + esc(daily.item.question.explain);
        dc.appendChild(expl);
        announce(res);
        renderHeader();
      });
    }

    document.getElementById('resetBtn').addEventListener('click', function () {
      if (confirm('Wipe all progress, badges and weld log entries on this device? This cannot be undone.')) {
        P.resetAll();
        go('#/home');
        render();
      }
    });
  }

  /* ============================ course ================================== */

  function renderCourse() {
    renderTabs('course');
    var cards = C.modules.map(function (m) {
      var pct = P.modulePercent(m.id);
      var done = P.lessonsDone(m.id);
      var unlocked = P.moduleUnlocked(m.id);
      return '<a class="card card--module' + (unlocked ? '' : ' is-locked') + '" href="#/module/' + m.id + '" style="--mc:' + m.colour + '">' +
        '<div class="mod-top">' +
          '<span class="mod-icon">' + m.icon + '</span>' +
          '<span class="mod-pct">' + pct + '%</span>' +
        '</div>' +
        '<h3>' + esc(m.title) + '</h3>' +
        '<p class="mod-sub">' + esc(m.subtitle) + '</p>' +
        '<div class="mod-bar"><span style="width:' + pct + '%"></span></div>' +
        '<div class="mod-foot">' + done + ' of ' + m.lessons.length + ' lessons' +
          (P.moduleComplete(m.id) ? ' · <b>Passed ✓</b>' : (unlocked ? '' : ' · 🔒 locked')) + '</div>' +
      '</a>';
    }).join('');

    view.innerHTML =
      '<h1 class="page-h">The course</h1>' +
      '<p class="page-sub">Six modules, 27 lessons, six checkpoints. Work down the list — each one builds on the last.</p>' +
      '<div class="grid">' + cards + '</div>';
  }

  /* ============================ module ================================== */

  function renderModule(moduleId) {
    var m = moduleById(moduleId);
    if (!m) return go('#/course');
    renderTabs('course');

    var allLessonsDone = P.lessonsDone(m.id) === m.lessons.length;
    var quiz = P.state.quizzes[m.id];

    var lessons = m.lessons.map(function (l, i) {
      var done = P.isLessonDone(l.id);
      return '<a class="lesson-row' + (done ? ' is-done' : '') + '" href="#/lesson/' + m.id + '/' + l.id + '">' +
        '<span class="lesson-num">' + (done ? '✓' : i + 1) + '</span>' +
        '<span class="lesson-meta">' +
          '<span class="lesson-title">' + esc(l.title) + '</span>' +
          '<span class="lesson-blurb">' + esc(l.blurb) + '</span>' +
        '</span>' +
        '<span class="lesson-go">›</span>' +
      '</a>';
    }).join('');

    var quizStatus = quiz
      ? 'Best score ' + quiz.best + '/' + quiz.total + (P.moduleComplete(m.id) ? ' · passed' : ' · not passed yet')
      : '5 questions · ' + (P.XP.quizAnswer) + ' XP per correct answer, first attempt';

    view.innerHTML =
      '<a class="back" href="#/course">‹ All modules</a>' +
      '<div class="mod-head" style="--mc:' + m.colour + '">' +
        '<span class="mod-head-icon">' + m.icon + '</span>' +
        '<div><h1>' + esc(m.title) + '</h1><p>' + esc(m.subtitle) + '</p></div>' +
      '</div>' +
      '<blockquote class="mentor">' + esc(m.intro) + '</blockquote>' +
      '<div class="lessons">' + lessons + '</div>' +
      '<a class="card card--quiz' + (allLessonsDone ? '' : ' is-dim') + '" href="#/quiz/' + m.id + '">' +
        '<div class="quiz-icon">🎯</div>' +
        '<div><h3>Checkpoint quiz</h3><p>' + esc(quizStatus) + '</p>' +
          (allLessonsDone ? '' : '<p class="muted small">Read the lessons first — but you can have a crack any time.</p>') +
        '</div>' +
        '<div class="quiz-go">›</div>' +
      '</a>';
  }

  /* ============================ lesson ================================== */

  function renderLesson(moduleId, lessonId) {
    var m = moduleById(moduleId);
    var l = lessonById(m, lessonId);
    if (!m || !l) return go('#/course');
    renderTabs('course');

    var idx = m.lessons.indexOf(l);
    var done = P.isLessonDone(l.id);
    var isLast = idx === m.lessons.length - 1;

    var body = l.body.map(function (p) { return '<p>' + fmt(p) + '</p>'; }).join('');
    var keys = l.keyPoints.map(function (k) { return '<li>' + fmt(k) + '</li>'; }).join('');

    view.innerHTML =
      '<a class="back" href="#/module/' + m.id + '">‹ ' + esc(m.title) + '</a>' +
      '<div class="lesson-head" style="--mc:' + m.colour + '">' +
        '<div class="lesson-kicker">' + m.icon + ' Lesson ' + (idx + 1) + ' of ' + m.lessons.length + '</div>' +
        '<h1>' + esc(l.title) + '</h1>' +
      '</div>' +
      '<article class="prose">' + body + '</article>' +
      (l.tip ? '<div class="tipbox"><b>From the shed floor</b><p>' + fmt(l.tip) + '</p></div>' : '') +
      '<div class="keybox"><b>Worth remembering</b><ul>' + keys + '</ul></div>' +
      '<div class="lesson-actions">' +
        '<button class="btn btn--primary btn--big" id="doneBtn">' +
          (done ? (isLast ? 'On to the checkpoint →' : 'Next lesson →') : 'Mark done · +10 XP →') +
        '</button>' +
      '</div>';

    document.getElementById('doneBtn').addEventListener('click', function () {
      var res = P.completeLesson(m.id, l.id);
      announce(res);
      renderHeader();
      var nextHref = isLast ? '#/quiz/' + m.id : '#/lesson/' + m.id + '/' + m.lessons[idx + 1].id;
      setTimeout(function () { go(nextHref); }, res.xp ? 350 : 0);
    });
  }

  /* ============================ quiz ==================================== */

  var quizRun = null;   // { moduleId, i, answers[], locked }

  function renderQuiz(moduleId) {
    var m = moduleById(moduleId);
    if (!m) return go('#/course');
    renderTabs('course');

    if (!quizRun || quizRun.moduleId !== moduleId) {
      quizRun = { moduleId: moduleId, i: 0, answers: [], locked: false };
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

    var host = document.getElementById('qChoices');
    if (picked !== undefined) showQuizFeedback(m, q, picked);

    host.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-q]');
      if (!btn || quizRun.answers[quizRun.i] !== undefined) return;
      var pick = parseInt(btn.getAttribute('data-q'), 10);
      quizRun.answers[quizRun.i] = pick;
      showQuizFeedback(m, q, pick);
    });
  }

  function showQuizFeedback(m, q, picked) {
    var host = document.getElementById('qChoices');
    host.querySelectorAll('.choice').forEach(function (b, i) {
      b.disabled = true;
      if (i === q.correct) b.classList.add('is-correct');
      else if (i === picked) b.classList.add('is-wrong');
    });
    var right = picked === q.correct;
    var last = quizRun.i === m.quiz.length - 1;
    document.getElementById('qFeedback').innerHTML =
      '<div class="feedback ' + (right ? 'is-right' : 'is-wrong') + '">' +
        '<b>' + (right ? '✓ Correct' : '✗ Not quite') + '</b>' +
        '<p>' + esc(q.explain) + '</p>' +
      '</div>' +
      '<button class="btn btn--primary btn--big" id="qNext">' + (last ? 'See your score →' : 'Next question →') + '</button>';

    document.getElementById('qNext').addEventListener('click', function () {
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

    var verdict = correct === total ? 'Perfect. Every one.'
      : passed ? 'Passed. Good work.'
      : 'Not there yet — go back over the lessons and have another crack.';

    view.innerHTML =
      '<div class="result ' + (passed ? 'is-pass' : 'is-fail') + '">' +
        '<div class="result-score">' + correct + '<span>/' + total + '</span></div>' +
        '<h1>' + esc(verdict) + '</h1>' +
        (res.xp ? '<p class="result-xp">+' + res.xp + ' XP</p>'
                : '<p class="muted">Retakes are free practice — no XP, but the explanations are all there.</p>') +
        '<div class="result-actions">' +
          '<button class="btn btn--primary" id="retryBtn">Try again</button>' +
          '<a class="btn btn--ghost" href="#/course">Back to the course</a>' +
        '</div>' +
      '</div>';

    announce(res);
    renderHeader();

    document.getElementById('retryBtn').addEventListener('click', function () {
      quizRun = { moduleId: m.id, i: 0, answers: [], locked: false };
      renderQuiz(m.id);
      scrollTop();
    });
  }

  /* ============================ weld doctor ============================= */

  var doctorPicks = {};

  function renderDoctor() {
    renderTabs('doctor');

    var groups = {};
    R.clues.forEach(function (c) {
      (groups[c.group] = groups[c.group] || []).push(c);
    });

    var html = Object.keys(groups).map(function (g) {
      return '<h2 class="section-h">' + esc(g) + '</h2>' +
        '<div class="clues" data-clue-group>' +
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
      '<p class="page-sub">Something not right? Tick everything you can see, hear or remember about the job. You don\'t need to know the names — that\'s my end.</p>' +
      '<div id="clueHost">' + html + '</div>' +
      '<div class="doctor-actions">' +
        '<button class="btn btn--primary btn--big" id="dxBtn">Diagnose it →</button>' +
        '<button class="btn btn--ghost btn--sm" id="dxClear">Clear all</button>' +
      '</div>' +
      '<div id="dxResults"></div>';

    document.getElementById('clueHost').addEventListener('change', function (e) {
      var cb = e.target.closest('[data-clue]');
      if (!cb) return;
      var id = cb.getAttribute('data-clue');
      if (cb.checked) doctorPicks[id] = true; else delete doctorPicks[id];
      cb.closest('.clue').classList.toggle('is-on', cb.checked);
    });

    document.getElementById('dxClear').addEventListener('click', function () {
      doctorPicks = {};
      renderDoctor();
      scrollTop();
    });

    document.getElementById('dxBtn').addEventListener('click', function () {
      var picked = Object.keys(doctorPicks);
      if (!picked.length) {
        toast('Tick at least one thing you can see first.', 'warn');
        return;
      }
      showDiagnosis(picked);
    });
  }

  function diagnose(clueIds) {
    return R.defects.map(function (d) {
      var score = 0, hits = [];
      clueIds.forEach(function (c) {
        if (d.match[c]) { score += d.match[c]; hits.push(c); }
      });
      return { defect: d, score: score, hits: hits };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  function showDiagnosis(clueIds) {
    var results = diagnose(clueIds).slice(0, 3);
    var host = document.getElementById('dxResults');

    if (!results.length) {
      host.innerHTML = '<div class="card"><p>Nothing in my book matches that combination. ' +
        'Photograph it in the weld log and show someone who can put hands on it — that\'s the honest answer.</p></div>';
      return;
    }

    var top = results[0];
    var maxScore = top.score;

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
        '<a class="btn btn--primary" href="#/kit/log" id="dxLog">📓 Log this weld with a photo</a>' +
        '<button class="btn btn--ghost btn--sm" id="dxAgain">Start again</button>' +
      '</div>';

    pendingLogDiagnosis = top.defect.name;

    var res = P.markDoctorUsed();
    announce(res);
    renderHeader();

    document.getElementById('dxAgain').addEventListener('click', function () {
      doctorPicks = {};
      renderDoctor();
      scrollTop();
    });

    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ============================ field kit =============================== */

  var pendingLogDiagnosis = '';

  function renderKit(tab) {
    renderTabs('kit');
    tab = tab || 'checklist';

    var tabs = [
      { id: 'checklist', label: '✅ Pre-flight' },
      { id: 'sheets', label: '📋 Cheat sheets' },
      { id: 'log', label: '📓 Weld log' }
    ];

    var body =
      tab === 'sheets' ? kitSheets() :
      tab === 'log' ? kitLog() :
      kitChecklist();

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

  /* ---- pre-flight checklist ---- */

  function kitChecklist() {
    var checked = P.checklistState();
    var totalItems = 0, doneItems = 0;

    var sections = R.preflight.map(function (sec) {
      var items = sec.items.map(function (item, i) {
        var key = sec.id + ':' + i;
        var on = !!checked[key];
        totalItems++; if (on) doneItems++;
        return '<label class="check' + (on ? ' is-on' : '') + '">' +
          '<input type="checkbox" data-check="' + key + '"' + (on ? ' checked' : '') + '>' +
          '<span class="clue-box"></span><span>' + esc(item) + '</span>' +
        '</label>';
      }).join('');
      return '<div class="card card--check">' +
        '<h3>' + sec.icon + ' ' + esc(sec.title) + '</h3>' + items + '</div>';
    }).join('');

    return '<p class="page-sub">Run this before you drop the helmet. It resets itself each day.</p>' +
      '<div class="check-progress"><span id="checkCount">' + doneItems + ' of ' + totalItems + '</span> ticked' +
      ' <button class="btn btn--ghost btn--sm" id="checkReset">Reset</button></div>' +
      sections;
  }

  function wireChecklist() {
    var body = document.getElementById('kitBody');
    body.addEventListener('change', function (e) {
      var cb = e.target.closest('[data-check]');
      if (!cb) return;
      P.toggleChecklist(cb.getAttribute('data-check'), cb.checked);
      cb.closest('.check').classList.toggle('is-on', cb.checked);
      var all = body.querySelectorAll('[data-check]');
      var on = body.querySelectorAll('[data-check]:checked');
      document.getElementById('checkCount').textContent = on.length + ' of ' + all.length;
      if (on.length === all.length) toast('Whole list ticked. Go and weld. 🔥', 'xp');
    });
    document.getElementById('checkReset').addEventListener('click', function () {
      P.resetChecklist();
      renderKit('checklist');
    });
  }

  /* ---- cheat sheets ---- */

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

  /* ---- weld log ---- */

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

    return '<p class="page-sub">Your own record. Photo, what you were doing, what went wrong. Stays on this phone.</p>' +
      '<div class="card card--logform">' +
        '<label class="file-btn">' +
          '<input type="file" accept="image/*" capture="environment" id="logPhoto">' +
          '<span>📷 Take or choose a photo</span>' +
        '</label>' +
        '<img id="logPreview" class="log-preview hidden" alt="Preview">' +
        '<input class="input" id="logDx" type="text" maxlength="80" placeholder="What is it? (optional)" value="' + esc(pendingLogDiagnosis) + '">' +
        '<textarea class="input" id="logNote" rows="3" maxlength="600" placeholder="Process, settings, what you were trying, what happened..."></textarea>' +
        '<button class="btn btn--primary" id="logSave">Save to log</button>' +
      '</div>' +
      '<h2 class="section-h">' + entries.length + ' entr' + (entries.length === 1 ? 'y' : 'ies') + '</h2>' +
      list;
  }

  // Shrink to max 1000px and re-encode, so localStorage doesn't fill on 3 photos.
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
        try {
          cb(canvas.toDataURL('image/jpeg', 0.7));
        } catch (e) {
          cb(null);
        }
      };
      img.onerror = function () { cb(null); };
      img.src = reader.result;
    };
    reader.onerror = function () { cb(null); };
    reader.readAsDataURL(file);
  }

  function wireLog() {
    var photoData = null;
    var input = document.getElementById('logPhoto');
    var preview = document.getElementById('logPreview');

    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      shrinkImage(file, function (data) {
        if (!data) { toast('Couldn\'t read that image.', 'warn'); return; }
        photoData = data;
        preview.src = data;
        preview.classList.remove('hidden');
      });
    });

    document.getElementById('logSave').addEventListener('click', function () {
      var note = document.getElementById('logNote').value.trim();
      var dx = document.getElementById('logDx').value.trim();
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
      announce(res);
      renderHeader();
      renderKit('log');
      scrollTop();
    });

    document.getElementById('kitBody').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-del]');
      if (!btn) return;
      if (!confirm('Delete this log entry?')) return;
      P.deleteLogEntry(btn.getAttribute('data-del'));
      renderKit('log');
    });
  }

  /* ============================ router ================================== */

  function render() {
    var hash = location.hash.replace(/^#\/?/, '');
    var parts = hash.split('/').filter(Boolean);

    if (!P.state.name) return renderWelcome();

    header.classList.remove('hidden');
    tabbar.classList.remove('hidden');
    renderHeader();

    switch (parts[0]) {
      case 'course':  renderCourse(); break;
      case 'module':  renderModule(parts[1]); break;
      case 'lesson':  renderLesson(parts[1], parts[2]); break;
      case 'quiz':    renderQuiz(parts[1]); break;
      case 'doctor':  renderDoctor(); break;
      case 'kit':     renderKit(parts[1]); break;
      default:        renderHome();
    }
  }

  /* ============================ boot ==================================== */

  function boot() {
    view = document.getElementById('view');
    header = document.getElementById('header');
    tabbar = document.getElementById('tabbar');
    toastHost = document.getElementById('toasts');

    P.load();
    var newDay = P.touchDay();
    var badges = P.checkBadges();

    window.addEventListener('hashchange', function () { render(); scrollTop(); });
    render();

    if (newDay && P.state.streak.count > 1) {
      setTimeout(function () {
        toast('🔥 <strong>' + P.state.streak.count + ' days running.</strong><br>Good on you.', 'level');
      }, 700);
    }
    badges.forEach(function (b, i) {
      setTimeout(function () {
        toast('<span class="toast-badge">' + b.icon + '</span> <strong>Badge earned</strong><br>' + esc(b.name), 'badge');
      }, 900 + 400 * i);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

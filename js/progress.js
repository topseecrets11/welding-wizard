/* ============================================================================
 * WELD ACADEMY — PROGRESS ENGINE
 * ----------------------------------------------------------------------------
 * Everything that remembers: XP, levels, streaks, badges, quiz results, the
 * weld log, and the daily challenge. Persists to localStorage, degrades to
 * in-memory if storage is unavailable (private browsing, blocked cookies).
 * ==========================================================================*/

window.WA_PROGRESS = (function () {
  'use strict';

  var KEY = 'weldAcademy.v1';
  var XP_PER_LEVEL = 100;

  var XP = {
    lesson: 10,
    quizAnswer: 15,
    moduleComplete: 25,
    daily: 20,
    diagnosis: 5,
    logEntry: 5
  };

  var storageOK = true;

  function defaults() {
    return {
      version: 1,
      name: '',
      xp: 0,
      lessons: {},            // lessonId -> true
      quizzes: {},            // moduleId -> { best: n, total: n, scored: true }
      badges: [],             // badge ids
      streak: { count: 0, lastDay: null, best: 0 },
      daily: { day: null, answered: false, correct: false },
      doctorUsed: false,
      lastLogXpDay: null,
      log: [],                // { id, ts, note, photo, diagnosis }
      checklist: {},          // "sectionId:index" -> true
      checklistDay: null
    };
  }

  var state = defaults();

  /* ---------------------------------------------------------------- utils */

  function todayKey(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function daysBetween(aKey, bKey) {
    var a = new Date(aKey + 'T00:00:00');
    var b = new Date(bKey + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }

  function save() {
    if (!storageOK) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      // Most likely the quota, blown by log photos.
      storageOK = false;
      console.warn('Weld Academy: could not save progress —', e && e.name);
    }
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        var base = defaults();
        Object.keys(base).forEach(function (k) {
          if (parsed[k] !== undefined && parsed[k] !== null) base[k] = parsed[k];
        });
        state = base;
      }
    } catch (e) {
      storageOK = false;
      console.warn('Weld Academy: storage unavailable, running in memory only.');
    }
    return state;
  }

  /* --------------------------------------------------------------- levels */

  function level() {
    return Math.floor(state.xp / XP_PER_LEVEL) + 1;
  }

  function levelTitle(lvl) {
    var titles = window.WA_REFERENCE.levelTitles;
    var l = lvl || level();
    return l <= titles.length ? titles[l - 1] : titles[titles.length - 1] + ' ' + (l - titles.length + 1);
  }

  function xpIntoLevel() { return state.xp % XP_PER_LEVEL; }
  function xpForNextLevel() { return XP_PER_LEVEL; }

  /* --------------------------------------------------------------- streak */

  // Call once on app open. Returns true if this is a newly counted day.
  function touchDay() {
    var today = todayKey();
    var last = state.streak.lastDay;
    if (last === today) return false;

    if (!last) {
      state.streak.count = 1;
    } else {
      var gap = daysBetween(last, today);
      state.streak.count = gap === 1 ? state.streak.count + 1 : 1;
    }
    state.streak.lastDay = today;
    if (state.streak.count > state.streak.best) state.streak.best = state.streak.count;
    save();
    return true;
  }

  /* --------------------------------------------------------------- badges */

  function hasBadge(id) { return state.badges.indexOf(id) !== -1; }

  // Recomputes every badge condition; returns the badge objects newly earned.
  function checkBadges() {
    var modules = window.WA_CONTENT.modules;
    var earned = [];

    function grant(id) {
      if (hasBadge(id)) return;
      state.badges.push(id);
      var b = window.WA_REFERENCE.badges.filter(function (x) { return x.id === id; })[0];
      if (b) earned.push(b);
    }

    if (Object.keys(state.lessons).length > 0) grant('first-spark');

    modules.forEach(function (m) {
      if (moduleComplete(m.id)) grant(m.id);
    });

    if (modules.every(function (m) { return moduleComplete(m.id); })) grant('ticket-ready');

    var perfect = Object.keys(state.quizzes).some(function (mid) {
      var q = state.quizzes[mid];
      return q && q.total > 0 && q.best === q.total;
    });
    if (perfect) grant('perfect-pass');

    if (state.streak.count >= 3 || state.streak.best >= 3) grant('streak-3');
    if (state.streak.count >= 7 || state.streak.best >= 7) grant('streak-7');
    if (state.doctorUsed) grant('field-medic');
    if (state.log.length > 0) grant('logbook');

    if (earned.length) save();
    return earned;
  }

  /* ------------------------------------------------------------- progress */

  function moduleById(id) {
    return window.WA_CONTENT.modules.filter(function (m) { return m.id === id; })[0];
  }

  function lessonsDone(moduleId) {
    var m = moduleById(moduleId);
    if (!m) return 0;
    return m.lessons.filter(function (l) { return state.lessons[l.id]; }).length;
  }

  // "Complete" = every lesson read AND the quiz attempted with a pass (3/5+).
  function moduleComplete(moduleId) {
    var m = moduleById(moduleId);
    if (!m) return false;
    if (lessonsDone(moduleId) < m.lessons.length) return false;
    var q = state.quizzes[moduleId];
    return !!(q && q.best >= Math.ceil(m.quiz.length * 0.6));
  }

  function modulePercent(moduleId) {
    var m = moduleById(moduleId);
    if (!m) return 0;
    var steps = m.lessons.length + 1;                 // lessons + the quiz
    var done = lessonsDone(moduleId);
    var q = state.quizzes[moduleId];
    if (q && q.best >= Math.ceil(m.quiz.length * 0.6)) done += 1;
    return Math.round((done / steps) * 100);
  }

  // A module unlocks when the one before it is complete. The UI still offers a
  // "start anyway" — never hard-block someone standing at a machine.
  function moduleUnlocked(moduleId) {
    var mods = window.WA_CONTENT.modules;
    var i = mods.findIndex(function (m) { return m.id === moduleId; });
    if (i <= 0) return true;
    return moduleComplete(mods[i - 1].id);
  }

  function overallPercent() {
    var mods = window.WA_CONTENT.modules;
    var total = 0, done = 0;
    mods.forEach(function (m) {
      total += m.lessons.length + 1;
      done += lessonsDone(m.id);
      var q = state.quizzes[m.id];
      if (q && q.best >= Math.ceil(m.quiz.length * 0.6)) done += 1;
    });
    return total ? Math.round((done / total) * 100) : 0;
  }

  // Next thing she should do: first unread lesson, else first unpassed quiz.
  function nextUp() {
    var mods = window.WA_CONTENT.modules;
    for (var i = 0; i < mods.length; i++) {
      var m = mods[i];
      for (var j = 0; j < m.lessons.length; j++) {
        if (!state.lessons[m.lessons[j].id]) {
          return { type: 'lesson', moduleId: m.id, lessonId: m.lessons[j].id, module: m, lesson: m.lessons[j] };
        }
      }
      if (!moduleComplete(m.id)) {
        return { type: 'quiz', moduleId: m.id, module: m };
      }
    }
    return null;
  }

  /* --------------------------------------------------------------- awards */

  function addXp(n) {
    state.xp += n;
    save();
    return n;
  }

  function isLessonDone(id) { return !!state.lessons[id]; }

  // Returns { xp, newBadges, levelUp }
  function completeLesson(moduleId, lessonId) {
    var before = level();
    var gained = 0;
    if (!state.lessons[lessonId]) {
      state.lessons[lessonId] = true;
      gained += XP.lesson;
      state.xp += XP.lesson;
      if (moduleComplete(moduleId)) {
        gained += XP.moduleComplete;
        state.xp += XP.moduleComplete;
      }
      save();
    }
    return { xp: gained, newBadges: checkBadges(), levelUp: level() > before };
  }

  // XP only for the first sitting; retakes are free practice.
  function recordQuiz(moduleId, correctCount, totalCount) {
    var before = level();
    var prev = state.quizzes[moduleId];
    var firstSitting = !prev || !prev.scored;
    var gained = 0;

    if (firstSitting) {
      gained += correctCount * XP.quizAnswer;
      state.xp += gained;
    }

    state.quizzes[moduleId] = {
      best: Math.max(correctCount, prev ? prev.best : 0),
      total: totalCount,
      scored: true,
      attempts: (prev && prev.attempts ? prev.attempts : 0) + 1
    };

    if (moduleComplete(moduleId) && firstSitting) {
      gained += XP.moduleComplete;
      state.xp += XP.moduleComplete;
    }

    save();
    return { xp: gained, firstSitting: firstSitting, newBadges: checkBadges(), levelUp: level() > before };
  }

  /* ------------------------------------------------------ daily challenge */

  function questionPool() {
    var pool = [];
    window.WA_CONTENT.modules.forEach(function (m) {
      m.quiz.forEach(function (q, i) {
        pool.push({ moduleId: m.id, moduleTitle: m.title, index: i, question: q });
      });
    });
    return pool;
  }

  function dailyChallenge() {
    var pool = questionPool();
    var key = todayKey();
    var seed = 0;
    for (var i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) % 100000;
    var item = pool[seed % pool.length];
    var fresh = state.daily.day !== key;
    return {
      item: item,
      day: key,
      answered: !fresh && state.daily.answered,
      correct: !fresh && state.daily.correct
    };
  }

  function recordDaily(wasCorrect) {
    var key = todayKey();
    if (state.daily.day === key && state.daily.answered) {
      return { xp: 0, alreadyDone: true, newBadges: [] };
    }
    var gained = wasCorrect ? XP.daily : 0;
    state.daily = { day: key, answered: true, correct: !!wasCorrect };
    state.xp += gained;
    save();
    return { xp: gained, alreadyDone: false, newBadges: checkBadges() };
  }

  /* ---------------------------------------------------------- weld doctor */

  function markDoctorUsed() {
    var gained = 0;
    if (!state.doctorUsed) {
      state.doctorUsed = true;
      state.xp += XP.diagnosis;
      gained = XP.diagnosis;
      save();
    }
    return { xp: gained, newBadges: checkBadges() };
  }

  /* ------------------------------------------------------------- weld log */

  function addLogEntry(entry) {
    var today = todayKey();
    var gained = 0;
    entry.id = 'log-' + Date.now();
    entry.ts = Date.now();
    state.log.unshift(entry);

    if (state.lastLogXpDay !== today) {         // one XP award per day, no farming
      state.lastLogXpDay = today;
      state.xp += XP.logEntry;
      gained = XP.logEntry;
    }

    var ok = true;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      // Photos blew the quota — drop the entry back out and tell the caller.
      state.log.shift();
      ok = false;
    }
    return { ok: ok, xp: gained, newBadges: ok ? checkBadges() : [] };
  }

  function deleteLogEntry(id) {
    state.log = state.log.filter(function (e) { return e.id !== id; });
    save();
  }

  /* ------------------------------------------------------------ checklist */

  // The pre-flight checklist resets each day — it's a per-session ritual.
  function checklistState() {
    var today = todayKey();
    if (state.checklistDay !== today) {
      state.checklist = {};
      state.checklistDay = today;
      save();
    }
    return state.checklist;
  }

  function toggleChecklist(key, on) {
    checklistState();
    if (on) state.checklist[key] = true;
    else delete state.checklist[key];
    save();
  }

  function resetChecklist() {
    state.checklist = {};
    state.checklistDay = todayKey();
    save();
  }

  /* ---------------------------------------------------------------- admin */

  function setName(n) { state.name = n; save(); }

  function resetAll() {
    state = defaults();
    try { localStorage.removeItem(KEY); } catch (e) { /* nothing to do */ }
  }

  return {
    XP: XP,
    load: load,
    save: save,
    get state() { return state; },
    todayKey: todayKey,
    storageAvailable: function () { return storageOK; },

    level: level,
    levelTitle: levelTitle,
    xpIntoLevel: xpIntoLevel,
    xpForNextLevel: xpForNextLevel,

    touchDay: touchDay,
    hasBadge: hasBadge,
    checkBadges: checkBadges,

    lessonsDone: lessonsDone,
    moduleComplete: moduleComplete,
    modulePercent: modulePercent,
    moduleUnlocked: moduleUnlocked,
    overallPercent: overallPercent,
    nextUp: nextUp,

    addXp: addXp,
    isLessonDone: isLessonDone,
    completeLesson: completeLesson,
    recordQuiz: recordQuiz,

    dailyChallenge: dailyChallenge,
    recordDaily: recordDaily,

    markDoctorUsed: markDoctorUsed,
    addLogEntry: addLogEntry,
    deleteLogEntry: deleteLogEntry,

    checklistState: checklistState,
    toggleChecklist: toggleChecklist,
    resetChecklist: resetChecklist,

    setName: setName,
    resetAll: resetAll
  };
})();

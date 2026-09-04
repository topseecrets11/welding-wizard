/* ============================================================================
 * WELD ACADEMY — DRIVE MODE
 * ----------------------------------------------------------------------------
 * She drives between jobs constantly and forgets to put music on. This turns
 * that time into the course: a whole unit played end to end like a podcast,
 * hands free, with the phone face down in a cup holder.
 *
 * What it has to do that the lesson reader does not:
 *
 *   · PLAY A WHOLE UNIT, not one page. Lesson rolls into lesson with a spoken
 *     link between them, so there is nothing to tap for twenty minutes.
 *   · SAY WHERE SHE IS. A podcast tells you the time remaining; so does this.
 *     "Lesson 3 of 5 · 4:20 in · 11 min left."
 *   · ANSWER THE CAR. navigator.mediaSession puts the unit title on the stereo
 *     and maps the wheel buttons to next / previous / play / pause.
 *   · SURVIVE BEING INTERRUPTED. Where she got to is written down as it goes,
 *     so a phone call does not cost her the unit.
 *   · COUNT. Lessons finished by ear mark off the same as lessons finished by
 *     eye, so a week of driving genuinely moves her through the course.
 *
 * HONEST LIMIT, stated here and in the README: speech synthesis with the
 * screen off is unreliable across Android versions. The silent-audio media
 * session below keeps it alive in most cases; where it does not, the wake
 * lock keeps the screen on instead. It is the best a web app can do.
 * ==========================================================================*/

window.WA_DRIVE = (function () {
  'use strict';

  var N = null, S = null, P = null;      // resolved lazily; load order safe

  var lines = [];        // the whole unit, flattened: [{ kind, text, lessonId }]
  var marks = [];        // where each lesson starts in `lines`
  var mod = null;
  var at = 0;            // index into lines
  var playing = false;
  var listeners = [];
  var silent = null;     // the silent loop that holds the media session open
  var wakeLock = null;
  var startedAt = 0;     // wall clock when the current line began
  var tick = null;

  function deps() {
    N = N || window.WA_NARRATOR;
    S = S || window.WA_SCRIPT;
    P = P || window.WA_PROGRESS;
    return N && S && P;
  }

  function supported() {
    return !!(window.WA_NARRATOR && window.WA_NARRATOR.supported());
  }

  /* ------------------------------------------------------------ the playlist */

  /* Flatten a unit into lines, remembering where each lesson starts so
     next/previous can jump by lesson rather than by sentence. */
  function build(module) {
    if (!deps()) return 0;
    mod = module;
    lines = [];
    marks = [];

    push('intro', 'Unit ' + module.title + '. ' + module.lessons.length + ' lessons. ' +
                  'Keep your eyes on the road — this is all talk.', null);
    if (module.blurb) push('intro', module.blurb, null);

    module.lessons.forEach(function (les, i) {
      marks.push({ index: lines.length, lesson: les, n: i + 1 });
      S.lesson(module, les).forEach(function (l) {
        push(l.kind, l.text, les.id);
      });
      if (i < module.lessons.length - 1) {
        push('link', 'That was lesson ' + (i + 1) + ' of ' + module.lessons.length +
                     '. Next one coming up.', les.id);
      }
    });

    push('outro', 'That is the end of ' + module.title +
                  '. When you are off the road, have a go at the questions and see what stuck.', null);
    at = 0;
    return lines.length;
  }

  function push(kind, text, lessonId) {
    var t = S.forSpeech(text);
    if (t) lines.push({ kind: kind, text: t, lessonId: lessonId });
  }

  /* ------------------------------------------------------------- timekeeping */

  /* Speech has no duration until it is spoken, so this estimates from word
     count at the current rate — the same arithmetic a podcast app does with
     a known bitrate, and close enough to be useful. */
  function secondsFor(line) {
    var rate = (N && N.getRate && N.getRate()) || 1;
    return (line.text.split(/\s+/).length / 150) * 60 / rate;
  }

  function secondsBetween(from, to) {
    var s = 0;
    for (var i = from; i < to && i < lines.length; i++) s += secondsFor(lines[i]);
    return s;
  }

  function currentLesson() {
    var found = null;
    for (var i = 0; i < marks.length; i++) {
      if (marks[i].index <= at) found = marks[i]; else break;
    }
    return found;
  }

  function mmss(s) {
    s = Math.max(0, Math.round(s));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  /* What the screen shows, and what she would want read back to her. */
  function position() {
    var les = currentLesson();
    var lessonStart = les ? les.index : 0;
    var lessonEnd = lines.length;
    for (var i = 0; i < marks.length; i++) {
      if (marks[i].index > at) { lessonEnd = marks[i].index; break; }
    }
    // Part-way through the line currently being spoken.
    var elapsedInLine = playing && startedAt ? (Date.now() - startedAt) / 1000 : 0;

    return {
      unit: mod ? mod.title : '',
      lessonTitle: les ? les.lesson.title : '',
      lessonNumber: les ? les.n : 0,
      lessonCount: mod ? mod.lessons.length : 0,
      intoLesson: mmss(secondsBetween(lessonStart, at) + elapsedInLine),
      lessonLeft: mmss(Math.max(0, secondsBetween(at, lessonEnd) - elapsedInLine)),
      unitLeft: mmss(Math.max(0, secondsBetween(at, lines.length) - elapsedInLine)),
      unitTotal: mmss(secondsBetween(0, lines.length)),
      percent: lines.length ? Math.round((at / lines.length) * 100) : 0,
      line: lines[at] ? lines[at].text : '',
      kind: lines[at] ? lines[at].kind : '',
      playing: playing,
      index: at,
      total: lines.length
    };
  }

  /* -------------------------------------------------------------- playback */

  function speak() {
    if (!playing || at >= lines.length) { if (at >= lines.length) finish(); return; }
    startedAt = Date.now();
    emit();

    N.setScript([{ text: lines[at].text }]);
    N.onChange(onNarrator);
    N.play(0);
  }

  /* The narrator finishing one line is the cue for the next. */
  function onNarrator(st) {
    if (!playing) return;
    if (!st.playing && !st.paused) {
      N.offChange(onNarrator);
      advance();
    }
  }

  function advance() {
    // Credit the lesson as heard the moment we pass out of it.
    var leaving = currentLesson();
    at += 1;
    var now = currentLesson();
    if (leaving && (!now || now.lesson.id !== leaving.lesson.id)) creditLesson(leaving.lesson);
    remember();
    if (at >= lines.length) { finish(); return; }
    updateMediaSession();
    speak();
  }

  /* The outro is not part of any lesson, so reaching the end never "leaves"
     the last one. Credit it here or a unit listened all the way through shows
     as one lesson short. */
  function creditFinalLesson() {
    if (!mod || !marks.length) return;
    creditLesson(marks[marks.length - 1].lesson);
  }

  /* Listening all the way through a lesson counts the same as reading it. */
  function creditLesson(les) {
    if (!mod || !les) return;
    try {
      var res = P.completeLesson(mod.id, les.id);
      if (res && res.xp && typeof onCredit === 'function') onCredit(res, les);
    } catch (e) { /* progress is not worth breaking playback over */ }
  }

  var onCredit = null;
  function setCreditHandler(fn) { onCredit = fn; }

  function play() {
    if (!lines.length) return;
    playing = true;
    startSilent();
    requestWakeLock();
    updateMediaSession();
    startTicker();
    speak();
  }

  function pause() {
    playing = false;
    if (N) { N.offChange(onNarrator); N.stop(); }
    stopTicker();
    setPlaybackState('paused');
    remember();
    emit();
  }

  function toggle() { if (playing) pause(); else play(); }

  function stop() {
    playing = false;
    if (N) { N.offChange(onNarrator); N.stop(); }
    stopTicker();
    stopSilent();
    releaseWakeLock();
    clearMediaSession();
    emit();
  }

  function finish() {
    creditFinalLesson();
    playing = false;
    if (N) N.offChange(onNarrator);
    stopTicker();
    stopSilent();
    releaseWakeLock();
    clearMediaSession();
    try { P.setSetting('drive', null); } catch (e) { /* ignore */ }
    emit();
  }

  /* Jump by lesson, which is what the wheel buttons should do. */
  function nextLesson() {
    for (var i = 0; i < marks.length; i++) {
      if (marks[i].index > at) return seek(marks[i].index);
    }
    return seek(lines.length - 1);
  }

  function prevLesson() {
    var les = currentLesson();
    // Within the first few seconds, "previous" means the lesson before this
    // one; further in, it means the start of this one. Same as a podcast app.
    if (les && secondsBetween(les.index, at) > 12) return seek(les.index);
    for (var i = marks.length - 1; i >= 0; i--) {
      if (marks[i].index < (les ? les.index : at)) return seek(marks[i].index);
    }
    return seek(0);
  }

  function seek(index) {
    at = Math.max(0, Math.min(index, lines.length - 1));
    remember();
    updateMediaSession();
    if (playing) { if (N) { N.offChange(onNarrator); N.stop(); } speak(); }
    else emit();
  }

  /* ------------------------------------------------- interrupted and resumed */

  function remember() {
    if (!mod) return;
    try { P.setSetting('drive', { module: mod.id, at: at }); } catch (e) { /* ignore */ }
  }

  function saved() {
    try { return P.settings().drive || null; } catch (e) { return null; }
  }

  function resumeAt(index) { at = Math.max(0, Math.min(index || 0, lines.length - 1)); emit(); }

  /* --------------------------------------------------------- the car stereo */

  /* A media session needs media. Speech synthesis is not media as far as the
     browser is concerned, so a silent looping clip stands in for it — that is
     what puts the unit title on the stereo and makes the wheel buttons work.
     Generated rather than shipped, so there is no audio file to cache. */
  function silentWav() {
    var seconds = 1, rate = 8000, n = seconds * rate;
    var buf = new ArrayBuffer(44 + n), view = new DataView(buf);
    function str(off, s) { for (var i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); }
    str(0, 'RIFF'); view.setUint32(4, 36 + n, true); str(8, 'WAVE');
    str(12, 'fmt '); view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, rate, true); view.setUint32(28, rate, true);
    view.setUint16(32, 1, true); view.setUint16(34, 8, true);
    str(36, 'data'); view.setUint32(40, n, true);
    for (var i = 0; i < n; i++) view.setUint8(44 + i, 128);   // 8-bit silence
    var bytes = new Uint8Array(buf), bin = '';
    for (var j = 0; j < bytes.length; j++) bin += String.fromCharCode(bytes[j]);
    return 'data:audio/wav;base64,' + btoa(bin);
  }

  function startSilent() {
    if (silent) { silent.play().catch(function () {}); return; }
    try {
      silent = new Audio(silentWav());
      silent.loop = true;
      silent.volume = 0.001;         // not zero: some builds treat 0 as "not playing"
      silent.play().catch(function () { /* needs a gesture; the button is one */ });
    } catch (e) { silent = null; }
  }

  function stopSilent() {
    if (!silent) return;
    try { silent.pause(); } catch (e) { /* ignore */ }
    silent = null;
  }

  function setPlaybackState(state) {
    if (navigator.mediaSession) {
      try { navigator.mediaSession.playbackState = state; } catch (e) { /* ignore */ }
    }
  }

  function updateMediaSession() {
    if (!navigator.mediaSession || !window.MediaMetadata || !mod) return;
    var les = currentLesson();
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: les ? ('Lesson ' + les.n + ': ' + les.lesson.title) : mod.title,
        artist: 'Old Mate · Weld Academy',
        album: mod.title
      });
      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    } catch (e) { /* metadata is a nicety, not a requirement */ }

    var handlers = {
      play: function () { if (!playing) play(); },
      pause: function () { if (playing) pause(); },
      nexttrack: nextLesson,
      previoustrack: prevLesson,
      stop: stop
    };
    Object.keys(handlers).forEach(function (k) {
      try { navigator.mediaSession.setActionHandler(k, handlers[k]); } catch (e) { /* unsupported action */ }
    });
  }

  function clearMediaSession() {
    if (!navigator.mediaSession) return;
    ['play', 'pause', 'nexttrack', 'previoustrack', 'stop'].forEach(function (k) {
      try { navigator.mediaSession.setActionHandler(k, null); } catch (e) { /* ignore */ }
    });
    try { navigator.mediaSession.playbackState = 'none'; } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------- wake lock */

  function requestWakeLock() {
    if (!navigator.wakeLock || wakeLock) return;
    navigator.wakeLock.request('screen').then(function (l) {
      wakeLock = l;
      l.addEventListener('release', function () { wakeLock = null; });
    }).catch(function () { /* denied or unsupported — the media session may carry it */ });
  }

  function releaseWakeLock() {
    if (!wakeLock) return;
    try { wakeLock.release(); } catch (e) { /* ignore */ }
    wakeLock = null;
  }

  // Android drops the lock when the tab is hidden; take it back on return.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && playing) requestWakeLock();
  });

  /* --------------------------------------------------------------- events */

  function startTicker() {
    stopTicker();
    tick = setInterval(function () { if (playing) emit(); }, 1000);
  }
  function stopTicker() { if (tick) { clearInterval(tick); tick = null; } }

  function onChange(fn) { listeners.push(fn); }
  function offChange(fn) { listeners = listeners.filter(function (f) { return f !== fn; }); }
  function emit() {
    var p = position();
    listeners.forEach(function (fn) { try { fn(p); } catch (e) { /* carry on */ } });
  }

  return {
    supported: supported,
    build: build,
    play: play, pause: pause, toggle: toggle, stop: stop,
    nextLesson: nextLesson, prevLesson: prevLesson, seek: seek,
    position: position,
    saved: saved, resumeAt: resumeAt,
    setCreditHandler: setCreditHandler,
    onChange: onChange, offChange: offChange,
    isPlaying: function () { return playing; },
    lineCount: function () { return lines.length; },
    lessonMarks: function () { return marks.slice(); }
  };
})();

/* ============================================================================
 * WELD ACADEMY — NARRATOR
 * ----------------------------------------------------------------------------
 * Reads the theory out loud so she can study in the ute, at the sink, or with
 * the phone in a pocket.
 *
 * Uses the browser's own speech synthesis — the same voice engine the phone
 * already has. No audio files, no API, no account, and on Android the offline
 * voices keep working with no signal.
 *
 * It reads sentence by sentence rather than in one blob, which buys three
 * things: the current sentence can be highlighted on screen, Pause and Skip
 * are instant, and Android's ~15 second utterance cut-off never bites.
 * ==========================================================================*/

window.WA_NARRATOR = (function () {
  'use strict';

  var synth = window.speechSynthesis || null;
  var sentences = [];          // [{ text, el }]
  var index = 0;
  var playing = false;
  var paused = false;
  var voice = null;
  var rate = 1;
  var listeners = [];
  var keepAlive = null;

  function supported() { return !!synth; }

  /* ------------------------------------------------------------- settings */

  function loadPrefs() {
    try {
      rate = parseFloat(localStorage.getItem('weldAcademy.readRate')) || 1;
    } catch (e) { rate = 1; }
    return { rate: rate };
  }

  function setRate(r) {
    rate = r;
    try { localStorage.setItem('weldAcademy.readRate', String(r)); } catch (e) { /* ignore */ }
    if (playing) { var at = index; stop(); play(at); }     // restart at the same spot
  }

  function getRate() { return rate; }

  /* Prefer a local (offline) English voice, and an Australian one if there is
     one, since that is who is talking. */
  function pickVoice() {
    if (!synth) return null;
    var voices = synth.getVoices() || [];
    if (!voices.length) return null;
    var en = voices.filter(function (v) { return /^en/i.test(v.lang); });
    var pool = en.length ? en : voices;
    return pool.filter(function (v) { return /en[-_]AU/i.test(v.lang) && v.localService; })[0]
        || pool.filter(function (v) { return /en[-_]AU/i.test(v.lang); })[0]
        || pool.filter(function (v) { return /en[-_](GB|NZ)/i.test(v.lang) && v.localService; })[0]
        || pool.filter(function (v) { return v.localService; })[0]
        || pool[0];
  }

  function voices() {
    if (!synth) return [];
    return (synth.getVoices() || []).filter(function (v) { return /^en/i.test(v.lang); });
  }

  function setVoiceByName(name) {
    voice = voices().filter(function (v) { return v.name === name; })[0] || null;
    try { localStorage.setItem('weldAcademy.readVoice', name || ''); } catch (e) { /* ignore */ }
    if (playing) { var at = index; stop(); play(at); }
  }

  function currentVoiceName() { return voice ? voice.name : ''; }

  function ensureVoice() {
    if (voice) return;
    var saved = '';
    try { saved = localStorage.getItem('weldAcademy.readVoice') || ''; } catch (e) { /* ignore */ }
    voice = (saved && voices().filter(function (v) { return v.name === saved; })[0]) || pickVoice();
  }

  /* --------------------------------------------------------------- script */

  /* Build the running order from elements on the page. Each element's text is
     split into sentences so highlighting and skipping work at that grain. */
  function setScript(elements) {
    stop();
    sentences = [];
    elements.forEach(function (el) {
      var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) return;
      // Split on sentence ends, keeping abbreviations and decimals intact.
      var parts = text.match(/[^.!?]+(?:[.!?]+(?!\d)|$)/g) || [text];
      parts.forEach(function (p) {
        var t = p.trim();
        if (t.length > 1) sentences.push({ text: t, el: el });
      });
    });
    emit();
    return sentences.length;
  }

  function hasScript() { return sentences.length > 0; }
  function progress() { return { index: index, total: sentences.length }; }

  /* ------------------------------------------------------------ playback */

  function speakCurrent() {
    if (!synth || index >= sentences.length) { finish(); return; }
    ensureVoice();

    var u = new SpeechSynthesisUtterance(sentences[index].text);
    if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = 1;
    u.lang = (voice && voice.lang) || 'en-AU';

    u.onend = function () {
      if (!playing) return;
      index += 1;
      emit();
      if (index < sentences.length) speakCurrent();
      else finish();
    };

    u.onerror = function (e) {
      // "interrupted" and "canceled" are us calling stop(); anything else, move on.
      if (!playing || (e && (e.error === 'interrupted' || e.error === 'canceled'))) return;
      index += 1;
      if (index < sentences.length) speakCurrent(); else finish();
    };

    synth.speak(u);
  }

  function play(from) {
    if (!synth || !sentences.length) return;
    if (paused && from == null) { resume(); return; }
    if (from != null) index = Math.max(0, Math.min(from, sentences.length - 1));
    synth.cancel();
    playing = true;
    paused = false;
    startKeepAlive();
    emit();
    speakCurrent();
  }

  function pause() {
    if (!synth || !playing) return;
    synth.pause();
    paused = true;
    emit();
  }

  function resume() {
    if (!synth || !paused) return;
    synth.resume();
    paused = false;
    emit();
  }

  function toggle() {
    if (!playing) play();
    else if (paused) resume();
    else pause();
  }

  function stop() {
    playing = false;
    paused = false;
    stopKeepAlive();
    if (synth) synth.cancel();
    emit();
  }

  function finish() {
    playing = false;
    paused = false;
    index = 0;
    stopKeepAlive();
    emit();
  }

  function skip(delta) {
    if (!sentences.length) return;
    var target = Math.max(0, Math.min(index + delta, sentences.length - 1));
    if (playing) play(target);
    else { index = target; emit(); }
  }

  /* Desktop Chrome stops speaking after ~15 s unless nudged. Harmless on
     mobile, and it stops the moment we do. */
  function startKeepAlive() {
    stopKeepAlive();
    keepAlive = setInterval(function () {
      if (!playing || paused || !synth) return;
      if (synth.speaking) { synth.pause(); synth.resume(); }
    }, 10000);
  }

  function stopKeepAlive() {
    if (keepAlive) { clearInterval(keepAlive); keepAlive = null; }
  }

  /* -------------------------------------------------------------- events */

  function onChange(fn) { listeners.push(fn); }
  function offChange(fn) { listeners = listeners.filter(function (f) { return f !== fn; }); }

  function emit() {
    var s = status();
    listeners.forEach(function (fn) { try { fn(s); } catch (e) { /* a listener died, carry on */ } });
  }

  function status() {
    return {
      supported: supported(),
      playing: playing,
      paused: paused,
      index: index,
      total: sentences.length,
      current: sentences[index] || null,
      rate: rate,
      voiceName: currentVoiceName()
    };
  }

  /* Some browsers populate voices asynchronously. */
  if (synth && typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', function () { voice = null; ensureVoice(); emit(); });
  }

  return {
    supported: supported,
    loadPrefs: loadPrefs,
    setScript: setScript,
    hasScript: hasScript,
    play: play, pause: pause, resume: resume, toggle: toggle, stop: stop, skip: skip,
    status: status, progress: progress,
    onChange: onChange, offChange: offChange,
    voices: voices, setVoiceByName: setVoiceByName, currentVoiceName: currentVoiceName,
    setRate: setRate, getRate: getRate
  };
})();

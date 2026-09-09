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
      persona = localStorage.getItem('weldAcademy.readPersona') || 'wise';
      // Rate follows the persona until she sets one herself.
      var saved = parseFloat(localStorage.getItem('weldAcademy.readRate'));
      rate = saved || currentPersona().rate;
    } catch (e) { persona = 'wise'; rate = currentPersona().rate; }
    return { rate: rate, persona: persona };
  }

  function setRate(r) {
    rate = r;
    try { localStorage.setItem('weldAcademy.readRate', String(r)); } catch (e) { /* ignore */ }
    if (playing) { var at = index; stop(); play(at); }     // restart at the same spot
  }

  function getRate() { return rate; }

  /* --------------------------------------------------------------- personas
   *
   * Two one-tap defaults for who is reading. The speech engine only gives us
   * a voice, a rate and a pitch — it cannot act — so a persona is exactly
   * that: which installed voice to reach for first, and how to set it.
   *
   *   wise  — low and unhurried. A bloke who knows the job and is not in a
   *           rush to prove it. This is Old Mate, and the default.
   *   easy  — a touch brighter and quicker, same knowledge, different read.
   *
   * Either can be overridden to any installed voice from Settings; the
   * persona only decides where the automatic pick starts looking. */
  var PERSONAS = {
    wise: {
      id: 'wise', name: 'Old & wise',
      blurb: 'Low, unhurried. Sounds like he has done it for thirty years.',
      pitch: 0.88, rate: 0.95, want: 'male'
    },
    easy: {
      id: 'easy', name: 'Warm & easy',
      blurb: 'Brighter and a bit quicker. Same knowledge, lighter delivery.',
      pitch: 1.05, rate: 1.0, want: 'female'
    }
  };
  var persona = 'wise';

  function personas() {
    return Object.keys(PERSONAS).map(function (k) { return PERSONAS[k]; });
  }
  function currentPersona() { return PERSONAS[persona] || PERSONAS.wise; }

  function setPersona(id) {
    if (!PERSONAS[id]) return;
    persona = id;
    try { localStorage.setItem('weldAcademy.readPersona', id); } catch (e) { /* ignore */ }
    // The persona picks a different voice, so drop the automatic one and let
    // it be chosen again. An explicitly chosen voice is left alone.
    var explicit = '';
    try { explicit = localStorage.getItem('weldAcademy.readVoice') || ''; } catch (e) { /* ignore */ }
    if (!explicit) voice = null;
    ensureVoice();
    if (playing) { var at = index; stop(); play(at); }
    emit();
  }

  /* The Web Speech API exposes no gender field at all, so this reads the names
     the common engines actually ship. Android's Google voices are named by
     opaque code — en-au-x-aub-network and the like — and the codes below are
     the ones observed to be male. It is a best-effort hint and it is wrong on
     some devices, which is exactly why Settings lets her audition every voice
     and override it: the picker is the real answer, this only sets the
     opening guess. */
  var MALE_HINTS = /\b(male|man)\b|google uk english male|daniel|arthur|oliver|james|george|russell|lee|rishi|alex|fred|aaron|gordon|\bx-(aub|aud|gbb|gbd|iom|tpd)\b|#male/i;
  var FEMALE_HINTS = /\b(female|woman)\b|google uk english female|karen|serena|kate|fiona|moira|tessa|samantha|catherine|martha|\bx-(aua|auc|gba|gbc|iob|iog|iol|tpc)\b|#female/i;

  /* ANDROID NAMING, SO THE QUALITY SORT BELOW MAKES SENSE.
     Google's TTS ships each voice twice: "-local" is the small offline one
     and it is the one that sounds like a robot; "-network" is the natural
     one. The API reports that split as `localService`. */
  function isNatural(v) { return !v.localService; }

  function pickVoice() {
    if (!synth) return null;
    var all = synth.getVoices() || [];
    if (!all.length) return null;
    var en = all.filter(function (v) { return /^en/i.test(v.lang); });
    var pool = en.length ? en : all;
    var want = currentPersona().want;
    var hint = want === 'female' ? FEMALE_HINTS : MALE_HINTS;
    var avoid = want === 'female' ? MALE_HINTS : FEMALE_HINTS;

    /* QUALITY BEFORE OFFLINE — this was the wrong way round and it is why he
       sounded like a robot. Preferring localService looks sensible for an app
       built to work in a shed with no signal, but on Android localService is
       the compact voice, so the old order picked the worst-sounding option on
       the phone every single time. Natural first now; the offline ones are
       still here as the fallback, and Settings labels which is which so she
       can deliberately pick an offline one before a long drive. */
    function best(list) {
      function pick(langRe) {
        return list.filter(function (v) { return langRe.test(v.lang) && isNatural(v); })[0]
            || list.filter(function (v) { return langRe.test(v.lang); })[0];
      }
      return pick(/en[-_]AU/i)
          || pick(/en[-_](GB|NZ)/i)
          || list.filter(isNatural)[0]
          || list[0];
    }

    var wanted = pool.filter(function (v) { return hint.test(v.name); });
    var neutral = pool.filter(function (v) { return !hint.test(v.name) && !avoid.test(v.name); });
    return best(wanted) || best(neutral) || best(pool);
  }

  function voices() {
    if (!synth) return [];
    return (synth.getVoices() || []).filter(function (v) { return /^en/i.test(v.lang); });
  }

  var ACCENTS = [
    [/en[-_]AU/i, 'Australian'], [/en[-_]GB/i, 'British'], [/en[-_]NZ/i, 'New Zealand'],
    [/en[-_]IE/i, 'Irish'], [/en[-_]US/i, 'American'], [/en[-_]CA/i, 'Canadian'],
    [/en[-_]IN/i, 'Indian'], [/en[-_]ZA/i, 'South African']
  ];

  /* Raw voice names are things like "en-au-x-aub-network", which tells her
     nothing. This turns one into the three facts she actually chooses on:
     where it sounds like it is from, whether it sounds natural, and the
     best guess at whether it is a bloke. */
  function describe(v) {
    var accent = 'English';
    for (var i = 0; i < ACCENTS.length; i++) {
      if (ACCENTS[i][0].test(v.lang)) { accent = ACCENTS[i][1]; break; }
    }
    return {
      name: v.name,
      accent: accent,
      natural: isNatural(v),
      quality: isNatural(v) ? 'natural' : 'robotic, works offline',
      gender: MALE_HINTS.test(v.name) ? 'male'
            : FEMALE_HINTS.test(v.name) ? 'female' : 'unknown'
    };
  }

  /* Settings needs to be able to say "your phone has no male English voice
     on it" out loud, because when that is true no amount of picking fixes
     it — she has to install one from the phone's own settings. */
  function maleVoiceCount() {
    return voices().filter(function (v) { return MALE_HINTS.test(v.name); }).length;
  }

  /* Speak one line in a named voice without disturbing whatever is queued —
     this is what makes the picker an audition rather than a guess. */
  function sample(name, text) {
    if (!synth) return;
    var v = voices().filter(function (x) { return x.name === name; })[0];
    try { synth.cancel(); } catch (e) { /* ignore */ }
    var u = new SpeechSynthesisUtterance(text || 'Hold the arc about one electrode diameter off the work, and keep it moving.');
    if (v) { u.voice = v; u.lang = v.lang; }
    var p = currentPersona();
    u.pitch = p.pitch; u.rate = p.rate;
    synth.speak(u);
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
  /* Accepts DOM elements (screen reading, so the current sentence can be
     highlighted) or plain { text } entries (Drive Mode, where there is no
     screen to highlight).

     Either way the text is run through WA_SCRIPT.forSpeech first, so "3.2 mm"
     is spoken as "three point two millimetres" rather than "three point two em
     em". The element is kept for highlighting; only what is spoken changes. */
  function setScript(elements) {
    stop();
    sentences = [];
    var speakable = window.WA_SCRIPT && window.WA_SCRIPT.forSpeech;

    elements.forEach(function (el) {
      var raw = (el.text != null ? el.text : (el.textContent || ''));
      raw = String(raw).replace(/\s+/g, ' ').trim();
      if (!raw) return;
      var text = speakable ? window.WA_SCRIPT.forSpeech(raw) : raw;
      if (!text) return;
      // Split on sentence ends, keeping abbreviations and decimals intact.
      var parts = text.match(/[^.!?]+(?:[.!?]+(?!\d)|$)/g) || [text];
      parts.forEach(function (p) {
        var t = p.trim();
        if (t.length > 1) sentences.push({ text: t, el: el.nodeType ? el : null });
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
    u.pitch = currentPersona().pitch;
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
      voiceName: currentVoiceName(),
      persona: persona
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
    describe: describe, maleVoiceCount: maleVoiceCount, sample: sample,
    setRate: setRate, getRate: getRate,
    personas: personas, setPersona: setPersona, currentPersona: currentPersona
  };
})();

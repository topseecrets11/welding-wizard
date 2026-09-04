/* ============================================================================
 * WELD ACADEMY — HER PROFILE
 * ----------------------------------------------------------------------------
 * A two-minute, honest questionnaire that changes three things:
 *
 *   1. HOW Old Mate teaches   — chunk size, depth, how much he pushes, which
 *                               lesson mode opens first.
 *   2. HOW he talks           — brief and blunt, or warm and encouraging.
 *   3. HOW it looks           — the whole app recolours to her.
 *
 * What it is NOT: a personality test that claims to know her. It is a set of
 * preferences she states plainly, applied literally. No horoscope.
 * ==========================================================================*/

window.WA_PROFILE = (function () {
  'use strict';

  /* ------------------------------------------------------------ questions */

  var QUESTIONS = [
    {
      id: 'pace',
      q: 'When you learn something new, what actually happens?',
      opts: [
        { v: 'fast',   label: 'I want it now',        sub: 'Give me the short version and let me have a go' },
        { v: 'steady', label: 'I take my time',       sub: 'Let me understand it before I touch anything' },
        { v: 'mixed',  label: 'Depends on the day',   sub: 'Sometimes flat out, sometimes slow' }
      ]
    },
    {
      id: 'depth',
      q: 'Do you want to know WHY, or just what to do?',
      opts: [
        { v: 'just-do', label: 'Just what to do',     sub: 'Tell me the setting, I will trust you' },
        { v: 'why',     label: 'I want the why',      sub: 'It sticks better when I understand it' },
        { v: 'both',    label: 'What first, why after', sub: 'Get me going, then explain it' }
      ]
    },
    {
      id: 'patience',
      q: 'Honestly — how is your patience with a screen?',
      opts: [
        { v: 'low',  label: 'Thin',      sub: 'Long pages and I am gone' },
        { v: 'mid',  label: 'All right', sub: 'If it is going somewhere, I will stay' },
        { v: 'high', label: 'Good',      sub: 'I will read the lot if it is worth reading' }
      ]
    },
    {
      id: 'push',
      q: 'When you get something wrong, what helps?',
      opts: [
        { v: 'blunt',  label: 'Tell me straight',   sub: 'No sugar-coating, just fix me' },
        { v: 'warm',   label: 'A bit of a lift',    sub: 'Tell me what I did right first' },
        { v: 'quiet',  label: 'Just the answer',    sub: 'Skip the commentary either way' }
      ]
    },
    {
      id: 'motivator',
      q: 'What actually keeps you coming back?',
      opts: [
        { v: 'money',   label: 'The money',        sub: 'Show me what this is worth' },
        { v: 'mastery', label: 'Getting good',     sub: 'I want to be the one who knows' },
        { v: 'streak',  label: 'Not breaking a run', sub: 'Once I start a streak I cannot drop it' },
        { v: 'proof',   label: 'Proof I did it',   sub: 'Badges, photos, something to show' }
      ]
    },
    {
      id: 'hands',
      q: 'Where do you learn best?',
      opts: [
        { v: 'bench',  label: 'Hands on it',   sub: 'I learn by doing, not reading' },
        { v: 'watch',  label: 'Seeing it',     sub: 'Show me a picture and I have got it' },
        { v: 'read',   label: 'Reading it',    sub: 'Words are fine by me' },
        { v: 'listen', label: 'Being told',    sub: 'Read it to me while I work' }
      ]
    },
    {
      id: 'when',
      q: 'When will you actually open this?',
      opts: [
        { v: 'moving', label: 'On the move',   sub: 'In the ute, waiting somewhere' },
        { v: 'shed',   label: 'At the bench',  sub: 'Mid-job, needing an answer' },
        { v: 'couch',  label: 'Sat down',      sub: 'End of the day, feet up' }
      ]
    },
    {
      id: 'colour',
      q: 'Last one. Pick your colours.',
      opts: [
        { v: 'arc',    label: 'Arc amber',   sub: 'Orange on black — the default' },
        { v: 'copper', label: 'Copper',      sub: 'Warm rose and bronze' },
        { v: 'molten', label: 'Molten',      sub: 'Hot red and deep charcoal' },
        { v: 'steel',  label: 'Cold steel',  sub: 'Blue-grey and ice' },
        { v: 'gold',   label: 'Gold',        sub: 'Bullion yellow on near-black' },
        { v: 'acid',   label: 'Acid green',  sub: 'Bright green, high contrast' }
      ]
    }
  ];

  /* --------------------------------------------------------------- themes */

  var THEMES = {
    arc:    { name: 'Arc amber',  accent: '#ff9f1c', accent2: '#ffc266', glow: '255,159,28',  tint: '#33260f' },
    copper: { name: 'Copper',     accent: '#e08a5b', accent2: '#f5b48c', glow: '224,138,91',  tint: '#33221a' },
    molten: { name: 'Molten',     accent: '#ff5f45', accent2: '#ff9179', glow: '255,95,69',   tint: '#331a15' },
    steel:  { name: 'Cold steel', accent: '#5aa9e6', accent2: '#98cdf3', glow: '90,169,230',  tint: '#16283a' },
    gold:   { name: 'Gold',       accent: '#e8c23a', accent2: '#f6dd85', glow: '232,194,58',  tint: '#332c11' },
    acid:   { name: 'Acid green', accent: '#5fd67a', accent2: '#9fe9b0', glow: '95,214,122',  tint: '#153322' }
  };

  /* --------------------------------------------------------------- state */

  function answers() {
    var s = window.WA_PROGRESS.settings();
    return s.profile || null;
  }

  function isDone() { return !!answers(); }

  function save(ans) {
    window.WA_PROGRESS.setSetting('profile', ans);
    apply();
    return derive();
  }

  /* Turn the answers into the handful of decisions the app actually makes. */
  function derive() {
    var a = answers() || {};
    var d = {};

    // Which lesson mode opens first.
    d.defaultMode = a.hands === 'bench' ? 'do'
                  : a.hands === 'watch' ? 'show'
                  : a.hands === 'listen' ? 'read'
                  : a.patience === 'low' ? 'guts'
                  : 'read';

    // Short bites, or the full lesson.
    d.shortBites = a.patience === 'low' || a.pace === 'fast';

    // Whether to lead with the why.
    d.wantsWhy = a.depth === 'why' || a.depth === 'both';

    // How Old Mate phrases himself.
    d.tone = a.push || 'warm';

    // What the home screen leads with.
    d.leadWith = a.motivator === 'money' ? 'money'
               : a.motivator === 'streak' ? 'streak'
               : a.motivator === 'proof' ? 'badges'
               : 'progress';

    // Auto-read the lesson when it opens.
    d.autoRead = a.hands === 'listen' || a.when === 'moving';

    d.theme = a.colour || 'arc';
    return d;
  }

  /* Paint the whole app in her colours. */
  function apply() {
    var t = THEMES[(answers() || {}).colour] || THEMES.arc;
    var r = document.documentElement;
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--accent-2', t.accent2);
    r.style.setProperty('--accent-glow', t.glow);
    r.style.setProperty('--accent-tint', t.tint);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#101216');
  }

  /* Old Mate's line for the moment, in the tone she asked for. */
  var LINES = {
    right: {
      blunt: ['Right.', 'Correct.', 'That is the one.'],
      warm:  ['Good on you.', 'That is it exactly.', 'See? You knew that.'],
      quiet: ['Correct.', 'Yes.', 'That is right.']
    },
    wrong: {
      blunt: ['No. Read it again.', 'Wrong. Here is why.', 'Not that one.'],
      warm:  ['Close, but not quite.', 'Not this time — have a look at why.', 'Nearly. This is the bit to remember.'],
      quiet: ['Not quite.', 'No.', 'Incorrect.']
    },
    welcome: {
      blunt: ['Back again. Good.', 'Right, where were we.'],
      warm:  ['Good to see you back.', 'There she is.'],
      quiet: ['Welcome back.', 'Carry on.']
    }
  };

  function line(kind) {
    var tone = derive().tone || 'warm';
    var pool = (LINES[kind] || {})[tone] || (LINES[kind] || {}).warm || [''];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  return {
    QUESTIONS: QUESTIONS,
    THEMES: THEMES,
    answers: answers,
    isDone: isDone,
    save: save,
    derive: derive,
    apply: apply,
    line: line
  };
})();

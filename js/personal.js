/* ============================================================================
 * WELD ACADEMY — THE PERSONAL BITS
 * ----------------------------------------------------------------------------
 * The things in this app that are from Mick rather than from Old Mate.
 *
 * EVERYTHING IN HERE IS A SLOT, NOT A SCRIPT. The wording below is placeholder
 * — deliberately plain and easy to spot — and it is all in one file so it can
 * be replaced without touching a line of app code. Anything personal is his to
 * write; the job here was to build the places for it to live.
 *
 * WHAT IS WIRED UP
 *
 *   HIDDEN NOTE     Press and hold her name on the home screen for two seconds,
 *                   three times. Not on a menu, not signposted, not something
 *                   she would hit by accident — but findable by someone who
 *                   fiddles with the thing she is looking at. Opens full screen,
 *                   is never spoken aloud, and is not written to progress or
 *                   logged anywhere.
 *
 *   UNICORN TILE    The tile that closes out her very first unit only. One
 *                   wink, in one place, so it reads as a wink and not a
 *                   running bit.
 *
 *   MICK CELEBRATES Finishing a whole unit gets the Mr Moneybags treatment
 *                   rather than another badge card — the character slot is
 *                   `character: 'mick'` on the celebration, so dropping real
 *                   art in later is a content change, not a code change.
 * ==========================================================================*/

window.WA_PERSONAL = (function () {
  'use strict';

  /* --------------------------------------------------------- the hidden note
   * Replace the lines below with whatever he wants it to say. It renders as
   * paragraphs in order, so one string per paragraph. */
  var NOTE = {
    signoff: '— M',
    lines: [
      'You found it.',
      'Placeholder, this bit — Mick writes the real one.',
      'Whatever is going on, you are smarter than the average bear and you always were.'
    ]
  };

  function note() { return NOTE; }

  /* How many holds it takes, and how long each has to be. Long enough that a
     normal tap never triggers it, few enough that fiddling gets there. */
  var HOLD_MS = 700;
  var HOLDS_NEEDED = 3;
  var WINDOW_MS = 6000;     // the holds have to be in the same sitting

  /* ------------------------------------------------------------ the unicorn
   * The last tile of the first unit, and nowhere else. */
  var FIRST_UNIT = 'safety';

  function isUnicornLesson(moduleId, lessonId) {
    if (moduleId !== FIRST_UNIT) return false;
    var C = window.WA_CONTENT;
    var m = (C && C.modules || []).filter(function (x) { return x.id === moduleId; })[0];
    if (!m) return false;
    return m.lessons[m.lessons.length - 1].id === lessonId;
  }

  var UNICORN = { emoji: '🦄', line: "Who's a sexy unicorn \u{1F984}" };

  /* The drawing. It was a bare emoji, which made the one wink in the whole app
     look like every other emoji in it. Inline SVG like the dolls, so it is
     sharp at any size and the mane picks up her accent colour — and it is in
     THIS file, so Mick can drop his own art in over the top without touching
     app code. Pass it to celebrate() as `art`. */
  function unicornArt(size) {
    var w = size || 132;
    return '<svg viewBox="0 0 120 120" width="' + w + '" height="' + w + '" ' +
        'role="img" aria-label="A unicorn">' +
      '<defs>' +
        '<linearGradient id="uMane" x1="1" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#f6c2e0"/>' +
          '<stop offset="0.55" stop-color="var(--accent)"/>' +
          '<stop offset="1" stop-color="#8e5bd6"/>' +
        '</linearGradient>' +
        '<linearGradient id="uCoat" x1="0.2" y1="1" x2="0.8" y2="0">' +
          '<stop offset="0" stop-color="#cfc0dd"/>' +
          '<stop offset="0.5" stop-color="#f2ecf7"/>' +
          '<stop offset="1" stop-color="#ffffff"/>' +
        '</linearGradient>' +
        '<linearGradient id="uHorn" x1="0" y1="1" x2="1" y2="0">' +
          '<stop offset="0" stop-color="#c98f22"/>' +
          '<stop offset="0.5" stop-color="#ffd76b"/>' +
          '<stop offset="1" stop-color="#b7791a"/>' +
        '</linearGradient>' +
      '</defs>' +

      /* mane, layered behind everything */
      '<path fill="url(#uMane)" opacity=".9" d="M70 26 C90 30 104 48 101 70 ' +
        'C98 92 84 106 66 111 C79 98 87 82 85 65 C83 48 78 36 70 26 Z"/>' +
      '<path fill="url(#uMane)" opacity=".55" d="M64 24 C82 34 92 52 89 70 ' +
        'C86 88 74 100 58 105 C70 92 76 78 74 62 C72 46 68 33 64 24 Z"/>' +

      /* head and neck */
      '<path fill="url(#uCoat)" d="M24 70 C28 53 39 40 52 31 ' +
        'C58 27 65 27 69 32 C76 39 80 51 78 63 C76 76 68 87 55 90 ' +
        'C44 92 33 87 28 80 C25 76 23 73 24 70 Z"/>' +

      /* muzzle shading, nostril, mouth */
      '<path fill="#d9cbe6" opacity=".7" d="M24 70 C27 62 32 56 38 51 ' +
        'C34 60 31 68 31 77 C28 76 25 73 24 70 Z"/>' +
      '<ellipse cx="31" cy="70" rx="2.6" ry="3.4" fill="#8d7aa0" transform="rotate(-18 31 70)"/>' +
      '<path stroke="#8d7aa0" stroke-width="1.6" fill="none" stroke-linecap="round" d="M27 78 q5 2 9 -1"/>' +

      /* the eye, with the lashes doing all the work */
      '<ellipse cx="52" cy="52" rx="4.6" ry="5.2" fill="#241a2e" transform="rotate(-12 52 52)"/>' +
      '<circle cx="53.6" cy="50" r="1.5" fill="#fff" opacity=".9"/>' +
      '<path stroke="#241a2e" stroke-width="2" fill="none" stroke-linecap="round" ' +
        'd="M46 45 q6 -5 13 -2 M45 42 l-4 -3 M50 40 l-2 -4 M56 40 l1 -4"/>' +

      /* ear */
      '<path fill="url(#uCoat)" d="M70 32 C74 22 81 19 84 23 C86 29 80 36 74 37 Z"/>' +
      '<path fill="#c9b8da" d="M73 32 C76 26 80 24 81 26 C82 30 78 34 75 35 Z"/>' +

      /* the horn */
      '<path fill="url(#uHorn)" d="M60 30 L69 1 L76 29 Z"/>' +
      '<path stroke="#8a5f10" stroke-width="1.1" fill="none" opacity=".55" stroke-linecap="round" ' +
        'd="M62 25 l12 -1 M64 19 l9 -1 M66 13 l6 -1"/>' +

      /* a bit of sparkle, because that is the entire point of the joke */
      '<path fill="var(--accent)" d="M96 22 l1.8 4.4 4.4 1.8 -4.4 1.8 -1.8 4.4 -1.8 -4.4 -4.4 -1.8 4.4 -1.8 Z"/>' +
      '<path fill="var(--accent)" opacity=".7" d="M18 34 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 Z"/>' +
      '<path fill="#fff" opacity=".8" d="M88 100 l1 2.6 2.6 1 -2.6 1 -1 2.6 -1 -2.6 -2.6 -1 2.6 -1 Z"/>' +
    '</svg>';
  }

  function unicorn() { return UNICORN; }

  /* --------------------------------------------------- Mick's unit sign-offs
   * Shown under the unit-complete celebration. One per unit where there is
   * something to say, and nothing where there is not — an empty string just
   * leaves the celebration as Old Mate's. */
  var UNIT_NOTES = {
    safety: 'First one down. Told you.',
    smaw:   'You can strike an arc now. That is a real thing to be able to do.',
    salvage: 'This is the one that pays for itself.'
  };

  function unitNote(moduleId) { return UNIT_NOTES[moduleId] || ''; }

  /* --------------------------------------------------------------- wiring
   * Attaches the press-and-hold to an element. Returns a teardown function.
   * The counter lives here rather than in storage, so it resets when she
   * leaves the page and there is nothing to find in the saved data. */
  function attachHiddenNote(el, onOpen) {
    if (!el) return function () {};
    var holds = 0;
    var first = 0;
    var timer = null;

    function down() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var now = Date.now();
        if (!first || now - first > WINDOW_MS) { first = now; holds = 0; }
        holds++;
        if (holds >= HOLDS_NEEDED) { holds = 0; first = 0; onOpen(); }
      }, HOLD_MS);
    }
    function up() { clearTimeout(timer); }

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', up);
    el.addEventListener('pointercancel', up);
    // Stop the long-press turning into a text selection or a context menu.
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    return function () {
      clearTimeout(timer);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointerleave', up);
      el.removeEventListener('pointercancel', up);
    };
  }

  return {
    note: note,
    unicorn: unicorn,
    unicornArt: unicornArt,
    isUnicornLesson: isUnicornLesson,
    unitNote: unitNote,
    attachHiddenNote: attachHiddenNote,
    HOLD_MS: HOLD_MS,
    HOLDS_NEEDED: HOLDS_NEEDED
  };
})();

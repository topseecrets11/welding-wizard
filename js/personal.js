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

  var UNICORN = { emoji: '🦄', line: "Who's a sexy unicorn 🦄" };

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
    isUnicornLesson: isUnicornLesson,
    unitNote: unitNote,
    attachHiddenNote: attachHiddenNote,
    HOLD_MS: HOLD_MS,
    HOLDS_NEEDED: HOLDS_NEEDED
  };
})();

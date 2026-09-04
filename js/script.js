/* ============================================================================
 * WELD ACADEMY — SPOKEN SCRIPTS
 * ----------------------------------------------------------------------------
 * Turning a lesson into something that makes sense with the phone face-down
 * in a cup holder.
 *
 * Reading a page aloud verbatim does not work. Three things break:
 *
 *   1. NUMBERS AND UNITS. "3.2 mm" comes out as "three point two em em", and
 *      "18 V" as "eighteen vee". Spoken out they have to be words.
 *   2. NO CONNECTIVE TISSUE. On screen, headings and layout tell you where you
 *      are. In audio there is nothing, so it needs saying: what the lesson is,
 *      when the key points start, when it has finished.
 *   3. DIAGRAMS. A picture that is skipped silently leaves a hole in the
 *      explanation, so each one gets a sentence describing what it shows.
 *
 * Everything here is derived from the same lesson content the screen uses —
 * there is no second copy of the course to keep in step.
 * ==========================================================================*/

window.WA_SCRIPT = (function () {
  'use strict';

  /* ------------------------------------------------------- speaking numbers */

  /* Units as a reader would say them, singular and plural spelled out rather
     than derived — the compound ones pluralise in the middle ("litres per
     minute", not "litres per minutes"), so a trailing "s" is not good enough. */
  var UNITS = [
    ['mm/min', 'millimetre per minute', 'millimetres per minute'],
    ['m/min',  'metre per minute',      'metres per minute'],
    ['L/min',  'litre per minute',      'litres per minute'],
    ['kJ/mm',  'kilojoule per millimetre', 'kilojoules per millimetre'],
    ['cfh',    'cubic foot per hour',   'cubic feet per hour'],
    ['mm',     'millimetre',            'millimetres'],
    ['cm',     'centimetre',            'centimetres'],
    ['kg',     'kilogram',              'kilograms'],
    ['°C',     'degree',                'degrees'],
    ['A',      'amp',                   'amps'],
    ['V',      'volt',                  'volts'],
    ['Hz',     'hertz',                 'hertz']
  ];

  function sayNumber(n) {
    // Decimals read as "three point two", which is how a tradesman says it.
    return String(n).replace('.', ' point ');
  }

  /* "3.2 mm" → "three point two millimetres". Ranges keep their "to". */
  function speakNumbers(text) {
    var out = String(text);

    // Ranges first: 12–15 L/min, 90-120 A.
    out = out.replace(/(\d+(?:\.\d+)?)\s*[–—-]\s*(\d+(?:\.\d+)?)\s*([A-Za-z°\/]+)/g,
      function (m, a, b, unit) {
        var u = unitWord(unit, true);
        return u ? sayNumber(a) + ' to ' + sayNumber(b) + ' ' + u : m;
      });

    /* Then plain "number unit". A measurement used as an adjective stays
       singular the way it is spoken — "a six millimetre fillet", not "a six
       millimetres fillet" — which means looking at what follows it. Connective
       words do not count as the noun. */
    out = out.replace(/(\d+(?:\.\d+)?)\s*([A-Za-z°\/]+)(\s+[a-z]+)?/g, function (m, n, unit, after) {
      var u = unitWord(unit, parseFloat(n) !== 1 && !isAdjectival(after));
      return u ? sayNumber(n) + ' ' + u + (after || '') : m;
    });

    // Bare decimals that were not followed by a unit.
    out = out.replace(/(\d)\.(\d)/g, '$1 point $2');
    return out;
  }

  /* Words that can follow a measurement without it becoming an adjective —
     "90 amps and rising" is still plural, "90 amp setting" is not. */
  var CONNECTIVES = /^(and|or|of|in|on|at|to|with|for|from|but|so|then|when|if|per|up|down|is|are|was|were|will|would|can|should|through|over|under|into|across|before|after|while|as|than|that|this|these|those|the|a|an|it|its|you|your|he|she|they)$/;

  function isAdjectival(after) {
    if (!after) return false;
    return !CONNECTIVES.test(after.trim());
  }

  function unitWord(unit, plural) {
    for (var i = 0; i < UNITS.length; i++) {
      // Case-sensitive for the single letters, so "A" (amps) is not matched by
      // a stray "a" and "V" is not matched by "v".
      var token = UNITS[i][0];
      var same = token.length <= 2 && /^[A-Za-z°]+$/.test(token)
        ? token === unit
        : token.toLowerCase() === unit.toLowerCase();
      if (same) return plural ? UNITS[i][2] : UNITS[i][1];
    }
    return null;    // not a unit we know — leave the text alone
  }

  /* ------------------------------------------------------ tidying for speech */

  /* Things that read fine but sound wrong. */
  var SPOKEN = [
    [/\bAS\/NZS\b/g, 'A S, N Z S'],
    [/\bWPS\b/g, 'W P S'],
    [/\bPQR\b/g, 'P Q R'],
    [/\bSMAW\b/g, 'stick welding'],
    [/\bGMAW\b/g, 'MIG welding'],
    [/\bGTAW\b/g, 'TIG welding'],
    [/\bMIG\b/g, 'mig'],
    [/\bTIG\b/g, 'tig'],
    [/\bPPE\b/g, 'P P E'],
    [/\bDCEN\b/g, 'D C electrode negative'],
    [/\bDCEP\b/g, 'D C electrode positive'],
    [/\bHAZ\b/g, 'heat affected zone'],
    [/\be\.g\./gi, 'for example'],
    [/\bi\.e\./gi, 'that is'],
    [/\betc\.?/gi, 'and so on'],
    [/\bvs\.?\b/gi, 'versus'],
    [/\bapprox\.?/gi, 'roughly'],
    [/&/g, ' and '],
    [/\*\*/g, ''],           // the markdown bold the screen renders
    [/\s+/g, ' ']
  ];

  function forSpeech(text) {
    var out = speakNumbers(String(text || ''));
    SPOKEN.forEach(function (r) { out = out.replace(r[0], r[1]); });
    return out.trim();
  }

  /* --------------------------------------------------------------- diagrams */

  /* A diagram that is silently skipped leaves a hole in the explanation, so
     each gets a sentence. Keyed to the ids in js/diagrams.js. */
  var DIAGRAM_WORDS = {
    joints: 'The five joint types, side on: butt, lap, tee, corner and edge.',
    positions: 'The welding positions, from flat through horizontal and vertical to overhead.',
    'fillet-size': 'A fillet weld in cross-section, showing leg length and throat thickness.',
    symbol: 'A welding symbol on a drawing, and what each part of it is telling you.',
    'bead-faults': 'Good and bad beads side by side, with the faults marked.',
    'arc-length': 'Arc length compared: too short, about right, and too long.',
    'push-drag': 'The same joint pushed and dragged, and what each does to penetration.',
    stickout: 'Wire stickout from the contact tip, short and long, and the effect on the arc.',
    transfer: 'The metal transfer modes, from short circuit through globular to spray.',
    tungsten: 'Tungsten grinding: ground along its length, not around, and the taper for the job.',
    'ac-cleaning': 'The alternating current cycle on aluminium, and where the oxide cleaning happens.',
    'tig-hands': 'Both hands in a tig weld: torch angle in one, filler feeding into the leading edge.',
    backstep: 'The backstep sequence, and how welding away from the joint controls distortion.',
    'pipe-positions': 'The pipe test positions: one G, two G, five G and six G.'
  };

  function diagramLine(id) { return DIAGRAM_WORDS[id] || null; }

  /* ---------------------------------------------------------------- lessons */

  /* One lesson as an ordered list of things to say. Each entry is
     { text, kind } — kind lets the caller style or skip parts of it. */
  function lesson(mod, les, opts) {
    opts = opts || {};
    var out = [];
    var idx = mod.lessons.indexOf(les) + 1;

    function push(kind, text) {
      var t = forSpeech(text);
      if (t) out.push({ kind: kind, text: t });
    }

    if (opts.announce !== false) {
      push('intro', 'Lesson ' + idx + ' of ' + mod.lessons.length + '. ' + les.title + '.');
    }
    if (les.blurb) push('intro', les.blurb);

    (les.body || []).forEach(function (p) { push('body', p); });

    // Describe whatever the screen would be showing at this point.
    var dias = (window.WA_DIAGRAM_MAP || {})[les.id] || [];
    dias.forEach(function (id) {
      var line = diagramLine(id);
      if (line) push('diagram', 'Picture this. ' + line);
    });

    if ((les.keyPoints || []).length) {
      push('recap', 'The bits worth remembering.');
      les.keyPoints.forEach(function (k) { push('recap', k); });
    }

    if (les.tip) push('tip', 'One last thing. ' + les.tip);

    // The bench drill is the point of the lesson, so it gets said out loud.
    var pr = (window.WA_PRACTICE || {})[les.id];
    if (pr && pr.practice && opts.drill !== false) {
      push('drill', 'When you are next at the bench: ' + pr.practice.task);
    }

    return out;
  }

  /* A whole unit, topped and tailed, for listening end to end in the car. */
  function unit(mod) {
    var out = [];
    out.push({ kind: 'intro', text: forSpeech('Unit ' + mod.title + '. ' + mod.lessons.length + ' lessons.') });
    if (mod.blurb) out.push({ kind: 'intro', text: forSpeech(mod.blurb) });

    mod.lessons.forEach(function (les, i) {
      out = out.concat(lesson(mod, les));
      if (i < mod.lessons.length - 1) {
        out.push({ kind: 'link', text: 'That was lesson ' + (i + 1) + '. Next one coming up.' });
      }
    });

    out.push({ kind: 'outro', text: forSpeech(
      'That is the end of ' + mod.title + '. When you are off the road, ' +
      'have a go at the questions and see what stuck.') });
    return out;
  }

  /* Rough spoken length, for the timestamp readout. Speech runs about 150
     words a minute at rate 1; the caller scales by the actual rate. */
  function seconds(lines) {
    var words = lines.reduce(function (n, l) { return n + l.text.split(/\s+/).length; }, 0);
    return Math.round((words / 150) * 60);
  }

  return {
    forSpeech: forSpeech,
    speakNumbers: speakNumbers,
    diagramLine: diagramLine,
    lesson: lesson,
    unit: unit,
    seconds: seconds
  };
})();

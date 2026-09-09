/* ============================================================================
 * WELD ACADEMY — WHAT THE FAULT ACTUALLY LOOKS LIKE
 * ----------------------------------------------------------------------------
 * Old Mate could name thirteen faults and show her none of them. He would say
 * "that is undercut" to someone who has never seen undercut, which is a
 * dictionary, not a teacher. Every diagnosis now comes with a picture.
 *
 * EVERY ONE IS THE SAME SHAPE: the fault on the left, what it should look like
 * on the right. She is standing at a bench holding the real thing — the only
 * question she actually has is "is mine the left one or the right one?", and a
 * lone drawing of a fault cannot answer that. The pair can.
 *
 * The view is chosen per fault, because faults do not all live in the same
 * place: anything about the shape of the joint is drawn as a cross-section, as
 * though sawn through and etched; anything she would spot looking down at the
 * bead is drawn from above. Getting that wrong would teach her to look in the
 * wrong place.
 *
 * Inline SVG on the same .d-* classes as js/diagrams.js, so these sit in the
 * same visual family as the lesson drawings rather than looking bolted on, and
 * they recolour with her theme for free.
 * ==========================================================================*/

window.WA_DEFECT_ART = (function () {
  'use strict';

  var W = 400, H = 178;
  var PANEL = 186;          // width of each panel
  var RIGHT = 214;          // x origin of the right-hand panel

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* The frame every one of them shares: two panels, labelled, with a rule
     between so the eye reads them as a comparison and not one wide picture. */
  function frame(badInner, goodInner, caption) {
    return '<figure class="diagram diagram--compare">' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" preserveAspectRatio="xMidYMid meet">' +
        '<text class="d-badtext" x="0" y="12" style="font-size:12px;font-weight:700">THE FAULT</text>' +
        '<text class="d-ok" x="' + RIGHT + '" y="12" style="font-size:12px;font-weight:700">RIGHT</text>' +
        '<line class="d-ghost" x1="200" y1="20" x2="200" y2="' + (H - 8) + '"/>' +
        '<g transform="translate(0,20)">' + badInner + '</g>' +
        '<g transform="translate(' + RIGHT + ',20)">' + goodInner + '</g>' +
      '</svg>' +
      (caption ? '<figcaption>' + esc(caption) + '</figcaption>' : '') +
    '</figure>';
  }

  /* ------------------------------------------------------------ primitives
   * All drawn inside a panel's own 0..186 space, so the same helper serves
   * both sides and the two panels line up exactly. */

  // Two plates butted together, sawn through. Gap is the root opening.
  function buttPlates(gap) {
    var g = gap == null ? 10 : gap;
    var mid = PANEL / 2;
    return '<rect class="d-plate" x="14" y="70" width="' + (mid - 14 - g / 2) + '" height="22"/>' +
           '<rect class="d-plate" x="' + (mid + g / 2) + '" y="70" width="' + (PANEL - 14 - mid - g / 2) + '" height="22"/>';
  }

  // A sound bead cap sitting on a butt joint, filling the gap behind it.
  function buttBead(opts) {
    opts = opts || {};
    var mid = PANEL / 2, crown = opts.crown == null ? 12 : opts.crown;
    var root = opts.root === false ? '' :
      '<path class="d-weld" d="M' + (mid - 7) + ' 70 h14 v' + (22 + (opts.through ? 5 : 0)) +
        ' q-7 4 -14 0 z"/>';
    return root +
      '<path class="d-weld" d="M' + (mid - 22) + ' 70 q' + 22 + ' -' + (crown + 6) + ' ' + 44 + ' 0 z"/>';
  }

  // A fillet weld in the corner of a tee, sawn through.
  function filletPlates() {
    return '<rect class="d-plate" x="14" y="96" width="158" height="20"/>' +
           '<rect class="d-plate" x="52" y="26" width="20" height="70"/>';
  }
  function filletBead(face) {
    // face: 'flat' | 'convex' | 'concave'
    var q = face === 'convex' ? 'q6 -6 ' : face === 'concave' ? 'q-8 8 ' : 'q0 0 ';
    return '<path class="d-weld" d="M72 96 L72 52 ' + q + '44 44 Z"/>';
  }

  // Looking down at a run of weld: the bead with its ripple lines.
  function topBead(opts) {
    opts = opts || {};
    var y = 54, ripples = '';
    var n = opts.ripples == null ? 11 : opts.ripples;
    for (var i = 0; i < n; i++) {
      var x = 26 + i * 12 + (opts.wander ? (i % 3) * 2.5 : 0);
      var h = opts.uneven ? 11 + (i % 3) * 5 : 14;
      ripples += '<path class="d-line" d="M' + x + ' ' + (y - h) + ' q6 ' + h + ' 0 ' + (h * 2) + '" opacity=".55"/>';
    }
    var top = opts.wander
      ? 'M18 40 q40 -9 80 2 q40 10 88 -4'
      : 'M18 38 h168';
    var bot = opts.wander
      ? 'M18 70 q40 9 80 -2 q40 -10 88 4'
      : 'M18 70 h168';
    return '<rect class="d-plate" x="0" y="8" width="186" height="92"/>' +
      '<path class="d-weld" d="' + top + ' L186 70 ' + (opts.wander ? bot.replace('M', 'L').replace(/ q/g, ' q') : 'L18 70') + ' Z"/>' +
      ripples;
  }

  var A = {};

  /* ---------------------------------------------------------- porosity */
  A['porosity'] =
    frame(
      buttPlates() + buttBead() +
        '<circle class="d-bad" cx="80" cy="64" r="4.5"/>' +
        '<circle class="d-bad" cx="95" cy="70" r="3.2"/>' +
        '<circle class="d-bad" cx="106" cy="62" r="5"/>' +
        '<circle class="d-bad" cx="90" cy="80" r="3.6"/>' +
        '<circle class="d-bad" cx="103" cy="83" r="2.6"/>' +
        '<text class="d-badtext" x="93" y="112" style="font-size:12px" text-anchor="middle">round holes</text>',
      buttPlates() + buttBead() +
        '<text class="d-lbl" x="93" y="112" style="font-size:12px" text-anchor="middle">solid metal</text>',
      'Sawn through and etched. Porosity is gas that could not get out — the holes are round, and they go all the way through.'
    );

  /* ---------------------------------------------------------- undercut */
  A['undercut'] =
    frame(
      filletPlates() +
        '<path class="d-weld" d="M72 96 L72 54 q4 -4 42 42 Z"/>' +
        '<path class="d-bad" d="M114 96 q6 -9 14 -2 q-7 2 -14 2 z"/>' +
        '<path class="d-ring" d="M105 88 a16 12 0 1 0 30 6"/>' +
        '<text class="d-badtext" x="93" y="132" style="font-size:12px" text-anchor="middle">groove burnt in</text>',
      filletPlates() + filletBead('flat') +
        '<text class="d-lbl" x="93" y="132" style="font-size:12px" text-anchor="middle">blends in flush</text>',
      'The groove is thinner than the plate around it, so the joint fails there first even though the weld itself looks fine.'
    );

  /* ----------------------------------------------------------- overlap */
  A['overlap'] =
    frame(
      filletPlates() +
        '<path class="d-weld" d="M72 96 L72 56 q10 10 34 32 q6 8 -6 8 z"/>' +
        '<path class="d-bad" d="M100 96 q10 -2 12 4 q-8 2 -12 -4 z"/>' +
        '<path class="d-ring" d="M96 90 a14 11 0 1 0 26 8"/>' +
        '<text class="d-badtext" x="93" y="132" style="font-size:12px" text-anchor="middle">rolled on, not fused</text>',
      filletPlates() + filletBead('flat') +
        '<text class="d-lbl" x="93" y="132" style="font-size:12px" text-anchor="middle">tied in at the toe</text>',
      'Cold lap sits on the plate rather than joining it. You can catch a fingernail under the lip — that lip is the tell.'
    );

  /* ---------------------------------------------------- lack of fusion */
  A['lack-of-fusion'] =
    frame(
      buttPlates(14) + buttBead() +
        '<path class="d-bad" d="M85 70 l-4 22 h3 l5 -22 z"/>' +
        '<path class="d-ring" d="M74 66 a16 20 0 1 0 24 30"/>' +
        '<text class="d-badtext" x="93" y="112" style="font-size:12px" text-anchor="middle">never bonded to wall</text>',
      buttPlates(14) + buttBead() +
        '<text class="d-lbl" x="93" y="112" style="font-size:12px" text-anchor="middle">fused both walls</text>',
      'The weld filled the gap but never melted into the wall beside it. Nothing shows on the surface, which is what makes it dangerous.'
    );

  /* ---------------------------------------------- lack of penetration */
  A['lack-of-penetration'] =
    frame(
      buttPlates(12) + buttBead({ root: false }) +
        '<path class="d-weld" d="M87 70 h12 v9 h-12 z"/>' +
        '<rect class="d-bad" x="87" y="79" width="12" height="13"/>' +
        '<path class="d-ring" d="M78 76 a18 18 0 1 0 30 20"/>' +
        '<text class="d-badtext" x="93" y="112" style="font-size:12px" text-anchor="middle">gap left at the root</text>',
      buttPlates(12) + buttBead({ through: true }) +
        '<text class="d-lbl" x="93" y="112" style="font-size:12px" text-anchor="middle">right to the bottom</text>',
      'Looks finished from the top. The joint is only as strong as the metal that actually reached the root.'
    );

  /* ------------------------------------------------------ burn-through */
  A['burn-through'] =
    frame(
      buttPlates(10) +
        '<path class="d-weld" d="M40 70 q14 -14 26 -2 z"/>' +
        '<path class="d-weld" d="M122 70 q14 -12 26 0 z"/>' +
        '<path class="d-bad" d="M74 70 h40 l-6 20 q-14 8 -28 0 z"/>' +
        '<path class="d-weld" d="M82 92 q12 16 22 0 z"/>' +
        '<text class="d-badtext" x="93" y="118" style="font-size:12px" text-anchor="middle">puddle fell out</text>',
      buttPlates(10) + buttBead({ through: true }) +
        '<text class="d-lbl" x="93" y="118" style="font-size:12px" text-anchor="middle">puddle held</text>',
      'Too much heat for the thickness. The metal that should be in the joint is on the floor under it.'
    );

  /* -------------------------------------------------------- hot crack */
  A['hot-crack'] =
    frame(
      topBead() +
        '<path class="d-bad" d="M40 50 l30 4 l34 -3 l28 5 l22 -2 l0 5 l-22 2 l-28 -5 l-34 3 l-30 -4 z"/>' +
        '<circle class="d-ring" cx="150" cy="54" r="15"/>' +
        '<text class="d-badtext" x="93" y="118" style="font-size:12px" text-anchor="middle">split down the middle</text>',
      topBead() +
        '<text class="d-lbl" x="93" y="118" style="font-size:12px" text-anchor="middle">unbroken crown</text>',
      'Looking down at the run. A solidification crack follows the centre of the bead, and often starts in the crater at the end.'
    );

  /* ------------------------------------------------------- cold crack */
  A['cold-crack'] =
    frame(
      topBead() +
        '<rect class="d-haz" x="18" y="26" width="168" height="12"/>' +
        '<rect class="d-haz" x="18" y="70" width="168" height="12"/>' +
        '<path class="d-bad" d="M44 74 l26 6 l30 -4 l34 7 l0 5 l-34 -7 l-30 4 l-26 -6 z"/>' +
        '<text class="d-badtext" x="93" y="118" style="font-size:12px" text-anchor="middle">cracked beside weld</text>',
      topBead() +
        '<rect class="d-haz" x="18" y="26" width="168" height="12"/>' +
        '<rect class="d-haz" x="18" y="70" width="168" height="12"/>' +
        '<text class="d-lbl" x="93" y="118" style="font-size:12px" text-anchor="middle">zone intact</text>',
      'The shaded band either side is the heat-affected zone. Hydrogen cracking turns up there, hours or days after you have packed up.'
    );

  /* ------------------------------------------------------- distortion */
  A['distortion'] =
    frame(
      '<rect class="d-plate" x="14" y="96" width="158" height="18" transform="rotate(-7 93 105)"/>' +
        '<rect class="d-plate" x="52" y="30" width="18" height="66" transform="rotate(9 61 63)"/>' +
        '<path class="d-weld" d="M70 94 L70 58 q8 8 34 36 z"/>' +
        '<path class="d-ghost" d="M14 96 h158 M52 30 v66"/>' +
        '<text class="d-badtext" x="93" y="132" style="font-size:12px" text-anchor="middle">pulled out of square</text>',
      filletPlates() + filletBead('flat') +
        '<text class="d-lbl" x="93" y="132" style="font-size:12px" text-anchor="middle">still square</text>',
      'The dotted lines are where it started. Weld metal shrinks as it cools and drags the plate with it.'
    );

  /* ------------------------------------------------------------- slag */
  A['slag'] =
    frame(
      buttPlates() + buttBead() +
        '<path class="d-bad" d="M78 66 l9 -3 l4 7 l-8 4 z"/>' +
        '<path class="d-bad" d="M96 74 l11 -2 l2 7 l-10 3 z"/>' +
        '<path class="d-bad" d="M88 84 l7 -2 l3 5 l-7 2 z"/>' +
        '<text class="d-badtext" x="93" y="112" style="font-size:12px" text-anchor="middle">angular, glassy</text>',
      buttPlates() + buttBead() +
        '<text class="d-lbl" x="93" y="112" style="font-size:12px" text-anchor="middle">slag floated off</text>',
      'Slag inclusions have straight edges and corners. That is how you tell them from porosity, which is round.'
    );

  /* ------------------------------------------ tungsten contamination */
  A['tungsten-contamination'] =
    frame(
      topBead({ ripples: 9 }) +
        '<circle class="d-bad" cx="66" cy="52" r="3"/>' +
        '<circle class="d-bad" cx="92" cy="58" r="2.4"/>' +
        '<circle class="d-bad" cx="118" cy="49" r="3.4"/>' +
        '<circle class="d-bad" cx="140" cy="58" r="2.2"/>' +
        '<rect class="d-rod" x="150" y="8" width="7" height="24"/>' +
        '<path class="d-bad" d="M150 32 h7 l-3.5 9 z"/>' +
        '<text class="d-badtext" x="93" y="118" style="font-size:12px" text-anchor="middle">specks · tip black</text>',
      topBead({ ripples: 9 }) +
        '<rect class="d-rod" x="150" y="8" width="7" height="24"/>' +
        '<path class="d-rod2" d="M150 32 h7 l-3.5 9 z"/>' +
        '<text class="d-lbl" x="93" y="118" style="font-size:12px" text-anchor="middle">clean · tip bright</text>',
      'If the tungsten touched the puddle, it left some of itself behind. A blackened tip means regrind before the next run.'
    );

  /* ---------------------------------------------------------- spatter */
  A['spatter'] =
    frame(
      topBead({ ripples: 10 }) +
        '<circle class="d-bad" cx="34" cy="22" r="3"/><circle class="d-bad" cx="58" cy="86" r="2.4"/>' +
        '<circle class="d-bad" cx="86" cy="20" r="3.6"/><circle class="d-bad" cx="112" cy="90" r="2.8"/>' +
        '<circle class="d-bad" cx="140" cy="22" r="2.4"/><circle class="d-bad" cx="160" cy="84" r="3.2"/>' +
        '<circle class="d-bad" cx="48" cy="16" r="1.8"/><circle class="d-bad" cx="128" cy="94" r="2"/>' +
        '<text class="d-badtext" x="93" y="118" style="font-size:12px" text-anchor="middle">balls all over</text>',
      topBead({ ripples: 10 }) +
        '<text class="d-lbl" x="93" y="118" style="font-size:12px" text-anchor="middle">plate clean</text>',
      'Rarely a strength problem on its own — but it is the arc telling you the settings or the gas are wrong.'
    );

  /* --------------------------------------------------------- technique */
  A['technique'] =
    frame(
      topBead({ wander: true, uneven: true, ripples: 10 }) +
        '<text class="d-badtext" x="93" y="118" style="font-size:12px" text-anchor="middle">wandering, uneven</text>',
      topBead({ ripples: 11 }) +
        '<text class="d-lbl" x="93" y="118" style="font-size:12px" text-anchor="middle">even all the way</text>',
      'No single fault to name. Same travel speed, same arc length, same angle — the evenness is the skill.'
    );

  function has(id) { return Object.prototype.hasOwnProperty.call(A, id); }
  function get(id) { return A[id] || ''; }
  function ids() { return Object.keys(A); }

  return { has: has, get: get, ids: ids };
})();

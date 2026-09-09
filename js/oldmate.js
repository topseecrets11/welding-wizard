/* ============================================================================
 * WELD ACADEMY — OLD MATE, DRAWN
 * ----------------------------------------------------------------------------
 * He was a 👷 emoji. That is the look of a classified ad, not of a tradesman
 * people drive three hours to stand next to, so he got a real portrait.
 *
 * WHY THE HOOD IS DOWN. The first version of this drew his face — helmet
 * pushed back, moustache, the lot. It looked like a cartoon plumber. A face
 * rendered small and symmetrical always reads friendly-mascot, and friendly
 * mascot is the opposite of a man whose opinion is worth driving for.
 *
 * Hood down solves it. It is the honest image of the craft, it carries the
 * authority a face has to earn, and there is no face to get wrong. The
 * personality lives in what he says; the picture only has to say "this man
 * is working, and he is better at it than you".
 *
 * Inline SVG like the diagrams and dolls: no image file, nothing to cache,
 * sharp at any size, and the arc reflected in his lens is var(--accent), so
 * he lights up in whatever colour she picked.
 *
 * The light comes from below — off the weld, not from a studio. That single
 * decision is most of why it reads as a bench and not an avatar.
 * ==========================================================================*/

window.WA_OLDMATE = (function () {
  'use strict';

  /* portrait(size, opts)
   *   size      pixel width/height (square, meant for a round crop)
   *   opts.id   suffix for the gradient ids — REQUIRED if two appear on one
   *             page: duplicate SVG ids resolve to the first, and the second
   *             portrait silently renders flat. */
  function portrait(size, opts) {
    opts = opts || {};
    var s = size || 58;
    var u = 'om' + (opts.id || '');

    return '<svg class="oldmate" viewBox="0 0 100 100" width="' + s + '" height="' + s + '" ' +
        'role="img" aria-label="Old Mate">' +
      '<defs>' +
        // the work, burning away just off the bottom of the frame
        '<radialGradient id="' + u + 'arc" cx="0.34" cy="1.02" r="0.8">' +
          '<stop offset="0" stop-color="var(--accent)" stop-opacity=".7"/>' +
          '<stop offset="0.42" stop-color="var(--accent)" stop-opacity=".16"/>' +
          '<stop offset="1" stop-color="var(--accent)" stop-opacity="0"/>' +
        '</radialGradient>' +
        // the shell: lit from below left, falling away to black on the right
        '<linearGradient id="' + u + 'shell" x1="0.05" y1="0.95" x2="0.95" y2="0.05">' +
          '<stop offset="0" stop-color="#69747f"/>' +
          '<stop offset="0.38" stop-color="#3b4551"/>' +
          '<stop offset="1" stop-color="#151b23"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + u + 'lens" x1="0" y1="1" x2="1" y2="0">' +
          '<stop offset="0" stop-color="var(--accent)" stop-opacity=".55"/>' +
          '<stop offset="0.5" stop-color="#0b0e13" stop-opacity="1"/>' +
          '<stop offset="1" stop-color="#0b0e13" stop-opacity="1"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + u + 'shirt" x1="0.1" y1="0" x2="0.8" y2="1">' +
          '<stop offset="0" stop-color="#39434f"/>' +
          '<stop offset="1" stop-color="#1a212a"/>' +
        '</linearGradient>' +
        '<clipPath id="' + u + 'crop"><circle cx="50" cy="50" r="50"/></clipPath>' +
      '</defs>' +

      '<g clip-path="url(#' + u + 'crop)">' +
        '<rect width="100" height="100" fill="#12161d"/>' +
        '<rect width="100" height="100" fill="url(#' + u + 'arc)"/>' +

        /* shoulders — square and heavy, sitting low so the hood dominates */
        '<path fill="url(#' + u + 'shirt)" d="M6 100 C9 88 24 81 38 79 L62 79 C76 81 91 88 94 100 Z"/>' +
        /* collar, open, one side catching the light */
        '<path fill="#0f141a" opacity=".8" d="M40 79 L50 93 L60 79 L55 78 L50 85 L45 78 Z"/>' +

        /* the hood itself */
        '<path fill="url(#' + u + 'shell)" d="M50 9 C67 9 76 20 77 35 ' +
          'C78 48 75 61 70 70 C66 78 58 82 50 82 C42 82 34 78 30 70 ' +
          'C25 61 22 48 23 35 C24 20 33 9 50 9 Z"/>' +

        /* crown seam — the moulding line every real hood has, and the thing
           that stops the shell reading as a plain blob */
        '<path stroke="#7d8894" stroke-width="1" fill="none" opacity=".18" stroke-linecap="round" ' +
          'd="M50 9 C44 22 42 44 44 60"/>' +

        /* the lens, set into the shell, turned a few degrees off square so it
           reads as a head slightly turned rather than a logo */
        '<path fill="#080b0f" d="M30 31 L71 27 L72 46 L31 49 Z"/>' +
        '<path fill="url(#' + u + 'lens)" d="M32 32.5 L69 29 L70 44 L33 47 Z"/>' +
        /* the arc, caught in the glass */
        '<path fill="var(--accent)" opacity=".85" d="M36 45 L48 31 L52 31 L40 46 Z"/>' +
        '<path fill="#fff" opacity=".22" d="M41 45.5 L51 31 L53 31 L44 46 Z"/>' +
        /* the hard top edge of the lens frame catching light */
        '<path stroke="#8d99a6" stroke-width="1.2" fill="none" opacity=".55" stroke-linecap="round" ' +
          'd="M30.5 30.5 L71 26.5"/>' +

        /* chin of the hood, in deeper shadow */
        '<path fill="#0d1218" opacity=".55" d="M31 62 C36 76 44 82 50 82 C56 82 64 76 69 62 ' +
          'C60 70 40 70 31 62 Z"/>' +

        /* rim light — the whole reason it reads as an arc and not a lamp */
        '<path stroke="var(--accent)" stroke-width="2" fill="none" opacity=".75" stroke-linecap="round" ' +
          'd="M23.5 38 C22.5 52 26 65 31 72"/>' +
        '<path stroke="var(--accent)" stroke-width="1.2" fill="none" opacity=".35" stroke-linecap="round" ' +
          'd="M26 24 C24 28 23.5 32 23.3 35"/>' +
        '<path stroke="var(--accent)" stroke-width="1.6" fill="none" opacity=".3" stroke-linecap="round" ' +
          'd="M8 97 C12 87 24 82 36 80"/>' +

        /* spatter, thrown up from the work */
        '<circle cx="17" cy="83" r="1.3" fill="var(--accent)" opacity=".9"/>' +
        '<circle cx="27" cy="91" r="0.9" fill="var(--accent)" opacity=".7"/>' +
        '<circle cx="11" cy="72" r="0.7" fill="var(--accent)" opacity=".5"/>' +
        '<circle cx="79" cy="88" r="0.8" fill="var(--accent)" opacity=".35"/>' +
      '</g>' +
    '</svg>';
  }

  return { portrait: portrait };
})();

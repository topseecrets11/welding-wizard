/* ============================================================================
 * WELD ACADEMY — THE COLLECTION
 * ----------------------------------------------------------------------------
 * She loves Russian nesting dolls, so progress unlocks a set of them.
 *
 * SCOPED HONESTLY. This is a collection mechanic, not a game engine. It reuses
 * the celebration system already in js/juice.js rather than building a match-3
 * loop, and the app says so if she asks why it does not play like Candy Crush.
 * If a tap-to-pair minigame ever happens, this doll set is its asset library.
 *
 * Drawn as inline SVG like the diagrams — no image files, nothing to cache,
 * crisp at any zoom, and each one recolours from its own palette so they read
 * as a real set rather than the same doll eight times.
 *
 * The dolls nest by size the way the real things do: the biggest is unlocked
 * first and the smallest is the rarest, so the set fills inward.
 * ==========================================================================*/

window.WA_DOLLS = (function () {
  'use strict';

  /* size: 1 is the biggest (outermost). Unlock conditions are deliberately
     spread across the different things she might do, so no single kind of
     player can complete the set by only ever doing one thing. */
  var dolls = [
    { id: 'arc',     size: 1, name: 'The Big One',    body: '#c0392b', shawl: '#e8c23a', face: '#f6d9b8', flower: '#2c7a4b',
      how: 'module:safety',  hint: 'Finish the first unit' },
    { id: 'copper',  size: 2, name: 'Copper',         body: '#b5651d', shawl: '#f0a868', face: '#f6d9b8', flower: '#3fa7a0',
      how: 'module:print',   hint: 'Finish Reading the Print' },
    { id: 'ember',   size: 3, name: 'Ember',          body: '#8e2f8e', shawl: '#f3b0d8', face: '#f6d9b8', flower: '#e8c23a',
      how: 'module:smaw',    hint: 'Finish Stick Welding' },
    { id: 'seafoam', size: 4, name: 'Seafoam',        body: '#2e8b8b', shawl: '#a8e6df', face: '#f6d9b8', flower: '#e05a4a',
      how: 'module:gmaw',    hint: 'Finish MIG Welding' },
    { id: 'indigo',  size: 5, name: 'Indigo',         body: '#3b4a9c', shawl: '#9fb0f0', face: '#f6d9b8', flower: '#f0a868',
      how: 'module:gtaw',    hint: 'Finish TIG Welding' },
    { id: 'ash',     size: 6, name: 'Little Ash',     body: '#4a5560', shawl: '#c6cfd8', face: '#f6d9b8', flower: '#c0392b',
      how: 'streak:7',       hint: 'Seven days on the trot' },
    { id: 'gold',    size: 7, name: 'The Gold One',   body: '#b8912a', shawl: '#f6dd85', face: '#f6d9b8', flower: '#2e8b8b',
      how: 'drills:20',      hint: 'Twenty bench drills done' },
    { id: 'tiny',    size: 8, name: 'The Littlest',   body: '#1f6f4a', shawl: '#8fd6ae', face: '#f6d9b8', flower: '#e8c23a',
      how: 'badges:12',      hint: 'Twelve badges earned' }
  ];

  function byId(id) { return dolls.filter(function (d) { return d.id === id; })[0] || null; }

  /* ------------------------------------------------------------- unlocking */

  function owned() {
    var s = window.WA_PROGRESS.settings();
    return s.dolls || [];
  }

  function has(id) { return owned().indexOf(id) !== -1; }

  function grant(id) {
    if (has(id) || !byId(id)) return null;
    var list = owned().slice();
    list.push(id);
    window.WA_PROGRESS.setSetting('dolls', list);
    return byId(id);
  }

  /* Has she met a doll's condition yet? */
  function earned(doll) {
    var P = window.WA_PROGRESS;
    var parts = doll.how.split(':');
    var kind = parts[0], arg = parts[1];
    if (kind === 'module') return P.moduleComplete(arg);
    if (kind === 'streak') return (P.state.streak && P.state.streak.count) >= +arg;
    if (kind === 'drills') return P.drillCount() >= +arg;
    if (kind === 'badges') return P.state.badges.length >= +arg;
    return false;
  }

  /* Called after anything that might have moved her along. Returns whatever is
     newly unlocked so the caller can celebrate it. */
  function check() {
    var fresh = [];
    dolls.forEach(function (d) {
      if (!has(d.id) && earned(d)) {
        var got = grant(d.id);
        if (got) fresh.push(got);
      }
    });
    return fresh;
  }

  function progress() {
    return { have: owned().length, total: dolls.length };
  }

  /* The next one to want, which is what keeps a collection working. */
  function nextUp() {
    return dolls.filter(function (d) { return !has(d.id); })[0] || null;
  }

  /* ------------------------------------------------------------------ art */

  /* One doll, drawn to a 100x150 box. Unearned ones render as a silhouette so
     there is always a visible shape of what is missing. */
  function svg(doll, opts) {
    opts = opts || {};
    var w = opts.width || 100;
    var locked = !!opts.locked;
    var body = locked ? '#2a313b' : doll.body;
    var shawl = locked ? '#333c48' : doll.shawl;
    var face = locked ? '#39424f' : doll.face;
    var flower = locked ? '#39424f' : doll.flower;
    var id = 'd' + doll.id + (opts.suffix || '');

    return '<svg class="doll' + (locked ? ' is-locked' : '') + '" viewBox="0 0 100 150" ' +
        'width="' + w + '" height="' + Math.round(w * 1.5) + '" ' +
        'role="img" aria-label="' + esc(doll.name) + (locked ? ' (locked)' : '') + '">' +
      '<defs>' +
        '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + body + '" stop-opacity="1"/>' +
          '<stop offset="1" stop-color="' + body + '" stop-opacity="0.72"/>' +
        '</linearGradient>' +
        '<clipPath id="' + id + 'c">' +
          '<path d="M50 6 C68 6 78 22 78 40 C78 52 74 58 74 66 C86 76 92 100 92 118 ' +
                  'C92 138 74 146 50 146 C26 146 8 138 8 118 C8 100 14 76 26 66 ' +
                  'C26 58 22 52 22 40 C22 22 32 6 50 6 Z"/>' +
        '</clipPath>' +
      '</defs>' +

      // The body outline
      '<path d="M50 6 C68 6 78 22 78 40 C78 52 74 58 74 66 C86 76 92 100 92 118 ' +
              'C92 138 74 146 50 146 C26 146 8 138 8 118 C8 100 14 76 26 66 ' +
              'C26 58 22 52 22 40 C22 22 32 6 50 6 Z" ' +
            'fill="url(#' + id + 'b)" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>' +

      '<g clip-path="url(#' + id + 'c)">' +
        // The shawl, over the head and shoulders
        '<path d="M50 4 C74 4 82 26 80 46 C74 40 62 36 50 36 C38 36 26 40 20 46 ' +
                'C18 26 26 4 50 4 Z" fill="' + shawl + '"/>' +
        // The face
        '<ellipse cx="50" cy="40" rx="19" ry="21" fill="' + face + '"/>' +
        (locked ? '' :
          // Eyes and mouth, only on an unlocked one — a silhouette has no face
          '<circle cx="43" cy="38" r="2.4" fill="#2a2118"/>' +
          '<circle cx="57" cy="38" r="2.4" fill="#2a2118"/>' +
          '<path d="M45 48 Q50 52 55 48" stroke="#b5563f" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
          '<circle cx="37" cy="45" r="3.5" fill="#e08a8a" opacity=".5"/>' +
          '<circle cx="63" cy="45" r="3.5" fill="#e08a8a" opacity=".5"/>') +
        // The apron panel and its flower
        '<ellipse cx="50" cy="112" rx="30" ry="30" fill="' + shawl + '" opacity=".9"/>' +
        (locked ? '' :
          '<g>' +
            [0, 60, 120, 180, 240, 300].map(function (a) {
              return '<ellipse cx="50" cy="104" rx="5" ry="9" fill="' + flower + '" ' +
                'transform="rotate(' + a + ' 50 112)"/>';
            }).join('') +
            '<circle cx="50" cy="112" r="5" fill="' + body + '"/>' +
            '<path d="M34 128 Q50 136 66 128" stroke="' + flower + '" stroke-width="2.5" ' +
              'fill="none" stroke-linecap="round" opacity=".8"/>' +
          '</g>') +
      '</g>' +

      // A soft highlight so it reads as rounded rather than flat
      '<ellipse cx="36" cy="30" rx="7" ry="12" fill="#fff" opacity="' + (locked ? '.03' : '.13') + '" ' +
        'transform="rotate(-18 36 30)"/>' +
    '</svg>';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return {
    dolls: dolls, byId: byId,
    owned: owned, has: has, grant: grant, earned: earned, check: check,
    progress: progress, nextUp: nextUp, svg: svg
  };
})();

/* ============================================================================
 * WELD ACADEMY — DIAGRAMS
 * ----------------------------------------------------------------------------
 * Hand-drawn inline SVG, one per key concept. No image files, no network, so
 * they load instantly and stay sharp on any screen — phone, tablet or desktop.
 *
 * Every diagram uses the shared classes defined in css/styles.css:
 *   .d-plate  parent metal      .d-weld   weld metal / bead
 *   .d-haz    heat affected     .d-line   dimension and leader lines
 *   .d-lbl    labels            .d-bad    fault highlight
 *   .d-arc    the arc itself    .d-ghost  faint construction lines
 * ==========================================================================*/

window.WA_DIAGRAMS = (function () {
  'use strict';

  function svg(viewBox, inner, caption) {
    return '<figure class="diagram">' +
      '<svg viewBox="' + viewBox + '" role="img" preserveAspectRatio="xMidYMid meet">' + inner + '</svg>' +
      (caption ? '<figcaption>' + caption + '</figcaption>' : '') +
      '</figure>';
  }

  var D = {};

  /* ---------------------------------------------------------- the 5 joints */
  D['joints'] = svg('0 0 460 150',
    // butt
    '<g transform="translate(10,20)">' +
      '<rect class="d-plate" x="0" y="40" width="38" height="14"/>' +
      '<rect class="d-plate" x="46" y="40" width="38" height="14"/>' +
      '<path class="d-weld" d="M38 40 q4 -8 8 0 v14 h-8 z"/>' +
      '<text class="d-lbl" x="42" y="80" text-anchor="middle">Butt</text>' +
    '</g>' +
    // lap
    '<g transform="translate(100,20)">' +
      '<rect class="d-plate" x="0" y="44" width="50" height="12"/>' +
      '<rect class="d-plate" x="34" y="32" width="50" height="12"/>' +
      '<path class="d-weld" d="M34 44 l0 -12 q-9 6 -10 12 z"/>' +
      '<text class="d-lbl" x="42" y="80" text-anchor="middle">Lap</text>' +
    '</g>' +
    // tee
    '<g transform="translate(190,20)">' +
      '<rect class="d-plate" x="0" y="48" width="84" height="12"/>' +
      '<rect class="d-plate" x="36" y="10" width="12" height="38"/>' +
      '<path class="d-weld" d="M36 48 l-12 0 q11 -1 12 -12 z"/>' +
      '<path class="d-weld" d="M48 48 l12 0 q-11 -1 -12 -12 z"/>' +
      '<text class="d-lbl" x="42" y="80" text-anchor="middle">Tee</text>' +
    '</g>' +
    // corner
    '<g transform="translate(280,20)">' +
      '<rect class="d-plate" x="20" y="48" width="60" height="12"/>' +
      '<rect class="d-plate" x="20" y="10" width="12" height="38"/>' +
      '<path class="d-weld" d="M20 48 q-3 -12 12 -12 v-4 q-16 2 -16 16 z"/>' +
      '<text class="d-lbl" x="46" y="80" text-anchor="middle">Corner</text>' +
    '</g>' +
    // edge
    '<g transform="translate(370,20)">' +
      '<rect class="d-plate" x="20" y="22" width="12" height="38"/>' +
      '<rect class="d-plate" x="34" y="22" width="12" height="38"/>' +
      '<path class="d-weld" d="M20 22 q13 -9 26 0 q-13 5 -26 0 z"/>' +
      '<text class="d-lbl" x="33" y="80" text-anchor="middle">Edge</text>' +
    '</g>' +
    '<text class="d-lbl d-dim" x="230" y="130" text-anchor="middle">Orange = weld metal · grey = parent metal</text>',
    'The five joint types. Every weld you will ever make is one of these.');

  /* ------------------------------------------------------------- positions */
  D['positions'] = svg('0 0 460 190',
    '<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">' +
      '<path class="d-arrowhead" d="M0 0 L6 3 L0 6 z"/></marker></defs>' +

    '<g transform="translate(20,25)">' +
      '<rect class="d-plate" x="0" y="40" width="70" height="12"/>' +
      '<path class="d-weld" d="M20 40 h30 q-2 -7 -15 -7 q-13 0 -15 7 z"/>' +
      '<text class="d-lbl" x="35" y="72" text-anchor="middle">PA · flat</text>' +
      '<text class="d-lbl d-dim" x="35" y="88" text-anchor="middle">1G / 1F</text>' +
    '</g>' +

    '<g transform="translate(130,25)">' +
      '<rect class="d-plate" x="26" y="0" width="12" height="55"/>' +
      '<rect class="d-plate" x="26" y="43" width="50" height="12"/>' +
      '<path class="d-weld" d="M38 43 l14 0 q-13 -1 -14 -14 z"/>' +
      '<text class="d-lbl" x="45" y="72" text-anchor="middle">PB · horizontal</text>' +
      '<text class="d-lbl d-dim" x="45" y="88" text-anchor="middle">2F fillet</text>' +
    '</g>' +

    '<g transform="translate(250,25)">' +
      '<rect class="d-plate" x="20" y="0" width="14" height="55"/>' +
      '<rect class="d-plate" x="40" y="0" width="14" height="55"/>' +
      '<path class="d-weld" d="M34 2 h6 v51 h-6 z"/>' +
      '<line class="d-line" x1="60" y1="52" x2="60" y2="6" marker-end="url(#ar)"/>' +
      '<text class="d-lbl" x="37" y="72" text-anchor="middle">PF · vertical up</text>' +
      '<text class="d-lbl d-dim" x="37" y="88" text-anchor="middle">3G / 3F</text>' +
    '</g>' +

    '<g transform="translate(360,25)">' +
      '<rect class="d-plate" x="0" y="6" width="70" height="12"/>' +
      '<path class="d-weld" d="M20 18 h30 q-2 7 -15 7 q-13 0 -15 -7 z"/>' +
      '<text class="d-lbl" x="35" y="72" text-anchor="middle">PD/PE · overhead</text>' +
      '<text class="d-lbl d-dim" x="35" y="88" text-anchor="middle">4G / 4F</text>' +
    '</g>' +

    '<line class="d-ghost" x1="20" y1="140" x2="440" y2="140"/>' +
    '<text class="d-lbl d-dim" x="230" y="165" text-anchor="middle">Gravity never stops working. Position changes amps, arc length and travel.</text>',
    'Positions in ISO letters (used on Australian drawings) with the AWS numbers you will hear online.');

  /* ------------------------------------------------------- fillet geometry */
  D['fillet-size'] = svg('0 0 380 210',
    '<g transform="translate(60,20)">' +
      '<rect class="d-plate" x="0" y="120" width="200" height="20"/>' +
      '<rect class="d-plate" x="0" y="20" width="20" height="100"/>' +
      '<path class="d-weld" d="M20 120 h60 q-4 -55 -60 -60 z"/>' +

      // leg along the bottom plate
      '<line class="d-line" x1="20" y1="152" x2="80" y2="152"/>' +
      '<line class="d-ghost" x1="20" y1="120" x2="20" y2="156"/>' +
      '<line class="d-ghost" x1="80" y1="120" x2="80" y2="156"/>' +
      '<text class="d-lbl" x="50" y="168" text-anchor="middle">leg</text>' +

      // leg up the vertical plate
      '<line class="d-line" x1="-14" y1="120" x2="-14" y2="60"/>' +
      '<line class="d-ghost" x1="-18" y1="60" x2="20" y2="60"/>' +
      '<text class="d-lbl" x="-40" y="94" text-anchor="middle">leg</text>' +

      // throat
      '<line class="d-throat" x1="20" y1="120" x2="63" y2="77"/>' +
      '<text class="d-lbl d-accent" x="112" y="70">throat ≈ leg × 0.7</text>' +
      '<text class="d-lbl d-dim" x="112" y="88">this is what carries the load</text>' +
      '<text class="d-lbl d-dim" x="112" y="112">leg ≈ thickness of the</text>' +
      '<text class="d-lbl d-dim" x="112" y="128">thinner plate</text>' +
    '</g>',
    'A fillet is measured by leg length, but the throat is what holds. Weld it to size — bigger is not stronger.');

  /* --------------------------------------------------------- weld symbol */
  D['symbol'] = svg('0 0 460 230',
    // reference line + arrow
    '<line class="d-sym" x1="90" y1="110" x2="330" y2="110"/>' +
    '<line class="d-sym" x1="90" y1="110" x2="52" y2="146"/>' +
    '<path class="d-arrowhead" d="M52 146 l14 -4 l-4 -10 z"/>' +
    // tail
    '<line class="d-sym" x1="330" y1="110" x2="352" y2="98"/>' +
    '<line class="d-sym" x1="330" y1="110" x2="352" y2="122"/>' +
    // all-around circle
    '<circle class="d-sym" cx="90" cy="110" r="8" fill="none"/>' +
    // field weld flag
    '<line class="d-sym" x1="120" y1="110" x2="120" y2="80"/>' +
    '<path class="d-weld" d="M120 80 l22 7 l-22 7 z"/>' +
    // fillet symbol below line (arrow side): horizontal leg ON the reference
    // line, vertical leg on the left — the standard AWS/ISO orientation.
    '<path class="d-sym-fill" d="M170 110 h26 l-26 26 z"/>' +
    '<text class="d-lbl d-accent" x="158" y="132" text-anchor="end">6</text>' +
    '<text class="d-lbl d-accent" x="206" y="132">50–150</text>' +
    // fillet symbol above line (other side)
    '<path class="d-sym-fill" d="M170 110 h26 l-26 -26 z"/>' +

    // labels
    '<text class="d-lbl d-dim" x="18" y="184">arrow → the joint</text>' +
    '<text class="d-lbl d-dim" x="150" y="60" text-anchor="middle">field weld</text>' +
    '<text class="d-lbl d-dim" x="56" y="88" text-anchor="middle">all round</text>' +
    '<text class="d-lbl d-dim" x="252" y="56">ABOVE = other side</text>' +
    '<text class="d-lbl d-dim" x="252" y="162">BELOW = arrow side</text>' +
    '<text class="d-lbl d-dim" x="362" y="94">process /</text>' +
    '<text class="d-lbl d-dim" x="362" y="120">procedure notes</text>' +
    '<text class="d-lbl d-accent" x="152" y="214" text-anchor="end">size ↖</text>' +
    '<text class="d-lbl d-accent" x="198" y="214">↗ length–pitch</text>',
    'Read it in order: which side → what type → how big → how long and how often → any notes.');

  /* -------------------------------------------------------- bead faults */
  D['bead-faults'] = svg('0 0 520 270',
    [
      ['good',            'tied in at the toes',  0, 0, 'ok'],
      ['undercut',        'groove left unfilled', 1, 0, 'bad'],
      ['overlap',         'sits on, not fused',   2, 0, 'bad'],
      ['lack of fusion',  'invisible on top',     0, 1, 'bad'],
      ['no penetration',  'gap at the root',      1, 1, 'bad'],
      ['porosity',        'gas trapped inside',   2, 1, 'bad']
    ].map(function (f, i) {
      var x = 22 + f[2] * 168, y = 10 + f[3] * 132;
      var art;
      if (i === 0) {
        art = '<rect class="d-plate" x="0" y="46" width="76" height="16"/>' +
              '<rect class="d-plate" x="0" y="0" width="16" height="46"/>' +
              '<path class="d-weld" d="M16 46 h34 q-3 -31 -34 -34 z"/>';
      } else if (i === 1) {
        art = '<rect class="d-plate" x="0" y="46" width="76" height="16"/>' +
              '<rect class="d-plate" x="0" y="0" width="16" height="46"/>' +
              '<path class="d-weld" d="M16 46 h32 q-3 -31 -32 -34 z"/>' +
              '<path class="d-bad" d="M44 46 q6 -7 11 0 q-6 3 -11 0 z"/>' +
              '<circle class="d-ring" cx="49" cy="45" r="13"/>';
      } else if (i === 2) {
        art = '<rect class="d-plate" x="0" y="46" width="76" height="16"/>' +
              '<rect class="d-plate" x="0" y="0" width="16" height="46"/>' +
              '<path class="d-weld" d="M16 46 h44 q6 -4 -2 -8 q-14 -22 -42 -26 z"/>' +
              '<circle class="d-ring" cx="55" cy="44" r="13"/>';
      } else if (i === 3) {
        art = '<rect class="d-plate" x="0" y="46" width="76" height="16"/>' +
              '<rect class="d-plate" x="0" y="0" width="16" height="46"/>' +
              '<path class="d-weld" d="M18 46 h32 q-3 -29 -32 -32 z"/>' +
              '<path class="d-bad" d="M17 45 l0 -30 l2.5 0 l0 30 z"/>' +
              '<circle class="d-ring" cx="20" cy="30" r="13"/>';
      } else if (i === 4) {
        art = '<rect class="d-plate" x="0" y="30" width="34" height="30"/>' +
              '<rect class="d-plate" x="44" y="30" width="32" height="30"/>' +
              '<path class="d-weld" d="M30 30 h18 q-2 -10 -9 -10 q-7 0 -9 10 z"/>' +
              '<path class="d-weld" d="M34 30 h10 v10 h-10 z"/>' +
              '<path class="d-bad" d="M34 42 h10 v18 h-10 z"/>' +
              '<circle class="d-ring" cx="39" cy="52" r="13"/>';
      } else {
        art = '<rect class="d-plate" x="0" y="46" width="76" height="16"/>' +
              '<rect class="d-plate" x="0" y="0" width="16" height="46"/>' +
              '<path class="d-weld" d="M16 46 h34 q-3 -31 -34 -34 z"/>' +
              '<circle class="d-bad" cx="26" cy="38" r="3.5"/>' +
              '<circle class="d-bad" cx="35" cy="30" r="2.5"/>' +
              '<circle class="d-bad" cx="31" cy="20" r="3"/>' +
              '<circle class="d-ring" cx="31" cy="30" r="15"/>';
      }
      return '<g transform="translate(' + x + ',' + y + ')">' + art +
        '<text class="d-lbl ' + (f[4] === 'ok' ? 'd-ok' : 'd-badtext') + '" x="40" y="84" text-anchor="middle">' +
          (f[4] === 'ok' ? '\u2713 ' : '\u2717 ') + f[0] + '</text>' +
        '<text class="d-lbl d-dim" x="40" y="104" text-anchor="middle">' + f[1] + '</text>' +
      '</g>';
    }).join(''),
    'Cross-sections through a fillet. Learn these six shapes and you can read most welds at a glance.');

  /* --------------------------------------------------------- arc length */
  D['arc-length'] = svg('0 0 420 170',
    ['too short', 'about right', 'too long'].map(function (label, i) {
      var x = 20 + i * 140;
      var gap = [4, 14, 34][i];
      var cls = i === 1 ? 'd-ok' : 'd-badtext';
      return '<g transform="translate(' + x + ',10)">' +
        '<rect class="d-plate" x="0" y="100" width="110" height="16"/>' +
        '<rect class="d-rod" x="46" y="18" width="10" height="' + (82 - gap) + '"/>' +
        '<path class="d-arc" d="M51 ' + (100 - gap) + ' L51 100"/>' +
        (i === 1
          ? '<path class="d-weld" d="M30 100 h42 q-4 -9 -21 -9 q-17 0 -21 9 z"/>'
          : i === 0
            ? '<path class="d-weld" d="M36 100 h30 q-3 -14 -15 -14 q-12 0 -15 14 z"/>'
            : '<path class="d-weld" d="M22 100 h58 q-5 -5 -29 -5 q-24 0 -29 5 z"/>' +
              '<circle class="d-bad" cx="40" cy="97" r="2.5"/><circle class="d-bad" cx="64" cy="97" r="2"/>' +
              '<circle class="d-spat" cx="14" cy="92" r="2.5"/><circle class="d-spat" cx="92" cy="88" r="2"/>' +
              '<circle class="d-spat" cx="100" cy="96" r="3"/>')  +
        '<text class="d-lbl ' + cls + '" x="51" y="140" text-anchor="middle">' + label + '</text>' +
        '</g>';
    }).join('') +
    '<text class="d-lbl d-dim" x="210" y="164" text-anchor="middle">Hold the arc about one electrode diameter off the work.</text>',
    'Too short: it stutters and sticks. Too long: spatter, wandering arc, and porosity as the shielding breaks up.');

  /* ------------------------------------------------------- push vs drag */
  D['push-drag'] = svg('0 0 420 190',
    '<g transform="translate(30,20)">' +
      '<rect class="d-plate" x="0" y="70" width="150" height="18"/>' +
      '<path class="d-haz" d="M40 70 h70 v10 q-35 8 -70 0 z"/>' +
      '<path class="d-weld" d="M40 70 h70 q-6 -14 -35 -14 q-29 0 -35 14 z"/>' +
      '<g transform="translate(66,4) rotate(20)"><rect class="d-rod" x="0" y="0" width="14" height="52"/></g>' +
      '<path class="d-line" d="M120 30 h26" marker-end="url(#ar2)"/>' +
      '<text class="d-lbl d-ok" x="75" y="112" text-anchor="middle">PUSH</text>' +
      '<text class="d-lbl d-dim" x="75" y="128" text-anchor="middle">flatter, wider bead</text>' +
      '<text class="d-lbl d-dim" x="75" y="144" text-anchor="middle">less penetration</text>' +
    '</g>' +
    '<defs><marker id="ar2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">' +
      '<path class="d-arrowhead" d="M0 0 L6 3 L0 6 z"/></marker></defs>' +
    '<g transform="translate(230,20)">' +
      '<rect class="d-plate" x="0" y="70" width="150" height="18"/>' +
      '<path class="d-haz" d="M45 70 h60 v16 q-30 6 -60 0 z"/>' +
      '<path class="d-weld" d="M45 70 h60 q-5 -20 -30 -20 q-25 0 -30 20 z"/>' +
      '<g transform="translate(72,4) rotate(-20)"><rect class="d-rod" x="0" y="0" width="14" height="52"/></g>' +
      '<path class="d-line" d="M120 30 h26" marker-end="url(#ar2)"/>' +
      '<text class="d-lbl d-ok" x="75" y="112" text-anchor="middle">DRAG</text>' +
      '<text class="d-lbl d-dim" x="75" y="128" text-anchor="middle">narrower, higher bead</text>' +
      '<text class="d-lbl d-dim" x="75" y="144" text-anchor="middle">deeper penetration</text>' +
    '</g>' +
    '<text class="d-lbl d-dim" x="210" y="182" text-anchor="middle">Arrow = direction of travel. Hold 10–15° off vertical either way.</text>',
    'Push for a tidy flat bead on thin steel. Drag for penetration — and always drag anything that makes slag.');

  /* ---------------------------------------------------------- stick-out */
  D['stickout'] = svg('0 0 400 180',
    '<g transform="translate(40,15)">' +
      '<rect class="d-noz" x="30" y="0" width="46" height="34"/>' +
      '<rect class="d-tip" x="46" y="34" width="14" height="16"/>' +
      '<line class="d-wire" x1="53" y1="50" x2="53" y2="96"/>' +
      '<rect class="d-plate" x="0" y="96" width="140" height="18"/>' +
      '<path class="d-weld" d="M34 96 h40 q-5 -10 -20 -10 q-15 0 -20 10 z"/>' +
      '<line class="d-line" x1="86" y1="50" x2="86" y2="96"/>' +
      '<line class="d-ghost" x1="60" y1="50" x2="90" y2="50"/>' +
      '<line class="d-ghost" x1="74" y1="96" x2="90" y2="96"/>' +
      '<text class="d-lbl d-accent" x="96" y="78">≈10 mm</text>' +
      '<text class="d-lbl d-ok" x="66" y="140" text-anchor="middle">right</text>' +
    '</g>' +
    '<g transform="translate(230,15)">' +
      '<rect class="d-noz" x="30" y="0" width="46" height="34"/>' +
      '<rect class="d-tip" x="46" y="34" width="14" height="16"/>' +
      '<line class="d-wire" x1="53" y1="50" x2="53" y2="96"/>' +
      '<rect class="d-plate" x="0" y="96" width="140" height="18"/>' +
      '<path class="d-weld" d="M38 96 h34 q-3 -14 -17 -14 q-14 0 -17 14 z"/>' +
      '<path class="d-bad" d="M38 96 h34 v3 h-34 z"/>' +
      '<text class="d-lbl d-badtext" x="66" y="140" text-anchor="middle">too far back</text>' +
      '<text class="d-lbl d-dim" x="66" y="156" text-anchor="middle">colder weld, poor fusion</text>' +
    '</g>' +
    '<text class="d-lbl d-dim" x="120" y="156" text-anchor="middle">tip to work ≈ 10 mm</text>',
    'Backing the gun away to see better quietly turns the current down. Same dials, weaker weld.');

  /* ------------------------------------------------------ transfer modes */
  D['transfer'] = svg('0 0 420 180',
    '<g transform="translate(30,14)">' +
      '<line class="d-wire" x1="45" y1="0" x2="45" y2="52"/>' +
      '<path class="d-weld" d="M18 78 h56 q-6 -26 -28 -26 q-22 0 -28 26 z"/>' +
      '<rect class="d-plate" x="0" y="78" width="92" height="14"/>' +
      '<text class="d-lbl d-ok" x="46" y="116" text-anchor="middle">short circuit</text>' +
      '<text class="d-lbl d-dim" x="46" y="132" text-anchor="middle">wire dips into the puddle</text>' +
      '<text class="d-lbl d-dim" x="46" y="148" text-anchor="middle">cool · thin · all positions</text>' +
    '</g>' +
    '<g transform="translate(165,14)">' +
      '<line class="d-wire" x1="45" y1="0" x2="45" y2="26"/>' +
      '<circle class="d-drop" cx="45" cy="40" r="9"/>' +
      '<path class="d-weld" d="M18 78 h56 q-6 -18 -28 -18 q-22 0 -28 18 z"/>' +
      '<rect class="d-plate" x="0" y="78" width="92" height="14"/>' +
      '<circle class="d-spat" cx="12" cy="62" r="3"/><circle class="d-spat" cx="82" cy="58" r="2.5"/>' +
      '<text class="d-lbl" x="46" y="116" text-anchor="middle">globular</text>' +
      '<text class="d-lbl d-dim" x="46" y="132" text-anchor="middle">big drops fall across</text>' +
      '<text class="d-lbl d-dim" x="46" y="148" text-anchor="middle">spattery · avoid</text>' +
    '</g>' +
    '<g transform="translate(300,14)">' +
      '<line class="d-wire" x1="45" y1="0" x2="45" y2="22"/>' +
      '<circle class="d-drop" cx="45" cy="30" r="2.5"/><circle class="d-drop" cx="43" cy="40" r="2"/>' +
      '<circle class="d-drop" cx="47" cy="48" r="2.2"/><circle class="d-drop" cx="45" cy="57" r="1.8"/>' +
      '<path class="d-weld" d="M12 78 h68 q-8 -14 -34 -14 q-26 0 -34 14 z"/>' +
      '<path class="d-haz" d="M22 78 h48 v10 q-24 6 -48 0 z"/>' +
      '<rect class="d-plate" x="0" y="78" width="92" height="14"/>' +
      '<text class="d-lbl d-ok" x="46" y="116" text-anchor="middle">spray</text>' +
      '<text class="d-lbl d-dim" x="46" y="132" text-anchor="middle">fine spray, never touches</text>' +
      '<text class="d-lbl d-dim" x="46" y="148" text-anchor="middle">deep · flat &amp; horizontal only</text>' +
    '</g>',
    'Transfer mode decides what thickness your machine can actually weld — not the amp dial\'s top number.');

  /* -------------------------------------------------------- tungsten prep */
  D['tungsten'] = svg('0 0 400 180',
    '<g transform="translate(40,30)">' +
      '<path class="d-tung" d="M0 24 h64 l26 12 l-26 12 h-64 z"/>' +
      '<path class="d-ghost" d="M8 24 v24 M20 24 v24 M32 24 v24 M44 24 v24 M56 24 v24 M68 27 v18 M78 31 v10"/>' +
      '<text class="d-lbl d-ok" x="50" y="86" text-anchor="middle">✓ ground lengthwise</text>' +
      '<text class="d-lbl d-dim" x="50" y="102" text-anchor="middle">arc stays where you point it</text>' +
    '</g>' +
    '<g transform="translate(230,30)">' +
      '<path class="d-tung" d="M0 24 h64 l26 12 l-26 12 h-64 z"/>' +
      '<path class="d-ghost" d="M4 26 q6 10 0 20 M18 25 q6 11 0 22 M32 25 q6 11 0 22 M46 25 q6 11 0 22 M60 26 q6 10 0 20 M72 30 q4 6 0 12"/>' +
      '<path class="d-arc" d="M90 36 q14 -10 26 -2"/>' +
      '<text class="d-lbl d-badtext" x="50" y="86" text-anchor="middle">✗ ground around</text>' +
      '<text class="d-lbl d-dim" x="50" y="102" text-anchor="middle">arc wanders off the joint</text>' +
    '</g>' +
    '<text class="d-lbl d-dim" x="200" y="164" text-anchor="middle">Leave a small flat on the tip — a needle point melts off into your weld.</text>',
    'Grind marks are rails for the current. Run them down the tungsten, not around it.');

  /* ------------------------------------------------------------- AC on ally */
  D['ac-cleaning'] = svg('0 0 420 200',
    '<g transform="translate(30,20)">' +
      '<rect class="d-plate" x="0" y="70" width="150" height="22"/>' +
      '<rect class="d-oxide" x="0" y="64" width="150" height="6"/>' +
      '<path class="d-tung" d="M68 6 h14 v40 l-7 8 l-7 -8 z"/>' +
      '<path class="d-arc" d="M75 54 L75 64"/>' +
      '<path class="d-bad" d="M40 70 q35 26 70 0 q-35 8 -70 0 z"/>' +
      '<text class="d-lbl d-badtext" x="75" y="122" text-anchor="middle">DCEN on aluminium</text>' +
      '<text class="d-lbl d-dim" x="75" y="138" text-anchor="middle">oxide skin melts at ~2050°C</text>' +
      '<text class="d-lbl d-dim" x="75" y="154" text-anchor="middle">metal underneath at ~660°C —</text>' +
      '<text class="d-lbl d-dim" x="75" y="170" text-anchor="middle">so it collapses under the skin</text>' +
    '</g>' +
    '<g transform="translate(230,20)">' +
      '<rect class="d-plate" x="0" y="70" width="150" height="22"/>' +
      '<rect class="d-oxide" x="0" y="64" width="34" height="6"/>' +
      '<rect class="d-oxide" x="116" y="64" width="34" height="6"/>' +
      '<path class="d-clean" d="M34 62 h82 v8 h-82 z"/>' +
      '<path class="d-tung" d="M68 6 h14 v40 l-7 8 l-7 -8 z"/>' +
      '<path class="d-arc" d="M75 54 L75 64"/>' +
      '<path class="d-weld" d="M52 70 h46 q-6 -14 -23 -14 q-17 0 -23 14 z"/>' +
      '<text class="d-lbl d-ok" x="75" y="122" text-anchor="middle">AC on aluminium</text>' +
      '<text class="d-lbl d-dim" x="75" y="138" text-anchor="middle">the EP half-cycle blasts the</text>' +
      '<text class="d-lbl d-dim" x="75" y="154" text-anchor="middle">oxide off — that bright etched</text>' +
      '<text class="d-lbl d-dim" x="75" y="170" text-anchor="middle">band either side is the proof</text>' +
    '</g>',
    'Why aluminium is the one metal that demands AC. Watch for the cleaning band — it tells you it is working.');

  /* --------------------------------------------------------- TIG two hands */
  D['tig-hands'] = svg('0 0 400 180',
    '<g transform="translate(60,10)">' +
      '<rect class="d-plate" x="-40" y="96" width="240" height="18"/>' +
      '<g transform="translate(112,10) rotate(18)">' +
        '<rect class="d-torch" x="0" y="0" width="22" height="56" rx="4"/>' +
        '<path class="d-tung" d="M8 56 h6 v22 l-3 6 l-3 -6 z"/>' +
      '</g>' +
      '<path class="d-arc" d="M116 92 L112 96"/>' +
      '<path class="d-weld" d="M76 96 h50 q-6 -12 -25 -12 q-19 0 -25 12 z"/>' +
      '<path class="d-pool" d="M76 96 q12 -14 26 -13"/>' +
      '<g transform="translate(30,60) rotate(-18)"><rect class="d-rod2" x="0" y="0" width="56" height="6" rx="3"/></g>' +
      '<text class="d-lbl d-accent" x="150" y="46">torch 15–20°</text>' +
      '<text class="d-lbl d-accent" x="-38" y="52">filler 15–20°</text>' +
      '<text class="d-lbl d-dim" x="86" y="144" text-anchor="middle">dab into the LEADING edge of the puddle — never into the arc</text>' +
    '</g>',
    'Puddle first, then dab. The rod goes in the front of the pool, and its hot end stays inside the gas shield.');

  /* --------------------------------------------------------- backstepping */
  D['backstep'] = svg('0 0 420 170',
    '<defs><marker id="ar3" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">' +
      '<path class="d-arrowhead" d="M0 0 L5 2.5 L0 5 z"/></marker></defs>' +
      '<rect class="d-plate" x="30" y="40" width="360" height="26"/>' +
      [0, 1, 2, 3].map(function (i) {
        var x = 40 + i * 88;
        return '<path class="d-weld" d="M' + x + ' 40 h76 v-8 h-76 z"/>' +
          '<line class="d-line" x1="' + (x + 74) + '" y1="24" x2="' + (x + 4) + '" y2="24" marker-end="url(#ar3)"/>' +
          '<text class="d-lbl d-accent" x="' + (x + 38) + '" y="58" text-anchor="middle">' + (i + 1) + '</text>';
      }).join('') +
      '<line class="d-line" x1="40" y1="96" x2="380" y2="96" marker-end="url(#ar3)"/>' +
      '<text class="d-lbl d-dim" x="210" y="118" text-anchor="middle">overall progression this way →</text>' +
      '<text class="d-lbl d-dim" x="210" y="140" text-anchor="middle">but each short run is welded backwards, so shrinkage fights itself instead of adding up</text>',
    'Backstepping: the cheapest distortion control there is, and it costs nothing but a bit of thinking.');

  /* --------------------------------------------------- pipe test positions */
  D['pipe-positions'] = svg('0 0 460 170',
    [['1G', 'pipe rotated', 0, 'you weld at the top, pipe turns under you'],
     ['2G', 'pipe vertical', 1, 'fixed — you weld around a horizontal band'],
     ['5G', 'pipe horizontal, fixed', 2, 'you go round it: overhead → vertical → flat'],
     ['6G', 'fixed at 45°', 3, 'every position in one weld. The benchmark test.']
    ].map(function (p) {
      var x = 20 + p[2] * 115;
      var rot = [0, 90, 0, 45][p[2]];
      return '<g transform="translate(' + x + ',18)">' +
        '<g transform="rotate(' + rot + ' 45 34)">' +
          '<rect class="d-pipe" x="6" y="18" width="78" height="32" rx="4"/>' +
          '<ellipse class="d-pipe-end" cx="45" cy="34" rx="5" ry="16"/>' +
          '<line class="d-weldline" x1="45" y1="18" x2="45" y2="50"/>' +
        '</g>' +
        (p[2] === 0 ? '<path class="d-line" d="M14 62 q31 12 62 0" marker-end="url(#ar3)"/>' : '') +
        '<text class="d-lbl d-accent" x="45" y="92" text-anchor="middle">' + p[0] + '</text>' +
        '<text class="d-lbl d-dim" x="45" y="108" text-anchor="middle">' + p[1] + '</text>' +
        '</g>';
    }).join('') +
    '<text class="d-lbl d-dim" x="230" y="158" text-anchor="middle">6G is the one that opens doors — pass it and most other tickets follow.</text>',
    'Pipe test positions. The orange line is the joint you have to weld.');

  return {
    get: function (id) { return D[id] || ''; },
    has: function (id) { return !!D[id]; },
    ids: Object.keys(D)
  };
})();

/* Which diagrams belong to which lesson. A lesson can have more than one. */
window.WA_DIAGRAM_MAP = {
  'print-1': ['joints'],
  'print-2': ['positions'],
  'print-3': ['fillet-size'],
  'print-4': ['symbol'],
  'smaw-3': ['arc-length'],
  'smaw-4': ['positions'],
  'smaw-5': ['arc-length'],
  'gmaw-3': ['transfer'],
  'gmaw-4': ['push-drag', 'stickout'],
  'gmaw-5': ['stickout'],
  'gtaw-2': ['tungsten'],
  'gtaw-3': ['ac-cleaning'],
  'gtaw-4': ['tig-hands'],
  'gtaw-5': ['backstep'],
  'quality-1': ['bead-faults'],
  'quality-2': ['bead-faults'],
  'quality-3': ['bead-faults'],
  'quality-4': ['backstep'],
  'mastery-3': ['pipe-positions'],
  'ticket-2': ['pipe-positions']
};

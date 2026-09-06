/* ============================================================================
 * WELD ACADEMY — WHAT'S IN THIS THING?
 * ----------------------------------------------------------------------------
 * A different question from "what's wrong with my weld": someone has handed
 * her an alternator, and she needs to know whether it is worth the hour it
 * takes to pull apart.
 *
 * Every entry ends the same way — STRIP IT, SELL IT WHOLE, or LEAVE IT —
 * because that is the actual decision, and a page that will not commit to an
 * answer is no use standing in a yard.
 *
 * WORD ASSOCIATION
 *   She learns with her hands, not by reading. So each entry carries a short,
 *   slightly stupid hook that pins the fact to something physical. Stupid is
 *   the point: "shiny edges, not green faces" survives a week of driving in a
 *   way that "gold is concentrated in the plated contact surfaces" does not.
 *
 * HONESTY
 *   Metal contents are ranges from typical units, not promises — a big
 *   truck alternator and a little Japanese one are different animals. Prices
 *   move. Where something is genuinely dangerous or genuinely illegal, that is
 *   said plainly and once, in the same voice as the rest.
 * ==========================================================================*/

window.WA_TEARDOWN = (function () {
  'use strict';

  /* verdict: 'strip' | 'whole' | 'leave'
     time:    rough minutes for someone who has done a few
     hook:    the word-association line
     danger:  a genuine hazard, shown as a warning rather than a bullet */
  var items = [
    {
      id: 'alternator', name: 'Car alternator', icon: '🔌',
      plain: 'The copper is real but it is wound tight and lacquered onto a steel stator. ' +
             'This is the one everybody argues about.',
      hook: 'Heavy for its size, mean to open.',
      metals: 'Roughly 0.6–1.2 kg of copper in the stator windings, plus an aluminium ' +
              'housing and a steel rotor. A typical car unit is 4–6 kg all up.',
      time: 45,
      tools: 'Angle grinder or a cut-off saw, sockets, a big screwdriver, and patience.',
      verdict: 'strip',
      verdictWhy: 'Only if you have a grinder and a stack of them. One at a time it is ' +
                  'barely worth the hour — the yard price for a whole alternator is not far ' +
                  'off what the copper fetches once you count your time.',
      notes: [
        'Cut the housing rather than fighting the through-bolts. Everyone learns this the slow way.',
        'The windings come out as a ring — that is your clean copper, keep it separate.',
        'Aluminium housing and steel rotor still weigh in, so nothing is wasted.'
      ]
    },
    {
      id: 'starter', name: 'Starter motor', icon: '⚙️',
      plain: 'Same idea as an alternator but usually faster to open and with heavier copper.',
      hook: 'Fatter copper, easier fight.',
      metals: 'Around 0.5–1 kg of copper, mostly in the field windings and the commutator, ' +
              'in a steel case.',
      time: 30,
      tools: 'Sockets, a chisel, a grinder for the stubborn ones.',
      verdict: 'strip',
      verdictWhy: 'Better return than an alternator for the same effort. Worth doing.',
      notes: [
        'The solenoid on top has its own winding — do not bin it with the steel.',
        'Brushes are copper too, small but clean.'
      ]
    },
    {
      id: 'electric-motor', name: 'Electric motor (pump, fan, tool)', icon: '🔩',
      plain: 'The bread and butter of copper scrapping. What is inside scales with the weight.',
      hook: 'If it hums, it has windings.',
      metals: 'Very roughly 15–25% of the motor\'s weight in copper for common single-phase ' +
              'motors — so a 10 kg motor might hold 1.5–2.5 kg. Bigger three-phase motors run richer.',
      time: 25,
      tools: 'Grinder or a saw, a hammer, a punch.',
      verdict: 'strip',
      verdictWhy: 'Yes, once you have a few. Yards pay a "electric motor" rate that is well ' +
                  'under the copper value, so the stripping is where your money is.',
      notes: [
        'Cut the windings at both ends of the stator and drive the bundle out.',
        'Aluminium-wound motors exist and look identical — a magnet will not tell you, but ' +
        'the colour under a scratch will. Aluminium windings are worth a fraction of copper.',
        'Bigger is better: the copper fraction rises with motor size.'
      ]
    },
    {
      id: 'compressor', name: 'Aircon / fridge compressor', icon: '❄️',
      plain: 'A sealed steel pot with a copper-wound motor inside. Good money, real rules.',
      hook: 'Sealed pot, sealed lips — get it degassed.',
      metals: '1–3 kg of copper inside a heavy steel shell, depending on size.',
      time: 40,
      tools: 'Cut-off saw. And a licensed refrigerant recovery before any of that.',
      verdict: 'whole',
      danger: 'Refrigerant handling is licensed work in Australia. Venting refrigerant to ' +
              'atmosphere is an offence under the Ozone Protection and Synthetic Greenhouse Gas ' +
              'Management Act, and the fines are not small. There is also oil inside under ' +
              'pressure. Sell it whole to a yard that is set up for it, or have it degassed by ' +
              'someone licensed first — do not cut into a charged one.',
      verdictWhy: 'Sell it whole unless you have a licensed degassing route. The copper is ' +
                  'good but this is the one to do properly.',
      notes: [
        'Yards that take these have a degassing rig and pay accordingly.',
        'A compressor that has already been cut and drained is just a motor — strip it then.'
      ]
    },
    {
      id: 'radiator', name: 'Car radiator / heater core', icon: '🌡️',
      plain: 'Old ones are copper and brass and worth real money. New ones are aluminium ' +
             'and plastic and are not.',
      hook: 'Copper is heavy and dull; aluminium is light and rings.',
      metals: 'A copper/brass radiator is 4–8 kg of Cu/brass. An aluminium one is 2–3 kg of ' +
              'aluminium and worth a fraction as much.',
      time: 15,
      tools: 'Snips, a screwdriver, a magnet is no help here.',
      verdict: 'strip',
      verdictWhy: 'Tell which one it is first, then decide. Copper/brass, absolutely — cut ' +
                  'the plastic tanks off and weigh in the core. Aluminium, sell it whole.',
      notes: [
        'Pick it up: copper/brass is noticeably heavier for the same size.',
        'Heater cores out of the dash are small but often still copper/brass.',
        'Yards grade these separately, so keep the two kinds apart.'
      ]
    },
    {
      id: 'transformer', name: 'Transformer (microwave, welder, plug pack)', icon: '🔋',
      plain: 'A lump of laminated steel with a copper winding through it. Simple and honest.',
      hook: 'Heavy brick, copper heart.',
      metals: 'Copper is usually 10–20% of the weight. A microwave oven transformer of ~7 kg ' +
              'might hold about 1 kg.',
      time: 20,
      tools: 'Grinder or a hacksaw, a hammer.',
      verdict: 'strip',
      verdictWhy: 'Worth it, and it is one of the easier ones to learn on.',
      danger: 'Big capacitors near microwave transformers can hold a lethal charge long after ' +
              'the thing is unplugged. Discharge before you go near one, or leave the ' +
              'capacitor alone entirely.',
      notes: [
        'Cut through the laminations either side of the winding and knock the coil out.',
        'Some windings are aluminium — check under a scratch before you count the money.'
      ]
    },
    {
      id: 'cylinder', name: 'Copper hot water cylinder', icon: '🚿',
      plain: 'One of the best finds going. Almost all of it is clean copper.',
      hook: 'Old tank, whole payday.',
      metals: '15–30 kg of copper in an older domestic cylinder, inside a steel jacket and ' +
              'a foam or fibreglass wrap.',
      time: 30,
      tools: 'Grinder or a saw, gloves for the insulation.',
      verdict: 'strip',
      verdictWhy: 'Absolutely. Cut the steel jacket off and the copper inside is worth many ' +
                  'times the whole-unit price.',
      notes: [
        'Newer cylinders are stainless or glass-lined steel — worth much less, so check first.',
        'The insulation is itchy and old ones can be fibreglass. Gloves and long sleeves.',
        'The fittings on top are usually brass. Separate them, they grade higher.'
      ]
    },
    {
      id: 'psu', name: 'Computer power supply', icon: '💻',
      plain: 'A small box with a bit of everything: copper, aluminium, a board, and a fan.',
      hook: 'Little box, four metals.',
      metals: 'A few hundred grams of copper in the transformer and heatsinks, an aluminium ' +
              'case or heatsinks, and a low-grade board.',
      time: 15,
      tools: 'Screwdriver, snips.',
      verdict: 'strip',
      verdictWhy: 'Worth doing if you have a pile of them, not for one. They break down fast ' +
                  'once you have done a few.',
      notes: [
        'Capacitors can hold charge — leave them, do not puncture them.',
        'The cable loom out the back is decent insulated copper on its own.'
      ]
    },
    {
      id: 'crt', name: 'Old CRT television or monitor', icon: '📺',
      plain: 'The big heavy tube tellies. Nobody wants them, which is exactly why they are worth knowing about.',
      hook: 'Heavy old telly, copper round the neck.',
      metals: 'The prize is the deflection yoke — a copper coil wound around the neck of the ' +
              'tube, usually 200–600 g of fine copper wire. Plus a board and some steel.',
      time: 20,
      tools: 'Screwdriver, snips. Care.',
      verdict: 'strip',
      verdictWhy: 'Strip the yoke and the boards, then dispose of the tube properly. People ' +
                  'give these away because the tube is a disposal cost, and the copper still counts.',
      danger: 'The tube itself is a vacuum and can implode if broken, and the glass contains ' +
              'lead. Older sets can also hold a high-voltage charge for a long time after being ' +
              'unplugged. Take the yoke off the neck, do not smash the tube, and take it to ' +
              'an e-waste facility rather than a bin.',
      notes: [
        'The yoke slides off the neck once its clamp is loosened — no need to touch the glass.',
        'Fine wire like this grades lower than heavy copper, but there is a lot of it.'
      ]
    },
    {
      id: 'loom', name: 'Car wiring loom', icon: '🕸️',
      plain: 'Insulated copper by the kilo, in a shape that is annoying to deal with.',
      hook: 'Spaghetti now, clean copper later.',
      metals: 'A whole car loom might be 15–25 kg gross, holding perhaps 40–60% copper by ' +
              'weight once the insulation and connectors are off.',
      time: 90,
      tools: 'A wire stripper for the thick stuff, snips, and time.',
      verdict: 'whole',
      verdictWhy: 'Sell it as insulated wire unless you have a stripping machine. Hand-stripping ' +
                  'automotive loom is slow, thankless work and the grade uplift rarely pays for ' +
                  'the hours.',
      notes: [
        'Yards grade insulated wire by how much copper is in it, so thick cable pays better than thin.',
        'Never burn insulation off. It is illegal, the fumes are genuinely toxic, and burnt ' +
        'copper grades down anyway.'
      ]
    },
    {
      id: 'ewaste-board', name: 'Circuit boards and e-waste', icon: '🔧',
      plain: 'Where the gold actually is — and where most of the myths are too.',
      hook: 'Shiny edges, not green faces.',
      metals: 'Gold is a plating, microns thick, on connector fingers and pins — not spread ' +
              'through the board. Boards also carry copper, and the better ones some silver ' +
              'and palladium.',
      time: 30,
      tools: 'Snips, pliers, a hot air gun or a desoldering iron if you want to go further.',
      verdict: 'strip',
      verdictWhy: 'Clip the gold-plated connectors and pins off and keep them separate — that ' +
                  'stock sells by weight to a refiner for far more than mixed board. The bare ' +
                  'board still sells as low-grade.',
      danger: 'Getting the gold OFF the plating is chemistry, not scrapping. It is done with ' +
              'strong acids that give off corrosive and toxic fumes, and it is done by refiners ' +
              'under extraction and with the right gear because of exactly that. This app is ' +
              'not going to walk you through it at a kitchen table. Sell the stripped pins and ' +
              'connectors to a licensed refiner and let them carry that risk — you get paid for ' +
              'the gold either way, without the burns.',
      notes: [
        'Ranked roughly: gold-plated pins and edge connectors > CPUs and sockets > telecom ' +
        'boards > motherboards > TV and consumer boards.',
        'Keep grades apart. Mixing high-grade pins into a bucket of consumer board loses you ' +
        'most of the value.',
        '"A tonne of phones has more gold than a tonne of ore" is true and misleading — the ' +
        'per-item amount is tiny. This is a volume game or it is nothing.'
      ]
    },
    {
      id: 'appliance-parts', name: 'Dead appliances — for parts, not scrap', icon: '🍞',
      plain: 'Sometimes the thing is worth more repaired or robbed than weighed in.',
      hook: 'Dead brand, live parts.',
      metals: 'Not about the metal. A toaster nobody makes any more still shares its element ' +
              'wire, thermostat, switch and cord with dozens that are still made.',
      time: 20,
      tools: 'Screwdrivers, a multimeter to find out what actually died.',
      verdict: 'strip',
      verdictWhy: 'Check what failed before you weigh it in. Parts are sourced by what they ' +
                  'do, not by the model number on the box — an element is an element.',
      notes: [
        'Nine times in ten it is the cord, the switch, the thermostat or the element — all ' +
        'testable with a multimeter in two minutes.',
        'Nichrome element wire, thermostats and switches are the reusable bits worth keeping ' +
        'in a box.',
        'This is the habit that turns a bin into a parts shelf: test first, weigh in second.'
      ]
    }
  ];

  function byId(id) {
    return items.filter(function (i) { return i.id === id; })[0] || null;
  }

  var VERDICTS = {
    strip: { label: 'Strip it', icon: '🔨', cls: 'is-strip' },
    whole: { label: 'Sell it whole', icon: '📦', cls: 'is-whole' },
    leave: { label: 'Leave it', icon: '🚫', cls: 'is-leave' }
  };

  function verdict(id) { return VERDICTS[id] || VERDICTS.leave; }

  /* Every hook in one place, for the memory-jog card. */
  function hooks() {
    return items.map(function (i) { return { name: i.name, icon: i.icon, hook: i.hook }; });
  }

  return { items: items, byId: byId, verdict: verdict, VERDICTS: VERDICTS, hooks: hooks };
})();

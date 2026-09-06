/* ============================================================================
 * WELD ACADEMY — SHED REFERENCE DATA
 * ----------------------------------------------------------------------------
 * Everything the companion half of the app uses: the Weld Doctor symptom
 * matcher, the settings cheat sheets, the pre-flight checklist, plus the
 * gamification tables (levels and badges).
 *
 * All metric, Australian conventions. Every number in the cheat sheets is a
 * STARTING POINT — the app says so on screen, loudly, every time.
 * ==========================================================================*/

window.WA_REFERENCE = {

  /* --------------------------------------------------------------------- */
  /* LEVEL TITLES — index 0 is level 1                                      */
  /* --------------------------------------------------------------------- */
  levelTitles: [
    'Shop Sweeper',
    'Spark Chaser',
    'Tack Welder',
    'Rod Runner',
    'Bead Layer',
    'Journeyman',
    'Hull Patcher',
    'Dive Tender',
    'Marine Welder',
    'Master Welder'
  ],

  /* --------------------------------------------------------------------- */
  /* BADGES                                                                 */
  /* --------------------------------------------------------------------- */
  badges: [
    { id: 'first-spark',   icon: '✨', name: 'First Spark',        desc: 'Finish your first lesson.' },
    { id: 'safety',        icon: '🛡️', name: 'Safety Squared Away', desc: 'Complete the Safety First module.' },
    { id: 'print',         icon: '📐', name: 'Print Reader',        desc: 'Complete the Reading the Print module.' },
    { id: 'smaw',          icon: '⚡', name: 'Rod Slinger',         desc: 'Complete the Stick Welding module.' },
    { id: 'gmaw',          icon: '🔥', name: 'Wire Wizard',         desc: 'Complete the MIG Welding module.' },
    { id: 'gtaw',          icon: '💎', name: 'Tungsten Tamer',      desc: 'Complete the TIG Welding module.' },
    { id: 'quality',       icon: '🔍', name: 'Eagle Eye',           desc: 'Complete the Weld Quality module.' },
    { id: 'perfect-pass',  icon: '🎯', name: 'Perfect Pass',        desc: 'Score 5 out of 5 on any module quiz.' },
    { id: 'streak-3',      icon: '🔥', name: 'Three Days Running',  desc: 'Show up three days in a row.' },
    { id: 'streak-7',      icon: '🏆', name: 'Week Straight',       desc: 'Show up seven days in a row.' },
    { id: 'field-medic',   icon: '👷', name: 'Asked Old Mate',      desc: 'Get Old Mate to look at a weld for you.' },
    { id: 'logbook',       icon: '📓', name: 'Logbook Started',     desc: 'Record your first weld in the log.' },
    { id: 'hands-on',      icon: '🔧', name: 'Hands On',             desc: 'Complete your first bench drill.' },
    { id: 'grafter',       icon: '💪', name: 'Grafter',              desc: 'Complete ten bench drills.' },
    { id: 'metal',         icon: '🌡️', name: 'Heat Whisperer',      desc: 'Complete the Metal & Heat mastery unit.' },
    { id: 'materials',     icon: '🧪', name: 'Alloy Hand',           desc: 'Complete the Beyond Mild Steel mastery unit.' },
    { id: 'ticket',        icon: '🎓', name: 'Test Ready',           desc: 'Complete the Fit-up & the Ticket mastery unit.' },
    { id: 'salvage',       icon: '🔌', name: 'Live Wire',            desc: 'Complete the Electrics & Salvage unit.' },
    { id: 'merchant',      icon: '💰', name: 'Knows the Grades',     desc: 'Complete the optional Metal Trade unit.' },
    { id: 'ticket-ready',  icon: '🥇', name: 'The Full Set',         desc: 'Complete every module, core and mastery.' }
  ],

  /* --------------------------------------------------------------------- */
  /* WELD DOCTOR — the clues she ticks                                      */
  /* --------------------------------------------------------------------- */
  clues: [
    { id: 'holes',      label: 'Small holes or pinholes in the bead',            group: 'Look at the bead' },
    { id: 'groove',     label: 'A groove melted into the plate along the edge of the weld', group: 'Look at the bead' },
    { id: 'sitting-on', label: "Weld looks like it's sitting on top — a lip you can catch a fingernail under", group: 'Look at the bead' },
    { id: 'not-through',label: "Didn't reach the bottom of the joint / no weld showing on the back", group: 'Look at the bead' },
    { id: 'glassy',     label: 'Grey or glassy bits trapped in or on the weld',  group: 'Look at the bead' },
    { id: 'uneven',     label: 'Ripples uneven — wide in places, narrow in others', group: 'Look at the bead' },
    { id: 'spatter',    label: 'Balls of metal spattered all around the weld',   group: 'Look at the bead' },
    { id: 'hole',       label: 'Blew a hole straight through the metal',         group: 'What went wrong' },
    { id: 'crack-hot',  label: 'A crack appeared while it was still hot, or in the crater at the end', group: 'What went wrong' },
    { id: 'crack-late', label: 'A crack turned up hours or days later',          group: 'What went wrong' },
    { id: 'warped',     label: 'The metal has warped or pulled out of shape',    group: 'What went wrong' },
    { id: 'tungsten',   label: 'TIG only — the tungsten went black, or dark specks in the weld', group: 'What went wrong' },
    { id: 'windy',      label: 'It was windy or draughty, or the nozzle was held well back', group: 'What was going on' },
    { id: 'dirty',      label: 'The metal was rusty, oily, painted or galvanised', group: 'What was going on' },
    { id: 'sound-bad',  label: 'The arc sounded wrong — popping, hissing or crackling badly', group: 'What was going on' }
  ],

  /* --------------------------------------------------------------------- */
  /* WELD DOCTOR — the diagnoses                                            */
  /* match: { clueId: weight }  — score is the sum of matched weights        */
  /* --------------------------------------------------------------------- */
  defects: [
    {
      id: 'porosity',
      name: 'Porosity',
      icon: '🫧',
      severity: 'Serious — reduces the sound metal carrying load',
      plain: "Gas got trapped in the weld while it froze, leaving holes through it — like bubbles set in ice. Sometimes you see them on the surface, sometimes they're hiding just underneath.",
      match: { holes: 5, windy: 3, dirty: 3, 'sound-bad': 1 },
      causes: [
        'Shielding gas blown away by wind or a draught, or flow set too low',
        'Gas flow cranked so high it went turbulent and pulled air in (over ~20 L/min on MIG)',
        'Spatter clogging the MIG nozzle so gas can\'t flow evenly',
        'Rust, paint, oil, moisture or galvanising on the joint',
        'Damp stick electrodes — especially low-hydrogen E4818',
        'Arc held too long, so the shielding can\'t cover the puddle'
      ],
      fixNow: [
        'Grind or gouge the porous weld right out — you cannot fill porosity by welding over it',
        'Clean the joint back to bright metal, 25 mm either side',
        'Check gas: bottle open, flow 12–15 L/min for MIG, 6–10 L/min for TIG, nozzle clear of spatter',
        'Block the wind with a screen or a sheet of cardboard rather than turning the gas up',
        'Shorten your arc length and re-weld'
      ],
      prevent: [
        'Clean the metal properly every time — this is the single biggest one',
        'Keep low-hydrogen rods in a sealed tin or rod oven, never on an open shelf',
        'Clean the MIG nozzle out regularly and use anti-spatter',
        'Grind galvanising back 25–50 mm before welding it'
      ],
      processNote: 'Bites hardest on MIG and TIG (they depend entirely on gas) and on damp stick electrodes.'
    },
    {
      id: 'undercut',
      name: 'Undercut',
      icon: '〰️',
      severity: 'Serious — thins the plate and makes a sharp notch where stress concentrates',
      plain: "You've melted a groove into the parent plate along the edge of your weld, and there wasn't enough weld metal to fill it back up. It leaves a sharp little valley exactly where the load wants to tear.",
      match: { groove: 5, uneven: 1, 'sound-bad': 1 },
      causes: [
        'Too much current for the material',
        'Travelling too fast — no time to fill the groove you just melted',
        'Arc held too long',
        'Wrong gun or rod angle, putting the heat onto the plate edge instead of the joint',
        'On a horizontal fillet, aiming too low so the top leg starves',
        'Weaving too wide, or not pausing at the edges of the weave'
      ],
      fixNow: [
        'Turn the current down 10 A and try again on scrap',
        'Slow the travel a little and shorten the arc',
        'On a fillet, aim slightly more at the vertical plate',
        'If you weave, pause briefly at each edge of the weave to fill it',
        'Existing undercut: grind smooth and cap with a small low-current pass if the code allows, or grind out and re-weld'
      ],
      prevent: [
        'Consistent travel speed — undercut is often a symptom of rushing',
        'Watch the toes of the weld as you go, not the middle of the arc'
      ],
      processNote: 'Common in all processes; especially easy to do on MIG at high voltage and on horizontal fillets.'
    },
    {
      id: 'overlap',
      name: 'Overlap (cold lap)',
      icon: '🫱',
      severity: 'Serious — the weld looks generous but carries almost nothing at that edge',
      plain: "The molten weld metal has rolled over onto the surface of the plate without actually fusing to it — like candle wax dripped on a table. There's usually a lip you can catch a fingernail under.",
      match: { 'sitting-on': 5, uneven: 1 },
      causes: [
        'Not enough heat — this is a cold weld',
        'Travelling too slowly, so the puddle grows and runs ahead of the arc onto cold metal',
        'Wrong angle, so the arc is riding on molten metal instead of melting fresh plate',
        'On MIG, long stick-out silently dropping the current at the joint',
        'Dirty or scaled plate stopping the weld wetting in'
      ],
      fixNow: [
        'Increase current (or volts and wire speed on MIG)',
        'Speed the travel up a little so the puddle stays small and controlled',
        'Aim the arc at the LEADING edge of the puddle, not the middle of it',
        'Bring the MIG stick-out back to about 10 mm',
        'Grind the overlapped metal off and re-weld — it isn\'t attached, so it isn\'t doing anything'
      ],
      prevent: [
        'Learn to watch the leading edge of the puddle melting fresh metal — that\'s the tell that you\'re fusing',
        'Keep stick-out short and consistent on MIG'
      ],
      processNote: 'Classic MIG fault, because MIG will happily lay down beautiful-looking metal without fusing it.'
    },
    {
      id: 'lack-of-fusion',
      name: 'Lack of fusion',
      icon: '🚫',
      severity: 'Very serious — often invisible from the surface',
      plain: "The weld never actually bonded to the plate, or to the pass underneath. This is the dangerous one, because the top of the bead can look perfect while it's attached to nothing.",
      match: { 'sitting-on': 3, uneven: 2, dirty: 2, 'not-through': 2 },
      causes: [
        'Not enough heat for the thickness',
        'MIG short-circuit (dip) transfer used on plate too thick for it',
        'Travelling too fast to melt the base metal',
        'Arc aimed at the puddle rather than the leading edge',
        'Scale, rust or previous slag left on the joint faces',
        'Previous pass not cleaned before the next one'
      ],
      fixNow: [
        'Stop and cut a test coupon: weld a scrap of the same material, break or bend it, and look at the fracture face for unfused metal',
        'More heat, or bevel the joint and do multiple passes rather than one big one',
        'Clean between every pass — chip, wire brush, look',
        'Suspect welds get gouged out and re-welded, not patched over'
      ],
      prevent: [
        'Bevel and multi-pass anything thick rather than trusting one hot run',
        'Know what transfer mode your MIG is in and what thickness it can genuinely handle',
        'Never judge a weld by how pretty the top looks'
      ],
      processNote: 'The reason MIG has a reputation among old hands as a process that hides its sins.'
    },
    {
      id: 'lack-of-penetration',
      name: 'Lack of penetration',
      icon: '🕳️',
      severity: 'Serious — leaves a built-in crack at the root of the joint',
      plain: "The weld didn't get down to the bottom of the joint. There's a gap left at the root, which behaves exactly like a crack that was designed in on purpose.",
      match: { 'not-through': 5, 'sitting-on': 1 },
      causes: [
        'Not enough current',
        'Travelling too fast',
        'No bevel or too small a root gap on thicker material',
        'Electrode or wire too large to reach into the root',
        'Arc not aimed into the root of the joint'
      ],
      fixNow: [
        'Increase current and slow down slightly',
        'Bevel the edges and open the root gap to 1.5–3 mm on material over about 5 mm',
        'Use a smaller diameter electrode for the root run so it fits in the joint',
        'Where you can access the back, gouge or grind the root out and put a sealing run in from behind'
      ],
      prevent: [
        'Prepare the joint properly — most penetration problems are fit-up problems',
        'Cut a practice weld in half and look at the cross-section to see where your heat really gets to'
      ],
      processNote: 'Very common on butt joints in thick plate welded with no edge preparation.'
    },
    {
      id: 'burn-through',
      name: 'Burn-through',
      icon: '💥',
      severity: 'Must be repaired, but at least it\'s honest — you can see it',
      plain: "Too much heat for the metal, so the puddle collapsed and dropped out, leaving a hole.",
      match: { hole: 5, warped: 1 },
      causes: [
        'Too much current for the thickness',
        'Travelling too slowly, letting heat build in one spot',
        'Root gap too wide',
        'The part heat-soaking through a long run without you easing off',
        'Thin sheet with no heat sink behind it'
      ],
      fixNow: [
        'Drop the current, speed up, and let the part cool right down before you try again',
        'Clamp a copper backing bar behind the joint — copper pulls the heat away and molten steel won\'t stick to it',
        'Use short stitch welds with pauses instead of one continuous run',
        'Fill the hole by building from the cool edges inward at low current, in dabs'
      ],
      prevent: [
        'On thin sheet, treat heat as the enemy: less current, faster travel, stitch and pause',
        'On TIG, back the pedal off progressively as the part warms up'
      ],
      processNote: 'Most common on sheet under 2 mm, and on any TIG run long enough for the part to heat-soak.'
    },
    {
      id: 'hot-crack',
      name: 'Hot cracking (solidification cracking)',
      icon: '🩸',
      severity: 'Never acceptable — cracks propagate',
      plain: "A crack that formed while the weld was still freezing, often straight down the centre of the bead or in the crater at the end of a run.",
      match: { 'crack-hot': 5, uneven: 1 },
      causes: [
        'Craters left unfilled at the end of a run — the classic crater crack',
        'A bead much deeper than it is wide (a narrow deep profile is crack-prone)',
        'Heavy restraint — the joint clamped so it can\'t move as it shrinks',
        'Contaminants, particularly sulphur, in the parent metal',
        'Welding a high-restraint joint too fast and too hot'
      ],
      fixNow: [
        'Gouge or grind the crack out completely — right past both ends of it — and re-weld',
        'Fill your craters: taper the current down and add filler at the end of every run',
        'Aim for a bead wider than it is deep',
        'Reduce restraint if you can, or weld a sequence that lets the joint move'
      ],
      prevent: [
        'Make crater filling an automatic habit on every single stop',
        'Watch bead profile on deep narrow joints'
      ],
      processNote: 'Crater cracks show up in every process. Deep narrow beads are especially a submerged-arc and high-speed MIG issue.'
    },
    {
      id: 'cold-crack',
      name: 'Cold cracking (hydrogen / delayed cracking)',
      icon: '⏳',
      severity: 'Never acceptable — and it appears after you\'ve gone home',
      plain: "A crack that turns up hours or days after welding, usually in the heat-affected zone beside the weld rather than in the weld itself. It needs three things at once: hydrogen, a hard brittle structure, and stress.",
      match: { 'crack-late': 5, dirty: 2 },
      causes: [
        'Hydrogen — damp electrodes, moisture, oil, paint or rust on the joint',
        'A hard brittle heat-affected zone from a hardenable or thicker steel cooling too fast',
        'Stress from restraint — the joint held rigid while it shrinks',
        'No preheat on thick or higher-carbon steel'
      ],
      fixNow: [
        'Gouge the crack out completely and re-weld with dry low-hydrogen electrodes',
        'Preheat the joint (thickness and carbon content set the temperature — check the procedure for the steel)',
        'Slow the cooling: weld in a warm shop, cover the joint, don\'t quench it'
      ],
      prevent: [
        'Keep E4818 / E7018 in a sealed tin or rod oven, always',
        'Clean joints back to bright metal',
        'Preheat thick or higher-carbon steel, and reduce restraint where you can'
      ],
      processNote: 'Above all a stick-welding and thick-section issue. It is the reason low-hydrogen rod storage is treated so seriously.'
    },
    {
      id: 'distortion',
      name: 'Distortion / warping',
      icon: '📏',
      severity: 'Not a strength defect, but it can ruin a job dimensionally',
      plain: "Heat expanded the metal, then the weld shrank as it cooled and dragged everything toward it. The part is now out of shape or out of square.",
      match: { warped: 5, hole: 1 },
      causes: [
        'Too much heat, usually from over-welding — a bigger weld than the job needed',
        'All the welding done in one direction, letting shrinkage accumulate',
        'One side of a joint completed before the other',
        'Too few tacks, or tacks too far apart',
        'Nothing clamped or jigged'
      ],
      fixNow: [
        'Stop and let it cool completely before doing anything — welding on into a distorting part locks it in',
        'Straightening after the fact means careful localised heating or mechanical force, and it is a skill of its own',
        'On the next one, apply the preventions below'
      ],
      prevent: [
        'Weld to the size required and no bigger — over-welding is the number one cause',
        'Many small tacks rather than a few big ones',
        'Backstep: progress overall one way, weld each short segment the other way',
        'Alternate sides and stagger welds around the part rather than working along it',
        'Clamp to something heavy, or use a jig, and let it cool clamped',
        'Pre-set the parts tilted opposite to the expected pull'
      ],
      processNote: 'Worst on thin material and on long runs. TIG on sheet is where most people meet it first.'
    },
    {
      id: 'slag',
      name: 'Slag inclusion',
      icon: '🪨',
      severity: 'Serious — trapped slag is a void with a sharp edge',
      plain: "Bits of the flux slag got trapped inside the weld instead of floating to the top. Shows up as grey, glassy or dull patches in or on the bead.",
      match: { glassy: 5, uneven: 1 },
      causes: [
        'Previous pass not chipped and wire-brushed clean before the next one',
        'Slag running ahead of the arc — usually a wrong travel angle, or travelling too slowly',
        'Too low a current, so the slag doesn\'t stay fluid long enough to float out',
        'A bead profile with deep valleys between passes that trap slag',
        'Weaving too wide so slag gets caught at the edges'
      ],
      fixNow: [
        'Chip and wire-brush between every single pass, then actually look before you weld',
        'Increase the drag angle so slag trails behind the arc where it belongs',
        'Increase current a little and keep travel steady',
        'Grind out visible inclusions and re-weld'
      ],
      prevent: [
        'Treat inter-pass cleaning as part of the weld, not as tidying up afterwards',
        'Keep bead profiles smooth so there are no valleys for slag to hide in'
      ],
      processNote: 'A stick (SMAW) and flux-cored (FCAW) issue — the processes that make slag. MIG with solid wire and TIG do not.'
    },
    {
      id: 'tungsten-contamination',
      name: 'Tungsten contamination (TIG)',
      icon: '⚫',
      severity: 'Tungsten inclusions are a rejectable defect on coded work',
      plain: "The tungsten touched the puddle or the filler rod, so it's picked up steel and gone black — and it's spitting bits of tungsten into your weld. The arc goes fat, hissing and wandery.",
      match: { tungsten: 5, 'sound-bad': 1 },
      causes: [
        'Dipping the tungsten into the molten puddle',
        'Touching the filler rod to the tungsten instead of the puddle',
        'Tungsten stuck out too far past the cup with poor gas coverage',
        'Too small a tungsten for the amperage, so the tip melts',
        'A needle-sharp point melting off in the first seconds',
        'Post-flow too short, letting the hot tungsten oxidise'
      ],
      fixNow: [
        'Stop. Snap or grind the contaminated end off and regrind lengthwise on a dedicated wheel',
        'Grind out any dark specks in the weld — those are tungsten inclusions',
        'Leave a small flat on the tip rather than a needle point',
        'Step up a tungsten size if you\'re at the top of its amp range',
        'Set post-flow to about one second per 10 A'
      ],
      prevent: [
        'Grind five or six tungstens before you start, so stopping to regrind is never a temptation',
        'Feed the rod into the leading edge of the puddle, well clear of the tungsten',
        'Keep tungsten stick-out short — about the diameter of the cup opening as a guide'
      ],
      processNote: 'TIG only, by definition — but it will happen to you on the way to being good at TIG. Everyone dips.'
    },
    {
      id: 'spatter',
      name: 'Excessive spatter',
      icon: '✳️',
      severity: 'Mostly a symptom — but it tells you the settings are off',
      plain: "Balls of metal thrown out and stuck all over the plate. Not usually a strength problem in itself, but it means the arc isn't running right, and everything you weld will be slightly worse until it's sorted.",
      match: { spatter: 5, 'sound-bad': 2, dirty: 1 },
      causes: [
        'Arc held too long (stick), or voltage too high for the wire speed (MIG)',
        'Wire speed too high for the voltage — the wire stubs into the plate and pops',
        'Wrong polarity — check the electrode box or wire type',
        'Worn or spatter-blocked contact tip on MIG',
        'Straight CO₂ shielding gas instead of an argon blend',
        'Damp electrodes or a dirty joint'
      ],
      fixNow: [
        'MIG popping and stubbing → raise the voltage or slow the wire',
        'MIG hissing with a long arc → drop the voltage or feed more wire',
        'Tune by ear until it sounds like bacon frying evenly in a hot pan',
        'Check polarity: solid wire with gas is DCEP, gasless flux-cored is DCEN',
        'Change the contact tip — they\'re a couple of dollars and they wear out',
        'Stick: shorten the arc to about one electrode diameter'
      ],
      prevent: [
        'Write your good settings on tape stuck to the machine, per thickness',
        'Use anti-spatter spray on the nozzle and the surrounding plate to save cleanup'
      ],
      processNote: 'Loudest on MIG with straight CO₂, and on stick with too long an arc or the wrong polarity.'
    },
    {
      id: 'technique',
      name: 'Inconsistent technique',
      icon: '📉',
      severity: 'Not a defect on its own — it\'s the cause of half the ones above',
      plain: "Ripples wandering, width changing, height uneven. There's no single fault here — it's the hands. And that's genuinely good news, because it's the thing that improves fastest with practice.",
      match: { uneven: 5 },
      causes: [
        'Travel speed varying through the run',
        'Arc length or stick-out changing as your arm extends',
        'Nothing braced — freehand shake shows up in every bead',
        'Awkward body position you can\'t hold for the length of the weld',
        'Can\'t actually see the joint — wrong helmet shade or a dirty lens'
      ],
      fixNow: [
        'Brace: rest your hand on the bench, the work, or your other hand. Every good welder braces',
        'Before striking an arc, run the whole weld dry with the helmet up and check you can reach the end comfortably',
        'Set your body so you pull toward yourself rather than reaching away',
        'Check your helmet shade — if you\'re squinting to find the puddle, go one shade lighter',
        'Practise short runs on scrap and compare them side by side'
      ],
      prevent: [
        'Padding beads: run overlapping beads across a plate, each overlapping the last by a third. It is the classic drill for a reason',
        'Do fifty short runs rather than five long ones — repetition of starts is where the skill builds'
      ],
      processNote: 'Every process, every welder, first six months. It is not a talent problem, it is a repetition problem.'
    }
  ],

  /* --------------------------------------------------------------------- */
  /* CHEAT SHEETS                                                           */
  /* --------------------------------------------------------------------- */
  cheatsheets: [
    {
      id: 'smaw',
      title: 'Stick (SMAW) starting amps',
      icon: '⚡',
      note: 'Mild steel. Start at the lower end and dial up until the arc runs smoothly and the rod stops sticking.',
      columns: ['Electrode', 'Amps', 'Suits'],
      rows: [
        ['2.5 mm', '60–90 A', 'Sheet and light section, 2–4 mm'],
        ['3.2 mm', '90–130 A', 'General work, 4–8 mm — the everyday size'],
        ['4.0 mm', '130–180 A', 'Heavy work, 8 mm and up'],
        ['5.0 mm', '180–250 A', 'Thick plate, flat position mostly']
      ],
      extras: [
        'Rough rule: about 30–40 A per mm of electrode diameter.',
        'Vertical up: drop 10–15% from your flat setting.',
        'E4313 (E6013) = easy, tidy, shallow. E4112 (E6011) = deep dig through rust. E4818 (E7018) = strong, smooth, must stay dry.',
        'Check the box for polarity. Most run DCEP (electrode positive).',
        'Arc length ≈ one electrode diameter.'
      ]
    },
    {
      id: 'gmaw',
      title: 'MIG (GMAW) starting settings',
      icon: '🔥',
      note: 'Mild steel, ER70S-6 solid wire, argon/CO₂ blend, DCEP. Every machine reads slightly differently — tune by ear from here.',
      columns: ['Thickness', 'Wire', 'Volts', 'Wire speed'],
      rows: [
        ['1.0 mm sheet', '0.8 mm', '15–17 V', '3.0 m/min'],
        ['2 mm', '0.8 mm', '17–18 V', '4.0 m/min'],
        ['3 mm', '0.8 mm', '18–20 V', '5.0 m/min'],
        ['5 mm', '0.9 mm', '20–22 V', '6.0 m/min'],
        ['6 mm +', '0.9 mm', '22–24 V', '6.5+ m/min, bevel and multi-pass']
      ],
      extras: [
        'Gas flow 12–15 L/min. More is not better — too much goes turbulent and pulls air in.',
        'Stick-out about 10 mm. Longer stick-out silently makes the weld colder.',
        'Gun 10–15° from vertical. Push for a flatter bead, drag for deeper penetration.',
        'Gasless flux-cored wire: swap to DCEN, and always drag so the slag trails.',
        'Sound check: steady even crackle, like bacon frying. Popping = too much wire. Hissing = too much volts.'
      ]
    },
    {
      id: 'gtaw',
      title: 'TIG (GTAW) starting settings',
      icon: '💎',
      note: '100% argon. Steel and stainless on DCEN, aluminium on AC. Set the machine here, then control the heat with the pedal.',
      columns: ['Thickness', 'Tungsten', 'Amps (steel)', 'Filler'],
      rows: [
        ['1 mm', '1.6 mm', '~40 A', '1.6 mm'],
        ['2 mm', '1.6 mm', '~80 A', '1.6 mm'],
        ['3 mm', '2.4 mm', '~120 A', '2.4 mm'],
        ['5 mm', '2.4 mm', '~200 A', '2.4 mm'],
        ['6 mm +', '3.2 mm', '240 A +', '3.2 mm']
      ],
      extras: [
        'Rule of thumb: about 40 A per mm of mild steel. Stainless 15–20% less. Aluminium more — think 45–50 A/mm and up.',
        'Argon flow 6–10 L/min. Post-flow about 1 second per 10 A.',
        'Lanthanated (gold) or ceriated (grey) tungsten for everything. Grind lengthwise, leave a small flat on the tip.',
        'Aluminium: AC, balance around 65–70% electrode negative, frequency around 120 Hz to start.',
        'Torch 15–20° from vertical, filler in low from the front. Puddle first, then dab.'
      ]
    },
    {
      id: 'fillet',
      title: 'Fillet sizes and joint prep',
      icon: '📐',
      note: 'The drawing always wins. These are the defaults when there isn\'t one.',
      columns: ['Plate', 'Fillet leg', 'Butt prep'],
      rows: [
        ['2 mm', '3 mm', 'Square edge, weld one side'],
        ['3 mm', '3 mm', 'Square edge, small root gap'],
        ['5 mm', '5 mm', 'Square edge or light bevel'],
        ['6 mm', '6 mm', 'Single V bevel, 1.5–3 mm root gap'],
        ['10 mm', '8–10 mm', 'Single V, multi-pass'],
        ['12 mm +', 'Per drawing', 'Double V both sides, multi-pass']
      ],
      extras: [
        'Rule of thumb: fillet leg ≈ thickness of the thinner plate.',
        'Fillet throat ≈ leg × 0.7. The throat carries the load.',
        'Over-welding buys distortion and wasted time, not strength. Weld to size and stop.',
        'Bevel angle for a single V is typically 30–35° per edge (60–70° included).'
      ]
    }
  ],


  /* --------------------------------------------------------------------- */
  /* SCRAP & SALVAGE — the trade around the trade                           */
  /* --------------------------------------------------------------------- */
  scrapGuide: [
    {
      id: 'reality',
      icon: '💰',
      title: 'What a yard actually pays',
      body: [
        'The prices on the board above are **spot** — what a tonne of refined metal trades for on a world market. That is not what the yard on the edge of town hands you, and anyone who tells you otherwise is selling something.',
        'A yard has to sort it, store it, cart it and sell it on, so they buy at a discount. As a rough feel: clean bright copper wire might fetch somewhere near two thirds of spot, mixed and dirty grades a good deal less, and steel is priced per tonne in a range that makes it a volume game rather than a payday.',
        'What that means practically is that **the grade you present is worth more than the weight you present.** The same 20 kg of copper can pay wildly differently depending on whether it is clean bright wire or a tangle of insulated cable with steel fittings still attached.'
      ],
      points: [
        'Spot price is the ceiling, never the offer.',
        'Sorted and clean beats mixed and dirty, every time.',
        'Ring two yards before you drive anywhere — prices differ more than you would think.',
        'Ask what grade they are calling it. If they call your bright wire "mixed", ask why.'
      ]
    },
    {
      id: 'metals',
      icon: '🔩',
      title: 'The metals that actually pay',
      body: [
        'Learning to tell these apart by eye is the same skill as unit 8 — and it pays twice, once at the yard and once when you know what you are about to weld.'
      ],
      points: [
        '**Copper** — the best common earner. Bright bare wire is the top grade; then heavier tube and busbar; then insulated cable at a lower rate because they have to strip it.',
        '**Brass** — yellow and red. Taps, fittings, old valves. Pays well and turns up in every renovation skip.',
        '**Aluminium** — light and everywhere. Extrusion (window frames, ladders) pays better than cast (engine parts) and much better than cans by the hour it takes to collect them.',
        '**Lead** — flashing, old sinkers, wheel weights. Heavy for its size, and hazardous — wash your hands, never grind or burn it.',
        '**Stainless** — 304 and 316 pay several times what mild steel does. A magnet mostly will not stick to either.',
        '**Electric motors** — copper windings inside a steel case, so they get their own price. Do not bother pulling them apart unless you are quick at it.',
        '**Catalytic converters** — genuinely valuable (platinum and palladium, see the board above), and precisely because of that they are the most stolen part in the country. Only ever sell one you can account for.',
        '**Steel** — cheap per kilo, but it is the volume that makes a trailer load worth taking. And offcuts are free practice stock, which is worth more to you right now than the scrap price.'
      ]
    },
    {
      id: 'sorting',
      icon: '🧲',
      title: 'Sorting it like someone who knows',
      body: [
        'Five minutes of sorting in your own yard, where you are not being watched and not in a queue, is the difference between a mixed-grade price and a clean-grade price.'
      ],
      points: [
        'Magnet first. Sticks: steel or cast iron. Does not stick: copper, brass, aluminium, lead, stainless — the ones worth money.',
        'Then weight in the hand. Aluminium is obviously light; lead is startlingly heavy; brass rings when you tap it.',
        'Colour under a file stroke: copper goes salmon-pink, brass goes yellow, and a plated fitting shows its real metal underneath.',
        'Keep separate bins from the start. Re-sorting a mixed pile at the yard is how people end up accepting the lower price out of embarrassment.',
        'Strip insulation only if the time is worth it — work out what the strip rate gains you per hour before you spend an evening on it.',
        'Remove steel bolts, brackets and fittings from non-ferrous items. That is what turns a "clean" grade into a "dirty" one.'
      ]
    },
    {
      id: 'danger',
      icon: '⚠️',
      title: 'What to never put in the trailer',
      body: [
        'This list exists because people have been killed by items on it, and most of them were being careful in every other respect.'
      ],
      points: [
        '**Gas bottles and sealed vessels** — never cut, never grind, never weld. Even "empty" ones hold vapour. Yards will not take them, and cutting one is how people die.',
        '**Fuel tanks and drums** — same rule. A drum that held fuel is a bomb with a lid.',
        '**Aerosol cans and pressurised cylinders** — they explode in a baler.',
        '**Lithium batteries** — a genuine fire risk, and a growing cause of truck and yard fires. Take them to a proper battery drop-off. Lead-acid car batteries most yards do accept, separately.',
        '**Anything with asbestos** — old shed cladding, old brake shoes, some old flue and pipe lagging. Stop, do not cut, and get advice.',
        '**Old gauges and instruments** — a small number of industrial ones contain radioactive sources. Rare, but real.',
        '**Anything you cannot account for.** Copper and cat converter theft is why the paperwork exists.'
      ]
    },
    {
      id: 'paperwork',
      icon: '🪪',
      title: 'The paperwork, and being straight about it',
      body: [
        'Scrap is a regulated trade in Australia now, precisely because metal theft got out of hand. Several states — New South Wales under the Scrap Metal Industry Act 2016 among them — **ban cash payment for scrap metal entirely**: you get paid by bank transfer, you show ID, and the yard records the transaction and often photographs the load.',
        'Rules differ by state, so check your own before you turn up expecting notes. Take a driver\'s licence, expect to give your bank details, and expect questions about anything high-value.',
        'None of that is aimed at you. It is aimed at the person selling someone else\'s downpipes. Being visibly straight — knowing where your metal came from and saying so — is what gets you treated as a regular rather than a risk.'
      ],
      points: [
        'Bring photo ID, every time.',
        'Expect EFT rather than cash in several states, including NSW.',
        'Keep a note of where bigger items came from — a demo job, a farm clean-up, a client.',
        'Cat converters, air conditioner coils and copper cable draw the most questions. Have your answer ready.'
      ]
    },
    {
      id: 'welder',
      icon: '⚡',
      title: 'Where this meets your welding',
      body: [
        'The scrap yard is not a side hustle bolted onto this app. It is the same skill set pointed at a different problem, and it feeds your practice.'
      ],
      points: [
        'Offcut bins are practice stock. Ask — many yards and fabrication shops will let you take mild steel drops for nothing or near it.',
        'Identifying unknown metal at the yard is the exact drill from unit 8. Magnet, weight, file, spark.',
        'Never weld a coated, painted or galvanised piece of scrap without grinding it back first — unit 1 covers why.',
        'Selling your practice coupons afterwards recovers a little of what the steel cost you. Photograph the good ones first.',
        'And the honest one: recovering gold from electronics at home is chemistry with nasty reagents for a few dollars an hour. The money in metal, for someone with your skills, is in copper, brass, stainless and knowing what you are looking at.'
      ]
    }
  ],

  /* --------------------------------------------------------------------- */
  /* PRE-FLIGHT CHECKLIST                                                   */
  /* --------------------------------------------------------------------- */
  preflight: [
    {
      id: 'ppe',
      title: 'On your body',
      icon: '🧤',
      items: [
        'Helmet on, correct shade dialled in for the amps',
        'Safety glasses on UNDER the helmet',
        'Leather or FR cotton — no synthetics anywhere',
        'Sleeves down, collar up, shirt tucked in, cuffs not turned up',
        'Trousers over the boots, not tucked in',
        'Gloves dry — thick for stick and MIG, thin for TIG',
        'Ear protection if there\'s grinding or you\'re overhead'
      ]
    },
    {
      id: 'area',
      title: 'Around you',
      icon: '🔥',
      items: [
        'Flammables cleared to 10 m — fuel, thinners, rags, cardboard, dry grass',
        'Fire extinguisher within arm\'s reach',
        'Ventilation on, or set up so the plume rises past you, not through you',
        'Floor dry, nothing to trip on, leads run out of the walkway',
        'Screens up if anyone else is in the area',
        'Nothing sealed or previously full of fuel — never weld a closed container'
      ]
    },
    {
      id: 'machine',
      title: 'Machine and metal',
      icon: '⚙️',
      items: [
        'Leads checked — no cracked insulation, lugs tight',
        'Work clamp on clean bare metal, close to the weld',
        'Correct polarity for the electrode or wire',
        'Gas bottle secured upright, valve open, flow set',
        'Correct rod / wire / tungsten loaded, and dry',
        'Joint cleaned back to bright metal, 25 mm either side',
        'Galvanising or paint ground back if present',
        'Fit-up right and tacked — small tacks, plenty of them',
        'Amps set for thickness, and a test bead run on scrap'
      ]
    },
    {
      id: 'after',
      title: 'When you finish',
      icon: '✅',
      items: [
        'Crater filled on the last run',
        'Slag chipped and weld wire-brushed',
        'Weld inspected — size, tie-in at the toes, no cracks, no undercut',
        'Anything doubtful photographed for the log',
        'Hot metal marked or isolated so nobody grabs it',
        'Machine off, gas valve closed, leads coiled',
        'Fire watch — come back and check the area in 30–60 minutes'
      ]
    }
  ]
};

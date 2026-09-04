/* ============================================================================
 * WELD ACADEMY — PRACTICE & RECALL
 * ----------------------------------------------------------------------------
 * Every lesson can be taken five ways (see the mode switcher in app.js):
 *   READ    the full lesson          (in content.js)
 *   GUTS    key points only          (in content.js)
 *   SHOW    diagram first            (in diagrams.js)
 *   DO      a bench drill            ← this file
 *   RECALL  flip cards               ← this file
 *
 * DO is the one that makes her proficient rather than informed. Each drill has
 * a task, why it matters, numbered steps, and pass criteria she can judge
 * herself against — the same way a trainer would mark it.
 *
 * RECALL is active retrieval, which is the single best-evidenced way to make
 * something stick. Two cards per lesson, deliberately short.
 * ==========================================================================*/

window.WA_PRACTICE = {

  /* ======================= 1. SAFETY ================================== */
  'safety-1': {
    practice: {
      task: 'Walk your workspace and name the four hazards out loud',
      why: 'You cannot control what you have not consciously spotted. Doing this once properly rewires how you walk into a shed forever.',
      kit: ['Just your eyes', '5 minutes'],
      steps: [
        'Stand where you will be welding and turn a slow full circle.',
        'Point at where an arc-eye risk is: who else could see your arc from here? Anyone in the house, the yard, a passing car?',
        'Point at where the fume will go when it leaves your weld. Straight past your face, or away?',
        'Point at every burnable thing within 10 metres. Count them out loud.',
        'Point at the nearest thing that would be carrying current if something went wrong.'
      ],
      pass: [
        'You found at least three flammables you had not previously noticed',
        'You can say where the fume goes without guessing',
        'You know where the extinguisher is without looking for it'
      ]
    },
    recall: [
      { q: 'How long after a flash does arc eye usually hurt?', a: 'Six to twelve hours later — often waking you in the middle of the night. Nothing hurts at the time, which is why people risk it.' },
      { q: 'How far can spatter travel, and how long can it smoulder?', a: 'Up to about 10 metres, and it can smoulder in rags, dust or timber for 30+ minutes after you stop.' }
    ]
  },
  'safety-2': {
    practice: {
      task: 'Kit inspection and a shade test',
      why: 'Most PPE failures are not missing gear — they are gaps. Cuffs, collars, boot tops. Find yours before spatter does.',
      kit: ['All your welding gear', 'The machine, for the shade test'],
      steps: [
        'Put every piece of gear on as if you were about to weld.',
        'Now hunt for gaps: crouch, reach overhead, turn your head. Where can you see skin or a fabric funnel?',
        'Check trouser legs sit OVER your boots, not tucked in.',
        'Pull the label out of your shirt and read the fabric. Any polyester or nylon: that shirt is retired from welding.',
        'Set the helmet shade for the amps you plan to run, strike a short arc on scrap and check you can clearly see the puddle edge.',
        'If you are squinting to find the puddle, go one shade lighter. If your eyes ache afterwards, go one darker.'
      ],
      pass: [
        'No skin visible in any working position',
        'Nothing synthetic anywhere in the outfit',
        'You can see the puddle edge clearly at your normal working amps'
      ]
    },
    recall: [
      { q: 'What shade for roughly 150 A?', a: 'Shade 11–12. Under 100 A is around 10, over 200 A is 12–13.' },
      { q: 'Why never synthetic clothing?', a: 'Polyester and nylon melt into skin. It turns a small burn into a skin graft.' }
    ]
  },
  'safety-3': {
    practice: {
      task: 'Set up a compliant hot work area, and time your fire watch',
      why: 'This is the habit that stops you being the person who burned down the shed. It takes four minutes.',
      kit: ['Extinguisher', 'A timer (your phone)', 'Something to screen the arc'],
      steps: [
        'Clear everything burnable to 10 m — including what is behind and under the bench.',
        'Put the extinguisher within arm\'s reach of where you will stand, not where it usually lives.',
        'Set up your ventilation so the plume leaves past you, and check it by watching where smoke drifts.',
        'Put a screen or curtain between your arc and anyone else in the area.',
        'Weld your job.',
        'Set a 45 minute timer on your phone the moment you finish. When it goes off, walk the area again — hand near, not on, anything that was hot.'
      ],
      pass: [
        'Nothing burnable inside 10 m at the moment you struck the arc',
        'You did the 45 minute walk-back, not just intended to',
        'You could grab the extinguisher without taking a step'
      ]
    },
    recall: [
      { q: 'How far must flammables be cleared for hot work?', a: '10 metres — the Australian hot-work convention, because spatter goes much further than people expect.' },
      { q: 'What is metal fume fever and what causes it?', a: 'Zinc chills: fever, aching and shivering that night from vaporised galvanising. Grind the coating back 25–50 mm and ventilate hard.' }
    ]
  },
  'safety-4': {
    practice: {
      task: 'Lead and clamp inspection',
      why: 'The work clamp is behind more "my machine is stuffed" complaints than any actual fault. Learn to check it in ten seconds.',
      kit: ['Your machine', 'A wire brush or grinder', 'Gloves'],
      steps: [
        'Machine OFF. Run the whole length of both leads through your hands, feeling for cracks, cuts, hard spots and heat damage.',
        'Check the lug where each lead enters the machine and the stinger — tight, no discolouration.',
        'Clean a patch of bare metal on your workpiece with a wire brush or flap disc.',
        'Clamp directly to that patch, as close to your weld as is practical.',
        'Weld for a minute, then switch off and feel the clamp with the back of a gloved hand.'
      ],
      pass: [
        'No damaged insulation anywhere on either lead',
        'The clamp is on bright bare metal, on the workpiece itself, near the weld',
        'The clamp is cool, not warm, after a run'
      ]
    },
    recall: [
      { q: 'What makes welding voltage dangerous?', a: 'Conditions, not voltage alone: sweat, damp gloves, a wet floor. 50–80 V open circuit is plenty through a wet path.' },
      { q: 'What does a warm work clamp mean?', a: 'A bad connection — resistance where there should be none. Fix it before you chase any other fault.' }
    ]
  },

  /* ======================= 2. READING THE PRINT ======================= */
  'print-1': {
    practice: {
      task: 'Find all five joints in things you already own',
      why: 'Once you can see joints in the world, drawings stop being abstract.',
      kit: ['Your phone camera', 'A walk around the house, shed or street'],
      steps: [
        'Photograph a butt joint. (Handrail splices, tank seams, trailer chassis.)',
        'Photograph a lap joint. (Sheet metal, ducting, gate panels.)',
        'Photograph a T-joint. (Any bracket, post base, shelf frame, gate hinge plate.)',
        'Photograph a corner joint. (Box sections, tool boxes, tank corners.)',
        'Photograph an edge joint if you can find one — they are rarer.',
        'Save them into your weld log with the joint name as the note.'
      ],
      pass: [
        'At least four of the five found and correctly named',
        'For each one, you can say why the fabricator chose that joint'
      ]
    },
    recall: [
      { q: 'Which joint is the strength joint, and what makes it least forgiving?', a: 'The butt joint. Full penetration makes it as strong as the parent metal, but you must get heat all the way through without falling through.' },
      { q: 'What does 10 mm plate need before a butt weld, and why?', a: 'A bevel. You cannot melt right through a square 10 mm edge from one side.' }
    ]
  },
  'print-2': {
    practice: {
      task: 'Tack up one T-joint and weld it in three positions',
      why: 'Position is not theory — you feel it. Same joint, same settings, three completely different jobs.',
      kit: ['Scrap plate, 5–6 mm, six pieces', 'Whatever process you have running'],
      steps: [
        'Tack up three identical T-joints from scrap.',
        'Weld the first flat on the bench (PA/PB). Note your amps.',
        'Clamp the second in the vice so the joint runs vertically. Drop the amps 10–15% and weld it upward (PF).',
        'Clamp the third so you have to weld it from underneath (PD). Same amps as vertical, shortest arc you can hold.',
        'Line all three up and photograph them side by side into the log.'
      ],
      pass: [
        'All three welded without the puddle running out of the joint',
        'You reduced the amps for vertical and overhead without being told to',
        'You can name which was hardest and exactly why'
      ]
    },
    recall: [
      { q: 'PF versus PG — which one do codes usually want, and why?', a: 'PF (vertical up). PG (down) runs metal ahead of the arc on thicker steel and leaves lack of fusion under a tidy-looking bead.' },
      { q: 'What are 5G and 6G?', a: 'Fixed pipe tests — 5G horizontal fixed, 6G at 45°. 6G is the benchmark "weld this and you can weld anything" test.' }
    ]
  },
  'print-3': {
    practice: {
      task: 'Weld to a called size and measure it honestly',
      why: 'Welding "about right" is guessing. One gauge turns you into someone who can defend their work.',
      kit: ['Fillet weld gauge (about $12)', 'Scrap 6 mm plate', 'A T-joint tacked up'],
      steps: [
        'Decide the size before you start: 6 mm plate, so a 6 mm fillet.',
        'Weld the joint aiming for exactly that — not bigger.',
        'Clean it, then measure both legs with the gauge at three points along the run.',
        'Write the three measurements down.',
        'Weld a second one deliberately oversized, and time both runs.'
      ],
      pass: [
        'Legs within about 1 mm of the called size at all three points',
        'Legs roughly equal to each other',
        'You can state how much longer the oversized one took, and how much more it distorted'
      ]
    },
    recall: [
      { q: 'What is the throat of an equal-leg 10 mm fillet?', a: 'About 7 mm — leg × 0.7. The throat carries the load.' },
      { q: 'Why is over-welding a fault, not generosity?', a: 'It buys heat, distortion, time and consumables, but no strength the joint asked for. Inspectors pull it up.' }
    ]
  },
  'print-4': {
    practice: {
      task: 'Draw the symbol for a job, then weld from your own drawing',
      why: 'Writing a symbol is the fastest way to stop misreading them.',
      kit: ['Paper and pen', 'Scrap for a small job'],
      steps: [
        'Sketch a simple bracket: an upright plate on a base plate.',
        'Draw the welding symbol calling for a 5 mm fillet, arrow side only.',
        'Now redraw it calling for 5 mm fillets BOTH sides.',
        'Now redraw as intermittent: 40 mm runs on 120 mm centres, arrow side, weld all round.',
        'Hand the third drawing to someone else and ask them to describe what to weld. If they get it right, your symbol is right.',
        'Weld the job from your own drawing.'
      ],
      pass: [
        'Symbols below the line for arrow side, above for other side',
        'Size on the left, length–pitch on the right',
        'Someone else read your drawing correctly without you explaining it'
      ]
    },
    recall: [
      { q: 'Below the line means what?', a: 'Arrow side — the side the arrow points at. Above the line is the other side. Both means weld both sides.' },
      { q: 'What does 50–150 to the right of a fillet symbol mean?', a: '50 mm of weld, repeating every 150 mm centre to centre — so 50 on, 100 off.' }
    ]
  },

  /* ======================= 3. STICK / SMAW ============================ */
  'smaw-1': {
    practice: {
      task: 'Set the machine up from scratch, three times',
      why: 'Set-up should be muscle memory, so that when a weld goes wrong you can rule the machine out in seconds.',
      kit: ['Stick machine', 'A packet of electrodes', 'Scrap plate'],
      steps: [
        'Read the electrode box. Say the polarity out loud.',
        'Set that polarity on the machine.',
        'Clean bare metal, clamp on close to the joint.',
        'Set amps for the electrode diameter (3.2 mm → start about 110 A).',
        'Strike an arc, run 50 mm, stop. Chip the slag.',
        'Now tear it all down and do it again, twice more, without looking anything up.'
      ],
      pass: [
        'Third set-up done from memory in under two minutes',
        'You checked polarity against the box rather than assuming',
        'Slag lifted off cleanly in one or two pieces'
      ]
    },
    recall: [
      { q: 'What two jobs does the flux coating do?', a: 'It burns to make a shielding gas, and it leaves a slag blanket that protects the weld while it solidifies.' },
      { q: 'DCEP versus DCEN?', a: 'DCEP (electrode positive) gives deeper penetration and is what most rods including E4818 want. DCEN puts more heat in the work with a shallower melt.' }
    ]
  },
  'smaw-2': {
    practice: {
      task: 'Run the same weld with three different rods',
      why: 'Nothing teaches electrode choice like feeling the difference in your hands within ten minutes.',
      kit: ['E4313, E4112 and E4818 in 3.2 mm', 'Scrap plate, some clean, one deliberately rusty'],
      steps: [
        'Run a 75 mm bead on clean plate with E4313. Note the sound, the slag, the bead.',
        'Same bead, same amps, with E4818. Note how much smoother it runs.',
        'Same bead with E4112 — note how much more aggressive it is.',
        'Now try each of the three on the rusty plate and see which one copes.',
        'Photograph all six side by side into your log with the rod names.'
      ],
      pass: [
        'You can pick which rod ran which bead without labels',
        'You can say which rod handled the rusty plate best and why',
        'The E4818 rods went straight back in a sealed tin afterwards'
      ]
    },
    recall: [
      { q: 'What does the 48 in E4818 mean?', a: 'Minimum tensile strength of 480 MPa (AS/NZS 4855 uses units of 10 MPa). That is the AWS E7018 equivalent.' },
      { q: 'Why do low-hydrogen rods live in a sealed tin?', a: 'Moisture puts hydrogen in the weld, which causes cold cracking hours or days later.' }
    ]
  },
  'smaw-3': {
    practice: {
      task: 'Fifty starts',
      why: 'Beginners practise long beads. Starts are what actually catch you out, and fifty of them in one session will change your welding more than anything else in this app.',
      kit: ['3.2 mm E4313', 'A plate you do not care about'],
      steps: [
        'Set about 110 A.',
        'Strike, run 25 mm, stop. Chip. Repeat.',
        'Do it fifty times. Alternate scratch start and tap start.',
        'Every ten, look back at the row: are the starts getting cleaner and landing where you aimed?',
        'When a rod sticks, twist it free and carry on — do not stop to sulk.'
      ],
      pass: [
        'The last ten starts light within one attempt',
        'You can land the start within about 5 mm of where you aimed',
        'You are feeding the rod in continuously without thinking about it'
      ]
    },
    recall: [
      { q: 'How long should the arc be?', a: 'About one electrode diameter — 3.2 mm gap for a 3.2 mm rod.' },
      { q: 'Where do you look while welding?', a: 'At the puddle, not the arc — specifically the leading edge, where it should be melting fresh metal.' }
    ]
  },
  'smaw-4': {
    practice: {
      task: 'Pad a plate, then take it vertical',
      why: 'Padding is the classic apprentice drill because it exposes every inconsistency you have. Then vertical proves you can control heat.',
      kit: ['3.2 mm E4313 or E4818', '150 × 150 mm plate, 6 mm+', 'Vice or clamps'],
      steps: [
        'Flat: run a bead across the plate. Chip and brush.',
        'Run the next bead overlapping the first by about a third. Repeat until the plate is covered.',
        'Look across the surface at a low angle — it should be an even corduroy, not a mountain range.',
        'Now clamp a fresh plate vertically.',
        'Drop the amps 10–15%. Weld upward using whip and pause: up out of the puddle, back down into it, pause to fill.',
        'Run three vertical beads. Photograph the best one.'
      ],
      pass: [
        'Padded surface even enough that no bead stands proud of its neighbours',
        'No trapped slag valleys between passes',
        'A vertical bead that has not sagged or run'
      ]
    },
    recall: [
      { q: 'What is the vertical-up rhythm?', a: 'Whip and pause: up out of the puddle to let it freeze, back down into it, pause to fill. Amps down 10–15% from flat.' },
      { q: 'Overhead: why keep the arc short?', a: 'A short arc keeps the puddle small, and small puddles freeze before gravity can drop them on you.' }
    ]
  },
  'smaw-5': {
    practice: {
      task: 'Cause three faults on purpose, then cure them',
      why: 'Deliberately making a fault is how you learn to recognise it instantly. This is the drill that makes the Weld Doctor unnecessary.',
      kit: ['Stick machine and rods', 'Scrap plate'],
      steps: [
        'Turn the amps down 25 A and try to weld. Feel the rod stick. Now cure it with amps alone.',
        'Hold a deliberately long arc for 50 mm. Look at the spatter and the porosity you just made.',
        'Weld to the very end of a plate with the clamp at the far end and watch for arc blow bending the arc.',
        'Cure the arc blow: move the clamp, weld toward it, shorten the arc.',
        'Photograph each fault into the log, labelled.'
      ],
      pass: [
        'You produced all three faults on demand',
        'You cured each one with a single deliberate change',
        'You can now name each fault from a photo alone'
      ]
    },
    recall: [
      { q: 'The arc bends sideways near the end of a plate. What is it?', a: 'Arc blow — unbalanced magnetic field. Move the clamp, weld toward it, shorten the arc, or switch to AC.' },
      { q: 'Slag running ahead of the arc means what?', a: 'Your angle or travel speed is wrong. Slag must trail behind the arc, or it gets welded in.' }
    ]
  },

  /* ======================= 4. MIG / GMAW ============================== */
  'gmaw-1': {
    practice: {
      task: 'Strip and rebuild the wire path',
      why: 'Ninety percent of "my MIG is playing up" lives in the consumables. Once you have had the gun apart, you will never be scared of it again.',
      kit: ['MIG machine', 'Spare contact tip', 'Compressed air if you have it'],
      steps: [
        'Machine off. Remove the nozzle and look inside for spatter build-up. Clean it out.',
        'Unscrew the contact tip. Hold it up to the light — is the hole round or worn oval?',
        'Fit a fresh tip.',
        'Open the feeder. Check the drive roll groove size matches your wire (0.8 mm roll for 0.8 mm wire).',
        'Set the drive tension: just tight enough that the wire does not slip when you press it against a block of wood.',
        'Blow the liner out if you have air.',
        'Reassemble and run a test bead.'
      ],
      pass: [
        'You can name every part you touched',
        'Wire feeds smoothly with no surging',
        'Nozzle interior is clean and the tip is fresh'
      ]
    },
    recall: [
      { q: 'What polarity for solid wire with gas, and for gasless?', a: 'Solid wire with gas is DCEP. Gasless flux-cored is DCEN — swapping wire type means swapping the leads in the machine.' },
      { q: 'The arc surges and dies for no visible reason. First suspect?', a: 'The wire path — a dirty liner, worn tip, or wrong drive tension.' }
    ]
  },
  'gmaw-2': {
    practice: {
      task: 'Clean versus dirty, and windy versus sheltered',
      why: 'You will hear "clean your metal" a thousand times. Seeing the porosity yourself is what makes you actually do it.',
      kit: ['MIG set up on mild steel', 'Two bits of scrap — one bright, one rusty/painted', 'A fan'],
      steps: [
        'Grind one piece of scrap back to bright metal 25 mm either side of where you will weld.',
        'Leave the other rusty or painted.',
        'Run an identical bead on each.',
        'Chip, brush and compare — look closely for pinholes in the dirty one.',
        'Now weld a third bead on clean metal with a fan blowing across it.',
        'Photograph all three side by side into the log.'
      ],
      pass: [
        'The clean bead is visibly sounder than the dirty one',
        'The fan-blown bead shows porosity',
        'You can explain why blocking the wind beats turning the gas up'
      ]
    },
    recall: [
      { q: 'Default wire and gas for mild steel?', a: 'ER70S-6 (0.8 mm up to about 5 mm plate) with an argon/CO₂ blend around 80/20, flowing 12–15 L/min.' },
      { q: 'Why does aluminium MIG need a spool gun?', a: 'Aluminium wire is soft — pushed down a long liner it buckles and birdnests in the feeder.' }
    ]
  },
  'gmaw-3': {
    practice: {
      task: 'Break test: prove your fusion',
      why: 'This is the single most important drill in the whole app. A MIG weld can look perfect and be attached to nothing — and this is how you find out which one you made.',
      kit: ['Two strips of 5–6 mm scrap', 'Vice and a heavy hammer', 'Angle grinder'],
      steps: [
        'Tack two strips into a T-joint. Weld a fillet along ONE side only.',
        'Clamp the base plate in the vice, weld side facing away from you.',
        'Hammer the upright over toward the weld until the joint bends flat or breaks.',
        'Look at the fracture face. Sound fusion is torn, rough, grey metal all the way to the root.',
        'A shiny, smooth, unfused strip along the root is lack of fusion — the weld was sitting on the surface.',
        'Repeat hotter, or slower, until the break tears through sound metal.',
        'Photograph the fracture face into the log.'
      ],
      pass: [
        'The break tore through weld metal rather than peeling off the plate',
        'No shiny unfused line along the root',
        'You can state which settings change fixed it'
      ]
    },
    recall: [
      { q: 'Which transfer mode is a home MIG in, and what is the risk?', a: 'Short circuit (dip) — the bacon-frying sound. Cool and versatile, but risks lack of fusion on thick plate.' },
      { q: 'Why can straight CO₂ never give spray transfer?', a: 'Spray needs an argon-rich shield (roughly 80%+ argon). CO₂ will not support it.' }
    ]
  },
  'gmaw-4': {
    practice: {
      task: 'The stick-out experiment',
      why: 'This proves that a setting you never touched can wreck a weld — and it is the fault beginners cause most often without knowing.',
      kit: ['MIG on mild steel', 'Scrap plate', 'A ruler'],
      steps: [
        'Set the machine for your plate thickness and run a bead at about 10 mm stick-out.',
        'Without touching a single dial, run a second bead at about 25 mm stick-out.',
        'Run a third at 10 mm again to confirm you have not changed anything else.',
        'Compare bead width, height and how the toes tie in.',
        'Break test both if you can — the long stick-out one will usually fail first.'
      ],
      pass: [
        'You can see the difference between bead 1 and bead 2 without measuring',
        'You can hold 10 mm consistently over a whole run',
        'You understand why reaching away from your body makes welds worse'
      ]
    },
    recall: [
      { q: 'Correct MIG stick-out, and what happens if it grows?', a: 'About 10 mm. Longer stick-out heats the wire before it arcs, so less current reaches the joint — a colder, weaker weld with no dial touched.' },
      { q: 'Where do you aim the wire?', a: 'At the leading edge of the puddle. If the arc is riding on molten metal, nothing new is being melted.' }
    ]
  },
  'gmaw-5': {
    practice: {
      task: 'Tune by ear, blindfolded to the dials',
      why: 'The sound tells you more than the numbers, and this drill trains the ear that experienced welders take for granted.',
      kit: ['MIG machine', 'Scrap plate', 'Masking tape and a pen'],
      steps: [
        'Set voltage and wire speed correctly for your plate from the cheat sheet. Run a bead and listen hard to that sound.',
        'Raise the wire speed noticeably. Run a bead — hear the popping and stubbing.',
        'Go back, then raise the voltage well past correct. Run a bead — hear the hollow hiss and see the undercut.',
        'Now have someone spin both dials randomly. Without looking, run beads and tune by ear back to bacon-frying.',
        'Check the dials. How close did you get?',
        'Write your final good settings on masking tape and stick it to the machine.'
      ],
      pass: [
        'You can identify too-much-wire versus too-much-voltage by sound alone',
        'You got back within a small margin of the correct settings without looking',
        'The machine now has your settings written on it'
      ]
    },
    recall: [
      { q: 'Popping and stubbing means?', a: 'Too much wire for the voltage. Raise volts or slow the wire.' },
      { q: 'Hissing with a long arc and undercut means?', a: 'Too much voltage for the wire. Drop volts or feed more wire.' }
    ]
  },

  /* ======================= 5. TIG / GTAW ============================== */
  'gtaw-1': {
    practice: {
      task: 'Set up TIG and run a puddle with no filler at all',
      why: 'Trying to learn both hands at once is why people decide they are "no good at TIG". Separate them.',
      kit: ['TIG rig, argon', '2 mm mild steel or stainless scrap', 'Stainless wire brush and acetone'],
      steps: [
        'Set DCEN, argon at about 8 L/min, post-flow around 8 seconds.',
        'Clean the plate: stainless brush, then wipe with acetone.',
        'No filler rod in your hand at all for this drill.',
        'Bring the pedal on and establish a small bright puddle.',
        'Walk that puddle in a straight line across the plate, keeping it exactly the same size the whole way.',
        'Do ten passes. Look at the ripple spacing — even spacing means even travel speed.'
      ],
      pass: [
        'A straight line of consistently sized puddle across the plate',
        'Even ripple spacing with no wide or narrow patches',
        'No blackening at the end of the run (post-flow long enough)'
      ]
    },
    recall: [
      { q: 'What does the tungsten do?', a: 'It makes the arc and does not melt. Filler is fed separately by hand — that separation is what gives TIG its control.' },
      { q: 'How long should post-flow be?', a: 'About one second per 10 A. Blackened weld ends mean it is too short or you pulled the torch away early.' }
    ]
  },
  'gtaw-2': {
    practice: {
      task: 'Grind six tungstens properly, then contaminate one on purpose',
      why: 'You need to know exactly what a dipped tungsten does to the arc, so you never try to push on with one.',
      kit: ['Tungstens (1.6 and 2.4 mm)', 'A dedicated grinding wheel', 'Scrap'],
      steps: [
        'Grind six tungstens lengthwise — grind marks running down the tungsten, not around it.',
        'Leave a small flat on each tip rather than a needle point.',
        'Stand them in a jar next to the machine.',
        'Start a weld with a fresh one. Listen to the arc — crisp and focused.',
        'Now deliberately dip it into the puddle. Listen: fat, hissing, wandering.',
        'Stop, change tungsten, and feel the difference immediately.'
      ],
      pass: [
        'Six tungstens ground lengthwise with a small flat, ready to go',
        'You can hear the difference between clean and contaminated instantly',
        'You changed the tungsten rather than pushing on'
      ]
    },
    recall: [
      { q: 'Which tungsten for general use, and what size for 120 A?', a: 'Lanthanated (gold) or ceriated (grey). 2.4 mm covers roughly 80–160 A.' },
      { q: 'Which way do you grind, and why?', a: 'Lengthwise. Circular grind marks are rails the current follows, and they make the arc wander.' }
    ]
  },
  'gtaw-3': {
    practice: {
      task: 'Watch the cleaning action on aluminium',
      why: 'Seeing the oxide get blasted off is what makes AC make sense. It is also genuinely a great moment.',
      kit: ['AC-capable TIG', 'Aluminium scrap, 3 mm+', 'Stainless brush used ONLY on aluminium', 'Acetone'],
      steps: [
        'Brush the aluminium with the dedicated stainless brush, then wipe with acetone.',
        'Set AC, balance around 65–70% electrode negative, frequency about 120 Hz, roughly 130 A for 3 mm.',
        'Bring the arc on and hold it without moving.',
        'Watch for the bright etched band spreading either side of the arc — that is the oxide being stripped.',
        'Now try the same on DCEN and watch it refuse to form a proper puddle.',
        'Back on AC, run a short bead and note how much faster the part heats up than steel would.'
      ],
      pass: [
        'You saw and can describe the cleaning band',
        'You backed the pedal off as the part heat-soaked',
        'You can explain why aluminium needs AC in one sentence'
      ]
    },
    recall: [
      { q: 'Why does aluminium need AC?', a: 'Its oxide melts at ~2050°C but the metal at ~660°C. The electrode-positive half of AC blasts the oxide off so the metal can be welded.' },
      { q: 'Amps for aluminium versus steel?', a: 'More. Aluminium conducts heat about five times better, so it pulls heat out of your puddle — think 45–50 A per mm and up.' }
    ]
  },
  'gtaw-4': {
    practice: {
      task: 'Add the second hand: dab, move, dab',
      why: 'This is the rhythm. Once it clicks it never leaves, and until it does everything feels impossible.',
      kit: ['TIG rig', '2–3 mm mild steel', '1.6 mm filler rod'],
      steps: [
        'Establish a puddle exactly as in the earlier drill.',
        'Now dab the rod into the LEADING edge of the puddle, then withdraw it slightly — keeping the hot end inside the gas shield.',
        'Move forward a fraction. Dab again. Puddle, dab, move.',
        'Count out loud in a rhythm if it helps — most people find one that works.',
        'Run ten beads. Look for even, stacked ripples like coins overlapping.',
        'Fill the crater at the end of every single one by tapering the pedal down with a last dab.'
      ],
      pass: [
        'Even stacked-coin ripples along most of a bead',
        'No balled-up filler from touching the arc',
        'Every crater filled — no dished, cracked ends'
      ]
    },
    recall: [
      { q: 'Where does the filler go?', a: 'Into the leading edge of the established puddle — never into the arc, which just balls the rod and spits.' },
      { q: 'Why fill the crater?', a: 'A shrinking unfilled crater cracks. Crater cracks are a real defect, not a cosmetic one.' }
    ]
  },
  'gtaw-5': {
    practice: {
      task: 'Weld thin sheet without warping it',
      why: 'Heat management is the difference between a TIG welder and someone who owns a TIG. Thin sheet is the honest test.',
      kit: ['1.5–2 mm sheet', 'Clamps', 'A copper or heavy steel backing bar if you have one'],
      steps: [
        'Butt two pieces of thin sheet together and tack every 25 mm — lots of small tacks.',
        'Clamp them down to a heavy bar or bench.',
        'Set amps by the 40 A per mm rule and weld 25 mm.',
        'Stop. Let it cool. Skip along and weld another 25 mm somewhere else.',
        'Keep stitching and skipping around rather than running one continuous weld.',
        'When done, lay the panel on a flat surface and check for rock and gaps.'
      ],
      pass: [
        'No burn-through',
        'Panel sits flat, or close to it',
        'You eased the pedal off as the job heated rather than powering through'
      ]
    },
    recall: [
      { q: 'Rule of thumb for TIG amps on mild steel?', a: 'About 40 A per mm of thickness. Stainless 15–20% less; aluminium more.' },
      { q: 'Name three ways to fight distortion.', a: 'Many small tacks, backstepping, staggered/alternating sequence, clamping to something heavy, and simply not over-welding.' }
    ]
  },

  /* ======================= 6. WELD QUALITY ============================ */
  'quality-1': {
    practice: {
      task: 'Inspect your own work like an inspector would',
      why: 'The welder who can honestly critique their own bead improves three times as fast as the one who is just pleased it stuck.',
      kit: ['Your last few practice welds', 'Fillet gauge', 'A fingernail'],
      steps: [
        'Line your welds up under good light.',
        'Size: measure the legs at three points. Consistent?',
        'Uniformity: are the ripples even, or does the spacing wander?',
        'Toes: run a fingernail from plate onto weld. Does it ramp, or catch on a step?',
        'Starts and stops: are the craters filled and the restarts blended?',
        'Parent metal: any arc strikes outside the joint? Those are a rejection point.',
        'Write down the single worst thing about each weld.'
      ],
      pass: [
        'You found at least one genuine fault in your own best weld',
        'You measured rather than guessed the size',
        'You can state the one change that would improve the next one most'
      ]
    },
    recall: [
      { q: 'What should the toes of a weld feel like?', a: 'A ramp, not a step. A sharp notch where weld meets plate is a stress raiser and a defect.' },
      { q: 'Why are arc strikes outside the joint a problem?', a: 'They leave hard brittle spots on the parent metal and are a legitimate rejection point.' }
    ]
  },
  'quality-2': {
    practice: {
      task: 'Build your own defect reference board',
      why: 'A board of faults you made yourself beats any textbook photo, because you know exactly what caused each one.',
      kit: ['A length of scrap plate', 'Paint pen or engraver', 'Your machine'],
      steps: [
        'On one plate, deliberately produce: porosity (weld over paint or with the gas off), undercut (too hot and too fast), overlap (too cold and too slow), and heavy spatter (long arc or wrong settings).',
        'Label each one on the plate itself with a paint pen or engraver.',
        'Photograph each into the weld log with its cause written in the note.',
        'Hang the plate above the bench.'
      ],
      pass: [
        'Four faults produced deliberately and labelled',
        'You can name the exact setting or habit that caused each',
        'Board is somewhere you will actually see it'
      ]
    },
    recall: [
      { q: 'Can you weld over porosity to fill it?', a: 'No. It must be ground or gouged out and re-welded once the cause is fixed.' },
      { q: 'Undercut versus overlap — hot or cold?', a: 'Undercut is too hot/too fast. Overlap is too cold/too slow. Ask "hot or cold?" first with any defect.' }
    ]
  },
  'quality-3': {
    practice: {
      task: 'Cut your welds in half and look inside',
      why: 'You have been guessing at penetration this whole time. Twenty minutes with a grinder replaces all that guessing with knowledge.',
      kit: ['Several old practice welds', 'Angle grinder with a cutting disc', 'Flap disc', 'Safety gear'],
      steps: [
        'Pick three practice welds made at different settings.',
        'Cut each one straight through the weld, across the joint.',
        'Grind the cut face smooth with a flap disc.',
        'Optional but brilliant: swab the face with dilute acid or even vinegar to etch it — the weld, the heat-affected zone and the parent metal show up as distinct areas.',
        'Look at how deep the weld actually went. Was there a gap at the root?',
        'Photograph the cross-sections into the log next to the settings you used.'
      ],
      pass: [
        'You can see the actual penetration depth on all three',
        'You found at least one weld that penetrated less than you assumed',
        'You know which settings gave the best root fusion'
      ]
    },
    recall: [
      { q: 'Hot crack versus cold crack?', a: 'Hot cracks form while solidifying, often centreline or in the crater. Cold cracks appear hours or days later in the HAZ, needing hydrogen + hard structure + stress.' },
      { q: 'What size crack is acceptable?', a: 'None. No code accepts a crack at any size. It gets gouged out and re-welded.' }
    ]
  },
  'quality-4': {
    practice: {
      task: 'Make a frame distort, then make one that does not',
      why: 'You will remember the shape of a twisted frame far longer than any list of tips.',
      kit: ['Eight lengths of scrap angle or box section', 'Clamps', 'Square'],
      steps: [
        'Tack up two identical rectangular frames.',
        'Frame one: weld all the way around continuously, one direction, no clamps, full-size welds.',
        'Frame two: many small tacks, clamped to the bench, backstepped short runs, alternating sides, welds only as big as needed.',
        'Let both cool completely.',
        'Check both with a square, and sit them on a flat surface to see which rocks.',
        'Photograph them together.'
      ],
      pass: [
        'A visible difference between the two frames',
        'Frame two sits flat or close to it',
        'You can name the four things you did differently'
      ]
    },
    recall: [
      { q: 'What is backstepping?', a: 'Overall progress in one direction while each short segment is welded the opposite way, so shrinkage fights itself instead of accumulating.' },
      { q: 'What is the biggest self-inflicted cause of distortion?', a: 'Over-welding — putting in more weld and more heat than the joint required.' }
    ]
  }
};

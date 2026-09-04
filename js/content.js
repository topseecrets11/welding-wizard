/* ============================================================================
 * WELD ACADEMY — CURRICULUM
 * ----------------------------------------------------------------------------
 * All teaching content lives here. No logic, just data.
 *
 * Framing: Australian / metric. Electrode codes are AS/NZS 4855 (with the AWS
 * equivalents in brackets, because most of the videos she'll find are American).
 * Positions use the ISO/AS letter codes with AWS numbers alongside.
 *
 * Lesson shape:
 *   { id, title, blurb, body: [paragraphs], keyPoints: [...], tip: "..." }
 * Quiz shape:
 *   { q, choices: [...], correct: <index>, explain: "..." }
 * ==========================================================================*/

window.WA_CONTENT = {

  /* --------------------------------------------------------------------- */
  /* MODULES                                                                */
  /* --------------------------------------------------------------------- */
  modules: [

    /* === 1. SAFETY ==================================================== */
    {
      id: 'safety',
      title: 'Safety First',
      subtitle: 'Before you strike an arc',
      icon: '🛡️',
      colour: '#e05a3a',
      intro: "Every welder I'd trust with my life learned this part first. Not because someone made them — because they'd seen what happens when it gets skipped. Twenty minutes here buys you a whole career.",
      lessons: [
        {
          id: 'safety-1',
          title: 'What the Arc Actually Does to You',
          blurb: 'The four things that hurt welders, and why they sneak up',
          body: [
            "A welding arc is about 6,000°C at its core and throws out more ultraviolet light than the sun does at midday. Your body has no early-warning system for any of it. That's the whole problem — nothing hurts while the damage is being done.",
            "**Arc eye** (flash burn) is the classic. UV burns the surface of your cornea. You feel nothing at the time; six to twelve hours later it's like someone poured sand in your eyes and you're lying in a dark room at 2am. It heals, usually in a day or two, but it's agony and it's completely avoidable — one unguarded look at someone else's arc across the shed will do it.",
            "**Fume** is the quiet one. Welding fume isn't smoke, it's vaporised metal that condenses into particles fine enough to go straight to the deepest part of your lungs. In 2017 the IARC classified all welding fume as a Group 1 carcinogen — same category as asbestos. Nobody gets sick on day one, which is exactly why welders ignore it for thirty years.",
            "**Burns** come from three directions: the arc's UV (which sunburns any skin you leave out, even through a thin cotton shirt), spatter that finds the gap at your collar or the top of your boot, and hot metal that looks identical to cold metal. Assume everything you've touched with an arc is hot for a lot longer than you think.",
            "**Fire** is the one that takes out whole workshops. Spatter travels further than you'd credit — up to 10 metres — and it will happily sit smouldering in a rag or a floor crack for half an hour after you've packed up and gone inside."
          ],
          keyPoints: [
            'None of the four main hazards hurt at the moment they injure you — that\'s why discipline beats instinct here.',
            'Arc eye shows up hours later; the damage was done in seconds of unshielded looking.',
            'Welding fume is a Group 1 carcinogen. Ventilation is not optional, it\'s the job.',
            'Spatter can travel ~10 m and smoulder for 30+ minutes after you stop.'
          ],
          tip: "If you ever catch a flash — even a glimpse — say so and get it looked at. Every welder has done it. Nobody good will give you grief about it."
        },
        {
          id: 'safety-2',
          title: 'Dressing for the Fight',
          blurb: 'PPE that actually works, and picking your helmet shade',
          body: [
            "Start at your face. An auto-darkening helmet to **AS/NZS 1338.1** is the single best bit of kit you'll buy — it lets you see the joint before you strike, which is half of why beginners' starts are ugly. Wear safety glasses **underneath** it: the helmet goes up constantly, and that's when the grinding sparks and chipped slag find your eyes.",
            "Shade selection is about amperage more than process. Rough guide: under 100 A, shade 10. 100–200 A, shade 11–12. Above 200 A, shade 12–13. TIG at low amps often wants a *lighter* shade than you'd think so you can actually see the puddle — many welders run 10 at 50 A. If you're squinting to find the puddle, go lighter one step; if your eyes feel tired after a session, go darker one step.",
            "On your body: leather or flame-resistant cotton. **Never** synthetics — polyester and nylon melt into skin, and that turns a small burn into a skin graft. Long sleeves down, collar up, no cuffs turned up (they're a perfect spatter cup) and shirt tails in. Trousers go **over** the boots, never tucked in, or you've built a funnel straight to your foot.",
            "Gloves depend on the process. Stick and MIG want thick leather gauntlets. TIG wants thin, soft leather or kidskin — you need to feel the filler rod, and TIG throws almost no spatter. Boots: leather, closed, ideally elastic-sided so you can kick them off fast if something hot goes down them.",
            "Ears matter more than people admit — not for the arc, but for grinding, which is the loudest thing in most workshops, and because spatter can genuinely land in an ear canal. Earplugs, or the wrap-around style if you're overhead."
          ],
          keyPoints: [
            'Helmet to AS/NZS 1338.1, plus safety glasses underneath at all times.',
            'Shade by amperage: <100 A → 10, 100–200 A → 11–12, >200 A → 12–13.',
            'Leather or FR cotton only. Synthetics melt into skin.',
            'Trousers OVER boots, cuffs down, collar up, shirt tucked in.',
            'Thin gloves for TIG (feel), thick gauntlets for stick and MIG (heat).'
          ],
          tip: "Buy the helmet before the welder if you have to. A cheap machine with a good helmet makes better welds than the reverse — because you can see what you're doing."
        },
        {
          id: 'safety-3',
          title: 'Clearing the Danger Zone',
          blurb: 'Fire, fume, galv, and the space you weld in',
          body: [
            "Before the helmet goes down, the area gets cleared. **10 metres** is the number to hold in your head for flammables — that's the Australian hot-work convention (AS 1674.1) and it exists because spatter goes further than anyone believes until they've watched it. Fuel, thinners, rags, cardboard, sawdust, long grass, the dust in the corner: move it, or move yourself.",
            "Have an extinguisher within arm's reach — not across the shed. If you're welding anywhere near something that could smoulder, do a **fire watch**: come back and check the area 30 to 60 minutes after you finish. Most workshop fires start well after the welder has gone home.",
            "Ventilation: get the fume away from your face, not just out of the room eventually. The single most effective free habit is to keep your head out of the plume — position yourself so it rises past you, not through you. Better, use an extraction arm or a fan pulling across the bench (not blowing at the weld, that wrecks gas shielding — pull, don't push). In a shed with the door shut, add a respirator to **AS/NZS 1716**.",
            "**Galvanised steel deserves its own warning.** The zinc coating vaporises and gives you metal fume fever — 'zinc chills'. Fever, aching, shivering, feels exactly like a bad flu that night, usually gone in 24–48 hours. Grind the coating back 25–50 mm either side of the joint before you weld, and ventilate hard. It's unpleasant but usually not permanent; treat it as a warning shot, not a rite of passage.",
            "**Confined spaces** — tanks, hulls, pits, anything you climb into — are a different discipline entirely and are permit-controlled work in Australia. Shielding gas (argon, CO₂) is heavier than air, displaces oxygen silently, and has killed experienced people. Don't go in one until you've been trained specifically for it."
          ],
          keyPoints: [
            'Clear flammables to 10 m; extinguisher within reach.',
            'Fire watch the area 30–60 min after you finish.',
            'Keep your head out of the plume. Pull air across the bench, never blow at the weld.',
            'Grind galvanising back 25–50 mm each side — zinc fume causes metal fume fever.',
            'Confined spaces are permit work. Shielding gas silently displaces oxygen.'
          ],
          tip: "Empty drums and tanks are the classic killer — a 'clean' fuel drum still holds vapour and will detonate. Never weld a sealed or previously-full container. Ever."
        },
        {
          id: 'safety-4',
          title: "Don't Become the Circuit",
          blurb: 'Electrical safety, and where the work clamp really goes',
          body: [
            "A welder's open-circuit voltage sits around 50–80 V. That's not much on a dry hand — it's plenty through sweat, damp leather, or a wet concrete floor. Welders get hurt by electricity in conditions, not by voltage alone: hot day, soaked gloves, kneeling on damp ground, leaning across the work.",
            "Rules that keep you out of the circuit: keep gloves and clothing **dry** (a spare pair of gloves on a hot day is a safety item, not a luxury). Never weld standing in water or on a wet floor. Don't drape the electrode lead over your shoulder or across your body. Change electrodes with gloves on, and don't rest a live stinger on the bench or against your leg — set it on an insulated hook.",
            "Inspect leads every session: cracked insulation, exposed copper, a loose lug at the machine. Australian workshops should also have the machine on an **RCD** — that protects you from the mains side, though not from the welding circuit itself.",
            "The **work clamp** (people call it the earth clamp — it isn't an earth) is where beginners lose easy points. It goes onto clean, bare metal, as close to the weld as practical. Paint, rust, mill scale and a rusty bench top all add resistance, which gives you a wandering arc, poor starts and a hot clamp. If your clamp is warm at the end of a run, it's a bad connection.",
            "One more: never let the welding current path run through anything precious — through bearings, through a vehicle's electronics, through a lathe's ways. Current takes every path back to that clamp, and it will pit a bearing race or fry an ECU on the way. Clamp directly to the piece you're welding."
          ],
          keyPoints: [
            'Danger comes from wet conditions, not just voltage. Dry gloves, dry ground.',
            'Never drape the electrode lead over your body; hang the live stinger on an insulated hook.',
            'Work clamp goes on clean bare metal, as close to the weld as practical.',
            'A warm clamp means a bad connection — fix it before you chase arc problems.',
            'Never let current path through bearings, electronics or machine ways.'
          ],
          tip: "Ninety percent of 'this machine is playing up' turns out to be the work clamp. Check it first, every single time, before you touch a dial."
        }
      ],
      quiz: [
        {
          q: "You get a quick unshielded look at someone else's arc across the shed. When would you expect to feel it?",
          choices: ['Immediately', 'Within a minute or two', 'Six to twelve hours later', 'You wouldn\'t — a quick look is harmless'],
          correct: 2,
          explain: "Arc eye is a delayed UV burn to the cornea. Nothing hurts at the time, which is precisely why people take the risk — the pain typically arrives 6–12 hours later, often in the middle of the night."
        },
        {
          q: "You're running stick at about 150 A. What helmet shade is in the right ballpark?",
          choices: ['Shade 8', 'Shade 11–12', 'Shade 14', 'Shade doesn\'t matter with auto-darkening'],
          correct: 1,
          explain: "Shade is chosen by amperage: under 100 A → around 10, 100–200 A → 11–12, above 200 A → 12–13. Auto-darkening helmets still need the correct shade dialled in — 'auto' only means it switches fast, not that it picks the right darkness for you."
        },
        {
          q: "Why must you grind galvanising back before welding it?",
          choices: [
            'The zinc weakens the weld metal permanently',
            'Zinc fume causes metal fume fever — the shivers and aching known as zinc chills',
            'Galvanised steel cannot be welded at all',
            'It stops the work clamp making contact'
          ],
          correct: 1,
          explain: "Vaporised zinc causes metal fume fever: flu-like fever, aching and shivers that night, usually clearing in 24–48 hours. Grind the coating back 25–50 mm each side and ventilate hard. (The porosity it causes in the weld is a real second problem, but the health hazard is the reason it's a safety rule.)"
        },
        {
          q: "Where should the work clamp go?",
          choices: [
            'Anywhere on the steel bench — it all conducts',
            'On the painted frame, as far from the arc as possible to avoid interference',
            'On clean bare metal, as close to the weld as practical',
            'On the machine itself'
          ],
          correct: 2,
          explain: "Clean bare metal, close to the weld. Paint, rust and scale add resistance, which gives poor starts, a wandering arc and a clamp that runs warm. Clamping to the bench instead of the workpiece also lets current wander through anything else sitting on it."
        },
        {
          q: "You finish a job near a timber wall. What does a fire watch mean?",
          choices: [
            'Watching the weld cool until it stops glowing',
            'Having someone hold the extinguisher while you weld',
            'Returning to check the area 30–60 minutes after you finish',
            'Checking the area before you start'
          ],
          correct: 2,
          explain: "Most hot-work fires start well after the welding stops, from spatter smouldering in dust, rags or timber. A fire watch means physically going back and checking the area 30–60 minutes later."
        }
      ]
    },

    /* === 2. READING THE PRINT ========================================= */
    {
      id: 'print',
      title: 'Reading the Print',
      subtitle: 'Joints, positions and symbols',
      icon: '📐',
      colour: '#3a86c8',
      intro: "This is the module that separates someone who can weld from someone you can hand a drawing to. It's an afternoon's reading that changes what jobs you're allowed to touch.",
      lessons: [
        {
          id: 'print-1',
          title: 'The Five Joints',
          blurb: 'Every weld you will ever make is one of these',
          body: [
            "Every joint in the trade is one of five shapes, and naming them right is how you talk to other welders and read a drawing.",
            "**Butt joint** — two pieces edge to edge, in the same plane. This is the strength joint: done properly with full penetration it's as strong as the parent metal. It's also the least forgiving, because you have to get heat all the way through without falling through.",
            "**Lap joint** — two pieces overlapping, welded along the exposed edge. Very forgiving of fit-up, which is why it's everywhere in sheet metal and light fabrication. Its weakness is that the load path bends around the offset.",
            "**T-joint** — one piece standing on another at 90°. Bread and butter of structural work: railings, frames, brackets, bases. Almost always welded as a fillet, usually both sides.",
            "**Corner joint** — two pieces meeting at an edge, forming an L. Box sections, frames, tanks. Comes in 'open corner' (edges apart, filled with weld) and 'closed corner' (one overlapping the other).",
            "**Edge joint** — two parallel surfaces welded along the edge where they meet. Low strength, mostly for sealing or joining sheet where there's no load. It's the one you'll use least.",
            "Names aside, what actually matters is: how much metal is there to melt, and can I get the heat into all of it? A butt joint on 10 mm plate needs edge preparation — a bevel — because a square edge that thick simply cannot be melted right through from one side."
          ],
          keyPoints: [
            'Butt, lap, T, corner, edge — that\'s the whole vocabulary.',
            'Butt joints are the strength joints and the least forgiving.',
            'T-joints in fillet form are the bulk of everyday fabrication work.',
            'Thick butt joints need a bevel — you can\'t melt through a square 10 mm edge.'
          ],
          tip: "When you can, design the job so it uses a T or lap joint rather than a butt. Same strength for the load, far more forgiving to weld."
        },
        {
          id: 'print-2',
          title: 'Positions Decoded',
          blurb: 'PA to PF, and the American numbers you\'ll hear online',
          body: [
            "Position means the orientation of the joint relative to gravity — and gravity is the second welder in every job. Molten steel sags. Everything about technique changes with position, which is why tickets are issued per position.",
            "Australian drawings and AS/NZS work use the **ISO letter codes**: **PA** flat (downhand), **PB** horizontal-vertical (the standard fillet, welding into a corner with the plates at 45° to you), **PC** horizontal butt (the joint runs sideways, on a vertical wall), **PD** overhead fillet, **PE** overhead butt, **PF** vertical **up**, **PG** vertical **down**.",
            "American videos use numbers, and it's worth knowing both: **1G/1F** flat, **2G/2F** horizontal, **3G/3F** vertical, **4G/4F** overhead. G is groove (butt), F is fillet. For pipe you'll also meet **5G** (pipe horizontal, fixed, you weld around it) and **6G** (pipe at 45°, fixed) — 6G is the traditional 'if you can weld this you can weld anything' test.",
            "PF versus PG matters more than the single letter suggests. **Vertical up (PF)** is slower, hotter into the joint, and gives good penetration — it's what structural codes normally demand. **Vertical down (PG)** is fast and tidy on thin sheet, but on anything thick it tends to run the molten metal ahead of the arc and leave lack of fusion underneath. Pretty on top, weak underneath. Unless a procedure specifically calls for downhill, weld vertical up.",
            "Learn in this order: flat, then horizontal fillet, then vertical up, then overhead. Each one adds one new problem to solve, and jumping straight to overhead just teaches you to duck."
          ],
          keyPoints: [
            'ISO letters (PA/PB/PC/PD/PE/PF/PG) on Australian drawings; AWS numbers (1G–4G, 1F–4F) in US content.',
            'G = groove/butt, F = fillet. 5G and 6G are fixed-pipe tests.',
            'Vertical UP (PF) = penetration, what codes usually want.',
            'Vertical DOWN (PG) = fast on thin sheet, hides lack of fusion on thick.',
            'Learn flat → horizontal → vertical up → overhead, in that order.'
          ],
          tip: "Overhead isn't about strength or bravery — it's about a short arc and low-ish amps so the puddle freezes before it can fall. If it's dripping, you're too hot, not too weak."
        },
        {
          id: 'print-3',
          title: 'Fillet vs Groove — and Sizing',
          blurb: 'Leg length, throat, and why bigger is not better',
          body: [
            "Two families of weld. A **fillet weld** fills the corner between two surfaces — triangular in section, no edge preparation needed. A **groove (butt) weld** fills a prepared gap between edges in the same plane, and with the right prep it fuses the full thickness.",
            "A fillet is measured by its **leg length** — how far it runs up each plate. The **design throat** is the shortest distance from the root to the face, and for an equal-leg fillet that works out to roughly leg × 0.7. The throat is what carries the load; the leg is just what's easy to measure with a gauge.",
            "The everyday rule of thumb: a fillet leg roughly equal to the thickness of the thinner plate is a strong joint. On 6 mm plate, a 6 mm fillet. AS/NZS 1554 and the drawing have the final say — if a drawing calls a 5 mm fillet, weld a 5 mm fillet.",
            "Here's the part beginners get wrong: **bigger is not better**. Doubling the leg length roughly doubles the weld metal, the heat put in, the distortion and the time — for strength the joint didn't ask for. Over-welding is one of the most common and most expensive faults in fabrication, and inspectors do pull people up on it. Weld it to size, then stop.",
            "For groove welds, thickness drives preparation. Up to about 3 mm you can often weld a square edge from one side. Beyond about 5–6 mm you bevel the edges (a single V is the common one) and often leave a small root gap of 1.5–3 mm so the arc can reach the bottom. Thick sections get a double V from both sides to balance distortion."
          ],
          keyPoints: [
            'Fillet = corner fill, no prep. Groove = prepared edges in the same plane.',
            'Fillet throat ≈ leg × 0.7. The throat carries the load.',
            'Rule of thumb: leg ≈ thickness of the thinner plate — but the drawing wins.',
            'Over-welding wastes time, adds heat and distortion, and gets pulled up. Weld to size.',
            'Above ~5–6 mm, bevel the edges and leave a 1.5–3 mm root gap.'
          ],
          tip: "Get a fillet weld gauge. Twelve dollars, fits in your pocket, and it turns 'looks about right' into an actual number you can defend."
        },
        {
          id: 'print-4',
          title: 'Cracking the Welding Symbol',
          blurb: 'The little flag on the drawing, decoded once and for all',
          body: [
            "A welding symbol is a horizontal **reference line** with an **arrow** pointing at the joint. Everything hangs off that line, and one rule unlocks the whole thing: **below the line = arrow side** (the side the arrow points to), **above the line = other side**. Symbols on both sides mean weld both sides.",
            "The **shape** on the line tells you the weld type. A right-angle triangle is a fillet. A V is a V-groove butt. A square (two vertical strokes) is a square-groove butt. A U or J shape is that groove prep. You'll meet fillet and V by far the most.",
            "**Numbers to the left** of the symbol are the size — for a fillet, the leg length in mm. So a triangle below the line with a 6 to its left means: 6 mm fillet, arrow side.",
            "**Numbers to the right** are length and pitch for intermittent welds, written as length–pitch. `50–150` means 50 mm of weld, then centres every 150 mm — so 50 on, 100 off, repeating. Intermittent welds exist to control heat and distortion, and to save weld metal where continuous strength isn't needed.",
            "Then the extras hanging off the elbow where the arrow meets the line: a **circle** means weld all around; a **flag** means field weld (done on site, not in the shop). A **tail** on the far end of the line carries notes — a process code, a procedure number, an electrode type.",
            "Read one in order, every time: which side → what type → how big → how long and how often → any all-round or site notes. Do that five times on real drawings and you'll never have to think about it again."
          ],
          keyPoints: [
            'Below the line = arrow side. Above the line = other side. Both = weld both sides.',
            'Triangle = fillet, V = V-groove butt, square strokes = square butt.',
            'Number LEFT of symbol = size (fillet leg in mm).',
            'Numbers RIGHT = length–pitch for intermittent welds (50–150 = 50 mm weld, 150 mm centres).',
            'Circle at the elbow = weld all around. Flag = field weld. Tail = notes/process.'
          ],
          tip: "If a drawing symbol genuinely doesn't make sense, ask. Every fabricator alive has welded something to the wrong side of a plate once, and it's always cheaper to ask than to grind it off."
        }
      ],
      quiz: [
        {
          q: "On a welding symbol, what does a fillet triangle drawn BELOW the reference line mean?",
          choices: [
            'Weld the other side, away from the arrow',
            'Weld the arrow side',
            'Weld both sides',
            'The weld is optional'
          ],
          correct: 1,
          explain: "Below the line = arrow side; above the line = other side. Symbols on both sides of the line mean weld both sides. This single convention unlocks most of weld symbol reading."
        },
        {
          q: "A drawing shows a fillet symbol with `8` on the left and `50–150` on the right. What are you welding?",
          choices: [
            '8 mm fillet, continuous, 50 mm from each end',
            '8 mm fillet, 50 mm long runs on 150 mm centres',
            '50 mm fillet, 8 runs, 150 mm apart',
            '8 mm fillet, 150 mm long runs with 50 mm gaps'
          ],
          correct: 1,
          explain: "Left of the symbol is size (8 mm leg). Right is length–pitch: 50 mm of weld, repeating every 150 mm of centre-to-centre spacing — so 50 mm on, 100 mm off."
        },
        {
          q: "Why do structural codes normally want vertical welds run UP (PF) rather than down (PG)?",
          choices: [
            'Vertical up is faster and cheaper',
            'Vertical down cannot be done with stick electrodes',
            'Vertical up gets heat into the joint and penetrates; vertical down can run metal ahead of the arc and leave lack of fusion',
            'Vertical up produces less spatter'
          ],
          correct: 2,
          explain: "Vertical down is fast and looks tidy on thin sheet, but on thicker material the molten metal runs ahead of the arc so the arc never melts the base metal properly — a neat-looking bead with lack of fusion underneath. Vertical up is slower and hotter into the joint, which is what codes want."
        },
        {
          q: "You're welding a T-joint in 6 mm plate with no specific drawing callout. What fillet leg length is the sensible default?",
          choices: ['About 3 mm', 'About 6 mm', 'About 12 mm — bigger is stronger', 'As large as the puddle allows'],
          correct: 1,
          explain: "Rule of thumb: fillet leg roughly equal to the thickness of the thinner plate, so about 6 mm. Over-welding doesn't buy strength the joint asked for — it buys heat input, distortion, wasted consumables and time, and inspectors do pull it up."
        },
        {
          q: "What's the design throat of an equal-leg 10 mm fillet weld, roughly?",
          choices: ['10 mm', '7 mm', '5 mm', '14 mm'],
          correct: 1,
          explain: "For an equal-leg fillet the throat is approximately leg × 0.7, so about 7 mm. The throat is the shortest path from root to face and it's what actually carries the load — the leg is just the dimension that's easy to measure."
        }
      ]
    },

    /* === 3. STICK / SMAW ============================================== */
    {
      id: 'smaw',
      title: 'Stick Welding',
      subtitle: 'SMAW — old school, still gold',
      icon: '⚡',
      colour: '#d99a2b',
      intro: "Stick is where I'd start anyone. It teaches you to read a puddle with nothing hiding behind it — no gas, no trigger, no wire feed doing half the work. Learn stick and every other process feels easy.",
      lessons: [
        {
          id: 'smaw-1',
          title: 'The Setup',
          blurb: 'Machine, stinger, clamp — and which way the current flows',
          body: [
            "A stick rig is refreshingly simple: a power source, an electrode lead ending in a stinger (electrode holder), and a work lead ending in a clamp. That's it. No gas bottle, no feeder, nothing to blow away in the wind — which is exactly why stick still rules outdoor, site and repair work.",
            "The electrode itself does two jobs at once. The metal core melts and becomes the filler. The **flux coating** burns and does everything a gas bottle would: it makes a shielding gas cloud, it cleans the puddle chemically, and it leaves a layer of **slag** over the hot weld that slows cooling and protects it while it solidifies. Slag is a feature, not a mess — but it has to be chipped off before the next pass, or you weld the rubbish in.",
            "**Polarity** is the setting that confuses everyone once and then never again. **DCEP** (DC electrode positive, also called reverse polarity) puts more heat into the electrode side and gives deeper penetration — this is what most electrodes, including E4818 low-hydrogen, want. **DCEN** (electrode negative, straight polarity) puts more heat into the work and gives a shallower, faster melt-off. Some electrodes run on AC, which older transformer machines produce.",
            "The rule: **read the electrode box.** It states the polarity. Running the wrong one gives you a rough, spitting arc, poor penetration, and a rod that wants to stick — and beginners naturally blame themselves rather than the dial.",
            "Modern inverter machines usually add two helpers worth knowing: **hot start** (a brief current surge to get the arc going) and **arc force** / dig (extra current if the arc gets short so the rod doesn't stick). If your machine has them, they're not cheating — they're what makes learning less miserable."
          ],
          keyPoints: [
            'Electrode = filler metal + flux coating that makes its own shielding gas and slag.',
            'Slag protects the cooling weld — chip it off completely before the next pass.',
            'DCEP (electrode positive) = deeper penetration, what most rods including E4818 want.',
            'Always check the electrode box for polarity. Wrong polarity feels like bad technique.',
            'Hot start and arc force on inverter machines genuinely help beginners.'
          ],
          tip: "No gas bottle means wind doesn't beat you. That's why stick is still the process on a windy hillside or a boat deck when MIG would be useless."
        },
        {
          id: 'smaw-2',
          title: 'Reading the Rod',
          blurb: 'E4112, E4313, E4818 — and what those digits promise',
          body: [
            "Australian electrodes are classified to **AS/NZS 4855**. The code looks like `E4818`, and it reads left to right: **E** = electrode. The **first two digits** are minimum tensile strength in units of 10 MPa — so 48 means 480 MPa. The **third digit** is the positions it can be welded in. The **fourth digit** is the coating type and the current it wants.",
            "You mostly need three rods. **E4313** (AWS E6013) is the general-purpose rutile rod — easy striking, easy restarting, tidy bead, slag that almost falls off. Shallow penetration, so it's ideal for thin material, light fabrication and learning. This is the rod to make your first hundred beads with.",
            "**E4112** (AWS E6011 family) is the cellulosic 'deep dig' rod. It burns aggressively through rust, paint and dirt, penetrates hard, and runs happily on AC. Farm repairs, dirty steel, anything you can't clean properly. The arc is loud and the bead rougher — that's the trade.",
            "**E4818** (AWS E7018) is the low-hydrogen structural rod. Strongest, smoothest running, beautiful ductile welds — this is what structural and pressure work is made with. It has one demand: it **hates moisture**. Damp E4818 puts hydrogen into the weld, and hydrogen causes cracking that can appear days later.",
            "So low-hydrogen rods live in a sealed container or a heated rod oven — not on the shelf, not in the ute, not in a shed over a wet winter. If a packet has been open and exposed, it needs re-drying to the manufacturer's schedule (typically a few hours around 250–300°C) or it goes in the bin. This isn't fussiness; delayed hydrogen cracking is a genuine structural failure mode.",
            "You'll see the AWS numbers everywhere online. The translation is simple: 60 ksi ≈ 410 MPa, 70 ksi ≈ 480 MPa. So E6013 ↔ E4313, E7018 ↔ E4818."
          ],
          keyPoints: [
            'AS/NZS 4855: E + tensile (×10 MPa) + position digit + coating/current digit.',
            'E4313 (E6013): easy, tidy, shallow — the learning rod.',
            'E4112 (E6011): deep dig, burns through rust and paint, runs on AC.',
            'E4818 (E7018): low-hydrogen structural rod, strongest and smoothest.',
            'Keep E4818 dry — sealed tin or rod oven. Damp low-hy rods cause delayed hydrogen cracking.'
          ],
          tip: "Practise on E4313 until your beads are even, then switch to E4818 and enjoy it — low-hy rods run like butter. Just never let them get damp."
        },
        {
          id: 'smaw-3',
          title: 'Striking and Running',
          blurb: 'Arc length, angle, travel speed — the three dials in your hands',
          body: [
            "Two ways to start. **Scratch start**: drag the rod like a match, and the moment it lights, pull back to arc length. **Tap start**: touch straight down and lift immediately. Scratch is easier when you're learning; tap keeps you on the exact spot you want, which matters when the drawing says start here.",
            "If the rod welds itself to the plate — everyone does this on day one — give the stinger a sharp twist sideways and it'll snap free. If it won't, release it from the stinger before it glows red hot.",
            "Then hold three things steady, and they are the whole craft:",
            "**Arc length.** Keep it about equal to the diameter of the electrode core — so around 3.2 mm gap for a 3.2 mm rod. Too long and the arc wanders, spatters, and loses its shielding (that's your porosity). Too short and it stutters and sticks. Because the rod is burning away, you must feed it in continuously — that's the coordination stick teaches and no other process does.",
            "**Angle.** Tilt the rod about 5–15° in the direction of travel — the **drag** technique for most rods (E4313 and E4818 are dragged; slag needs to be trailing behind the arc, not run over). Working into a fillet, split the angle between the two plates, roughly 45°.",
            "**Travel speed.** Watch the puddle, not the arc. You want the leading edge of the puddle just melting into fresh metal, and behind you a bead about 2–3 times the rod diameter in width. Too slow and you build a fat, cold, piled-up bead. Too fast and you get a narrow ropey bead with undercut at the edges.",
            "Weaving comes later. For flat work, a straight stringer bead is more than enough — and honestly, on structural work stringers are often what's specified anyway because they put less heat in."
          ],
          keyPoints: [
            'Arc length ≈ electrode diameter. Long arc = spatter and porosity; short = sticking.',
            'The rod burns down — you must feed it in continuously as you travel.',
            'Drag angle 5–15° for E4313/E4818; ~45° split angle into a fillet corner.',
            'Watch the puddle, not the arc. Aim for a bead 2–3× the rod diameter wide.',
            'Master straight stringers before weaving. Stringers are often what codes want anyway.'
          ],
          tip: "Everyone's first fifty beads look terrible. That's not talent showing — it's a coordination skill, exactly like a clutch. Do a hundred short runs on scrap plate before you judge yourself."
        },
        {
          id: 'smaw-4',
          title: 'Changing Position',
          blurb: 'Flat, horizontal and the vertical-up whip',
          body: [
            "**Flat (PA)** is where you build the basics: steady arc length, consistent travel, straight line. Practise running beads across a plate with 3.2 mm E4313 around 90–120 A until they're even, then run them side by side, overlapping each by about a third — that overlapping pass technique is called padding, and it's the classic drill for a reason.",
            "**Horizontal fillet (PB)** is the most common weld in fabrication. The trick is that gravity pulls the puddle down onto the bottom plate, so bias the arc slightly toward the **vertical** plate to keep the leg lengths even. If your fillet has a big leg on the bottom and a small one up the wall — with maybe some undercut where the top edge should be — you were pointing too low, or too hot, or too slow.",
            "**Vertical up (PF)** needs a different current and a different rhythm. Drop the amps around 10–15% from your flat setting: gravity is now helping the puddle sag, and heat is your enemy. Then use the **whip and pause**: move the rod up out of the puddle a short distance, which lets the leading metal cool and freeze, then come back down into the puddle and pause long enough to fill. Up, back, pause. It sounds fiddly and it feels like nothing for about an hour, then it clicks and you can build a beautiful stacked-dime bead going uphill.",
            "**Overhead (PD/PE)** is mostly nerve plus a very short arc. Amps similar to vertical, arc as tight as you can hold it, small stringers, no weaving. A tight arc keeps the puddle small and small puddles freeze before they can fall. Position yourself so nothing lands on you: never directly under the weld, sleeves down, collar up, and a cap under the helmet.",
            "Don't chase all four in one weekend. Get flat genuinely consistent first — it's the foundation every other position is built from."
          ],
          keyPoints: [
            'Flat: build consistency with padding beads, overlapping each pass by ~1/3.',
            'Horizontal fillet: aim slightly at the vertical plate or the legs come out uneven.',
            'Vertical up: drop amps 10–15%, then whip-and-pause — up, back, pause to fill.',
            'Overhead: short arc, small stringers, no weaving. Small puddles don\'t fall.',
            'Never stand directly under an overhead weld.'
          ],
          tip: "In vertical up, if the puddle starts to sag and run, you're too hot or pausing too long. Turn it down before you change your technique — beginners almost always run vertical too hot."
        },
        {
          id: 'smaw-5',
          title: 'When Stick Misbehaves',
          blurb: 'Sticking rods, arc blow, and the spatter storm',
          body: [
            "**The rod keeps sticking.** Nearly always one of three things: amps too low for that rod diameter, arc too short as you fail to feed the rod in, or a hesitant start. Turn the amps up 10 A and start again — beginners consistently run too cold because too-hot *feels* alarming.",
            "**Massive spatter and a hissing, wandering arc.** Usually too long an arc, or too many amps, or wrong polarity. Check polarity against the box first — it costs ten seconds and it's the fault most often misdiagnosed as bad technique.",
            "**Arc blow** — the arc visibly bends away from where you're pointing it, usually near the end of a plate or in a corner. It's magnetism: the DC welding current sets up a magnetic field, and at the end of a run there's nothing ahead to balance it. Cures, in order: move the work clamp to the other end, weld toward the clamp, use shorter arc length, tack both ends first, or swap to AC if the machine offers it (AC largely doesn't suffer arc blow).",
            "**Porosity — little holes through the bead.** Damp electrodes, a rusty or painted joint, or too long an arc breaking the flux shielding. Dry rods, clean steel, tighter arc.",
            "**Slag trapped in the weld.** Either the slag ran ahead of the arc (arc angle wrong, or travel too slow — remember slag must trail behind), or the previous pass wasn't chipped and wire-brushed clean. Between every pass: chip, brush, look.",
            "**The bead looks piled on and hasn't fused at the edges.** Too cold, or travelling too slowly so the puddle grows and rolls over cold base metal. More amps, faster travel, and watch the leading edge of the puddle actually melting fresh metal."
          ],
          keyPoints: [
            'Rod sticking → usually too few amps or arc too short. Beginners run too cold.',
            'Wandering, hissing, spattering arc → check polarity against the box first.',
            'Arc blow at plate ends → move the clamp, weld toward it, or switch to AC.',
            'Slag must trail BEHIND the arc — if it runs ahead, fix your angle or speed.',
            'Chip and wire-brush every pass before the next one, always.'
          ],
          tip: "Keep a scrap of the same plate on the bench as a test coupon. Two seconds of test bead before the real weld saves grinding a bad one out of a finished job."
        }
      ],
      quiz: [
        {
          q: "You're running 3.2 mm E4818. Roughly how long should you hold the arc?",
          choices: [
            'As long as possible for visibility — 10 mm or so',
            'About 3 mm — roughly the electrode diameter',
            'Touching the plate the whole time',
            'It makes no difference on low-hydrogen rods'
          ],
          correct: 1,
          explain: "Arc length should be about the diameter of the electrode core — so ~3.2 mm for a 3.2 mm rod. Too long and you lose flux shielding (porosity, spatter, wandering arc); too short and it stutters and sticks."
        },
        {
          q: "Why must E4818 (E7018) electrodes be kept dry in a sealed tin or rod oven?",
          choices: [
            'Moisture makes the flux fall off the rod',
            'Damp rods introduce hydrogen, which causes delayed cracking',
            'Wet rods can\'t conduct enough current',
            'It only affects appearance, not strength'
          ],
          correct: 1,
          explain: "Low-hydrogen rods absorb moisture readily, and that moisture puts hydrogen into the weld metal. Hydrogen causes cold cracking that can appear hours or days after welding — a real structural failure mode. Damp rods get re-dried to the maker's schedule or binned."
        },
        {
          q: "Moving from flat to vertical up, what should you do with the amperage?",
          choices: [
            'Increase it 10–15% to fight gravity',
            'Decrease it 10–15%',
            'Leave it exactly the same',
            'Double it and travel faster'
          ],
          correct: 1,
          explain: "Drop about 10–15%. Going uphill, gravity is already pulling the puddle down, so extra heat just makes it sag and run. Beginners almost always run vertical too hot."
        },
        {
          q: "Near the end of a plate the arc starts bending sideways away from where you're aiming. What is it, and what's the first fix?",
          choices: [
            'A faulty electrode — change rods',
            'Arc blow from magnetic fields — move the work clamp and weld toward it',
            'Too much shielding gas — turn the flow down',
            'A cracked helmet lens distorting your view'
          ],
          correct: 1,
          explain: "That's arc blow: the DC welding current's magnetic field is unbalanced at the end of a plate and deflects the arc. Move the work clamp, weld toward it, shorten the arc, tack both ends, or switch to AC — AC largely doesn't suffer from it."
        },
        {
          q: "What is the slag layer actually for?",
          choices: [
            'Nothing useful — it\'s just waste from the flux',
            'It shields and slows the cooling of the weld while it solidifies',
            'It adds strength permanently and should be left on',
            'It shows the inspector how hot you welded'
          ],
          correct: 1,
          explain: "The flux produces both a shielding gas and a slag blanket that protects the weld and slows cooling while it solidifies. It does a real job — but it must be chipped and brushed off completely before the next pass, or you weld the slag into the joint."
        }
      ]
    },

    /* === 4. MIG / GMAW ================================================ */
    {
      id: 'gmaw',
      title: 'MIG Welding',
      subtitle: 'GMAW — fast, clean, forgiving',
      icon: '🔥',
      colour: '#4aa96c',
      intro: "MIG is the process that'll get you productive fastest, and the one most home workshops end up on. Pull the trigger and it welds. That ease is also its trap — a MIG weld can look perfect and be stuck on with nothing underneath.",
      lessons: [
        {
          id: 'gmaw-1',
          title: 'Anatomy of the Gun',
          blurb: 'Feeder, liner, tip, nozzle — the four things that cause 90% of grief',
          body: [
            "MIG (GMAW, or MAG when the gas is active) feeds a continuous solid wire through a gun while shielding gas flows out around it. The wire is filler *and* electrode, so the machine controls burn-off rate for you. That's why it's fast and easy — and why the wire path is the thing that ruins your day when it's neglected.",
            "**Drive rolls** in the feeder grip the wire and push it. They need the right groove size for the wire diameter (0.8 mm rolls for 0.8 mm wire) and the right tension: just enough that the wire doesn't slip. Too tight and it flattens or shaves the wire; too loose and the arc stutters as feed hesitates.",
            "The **liner** is the sleeve the wire travels through to the gun. It fills with fine metal dust and swarf over time, and a tired liner makes the feed erratic — which you'll experience as an arc that surges and dies for no visible reason. Blow it out with compressed air periodically and replace it when it stops helping.",
            "The **contact tip** transfers current to the wire in the last few centimetres. It's a consumable — it wears oval, spatter blocks it, and a worn tip gives a wandering, unstable arc. They cost a couple of dollars. Change them freely; running a worn tip to save money is false economy.",
            "The **nozzle** (shroud) directs the gas. Spatter builds up inside it, breaks the smooth gas flow, and gives you porosity that looks like a gas problem — because it is one. Clean it out regularly and use anti-spatter spray or nozzle gel.",
            "Polarity for solid wire with gas is **DCEP** — electrode positive. Note this is the opposite of gasless flux-cored wire, which runs DCEN. If you switch a machine between solid MIG wire and gasless wire, you must swap the polarity leads inside the machine, and this catches out a huge number of people who then blame the wire."
          ],
          keyPoints: [
            'Drive roll groove must match wire size; tension just tight enough not to slip.',
            'A dirty liner = surging, stuttering arc that feels like a machine fault.',
            'Contact tips are cheap consumables — replace them often.',
            'Spatter in the nozzle wrecks gas coverage and causes porosity.',
            'Solid wire + gas = DCEP. Gasless flux-cored = DCEN. Swapping wire type means swapping polarity.'
          ],
          tip: "When a MIG suddenly welds badly, check the consumables before the settings: tip, nozzle, liner, drive tension, gas flow. It's almost always one of those five."
        },
        {
          id: 'gmaw-2',
          title: 'Wire and Gas Matchmaking',
          blurb: 'What to load and what to flow, per material',
          body: [
            "For mild steel, the standard wire is **ER70S-6**. The '6' means extra deoxidisers (silicon and manganese) in the wire, which is what lets it cope with a bit of mill scale and light surface rust. It's the default for good reason.",
            "Diameter by job: **0.8 mm** is the sweet spot for sheet up to about 5 mm and is what most single-phase home machines run best. **0.9 mm** (often sold as 0.035\") handles 5 mm and up with more deposition. **0.6 mm** exists for genuinely thin sheet — car panels — where 0.8 keeps blowing through.",
            "Gas is where the quality difference lives. An **argon-rich blend with CO₂** (commonly around 80–82% argon / 18–20% CO₂, sold in Australia under names like Argoshield) gives a smooth stable arc, minimal spatter and a nice bead profile. **Straight CO₂** is cheaper and penetrates deeper, but the arc is harsher and it spatters noticeably more. If you're learning, the blend is worth the money — half of learning MIG is being able to see and hear what a good arc is like.",
            "**Stainless steel** wants a matching wire (308LSi for 304, 316LSi for 316) and a tri-mix gas, typically argon with a couple of percent CO₂ and some helium. Straight CO₂ carburises stainless and hurts corrosion resistance.",
            "**Aluminium** needs **100% argon**, a matching wire (4043 for general work, 5356 where you want more strength and better colour match after anodising) and — critically — a **spool gun or push-pull torch**. Aluminium wire is soft as spaghetti; push it through a metre of standard liner and it will birdnest in the feeder. Aluminium also needs a Teflon liner if you're going through a standard gun at all.",
            "**Gasless (flux-cored) wire** is the exception to all of the above: no bottle at all, the flux inside the wire does the shielding. It's brilliant outdoors and on rusty steel, it's smoky and spattery, it leaves slag to chip, and remember — DCEN polarity.",
            "Gas flow: **12–15 L/min** covers most indoor MIG work. More isn't better — excessive flow becomes turbulent and actually sucks air into the shield. If it's draughty, block the draught rather than cranking the regulator."
          ],
          keyPoints: [
            'Mild steel default: ER70S-6. 0.8 mm for up to ~5 mm, 0.9 mm for heavier.',
            'Ar/CO₂ blend (~80/20) = smooth and clean. Straight CO₂ = cheaper, deeper, spattery.',
            'Stainless: 308LSi/316LSi wire, tri-mix gas — not straight CO₂.',
            'Aluminium: 100% argon, 4043 or 5356 wire, and a spool gun. Soft wire birdnests.',
            'Gas flow 12–15 L/min. Too much flow becomes turbulent and pulls in air.'
          ],
          tip: "Block the wind rather than turning the gas up. A cardboard screen fixes outdoor porosity better than any regulator setting."
        },
        {
          id: 'gmaw-3',
          title: 'Transfer Modes',
          blurb: 'Why your machine can\'t do everything, explained honestly',
          body: [
            "'Transfer mode' means how the molten metal actually crosses from wire to workpiece. It sounds like theory. It isn't — it decides what thickness your machine can properly weld, and it's the thing that explains why cheap MIG welds fail on thick steel.",
            "**Short-circuit (dip) transfer** happens at low voltage and low wire speed. The wire physically touches the puddle, short-circuits, the tip pinches off and detaches, the arc re-establishes, and it repeats 100+ times a second. That rapid fire is the frying-bacon sound you're listening for. It's cool-running, so it's brilliant on thin material and it works in all positions — but the heat is genuinely low, which means on thick plate it can easily leave **lack of fusion**. That's the mode most home machines run, and that's the risk to respect.",
            "**Spray transfer** happens at high voltage and high wire speed with an argon-rich gas (roughly above 80% argon). The metal crosses as a fine spray of droplets without ever touching, so the arc is quiet, hissing and stable, penetration is deep and the bead is beautiful. It needs real power and it runs so hot and fluid that it's essentially flat and horizontal only. Straight CO₂ can't produce true spray transfer at all.",
            "**Globular transfer** sits between the two — big irregular drops falling across when they get too heavy. It's spattery and not something you aim for; it's mostly what you get when you're above short-circuit but below spray, or when running CO₂ hot.",
            "**Pulsed spray**, on more expensive inverters, alternates between a high peak current (making a droplet cross) and a low background current (letting things cool). You get spray-quality fusion at a lower average heat, which means spray-like results on thinner material and out of position. It's excellent, and it's why pulse machines cost what they do.",
            "The practical takeaway: know which mode your machine is in. If you're in short-circuit on 10 mm plate, either bevel and multi-pass it, preheat, or use a process with more grunt. Don't just turn the dial up and hope."
          ],
          keyPoints: [
            'Short-circuit (dip): low heat, all positions, thin material — risks lack of fusion on thick.',
            'The frying-bacon sound is short-circuit transfer running well.',
            'Spray: high voltage, argon-rich gas, deep penetration, flat/horizontal only.',
            'Straight CO₂ cannot produce true spray transfer.',
            'Pulsed spray gives spray-quality fusion at lower average heat — best of both, at a price.'
          ],
          tip: "MIG's dirty secret is that a cold, under-fused weld looks lovely on the surface. Never judge a MIG weld by how pretty the bead is. That's why destructive test coupons matter."
        },
        {
          id: 'gmaw-4',
          title: 'Angle, Stick-out and Travel',
          blurb: 'The hand skills that separate strong from shiny',
          body: [
            "**Push or drag?** Pushing (gun tilted so it points forward into the direction of travel) gives a flatter, wider bead with better gas coverage ahead of the weld and shallower penetration — good for thin material and tidy appearance. Dragging (pointing back at the finished weld) gives deeper penetration and a narrower, higher bead. Solid wire on steel: pushing is a fine default. Gasless flux-cored: **always drag**, because like stick, its slag needs to trail behind the arc.",
            "Either way, hold **10–15° from vertical**. Steeper than about 20° and you start pulling air in behind the gas shield, which shows up as porosity.",
            "**Stick-out** (contact tip to work distance) should be around **10 mm** — roughly the width of your thumb. This one matters more than beginners realise: as stick-out increases, the wire heats up more resistively before it arcs, and the machine effectively delivers less current to the joint. Long stick-out = colder, weaker weld with poor fusion, and a very common cause of a weld sitting on top instead of biting in. If you back the gun away to see better, you're welding colder without touching a dial.",
            "**Travel speed** you read off the puddle. Too fast: narrow, ropey, humped bead, often with undercut lines along the edges. Too slow: the puddle grows and rolls ahead of the arc, and the arc ends up melting weld metal instead of base metal — a fat bead with poor fusion at the toes. Right: a steady, even bead where the toes tie in flat to the plate with no visible ridge.",
            "**Gun travel path**: on a fillet, point into the corner at about 45°, and either run a straight stringer or a small consistent weave. Whatever you do, keep the wire aimed at the **leading edge** of the puddle, not the middle of it. If the arc is riding on top of molten metal, it isn't melting anything new."
          ],
          keyPoints: [
            'Push = flatter, wider, shallower. Drag = deeper, narrower. Gasless is always drag.',
            'Hold 10–15° from vertical; beyond ~20° you start pulling air into the shield.',
            'Stick-out ~10 mm. Long stick-out silently makes the weld colder and weaker.',
            'Aim the wire at the LEADING edge of the puddle, never the middle.',
            'Toes should tie in flat. A visible ridge where weld meets plate means poor fusion.'
          ],
          tip: "Rest your gun hand on something — the bench, your other hand, the workpiece. Freehand shake shows up in every bead. Every good welder braces."
        },
        {
          id: 'gmaw-5',
          title: 'Dialling It In',
          blurb: 'Voltage and wire speed, and tuning by ear',
          body: [
            "Two dials do the work. **Voltage** controls arc length and the shape of the bead — more voltage gives a wider, flatter bead. **Wire feed speed** controls current and therefore heat and deposition — more wire means more amps. They have to be balanced against each other, and the plate thickness tells you roughly where to start.",
            "Starting points for mild steel, 0.8 mm ER70S-6, Ar/CO₂ blend (treat these as somewhere to begin, not gospel — every machine and wire brand reads slightly differently):",
            "• 1.0 mm sheet: about 15–17 V, 3.0 m/min\n• 2 mm: about 17–18 V, 4.0 m/min\n• 3 mm: about 18–20 V, 5.0 m/min\n• 5 mm: about 20–22 V, 6.0 m/min (0.9 mm wire is better here)\n• 6 mm and up: 22–24 V with 0.9 mm wire, and bevel and multi-pass rather than trying to do it in one",
            "Now tune by ear, because the sound tells you more than the numbers. You want a **steady, fast, even crackle — bacon frying in a hot pan**. Listen for these two faults instead:",
            "**Popping and spitting, irregular, wire stubbing into the plate** — too much wire for the voltage. Either raise the voltage or slow the wire.",
            "**A hissing, hollow, roaring sound with a long visible arc and undercut at the edges** — too much voltage for the wire. Either drop the voltage or feed more wire.",
            "Then confirm with your eyes. A well-tuned bead sits slightly proud with even ripples and tie-in at the toes that you can barely feel with a fingernail. A bead you can catch a fingernail on at the edge is either cold or too fast.",
            "One last habit: **snip the ball off the wire end** before restarting. A ball of solidified metal on the wire tip gives a lousy start and a burst of spatter every time."
          ],
          keyPoints: [
            'Voltage = arc length and bead width. Wire speed = current, heat and deposition.',
            'Start from the thickness table, then tune by ear.',
            'Target sound: steady even crackle, like bacon frying.',
            'Popping/stubbing = too much wire (or too little volts). Hissing with undercut = too much volts.',
            'Snip the ball off the wire before each restart.'
          ],
          tip: "Write your good settings on masking tape stuck to the machine, per thickness. Every professional shop does this and it saves you rediscovering the same numbers every Saturday."
        }
      ],
      quiz: [
        {
          q: "Your MIG is popping and spitting and the wire is stubbing into the plate. What's the most likely fix?",
          choices: [
            'Increase wire feed speed',
            'Raise the voltage or slow the wire feed',
            'Increase the gas flow',
            'Switch to drag angle'
          ],
          correct: 1,
          explain: "Popping, spitting and stubbing means too much wire for the voltage — the wire hits the plate before it can melt off. Either raise the voltage or slow the wire down. The opposite fault (hissing, long arc, undercut) means too much voltage for the wire."
        },
        {
          q: "You back the gun away from the work to see the joint better, giving about 25 mm stick-out instead of 10 mm. What happens?",
          choices: [
            'Nothing — stick-out only affects your view',
            'The weld gets hotter and may burn through',
            'The weld runs colder with poorer fusion, even though you changed no settings',
            'The gas shielding improves because the nozzle is further from the spatter'
          ],
          correct: 2,
          explain: "Longer stick-out means the wire heats resistively before it arcs, so less current reaches the joint. The weld runs colder and under-fuses — with no dial touched. It's one of the most common hidden causes of weak MIG welds, and it also drags the gas shield further from the puddle."
        },
        {
          q: "Which transfer mode is a typical single-phase home MIG running on thin steel, and what's its main risk on thick plate?",
          choices: [
            'Spray transfer — risk of burn-through',
            'Short-circuit (dip) transfer — risk of lack of fusion',
            'Globular transfer — risk of excess penetration',
            'Pulsed spray — risk of distortion'
          ],
          correct: 1,
          explain: "Home machines run short-circuit (dip) transfer — the frying-bacon sound. It's cool-running and works in all positions, but the low heat means on thick plate it can leave lack of fusion under a bead that looks perfect on the surface."
        },
        {
          q: "You've loaded gasless flux-cored wire into a machine that was running solid wire with gas. What must change?",
          choices: [
            'Nothing, just remove the gas',
            'Swap the polarity to DCEN, and drag rather than push',
            'Swap to a smaller contact tip only',
            'Increase gas flow to 20 L/min'
          ],
          correct: 1,
          explain: "Solid wire with gas runs DCEP (electrode positive); gasless flux-cored runs DCEN. The polarity leads inside the machine must be swapped. And because flux-cored produces slag, you drag rather than push so the slag trails behind the arc."
        },
        {
          q: "Why is 100% argon plus a spool gun needed for aluminium MIG?",
          choices: [
            'Argon is cheaper than blends for aluminium',
            'CO₂ in the gas would react with aluminium, and soft aluminium wire birdnests in a standard long liner',
            'Aluminium needs less heat so argon cools it',
            'A spool gun feeds faster than a normal gun'
          ],
          correct: 1,
          explain: "Aluminium needs an inert shield — CO₂ is reactive and unsuitable. And aluminium wire is soft, so pushing it down a metre of standard liner causes it to buckle and birdnest in the feeder; a spool gun holds a small spool right at the handle so the push distance is tiny."
        }
      ]
    },

    /* === 5. TIG / GTAW ================================================ */
    {
      id: 'gtaw',
      title: 'TIG Welding',
      subtitle: 'GTAW — the precision game',
      icon: '💎',
      colour: '#8b6cd8',
      intro: "TIG is the one that makes people stop and look. It's also the one where you can't hide anything — every bit of dirt, every wobble, every millimetre of hand movement shows up in the bead. This is where you find out how steady you actually are.",
      lessons: [
        {
          id: 'gtaw-1',
          title: 'The Rig',
          blurb: 'Torch, tungsten, pedal, gas — how TIG differs from everything else',
          body: [
            "TIG separates the two jobs that every other process combines. The **tungsten electrode doesn't melt** — it just makes the arc. Filler metal, if you need any, is a separate rod you feed in with your other hand. That separation is why TIG gives such precise control over heat and deposition, and it's also why it takes two coordinated hands.",
            "The **torch** holds the tungsten in a collet, with a ceramic **cup** directing argon around it. A **gas lens** — a mesh screen insert replacing the standard collet body — smooths gas flow into a stable column, letting you stick the tungsten out further and giving noticeably better coverage. It's a cheap upgrade that improves almost everyone's welds.",
            "Heat control comes from a **foot pedal** (or a thumb slider on the torch). This is TIG's superpower: you can add heat to start the puddle, ease off as the part heats up, and taper down to fill the crater at the end. Nothing else lets you do that live.",
            "Arc starting comes in two flavours. **High frequency (HF) start** jumps the arc across a small gap without touching — cleanest, no contamination. **Lift arc** means touching the tungsten to the work, then lifting; the machine holds current low until you lift so it doesn't blast contamination in. Old-school **scratch start** on basic machines will contaminate the tungsten regularly and is worth avoiding if you have a choice.",
            "Gas is **100% argon** for almost everything (argon/helium mixes exist for thick aluminium and are a niche you'll meet later, if ever). Flow of **6–10 L/min** is right for most work — again, more is not better, because turbulence pulls in air.",
            "One extra that matters on stainless and titanium: **post-flow**. When you release the pedal, gas keeps flowing for several seconds to protect the hot tungsten and the cooling weld. Set it around one second per 10 A. If your welds turn blue-black at the end of every run, your post-flow is too short and you're pulling the torch away too early."
          ],
          keyPoints: [
            'The tungsten does not melt — it only creates the arc. Filler is fed separately by hand.',
            'A gas lens gives smoother coverage and lets you extend the tungsten further out.',
            'The foot pedal lets you change heat live — start hot, taper down, fill the crater.',
            'HF start or lift arc, not scratch start. Argon at 6–10 L/min.',
            'Post-flow ≈ 1 second per 10 A. Pulling away early is what turns weld ends black.'
          ],
          tip: "TIG is unforgiving of dirt in a way no other process is. Clean the joint with a stainless brush kept only for that metal, then wipe with acetone. Do that and half of TIG's difficulty disappears."
        },
        {
          id: 'gtaw-2',
          title: 'Tungsten Selection and Prep',
          blurb: 'Which colour, what size, and how to grind it',
          body: [
            "Tungstens are colour-coded on the end and the choice genuinely changes how the arc behaves. **Lanthanated (gold, 1.5%)** and **ceriated (grey, 2%)** are the modern all-rounders — they start easily, run on both DC and AC, and hold a point well. If you buy one type, buy lanthanated.",
            "**Thoriated (red, 2%)** was the old standard for DC and still works beautifully, but thorium is mildly radioactive and grinding it produces dust you shouldn't breathe. It's being phased out for good reason — there's no performance reason to choose it now.",
            "**Pure tungsten (green)** was traditionally used for AC aluminium because it forms the stable balled end that old transformer machines liked. On a modern inverter, lanthanated or ceriated works fine on AC too, and holds a truncated point that gives better arc control.",
            "Size by amperage, roughly: **1.6 mm** up to about 90 A (good for sheet and light work), **2.4 mm** for about 80–160 A (the everyday size), **3.2 mm** for 150–250 A. Running too big a tungsten at low amps gives a wandering, unfocused arc; too small at high amps and the tip melts and spits tungsten into your weld.",
            "**Grinding is not optional and the direction matters.** Grind **lengthwise** — along the axis of the tungsten, so the grind marks run down toward the tip, not around it. Circumferential grind marks make the arc wander erratically because the current follows those ridges. Use a dedicated wheel or a diamond wheel, never the same wheel you grind steel on (that contaminates the tungsten instantly).",
            "Point angle: a **sharper point (around 20–30°)** gives a tighter, more focused arc for thin material and fine work. A **blunter point (around 45–60°)** carries more current and lasts longer at high amps. Leave a small flat on the very tip — a needle point melts off in the first second and lands in your weld.",
            "If you dip the tungsten into the puddle — and you will — stop. Regrind it (or snap the end off and regrind). Welding on with a contaminated tungsten gives a fat, hissing, wandering arc and puts tungsten inclusions into the weld, which is a rejectable defect on coded work."
          ],
          keyPoints: [
            'Lanthanated (gold) or ceriated (grey) are the modern all-rounders for DC and AC.',
            'Thoriated (red) is legacy — mildly radioactive dust when ground.',
            'Size by amps: 1.6 mm to ~90 A, 2.4 mm for 80–160 A, 3.2 mm for 150–250 A.',
            'Grind LENGTHWISE on a dedicated wheel. Circular grind marks make the arc wander.',
            'Dip the tungsten in the puddle → stop and regrind. Contaminated tungsten = bad arc + inclusions.'
          ],
          tip: "Grind five or six tungstens before you start a job and stand them in a jar. Stopping mid-weld to grind is what makes people push on with a dirty tungsten."
        },
        {
          id: 'gtaw-3',
          title: 'AC or DC — Matching Current to Metal',
          blurb: 'Why aluminium is different from everything else',
          body: [
            "Steel and stainless run **DCEN** — DC electrode negative. Roughly 70% of the heat goes into the work and 30% into the tungsten, which is exactly what you want: deep penetration into the metal and a tungsten that survives. This is the default TIG setting for most of what you'll weld.",
            "Aluminium is a different animal because of the **oxide layer**. Aluminium oxide forms instantly on any exposed aluminium surface, and it melts at roughly 2,050°C while the aluminium underneath melts at about 660°C. So on DCEN, the oxide skin just sits there refusing to melt while the metal underneath goes soft and collapses. It's like trying to weld through a ceramic sheet.",
            "**AC solves it.** On the electrode-positive half of each cycle, the arc physically blasts that oxide skin apart — that's the 'cleaning action', and you can watch it work as a bright etched zone spreading out either side of the puddle. On the electrode-negative half, heat goes into the work. Alternating between them, you get cleaning *and* penetration.",
            "Two AC controls are worth understanding. **Balance** sets how much of each cycle is spent cleaning versus penetrating — more cleaning (more EP time) for dirty or heavily oxidised aluminium, more penetration (more EN time) for clean material and deeper welds. Around 65–70% EN is a good general starting point on a modern machine.",
            "**Frequency** controls how tight the arc cone is. Low frequency (around 60 Hz) gives a broad, soft arc; high frequency (150–250 Hz) narrows and stiffens it for precise work like fillets and thin edges. Start around 120 Hz and adjust to taste.",
            "Aluminium also drinks heat — it conducts about five times better than steel, so it pulls heat away from your puddle as fast as you put it in. That means you need **more amps than the same thickness of steel**, and you'll feel the part heat-soak as you go, needing you to back the pedal off progressively through a run.",
            "Cleanliness on aluminium is absolute: a dedicated **stainless steel wire brush used only on aluminium**, then acetone. Any oil, any moisture, any brush that's touched steel, and you'll get black soot and porosity."
          ],
          keyPoints: [
            'Steel and stainless: DCEN. Deep penetration, tungsten stays cool.',
            'Aluminium: AC. The EP half-cycle blasts off the oxide layer that DCEN can\'t melt through.',
            'AC balance ≈ 65–70% EN as a starting point; more EP for dirtier material.',
            'AC frequency: ~60 Hz broad and soft, 150–250 Hz tight and precise. Start ~120 Hz.',
            'Aluminium conducts heat ~5× better than steel — more amps, and ease off as the part heat-soaks.'
          ],
          tip: "Aluminium gives you almost no colour warning before it collapses — it stays silver right up until it drops out of the joint. Watch for the surface going glossy and wet-looking; that's your cue, and it comes fast."
        },
        {
          id: 'gtaw-4',
          title: 'The Two-Hand Dance',
          blurb: 'Torch angle, dabbing filler, and reading the puddle',
          body: [
            "Hold the torch at about **15–20° from vertical**, leaning back away from the direction of travel. Steeper than that and you start drawing air under the gas cup. The filler rod comes in from the front at a low angle, around **15–20° from the plate**, opposite the torch lean.",
            "Then the sequence, which is the entire skill: **establish the puddle first, then feed.** Bring the heat on, watch until you get a small shiny puddle that looks wet and slightly domed, **then** dab the rod into the leading edge of that puddle, withdraw it slightly (keeping the hot end inside the gas shield), move forward a fraction, and dab again. Puddle, dab, move. Puddle, dab, move.",
            "Every classic beginner mistake is a variation of one thing: **feeding the rod into the arc instead of into the puddle.** If you touch the arc itself, the rod balls up, spits, and doesn't join anything. The rod goes into the front edge of the molten pool, where the metal is already liquid.",
            "The other one is **letting the rod leave the gas envelope**. Pull it right out between dabs and its hot end oxidises; dip that back in and you've put contamination in your weld. Keep it close, keep it shielded.",
            "Reading the puddle is what you're really learning. It should be a **small, bright, controlled circle** — you want it just big enough to bridge the joint. If it grows and starts to sag or look like it's about to fall through, ease the pedal off. If it just sits there dull and won't go liquid, more heat. That live feedback loop through your foot is what makes TIG feel like an instrument once it clicks.",
            "**Walking the cup** is the pipe welder's technique: rest the cup on the joint and rock it side to side, walking the torch along in a controlled rhythm. It gives incredibly consistent spacing and takes the shake out of your hand. It only works with a cup resting in a groove, but on pipe it's transformative.",
            "Finally: **fill the crater.** Don't just release the pedal at the end of a run. Taper the current down while adding a couple of last dabs of filler, otherwise the shrinking crater leaves a dished, cracked spot — crater cracks are a genuine defect, not a cosmetic issue."
          ],
          keyPoints: [
            'Torch ~15–20° from vertical leaning back; filler in low at ~15–20° from the plate.',
            'Puddle first, THEN dab. Feed the rod into the leading edge of the puddle, never into the arc.',
            'Keep the hot rod end inside the gas shield between dabs.',
            'Small, bright, controlled puddle. Sagging = ease off the pedal.',
            'Always fill the crater by tapering the pedal down with a last dab or two.'
          ],
          tip: "Practise the two hands separately. Run a puddle along a plate with no filler at all until it's dead consistent. Then add the rod. Trying to learn both at once is how people decide they're 'no good at TIG'."
        },
        {
          id: 'gtaw-5',
          title: 'Amps and Heat Management',
          blurb: 'Setting current, and fighting warp on thin material',
          body: [
            "The rule of thumb for mild steel is about **40 amps per millimetre of thickness**. So 2 mm steel wants roughly 80 A, 3 mm around 120 A, 6 mm around 240 A. Stainless conducts heat more poorly and runs hotter for longer, so knock off maybe 15–20%. Aluminium, conducting far better, wants **more** — think 45–50 A per mm and up, plus a hot start.",
            "Set the machine's maximum at or slightly above what you need, then use the **pedal as your real control**. That's the whole point of TIG. A common beginner error is setting the machine low 'to be safe', then flooring the pedal all run and having no headroom left to react.",
            "Managing heat over a whole job is a real skill, because the part gets hotter as you go. Symptoms of heat build-up: the puddle forming faster and faster, the weld getting wider along the run, and eventually falling through near the end. Fixes: **back the pedal off progressively**, split long welds into short runs with pauses, or move around the part and let sections cool.",
            "**Distortion** is the other consequence, and on thin material it's the main enemy. Heat makes steel expand; the weld shrinks as it solidifies and pulls everything toward it. Counter it by: tacking thoroughly before welding (small tacks, plenty of them), using **backstepping** (welding short lengths in the opposite direction to the overall progression), **staggering** welds from side to side rather than doing one side then the other, clamping to a heavy backing bar to sink heat away, and simply not putting in more weld than the drawing asked for.",
            "For thin sheet and root runs, a **copper backing bar** clamped behind the joint is close to cheating in a good way: copper conducts heat away fast and won't fuse to the steel, so it supports the puddle and stops burn-through.",
            "And on stainless, **heat is also a quality issue**, not just a shape one. Too much heat and time at temperature causes carbide precipitation and heavy discolouration, hurting corrosion resistance in the heat-affected zone. Weld it cooler and faster than you'd instinctively want, keep interpass temperature down, use enough post-flow, and use back-purging with argon on the underside where the root matters — otherwise the back of the weld comes out grey and crumbly ('sugaring')."
          ],
          keyPoints: [
            'Rough rule: 40 A per mm of mild steel. Stainless ~15–20% less. Aluminium more (45–50 A/mm+).',
            'Set the machine high enough and control with the pedal — keep headroom.',
            'As the part heat-soaks, back the pedal off through the run.',
            'Fight distortion: many small tacks, backstepping, staggered sequence, clamp to heavy backing.',
            'Copper backing bar stops burn-through on thin sheet — copper won\'t fuse to steel.',
            'Stainless: keep it cool, back-purge the root, or it sugars and loses corrosion resistance.'
          ],
          tip: "If a thin panel starts to oil-can and buckle, stop and let it cool completely. Welding on into a distorting part just locks the distortion in permanently."
        }
      ],
      quiz: [
        {
          q: "Why must aluminium be TIG welded on AC rather than DCEN?",
          choices: [
            'Aluminium needs less heat, and AC delivers less',
            'The oxide layer melts at ~2050°C while the metal melts at ~660°C — AC\'s electrode-positive half blasts the oxide off',
            'AC prevents the tungsten from melting',
            'DC machines cannot reach the amps aluminium needs'
          ],
          correct: 1,
          explain: "Aluminium oxide melts at around 2050°C while the aluminium beneath melts at about 660°C, so on DCEN the metal collapses under an unmelted oxide skin. On AC, the electrode-positive half of each cycle strips that oxide away — the visible 'cleaning' zone — while the electrode-negative half puts heat into the work."
        },
        {
          q: "Roughly what amperage would you set to TIG 3 mm mild steel?",
          choices: ['About 40 A', 'About 120 A', 'About 250 A', 'About 400 A'],
          correct: 1,
          explain: "The working rule is about 40 A per mm of mild steel thickness, so 3 mm ≈ 120 A. Set the machine at or just above that and use the pedal for real-time control — always keep some headroom."
        },
        {
          q: "Which way do you grind a tungsten, and why?",
          choices: [
            'Around the circumference, for a smooth even taper',
            'Lengthwise along the axis, because circular grind marks make the arc wander',
            'Direction doesn\'t matter, only the angle does',
            'You don\'t grind tungstens — they come pre-pointed'
          ],
          correct: 1,
          explain: "Grind lengthwise, along the axis, on a wheel dedicated to tungsten. Circumferential grind marks create ridges the current follows, giving a wandering, erratic arc. Leave a small flat on the tip so a needle point doesn't melt off into the weld."
        },
        {
          q: "Where exactly does the filler rod go?",
          choices: [
            'Directly into the arc, so it melts fastest',
            'Into the leading edge of the established puddle',
            'Behind the puddle, into the cooling weld',
            'Held above the arc so it drips in'
          ],
          correct: 1,
          explain: "Establish the puddle first, then dab the rod into its leading edge. Feeding into the arc itself just balls the rod up and spits — it's the single most common TIG beginner error. Keep the rod's hot end inside the gas shield between dabs."
        },
        {
          q: "Your TIG welds on stainless keep turning black at the end of each run. What's the most likely cause?",
          choices: [
            'Amperage set too low',
            'Post-flow too short, or pulling the torch away too early',
            'The tungsten is too large',
            'Argon flow set too high'
          ],
          correct: 1,
          explain: "Blackened weld ends mean the hot metal is oxidising because it lost gas cover before it cooled. Set post-flow to roughly one second per 10 A and hold the torch over the weld until it stops — don't snatch it away the instant you release the pedal."
        }
      ]
    },

    /* === 6. QUALITY & DEFECTS ========================================= */
    {
      id: 'quality',
      title: 'Weld Quality',
      subtitle: 'Defects and the eagle eye',
      icon: '🔍',
      colour: '#c8503a',
      intro: "Anyone can lay a bead. What makes you worth hiring is being able to look at one — yours or someone else's — and say exactly what's wrong and why. This is the module that turns practice into judgement.",
      lessons: [
        {
          id: 'quality-1',
          title: 'What Good Actually Looks Like',
          blurb: 'The checklist an inspector runs in five seconds',
          body: [
            "Before you can spot a bad weld, you need a clear picture of a good one. An inspector looking at a fillet weld under AS/NZS 1554 is running through a short mental list, and you can run the same one.",
            "**Size.** Correct leg length for the drawing, and consistent along the whole run. Measured, not eyeballed — that's what a fillet gauge is for.",
            "**Uniformity.** Even ripples, even width, even height along the length. Variation means your travel speed was wandering, and wandering travel speed means the penetration underneath is varying too.",
            "**Tie-in at the toes.** The edges of the weld should blend smoothly into the base metal. If there's a sharp notch or an overhanging lip where weld meets plate, that's a stress raiser and a defect. Run a fingernail along the toe: it should feel like a ramp, not a step.",
            "**Profile.** Slightly convex or flat is good. Heavily piled-up convex means over-welding and poor tie-in. Concave on a fillet means you may be under the required throat thickness.",
            "**Start and stop quality.** Craters filled, restarts blended in without a lump or a gap. Craters are where cracks start, so unfilled ones are a real fault.",
            "**Cleanliness and freedom from visible defects.** No cracks (ever — cracks are never acceptable, in any code), no visible porosity beyond what the code allows, no undercut beyond the allowed depth, no trapped slag, no arc strikes on the parent metal outside the joint. That last one catches people out: striking your arc on the plate beside the weld leaves a hard, brittle spot and it's a legitimate rejection point.",
            "Learn to apply this to your own work honestly. The welder who can look at their own bead and say 'the toe on the left doesn't tie in and my travel slowed at the end' is improving three times as fast as the one who's just pleased it stuck."
          ],
          keyPoints: [
            'Correct size, consistent along the run — measured with a gauge, not guessed.',
            'Even ripples and width. Variation means travel speed was wandering.',
            'Toes must blend like a ramp, not a step. Sharp notches are stress raisers.',
            'Craters filled at every stop. Craters are where cracks start.',
            'No cracks, ever. No arc strikes on the parent metal outside the joint.'
          ],
          tip: "Photograph your welds. Genuinely — a photo shows you things your eye skipped over at the bench, and having a record of month one next to month six is the best motivation there is."
        },
        {
          id: 'quality-2',
          title: 'The Rogues\' Gallery, Part One',
          blurb: 'Porosity, undercut, overlap and spatter',
          body: [
            "**Porosity** — gas trapped in the solidifying weld, showing as round holes or pinholes in or under the surface. It comes from anything that puts gas where it shouldn't be: loss of shielding (draught, blocked nozzle, gas flow too low or turbulently high, too long an arc), contamination (rust, oil, paint, moisture, galvanising), or damp electrodes. It weakens the weld by reducing the sound cross-section. Fix the cause, gouge or grind the porous weld out, and re-weld — you cannot fill porosity by welding over the top of it.",
            "**Undercut** — a groove melted into the base metal along the toe of the weld that hasn't been filled with weld metal. Caused by too much current, too long an arc, too fast a travel, or a bad angle putting the arc's heat on the plate edge rather than the joint. It matters because it reduces the plate's effective thickness and forms a sharp notch exactly where the stress concentrates. Codes limit it strictly. Fix: less current, shorter arc, slower travel, better angle — and on fillets, aim slightly more at the vertical plate.",
            "**Overlap (cold lap)** — weld metal that has rolled over onto the base metal surface without fusing to it. It looks like the weld has spilled over the edge and just sat there, and often there's a visible lip you can catch a fingernail under. Caused by too little heat, travelling too slowly so the puddle runs ahead of the arc, or a wrong angle. It's dangerous precisely because it looks like a big, generous weld while carrying almost no load at that edge.",
            "**Excessive spatter** — balls of metal thrown out and stuck around the weld. It isn't usually a structural defect in itself, but it's a symptom worth reading: too long an arc, too much voltage, wrong polarity, damp electrode, wrong gas (straight CO₂ spatters more), or a worn contact tip. It also makes work slower — every ball needs chipping off before painting — and it tells anyone looking that your settings were off.",
            "Notice the pattern: three of these four come back to the same handful of causes. Arc too long, too fast or too slow, too hot or too cold, wrong angle. Fix your fundamentals and most defects disappear together."
          ],
          keyPoints: [
            'Porosity = trapped gas. From lost shielding, contamination, or damp rods. Must be removed, not welded over.',
            'Undercut = unfilled groove at the toe. Too hot, too fast, arc too long, bad angle.',
            'Overlap = weld rolled onto unfused base metal. Too cold or too slow. Looks generous, carries nothing.',
            'Spatter is usually a symptom: long arc, too much voltage, wrong polarity, worn tip.',
            'Most defects trace back to arc length, travel speed, heat and angle.'
          ],
          tip: "When you find a defect, always ask 'too hot or too cold?' first. That question alone sorts most of the gallery into two piles and points straight at the fix."
        },
        {
          id: 'quality-3',
          title: 'The Rogues\' Gallery, Part Two',
          blurb: 'The serious ones — fusion, penetration, burn-through and cracks',
          body: [
            "**Lack of fusion** — the weld metal never actually bonded to the base metal or to the previous pass. This is the dangerous one, because it frequently **cannot be seen from the surface**. A perfect-looking bead can be sitting in a joint bonded to nothing. Causes: not enough heat, travel too fast to melt the base metal, arc aimed at the puddle rather than the leading edge, dirty or scaled joint faces, or MIG short-circuit transfer used on plate too thick for it. This is why bend and break tests exist, and why 'it looks good' is not a quality statement.",
            "**Lack of penetration** (incomplete root penetration) — the weld didn't reach the bottom of the joint, leaving a gap at the root. Causes: root gap too small or no bevel on thick material, too little current, travel too fast, an electrode too big to reach into the root. The joint keeps a built-in crack at its root, which is where fatigue failure will start.",
            "**Burn-through** — the puddle collapses and you punch a hole. Too much heat for the thickness, travelling too slowly, or too big a root gap. On thin sheet, drop the current, travel faster, use short stitched runs with cooling time, or clamp a copper backing bar behind the joint.",
            "**Cracks** are the serious ones and there are two families worth telling apart.",
            "**Hot cracks** appear while the weld is still solidifying, often right down the centreline of the bead, sometimes visible in the crater as you watch. They come from the weld metal shrinking under restraint while a low-melting film is still liquid between the grains — made worse by contaminants like sulphur, by a deep narrow bead shape (a bead much deeper than it is wide is prone to centreline cracking), by craters left unfilled, and by heavy restraint.",
            "**Cold cracks** (hydrogen or delayed cracks) appear hours or even days after welding, usually in the heat-affected zone rather than the weld itself. The recipe needs three things together: **hydrogen** (from damp electrodes, moisture, oil, rust), a **hard brittle microstructure** (from a hardenable steel cooling too fast), and **stress** (from restraint). Take away any one and you don't get cracking — which is why the fixes are: keep low-hydrogen rods dry, preheat thicker or higher-carbon steel to slow cooling, and reduce restraint.",
            "And the rule that overrides everything: **a crack is never acceptable.** Not in any code, not at any size, not 'it's only small'. Cracks propagate. It gets gouged out and re-welded."
          ],
          keyPoints: [
            'Lack of fusion is usually invisible from the surface — the most dangerous defect there is.',
            'Lack of penetration leaves a built-in crack at the root of the joint.',
            'Burn-through: drop current, travel faster, stitch, or use a copper backing bar.',
            'Hot cracks = solidification, often centreline or crater, while still hot.',
            'Cold cracks = hydrogen + hard microstructure + stress, appearing hours to days later.',
            'A crack is never acceptable at any size. Gouge it out and re-weld.'
          ],
          tip: "Cut some of your practice welds in half with a grinder and look at the cross-section. Nothing teaches penetration like seeing exactly how far your heat actually went."
        },
        {
          id: 'quality-4',
          title: 'Distortion and Inspection',
          blurb: 'Keeping it straight, and how welds get checked for real',
          body: [
            "Distortion is simple physics: heat expands the metal, the weld shrinks as it cools, and it drags everything toward itself. Three shapes result — the plate pulls in along the weld (transverse shrinkage), it bows along its length (longitudinal), and it folds up around the joint (angular distortion, the classic 'V' you get when a fillet pulls two plates out of square).",
            "The countermeasures, roughly in order of effectiveness:",
            "**Put in less heat.** Weld to the size required and no bigger. Over-welding is the number one cause of distortion in home workshops.",
            "**Tack thoroughly first.** Lots of small tacks, not three big ones. And expect the gap to close as you weld — experienced fabricators often set the joint slightly open, or pre-set the parts tilted the opposite way so shrinkage pulls them into alignment.",
            "**Balance the heat.** Alternate sides on a double-sided joint rather than completing one side then the other. Stagger welds around a frame rather than working along it.",
            "**Backstep.** Progress overall from left to right, but weld each short segment right to left. Each segment's shrinkage pulls against the last one instead of accumulating.",
            "**Clamp and sink the heat.** Heavy clamps, jigs, or bolting to a thick bench hold the shape while it cools; copper or aluminium backing bars pull heat out fast.",
            "Now, how welds actually get checked. **Visual inspection (VT)** is the first and by far the most common — it catches the majority of defects and it's the skill you built in this module. Beyond that: **dye penetrant (PT)** sprays a coloured or fluorescent liquid that seeps into surface-breaking cracks and is drawn back out by a developer — cheap, effective, surface only. **Magnetic particle (MT)** magnetises ferrous material and reveals surface and slightly subsurface flaws with iron powder. **Ultrasonic (UT)** sends sound through the material to find internal flaws. **Radiography (RT)** X-rays the weld for a permanent internal record.",
            "You won't be doing UT or RT — those are qualified inspector roles. But knowing they exist, and knowing that everything under the surface can and will be looked at on serious work, changes how you weld when nobody's watching. That's really the whole point of this module."
          ],
          keyPoints: [
            'Distortion = expansion then shrinkage pulling everything toward the weld.',
            'Less weld = less distortion. Over-welding is the biggest self-inflicted cause.',
            'Many small tacks, balanced/alternating sequence, backstepping, heavy clamping.',
            'Pre-set parts opposite to the expected pull, and expect gaps to close.',
            'VT (visual) catches most defects; PT and MT find surface flaws; UT and RT find internal ones.'
          ],
          tip: "The welds nobody will ever inspect are the ones that tell you who you are as a tradesperson. Weld them like they're going on a boat with your family aboard."
        }
      ],
      quiz: [
        {
          q: "Which defect is the most dangerous specifically because it usually cannot be seen from the surface?",
          choices: ['Excessive spatter', 'Undercut', 'Lack of fusion', 'Surface porosity'],
          correct: 2,
          explain: "Lack of fusion means the weld never bonded to the base metal or previous pass — and a bead with no bond underneath can look completely perfect on top. That's exactly why bend and break tests exist and why 'it looks good' isn't a quality statement."
        },
        {
          q: "A crack appears in the heat-affected zone two days after welding a thick, higher-carbon steel section. What is it and what causes it?",
          choices: [
            'Hot cracking — the weld shrank while still solidifying',
            'Cold/hydrogen cracking — hydrogen plus a hard microstructure plus stress',
            'Undercut that opened up under load',
            'Porosity that grew over time'
          ],
          correct: 1,
          explain: "That's cold (hydrogen/delayed) cracking. It needs three things together: hydrogen from damp rods or contamination, a hard brittle microstructure from fast cooling, and stress from restraint. Remove any one and it doesn't happen — hence dry low-hydrogen rods, preheat, and reduced restraint."
        },
        {
          q: "You find a groove melted into the plate along the edge of your fillet weld, not filled with weld metal. What is it and what's the likely cause?",
          choices: [
            'Overlap — travelling too slowly',
            'Undercut — too much current, too long an arc, too fast a travel, or bad angle',
            'Lack of penetration — root gap too small',
            'Porosity — contaminated base metal'
          ],
          correct: 1,
          explain: "That's undercut. It reduces the plate's effective thickness and creates a sharp notch right where stress concentrates, so codes limit it strictly. Reduce current, shorten the arc, slow down, and on fillets aim slightly more at the vertical plate."
        },
        {
          q: "What does backstepping do?",
          choices: [
            'Welds each short segment against the overall direction of progress, so shrinkage pulls against the previous segment instead of accumulating',
            'Steps the amperage down through the weld',
            'Runs a second pass backwards over the first to reheat it',
            'Grinds back the start of each weld before restarting'
          ],
          correct: 0,
          explain: "Backstepping means the overall progression goes one way but each short segment is welded in the opposite direction. Each segment's shrinkage works against the last rather than adding up along the joint — a simple and effective distortion control."
        },
        {
          q: "Which statement about cracks is correct?",
          choices: [
            'Small cracks are acceptable if they\'re under 2 mm',
            'Cracks are acceptable if they\'re in the weld metal rather than the plate',
            'A crack is never acceptable at any size — it gets gouged out and re-welded',
            'Cracks can be filled by welding over the top of them'
          ],
          correct: 2,
          explain: "No code accepts a crack of any size, anywhere. Cracks propagate under load and fatigue. They get gouged or ground out completely and re-welded — and welding over the top of one just hides it."
        }
      ]
    }
  ]
};

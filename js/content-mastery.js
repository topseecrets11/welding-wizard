/* ============================================================================
 * WELD ACADEMY — MASTERY UNITS
 * ----------------------------------------------------------------------------
 * Units 7–9. The core units make you proficient at running a bead in each
 * process; these are the ones that make you worth paying — why metal behaves
 * the way it does, what to do when it is not mild steel, and what actually
 * happens when you front up for a ticket.
 *
 * Loaded after content.js and practice.js, and merges into both.
 * ==========================================================================*/

(function () {
  'use strict';

  var MASTERY = [

    /* === 7. METAL & HEAT ============================================== */
    {
      id: 'metal',
      tier: 'mastery',
      title: 'Metal & Heat',
      subtitle: 'What you are really doing to the steel',
      icon: '🌡️',
      colour: '#c85a9c',
      intro: "Up to now you have been learning to run a bead. This unit is where you start understanding what the heat is doing behind it — and that is the difference between a welder and someone who can be trusted with a repair that matters.",
      lessons: [
        {
          id: 'metal-1',
          title: 'The Zone Nobody Looks At',
          blurb: 'Why the metal beside your weld is the part that fails',
          body: [
            "Everyone stares at the bead. The failures usually happen next to it.",
            "Every weld creates three regions. The **weld metal** itself — melted and re-solidified, a tiny casting. The **heat affected zone (HAZ)** — metal that never melted but got hot enough to change internally. And the **parent metal** further out, unchanged.",
            "The HAZ is where the trouble lives. Steel that gets heated well above about 900°C and then cools has its grain structure completely rearranged. Cool it slowly and you get a soft, tough, coarse structure. Cool it fast — and a big cold plate sucks heat out of a small weld very fast indeed — and in steels with enough carbon you get **martensite**: extremely hard, extremely brittle, and full of internal stress.",
            "That's the mechanism behind almost every mysterious crack. Not a bad-looking bead: a hard brittle band beside a perfectly good-looking bead.",
            "Three things control how fast that zone cools: how much heat you put in (amps × volts ÷ travel speed — the **heat input**), how thick and how cold the surrounding metal is, and whether you preheated. That's it, and all three are in your hands.",
            "Which gives you the practical rules. Thick sections and cold days need more heat, not less. Very short, fast beads on heavy plate are the classic mistake, because a small weld on a big cold lump quenches itself. And a run of thin stringers with time between them behaves very differently from one big weave — sometimes better, sometimes much worse, depending on the steel."
          ],
          keyPoints: [
            'Three zones: weld metal, heat affected zone (HAZ), parent metal.',
            'The HAZ never melted but changed structure — it is where most cracks start.',
            'Fast cooling in a carbon steel makes martensite: very hard, very brittle.',
            'Heat input = amps × volts ÷ travel speed.',
            'A small weld on a thick cold plate quenches itself. Thick and cold needs MORE heat.'
          ],
          tip: "When someone tells you a weld 'broke beside the weld, not in it', they have just described HAZ cracking, and now you know why it happened."
        },
        {
          id: 'metal-2',
          title: 'Carbon, and Knowing What You Are Welding',
          blurb: 'Carbon equivalent, hardenability, and the steels that bite',
          body: [
            "Mild steel is forgiving because it has very little carbon — roughly 0.15–0.25%. Push the carbon up and steel gets stronger and harder, but it also becomes far more willing to form that brittle martensite when it cools quickly. That is **hardenability**, and it is the single most useful property to be able to guess at.",
            "Other alloying elements do the same thing to varying degrees, which is why engineers use a **carbon equivalent (CE)** number that rolls carbon, manganese, chromium, molybdenum, vanadium, nickel and copper into one figure. The common formula is the IIW one: CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15.",
            "The rough reading: **below about 0.40 CE**, weld it as normal. **0.40 to 0.45**, start thinking about preheat, especially on thick sections. **Above about 0.45**, preheat and low-hydrogen consumables are not optional. Above 0.6 you are into specialist territory with procedures written by someone qualified to write them.",
            "In real life you rarely get a mill certificate. So you learn the common ones. **Mild steel / 250 grade / 300PLUS** — the everyday structural stuff, forgiving. **4140** — a chrome-moly shaft steel, very common in workshops, hardenable, will crack readily without preheat. **Cast iron** — different animal entirely, covered in the next unit. **Spring steel, high-tensile bolts, tool steel** — all high carbon, all crack-prone, none of them casual welds.",
            "The other everyday trap is unknown mystery steel from a scrap pile. If you cannot identify it and the job matters, treat it as hardenable: preheat, low-hydrogen rods, slow cooling.",
            "One last one worth knowing: **weathering steel** (Corten) and **galvanised**, **plated** or **painted** steels all need their own handling — and any coating containing cadmium or chrome plating produces genuinely dangerous fume. Know what you are burning before you burn it."
          ],
          keyPoints: [
            'Hardenability = how readily a steel forms brittle martensite when cooled fast.',
            'Carbon equivalent (CE) rolls the alloying elements into one number.',
            'CE below ~0.40: weld normally. 0.40–0.45: consider preheat. Above 0.45: preheat plus low-hydrogen, always.',
            '4140, spring steel, high-tensile bolts and tool steel are all crack-prone.',
            'Unknown steel on an important job: assume hardenable and treat it accordingly.',
            'Cadmium and chrome plating make genuinely dangerous fume. Identify coatings first.'
          ],
          tip: "A grinder spark test tells you a surprising amount. High carbon steel throws bushy, branching, star-burst sparks; mild steel throws long straight streaks with few forks."
        },
        {
          id: 'metal-3',
          title: 'Preheat and Interpass',
          blurb: 'Slowing the cooling down on purpose',
          body: [
            "Preheat does exactly one thing, and it does it well: it slows the cooling rate. That gives hydrogen time to diffuse out instead of getting trapped, and it stops the HAZ quenching itself into brittleness. It also reduces the thermal shock and the residual stress locked into the joint.",
            "When do you preheat? When the carbon equivalent is up. When the section is thick — the mass itself does the quenching. When it is genuinely cold or damp. When the joint is heavily restrained and cannot move. And any time you are welding a steel you cannot identify on a job that matters.",
            "How much? The procedure decides on coded work. As a rough workshop guide: mild steel over about 25 mm often gets 50–100°C. Medium-carbon steels like 4140 typically want 200–320°C depending on section, and a slow cool afterwards. Cast iron is its own discipline. When in doubt, look up the specific steel — the manufacturer publishes this and it is not a guessing matter.",
            "How do you measure it? Not by eye and not with your hand. **Temperature-indicating sticks** (Tempilstik and similar) are cheap: you draw a mark on the metal near the joint and it melts when the metal reaches that temperature. An infrared thermometer works too, though on shiny metal it can read badly. Measure about 75 mm back from the joint, and on thick sections check the far side too.",
            "**Interpass temperature** is preheat's other half: the temperature the joint must still be at — or must not exceed — when you start the next pass. Too cold between passes and you lose everything preheat bought you. Too hot, particularly on stainless and some alloy steels, and you damage the properties from the other direction. Keep welding steadily rather than wandering off between passes.",
            "And afterwards: slow the cooling. Cover the job with a welding blanket, bury it in dry sand or lime, or leave it under an insulating cover. On a cold concrete floor a hot fabrication can quench itself from the bottom."
          ],
          keyPoints: [
            'Preheat slows cooling: less trapped hydrogen, less brittle HAZ, less residual stress.',
            'Preheat when CE is high, sections are thick, the weather is cold or the joint is restrained.',
            'Rough guide: mild steel over ~25 mm, 50–100°C. 4140, 200–320°C plus slow cooling.',
            'Measure with temperature sticks or an IR thermometer, ~75 mm back from the joint.',
            'Interpass temperature matters as much as the initial preheat.',
            'Slow the cool-down afterwards — blanket, sand or lime, never a cold concrete floor.'
          ],
          tip: "An oxy torch waved about is a lousy way to preheat — it heats a small patch while the mass stays cold. Heat a wide area, both sides where you can, and give it time to soak through."
        },
        {
          id: 'metal-4',
          title: 'After the Arc Goes Out',
          blurb: 'Residual stress, stress relief, and when to leave it alone',
          body: [
            "A finished weld is not a relaxed piece of metal. It shrank as it solidified while everything around it held it in place, so it is now under tension — sometimes close to the yield strength of the material — with the surrounding metal in compression to balance it. That is **residual stress**, and it is why welded assemblies move when you machine them and why a cracked repair can let go long after you finished.",
            "**Post-weld heat treatment (PWHT)**, usually stress relieving, is the formal cure: bring the whole thing up to typically 550–650°C for carbon steel, hold it based on thickness, then cool it slowly under control. It relaxes the residual stress and tempers any hard HAZ. It is oven work — a coded, controlled process, not something to improvise with a torch.",
            "What you can do without an oven is reduce how much stress you build in: weld to size and no bigger, sequence the job so shrinkage is balanced, and avoid heavily restrained joints where you have the choice.",
            "**Peening** — lightly hammering the weld while it is still hot — can help relieve stress in some situations, particularly cast iron repairs, by spreading the weld metal as it shrinks. It is a real technique with real limits: never on the root run, never on the cap where it can be judged as damage, and it is banned outright by some procedures. Know why you're doing it before you do it.",
            "Then there is what happens over the life of the joint. **Fatigue** — repeated loading — is what kills welded structures, and it starts at stress raisers: sharp weld toes, undercut, arc strikes, notches, unfilled craters. Which is the whole point of that quality module: those faults are not about tidiness, they are about how many cycles the joint survives.",
            "So the mastery-level habit is simple and it costs nothing: leave no sharp notches, blend the toes, fill every crater, keep welds the size specified and no bigger, and don't leave arc strikes anywhere. Every one of those is free at the time and expensive later."
          ],
          keyPoints: [
            'Every weld leaves residual stress — the joint is in tension, the surroundings in compression.',
            'Stress relief (typically 550–650°C for carbon steel) is controlled oven work, not a torch job.',
            'You control stress at the source: weld to size, balance the sequence, reduce restraint.',
            'Peening has real uses (notably cast iron) and real limits — never on the root, banned by some procedures.',
            'Fatigue starts at stress raisers: sharp toes, undercut, arc strikes, unfilled craters.'
          ],
          tip: "When a machinist tells you the part moved after they cut it, you are watching residual stress released. Rough machine, stress relieve, then finish machine — that's the professional order."
        }
      ],
      quiz: [
        {
          q: 'A weld looks perfect but a crack appears in the plate right beside it. Which zone failed, and why?',
          choices: [
            'The weld metal — it was too small',
            'The heat affected zone — heated then cooled fast enough to go hard and brittle',
            'The parent metal well away from the weld — it was faulty steel',
            'The slag layer'
          ],
          correct: 1,
          explain: 'That is HAZ failure. The metal beside the weld never melted, but got hot enough to change structure. Cooled fast — especially on a thick cold section — a carbon steel forms martensite there: hard, brittle and stressed.'
        },
        {
          q: 'What does carbon equivalent (CE) tell you?',
          choices: [
            'How much filler metal the joint will need',
            'How much the steel will distort',
            'How readily the steel hardens and cracks — and therefore whether it needs preheat',
            'The tensile strength of the finished weld'
          ],
          correct: 2,
          explain: 'CE rolls carbon plus the alloying elements into one hardenability figure. Below about 0.40 weld normally; 0.40–0.45 consider preheat; above 0.45 preheat and low-hydrogen consumables are required.'
        },
        {
          q: 'What does preheat actually do?',
          choices: [
            'Burns off contamination before welding',
            'Slows the cooling rate, so hydrogen can escape and the HAZ does not quench hard',
            'Makes the metal easier to melt so you can use fewer amps',
            'Softens the metal so it distorts less'
          ],
          correct: 1,
          explain: 'Preheat slows cooling. That gives hydrogen time to diffuse out rather than being trapped, and stops the heat affected zone quenching itself into brittle martensite. It also cuts thermal shock and residual stress.'
        },
        {
          q: "You're welding 30 mm plate on a cold morning with short fast beads and it keeps cracking. What is the most likely problem?",
          choices: [
            'Too much heat input',
            'The thick cold mass is quenching each small weld — not enough heat input, and no preheat',
            'The electrode diameter is too large',
            'Travel speed is too slow'
          ],
          correct: 1,
          explain: 'Small fast beads on a thick cold section are the classic self-quench. The surrounding mass sucks the heat straight out, the HAZ hardens, and it cracks. Preheat, and put more heat in rather than less.'
        },
        {
          q: 'Why do sharp weld toes, undercut and arc strikes matter so much on a structure that gets loaded repeatedly?',
          choices: [
            'They look untidy to the inspector',
            'They are stress raisers where fatigue cracks start',
            'They cause rust',
            'They make the weld weigh more'
          ],
          correct: 1,
          explain: 'Fatigue failure starts at stress raisers. A sharp notch at a weld toe, undercut, or an arc strike on the parent metal each concentrate stress and dramatically shorten the number of load cycles the joint survives.'
        }
      ]
    },

    /* === 8. BEYOND MILD STEEL ========================================= */
    {
      id: 'materials',
      tier: 'mastery',
      title: 'Beyond Mild Steel',
      subtitle: 'Stainless, aluminium, cast iron and the unknown',
      icon: '🧪',
      colour: '#3aa6a0',
      intro: "Mild steel forgives you. Nothing else does. Every material here has one specific way it will punish a habit you picked up on mild steel — and knowing what that is, before you strike the arc, is most of the job.",
      lessons: [
        {
          id: 'materials-1',
          title: 'Stainless Steel',
          blurb: 'Keeping the stainless in stainless',
          body: [
            "Stainless is not one material. The common workshop grades are **austenitic** — 304 (the general one) and 316 (with molybdenum, for marine and chemical work). They are non-magnetic, tough, and weld well. **Ferritic** grades like 430 are magnetic and less weldable. **Duplex** grades are strong and increasingly common in marine work, and they have tight heat input limits. **Martensitic** grades like 410 are hardenable and need preheat.",
            "What makes stainless stainless is a self-repairing chromium oxide film. Everything you do wrong to stainless is really a way of wrecking that film.",
            "**Cross contamination** is the big one and it is entirely avoidable. Grind stainless with a wheel that has touched carbon steel, or brush it with a carbon steel brush, and you embed carbon steel particles that rust in weeks. Stainless gets its own brushes, its own flap discs, its own grinder, and ideally its own bench area. Every good shop separates them physically.",
            "**Heat** is the second. Stainless conducts heat about a third as well as carbon steel and expands about 50% more, so it warps enthusiastically and it stays hot for a long time. Weld it cooler and faster than instinct says, keep interpass temperature down, and use plenty of tacks and clamping.",
            "Held too long at 450–850°C, austenitic stainless suffers **sensitisation** — chromium carbides form at the grain boundaries and steal the chromium that was protecting them, so it corrodes in a line beside the weld. That's the reason **L grades** (304L, 316L: low carbon) exist and why they're the sensible default for anything welded.",
            "**Back purging** matters where the root side is exposed. Without argon on the back, the root oxidises into a grey crumbly mess called **sugaring**, and it has lost its corrosion resistance completely. Pipe, tanks and anything holding food or chemicals gets purged.",
            "And **cleaning after** the weld is a real step, not vanity: pickling paste or electropolishing removes the heat tint and restores the passive film. Wire brushing alone leaves the tint, and heat tint is a corrosion site."
          ],
          keyPoints: [
            '304 and 316 austenitic grades are the common workshop stainlesses. Use L grades (low carbon) for welding.',
            'Cross contamination from carbon steel tools causes rust — separate brushes, discs and bench.',
            'Stainless conducts heat poorly and expands ~50% more: it warps badly and stays hot.',
            'Sensitisation at 450–850°C steals chromium from the grain boundaries and destroys corrosion resistance.',
            'Back purge with argon or the root sugars and loses its corrosion resistance.',
            'Pickle or passivate afterwards — heat tint is a corrosion site, not a cosmetic issue.'
          ],
          tip: "If a stainless job goes rusty in a month, ninety-nine times out of a hundred it was a carbon steel brush or grinding disc, not the steel."
        },
        {
          id: 'materials-2',
          title: 'Aluminium in Depth',
          blurb: 'Alloys, fillers, and why it is nothing like steel',
          body: [
            "Aluminium punishes steel habits harder than anything else. It melts at about 660°C but its oxide melts at about 2050°C. It conducts heat about five times better than steel. It does not change colour before it collapses. And it loses roughly half its strength in the heat affected zone of any weld — permanently, on heat-treatable alloys.",
            "**Which alloy** matters more than beginners expect. The **5000 series** (5083, 5052 — magnesium) is the marine and structural family, very weldable. The **6000 series** (6061, 6082 — magnesium and silicon) is the common extrusion family, heat-treatable, weldable but crack-sensitive with the wrong filler. The **2000 and 7000 series** (aircraft alloys, 2024 and 7075) are essentially **not weldable** by normal means — do not accept that job.",
            "**Filler choice** is a genuine decision, not a default. **4043** (silicon) flows well, is more crack-resistant on 6000 series, and finishes slightly grey. **5356** (magnesium) is stronger, better for 5000 series, better colour match if the job gets anodised, and takes a polish. Rule of thumb: 6061 and extrusions, 4043. Marine plate and anything anodised, 5356. There are alloy-specific charts and they are worth reading for a real job.",
            "**Cleaning is not optional and it is a two-stage job.** Degrease first with acetone (never after brushing — brushing drives grease in), then remove the oxide mechanically with a stainless brush kept only for aluminium. Do it immediately before welding: the oxide starts regrowing within minutes.",
            "**Preheat** on aluminium is a trap. A gentle preheat (around 100–120°C) helps on thick sections where your machine is struggling, but too much destroys strength, encourages hot cracking, and puts you on the edge of collapse without any colour warning. Never exceed about 150°C on 5000 or 6000 series, and never use preheat as a substitute for having enough amps.",
            "**Hot cracking** is aluminium's signature fault, usually along the centreline or in the crater. The cures are: correct filler alloy, avoid a deep narrow bead, fill every crater (use the machine's downslope), reduce restraint, and don't weld dirty."
          ],
          keyPoints: [
            '5000 series: marine, very weldable. 6000 series: extrusions, weldable with care. 2000/7000: essentially not weldable.',
            '4043 filler for 6061 and extrusions; 5356 for marine plate and anything to be anodised.',
            'Degrease with acetone FIRST, then brush the oxide off with an aluminium-only stainless brush.',
            'Oxide regrows within minutes — clean immediately before welding.',
            'Preheat sparingly if at all, never above ~150°C, and never instead of adequate amps.',
            'Hot cracking is the signature fault: right filler, fill the crater, avoid deep narrow beads.'
          ],
          tip: "Aluminium gives no colour warning. Watch for the surface going glossy and wet-looking — that's the puddle, and it arrives about half a second before the whole thing falls through."
        },
        {
          id: 'materials-3',
          title: 'Cast Iron Repair',
          blurb: 'The hardest common repair, done properly',
          body: [
            "Cast iron repair separates people who can weld from people who understand metal. Cast iron holds around 2–4% carbon as graphite flakes, which makes it brilliant in compression, good at damping vibration, easy to machine — and almost completely without ductility. It cannot stretch to absorb the shrinkage of your weld, so it cracks instead.",
            "Know which cast you have. **Grey iron** is the common brittle one — engine blocks, machine bases, old vices. **Ductile (nodular/SG) iron** has spheroidal graphite and some genuine ductility, and welds far better. **White iron** is extremely hard and essentially unweldable. If it snapped cleanly with a grey grainy fracture face, assume grey iron.",
            "The consumable is the first decision: **nickel-based electrodes**. Pure nickel (Ni99) gives the most machinable weld and is the usual choice for a repair you have to machine afterwards. Nickel-iron (Ni55) is stronger and cheaper and better for structural repairs. Do not use ordinary steel rods on cast iron for anything that matters — the weld picks up carbon from the parent and comes out glass-hard and cracked.",
            "Then the method, and there are two philosophies. **Cold welding**: no preheat, tiny stringer beads about 25 mm long, peen each one immediately while it's hot with a light ball-pein hammer to spread it as it shrinks, then wait until you can hold your hand on the casting before the next run. Slow, disciplined, and it works because you never let the whole casting heat up.",
            "**Hot welding**: preheat the entire casting evenly to around 500–600°C, weld it, then cool it very slowly over hours, buried in lime or sand or inside a switched-off furnace. Stronger and more reliable on big jobs, but you need the means to heat and to cool a whole casting under control.",
            "Either way, preparation is the same and it matters more than the welding: find both ends of the crack and **drill a small stop hole** at each, so it cannot run further. Grind a V out along the crack to get access to its root. Clean out the oil — old castings are soaked in it, and heating them to burn it out first is standard practice. Then weld short, peen, and be patient.",
            "And know when to say no. A cracked engine block on a running vehicle, a highly stressed casting, anything safety-critical — that is a specialist job, and often brazing or a stitch-pin repair (Metalock and similar) is the better answer than welding at all."
          ],
          keyPoints: [
            'Cast iron has ~2–4% carbon as graphite and almost no ductility — it cracks rather than stretching.',
            'Grey iron (brittle, common), ductile/SG iron (welds better), white iron (essentially unweldable).',
            'Nickel electrodes: Ni99 for machinability, Ni55 for strength. Never plain steel rods.',
            'Cold method: 25 mm stringers, peen each while hot, cool to hand temperature between runs.',
            'Hot method: preheat the whole casting to 500–600°C and cool it over hours.',
            'Always drill stop holes at both ends of the crack and clean the oil out first.',
            'Some castings should be brazed, pinned or replaced — knowing that is part of the skill.'
          ],
          tip: "Cast iron repair is judged months later, not on the day. The slow, boring, peen-and-wait method is the one that is still holding next year."
        },
        {
          id: 'materials-4',
          title: 'Mystery Metal and Dissimilar Joints',
          blurb: 'Identifying it, joining it, and knowing when to refuse',
          body: [
            "Sooner or later someone hands you a broken thing and no idea what it is made of. There is a sensible order for finding out.",
            "**Magnet.** Sticks: carbon steel, cast iron, or a ferritic/martensitic stainless. Doesn't stick: austenitic stainless (304/316), aluminium, brass, copper. That one test halves the field.",
            "**Weight and feel.** Aluminium is obviously light. Stainless feels dense and rings. Cast iron is dull and heavy and dead-sounding when tapped.",
            "**Spark test on a grinder** — genuinely useful with practice. Mild steel: long straight yellow-white streaks with a few forks. High carbon steel: shorter, bushy, lots of star-like bursts. Cast iron: short, dull red-orange, small bushy sparks. Stainless: short straight streaks, few forks. Aluminium: no sparks at all.",
            "**File test.** A file skating off means it is hard — tool steel, hardened, or white iron. A file biting easily means it is soft.",
            "**Dissimilar joints** are a real category with real answers. Stainless to carbon steel is the common one, and the filler is **309L** — it is designed to cope with the dilution from both sides. Aluminium to steel cannot be fusion welded conventionally at all: it forms brittle intermetallic compounds, so it needs bimetallic transition inserts, friction welding, or a mechanical joint. Copper and brass to steel is a brazing job, not a welding one. Galvanised to anything means grinding the coating back first.",
            "And then the professional part: **knowing when to refuse.** If the material cannot be identified, the joint is safety-critical, the alloy is a known non-weldable (2000/7000 aluminium, white iron), or the repair is holding up something that could hurt someone — the right answer is to say so. Recommending a specialist, a replacement part, or a procedure written by an engineer is not admitting defeat. It is exactly what separates a tradesperson from someone with a welder.",
            "Nobody has ever been sacked for saying 'I'd want a procedure for that'. Plenty of people have got into serious trouble for having a go."
          ],
          keyPoints: [
            'Magnet first: it halves the field in one test.',
            'Spark test: mild steel long and straight, high carbon bushy and star-burst, cast iron short and dull, aluminium none.',
            'A file skating off means hardened material — treat with caution.',
            'Stainless to carbon steel: 309L filler handles the dilution.',
            'Aluminium to steel cannot be conventionally fusion welded — brittle intermetallics form.',
            'Unidentifiable, safety-critical, or known non-weldable: say so and refer it on. That is professionalism, not weakness.'
          ],
          tip: "Keep labelled offcuts of known metals near the grinder. Comparing an unknown spark against a known one beside it is far more reliable than comparing it against your memory."
        }
      ],
      quiz: [
        {
          q: 'A stainless job goes rusty a month after welding. What is the overwhelmingly likely cause?',
          choices: [
            'The stainless was fake',
            'Cross contamination — a carbon steel brush or grinding disc embedded particles that rusted',
            'The welder used too many amps',
            'It was 316 instead of 304'
          ],
          correct: 1,
          explain: 'Cross contamination is the classic. Carbon steel particles from a shared brush, flap disc or bench get embedded in the surface and rust. Stainless needs its own brushes, discs and ideally its own bench area.'
        },
        {
          q: 'What is sugaring, and how do you prevent it?',
          choices: [
            'Spatter on the root — clean the nozzle',
            'The root oxidising into a grey crumbly surface with no corrosion resistance — prevented by back purging with argon',
            'Sugar-like crystals from flux — prevented by drying the rods',
            'Excess penetration — prevented by lowering the amps'
          ],
          correct: 1,
          explain: 'Without argon on the back of a stainless weld, the exposed hot root oxidises into a grey crumbly surface that has lost its corrosion resistance entirely. Pipe, tanks and anything hygienic gets back purged.'
        },
        {
          q: 'Which filler for welding 6061 aluminium extrusion?',
          choices: ['5356', '4043', 'ER70S-6', '309L'],
          correct: 1,
          explain: '4043 for 6000 series and extrusions — it flows well and is more crack-resistant on those alloys. 5356 is the choice for 5000-series marine plate and anything that will be anodised, where its colour match and strength win.'
        },
        {
          q: 'Cold welding a cracked grey cast iron machine base. What is the correct method?',
          choices: [
            'Long continuous runs with a steel electrode to build heat evenly',
            'Short ~25 mm nickel stringers, peened while hot, cooling to hand temperature between runs, with stop holes drilled at both ends of the crack',
            'Preheat to 900°C then quench in water',
            'MIG with ER70S-6 and no preparation'
          ],
          correct: 1,
          explain: 'Short nickel stringers, peened immediately while hot to spread the weld as it shrinks, with a wait between runs so the casting never heats up. Stop holes at both ends of the crack stop it running, and the oil must be cleaned out first.'
        },
        {
          q: 'Someone hands you a broken bracket and you cannot identify the metal, and it holds up a load above head height. Best answer?',
          choices: [
            'Weld it with E4818 — that covers most things',
            'Identify what you can, and if it is still unknown on a safety-critical job, say so and refer it to someone who can specify a procedure',
            'Braze it to be safe',
            'Weld it hot with plenty of preheat and hope'
          ],
          correct: 1,
          explain: 'Unidentified material plus a safety-critical load is exactly where a professional stops. Magnet, spark and file tests first — and if it is still unknown, saying so and referring it on is the trade answer, not a failure.'
        }
      ]
    },

    /* === 9. FIT-UP & THE TICKET ======================================= */
    {
      id: 'ticket',
      tier: 'mastery',
      title: 'Fit-up & the Ticket',
      subtitle: 'From good welds to paid work',
      icon: '🎓',
      colour: '#d4b33a',
      intro: "You can run a bead. This unit is about everything around the bead — the fit-up that decides whether it is even possible, the positional work that gets you hired, and what actually happens when you front up to be tested.",
      lessons: [
        {
          id: 'ticket-1',
          title: 'Fit-up Is Most of the Weld',
          blurb: 'Measure, mark, cut, prep — and why sloppy fit-up cannot be welded out',
          body: [
            "Experienced fabricators will tell you the weld is the last 20% of the job. They are not being modest; they are describing where the time goes and where the failures come from. A joint that fits cannot really be welded badly. A joint that does not fit cannot really be welded well.",
            "**Measuring and marking.** Work from one datum rather than measuring cumulatively from each previous mark, or the errors stack. Mark with a scriber or a fine soapstone, not a fat marker — a 3 mm pen line is a 3 mm error waiting to happen. Account for the **kerf**: the material the cut itself removes, which for a 1 mm cutting disc means marking and cutting on the waste side of the line.",
            "**Cutting.** Angle grinder with a thin disc for straight cuts in section. Bandsaw or drop saw where you have one — far squarer, far safer, far quieter. Plasma for plate and shapes, oxy for heavy sections. Whatever you use, deburr and square the cut face afterwards; a rough, angled cut face is a fit-up problem you will pay for.",
            "**Preparation.** Bevel where the thickness needs it (over about 5–6 mm), leave a **root gap** of typically 1.5–3 mm so the arc can reach the bottom, and leave a small flat **land** on the bottom edge of the bevel so the root does not simply burn away. Clean 25 mm either side of the joint, both sides.",
            "**Tacking.** Small, plenty, and check for square before you commit. A tack is a real weld — full penetration for its size, no slag left in it, feathered at the ends if it is going to be welded over. Big blobby tacks with slag in the middle are a defect you have designed into the joint.",
            "**Squareness and allowance for pull.** Check with a square after tacking, not after welding. Expect the joint to close and pull as it cools, and set it open or pre-set it tilted the other way. Experienced fabricators aim a job slightly wrong on purpose so it ends up right.",
            "The trade saying is worth remembering: **'You can't weld out a bad fit-up.'** Every attempt to bridge a gap with weld metal adds heat, distortion and defects, and the joint still ends up weaker than one that fitted in the first place."
          ],
          keyPoints: [
            'The weld is the last 20% of the job — fit-up is where quality is decided.',
            'Measure from one datum, mark fine, and allow for the kerf.',
            'Bevel above ~5–6 mm, root gap 1.5–3 mm, leave a small land, clean 25 mm each side.',
            'Tacks are real welds: small, plenty, no slag, feathered ends.',
            'Check square after tacking, and pre-set the job against the expected pull.',
            'You cannot weld out a bad fit-up.'
          ],
          tip: "If a joint has to be forced together with a clamp to close a gap, you have just built the residual stress into it before you even struck an arc. Fix the fit instead."
        },
        {
          id: 'ticket-2',
          title: 'Pipe and Positional Work',
          blurb: 'Where the money is, and how the root run works',
          body: [
            "Plate work in the flat position is where you learn. Pipe in a fixed position is where the trade gets paid. Pipe welders are in demand because a fixed pipe forces you through every position in a single weld, and because the root run has to be right when nobody can see the back of it.",
            "The positions on pipe: **1G** the pipe is rotated, so you always weld at the top — easy, and how you learn. **2G** the pipe is vertical and fixed, so you weld a horizontal band. **5G** the pipe is horizontal and fixed, so you weld around it, passing through overhead, vertical and flat in one run. **6G** the pipe is fixed at 45°, which combines all of it, and is the recognised benchmark: pass a 6G test and most other qualifications follow.",
            "The **root run** is the whole game. It has to fuse both edges and leave a smooth, correctly profiled bead on the inside where nobody can reach it. Get it wrong and you get lack of penetration, or an icicle of weld hanging inside the pipe, or a burnt-through window.",
            "That's why root preparation is so specific: a bevel of typically 30–37.5° per side, a **land** (root face) of around 1.6 mm, and a **root gap** of around 2.4–3.2 mm — sized to the electrode. Those numbers exist so the arc can reach the root and fuse both lands without falling through.",
            "The classic root technique with stick is a **keyhole**: you can literally see a small hole at the leading edge of the puddle where both lands have melted, and you carry it along, filling behind you as it goes. Keyhole too big and you're falling through; no keyhole and you're not penetrating. With TIG, the root is usually run with a purge behind it and filler dabbed into the gap.",
            "Then **hot pass, fill and cap**: the hot pass burns out any small root imperfections, the fill runs build the joint, and the cap finishes it slightly proud, evenly rippled, tied in at the toes with no undercut.",
            "**Walking the cup** is the pipe TIG welder's signature technique: resting the cup in the bevel and rocking it side to side to walk the torch along in a rhythm. It gives extraordinary consistency and it takes the shake out of a human hand entirely. It only works where there's a groove to rest in, which is why it's a pipe technique."
          ],
          keyPoints: [
            '1G rotated, 2G vertical fixed, 5G horizontal fixed, 6G fixed at 45° — 6G is the benchmark test.',
            'The root run decides the joint, and nobody can see the back of it.',
            'Typical prep: 30–37.5° bevel per side, ~1.6 mm land, ~2.4–3.2 mm root gap.',
            'Stick root technique: carry a keyhole at the leading edge — both lands melting, filling behind.',
            'Then hot pass, fill runs, and a cap that ties in at the toes with no undercut.',
            'Walking the cup gives pipe TIG its consistency, using the bevel as a guide.'
          ],
          tip: "If you want a trade that pays and travels, pipe is it. Get flat plate genuinely consistent first, then find someone with a pipe rig and start on 1G. Everything after that is the same skill in harder positions."
        },
        {
          id: 'ticket-3',
          title: 'What a Ticket Actually Is',
          blurb: 'WPS, qualification, and the day of the test',
          body: [
            "'Getting your ticket' means being qualified to weld to a particular procedure, in a particular process, material group, thickness range and position. It is not one certificate that covers everything, and understanding that is the first step.",
            "The paperwork, in plain English. A **WPS (Welding Procedure Specification)** is the recipe: process, consumable, material, joint prep, positions, current, voltage, travel speed, preheat, interpass. A **WPQR/PQR (procedure qualification record)** is the evidence that the recipe was tested and produces sound welds. A **welder qualification** (in Australia typically to **AS/NZS 1554** for structural steel, **AS 1796** for a range of certificates, or **ISO 9606** internationally) is the evidence that *you personally* can follow that recipe and produce a sound weld.",
            "So a qualification has a **range**. Pass a test on 10 mm plate in the 3G position with stick, and it qualifies you for a defined band of thicknesses and positions around that — not everything. Test in a harder position and you cover the easier ones: this is why people test in 6G on pipe or 4G overhead on plate, because the coverage is wider.",
            "**On the day**, the shape of it is consistent. You get a coupon prepared to the procedure, you weld it under supervision to that WPS, and it is then examined: visual inspection first, and then destructive testing — usually **bend tests** where strips cut from your weld are bent around a former to open the face and root, looking for cracks or lack of fusion — or radiography. Some tests also take a macro section, etched and examined for penetration and profile.",
            "**How people fail**, in order: lack of fusion or penetration in the root, undercut beyond the allowed limit, cracks, excessive porosity, and welding outside the parameters set in the procedure. Almost none of that is about a pretty cap. It is about fusion and following the recipe.",
            "**How to prepare**: get the actual WPS beforehand and weld to it, not to habit. Practise on the same material thickness, prep and position. Weld coupons and cut and bend them yourself at home — an angle grinder, a vice and a hammer will show you exactly what a tester will see. And go in rested; a test is a slow, deliberate weld, not a fast one.",
            "In Australia the practical path is usually TAFE — Certificate II or III in Engineering (MEM) pathways include welding units — plus a testing body for the specific qualification. That is what makes the knowledge in this app into something with a number on a certificate."
          ],
          keyPoints: [
            'WPS = the recipe. PQR = proof the recipe works. Welder qualification = proof you can follow it.',
            'A qualification covers a range of thickness and position — harder test positions cover more.',
            'Australian structural work: AS/NZS 1554; AS 1796 for a range of certificates; ISO 9606 internationally.',
            'Testing is visual then destructive — usually root and face bend tests, sometimes radiography or a macro.',
            'The common failures are root fusion, undercut, cracks and departing from the procedure.',
            'Practise to the actual WPS, and cut and bend your own coupons before test day.'
          ],
          tip: "Ring the testing body and ask exactly which procedure they'll test you to, then practise that one specific joint until it is boring. People fail tickets for welding a joint they never practised in the position it is actually tested in."
        },
        {
          id: 'ticket-4',
          title: 'Making a Living From It',
          blurb: 'Portfolio, tickets that pay, and where the work is',
          body: [
            "The trade is unusual in that it rewards demonstrable skill more than credentials, right up until the point where credentials become mandatory. Both matter, in that order.",
            "**Build a portfolio.** Photograph every weld you're proud of and a fair few you aren't. Cross-sections and bend test coupons are worth ten pretty cap photos, because they prove fusion rather than appearance. A folder on your phone with dates showing month one next to month twelve is genuinely persuasive to someone deciding whether to give you a go.",
            "**Tickets worth having**, roughly in order of what they open up: a basic structural qualification (AS/NZS 1554) covers most fabrication work. Pressure and pipe qualifications pay more and travel further. High-pressure pipe, stainless and duplex work — particularly in food, pharmaceutical, marine and mining — is where the specialist money is. Underwater and offshore is a different career again, requiring commercial dive qualifications as well.",
            "**The other tickets** that make you employable have nothing to do with welding: a construction induction card (the White Card in Australia), confined space entry, working at heights, EWP, first aid, a forklift ticket. On many sites these are the difference between being allowed on and not.",
            "**Where the work is** in Australia: structural fabrication in every city, mining and resources maintenance in WA and Queensland, marine and defence in SA and WA, agricultural repair everywhere rural, and pipeline work that moves around. Rural and regional work is often the friendliest entry point because the shops are small, the variety is huge, and they need people who will show up.",
            "**Being worth keeping**, which is honestly most of it: turn up on time, clean your own mess, sweep the shop, label your offcuts, tell someone straight away when you have stuffed something up, and never hide a bad weld. Every welder makes bad welds. The ones with careers are the ones who cut them out and do them again without being asked.",
            "And keep learning after the ticket. The people who plateau are the ones who decided they had arrived. The material in this app is a foundation — the next steps are inspection knowledge, procedure reading, other processes like FCAW and submerged arc, and eventually the qualifications on the inspection side if that interests you."
          ],
          keyPoints: [
            'Photograph everything, especially cross-sections and bend coupons — they prove fusion, not looks.',
            'Structural (AS/NZS 1554) opens fabrication; pressure and pipe pay more and travel.',
            'Non-welding tickets matter too: White Card, confined space, heights, first aid.',
            'Regional and rural shops are often the friendliest entry point, with the widest variety.',
            'Never hide a bad weld. Cut it out and redo it before you are asked — that is what gets you kept.'
          ],
          tip: "Nobody good expects a beginner to be fast. They expect you to be honest about what you can and can't do yet. Say 'I haven't done that, show me once' and you'll be trusted far more than the person who guesses."
        }
      ],
      quiz: [
        {
          q: 'What does the trade saying "you can\'t weld out a bad fit-up" mean in practice?',
          choices: [
            'Bad fit-up just takes longer to weld',
            'Bridging a poor fit with weld metal adds heat, distortion and defects, and still leaves a weaker joint than a proper fit would',
            'Fit-up only matters on pipe',
            'A bad fit-up should always be forced together with clamps'
          ],
          correct: 1,
          explain: 'Filling a bad gap with weld metal means more heat, more distortion and more chance of defects — and the joint still ends up weaker than one that fitted. Forcing it together with clamps just builds residual stress in before you start.'
        },
        {
          q: 'Which pipe test position is the recognised benchmark, and why?',
          choices: [
            '1G, because the pipe rotates',
            '2G, because it is a horizontal band',
            '6G, because the pipe is fixed at 45° and forces every position in one weld',
            '5G, because it is the most common in the field'
          ],
          correct: 2,
          explain: '6G is pipe fixed at 45°, so a single weld passes through overhead, vertical and flat with constantly changing torch angles. Pass 6G and most other qualifications follow from its coverage.'
        },
        {
          q: 'What is a WPS?',
          choices: [
            'The certificate proving you are a qualified welder',
            'The recipe: process, consumable, prep, position, current, preheat and so on',
            'A record of the destructive tests carried out',
            'The Australian standard for structural steel'
          ],
          correct: 1,
          explain: 'The Welding Procedure Specification is the recipe. The PQR is the evidence the recipe produces sound welds, and your welder qualification is evidence that you personally can follow it.'
        },
        {
          q: 'How are welder qualification test coupons usually examined?',
          choices: [
            'Visually only',
            'Visual inspection, then destructive testing — typically root and face bend tests, sometimes radiography or a macro section',
            'By weighing the deposited metal',
            'By the welder signing a declaration'
          ],
          correct: 1,
          explain: 'Visual first, then destructive: strips are cut from the weld and bent around a former to open the face and root, looking for cracks and lack of fusion. Some tests use radiography or an etched macro section instead or as well.'
        },
        {
          q: 'You have made a weld you know is not right, and nobody has seen it. What does a professional do?',
          choices: [
            'Grind the cap flat so it looks tidy and move on',
            'Say so, cut it out and do it again',
            'Leave it — if it passes visual inspection it is fine',
            'Weld over the top of it to strengthen it'
          ],
          correct: 1,
          explain: 'Every welder makes bad welds. The ones with careers cut them out and redo them without being asked, and say so. Hiding a weld you know is bad is the fastest way to lose the trust that the job runs on.'
        }
      ]
    }
  ];

  /* --- merge into the course ------------------------------------------- */
  MASTERY.forEach(function (m) { window.WA_CONTENT.modules.push(m); });

  /* --- bench drills and recall cards for the mastery units --------------- */
  var MASTERY_PRACTICE = {
    'metal-1': {
      practice: {
        task: 'Etch a weld and see the three zones with your own eyes',
        why: 'You have been told the HAZ exists. Seeing it appear on a polished face turns it from a fact into something you believe.',
        kit: ['A finished practice weld', 'Angle grinder, flap disc, wet-and-dry paper', 'Vinegar or dilute acid, cotton bud'],
        steps: [
          'Cut through a practice weld across the joint.',
          'Grind the cut face flat, then work through progressively finer paper until it is close to a mirror.',
          'Swab the face with vinegar or dilute acid for a minute, then rinse and dry.',
          'Look at it in good light: the weld metal, a band around it that etched differently, and the parent metal beyond.',
          'Measure how wide the heat affected band is.',
          'Photograph it into the log with your settings noted.'
        ],
        pass: [
          'Three distinct regions visible on the etched face',
          'You can measure the HAZ width',
          'You can say whether your heat input was high or low from how wide it is'
        ]
      },
      recall: [
        { q: 'What are the three zones of a weld?', a: 'Weld metal (melted and re-solidified), the heat affected zone (changed but never melted) and unaffected parent metal.' },
        { q: 'How do you calculate heat input?', a: 'Amps × volts ÷ travel speed. It is the main thing you control that decides how fast the HAZ cools.' }
      ]
    },
    'metal-2': {
      practice: {
        task: 'Build a spark test reference set',
        why: 'Identifying steel by eye is a genuinely useful trade skill, and it takes one afternoon to get usable at it.',
        kit: ['Offcuts of known metals: mild steel, high carbon (an old file or spring), stainless, cast iron', 'Bench grinder', 'Full face and eye protection'],
        steps: [
          'Label each known offcut with a paint pen.',
          'In a darkened area of the shed, spark each one in turn against the grinder and watch the stream carefully.',
          'Note for each: length of streak, colour, and how much it forks or bursts.',
          'Film each one in slow motion on your phone if it has it — this is where slow motion is genuinely useful.',
          'Now have someone hand you the offcuts in random order and identify them by spark alone.',
          'Keep the labelled set hanging by the grinder.'
        ],
        pass: [
          'You correctly identified at least three of four blind',
          'You can describe the difference between mild and high carbon sparks',
          'The reference set lives by the grinder'
        ]
      },
      recall: [
        { q: 'What does carbon equivalent tell you, and what is the threshold?', a: 'How readily the steel hardens and cracks. Below ~0.40 weld normally, 0.40–0.45 consider preheat, above 0.45 preheat plus low-hydrogen is required.' },
        { q: 'Name three common crack-prone steels.', a: '4140 chrome-moly, spring steel, high-tensile bolts and tool steel — all high carbon or alloyed, all need preheat and care.' }
      ]
    },
    'metal-3': {
      practice: {
        task: 'Preheat a thick section properly and measure it',
        why: 'Almost everyone who "preheats" heats one small patch with a torch and starts welding. Doing it properly once shows you the difference.',
        kit: ['Thick scrap, 20 mm+', 'Oxy torch or propane weed burner', 'Temperature sticks (or an IR thermometer)', 'Welding blanket, dry sand or lime'],
        steps: [
          'Mark the plate with a 100°C temperature stick about 75 mm back from where you will weld.',
          'Heat a wide area around the joint, moving constantly, both sides if you can reach.',
          'Keep going until the temperature stick mark melts — note how much longer that takes than you expected.',
          'Check the far side too. If it is cold, the heat has not soaked through and you are not preheated.',
          'Weld the joint, keeping the temperature up between runs.',
          'Cover the finished job with a blanket or bury it in dry sand and let it cool slowly.'
        ],
        pass: [
          'Temperature verified with a stick or meter, not guessed',
          'Both sides of the section warm, not just the surface you heated',
          'The job cooled slowly under cover rather than on a cold floor'
        ]
      },
      recall: [
        { q: 'What does preheat actually do?', a: 'Slows cooling — hydrogen escapes instead of being trapped, the HAZ does not quench hard, and residual stress is reduced.' },
        { q: 'How do you measure preheat properly?', a: 'Temperature-indicating sticks or an IR thermometer, about 75 mm back from the joint — and check the far side of thick sections.' }
      ]
    },
    'metal-4': {
      practice: {
        task: 'Watch residual stress release itself',
        why: 'This is one of those things you can be told a hundred times and not believe until a piece of steel moves on the bench in front of you.',
        kit: ['A long flat bar, 6 mm+, 400 mm or so', 'Clamps', 'A straight edge'],
        steps: [
          'Check the bar is straight against a straight edge and mark it.',
          'Run a single long bead down one side only, along its length.',
          'Let it cool completely without clamping.',
          'Check it against the straight edge again and measure the bow.',
          'Now do a second bar, but weld it in short backstepped segments and clamp it to something heavy while cooling.',
          'Measure that one too, and photograph both together.'
        ],
        pass: [
          'The first bar visibly bowed toward the weld side',
          'The second bar bowed measurably less',
          'You can explain both results in terms of shrinkage and restraint'
        ]
      },
      recall: [
        { q: 'What is residual stress?', a: 'The weld shrank while restrained, so it sits in tension with the surrounding metal in compression — often near yield strength.' },
        { q: 'Where do fatigue cracks start?', a: 'At stress raisers: sharp weld toes, undercut, arc strikes and unfilled craters.' }
      ]
    },

    'materials-1': {
      practice: {
        task: 'Set up a stainless-only corner, then weld and passivate',
        why: 'Separation of tools is the whole game with stainless, and setting it up once is what stops a habit forming.',
        kit: ['Stainless offcuts', 'A new stainless wire brush and flap disc, marked for stainless only', 'Paint pen', 'Pickling paste if available'],
        steps: [
          'Mark a brush and a flap disc clearly "STAINLESS ONLY" and give them a separate home.',
          'Clean a stainless offcut with the new brush and acetone.',
          'Weld two beads: one at your normal steel settings, one noticeably cooler and faster.',
          'Compare the heat tint and the distortion between them.',
          'Deliberately brush a third offcut with a carbon steel brush, weld it, and leave all three outside for a few weeks.',
          'Come back and see which ones have rust spots.'
        ],
        pass: [
          'Stainless-only tools set up and stored separately',
          'The cooler, faster bead shows less tint and less distortion',
          'The contaminated sample rusts and the clean ones do not'
        ]
      },
      recall: [
        { q: 'Why use L grades (304L/316L) for welded work?', a: 'Low carbon resists sensitisation — chromium carbides forming at grain boundaries between 450–850°C, which destroys corrosion resistance beside the weld.' },
        { q: 'What is back purging for?', a: 'Argon on the underside stops the root oxidising into grey crumbly "sugaring", which has no corrosion resistance left.' }
      ]
    },
    'materials-2': {
      practice: {
        task: 'Clean aluminium properly and prove why it matters',
        why: 'Aluminium cleaning feels excessive until you weld a dirty one next to a clean one.',
        kit: ['Aluminium scrap, 3 mm+', 'Acetone and clean rag', 'Stainless brush marked ALUMINIUM ONLY', 'AC TIG or a spool gun'],
        steps: [
          'Take two pieces. On the first: degrease with acetone, THEN brush the oxide off, then weld immediately.',
          'On the second: weld it as it came, no cleaning.',
          'Compare: soot, porosity, how hard the puddle was to start and control.',
          'Now clean a third piece properly, then leave it an hour before welding it. Compare again — the oxide has already begun regrowing.',
          'Photograph all three into the log.'
        ],
        pass: [
          'Obvious difference between the cleaned and uncleaned welds',
          'You degreased BEFORE brushing, not after',
          'You can explain why the hour-old cleaned piece welded worse than the fresh one'
        ]
      },
      recall: [
        { q: '4043 or 5356 — which and when?', a: '4043 for 6000-series extrusions (flows well, crack resistant there). 5356 for 5000-series marine plate and anything to be anodised.' },
        { q: 'What order do you clean aluminium in?', a: 'Degrease with acetone first, THEN brush the oxide off with an aluminium-only stainless brush — and weld immediately, because oxide regrows in minutes.' }
      ]
    },
    'materials-3': {
      practice: {
        task: 'Repair a cast iron offcut using the cold method',
        why: 'Cast iron repair is the one job where patience is a technical requirement rather than a virtue.',
        kit: ['Scrap cast iron (an old vice jaw, a broken bracket)', 'Nickel electrodes (Ni99 or Ni55)', 'Drill and small bit', 'Light ball-pein hammer', 'Angle grinder'],
        steps: [
          'Find both ends of the crack — use a magnifier if you must — and drill a small stop hole at each.',
          'Grind a V along the crack, and get the oil out: heat gently and let it burn off, then clean.',
          'Weld a single stringer no more than 25 mm long at low amps.',
          'Immediately peen that bead all over with light rapid taps while it is still hot.',
          'Wait until you can comfortably rest your hand on the casting before the next run. Actually wait.',
          'Repeat until the joint is filled, alternating along the crack rather than working end to end.'
        ],
        pass: [
          'Stop holes drilled at both ends before any welding',
          'Every bead 25 mm or less, peened while hot',
          'You waited for hand temperature between runs, every single time',
          'No new cracks beside your beads'
        ]
      },
      recall: [
        { q: 'Which electrodes for cast iron, and why not steel?', a: 'Nickel — Ni99 for machinability, Ni55 for strength. Steel rods pick up carbon from the parent metal and come out glass-hard and cracked.' },
        { q: 'What are the two cast iron methods?', a: 'Cold: short peened stringers with cooling between. Hot: preheat the whole casting to 500–600°C and cool it over hours under lime or sand.' }
      ]
    },
    'materials-4': {
      practice: {
        task: 'Identify five unknown metals blind',
        why: 'This is a real trade skill you will use constantly, and the only way to get it is a session of deliberate practice.',
        kit: ['A magnet', 'A file', 'Bench grinder', 'Five unlabelled offcuts someone else selected', 'Your labelled reference set'],
        steps: [
          'For each piece in turn: magnet first, and write down what that rules in or out.',
          'Heft it and tap it — note the weight and the ring.',
          'File a corner — does the file bite or skate?',
          'Spark it against the grinder and compare against your labelled reference pieces side by side.',
          'Commit to an identification in writing before checking.',
          'Have whoever selected them tell you what they actually were.'
        ],
        pass: [
          'Three or more of five correctly identified',
          'You used the tests in a deliberate order rather than guessing',
          'For any you got wrong, you can say which test misled you'
        ]
      },
      recall: [
        { q: 'Filler for stainless to carbon steel?', a: '309L — it is formulated to cope with the dilution from both sides of a dissimilar joint.' },
        { q: 'When is the right answer to refuse a job?', a: 'Unidentifiable material on a safety-critical joint, known non-weldables (2000/7000 aluminium, white iron), or anything needing a procedure you do not have.' }
      ]
    },

    'ticket-1': {
      practice: {
        task: 'Build the same frame twice — once rushed, once fitted',
        why: 'Nothing argues for fit-up like two frames sitting side by side on the bench.',
        kit: ['Eight lengths of scrap section', 'Square, clamps, scriber', 'Grinder or saw'],
        steps: [
          'Frame one: measure with a marker, cut freehand, tack it quickly, weld it.',
          'Frame two: measure from a single datum with a scriber, allow for the kerf, square every cut face, deburr, tack small and often, check square before welding.',
          'Weld frame two with a balanced, backstepped sequence.',
          'Check both with a square at all four corners and on a flat surface.',
          'Time both jobs, including the fixing-up at the end.'
        ],
        pass: [
          'Frame two is square and sits flat',
          'You can state the total time for each, including rework',
          'You can point at the specific step that made the difference'
        ]
      },
      recall: [
        { q: 'Typical butt joint prep above 5–6 mm?', a: 'Bevel the edges, root gap 1.5–3 mm, leave a small land, and clean 25 mm either side.' },
        { q: 'What makes a good tack?', a: 'Small, plenty of them, fully fused for their size, no slag left in, and feathered at the ends if they will be welded over.' }
      ]
    },
    'ticket-2': {
      practice: {
        task: 'Run a root pass on an open butt and inspect the back',
        why: 'The root is the part nobody can see, which is exactly why testing bodies look at it first.',
        kit: ['Two pieces of 6 mm plate', 'Grinder to bevel', 'Feeler or drill bit for gap spacing', 'Your process of choice'],
        steps: [
          'Bevel both edges at about 30°, leaving a small land of around 1.6 mm.',
          'Set a root gap of about 2.4–3 mm — use a drill bit of that diameter as a spacer.',
          'Tack at both ends and check the gap has not closed.',
          'Run the root pass. With stick, look for a keyhole at the leading edge and carry it along.',
          'Turn the coupon over and inspect the back: you want a consistent, slightly proud root bead — not a gap, not icicles.',
          'Cut it in half, look at the cross-section, and photograph both into the log.'
        ],
        pass: [
          'Consistent root penetration along the full length on the back',
          'No burn-through windows and no hanging icicles',
          'The cross-section shows fusion into both lands'
        ]
      },
      recall: [
        { q: 'What is a keyhole and why do you carry one?', a: 'A small hole at the leading edge of the puddle where both root lands have melted — proof of penetration, filled in behind as you travel.' },
        { q: 'Why is 6G the benchmark?', a: 'Pipe fixed at 45° forces overhead, vertical and flat positions with constantly changing angles in one weld, so it qualifies the widest range.' }
      ]
    },
    'ticket-3': {
      practice: {
        task: 'Run your own bend test, the way a tester would',
        why: 'You can fail yourself at home for the price of an angle grinder, which is a very cheap way to pass in public.',
        kit: ['A butt weld coupon in 6 mm plate', 'Angle grinder', 'Vice, heavy hammer, or a press if you have one', 'A round former about 25 mm'],
        steps: [
          'Weld a butt joint coupon with full penetration, both sides prepared properly.',
          'Cut two strips across the weld, about 25–30 mm wide.',
          'Grind the cap and root flush on both strips — flush, not dished.',
          'Bend the first strip with the FACE of the weld on the outside, around the former, until it is close to a U.',
          'Bend the second with the ROOT on the outside.',
          'Examine the stretched surface closely for opened cracks or unfused lines. Anything much over 3 mm long would typically fail.'
        ],
        pass: [
          'Both strips bent without opening a crack',
          'No unfused line visible along the root on the root bend',
          'You have photographed both and know which weld settings produced them'
        ]
      },
      recall: [
        { q: 'WPS, PQR, welder qualification — which is which?', a: 'WPS is the recipe, PQR is proof the recipe makes sound welds, welder qualification is proof you personally can follow it.' },
        { q: 'What are the most common reasons people fail a ticket?', a: 'Root fusion or penetration, undercut beyond limits, cracks, excess porosity, and welding outside the procedure parameters.' }
      ]
    },
    'ticket-4': {
      practice: {
        task: 'Assemble a portfolio worth showing someone',
        why: 'When you ask someone for a start, the difference between "I have been practising" and a phone full of dated, cut-open evidence is the whole conversation.',
        kit: ['Your weld log', 'Your best and worst coupons', 'A phone'],
        steps: [
          'Go through the log and pick your ten best pieces of evidence — prioritise cross-sections and bend coupons over pretty caps.',
          'For each, note the process, material, thickness, position and settings.',
          'Include at least two "before and after" pairs showing a fault you diagnosed and then fixed.',
          'Put the earliest weld you still have next to your most recent one and photograph them together.',
          'Write three sentences you could actually say out loud about what you can and cannot do yet.',
          'Show it to someone who welds and ask them what they would want to see more of.'
        ],
        pass: [
          'Ten pieces of dated evidence with settings recorded',
          'At least two cross-sections or bend coupons in there',
          'You can honestly describe your current limits without either overselling or apologising'
        ]
      },
      recall: [
        { q: 'What evidence is worth more than a photo of a tidy cap?', a: 'A cross-section or a bend coupon — they prove fusion, and appearance does not.' },
        { q: 'What gets a beginner kept on?', a: 'Turning up, cleaning up, and never hiding a bad weld — cutting it out and redoing it before being asked.' }
      ]
    }
  };

  Object.keys(MASTERY_PRACTICE).forEach(function (k) {
    window.WA_PRACTICE[k] = MASTERY_PRACTICE[k];
  });
})();

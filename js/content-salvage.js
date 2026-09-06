/* ============================================================================
 * WELD ACADEMY — UNIT 10: BASIC ELECTRICS & SALVAGE  (core)
 *                UNIT 11: THE METAL TRADE            (advanced, optional)
 * ----------------------------------------------------------------------------
 * Unit 10 is the practical stuff a hands-on scrapper actually reaches for:
 * soldering that holds, a multimeter that stops being frightening, reading
 * what is inside a thing before you spend an hour on it, and an honest look at
 * the economics of what she does now.
 *
 * It sits in the main path because it is the nearest rung on the ladder she is
 * already climbing. Unit 11 — grading, merchanting, going bigger — is real and
 * useful but is explicitly ADVANCED and OPTIONAL, reached from its own tile
 * rather than pushed at her. Leading with merchant jargon at someone who makes
 * her money on cans reads as a lecture, and she would close it.
 *
 * The cans arithmetic appears once, here, and everything else refers back to it.
 * ==========================================================================*/

(function () {
  'use strict';

  var UNITS = [

    /* === 10. BASIC ELECTRICS & SALVAGE (core) ========================== */
    {
      id: 'salvage',
      tier: 'core',
      title: 'Electrics & Salvage',
      subtitle: 'Soldering, testing, and what is actually inside things',
      icon: '🔌',
      colour: '#3fa7a0',
      intro: "Welding joins steel. This unit is everything next to that: making a joint in wire that holds, finding out what has actually died before you spend an hour on it, and knowing which lumps of scrap are worth your time. It is the same skill as welding, honestly — heat, clean metal, and knowing what you are looking at.",
      lessons: [
        {
          id: 'salvage-1',
          title: 'Soldering That Holds',
          blurb: 'Heat the joint, not the solder',
          body: [
            "Almost everyone starts by melting solder onto the iron and dabbing it at the wire. That gives you a **cold joint**: solder sitting on top of the metal like candle wax, looking connected and failing the first time something moves. It is the exact same fault as a weld that sits on top without fusing.",
            "The rule is that **the joint heats the solder, not the iron**. Iron on the joint, count two, then feed the solder into where the iron meets the metal. It should pull in and wet out, bright and slightly concave. If it sat in a ball, the joint was cold.",
            "A tip that has gone dull grey has oxidised and will not transfer heat. **Tinning** — a coat of solder kept on the tip — is what carries heat across, so wipe it and re-tin it every few joints. Most of what people blame on a cheap iron is a filthy tip.",
            "**Flux** cleans the oxide off the metal as it heats so the solder can actually bond. Electrical solder has a flux core, which covers most jobs; older or dirtier work wants extra. Never use plumbing acid flux on electronics — it keeps eating the joint afterwards.",
            "Temperature: about **340–370 °C** for general electrical work. Too cold and you stand there heating the whole cable until the insulation shrinks back; too hot and you burn the flux off before it can work and lift pads off a board.",
            "Then insulate. **Heat-shrink** slid on before you join, and shrunk after, beats tape every time — tape unwinds in heat and turns to glue. And where the joint will be pulled or vibrated, solder alone is not the answer: a proper crimp is stronger, and a crimp plus solder is often worse than either, because the solder wicks up the wire and makes a hard spot that snaps."
          ],
          keyPoints: [
            'Heat the joint and feed solder into it. Solder melted on the iron makes a cold joint.',
            'Keep the tip tinned and wiped — a dull tip transfers no heat.',
            'Flux cleans the metal so solder can bond. Never acid flux on electronics.',
            'About 340–370 °C for general work.',
            'Heat-shrink on before you join. Tape is a temporary answer that becomes permanent.',
            'For anything that gets pulled or shaken, crimp it — do not rely on solder.'
          ],
          tip: 'A good joint is shiny and slightly hollow between the wires. A dull, blobby, convex one is cold — reheat it and let it flow properly.'
        },
        {
          id: 'salvage-2',
          title: 'A Multimeter Is Not Scary',
          blurb: 'Three settings that answer nearly everything',
          body: [
            "A multimeter has a dial with a dozen symbols on it and you need three of them. That is genuinely it.",
            "**Continuity** (the sound-wave symbol) asks: are these two points connected? Touch the probes together — it beeps. Now put them either end of a fuse, a switch, a length of cable, a heating element. Beep means a path. Silence means broken. This one setting finds most faults in most dead appliances, and it is the one to reach for first.",
            "**DC volts** (V with a straight line) measures batteries and vehicle electrics. Black probe on the negative, red on the positive. A car battery should sit about **12.6 V** at rest and **13.8–14.4 V** with the engine running — if it does not climb when running, the alternator is not charging, and now you know before you buy a battery.",
            "**Resistance** (Ω) is continuity with a number attached, and it is how you tell a good winding from a dead one. A heating element reads a sensible few tens of ohms; an open one reads infinite. A motor winding reads low but not zero — a true zero usually means a short.",
            "Two things that keep beginners safe and their meters alive. **Never put the probes across mains while the meter is on a current or resistance setting** — that is a dead short through the meter, and the bang is memorable. And **test with the power off** for continuity and resistance: those settings send their own tiny current, so anything else feeding in gives you nonsense.",
            "Then the habit that pays: **test before you strip**. Two minutes with a meter tells you whether the motor in front of you is a working motor worth selling or a dead one worth its copper. Those are very different numbers, and people throw away the first kind constantly."
          ],
          keyPoints: [
            'Continuity for "is it connected" — finds most faults in most dead things.',
            'DC volts for batteries: 12.6 V resting, 13.8–14.4 V running or the alternator is not charging.',
            'Resistance to tell a live winding from a dead one. Infinite is broken, zero is shorted.',
            'Never probe mains on a current or resistance setting.',
            'Power off for continuity and resistance.',
            'Test before you strip: a working motor is worth far more than its copper.'
          ],
          tip: 'Beep out a suspect extension lead end to end before you throw it. Nine times in ten it is one plug pin, which is five minutes and a new plug.'
        },
        {
          id: 'salvage-3',
          title: 'Reading What Is Inside',
          blurb: 'Which lumps are worth your hour, and how to tell',
          body: [
            "Every piece of scrap is a question: what is inside, and does it cost me more time to get it out than it is worth? You get quick at this, and it is mostly a handful of rules.",
            "**Weight for size is the first tell.** Copper is nearly three times as dense as aluminium. Two radiators the same size, one twice the weight — the heavy one is copper and brass and worth several times the other. Pick things up before you decide.",
            "**A magnet sorts the world in half.** Steel sticks, and steel is cheap. Copper, brass, aluminium, lead and most stainless do not stick — that is where the money is. (300-series stainless is non-magnetic and worth having; the cheap 400-series magnetic stuff is barely worth the trip.)",
            "**Anything that hums has windings.** Motors, transformers, alternators, compressors — they all work by pushing current through a coil, and that coil is copper. Roughly, the bigger and heavier the thing, the higher the proportion of copper. Watch for aluminium windings, which look identical until you scratch one.",
            "**A scratch tells the truth.** Paint, plating and corrosion all lie about what is underneath. A file or a knife on a hidden corner shows you: rose-pink is copper, yellow is brass, white-grey is aluminium, silver-grey and heavy is lead.",
            "And the thing that catches everyone out: **clean beats mixed, every time.** A yard pays a lower grade for copper with steel screws in it, or brass mixed through it, because they have to sort it. Two minutes with snips separating fittings is often worth more per minute than the hour you spent pulling the thing apart in the first place.",
            "The teardown page in the Field Kit has the common items already worked out — what is inside, how long it takes, and whether to strip it, sell it whole, or leave it alone."
          ],
          keyPoints: [
            'Heavy for its size means copper or lead. Light means aluminium.',
            'Magnet sticks = steel = cheap. No stick = where the money is.',
            'If it hums it has windings, and windings are usually copper.',
            'Scratch it: rose-pink copper, yellow brass, white-grey aluminium.',
            'Clean grades beat mixed. Sorting often pays better per minute than stripping.',
            'Aluminium windings look exactly like copper ones until you scratch them.'
          ],
          tip: 'Keep four buckets going: clean copper, brass, aluminium, and steel. Sorting as you go costs nothing. Sorting a mixed heap later costs an afternoon.'
        },
        {
          id: 'salvage-4',
          title: 'The Cans, Honestly',
          blurb: 'What the containers actually pay, and what the ceiling is',
          body: [
            "This one is worth being straight about, because the numbers are not what most people assume.",
            "**The refund is the business, not the aluminium.** An empty aluminium can weighs roughly 15 grams, so it takes about **65 to 70 cans to make a kilogram**. At a 10 cent container deposit, that same kilo of cans is worth about **$6.50 to $7.00 in refunds**. Scrap aluminium is worth somewhere around $1 to $2 a kilo. The refund is worth three to six times the metal.",
            "Which means: **never crush deposit cans flat and never sell them as scrap aluminium.** Most container refund schemes need the can whole enough to be identified, and you are throwing away most of the value the moment you treat them as metal.",
            "It also means the collecting is the work, not the metal. Every state that runs a scheme pays the same 10 cents whether you hand in ten cans or ten thousand, so the money is entirely a function of how many you can find, gather and cart — which is exactly why it is hard to scale. Your income is capped by hours and boot space, not by price.",
            "Compare it honestly against what is in the rest of this unit. A kilo of clean copper out of one alternator is worth roughly what **two hundred cans** are — and it fits in a jacket pocket. A copper hot water cylinder off a demolition is fifteen to thirty kilos of copper: several thousand cans, in one lift.",
            "None of this is a reason to stop. The cans are steady, they are legal, they need nothing but effort, and they pay the same every week — that is genuinely valuable and most side income is not like that. But it is a floor, not a ceiling. The skills in this unit and the next are how the same hours start paying multiples.",
            "Check your own state's scheme for what is eligible and what is not — the rate is standard but the container rules differ, and it changes."
          ],
          keyPoints: [
            'About 65–70 empty cans to the kilo.',
            'A kilo of cans is roughly $6.50–7.00 in refunds versus $1–2 as scrap aluminium.',
            'Never crush or scrap deposit containers — the refund is worth three to six times the metal.',
            'The refund is a fixed rate, so income scales only with hours and boot space.',
            'A kilo of clean copper is worth about two hundred cans, and fits in a pocket.',
            'It is a solid floor. The point is that it does not have to be the ceiling.'
          ],
          tip: 'Keep the deposit containers and the scrap aluminium in separate bags from the moment you pick them up. Mixed, you end up selling refundables for metal prices.'
        }
      ],
      quiz: [
        {
          q: 'Your solder sits in a dull ball on top of the wire instead of flowing in. What went wrong?',
          choices: ['Too much flux', 'The joint was not hot enough — a cold joint', 'The solder is too thin', 'You used too much solder'],
          correct: 1,
          explain: 'Classic cold joint: the solder melted off the iron rather than being drawn into a hot joint. Heat the joint itself and feed the solder into where the iron meets the metal.'
        },
        {
          q: 'You want to know whether a heating element is dead. Which setting?',
          choices: ['DC volts', 'AC volts', 'Continuity or resistance, with the power off', 'Current'],
          correct: 2,
          explain: 'Continuity beeps if there is a path; resistance puts a number on it. Both must be done with the power off, since they send their own small current.'
        },
        {
          q: 'A car battery reads 12.6 V at rest and still 12.6 V with the engine running. What does that tell you?',
          choices: ['The battery is flat', 'The alternator is not charging', 'That is normal', 'The starter motor is failing'],
          correct: 1,
          explain: 'Running, it should climb to about 13.8–14.4 V as the alternator charges. No climb means the charging system, not the battery — which is the cheaper thing to find out first.'
        },
        {
          q: 'Two radiators the same size, one twice the weight of the other. What is the heavy one likely to be?',
          choices: ['Aluminium', 'Copper and brass', 'Stainless', 'Plastic and steel'],
          correct: 1,
          explain: 'Copper is nearly three times as dense as aluminium. Heavy for its size means copper and brass, and several times the money.'
        },
        {
          q: 'Roughly how many empty aluminium cans make a kilogram?',
          choices: ['About 20', 'About 65–70', 'About 200', 'About 500'],
          correct: 1,
          explain: 'A can is roughly 15 g, so about 65–70 to the kilo. At a 10c deposit that is $6.50–7.00 a kilo in refunds, against maybe $1–2 as scrap metal — which is why deposit containers should never be sold as aluminium.'
        }
      ]
    },

    /* === 11. THE METAL TRADE (advanced, optional) ====================== */
    {
      id: 'merchant',
      tier: 'advanced',
      title: 'The Metal Trade',
      subtitle: 'Grades, margins and going bigger — when you are ready',
      icon: '💰',
      colour: '#c8a13f',
      intro: "This one is optional and it is not the point of the app. It is here for the day you look at a load and think there has to be more in this than the yard is offering — because there is, and this is how that works. Nothing in here is needed for the welding.",
      lessons: [
        {
          id: 'merchant-1',
          title: 'Grades Are the Whole Game',
          blurb: 'Why the same metal pays three different prices',
          body: [
            "A yard does not buy 'copper'. It buys **grades**, and the difference between the top and bottom grade of the same metal is often 30 to 40 per cent.",
            "Bare bright copper wire — clean, unalloyed, no coating, nothing attached — is the top of the tree. Below that comes **#1 copper** (clean tube and heavy wire, no solder or fittings), then **#2** (with some solder, paint or thin gauge), then insulated wire graded by how much copper is actually in it.",
            "Every grade below the top exists because of something the yard now has to do: strip insulation, cut off brass fittings, deal with solder, sort out steel. **The discount is the cost of that work plus their margin.** When you do that work first, you are buying the discount back.",
            "Which gives the only rule that really matters: **sort before you sell, and never let a grade be dragged down by contamination.** One brass fitting left on a bundle of clean copper tube can drop the whole bundle a grade. Two minutes with a saw is often the best-paid two minutes of the day.",
            "Ask your yard for their grade sheet. Every one of them has it, most will hand it over, and it tells you exactly what they will pay for what — which is the information the whole trade runs on."
          ],
          keyPoints: [
            'Yards buy grades, not metals. Top to bottom can be a 30–40% spread.',
            'Bare bright > #1 > #2 > insulated, by how much work is left in it.',
            'The discount is their sorting cost plus margin. Do the work, keep the difference.',
            'One contaminant can downgrade a whole bundle.',
            'Ask for the grade sheet. It is the price list the trade runs on.'
          ],
          tip: 'Weigh and photograph a load before you take it in, for a few loads. You will quickly see which yard is grading you honestly.'
        },
        {
          id: 'merchant-2',
          title: 'Spot, Scrap and the Gap Between',
          blurb: 'What the world price has to do with your cheque',
          body: [
            "The prices on the metals page are **spot** — the world market price for refined metal, set on exchanges and quoted in US dollars. Your scrap is not refined metal, so you never get spot. But spot is what everything downstream is priced off, so it still tells you plenty.",
            "The chain runs: you → the local yard → a larger processor → a smelter or an exporter. Each one takes a margin for sorting, carting and carrying the risk. A small yard might pay **50 to 75 per cent of spot** for good clean copper; less for messy grades, more if you turn up with a tonne of one clean thing.",
            "**Two things move your number more than the market does.** Volume, because carting a full load costs the yard the same as carting a quarter load. And consistency, because a yard that knows your copper is always clean will pay you without re-sorting it.",
            "The exchange rate matters more than people expect. Spot is in US dollars, so when the Australian dollar falls, Australian scrap prices rise even if the world price has not moved at all. That is why the metals page shows the conversion rather than hiding it.",
            "Track the ratio, not the price. If you are consistently getting 60 per cent of spot and it drops to 45, that is not the market — that is your yard, or your sorting."
          ],
          keyPoints: [
            'Spot is refined metal on a world exchange. Scrap is priced off it, never at it.',
            'A yard might pay 50–75% of spot for clean copper; less for mixed.',
            'Volume and consistency move your price more than the market does.',
            'Spot is in USD, so a falling Australian dollar lifts local prices on its own.',
            'Watch your ratio to spot over time — that is the number that exposes a bad yard.'
          ],
          tip: 'The tally in the Field Kit records what you were paid against what it was worth. After a few loads that ratio tells you more than any price chart.'
        },
        {
          id: 'merchant-3',
          title: 'Earnings Are Not Profit',
          blurb: 'What a load actually left you, once everything is counted',
          body: [
            "A four hundred dollar load is not four hundred dollars. This is the lesson that decides whether any of this is worth doing, and it is the one nobody teaches.",
            "Take the cheque, then subtract: **fuel** for the collection run and the run to the yard; **your hours**, at whatever you think an hour of your life is worth; **running costs** on the vehicle, which are real even though they do not appear until later; and **gear** — grinder discs, blades, gloves, the saw itself spread over its life.",
            "The same load can be a good day or a loss depending entirely on how far you drove for it. Sixty kilometres each way to collect one alternator is a loss dressed up as a win. That is not a reason to stay home — it is a reason to stack the trip, to collect three things while you are out there, or to say no.",
            "**Break-even is the number to know.** If a run costs you $40 in fuel and three hours, then that load has to clear well over $100 before you have actually earned anything, because the three hours were worth something on their own.",
            "The trade version of measure twice cut once: **price it twice, commit once.** Work out what a job or a run leaves you before you agree to it, not afterwards.",
            "And the Australian basics, in plain English: an **ABN** is free and you will need one to invoice anybody properly. **GST registration** is required once turnover passes $75,000 a year, and optional below it. Keep every receipt, because fuel, gear and vehicle costs are deductible against this income, and put something aside for tax as you go rather than meeting it all at once. This is general information, not advice — a session with an accountant costs less than the mistakes."
          ],
          keyPoints: [
            'Revenue minus fuel, hours, vehicle running costs and consumables is what you actually made.',
            'Distance is what most often turns a good load into a loss.',
            'Know your break-even before you agree to a run.',
            'Price it twice, commit once.',
            'ABN is free; GST registration kicks in at $75,000 turnover.',
            'Keep receipts and put tax aside as you go. Talk to an accountant.'
          ],
          tip: 'Log the kilometres against a load in the tally. After three or four loads the pattern of which runs are worth making is obvious, and it is usually not the one you expected.'
        },
        {
          id: 'merchant-4',
          title: 'Precious Metals, Realistically',
          blurb: 'Where the gold actually is, and who pays for it',
          body: [
            "Precious metals in scrap are real, and almost everything said about them online is exaggerated. Both of those are true at once.",
            "**Gold in electronics is a plating a few microns thick**, on connector fingers, pins and some chip packages. It is not in the green board and it is not spread through the device. A single phone holds perhaps 20 to 30 milligrams — worth a couple of dollars at best. The famous line about a tonne of phones beating a tonne of ore is true, and it is a volume statement, not a get-rich-quick one.",
            "So the game is **concentration**: clip the plated pins and edge connectors off, keep them separate by type, and accumulate. Sorted pin and connector stock sells to refiners by weight at a real price. Mixed board sells for very little. The difference is entirely in the sorting.",
            "**Silver** turns up in older switch contacts, some solder, brazing alloy and of course sterling items. **Palladium and platinum** are in catalytic converters and some capacitors — and cats are heavily targeted for theft, so expect to prove provenance and expect scrutiny.",
            "**Getting the gold off the plating is chemistry, and it belongs with a refiner.** It uses strong acids that give off corrosive and toxic fumes, done under extraction with the right gear because of exactly that. Sell the concentrated material and let them carry that risk — you are paid for the gold either way.",
            "And the legal side, which is not optional: most states regulate scrap dealing. In New South Wales the Scrap Metal Industry Act 2016 bans cash payment for scrap entirely and requires seller identification; other states have their own rules. If someone offers you cash for a catalytic converter with no questions, that is the problem, not the opportunity."
          ],
          keyPoints: [
            'Gold is microns of plating on pins and fingers, not in the board.',
            'A phone holds maybe 20–30 mg — this is a volume game or it is nothing.',
            'Concentrate and sort: clipped pins sell for far more than mixed board.',
            'Refining is acid chemistry and belongs with a licensed refiner.',
            'Cats carry theft scrutiny — expect to prove where it came from.',
            'Scrap dealing is state-regulated; NSW bans cash payment outright.'
          ],
          tip: 'Start a jar for gold-plated pins and connectors. It is a year before it is worth anything, and then it is worth having done from the start.'
        }
      ],
      quiz: [
        {
          q: 'You have a bundle of clean copper tube with two brass fittings still attached. What happens at the yard?',
          choices: ['No difference, it is all copper', 'The whole bundle may drop a grade', 'They pay brass rates for everything', 'They refuse it'],
          correct: 1,
          explain: 'Contamination downgrades the lot, because they now have to sort it. Two minutes with a saw usually pays better than any other two minutes of the day.'
        },
        {
          q: 'Spot copper is quoted in US dollars. The Australian dollar falls but world copper is flat. What happens to Australian scrap prices?',
          choices: ['They fall', 'They rise', 'No change', 'They become unpredictable'],
          correct: 1,
          explain: 'A weaker Australian dollar means the same US-dollar price converts to more Australian dollars, so local prices rise on the exchange rate alone.'
        },
        {
          q: 'A load pays $400. Fuel was $45 and it took you five hours. What did you make?',
          choices: ['$400', '$355', '$355 minus what five hours of your time is worth', 'Impossible to say'],
          correct: 2,
          explain: 'Revenue minus costs minus your own time is the real number. If your time is worth $30 an hour, that $400 load actually left you about $205 — still fine, but not $400.'
        },
        {
          q: 'Roughly how much gold is in a single mobile phone?',
          choices: ['About 1 gram', 'About 20–30 milligrams', 'About 5 grams', 'None'],
          correct: 1,
          explain: 'Twenty to thirty milligrams — a couple of dollars. Real, but a volume game. The value comes from concentrating pins and connectors across a lot of devices.'
        },
        {
          q: 'Someone offers you cash for a catalytic converter, no questions asked. What is that?',
          choices: ['A good price', 'Normal in the trade', 'A warning sign — cats are theft-targeted and scrap dealing is regulated', 'Only an issue for licensed dealers'],
          correct: 2,
          explain: 'Cats are heavily stolen and most states regulate scrap dealing; NSW bans cash for scrap outright and requires seller ID. No-questions cash is the risk, not the opportunity.'
        }
      ]
    }
  ];

  /* ---- merge into the course, same shape as the mastery units ---- */

  if (window.WA_CONTENT && window.WA_CONTENT.modules) {
    UNITS.forEach(function (u) { window.WA_CONTENT.modules.push(u); });
  }

  /* ---- bench drills and recall cards ---- */

  var PRACTICE = {
    'salvage-1': {
      practice: {
        task: 'Solder three joints in scrap wire and pull-test every one of them.',
        why: 'A cold joint looks identical to a good one until it fails, which is always later and always somewhere annoying. Pulling them apart on the bench is how you learn the difference by feel.',
        kit: ['Soldering iron', 'Electrical solder', 'Scrap wire', 'Heat-shrink', 'Pliers'],
        steps: [
          'Wipe and re-tin the iron until the tip is bright.',
            'Twist two wires together, slide the heat-shrink on first, and rest the iron under the joint.',
          'Count two, then feed solder into where the iron meets the wire — not onto the iron.',
          'Do a second joint deliberately wrong: melt solder on the iron and dab it on.',
          'Let both cool without moving, then pull each one apart with pliers.'
        ],
        pass: [
          'The good joint is bright and slightly hollow between the wires.',
          'The good one breaks the wire before it breaks the joint.',
          'The deliberately cold one pulls apart cleanly — that is what you are learning to spot.',
          'Heat-shrink is on and shrunk, not tape.'
        ]
      },
      recall: [
        { q: 'Where does the heat go — iron on the solder, or iron on the joint?', a: 'On the joint. The joint melts the solder. Melting solder on the iron and dabbing it gives you a cold joint every time.' },
        { q: 'What does flux actually do?', a: 'Cleans the oxide off the metal as it heats so the solder can bond. Electrical solder has a flux core; never use acid plumbing flux on electronics.' }
      ]
    },
    'salvage-2': {
      practice: {
        task: 'Beep out a dead appliance and find what actually failed before you strip it.',
        why: 'Two minutes with a meter tells you whether you are holding a repairable thing, a sellable working part, or scrap. Those are wildly different numbers and most people never check.',
        kit: ['Multimeter', 'Screwdrivers', 'A dead kettle, toaster, heater or power tool'],
        steps: [
          'Unplug it. Then check again that it is unplugged.',
          'Set the meter to continuity and touch the probes together to hear the beep.',
          'Test the cord end to end, pin by pin — the most common failure of the lot.',
          'Test the switch with it pressed and released.',
          'Test the element or motor winding across its terminals.',
          'Write down which one is open. That is your fault.'
        ],
        pass: [
          'You can say which specific component failed, not just that the thing is dead.',
          'You tested with it unplugged throughout.',
          'You know whether the fix is a $5 part or not worth it.'
        ]
      },
      recall: [
        { q: 'Car battery reads 12.6 V running as well as resting. What is wrong?', a: 'The alternator is not charging. Running it should climb to about 13.8–14.4 V. The battery may be fine.' },
        { q: 'Which setting must you never have selected while probing mains?', a: 'Current or resistance. Both are effectively a short circuit through the meter across a live supply.' }
      ]
    },
    'salvage-3': {
      practice: {
        task: 'Sort a mixed heap into four buckets by metal, using weight, a magnet and a scratch.',
        why: 'Sorting is the highest paid work in scrap per minute spent, and it only becomes fast by doing it. This is the drill that pays for itself the first time you use it.',
        kit: ['A magnet', 'A file or knife', 'Four containers', 'Gloves'],
        steps: [
          'Magnet everything first — steel to its own pile immediately.',
          'Of what is left, judge by weight for size: heavy is copper or lead, light is aluminium.',
          'Scratch anything you are unsure of in a hidden spot and go by colour.',
          'Separate brass fittings off any copper before it goes in the copper bucket.',
          'Weigh each bucket and write it down.'
        ],
        pass: [
          'Four clean buckets with nothing cross-contaminated.',
          'No steel screws or brass fittings left in the copper.',
          'You can say roughly what each bucket is worth before you leave the shed.'
        ]
      },
      recall: [
        { q: 'A magnet sticks to it. What have you learned?', a: 'It is steel or a magnetic stainless — the cheap end. The metals worth money (copper, brass, aluminium, lead, 300-series stainless) are not magnetic.' },
        { q: 'Two same-size radiators, one twice the weight. Which is worth more?', a: 'The heavy one. Copper is nearly three times as dense as aluminium, so heavy for its size means copper and brass, and several times the money.' }
      ]
    },
    'salvage-4': {
      practice: {
        task: 'Weigh a bag of cans, count them, and work out both numbers for yourself.',
        why: 'Doing the arithmetic once with your own cans on your own scales is worth more than being told it. After this you will never scrap a deposit container by accident.',
        kit: ['Scales', 'A bag of empty cans', 'The tally in the Field Kit'],
        steps: [
          'Count the cans into a bag and weigh it.',
          'Work out cans per kilo — it should land near 65 to 70.',
          'Multiply the count by your state deposit to get the refund value.',
          'Look up aluminium in the tally and value the same weight as scrap metal.',
          'Compare the two numbers.'
        ],
        pass: [
          'You have both numbers written down.',
          'The refund is several times the scrap value.',
          'You know how many cans equal a kilo of copper — and it is a lot.'
        ]
      },
      recall: [
        { q: 'How many empty cans to the kilo, roughly?', a: 'About 65 to 70. At a 10c deposit that is $6.50–7.00 a kilo in refunds, against maybe $1–2 as scrap aluminium.' },
        { q: 'Why should deposit cans never be crushed flat or sold as scrap?', a: 'Schemes usually need the container identifiable, and the refund is worth three to six times the aluminium. Crushing or scrapping throws away most of the value.' }
      ]
    },

    'merchant-1': {
      practice: {
        task: 'Get a grade sheet from a local yard and price one load against it before you go.',
        why: 'The grade sheet is the price list the whole trade runs on, and most people never ask for it. Once you have one you can work out what a load is worth before you leave the shed.',
        kit: ['A phone', 'Your sorted buckets', 'Scales'],
        steps: [
          'Ring or call in and ask for their current grade sheet.',
          'Weigh each of your grades separately.',
          'Work out what the sheet says you should get.',
          'Take it in and compare what you are actually paid.'
        ],
        pass: [
          'You have a written grade sheet.',
          'Your prediction is within about 10% of what you were paid.',
          'You know which of your grades was downgraded, and why.'
        ]
      },
      recall: [
        { q: 'Why is bare bright copper worth more than #2?', a: 'Every grade below the top exists because of work the yard still has to do — stripping, cutting off fittings, sorting. The discount is that work plus their margin.' },
        { q: 'What does one brass fitting do to a bundle of clean copper tube?', a: 'It can drop the whole bundle a grade, because now it needs sorting. Cutting it off is usually the best-paid two minutes of the day.' }
      ]
    },
    'merchant-2': {
      practice: {
        task: 'Track what you get as a percentage of spot across three loads.',
        why: 'The ratio, not the price, is what tells you whether a yard is treating you properly. It takes three loads to see and then it is obvious forever.',
        kit: ['The tally in the Field Kit', 'Scales'],
        steps: [
          'Weigh and value each load at spot before you go, using the tally.',
          'Record what you were actually paid.',
          'Work out the percentage each time.',
          'Compare across yards if you use more than one.'
        ],
        pass: [
          'Three loads recorded with both numbers.',
          'You can state your average percentage of spot.',
          'You have an opinion about whether that is fair, and why.'
        ]
      },
      recall: [
        { q: 'The Australian dollar falls but world copper is flat. What happens locally?', a: 'Local scrap prices rise. Spot is quoted in US dollars, so the same price converts to more Australian dollars.' },
        { q: 'What moves your price more than the market does?', a: 'Volume and consistency. Carting a full load costs a yard the same as a quarter load, and a yard that trusts your sorting pays without re-checking it.' }
      ]
    },
    'merchant-3': {
      practice: {
        task: 'Cost one real run properly, from fuel to hours, and find your break-even.',
        why: 'Most people never do this and quietly lose money on runs that felt like wins. Once you know your break-even you can decide before you drive, not after.',
        kit: ['The tally', 'Fuel receipts', 'A clock'],
        steps: [
          'Log the kilometres and fuel for one collection run.',
          'Note the hours honestly, including sorting and the trip to the yard.',
          'Put a number on what an hour of your time is worth.',
          'Subtract everything from what the load paid.',
          'Work out what that load would have had to pay to be worth doing.'
        ],
        pass: [
          'You have a real profit figure, not a revenue figure.',
          'You know your break-even for a typical run.',
          'You can say whether that run was worth making.'
        ]
      },
      recall: [
        { q: 'A load pays $400, fuel was $45, and it took five hours. What did you make?', a: '$355 minus what five hours of your time is worth. At $30 an hour that is about $205 — still fine, but not $400.' },
        { q: 'At what turnover does GST registration become required in Australia?', a: '$75,000 a year. Below that it is optional. An ABN is free and needed to invoice properly — and talk to an accountant, this is general information.' }
      ]
    },
    'merchant-4': {
      practice: {
        task: 'Strip and sort the gold-plated connectors off one dead device.',
        why: 'Concentration is the entire game with precious metals. Doing it once shows you how little there is per device and how much the sorting matters.',
        kit: ['Snips', 'Pliers', 'A jar', 'A dead computer, phone or piece of network gear'],
        steps: [
          'Find the plated contacts: edge connectors, pin headers, chip sockets.',
          'Clip them off rather than trying to remove whole boards.',
          'Keep pins, fingers and sockets in separate lots.',
          'Weigh what you got and put it in the jar.',
          'Look up what a refiner pays for that grade per kilo.'
        ],
        pass: [
          'You can point at where the gold actually is, and where it is not.',
          'Your lots are sorted, not mixed.',
          'You know roughly how many devices it takes to be worth sending.'
        ]
      },
      recall: [
        { q: 'Where in a circuit board is the gold?', a: 'A few microns of plating on connector fingers, pins and some chip packages. Not in the green board and not spread through the device.' },
        { q: 'Why not refine it yourself?', a: 'It takes strong acids that give off corrosive and toxic fumes, which is why refiners do it under extraction with proper gear. Sell the concentrated pins and get paid for the gold without carrying that risk.' }
      ]
    }
  };

  if (window.WA_PRACTICE) {
    Object.keys(PRACTICE).forEach(function (k) { window.WA_PRACTICE[k] = PRACTICE[k]; });
  }
})();

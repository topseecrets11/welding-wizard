/* ============================================================================
 * WELD ACADEMY — WHERE THIS COMES FROM
 * ----------------------------------------------------------------------------
 * She thinks AI is unreliable. She is right to be careful, and the answer to
 * that is not to argue — it is to show her where every claim came from and let
 * her check it herself.
 *
 * So: real, tappable links to the actual published standards and the actual
 * regulators. Not "built on Australian standards" in prose, which is exactly
 * the kind of unverifiable line she would be right to distrust.
 *
 * TWO RULES THIS FILE IS HELD TO
 *
 * 1. EVERY URL IN HERE WAS FETCHED AND RETURNED 200 before it was written
 *    down. A dead link on a page whose whole job is "check me" is worse than
 *    no page at all.
 *
 * 2. WHERE THE APP IS ESTIMATING, IT SAYS SO. Starting amperages, teardown
 *    metal contents and yard percentages are experience and arithmetic, not
 *    citations, and they are listed as such below rather than quietly mixed in
 *    with the standards.
 * ==========================================================================*/

window.WA_SOURCES = (function () {
  'use strict';

  /* kind: 'standard' | 'regulator' | 'training' | 'research' */
  var sources = [
    {
      id: 'as1554-1', units: ['quality','ticket'], kind: 'standard',
      title: 'AS/NZS 1554.1 — Structural steel welding',
      what: 'The structural welding code: joint preparation, weld quality categories (SP and GP), ' +
            'defect acceptance limits, and inspection. Behind the weld-quality unit and most of ' +
            'what Old Mate calls acceptable.',
      where: 'Units 6 and 9',
      url: 'https://store.standards.org.au/product/as-nzs-1554-1-2014'
    },
    {
      id: 'as1554-6', units: ['materials'], kind: 'standard',
      title: 'AS/NZS 1554.6 — Welding stainless steels',
      what: 'The stainless-specific code: filler selection, heat input limits, and why the ' +
            'techniques that work on mild steel wreck stainless.',
      where: 'Unit 8, Beyond Mild Steel',
      url: 'https://store.standards.org.au/product/as-nzs-1554-6-2012'
    },
    {
      id: 'as4855', units: ['smaw'], kind: 'standard',
      title: 'AS/NZS 4855 — Consumables, covered electrodes',
      what: 'How electrodes are classified and what the digits on the box mean. Behind the ' +
            'rod-reading lesson and the E4313 / E4818 comparisons.',
      where: 'Unit 3, Stick Welding',
      url: 'https://store.standards.org.au/product/as-nzs-4855-2007'
    },
    {
      id: 'iso9606', units: ['ticket'], kind: 'standard',
      title: 'AS/NZS ISO 9606.1 — Qualification testing of welders',
      what: 'What a welder qualification test actually is, what it covers, and what it does not. ' +
            'Behind everything the app says about getting a ticket.',
      where: 'Unit 9, Fit-up & the Ticket',
      url: 'https://store.standards.org.au/product/as-nzs-iso-9606-1-2017'
    },
    {
      id: 'as1796', units: ['ticket'], kind: 'standard',
      title: 'AS 1796 — Certification of welders and welding supervisors',
      what: 'The Australian certificate scheme and its categories — the paper a coded test ' +
            'actually gets you.',
      where: 'Unit 9',
      url: 'https://store.standards.org.au/product/as-1796-2001'
    },
    {
      id: 'as1674', units: ['safety'], kind: 'standard',
      title: 'AS 1674.1 — Safety in welding: fire precautions',
      what: 'Hot work controls, fire watch requirements, and clearances. Behind the safety unit ' +
            'and the pre-flight checklist.',
      where: 'Unit 1 and the pre-flight list',
      url: 'https://store.standards.org.au/product/as-1674-1-1997'
    },
    {
      id: 'as1338', units: ['safety'], kind: 'standard',
      title: 'AS/NZS 1338.1 — Filters for eye protectors',
      what: 'Helmet and filter requirements, and the shade scale by process and current. The ' +
            'shade-by-amperage figures come from here.',
      where: 'Unit 1, Dressing for the Fight',
      url: 'https://store.standards.org.au/product/as-nzs-1338-1-2012'
    },
    {
      id: 'iarc', units: ['safety'], kind: 'research',
      title: 'IARC Monograph 118 — Welding, welding fumes and related exposures',
      what: 'The 2017 World Health Organization review that reclassified welding fume as a ' +
            'Group 1 carcinogen — carcinogenic to humans. This is the source for the strongest ' +
            'claim the app makes, so here is the monograph itself.',
      where: 'Unit 1, What the Arc Actually Does to You',
      url: 'https://publications.iarc.fr/569'
    },
    {
      id: 'iarc-list', units: ['safety'], kind: 'research',
      title: 'IARC — full list of classifications',
      what: 'The searchable list, if you want to see where welding fume sits against everything ' +
            'else IARC has assessed.',
      where: 'Unit 1',
      url: 'https://monographs.iarc.who.int/list-of-classifications'
    },
    {
      id: 'mem', units: ['ticket'], kind: 'training',
      title: 'MEM Manufacturing and Engineering Training Package',
      what: 'The national training package the welding qualifications sit in. This is the ' +
            'official register — what an RTO must actually deliver and assess.',
      where: 'Unit 9, and the RPL path',
      url: 'https://training.gov.au/Training/Details/MEM05'
    },
    {
      id: 'mem-cert3', units: ['ticket'], kind: 'training',
      title: 'MEM31420 — Certificate III in Engineering (Fabrication Trade)',
      what: 'The actual qualification, with its full unit list. If you want to see what you would ' +
            'be assessed against, this is it.',
      where: 'The RPL path',
      url: 'https://training.gov.au/Training/Details/MEM31420'
    },
    {
      id: 'ren', units: ['salvage'], kind: 'regulator',
      title: 'NSW EPA — Return and Earn container deposit scheme',
      what: 'The scheme rules and the 10 cent refund: what containers are eligible, and what is ' +
            'excluded. The cans arithmetic in unit 10 is built on this.',
      where: 'Unit 10, The Cans Honestly',
      url: 'https://www.epa.nsw.gov.au/your-environment/recycling-and-reuse/return-and-earn'
    },
    {
      id: 'ren-scheme', units: ['salvage'], kind: 'regulator',
      title: 'Return and Earn — the scheme itself',
      what: 'Where to hand containers in, and the eligibility checker. Other states run their ' +
            'own schemes at the same 10 cent rate but with different container rules — check ' +
            'yours.',
      where: 'Unit 10',
      url: 'https://returnandearn.org.au'
    },
    {
      id: 'cxa', units: ['salvage'], kind: 'regulator',
      title: 'Container Exchange (QLD) — Containers for Change',
      what: 'The Queensland scheme, for comparison. Same refund, different container rules — ' +
            'which is the point about checking your own state.',
      where: 'Unit 10',
      url: 'https://www.containerexchange.com.au'
    }
  ];

  /* Where the app is working from experience and arithmetic rather than a
     published source. Listed plainly, because pretending these are citations
     would undermine the ones that are. */
  var estimates = [
    {
      what: 'Starting amperages and voltages',
      why: 'Cheat-sheet figures are typical starting points for common material thicknesses, ' +
           'from ordinary trade practice and consumable maker guidance. Machines, positions and ' +
           'joints all move them. The app says everywhere that these are a starting point and ' +
           'that a test bead on scrap is what settles it.'
    },
    {
      what: 'What is inside a piece of scrap',
      why: 'The teardown figures are ranges from typical units. A truck alternator and a small ' +
           'car one are different animals. Weigh what you actually get — after a few loads your ' +
           'own notes in the tally beat any table, including this one.'
    },
    {
      what: 'What a yard pays as a percentage of spot',
      why: 'The 50–75% figures are ordinary market experience, not a published rate. They move ' +
           'with volume, grade, cleanliness and the yard. The tally records what you were ' +
           'actually paid against what it was worth, which is the number that matters.'
    },
    {
      what: 'Prices with no live feed',
      why: 'Copper, gold, silver, platinum and palladium come from a live price API. Steel, ' +
           'lead, stainless and brass have no free feed a phone can call, so those use a rough ' +
           'standing figure and are marked "estimate" wherever they appear rather than being ' +
           'dressed up as prices.'
    },
    {
      what: 'Time estimates for stripping',
      why: 'Minutes-per-item are for someone who has done a few, with the right tools. Your ' +
           'first one will take three times as long, and that is normal.'
    }
  ];

  /* The plain statement of what this app is. */
  var statement = [
    'This app was written by an AI. That is worth knowing, and it is why this page exists.',
    'The welding content is built on the published Australian and international standards ' +
    'listed above, plus ordinary trade practice. Every link on this page goes to the actual ' +
    'source — the standard, the regulator, the training package — so you can check any of it ' +
    'yourself rather than taking anyone\'s word for it. That is the whole point of the page.',
    'Where the app is estimating rather than citing, it says so, both here and on the page ' +
    'doing the estimating.',
    'What it is not: a qualification, and not a substitute for someone competent watching you ' +
    'weld. It teaches the knowledge properly and gives you drills to build the skill, but the ' +
    'ticket comes from a registered training organisation and a coded test on a real coupon. ' +
    'The recognition-of-prior-learning page explains how what you do here counts toward that.'
  ];

  /* Which sources back a given unit. Matched on module id rather than on the
     prose in `where`, so renaming a unit cannot silently detach its sources. */
  function byUnit(moduleId) {
    return sources.filter(function (s) {
      return (s.units || []).indexOf(moduleId) !== -1;
    });
  }

  function kinds() {
    return [
      { id: 'standard', label: 'Standards', icon: '📐' },
      { id: 'research', label: 'Research', icon: '🔬' },
      { id: 'training', label: 'Training packages', icon: '🎓' },
      { id: 'regulator', label: 'Regulators and schemes', icon: '🏛️' }
    ];
  }

  return { sources: sources, estimates: estimates, statement: statement, byUnit: byUnit, kinds: kinds };
})();

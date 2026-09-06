const { chromium } = require('playwright');
const path = require('path');

const APP = 'file://' + path.resolve(__dirname, '..', 'index.html');
const SHOTS = process.env.WA_SHOTS || null;   // set to a directory to also capture screenshots

async function shot(page, name) {
  if (SHOTS) await page.screenshot({ path: require('path').join(SHOTS, name), fullPage: true });
}

// Celebration overlays are modal on purpose, so the test dismisses them the
// way a person would before carrying on.
async function dismiss(page) {
  for (let i = 0; i < 8; i++) {
    if (!(await page.locator('.celebrate-btn').count())) return;
    await page.locator('.celebrate-btn').first().click();
    await page.waitForTimeout(340);
  }
}

const checks = [];
function check(name, cond, extra) {
  checks.push({ name, ok: !!cond, extra });
  console.log((cond ? '✓ ' : '✗ ') + name + (cond ? '' : '   << ' + JSON.stringify(extra)));
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  // The price feeds are unreachable from a file:// sandbox with no network.
  // The app handles that (cached prices, "no signal" copy), so a failed
  // resource load is expected here — real script errors are not.
  page.on('console', m => {
    if (m.type() !== 'error') return;
    if (/Failed to load resource|ERR_(CONNECTION|NAME|INTERNET|NETWORK)/.test(m.text())) return;
    errors.push('console: ' + m.text());
  });

  await page.goto(APP);
  const WA_MODULE_COUNT = await page.evaluate(() => WA_CONTENT.modules.length);

  /* ---------- onboarding: name, then the eight profile questions ---------- */
  await page.waitForSelector('#wstart');
  await shot(page, '01-welcome.png');

  // The install nudge lives on the very first screen, not buried in a menu —
  // that is the entire point of it. It starts hidden (the real browser event
  // has not fired yet in this sandbox) and a fired event must reveal it live,
  // in place, without her needing to navigate anywhere.
  check('the install nudge is on the very first screen, hidden until offered',
    await page.evaluate(() => {
      const b = document.getElementById('wInstallBanner');
      return !!b && b.hidden === true;
    }));
  await page.evaluate(() => {
    const ev = new Event('beforeinstallprompt', { cancelable: true });
    ev.prompt = () => {};
    ev.userChoice = Promise.resolve({ outcome: 'accepted' });
    window.dispatchEvent(ev);
  });
  check('it appears the moment the browser says installing is allowed',
    await page.evaluate(() => document.getElementById('wInstallBanner').hidden === false));
  await page.click('#wInstallBtn');
  await page.waitForTimeout(50);
  check('tapping it fires the real install prompt and then gets out of the way',
    await page.evaluate(() => document.getElementById('wInstallBanner').hidden === true));

  await page.fill('#wname', 'Tess');
  await page.click('#wstart');

  // Answer all eight. Deliberate picks so the derived settings are predictable:
  // hands=bench → the "do" mode opens first, colour=steel → a blue accent.
  const PICKS = {
    pace: 'fast', depth: 'why', patience: 'low', push: 'blunt',
    motivator: 'money', hands: 'bench', when: 'moving', colour: 'steel'
  };
  const QIDS = await page.evaluate(() => WA_PROFILE.QUESTIONS.map(q => q.id));
  check('eight profile questions up front', QIDS.length === 8);
  for (let i = 0; i < QIDS.length; i++) {
    // Answering advances on a short delay, so wait for this question's own
    // option rather than any .q-opt — the previous screen is briefly still up.
    const sel = `.q-opt[data-v="${PICKS[QIDS[i]]}"]`;
    let ok = true;
    try { await page.waitForSelector(sel, { timeout: 4000 }); } catch (e) { ok = false; }
    if (i === 0) await shot(page, '02-question.png');
    check(`question ${i + 1} (${QIDS[i]}) is answerable`, ok);
    if (ok) await page.click(sel);
  }

  await page.waitForSelector('.hero');
  check('onboarding → home', (await page.textContent('.hero-hi')).includes('Tess'));
    // The optional unit is deliberately off the main road, so the map shows the
  // core and mastery units only.
  check('the map shows the main path, not the optional unit', await page.evaluate(() => {
    const onPath = WA_CONTENT.modules.filter(m => m.tier !== 'advanced').length;
    return document.querySelectorAll('.node').length === onPath &&
      WA_CONTENT.modules.some(m => m.tier === 'advanced');
  }));
  check('the optional unit is offered separately, marked optional', await page.evaluate(() => {
    const t = document.querySelector('[data-tile^="opt:"]');
    return !!t && /optional/i.test(t.textContent);
  }));
  check('optional units never gate the main path', await page.evaluate(() => {
    // Every advanced unit is open from the start, and none of them blocks
    // whatever comes after it in the list.
    const adv = WA_CONTENT.modules.filter(m => m.tier === 'advanced');
    return adv.length > 0 && adv.every(m => WA_PROGRESS.moduleUnlocked(m.id));
  }));
  check('answers are saved', await page.evaluate(() =>
    WA_PROFILE.answers().hands === 'bench' && WA_PROFILE.answers().colour === 'steel'));
  check('answers pick the opening lesson mode',
    await page.evaluate(() => WA_PROGRESS.state.prefMode === 'do'));
  check('chosen theme actually recolours the app', await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      === WA_PROFILE.THEMES.steel.accent));
  check('money motivator leads the home screen', await page.evaluate(() => {
    const t = document.querySelector('#ticker'), c = document.querySelector('.continue');
    return !!t && !!c && (t.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
  }));

  // --- the menu ---
  await page.click('#menuBtn');
  await page.waitForSelector('.drawer-panel');
  check('menu lists every unit plus the shed tools',
    (await page.locator('.drawer-item').count()) === WA_MODULE_COUNT + 8 + 4);
  await shot(page, '16-menu.png');
  await page.click('.drawer-x');
  await page.waitForTimeout(320);

  // --- the price ticker ---
  check('price ticker is on the map', (await page.locator('#ticker').count()) === 1);
  check('header shows level 1', (await page.textContent('.hdr-lvl')) === '1');

  /* ---------- daily challenge ---------- */
  const xpBefore = await page.evaluate(() => WA_PROGRESS.state.xp);
  const dailyCorrect = await page.evaluate(() => WA_PROGRESS.dailyChallenge().item.question.correct);
  await page.click(`[data-daily="${dailyCorrect}"]`);
  await page.waitForSelector('.explain');
  const xpAfterDaily = await page.evaluate(() => WA_PROGRESS.state.xp);
  check('daily challenge awards 20 XP', xpAfterDaily === xpBefore + 20, { xpBefore, xpAfterDaily });
  await shot(page, '02-home.png');

  /* ---------- lesson flow ---------- */
  await page.click('.continue');
  await page.waitForSelector('.modes');
  // hands=bench derived the "do" mode, so the lesson opens on the bench drill.
  check('lesson opens in the mode her answers derived',
    (await page.locator('.mode[data-mode="do"].is-active').count()) === 1);
  await page.click('[data-mode="read"]');
  await page.waitForSelector('.prose');
  check('lesson opens with prose + key points', (await page.locator('.keybox li').count()) >= 3);
  check('five learning modes offered', (await page.locator('.mode').count()) === 5);
  check('read-aloud bar is present', (await page.locator('#reader').count()) === 1);
  check('narrator built a script from the page',
    await page.evaluate(() => WA_NARRATOR.status().total > 3));
  await page.click('#readRate');
  check('speed control cycles', await page.evaluate(() => WA_NARRATOR.getRate() !== 1));
  await page.evaluate(() => WA_NARRATOR.setRate(1));
  await shot(page, '03-lesson.png');

  // --- the five ways into a lesson ---
  await page.click('[data-mode="guts"]');
  check('guts mode lists the key points', (await page.locator('.gut').count()) >= 3);
  await page.click('[data-mode="show"]');
  check('show mode renders tiles', (await page.locator('.tile').count()) >= 3);
  await page.click('[data-mode="do"]');
  check('do mode renders a bench drill', (await page.locator('.drill-steps li').count()) >= 3);
  const xpBeforeDrill = await page.evaluate(() => WA_PROGRESS.state.xp);
  await page.click('#drillBtn');
  await page.waitForTimeout(250);
  const xpAfterDrill = await page.evaluate(() => WA_PROGRESS.state.xp);
  check('bench drill pays 20 XP', xpAfterDrill === xpBeforeDrill + 20, { xpBeforeDrill, xpAfterDrill });
  check('Hands On badge', await page.evaluate(() => WA_PROGRESS.hasBadge('hands-on')));
  await shot(page, '03b-drill.png');
  await dismiss(page);
  await page.click('[data-mode="recall"]');
  check('recall mode renders flip cards', (await page.locator('.flip').count()) >= 2);
  await page.click('.flip');
  check('a card flips', await page.evaluate(() => document.querySelector('.flip').classList.contains('is-flipped')));
  await page.click('#recallBtn');
  await page.waitForTimeout(200);
  check('recall pays 5 XP', await page.evaluate(() => WA_PROGRESS.isRecallDone('safety-1')));
  check('mode preference is remembered', await page.evaluate(() => WA_PROGRESS.state.prefMode === 'recall'));
  await page.click('[data-mode="read"]');
  await dismiss(page);
  await page.click('#doneBtn');
  await page.waitForURL('**#/lesson/safety/safety-2');
  await page.waitForSelector('.prose');
  const xpAfterLesson = await page.evaluate(() => WA_PROGRESS.state.xp);
  // By now: 20 daily + 20 drill + 5 recall + 10 for the lesson itself.
  check('lesson gives 10 XP and advances', xpAfterLesson === xpAfterDaily + 35, { xpAfterDaily, xpAfterLesson });
  check('badge First Spark earned', await page.evaluate(() => WA_PROGRESS.hasBadge('first-spark')));

  /* ---------- finish the safety module's lessons ---------- */
  for (const next of ['safety-3', 'safety-4']) {
    await dismiss(page);
    await page.click('#doneBtn');
    await page.waitForURL('**#/lesson/safety/' + next);
    await page.waitForSelector('.prose');
  }
  await dismiss(page);
  await page.click('#doneBtn');
  await page.waitForURL('**#/quiz/safety');
  const url = page.url();
  check('last lesson leads to the quiz', url.includes('#/quiz/safety'), { url });

  /* ---------- quiz, answered correctly ---------- */
  await page.waitForSelector('.q-h');
  const answers = await page.evaluate(() =>
    WA_CONTENT.modules.find(m => m.id === 'safety').quiz.map(q => q.correct));
  for (let i = 0; i < answers.length; i++) {
    await dismiss(page);
    await page.click(`[data-q="${answers[i]}"]`);
    await page.waitForSelector('.feedback');
    if (i === 1) await shot(page, '04-quiz.png');
    await page.click('#qNext');
    await page.waitForTimeout(220);
  }
  await page.waitForSelector('.result');
  check('perfect quiz shows 5/5', (await page.textContent('.result-score')).startsWith('5'));
  check('quiz awards 15 XP per answer + 25 module bonus',
    (await page.textContent('.result-xp')) === '+100 XP', { got: await page.textContent('.result-xp') });
  await dismiss(page);
  check('safety module marked complete', await page.evaluate(() => WA_PROGRESS.moduleComplete('safety')));
  check('Perfect Pass badge', await page.evaluate(() => WA_PROGRESS.hasBadge('perfect-pass')));
  check('Safety badge', await page.evaluate(() => WA_PROGRESS.hasBadge('safety')));
  check('level up past level 1', await page.evaluate(() => WA_PROGRESS.level()) >= 2);
  await shot(page, '05-result.png');

  /* ---------- module 2 now unlocked ---------- */
  await page.goto(APP + '#/course');
  await page.waitForSelector('.card--module');
  const locked = await page.locator('.card--module.is-locked').count();
  check('module 2 unlocked after module 1 passed', locked === WA_MODULE_COUNT - 3, { lockedCards: locked });
  check('mastery tier is shown separately', (await page.locator('.section-h').count()) >= 2);
  await shot(page, '06-course.png');

  /* ---------- weld doctor ---------- */
  await page.goto(APP + '#/doctor');
  await page.waitForSelector('.clue');
  check('it is Old Mate, not a doctor', (await page.textContent('.mate-head h1')).includes('Old Mate'));
  check('no "Weld Doctor" left in the UI',
    !(await page.evaluate(() => document.body.innerText)).match(/weld doctor/i));
  check('all clues rendered', (await page.locator('.clue').count()) === 15);
  await dismiss(page);
  await page.click('#dxBtn');                       // nothing ticked → warn, no results
  check('diagnose with no clues warns', (await page.locator('.card--dx').count()) === 0);
  await dismiss(page);
  await page.click('.clue:has(input[data-clue="holes"])');
  await page.click('.clue:has(input[data-clue="windy"])');
  await page.click('#dxBtn');
  await page.waitForSelector('.card--dx');
  const topDx = await page.textContent('.card--dx.is-top h3');
  check('porosity ranked top for holes + wind', topDx.includes('Porosity'), { topDx });
  // innerText returns CSS-uppercased text, so match case-insensitively.
  check('results are framed as Old Mate\'s call',
    /what old mate reckons/i.test(await page.evaluate(() => document.body.innerText)));
  check('Field Medic badge', await page.evaluate(() => WA_PROGRESS.hasBadge('field-medic')));
  await shot(page, '07-doctor.png');

  // His call is on screen; the detail is one tap behind it, in a sheet.
  // Holes + wind matches porosity alone, so this case has no runners-up.
  await dismiss(page);
  check('a single confident answer shows no runners-up',
    (await page.locator('.tile-btn[data-tile^="dx:"]').count()) === 0);
  await page.click('.card--dx.is-top [data-dx]');
  await page.waitForSelector('.sheet.is-open');
  check('defect sheet opens with fix-now steps', (await page.locator('.sheet .dx-sec--fix li').count()) > 0);
  check('defect sheet names the defect',
    (await page.textContent('.sheet-head h2')).includes('Porosity'));
  await shot(page, '18-sheet.png');
  await page.click('.sheet-x');
  await page.waitForSelector('.sheet', { state: 'detached' });
  check('sheet closes and leaves the page behind it', (await page.locator('.card--dx.is-top').count()) === 1);

  // A vaguer symptom matches several, and those become tiles rather than
  // another two screens of prose.
  await page.click('#dxAgain');
  await page.waitForSelector('.clue');
  await page.click('.clue:has(input[data-clue="uneven"])');
  await page.click('#dxBtn');
  await page.waitForSelector('.card--dx');
  await dismiss(page);
  check('runners-up become tiles', (await page.locator('.tile-btn[data-tile^="dx:"]').count()) >= 2);
  await page.click('.tile-btn[data-tile^="dx:"]');
  await page.waitForSelector('.sheet.is-open');
  check('a runner-up opens its own sheet', (await page.locator('.sheet .dx-sec--fix li').count()) > 0);
  await page.click('.sheet-x');
  await page.waitForSelector('.sheet', { state: 'detached' });

  // a second, different symptom set must give a different answer
  await dismiss(page);
  await page.click('#dxAgain');
  await page.waitForSelector('.clue');
  await page.click('.clue:has(input[data-clue="crack-late"])');
  await page.click('#dxBtn');
  await page.waitForSelector('.card--dx');
  const topDx2 = await page.textContent('.card--dx.is-top h3');
  check('delayed crack → cold cracking', topDx2.includes('Cold cracking'), { topDx2 });

  /* ---------- field kit: everything long is now a tile + sheet ---------- */
  await page.goto(APP + '#/kit/checklist');
  await page.waitForSelector('.tile-btn');
  await dismiss(page);
  check('pre-flight sections are tiles', (await page.locator('.tile-btn[data-tile^="check:"]').count()) === 4);
  await page.click('.tile-btn[data-tile="check:0"]');
  await page.waitForSelector('.sheet.is-open .check');
  await page.click('.sheet .check');
  check('checklist ticks persist to state',
    await page.evaluate(() => Object.keys(WA_PROGRESS.state.checklist).length === 1));
  check('the tile behind the sheet updates as she ticks',
    /1 of/.test(await page.textContent('.tile-btn[data-tile="check:0"] .tile-s')));
  await shot(page, '08-checklist.png');
  // The panel covers the middle of the screen, so tap the backdrop up top —
  // which is where the exposed part of it actually is on a phone.
  await page.click('.sheet-back', { position: { x: 20, y: 20 } });
  await page.waitForSelector('.sheet', { state: 'detached' });
  check('tapping outside closes the sheet', (await page.locator('.sheet').count()) === 0);

  await page.goto(APP + '#/kit/sheets');
  await page.waitForSelector('.tile-btn');
  check('four cheat sheets as tiles', (await page.locator('.tile-btn[data-tile^="cheat:"]').count()) === 4);
  await dismiss(page);
  await page.click('.tile-btn[data-tile="cheat:0"]');
  await page.waitForSelector('.sheet.is-open table');
  check('cheat sheet opens its table in a sheet', (await page.locator('.sheet table tbody tr').count()) > 0);
  await shot(page, '09-sheets.png');
  await page.click('.sheet-x');
  await page.waitForSelector('.sheet', { state: 'detached' });

  await page.goto(APP + '#/kit/scrap');
  await page.waitForSelector('.price');
  check('six price cards render', (await page.locator('.price').count()) === 6);
  check('scrap guide sections are tiles', (await page.locator('.tile-btn[data-tile^="scrap:"]').count()) === 6);
  await page.click('.tile-btn[data-tile="scrap:0"]');
  await page.waitForSelector('.sheet.is-open');
  check('scrap guide opens in a sheet', (await page.locator('.sheet-body li').count()) > 0);
  await page.click('.sheet-x');
  await page.waitForSelector('.sheet', { state: 'detached' });
  check('spot-vs-yard warning is shown', (await page.locator('.card--warn').count()) === 1);
  check('prices degrade gracefully with no network',
    (await page.textContent('.price-val')).length > 0);
  await shot(page, '17-scrap.png');

  // A slow price fetch that lands after she has already moved to another tab
  // must not re-render the scrap page over the top of what she is doing. This
  // reproduces a real failure: prices resolved mid-typing on the weld log and
  // detached the form, losing the entry.
  await page.goto(APP + '#/kit/scrap');
  await page.waitForSelector('.price');
  await page.goto(APP + '#/kit/log');
  await page.waitForSelector('#logSave');
  await page.fill('#logNote', 'Late price fetch must not wipe this.');
  await page.evaluate(() => WA_MARKET.refresh({ force: true }));
  await page.waitForTimeout(600);
  check('late price fetch does not clobber another tab',
    (await page.locator('#logSave').count()) === 1 &&
    (await page.inputValue('#logNote')) === 'Late price fetch must not wipe this.');

  await page.goto(APP + '#/kit/log');
  await page.waitForSelector('#logSave');
  await page.fill('#logNote', 'First fillet on 3 mm, MIG 18 V / 5 m/min. Undercut on the top edge.');
  await page.fill('#logDx', 'Undercut');
  await dismiss(page);
  await page.click('#logSave');
  await page.waitForSelector('.card--log');
  check('log entry saved', (await page.locator('.card--log').count()) === 1);
  check('Logbook badge', await page.evaluate(() => WA_PROGRESS.hasBadge('logbook')));
  await shot(page, '10-log.png');

  /* ---------- the salvage unit, and what leads versus what is offered ---- */
  check('the practical salvage unit is core, not optional', await page.evaluate(() => {
    const m = WA_CONTENT.modules.find(x => x.id === 'salvage');
    return m && (m.tier || 'core') === 'core' && m.lessons.length === 4;
  }));
  check('the merchant unit is explicitly optional', await page.evaluate(() => {
    const m = WA_CONTENT.modules.find(x => x.id === 'merchant');
    return m && m.tier === 'advanced';
  }));
  check('it teaches soldering, testing and reading scrap before any trading',
    await page.evaluate(() => {
      const m = WA_CONTENT.modules.find(x => x.id === 'salvage');
      const t = m.lessons.map(l => l.title.toLowerCase()).join(' | ');
      return /solder/.test(t) && /multimeter/.test(t) && /inside/.test(t);
    }));
  check('the cans maths is stated once and is right', await page.evaluate(() => {
    const m = WA_CONTENT.modules.find(x => x.id === 'salvage');
    const l = m.lessons.find(x => x.id === 'salvage-4');
    const all = (l.body.join(' ') + l.keyPoints.join(' '));
    // ~15 g a can → 65-70 to the kilo; the refund must beat the scrap value.
    return /65\D{1,4}70/.test(all) && /refund/i.test(all) &&
      /never crush|never.*scrap/i.test(all);
  }));
  check('both new units have drills and recall cards', await page.evaluate(() =>
    ['salvage', 'merchant'].every(id =>
      WA_CONTENT.modules.find(m => m.id === id).lessons
        .every(l => WA_PRACTICE[l.id] && WA_PRACTICE[l.id].recall.length >= 2))));
  check('the business lesson separates revenue from profit', await page.evaluate(() => {
    const l = WA_CONTENT.modules.find(m => m.id === 'merchant')
      .lessons.find(x => x.id === 'merchant-3');
    const all = l.body.join(' ') + l.keyPoints.join(' ');
    return /break-even/i.test(all) && /ABN/.test(all) && /75,000/.test(all);
  }));

  await page.goto(APP + '#/course');
  await page.waitForSelector('.card--module');
  await dismiss(page);
  check('the course page separates optional from the main path',
    /If you want it/i.test(await page.textContent('#view') || await page.textContent('body')));

  /* ---------- the tally: her scales, her ledger ---------- */
  await page.goto(APP + '#/kit/tally');
  await page.waitForSelector('#tallyAdd');
  await dismiss(page);
  check('an empty pile says so', /Nothing weighed in/.test(await page.textContent('#kitBody')));

  await page.click('#tallyAdd');
  await page.waitForSelector('#tlSave');
  await page.selectOption('#tlMetal', 'copper');
  await page.fill('#tlKg', '34');
  await page.click('#tlSave');
  await page.waitForSelector('.tally-line');
  check('weighing something in adds it to the pile',
    await page.evaluate(() => WA_TALLY.totals()[0].metal === 'copper' && WA_TALLY.totals()[0].kg === 34));

  // The pairing is the whole point: what it is worth, and what she will get.
  check('the pile is valued at spot AND at what a yard pays', await page.evaluate(() => {
    WA_MARKET.state.prices.copper = { usd: 4.2 };
    WA_MARKET.state.usdAud = 1.5;
    const v = WA_TALLY.valuePile();
    const l = v.lines[0];
    return l.known && l.spot > 0 && l.yardLow < l.spot && l.yardHigh < l.spot && l.yardLow < l.yardHigh;
  }));
  check('a metal with no price says so rather than guessing', await page.evaluate(() => {
    delete WA_MARKET.state.prices.copper;
    WA_MARKET.state.usdAud = null;
    const l = WA_TALLY.valueOf('copper', 10);
    return l.known === false;
  }));
  check('estimated prices are flagged as estimates', await page.evaluate(() => {
    const s = WA_TALLY.spotPerKg('steel');
    return s && s.live === false;      // no live feed for steel; must not claim one
  }));

  // Fuel against the load is what turns revenue into profit.
  await page.click('#tallyTrip');
  await page.waitForSelector('#tlTripSave');
  await page.fill('#tlKm', '120');
  await page.click('#tlTripSave');
  await page.waitForSelector('.tally-costs');
  check('a run out is costed against the load',
    await page.evaluate(() => WA_TALLY.tripCost() > 0));
  check('the screen shows what is actually hers after costs',
    /actually yours/.test(await page.textContent('.tally-costs')));

  check('Old Mate can say the pile out loud', await page.evaluate(() => {
    WA_MARKET.state.prices.copper = { usd: 4.2 };
    WA_MARKET.state.usdAud = 1.5;
    const s = WA_TALLY.spoken();
    return /34 kilos of copper/.test(s) && /at spot/.test(s) && /expect/.test(s);
  }));

  await page.click('#tallySell');
  await page.waitForSelector('#tlSold');
  await page.fill('#tlPaid', '450');
  await page.click('#tlSold');
  await page.waitForTimeout(300);
  check('selling banks the load and clears the pile', await page.evaluate(() =>
    WA_TALLY.pile().length === 0 && WA_TALLY.history().length === 1));
  check('the ledger records paid, costs and what she actually made', await page.evaluate(() => {
    const l = WA_TALLY.history()[0];
    return l.paid === 450 && l.costs > 0 && l.profit === 450 - l.costs;
  }));
  check('and how she did against spot across every load', await page.evaluate(() => {
    const life = WA_TALLY.lifetime();
    return life.loads === 1 && life.ratio > 0 && life.ratio < 1;
  }));
  await dismiss(page);
  await shot(page, '21-tally.png');

  /* ---------- what's in this thing ---------- */
  await page.goto(APP + '#/kit/teardown');
  await page.waitForSelector('.tile-btn[data-tile^="td:"]');
  await dismiss(page);
  check('the teardown catalogue is there',
    (await page.locator('.tile-btn[data-tile^="td:"]').count()) === 12);
  check('every tile leads with the verdict',
    /Strip it|Sell it whole|Leave it/.test(await page.textContent('.tile-btn[data-tile^="td:"] .tile-s')));

  await page.click('.tile-btn[data-tile="td:alternator"]');
  await page.waitForSelector('.sheet.is-open .td-verdict');
  check('an entry commits to an answer', (await page.locator('.td-verdict').count()) === 1);
  check('and gives her a way to remember it', (await page.locator('.td-hook b').count()) === 1);
  await page.click('.sheet-x');
  await page.waitForSelector('.sheet', { state: 'detached' });

  // The genuinely hazardous ones say so, in the same voice as everything else.
  await page.click('.tile-btn[data-tile="td:ewaste-board"]');
  await page.waitForSelector('.sheet.is-open');
  const gold = await page.textContent('.sheet-body');
  check('gold recovery teaches the safe way to realise it',
    /connectors|pins/i.test(gold) && /refiner/i.test(gold), { gold: gold.slice(0, 200) });
  check('and is straight about the chemistry rather than walking her through it',
    /acid/i.test(gold) && /not going to walk you through/i.test(gold));
  check('hazards are shown as warnings, not buried in bullets',
    (await page.locator('.td-danger').count()) === 1);
  await shot(page, '22-teardown.png');
  await page.click('.sheet-x');
  await page.waitForSelector('.sheet', { state: 'detached' });

  check('refrigerant work is named as licensed', await page.evaluate(() =>
    /licensed/i.test(WA_TEARDOWN.byId('compressor').danger)));
  check('burning insulation is called out as illegal', await page.evaluate(() =>
    WA_TEARDOWN.byId('loom').notes.some(n => /never burn/i.test(n))));

  /* ---------- ask old mate in her own words ---------- */
  await page.goto(APP + '#/doctor');
  await page.waitForSelector('#askBox');
  await dismiss(page);
  check('the corpus covers the whole app', await page.evaluate(() => WA_ASK.docCount() > 80));

  const asked = await page.evaluate(async () => {
    const q = (s) => WA_ASK.offline(s);
    return {
      holes: q('why is my weld full of little holes').answers[0].title,
      warp: q('how do I stop it warping').answers[0].title,
      crack: q('why did it crack days later').answers[0].title,
      groove: q('there is a groove along the edge of my weld').answers[0].title,
      burn: q('I blew a hole right through it').answers[0].title,
      wear: q('what do I need to wear').answers[0].title,
      nonsense: q('how do I make a lasagne').ok,
      nonsenseText: q('how do I make a lasagne').answers[0].text
    };
  });
  check('plain words find the right fault: holes → porosity', /porosity/i.test(asked.holes), asked);
  check('plain words find the right fault: warping → distortion', /distortion/i.test(asked.warp), asked);
  check('plain words find the right fault: late crack → cold cracking', /cold cracking/i.test(asked.crack), asked);
  check('plain words find the right fault: groove → undercut', /undercut/i.test(asked.groove), asked);
  check('plain words find the right fault: blew through → burn-through', /burn/i.test(asked.burn), asked);
  check('a topic question finds the lesson', /dressing/i.test(asked.wear), asked);

  // The rule the whole thing is built on.
  check('he says so rather than guessing', !asked.nonsense, asked);
  check('and says it plainly, without inventing welding advice',
    /not in what I have been taught|not going to.*guess/i.test(asked.nonsenseText), asked);

  check('a price question is answered from the price data', await page.evaluate(() => {
    WA_MARKET.state.rows = null;
    const r = WA_ASK.offline("what's copper running at");
    return r.answers[0].kind === 'price' && /copper/i.test(r.answers[0].text);
  }));
  check('price questions are recognised however she phrases them', await page.evaluate(() =>
    WA_ASK.looksLikePrice("what's gold worth") === 'gold' &&
    WA_ASK.looksLikePrice('how much is copper per kilo') === 'copper' &&
    WA_ASK.looksLikePrice('how do I weld copper') === null));

  /* ---------- sync (optional): off by default, safe when unreachable ---- */
  check('sync is off unless a server and code are both set',
    await page.evaluate(() => !WA_SYNC.isConfigured()));
  check('pushing with nothing configured is a no-op, not an error', await page.evaluate(async () => {
    const r = await WA_SYNC.push();
    return r.ok === false && r.reason === 'not configured';
  }));
  check('an unreachable server fails softly rather than throwing', await page.evaluate(async () => {
    WA_SYNC.save({ url: 'http://127.0.0.1:1', code: 'nope', auto: false });
    const push = await WA_SYNC.push();
    const pull = await WA_SYNC.pull();
    WA_SYNC.save({ url: '', code: '', auto: false });
    return push.ok === false && pull.ok === false;   // never throws, always resolves
  }));
  check('nothing here writes to progress unless a pull is explicitly applied',
    await page.evaluate(() => !WA_PROGRESS.settings().sync || !WA_PROGRESS.settings().sync.url));

  check('the AI upgrade is off unless she sets a key',
    await page.evaluate(() => !WA_ASK.isConfigured() && WA_ASK.providerName() === 'Off'));
  check('with no key it still answers, offline', await page.evaluate(async () => {
    const r = await WA_ASK.answer('why is my weld full of little holes');
    return r.source === 'offline' && r.ok;
  }));
  // Deliberately break it and prove it still answers. The failed request logs
  // a console error by design, so this test's own noise is discounted from the
  // page-error check below rather than the check being loosened — a real error
  // anywhere else in the run still fails the suite.
  const errorsBeforeBadKey = errors.length;
  check('a broken AI key falls back rather than failing', await page.evaluate(async () => {
    WA_ASK.save({ provider: 'custom', url: 'https://127.0.0.1:9/never', key: 'not-a-real-key' });
    const r = await WA_ASK.answer('why is my weld full of little holes');
    WA_ASK.save({ provider: 'off' });
    return r.source === 'offline' && r.ok;      // never throws, never blank
  }));
  const expectedFailureNoise = errors.length - errorsBeforeBadKey;
  errors.length = errorsBeforeBadKey;

  // The provider list must not offer anything a browser cannot actually reach.
  // OpenAI's API sends no CORS headers, so a direct call is blocked before it
  // leaves the phone — an option that can never work is worse than no option.
  await page.goto(APP + '#/settings');
  await page.waitForSelector('#chatProvider');
  await dismiss(page);
  check('no provider is offered that a browser would block', await page.evaluate(() =>
    [...document.querySelectorAll('#chatProvider option')].every(o => o.value !== 'openai')));
  check('the providers offered can actually reach their API', await page.evaluate(() => {
    const opts = [...document.querySelectorAll('#chatProvider option')].map(o => o.value);
    return opts.includes('anthropic') && opts.includes('custom') && opts.includes('off');
  }));

  // The whole round trip through the UI. Back to Old Mate — the provider
  // assertions above navigated to Settings.
  await page.goto(APP + '#/doctor');
  await page.waitForSelector('#askBox');
  await dismiss(page);
  await page.fill('#askBox', 'why is my weld full of little holes');
  await page.click('#askGo');
  await page.waitForSelector('.ask-answer');
  check('asking through the box shows an answer',
    (await page.textContent('.ask-answer')).length > 40);
  check('the answer points at where it came from',
    (await page.locator('.ask-src').count()) === 1);
  await shot(page, '20-ask.png');

  /* ---------- drive mode ---------- */
  await page.goto(APP + '#/drive');
  await page.waitForSelector('.tile-btn[data-tile^="drive:"]');
  await dismiss(page);
  check('drive mode offers the unlocked units',
    (await page.locator('.tile-btn[data-tile^="drive:"]').count()) >= 1);
  check('each unit shows how long it runs',
    /about \d+ min/.test(await page.textContent('.tile-btn[data-tile^="drive:"] .tile-s')));

  await page.goto(APP + '#/drive/safety');
  await page.waitForSelector('.drive-controls');
  await dismiss(page);
  check('drive mode builds a whole-unit playlist',
    await page.evaluate(() => WA_DRIVE.lineCount() > 20));
  check('the playlist is marked up lesson by lesson',
    await page.evaluate(() => WA_DRIVE.lessonMarks().length ===
      WA_CONTENT.modules.find(m => m.id === 'safety').lessons.length));
  // The unit intro plays before lesson one, so it belongs to no lesson.
  check('the unit is topped and tailed', await page.evaluate(() =>
    WA_DRIVE.position().lessonNumber === 0 && /Unit /.test(WA_DRIVE.position().line)));
  check('the screen says something during the intro',
    (await page.textContent('#drLesson')).trim().length > 0);

  await page.evaluate(() => WA_DRIVE.seek(WA_DRIVE.lessonMarks()[0].index));
  check('it says where she is, podcast style', await page.evaluate(() => {
    const p = WA_DRIVE.position();
    return /^\d+:\d\d$/.test(p.intoLesson) && /^\d+:\d\d$/.test(p.unitLeft) &&
      p.lessonNumber === 1 && p.lessonCount > 1;
  }));
  check('the timestamp is on screen', /in ·.*left in the unit/.test(await page.textContent('#drTimes')));

  // Skip should move a whole lesson, the way a podcast app does — that is what
  // the steering wheel button will be wired to.
  await page.click('#drNext');
  check('next jumps a whole lesson, not a sentence',
    await page.evaluate(() => WA_DRIVE.position().lessonNumber === 2));
  await page.click('#drPrev');
  check('previous goes back a lesson',
    await page.evaluate(() => WA_DRIVE.position().lessonNumber === 1));

  check('media session handlers are registered', await page.evaluate(() => {
    // Playback is not started here (no audio device in headless), so register
    // the session directly and confirm the wiring rather than the sound.
    if (!navigator.mediaSession) return true;      // unsupported: nothing to assert
    let seen = [];
    const orig = navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);
    navigator.mediaSession.setActionHandler = (k, fn) => { if (fn) seen.push(k); return orig(k, fn); };
    WA_DRIVE.seek(0);
    navigator.mediaSession.setActionHandler = orig;
    return ['play', 'pause', 'nexttrack', 'previoustrack'].every(k => seen.includes(k));
  }));

  check('where she got to is written down as it goes', await page.evaluate(() => {
    WA_DRIVE.seek(6);
    const s = WA_PROGRESS.settings().drive;
    return s && s.module === 'safety' && s.at === 6;
  }));
  check('a resumed unit picks up where it stopped', await page.evaluate(async () => {
    location.hash = '#/drive/safety';
    await new Promise(r => setTimeout(r, 260));
    return WA_DRIVE.position().index === 6;
  }));
  await page.goto(APP + '#/drive/safety');
  await page.waitForSelector('.drive-controls');
  await dismiss(page);
  await shot(page, '19-drive.png');

  /* Playing a unit end to end is the whole point, so it is tested end to end.
     Speech is stubbed to complete instantly — there is no audio device in
     headless Chromium — but everything else is the real code path. */
  const drive = await page.evaluate(async () => {
    ['safety-1', 'safety-2', 'safety-3', 'safety-4'].forEach(id => {
      delete WA_PROGRESS.state.lessons[id];
    });
    WA_PROGRESS.save ? WA_PROGRESS.save() : null;
    const spoken = [];
    window.speechSynthesis.speak = (u) => { spoken.push(u.text); setTimeout(() => u.onend && u.onend(), 3); };
    window.speechSynthesis.cancel = () => {};
    WA_DRIVE.seek(0);
    WA_DRIVE.play();
    await new Promise(r => setTimeout(r, 3000));
    const mod = WA_CONTENT.modules.find(m => m.id === 'safety');
    return {
      spoken: spoken.length,
      reachedEnd: WA_DRIVE.position().index >= WA_DRIVE.lineCount() - 1,
      stillPlaying: WA_DRIVE.isPlaying(),
      credited: mod.lessons.filter(l => WA_PROGRESS.isLessonDone(l.id)).length,
      lessons: mod.lessons.length,
      resumeCleared: !WA_PROGRESS.settings().drive
    };
  });
  check('a unit plays lesson into lesson without a tap', drive.spoken > 50, drive);
  check('it reaches the end and stops', drive.reachedEnd && !drive.stillPlaying, drive);
  check('every lesson listened to is credited, including the last',
    drive.credited === drive.lessons, drive);
  check('finishing clears the resume point', drive.resumeCleared, drive);

  /* ---------- the collection, and the bits from Mick ---------- */
  await page.goto(APP + '#/dolls');
  await page.waitForSelector('.doll-cell');
  await dismiss(page);
  check('the whole set is shown, earned or not',
    (await page.locator('.doll-cell').count()) === await page.evaluate(() => WA_DOLLS.dolls.length));
  check('unearned ones are silhouettes with no name given', await page.evaluate(() => {
    const locked = [...document.querySelectorAll('.doll-cell.is-locked')];
    return locked.length > 0 && locked.every(c => c.querySelector('.doll-name').textContent === '???');
  }));
  check('every doll can actually be earned by something', await page.evaluate(() =>
    WA_DOLLS.dolls.every(d => {
      const [kind, arg] = d.how.split(':');
      if (kind === 'module') return WA_CONTENT.modules.some(m => m.id === arg);
      return ['streak', 'drills', 'badges'].includes(kind) && Number(arg) > 0;
    })));
  check('there is always a next one to want', await page.evaluate(() => {
    const n = WA_DOLLS.nextUp();
    return n && n.hint.length > 3;
  }));
  check('it is honest about being a collection, not a game',
    /not a game to play/i.test(await page.textContent('#view')));

  // Finishing the first unit is what unlocks the first doll.
  check('finishing a unit unlocks its doll', await page.evaluate(() => {
    WA_PROGRESS.setSetting('dolls', []);
    const mod = WA_CONTENT.modules.find(m => m.id === 'safety');
    mod.lessons.forEach(l => { WA_PROGRESS.state.lessons[l.id] = true; });
    const fresh = WA_DOLLS.check();
    return fresh.some(d => d.id === 'arc') && WA_DOLLS.has('arc');
  }));
  check('and it only unlocks once', await page.evaluate(() => WA_DOLLS.check().length === 0));
  await page.goto(APP + '#/dolls');
  await page.waitForSelector('.doll-cell');
  await dismiss(page);
  await shot(page, '25-dolls.png');

  // The personal bits: hooks with placeholder content, all in one file.
  check('the unicorn is on the last tile of the first unit only', await page.evaluate(() => {
    const m = WA_CONTENT.modules.find(x => x.id === 'safety');
    const last = m.lessons[m.lessons.length - 1].id;
    const first = m.lessons[0].id;
    return WA_PERSONAL.isUnicornLesson('safety', last) &&
      !WA_PERSONAL.isUnicornLesson('safety', first) &&
      !WA_PERSONAL.isUnicornLesson('smaw', last);
  }));
  check('the hidden note needs a deliberate long press, not a tap', await page.evaluate(() =>
    WA_PERSONAL.HOLD_MS >= 500 && WA_PERSONAL.HOLDS_NEEDED >= 3));

  // It must be findable, so the press-and-hold is exercised for real.
  await page.goto(APP + '#/home');
  await page.waitForSelector('#heroHi');
  await dismiss(page);
  const box = await page.locator('#heroHi').boundingBox();
  for (let i = 0; i < 3; i++) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(820);
    await page.mouse.up();
    await page.waitForTimeout(60);
  }
  await page.waitForSelector('.note', { timeout: 3000 }).catch(() => {});
  check('three long presses on her name open the note',
    (await page.locator('.note').count()) === 1);
  check('the note leaves no trace in saved progress', await page.evaluate(() =>
    !JSON.stringify(WA_PROGRESS.state).toLowerCase().includes('unicorn') &&
    WA_PROGRESS.settings().note === undefined));
  await shot(page, '26-note.png');
  await page.click('.note-x');
  await page.waitForTimeout(320);
  check('and it closes cleanly', (await page.locator('.note').count()) === 0);

  /* ---------- where this comes from ---------- */
  await page.goto(APP + '#/sources');
  await page.waitForSelector('.src');
  await dismiss(page);
  check('every source is a real tappable link, not a name in prose',
    (await page.locator('.src[href^="https://"]').count()) >= 8);
  check('links open away from the app', await page.evaluate(() =>
    [...document.querySelectorAll('.src')].every(a =>
      a.target === '_blank' && /noopener/.test(a.rel))));
  check('no placeholder or search-page links', await page.evaluate(() =>
    WA_SOURCES.sources.every(s => !/example\.com|TODO|\?q=|\/search/i.test(s.url))));
  check('the standards behind the strongest claim are there', await page.evaluate(() => {
    const ids = WA_SOURCES.sources.map(s => s.id);
    return ids.includes('iarc') && ids.includes('as1338') && ids.includes('as1554-1');
  }));
  check('it says plainly that an AI wrote this', await page.evaluate(() =>
    WA_SOURCES.statement.some(p => /written by an AI/i.test(p))));
  check('and lists where the app is estimating rather than citing',
    (await page.locator('#view').textContent()).includes('Where this app is estimating'));
  check('estimates cover the guessy bits by name', await page.evaluate(() => {
    const all = WA_SOURCES.estimates.map(e => e.what.toLowerCase()).join(' | ');
    return /amperage/.test(all) && /scrap/.test(all) && /yard pays/.test(all);
  }));
  await shot(page, '23-sources.png');

  // The claim attached to the content, not buried three taps away.
  await page.goto(APP + '#/module/safety');
  await page.waitForSelector('.checked');
  await dismiss(page);
  check('a unit shows what it was checked against',
    (await page.locator('.checked a[href^="https://"]').count()) >= 1);

  /* ---------- the honest path to a ticket ---------- */
  await page.goto(APP + '#/ticket');
  await page.waitForSelector('.card--portfolio');
  await dismiss(page);
  const ticket = await page.textContent('#view');
  check('it says outright that the app does not certify her', /does not certify/i.test(ticket));
  check('it explains RPL rather than just naming it', /registered training organisation/i.test(ticket));
  check('the portfolio counts the evidence she has been collecting',
    (await page.locator('.port-row').count()) >= 5);
  check('it names what an assessor actually wants', /cut-and-etched|bend test/i.test(ticket));
  check('and makes no promises about time or cost',
    /No promises on time or cost/i.test(ticket));
  await shot(page, '24-ticket.png');

  /* ---------- settings, sound + AI plumbing ---------- */
  await page.goto(APP + '#/settings');
  await page.waitForSelector('.switch-track');
  await dismiss(page);
  await page.click('.switch-track');
  check('sound toggle persists', await page.evaluate(() => localStorage.getItem('weldAcademy.sound') === 'off'));
  await page.click('.switch-track');

  // Colours are changeable after the fact, without redoing the questions.
  check('every theme defines every token', await page.evaluate(() =>
    Object.values(WA_PROFILE.THEMES).every(t => t.name && t.accent && t.accent2 && t.glow && t.tint)));
  check('settings offers all six themes', (await page.locator('.theme-dot').count()) === 6);
  await page.click('.theme-dot[data-theme="gold"]');
  check('picking a theme recolours immediately', await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      === WA_PROFILE.THEMES.gold.accent));
  check('theme choice persists', await page.evaluate(() => WA_PROFILE.answers().colour === 'gold'));
  await page.click('.theme-dot[data-theme="steel"]');

  // Clearing the profile sends her back through the questions, keeping her XP.
  check('retake returns to the questions, progress intact', await page.evaluate(async () => {
    const xp = WA_PROGRESS.state.xp;
    WA_PROGRESS.setSetting('profile', null);
    location.hash = '#/home';
    await new Promise(r => setTimeout(r, 260));
    const asking = !!document.querySelector('.q-opt');
    WA_PROGRESS.setSetting('profile', { hands: 'bench', colour: 'steel', push: 'blunt', motivator: 'money' });
    location.hash = '#/settings';
    await new Promise(r => setTimeout(r, 260));
    return asking && WA_PROGRESS.state.xp === xp;
  }));
  await page.goto(APP + '#/settings');
  await page.waitForSelector('.switch-track');
  await dismiss(page);

  /* ---------- Old Mate's voice ---------- */
  check('two voice personas offered', (await page.locator('.persona').count()) === 2);
  check('the wise one is the default', await page.evaluate(() => WA_NARRATOR.currentPersona().id === 'wise'));
  check('wise is pitched low and unhurried', await page.evaluate(() => {
    const p = WA_NARRATOR.currentPersona();
    return p.pitch < 1 && p.rate < 1 && p.want === 'male';
  }));
  await page.click('.persona[data-persona="easy"]');
  check('persona switches and persists', await page.evaluate(() =>
    WA_NARRATOR.currentPersona().id === 'easy' &&
    localStorage.getItem('weldAcademy.readPersona') === 'easy'));
  await page.click('.persona[data-persona="wise"]');

  // Numbers and trade shorthand have to be spoken, not spelled out.
  check('numbers are spoken properly', await page.evaluate(() =>
    WA_SCRIPT.forSpeech('Run 3.2 mm rods at 90-120 A, gas 12–15 L/min.')
      === 'Run 3 point 2 millimetre rods at 90 to 120 amps, gas 12 to 15 litres per minute.'));
  check('trade shorthand is spoken, not spelled', await page.evaluate(() => {
    const s = WA_SCRIPT.forSpeech('GMAW per AS/NZS 1554.');
    return s.includes('mig welding') && s.includes('A S, N Z S');
  }));
  check('a whole unit assembles into a spoken script', await page.evaluate(() => {
    const m = WA_CONTENT.modules[2];
    const lines = WA_SCRIPT.unit(m);
    return lines.length > 20 &&
      lines[0].kind === 'intro' &&
      lines[lines.length - 1].kind === 'outro' &&
      lines.some(l => l.kind === 'link');
  }));
  check('diagrams are described rather than skipped', await page.evaluate(() => {
    const m = WA_CONTENT.modules.find(x => x.id === 'smaw');
    const les = m.lessons.find(l => l.id === 'smaw-3');
    return WA_SCRIPT.lesson(m, les).some(l => l.kind === 'diagram');
  }));

  check('AI scan is off by default', await page.evaluate(() => !WA_VISION.isConfigured()));
  check('no camera card while AI is off', await page.evaluate(async () => {
    location.hash = '#/doctor';
    await new Promise(r => setTimeout(r, 120));
    return document.querySelectorAll('#cameraCard').length === 0;
  }));
  await page.goto(APP + '#/settings');
  await page.waitForSelector('#visProvider');
  await page.selectOption('#visProvider', 'custom');
  await page.fill('#visEndpoint', 'https://example.invalid/weld');
  await page.click('#visSave');
  check('vision config saves', await page.evaluate(() => WA_VISION.isConfigured()));
  await shot(page, '12-settings.png');

  await page.goto(APP + '#/doctor');
  await page.waitForSelector('.clue');
  check('camera card appears once configured', (await page.locator('#cameraCard').count()) === 1);

  check('label mapping: porosity → holes clue', await page.evaluate(
    () => WA_VISION.cluesFor([{ label: 'porosity', score: 0.9 }]).includes('holes')));
  check('label mapping: coarse "bad weld" still maps', await page.evaluate(
    () => WA_VISION.cluesFor([{ label: 'Bad Weld', score: 0.8 }]).length > 0));
  check('label mapping ignores weak guesses', await page.evaluate(
    () => WA_VISION.cluesFor([{ label: 'undercut', score: 0.05 }]).length === 0));
  check('normaliser handles YOLO-style output', await page.evaluate(
    () => WA_VISION.normalise([{ class_name: 'Defect', confidence: 0.7, bbox: [1,2,3,4] }])[0].label === 'Defect'));

  // back to off, so the reload checks match a clean state
  await page.evaluate(() => WA_VISION.save({ provider: 'off' }));

  /* ---------- PWA ---------- */
  // Read from disk: file:// blocks fetch, and the manifest is static anyway.
  const manifest = JSON.parse(
    require('fs').readFileSync(path.resolve(__dirname, '..', 'manifest.json'), 'utf8'));
  check('manifest is installable (standalone + icons)',
    manifest.display === 'standalone' && manifest.icons.length >= 3 && !!manifest.start_url, manifest.display);
  check('manifest has a maskable icon for Android',
    manifest.icons.some(i => i.purpose === 'maskable'));

  /* ---------- persistence across reload ---------- */
  const xpFinal = await page.evaluate(() => WA_PROGRESS.state.xp);
  const badgeCount = await page.evaluate(() => WA_PROGRESS.state.badges.length);
  await page.goto(APP);
  await page.waitForSelector('.hero');
  const xpReload = await page.evaluate(() => WA_PROGRESS.state.xp);
  const badgeReload = await page.evaluate(() => WA_PROGRESS.state.badges.length);
  check('XP survives reload', xpReload === xpFinal, { xpFinal, xpReload });
  check('badges survive reload', badgeReload === badgeCount, { badgeCount, badgeReload });
  check('no welcome screen on return', (await page.locator('#wstart').count()) === 0);
  check('daily challenge not repeatable same day',
    (await page.locator('.card--daily.is-done').count()) === 1);

  /* ---------- diagrams ---------- */
  await page.goto(APP + '#/lesson/print/print-4');
  await page.waitForSelector('.prose');
  check('lesson renders its diagram', (await page.locator('.diagram svg').count()) >= 1);
  await shot(page, '15-diagram.png');
  await page.goto(APP);
  await page.waitForSelector('.hero');

  /* ---------- layout sanity ---------- */
  await dismiss(page);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow at 390px', overflow <= 0, { overflow });

  const smallTargets = await page.evaluate(() =>
    [...document.querySelectorAll('a.tab, .btn, .choice')]
      .filter(el => el.getBoundingClientRect().height < 40)
      .map(el => el.className + ' | ' + el.textContent.trim().slice(0, 30)));
  check('tap targets ≥ 40px tall', smallTargets.length === 0, { smallTargets });

  /* ---------- desktop shot ---------- */
  const tablet = await ctx.newPage();
  await tablet.setViewportSize({ width: 800, height: 1280 });
  await tablet.goto(APP);
  await tablet.waitForSelector('.hero');
  await shot(tablet, '13-tablet-home.png');
  await tablet.goto(APP + '#/lesson/print/print-1');
  await tablet.waitForSelector('.prose, .tiles, .guts, .drill, .cards');
  await shot(tablet, '14-tablet-lesson.png');
  const tabletOverflow = await tablet.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow at 800px tablet', tabletOverflow <= 0, { tabletOverflow });

  const wide = await ctx.newPage();
  await wide.setViewportSize({ width: 1180, height: 900 });
  await wide.goto(APP);
  await wide.waitForSelector('.hero');
  await shot(wide, '11-desktop.png');
  const wideOverflow = await wide.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow at 1180px', wideOverflow <= 0, { wideOverflow });

  // Only the deliberate broken-key request above is discounted, and it is
  // reported so a silently growing pile of "expected" noise stays visible.
  check('no page errors', errors.length === 0,
    { errors: errors.slice(0, 5), discountedFromTheBadKeyTest: expectedFailureNoise });
  check('offline price failure is handled, not thrown',
    await page.evaluate(async () => {
      const r = await WA_MARKET.refresh({ force: true });
      return r && typeof r === 'object' && !WA_MARKET.state.loading;
    }));

  /* ---------- install nudge: iOS gets words, an installed app gets nothing ---------- */
  const iosCtx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15'
  });
  const iosPage = await iosCtx.newPage();
  await iosPage.goto(APP);
  await iosPage.waitForSelector('#wstart');
  check('iPhone gets plain Share-sheet words, since there is no install button to give it',
    await iosPage.evaluate(() => {
      const banner = document.querySelector('.install-banner');
      return !!banner && /Add to Home Screen/i.test(banner.textContent) && !banner.querySelector('button');
    }));
  await iosCtx.close();

  const installedCtx = await browser.newContext();
  await installedCtx.addInitScript(() => {
    const real = window.matchMedia ? window.matchMedia.bind(window) : null;
    window.matchMedia = function (q) {
      if (/display-mode:\s*standalone/.test(q)) return { matches: true, addListener() {}, removeListener() {} };
      return real ? real(q) : { matches: false, addListener() {}, removeListener() {} };
    };
  });
  const installedPage = await installedCtx.newPage();
  await installedPage.goto(APP);
  await installedPage.waitForSelector('#wstart');
  check('already installed and running as the app itself — no nudge to add what she already has',
    await installedPage.evaluate(() => !document.querySelector('.install-banner')));
  await installedCtx.close();

  await browser.close();

  const failed = checks.filter(c => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})();

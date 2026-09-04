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

  /* ---------- onboarding: name, then the eight profile questions ---------- */
  await page.waitForSelector('#wstart');
  await shot(page, '01-welcome.png');
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
  check('nine modules on the map', (await page.locator('.node').count()) === 9);
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
    (await page.locator('.drawer-item').count()) === 9 + 5 + 2);
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
  check('module 2 unlocked after module 1 passed', locked === 7, { lockedCards: locked });
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

  check('no page errors', errors.length === 0, errors.slice(0, 5));
  check('offline price failure is handled, not thrown',
    await page.evaluate(async () => {
      const r = await WA_MARKET.refresh({ force: true });
      return r && typeof r === 'object' && !WA_MARKET.state.loading;
    }));

  await browser.close();

  const failed = checks.filter(c => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})();

const { chromium } = require('playwright');
const path = require('path');

const APP = 'file://' + path.resolve(__dirname, '..', 'index.html');
const SHOTS = process.env.WA_SHOTS || null;   // set to a directory to also capture screenshots

async function shot(page, name) {
  if (SHOTS) await page.screenshot({ path: require('path').join(SHOTS, name), fullPage: true });
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
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(APP);

  /* ---------- onboarding ---------- */
  await page.waitForSelector('#wstart');
  await shot(page, '01-welcome.png');
  await page.fill('#wname', 'Tess');
  await page.click('#wstart');
  await page.waitForSelector('.hero');
  check('onboarding → home', (await page.textContent('.hero-hi')).includes('Tess'));
  check('six modules on path', (await page.locator('.path-row').count()) === 6);
  check('header shows level 1', (await page.textContent('.hdr-lvl')) === '1');

  /* ---------- daily challenge ---------- */
  const xpBefore = parseInt(await page.textContent('.hdr-stat b'), 10);
  const dailyCorrect = await page.evaluate(() => WA_PROGRESS.dailyChallenge().item.question.correct);
  await page.click(`[data-daily="${dailyCorrect}"]`);
  await page.waitForSelector('.explain');
  const xpAfterDaily = parseInt(await page.textContent('.hdr-stat b'), 10);
  check('daily challenge awards 20 XP', xpAfterDaily === xpBefore + 20, { xpBefore, xpAfterDaily });
  await shot(page, '02-home.png');

  /* ---------- lesson flow ---------- */
  await page.click('.card--continue');
  await page.waitForSelector('.prose');
  check('lesson opens with prose + key points', (await page.locator('.keybox li').count()) >= 3);
  await shot(page, '03-lesson.png');
  await page.click('#doneBtn');
  await page.waitForURL('**#/lesson/safety/safety-2');
  await page.waitForSelector('.prose');
  const xpAfterLesson = parseInt(await page.textContent('.hdr-stat b'), 10);
  check('lesson gives 10 XP and advances', xpAfterLesson === xpAfterDaily + 10, { xpAfterLesson });
  check('badge First Spark earned', await page.evaluate(() => WA_PROGRESS.hasBadge('first-spark')));

  /* ---------- finish the safety module's lessons ---------- */
  for (const next of ['safety-3', 'safety-4']) {
    await page.click('#doneBtn');
    await page.waitForURL('**#/lesson/safety/' + next);
    await page.waitForSelector('.prose');
  }
  await page.click('#doneBtn');
  await page.waitForURL('**#/quiz/safety');
  const url = page.url();
  check('last lesson leads to the quiz', url.includes('#/quiz/safety'), { url });

  /* ---------- quiz, answered correctly ---------- */
  await page.waitForSelector('.q-h');
  const answers = await page.evaluate(() =>
    WA_CONTENT.modules.find(m => m.id === 'safety').quiz.map(q => q.correct));
  for (let i = 0; i < answers.length; i++) {
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
  check('safety module marked complete', await page.evaluate(() => WA_PROGRESS.moduleComplete('safety')));
  check('Perfect Pass badge', await page.evaluate(() => WA_PROGRESS.hasBadge('perfect-pass')));
  check('Safety badge', await page.evaluate(() => WA_PROGRESS.hasBadge('safety')));
  check('level up past level 1', await page.evaluate(() => WA_PROGRESS.level()) >= 2);
  await shot(page, '05-result.png');

  /* ---------- module 2 now unlocked ---------- */
  await page.goto(APP + '#/course');
  await page.waitForSelector('.card--module');
  const locked = await page.locator('.card--module.is-locked').count();
  check('module 2 unlocked after module 1 passed', locked === 4, { lockedCards: locked });
  await shot(page, '06-course.png');

  /* ---------- weld doctor ---------- */
  await page.goto(APP + '#/doctor');
  await page.waitForSelector('.clue');
  check('all clues rendered', (await page.locator('.clue').count()) === 15);
  await page.click('#dxBtn');                       // nothing ticked → warn, no results
  check('diagnose with no clues warns', (await page.locator('.card--dx').count()) === 0);
  await page.click('.clue:has(input[data-clue="holes"])');
  await page.click('.clue:has(input[data-clue="windy"])');
  await page.click('#dxBtn');
  await page.waitForSelector('.card--dx');
  const topDx = await page.textContent('.card--dx.is-top h3');
  check('porosity ranked top for holes + wind', topDx.includes('Porosity'), { topDx });
  check('fix-now steps present', (await page.locator('.dx-sec--fix li').count()) > 0);
  check('Field Medic badge', await page.evaluate(() => WA_PROGRESS.hasBadge('field-medic')));
  await shot(page, '07-doctor.png');

  // a second, different symptom set must give a different answer
  await page.click('#dxAgain');
  await page.waitForSelector('.clue');
  await page.click('.clue:has(input[data-clue="crack-late"])');
  await page.click('#dxBtn');
  await page.waitForSelector('.card--dx');
  const topDx2 = await page.textContent('.card--dx.is-top h3');
  check('delayed crack → cold cracking', topDx2.includes('Cold cracking'), { topDx2 });

  /* ---------- field kit ---------- */
  await page.goto(APP + '#/kit/checklist');
  await page.waitForSelector('.check');
  const boxes = await page.locator('.check').count();
  await page.click('.card--check .check');
  check('checklist ticks persist to state',
    await page.evaluate(() => Object.keys(WA_PROGRESS.state.checklist).length === 1), { boxes });
  await shot(page, '08-checklist.png');

  await page.goto(APP + '#/kit/sheets');
  await page.waitForSelector('table');
  check('four cheat sheets render', (await page.locator('.card--sheet').count()) === 4);
  await shot(page, '09-sheets.png');

  await page.goto(APP + '#/kit/log');
  await page.waitForSelector('#logSave');
  await page.fill('#logNote', 'First fillet on 3 mm, MIG 18 V / 5 m/min. Undercut on the top edge.');
  await page.fill('#logDx', 'Undercut');
  await page.click('#logSave');
  await page.waitForSelector('.card--log');
  check('log entry saved', (await page.locator('.card--log').count()) === 1);
  check('Logbook badge', await page.evaluate(() => WA_PROGRESS.hasBadge('logbook')));
  await shot(page, '10-log.png');

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

  /* ---------- layout sanity ---------- */
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow at 390px', overflow <= 0, { overflow });

  const smallTargets = await page.evaluate(() =>
    [...document.querySelectorAll('a.tab, .btn, .choice')]
      .filter(el => el.getBoundingClientRect().height < 40)
      .map(el => el.className + ' | ' + el.textContent.trim().slice(0, 30)));
  check('tap targets ≥ 40px tall', smallTargets.length === 0, { smallTargets });

  /* ---------- desktop shot ---------- */
  const wide = await ctx.newPage();
  await wide.setViewportSize({ width: 1180, height: 900 });
  await wide.goto(APP);
  await wide.waitForSelector('.hero');
  await shot(wide, '11-desktop.png');
  const wideOverflow = await wide.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('no horizontal overflow at 1180px', wideOverflow <= 0, { wideOverflow });

  check('no page errors', errors.length === 0, errors.slice(0, 5));

  await browser.close();

  const failed = checks.filter(c => !c.ok);
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})();

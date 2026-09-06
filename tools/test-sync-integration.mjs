/* Proves the actual point of the sync feature: progress made on one "device"
 * (browser context, no shared storage) shows up on a second one after a push
 * and a pull, through the real server — not each half mocked separately.
 *
 * Run: NODE_PATH=/opt/node22/lib/node_modules node weld-academy/tools/test-sync-integration.mjs
 */
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { existsSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';

// ESM's resolver ignores NODE_PATH (CJS-only), so reach for playwright via a
// CJS require the same way tools/e2e-smoke.cjs does — no separate install.
const { chromium } = createRequire(import.meta.url)('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const PORT = 8798;
const SERVER_URL = `http://127.0.0.1:${PORT}`;
const APP = 'file://' + join(root, 'index.html');
const CODE = 'integrationtest' + Date.now();
const dataFile = join(root, 'server', 'data', CODE.toLowerCase() + '.json');

const checks = [];
function check(name, cond, extra) {
  checks.push({ name, ok: !!cond });
  console.log((cond ? '✓ ' : '✗ ') + name + (cond ? '' : '   << ' + JSON.stringify(extra)));
}

const proc = spawn(process.execPath, [join(root, 'server', 'index.js')], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'inherit']
});
let started = false;
proc.stdout.on('data', (d) => { if (d.toString().includes('Weld Academy server')) started = true; });
for (let i = 0; i < 50 && !started; i++) await delay(100);
check('server starts for the integration run', started);

const browser = await chromium.launch();

try {
  // ---- device 1: makes progress, pushes it ----
  const ctx1 = await browser.newContext();
  const page1 = await ctx1.newPage();
  await page1.goto(APP);
  await page1.waitForSelector('#wstart');

  const push = await page1.evaluate(async ({ url, code }) => {
    WA_PROGRESS.setName('Niki');
    WA_PROGRESS.state.xp = 777;
    WA_PROGRESS.state.badges = ['first-spark', 'safety'];
    // A real device reaching home has always finished the profile questions
    // too — the router requires both. Skipping this would make device 2
    // land back on onboarding after the pull, which is correct behaviour
    // for an incomplete profile, not a sync bug — so match reality here.
    WA_PROFILE.save({ hands: 'bench', colour: 'copper', push: 'blunt', motivator: 'money' });
    WA_SYNC.save({ url, code, auto: false });
    return await WA_SYNC.push();
  }, { url: SERVER_URL, code: CODE });
  check('device 1 pushes successfully', push.ok === true, push);

  await ctx1.close();

  // ---- device 2: a genuinely fresh context, no shared storage at all ----
  const ctx2 = await browser.newContext();
  const page2 = await ctx2.newPage();
  await page2.goto(APP);
  await page2.waitForSelector('#wstart');   // fresh device — never seen this before

  const before = await page2.evaluate(() => WA_PROGRESS.state.name);
  check('device 2 genuinely starts with nothing', !before);

  const pullResult = await page2.evaluate(async ({ url, code }) => {
    WA_SYNC.save({ url, code, auto: false });
    return await WA_SYNC.pullAndApply();
  }, { url: SERVER_URL, code: CODE });
  check('device 2 pulls successfully', pullResult.ok === true, pullResult);

  const after = await page2.evaluate(() => ({
    name: WA_PROGRESS.state.name, xp: WA_PROGRESS.state.xp, badges: WA_PROGRESS.state.badges,
    profile: WA_PROFILE.answers()
  }));
  check('her name made it across', after.name === 'Niki', after);
  check('her XP made it across', after.xp === 777, after);
  check('her badges made it across', JSON.stringify(after.badges) === JSON.stringify(['first-spark', 'safety']), after);
  check('her profile answers made it across too', after.profile && after.profile.colour === 'copper', after);

  // A reload on device 2 must not need the network again, and must land on
  // home rather than onboarding — it is real localStorage now, complete
  // profile and all, not a cache of the network.
  await page2.reload();
  await page2.waitForSelector('.hero', { timeout: 5000 });
  const afterReload = await page2.evaluate(() => WA_PROGRESS.state.name);
  check('and it survives a reload — it is real local state now, not a cache of the network',
    afterReload === 'Niki');

  await ctx2.close();

  // ---- wrong code sees nothing of either device ----
  const ctx3 = await browser.newContext();
  const page3 = await ctx3.newPage();
  await page3.goto(APP);
  await page3.waitForSelector('#wstart');
  const wrongCode = await page3.evaluate(async (url) => {
    WA_SYNC.save({ url, code: 'someone-elses-code-entirely', auto: false });
    return await WA_SYNC.pull();
  }, SERVER_URL);
  check('a different code sees none of it', wrongCode.ok === false);
  await ctx3.close();

} finally {
  await browser.close();
  proc.kill();
  if (existsSync(dataFile)) rmSync(dataFile);
}

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);

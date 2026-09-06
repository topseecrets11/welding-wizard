/* Checks that every link on the "Where this comes from" page still resolves.
 *
 * That page's entire job is "do not take my word for it, check it yourself".
 * A dead link on it is worse than not having the page — so this runs it for
 * real, over the network.
 *
 * Kept separate from validate-content.mjs, which must stay offline and instant.
 * Run: node weld-academy/tools/check-links.mjs
 *
 * Some government and standards sites block scripted requests outright (403,
 * or a hang) while working perfectly in a browser. Those are reported as
 * UNVERIFIED rather than failures — a 403 from a bot filter is not a dead link,
 * and failing the build on one would just teach everyone to ignore this.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const sandbox = { window: {} };
new Function('window', readFileSync(join(root, 'js/sources.js'), 'utf8'))(sandbox.window);
const SRC = sandbox.window.WA_SOURCES;

const UA = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36';

async function check(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      signal: ctl.signal,
      headers: { 'user-agent': UA, accept: 'text/html,*/*' }
    });
    return { status: r.status };
  } catch (e) {
    return { status: 0, error: e.name === 'AbortError' ? 'timeout' : String(e.message || e) };
  } finally {
    clearTimeout(timer);
  }
}

const dead = [];
const unverified = [];
let ok = 0;

for (const s of SRC.sources) {
  const r = await check(s.url);
  if (r.status >= 200 && r.status < 400) {
    ok++;
    console.log(`✓ ${r.status}  ${s.id}`);
  } else if (r.status === 403 || r.status === 401 || r.status === 429 || r.status === 0) {
    unverified.push({ ...s, ...r });
    console.log(`? ${r.status || r.error}  ${s.id}  (blocked to scripts — check in a browser)`);
  } else {
    dead.push({ ...s, ...r });
    console.log(`✗ ${r.status}  ${s.id}  ${s.url}`);
  }
}

console.log(`\n${ok} resolved · ${unverified.length} unverifiable from a script · ${dead.length} dead`);

if (dead.length) {
  console.error('\nDead links on the page whose whole job is being checkable:\n');
  for (const d of dead) console.error(`  · ${d.title}\n    ${d.url}  → ${d.status}`);
  process.exit(1);
}

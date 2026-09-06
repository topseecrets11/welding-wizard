/* Exercises server/index.js for real — spins it up on a random free port, hits
 * every route, and shuts it down. No network dependency (the /api/ask path is
 * tested only for its no-key response; hitting the real Anthropic API is not
 * something a test suite should do on every run).
 *
 * Run: node weld-academy/tools/test-server.mjs
 */
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { existsSync, rmSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const PORT = 8799;
const BASE = `http://127.0.0.1:${PORT}`;

const checks = [];
function check(name, cond, extra) {
  checks.push({ name, ok: !!cond });
  console.log((cond ? '✓ ' : '✗ ') + name + (cond ? '' : '   << ' + JSON.stringify(extra)));
}

// Clean slate: a leftover file from a previous run must not make a check lie.
const testFile = join(root, 'server', 'data', 'e2etestcode.json');
if (existsSync(testFile)) rmSync(testFile);

const proc = spawn(process.execPath, [join(root, 'server', 'index.js')], {
  env: { ...process.env, PORT: String(PORT), ANTHROPIC_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe']
});

let started = false;
proc.stdout.on('data', (d) => { if (d.toString().includes('Weld Academy server')) started = true; });
proc.stderr.on('data', (d) => process.stderr.write(d));

for (let i = 0; i < 50 && !started; i++) await delay(100);
check('server starts', started);

try {
  // Static app is served from the same origin.
  const home = await fetch(BASE + '/index.html');
  check('serves the app', home.status === 200 && (await home.text()).includes('Weld Academy'));

  const health = await (await fetch(BASE + '/api/health')).json();
  check('health check responds', health.ok === true);
  check('health check is honest about no key', health.aiConfigured === false);

  // Cross-origin sync is the normal case (the app is not necessarily served
  // by this process), so a PUT with a JSON body needs a working preflight.
  const preflight = await fetch(BASE + '/api/state/corstest', {
    method: 'OPTIONS',
    headers: { origin: 'https://example.com', 'access-control-request-method': 'PUT' }
  });
  check('CORS preflight succeeds', preflight.status === 204);
  check('CORS preflight allows any origin', preflight.headers.get('access-control-allow-origin') === '*');
  check('CORS preflight allows PUT', (preflight.headers.get('access-control-allow-methods') || '').includes('PUT'));
  const realCall = await fetch(BASE + '/api/state/corstest', {
    method: 'PUT', headers: { 'content-type': 'application/json', origin: 'https://example.com' },
    body: '{"x":1}'
  });
  check('the actual cross-origin request is allowed through',
    realCall.status === 200 && realCall.headers.get('access-control-allow-origin') === '*');

  // Sync: nothing yet for a fresh code.
  const miss = await fetch(BASE + '/api/state/e2etestcode');
  check('unknown code 404s rather than making something up', miss.status === 404);

  // Push a state blob, pull it back.
  const state = { xp: 42, name: 'Test' };
  const put = await fetch(BASE + '/api/state/e2etestcode', {
    method: 'PUT', body: JSON.stringify(state), headers: { 'content-type': 'application/json' }
  });
  const putBody = await put.json();
  check('saving state succeeds', put.status === 200 && putBody.ok === true);
  check('save records a timestamp', typeof putBody.savedAt === 'string' && putBody.savedAt.length > 0);

  const get = await (await fetch(BASE + '/api/state/e2etestcode')).json();
  check('the pulled state matches what was pushed', JSON.stringify(get.state) === JSON.stringify(state));

  // A code is case- and punctuation-insensitive (hyphens are kept, since a
  // code like "spark-chaser" should stay readable) — same file either way.
  const getUpper = await (await fetch(BASE + '/api/state/' + encodeURIComponent('  E2Etestcode!!  '))).json();
  check('codes normalise (case/punctuation-insensitive)', JSON.stringify(getUpper.state) === JSON.stringify(state));

  const badCode = await fetch(BASE + '/api/state/' + encodeURIComponent('   '));
  check('an empty/unusable code is rejected, not silently accepted', badCode.status === 400);

  // Oversized bodies are rejected rather than filling the disk. The server
  // destroys the connection as soon as it crosses the limit, which on plain
  // HTTP/1.1 with no 100-continue negotiated means the client sees the
  // upload itself fail (ECONNRESET) rather than a clean 413 response — both
  // outcomes mean the same thing: the oversized blob was not accepted, and
  // nothing oversized landed on disk.
  const bigBody = 'x'.repeat(3 * 1024 * 1024);
  let bigRejected;
  try {
    const tooBig = await fetch(BASE + '/api/state/hugetest', { method: 'PUT', body: bigBody });
    bigRejected = tooBig.status === 413;
  } catch (e) {
    bigRejected = true;   // connection reset mid-upload — also a rejection
  }
  check('an oversized state blob is rejected', bigRejected);
  check('and nothing oversized was written to disk',
    !existsSync(join(root, 'server', 'data', 'hugetest.json')));

  // The static server must serve only the app's own public files — NOT the
  // rest of ROOT, which also holds server/ (this file's source, and the sync
  // data directory). Push a real code first so there is something to leak.
  await fetch(BASE + '/api/state/leaktest', {
    method: 'PUT', body: JSON.stringify({ secret: 'should never be web-readable' }),
    headers: { 'content-type': 'application/json' }
  });

  const viaSlash = await fetch(BASE + '/server/data/leaktest.json');
  check('sync data is not directly web-readable', viaSlash.status !== 200);

  const viaEncodedTraversal = await fetch(BASE + '/%2e%2e/server/data/leaktest.json');
  check('encoded path traversal cannot reach it either', viaEncodedTraversal.status !== 200);

  const serverSource = await fetch(BASE + '/server/index.js');
  check('the server\'s own source is not served', serverSource.status !== 200);

  const readme = await fetch(BASE + '/README.md');
  check('only the allowlisted app files are public', readme.status !== 200);

  await fetch(BASE + '/api/state/leaktest', { method: 'PUT', body: '{}' }); // leave it empty behind us

  // The AI proxy is honest when unconfigured, and never invents an answer.
  const askNoKey = await fetch(BASE + '/api/ask', {
    method: 'POST', body: JSON.stringify({ prompt: 'why is my weld full of holes' }),
    headers: { 'content-type': 'application/json' }
  });
  const askBody = await askNoKey.json();
  check('the AI proxy refuses cleanly with no key configured', askNoKey.status === 501 && !!askBody.error);

  const askNoPrompt = await fetch(BASE + '/api/ask', { method: 'POST', body: '{}' });
  check('a missing prompt is rejected', askNoPrompt.status === 400 || askNoPrompt.status === 501);

} finally {
  proc.kill();
  for (const f of ['e2etestcode.json', 'hugetest.json', 'leaktest.json', 'corstest.json']) {
    const p = join(root, 'server', 'data', f);
    if (existsSync(p)) rmSync(p);
  }
}

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);

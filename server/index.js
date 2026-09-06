#!/usr/bin/env node
/* ============================================================================
 * WELD ACADEMY — SERVER
 * ----------------------------------------------------------------------------
 * A toy backend, on purpose. Zero npm dependencies — `node server/index.js`
 * and it runs, anywhere Node runs, with nothing to `npm install`, nothing to
 * go stale, nothing supply-chain-shaped to audit.
 *
 * WHAT IT DOES, and no more:
 *
 *   1. SERVES THE APP. One process, one port — the frontend and the API
 *      answer from the same origin, so there is nothing to deploy separately
 *      and no CORS to fight.
 *
 *   2. SYNC. She picks a code (any string) in Settings and the same code on a
 *      second device pulls her progress across. That is the entire account
 *      model — no passwords, no email, no login flow to explain to someone
 *      who does not want one. A code is a JSON file on disk; lose the code,
 *      lose the sync, same as losing a diary.
 *
 *   3. THE AI PROXY. `js/ask.js` already builds a grounded prompt from the
 *      app's own content. This forwards it to Anthropic using a key that
 *      lives in this process's environment, never the browser's — which
 *      incidentally fixes the whole class of bug that broke the OpenAI
 *      option (a browser calling a provider's API directly hits CORS; a
 *      server calling it does not).
 *
 * WHAT IT DELIBERATELY DOES NOT DO: real auth, rate limiting beyond a crude
 * cap, HTTPS termination (put it behind a reverse proxy for that), or replace
 * the offline-first app. Every client feature keeps working with this
 * process switched off — sync and the AI proxy are additions, not the
 * foundation. That foundation stays localStorage and stays offline-first;
 * this is what "full stack" adds on top of it, not instead of it.
 * ==========================================================================*/

'use strict';

const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.join(__dirname, '..');          // weld-academy/, the static app
const DATA = path.join(__dirname, 'data');
const PORT = parseInt(process.env.PORT, 10) || 8787;
const MAX_BODY = 2 * 1024 * 1024;                  // 2 MB — a generous state blob, not a file host

fs.mkdirSync(DATA, { recursive: true });

/* ------------------------------------------------------------------ mime */

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

/* ------------------------------------------------------------- sync codes
 * A code is whatever she types, normalised to something safe for a filename.
 * That normalisation is also the entire security model: it is obscurity, not
 * a password, and the server-side comment says so plainly rather than
 * pretending otherwise. */

function codeToFile(code) {
  const safe = String(code || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 64);
  if (!safe) return null;
  return path.join(DATA, safe + '.json');
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(Object.assign(new Error('too large'), { code: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function json(res, status, body) {
  const buf = Buffer.from(JSON.stringify(body));
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': buf.length });
  res.end(buf);
}

/* ---------------------------------------------------------------- routes */

async function handleState(req, res, code) {
  const file = codeToFile(code);
  if (!file) return json(res, 400, { error: 'bad code' });

  if (req.method === 'GET') {
    if (!fs.existsSync(file)) return json(res, 404, { error: 'no state for that code yet' });
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      return json(res, 200, { ok: true, state: data.state, savedAt: data.savedAt });
    } catch (e) {
      return json(res, 500, { error: 'stored state is corrupt' });
    }
  }

  if (req.method === 'PUT') {
    let body;
    try { body = await readBody(req, MAX_BODY); }
    catch (e) { return json(res, e.code || 500, { error: e.message }); }
    let parsed;
    try { parsed = JSON.parse(body.toString('utf8')); }
    catch (e) { return json(res, 400, { error: 'bad JSON' }); }
    if (!parsed || typeof parsed !== 'object') return json(res, 400, { error: 'expected a state object' });

    const record = { state: parsed, savedAt: new Date().toISOString() };
    fs.writeFileSync(file, JSON.stringify(record));
    return json(res, 200, { ok: true, savedAt: record.savedAt });
  }

  return json(res, 405, { error: 'GET or PUT only' });
}

/* The AI upgrade for Ask Old Mate. js/ask.js sends { prompt }: the grounded
   text it already built from the app's own matched content — this endpoint
   never sees the raw question without that grounding, and never decides on
   its own what counts as an answer; it is a pipe, not a second brain. */
async function handleAsk(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json(res, 501, { error: 'ANTHROPIC_API_KEY is not set on this server' });

  let body;
  try { body = await readBody(req, 32 * 1024); }
  catch (e) { return json(res, e.code || 500, { error: e.message }); }
  let parsed;
  try { parsed = JSON.parse(body.toString('utf8')); }
  catch (e) { return json(res, 400, { error: 'bad JSON' }); }
  const prompt = String((parsed && parsed.prompt) || '').slice(0, 8000);
  if (!prompt) return json(res, 400, { error: 'missing prompt' });

  const payload = JSON.stringify({
    model: process.env.ANTHROPIC_MODEL || 'claude-opus-5',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }]
  });

  const upstream = await new Promise((resolve) => {
    const r = https.request({
      hostname: 'api.anthropic.com', path: '/v1/messages', method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-length': Buffer.byteLength(payload)
      },
      timeout: 20000
    }, (upstreamRes) => {
      const chunks = [];
      upstreamRes.on('data', (c) => chunks.push(c));
      upstreamRes.on('end', () => resolve({ status: upstreamRes.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    r.on('error', (e) => resolve({ status: 0, error: e.message }));
    r.on('timeout', () => { r.destroy(); resolve({ status: 0, error: 'timeout' }); });
    r.write(payload);
    r.end();
  });

  if (!upstream.status) return json(res, 502, { error: 'could not reach Anthropic', detail: upstream.error });
  if (upstream.status >= 400) return json(res, 502, { error: 'Anthropic returned an error', status: upstream.status });

  let text = '';
  try {
    const j = JSON.parse(upstream.body);
    text = (j && j.content && j.content[0] && j.content[0].text) || '';
  } catch (e) { /* fall through with empty text */ }

  return json(res, 200, { ok: true, text });
}

/* ------------------------------------------------------------ static app
 *
 * ROOT is weld-academy/ — which also contains server/, holding this file's
 * own source AND the sync data directory. "Serve anything under ROOT" would
 * therefore serve /server/data/<her-sync-code>.json to anyone who requested
 * it, straight past the API entirely — the state blob has no protection
 * beyond the API not handing it out, so the static handler handing it out
 * anyway would undo that completely. Path-normalising against ROOT stops
 * literal ../ traversal, but does not stop a request for a path that is
 * legitimately inside ROOT and simply should not be public.
 *
 * So: an explicit allowlist of what this app actually ships, not "everything
 * that happens to be on disk next to it". */
const PUBLIC_TOP = new Set([
  'index.html', 'manifest.json', 'service-worker.js',
  'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png'
]);
const PUBLIC_DIRS = ['css/', 'js/'];

function isPublic(rel) {
  if (PUBLIC_TOP.has(rel)) return true;
  return PUBLIC_DIRS.some((d) => rel.startsWith(d));
}

function serveStatic(req, res, urlPath) {
  let rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  rel = decodeURIComponent(rel.split('?')[0]);

  // Collapse any ./ or ../ segments before the allowlist check, so an
  // encoded traversal cannot smuggle a disallowed path through as one that
  // merely looks fine.
  const normalised = path.normalize(rel).replace(/^(\.\.[/\\])+/, '');

  if (!isPublic(normalised)) { res.writeHead(404); return res.end('not found'); }

  const full = path.join(ROOT, normalised);
  if (!full.startsWith(ROOT + path.sep) && full !== ROOT) { res.writeHead(404); return res.end('not found'); }

  fs.readFile(full, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    const ext = path.extname(full);
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' });
    res.end(buf);
  });
}

/* --------------------------------------------------------------- server */

/* CORS. The app is not necessarily served BY this process — it might be a
   GitHub Pages copy, the file:// cached PWA, or a server on another machine
   entirely, all pointed at this one as their sync target. That makes every
   /api/* call cross-origin from the browser's point of view, and a PUT with
   a JSON body is a "non-simple" request: the browser sends an OPTIONS
   preflight first and refuses the real request if that preflight comes back
   without permission. Wildcard is deliberate — this is a single-user toy
   with no cookies and no credentialed requests, so there is no session to
   leak by allowing any origin to ask it a question. */
function withCors(res) {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'GET, PUT, POST, OPTIONS');
  res.setHeader('access-control-allow-headers', 'content-type, authorization');
}

const server = http.createServer((req, res) => {
  const url = req.url || '/';

  if (url.startsWith('/api/')) {
    withCors(res);
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  }

  if (url === '/api/health') return json(res, 200, { ok: true, aiConfigured: !!process.env.ANTHROPIC_API_KEY });

  if (url.startsWith('/api/state/')) {
    const code = decodeURIComponent(url.slice('/api/state/'.length));
    return handleState(req, res, code);
  }

  if (url === '/api/ask') return handleAsk(req, res);

  return serveStatic(req, res, url);
});

server.listen(PORT, () => {
  console.log(`Weld Academy server on http://localhost:${PORT}`);
  console.log(process.env.ANTHROPIC_API_KEY
    ? '  AI proxy: configured (ANTHROPIC_API_KEY set)'
    : '  AI proxy: off — set ANTHROPIC_API_KEY to enable it');
});

module.exports = { server, codeToFile };

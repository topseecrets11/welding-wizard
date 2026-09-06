/* Content integrity checks for Weld Academy.
 * Run: node weld-academy/tools/validate-content.mjs
 * Exits non-zero on any failure. */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const sandbox = { window: {} };
for (const file of ['js/content.js', 'js/reference.js', 'js/diagrams.js',
                    'js/practice.js', 'js/content-mastery.js', 'js/content-salvage.js', 'js/script.js',
                    'js/sources.js', 'js/dolls.js',
                    'js/teardown.js']) {
  const src = readFileSync(join(root, file), 'utf8');
  new Function('window', src)(sandbox.window);
}

const C = sandbox.window.WA_CONTENT;
const R = sandbox.window.WA_REFERENCE;
const PR = sandbox.window.WA_PRACTICE;
const DG = sandbox.window.WA_DIAGRAMS;
const DMAP = sandbox.window.WA_DIAGRAM_MAP;
const SC = sandbox.window.WA_SCRIPT;
const TD = sandbox.window.WA_TEARDOWN;
const SRC = sandbox.window.WA_SOURCES;
const DL = sandbox.window.WA_DOLLS;

const errors = [];
const fail = (msg) => errors.push(msg);

/* ---- curriculum ---- */

const lessonIds = new Set();
const moduleIds = new Set();

if (!C || !Array.isArray(C.modules) || C.modules.length === 0) fail('No modules found');

for (const m of C.modules ?? []) {
  const where = `module "${m.id}"`;
  if (!m.id) fail('A module has no id');
  if (moduleIds.has(m.id)) fail(`Duplicate module id: ${m.id}`);
  moduleIds.add(m.id);

  for (const field of ['title', 'subtitle', 'icon', 'colour', 'intro']) {
    if (!m[field]) fail(`${where} is missing "${field}"`);
  }

  if (!Array.isArray(m.lessons) || m.lessons.length === 0) fail(`${where} has no lessons`);

  for (const l of m.lessons ?? []) {
    const lw = `${where} lesson "${l.id}"`;
    if (!l.id) fail(`${where} has a lesson with no id`);
    if (lessonIds.has(l.id)) fail(`Duplicate lesson id: ${l.id}`);
    lessonIds.add(l.id);
    if (!l.title) fail(`${lw} has no title`);
    if (!l.blurb) fail(`${lw} has no blurb`);
    if (!Array.isArray(l.body) || l.body.length < 2) fail(`${lw} body is too short`);
    if (!Array.isArray(l.keyPoints) || l.keyPoints.length < 3) fail(`${lw} needs at least 3 key points`);
    for (const p of l.body ?? []) {
      const stars = (p.match(/\*\*/g) ?? []).length;
      if (stars % 2 !== 0) fail(`${lw} has unbalanced ** bold markers`);
    }
  }

  // Every lesson needs a bench drill and recall cards — the Do and Recall
  // modes must never render an empty screen.
  for (const l of m.lessons ?? []) {
    const entry = PR[l.id];
    if (!entry) { fail(`${where} lesson "${l.id}" has no practice entry`); continue; }
    const p = entry.practice;
    if (!p) fail(`lesson "${l.id}" has no bench drill`);
    else {
      if (!p.task || !p.why) fail(`drill for "${l.id}" is missing task or why`);
      if (!Array.isArray(p.steps) || p.steps.length < 3) fail(`drill for "${l.id}" needs at least 3 steps`);
      if (!Array.isArray(p.pass) || p.pass.length < 2) fail(`drill for "${l.id}" needs at least 2 pass criteria`);
    }
    if (!Array.isArray(entry.recall) || entry.recall.length < 2) fail(`lesson "${l.id}" needs at least 2 recall cards`);
    for (const c of entry.recall ?? []) {
      if (!c.q || !c.a) fail(`a recall card for "${l.id}" is missing q or a`);
    }
  }

  if (!Array.isArray(m.quiz) || m.quiz.length !== 5) {
    fail(`${where} should have exactly 5 quiz questions, has ${m.quiz?.length ?? 0}`);
  }
  for (const [i, q] of (m.quiz ?? []).entries()) {
    const qw = `${where} question ${i + 1}`;
    if (!q.q) fail(`${qw} has no question text`);
    if (!Array.isArray(q.choices) || q.choices.length < 3) fail(`${qw} needs at least 3 choices`);
    if (!Number.isInteger(q.correct)) fail(`${qw} has a non-integer correct index`);
    else if (q.correct < 0 || q.correct >= (q.choices?.length ?? 0)) fail(`${qw} correct index ${q.correct} is out of range`);
    if (!q.explain) fail(`${qw} has no explanation`);
    if (new Set(q.choices ?? []).size !== (q.choices ?? []).length) fail(`${qw} has duplicate choices`);
  }
}

/* ---- reference ---- */

const clueIds = new Set((R?.clues ?? []).map((c) => c.id));
if (clueIds.size === 0) fail('No Weld Doctor clues defined');

for (const c of R?.clues ?? []) {
  if (!c.label) fail(`Clue "${c.id}" has no label`);
  if (!c.group) fail(`Clue "${c.id}" has no group`);
}

if (!Array.isArray(R?.defects) || R.defects.length === 0) fail('No defects defined');

for (const d of R?.defects ?? []) {
  const dw = `defect "${d.id}"`;
  for (const field of ['name', 'icon', 'severity', 'plain', 'processNote']) {
    if (!d[field]) fail(`${dw} is missing "${field}"`);
  }
  for (const field of ['causes', 'fixNow', 'prevent']) {
    if (!Array.isArray(d[field]) || d[field].length === 0) fail(`${dw} has an empty "${field}"`);
  }
  const matchKeys = Object.keys(d.match ?? {});
  if (matchKeys.length === 0) fail(`${dw} matches no clues — it can never be diagnosed`);
  for (const k of matchKeys) {
    if (!clueIds.has(k)) fail(`${dw} references unknown clue "${k}"`);
    if (typeof d.match[k] !== 'number' || d.match[k] <= 0) fail(`${dw} has a bad weight for "${k}"`);
  }
}

// Every clue must lead somewhere, or ticking it does nothing.
for (const id of clueIds) {
  const used = (R.defects ?? []).some((d) => d.match?.[id]);
  if (!used) fail(`Clue "${id}" is not matched by any defect`);
}

/* ---- diagrams: every mapped id must exist ---- */

for (const [lessonId, ids] of Object.entries(DMAP ?? {})) {
  for (const id of ids) {
    if (!DG.has(id)) fail(`Diagram map points lesson "${lessonId}" at unknown diagram "${id}"`);
  }
}

for (const id of DG.ids) {
  const used = Object.values(DMAP ?? {}).some((ids) => ids.includes(id));
  if (!used) fail(`Diagram "${id}" is drawn but never shown in any lesson`);
}

/* ---- practice entries must all belong to real lessons ---- */

for (const id of Object.keys(PR)) {
  if (!lessonIds.has(id)) fail(`Practice entry "${id}" does not match any lesson`);
}

/* ---- badges: every module badge must correspond to a real module ---- */

const badgeIds = new Set();
for (const b of R?.badges ?? []) {
  if (badgeIds.has(b.id)) fail(`Duplicate badge id: ${b.id}`);
  badgeIds.add(b.id);
  if (!b.name || !b.icon || !b.desc) fail(`Badge "${b.id}" is missing fields`);
}
for (const id of moduleIds) {
  if (!badgeIds.has(id)) fail(`Module "${id}" has no matching completion badge`);
}

/* ---- cheat sheets: rows must match column count ---- */

for (const s of R?.cheatsheets ?? []) {
  if (!s.columns?.length) fail(`Cheat sheet "${s.id}" has no columns`);
  for (const [i, row] of (s.rows ?? []).entries()) {
    if (row.length !== s.columns.length) {
      fail(`Cheat sheet "${s.id}" row ${i + 1} has ${row.length} cells, expected ${s.columns.length}`);
    }
  }
  if (!s.note) fail(`Cheat sheet "${s.id}" has no note`);
}

for (const sec of R?.preflight ?? []) {
  if (!sec.id || !sec.title || !sec.items?.length) fail(`Pre-flight section "${sec.id}" is incomplete`);
}

/* ---- spoken scripts: every lesson has to work with no screen ---- */

for (const m of C?.modules ?? []) {
  for (const les of m.lessons) {
    const lines = SC.lesson(m, les);
    if (!lines.length) fail(`Lesson "${les.id}" produces an empty spoken script`);
    if (lines.some((l) => !l.text.trim())) fail(`Lesson "${les.id}" has a blank spoken line`);
    // Units left unspoken are the giveaway that something reads as robot.
    const raw = lines.map((l) => l.text).join(' ');
    const leftover = raw.match(/\d+\s?(mm|kg|L\/min|m\/min)\b/);
    if (leftover) fail(`Lesson "${les.id}" leaves "${leftover[0]}" unspoken in its script`);
  }
  const u = SC.unit(m);
  if (!u.length) fail(`Unit "${m.id}" produces an empty spoken script`);
  if (SC.seconds(u) < 60) fail(`Unit "${m.id}" spoken script is implausibly short`);
}

// Every diagram the course shows needs a spoken description, or the audio
// version quietly drops part of the explanation.
for (const id of DG?.ids ?? []) {
  if (!SC.diagramLine(id)) fail(`Diagram "${id}" has no spoken description in js/script.js`);
}

/* ---- teardown: every entry has to commit to an answer ---- */

const seenTd = new Set();
for (const it of TD?.items ?? []) {
  if (seenTd.has(it.id)) fail(`Teardown entry "${it.id}" is duplicated`);
  seenTd.add(it.id);
  if (!it.name || !it.icon) fail(`Teardown entry "${it.id}" is missing a name or icon`);
  if (!['strip', 'whole', 'leave'].includes(it.verdict)) {
    fail(`Teardown entry "${it.id}" has no clear verdict (got "${it.verdict}")`);
  }
  if (!it.verdictWhy) fail(`Teardown entry "${it.id}" gives a verdict without saying why`);
  // She learns with her hands, so the memory hook is not optional.
  if (!it.hook) fail(`Teardown entry "${it.id}" has no word-association hook`);
  if (!it.metals) fail(`Teardown entry "${it.id}" does not say what is in it`);
  if (!it.notes?.length) fail(`Teardown entry "${it.id}" has no notes`);
  if (!(it.time > 0)) fail(`Teardown entry "${it.id}" has no time estimate`);
}

/* ---- sources: the page whose whole job is "check me" ----
   A dead or vague link here is worse than no page at all, so the shape of
   every entry is enforced. Whether the URLs still resolve is checked
   separately by tools/check-links.mjs, which needs the network. */

const seenSrc = new Set();
for (const s of SRC?.sources ?? []) {
  if (seenSrc.has(s.id)) fail(`Source "${s.id}" is duplicated`);
  seenSrc.add(s.id);
  if (!s.title || !s.what || !s.where) fail(`Source "${s.id}" is missing a field`);
  if (!/^https:\/\//.test(s.url || '')) fail(`Source "${s.id}" has no https URL`);
  // No placeholder or search-page links pretending to be citations.
  if (/example\.com|TODO|\?q=|\/search/i.test(s.url)) fail(`Source "${s.id}" links to a placeholder or a search page`);
  // A source attached to nothing never shows up on the unit it backs, and a
  // typo'd module id fails silently — so both are caught here.
  if (!s.units?.length) fail(`Source "${s.id}" is not attached to any unit`);
  for (const u of s.units ?? []) {
    if (!C.modules.some((m) => m.id === u)) fail(`Source "${s.id}" cites unknown unit "${u}"`);
  }
}
// The units making the strongest claims must be able to show their working.
for (const id of ['safety', 'ticket']) {
  if (!SRC.byUnit(id).length) fail(`Unit "${id}" has no sources attached to it`);
}
if ((SRC?.sources ?? []).length < 8) fail('The sources page is too thin to be worth anything');
if (!(SRC?.estimates ?? []).length) fail('Nothing is declared as an estimate — that cannot be right');
if (!(SRC?.statement ?? []).some((p) => /written by an AI/i.test(p))) {
  fail('The sources page does not state plainly that an AI wrote this');
}
// Every kind listed must actually have entries, or the page renders a heading
// over nothing.
for (const k of SRC?.kinds() ?? []) {
  if (!SRC.sources.some((s) => s.kind === k.id)) fail(`Source kind "${k.id}" has no entries`);
}

/* ---- the collection: every doll must be reachable ---- */

const sizes = new Set();
for (const d of DL?.dolls ?? []) {
  if (sizes.has(d.size)) fail(`Two dolls share size ${d.size}`);
  sizes.add(d.size);
  if (!d.name || !d.hint) fail(`Doll "${d.id}" is missing a name or a hint`);
  for (const c of ['body', 'shawl', 'face', 'flower']) {
    if (!/^#[0-9a-f]{6}$/i.test(d[c] || '')) fail(`Doll "${d.id}" has no ${c} colour`);
  }
  // An unlock condition nothing can satisfy means a doll nobody ever gets.
  const [kind, arg] = d.how.split(':');
  if (kind === 'module') {
    if (!C.modules.some((m) => m.id === arg)) fail(`Doll "${d.id}" unlocks on unknown unit "${arg}"`);
  } else if (['streak', 'drills', 'badges'].includes(kind)) {
    if (!(Number(arg) > 0)) fail(`Doll "${d.id}" has a nonsense threshold "${arg}"`);
    if (kind === 'badges' && Number(arg) > R.badges.length) {
      fail(`Doll "${d.id}" needs ${arg} badges but only ${R.badges.length} exist`);
    }
  } else {
    fail(`Doll "${d.id}" has an unknown unlock kind "${kind}"`);
  }
}
if ((DL?.dolls ?? []).length < 6) fail('Too few dolls for a set worth collecting');
// Spread across different kinds of play, so no single habit completes the set.
const kinds = new Set((DL?.dolls ?? []).map((d) => d.how.split(':')[0]));
if (kinds.size < 3) fail('Every doll unlocks the same way — the set is not worth collecting');

/* ---- offline: every script the page loads must be cached ----
   Forgetting one here does not break anything until she is somewhere with no
   signal, which is exactly where this app is meant to work. */

const html = readFileSync(join(root, 'index.html'), 'utf8');
const sw = readFileSync(join(root, 'service-worker.js'), 'utf8');
const loaded = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
for (const src of loaded) {
  if (!sw.includes(`'./${src}'`)) fail(`index.html loads ${src} but service-worker.js does not cache it`);
}
const cssLinks = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
for (const href of cssLinks) {
  if (!sw.includes(`'./${href}'`)) fail(`index.html loads ${href} but service-worker.js does not cache it`);
}

/* ---- report ---- */

const lessonCount = (C?.modules ?? []).reduce((n, m) => n + m.lessons.length, 0);
const quizCount = (C?.modules ?? []).reduce((n, m) => n + m.quiz.length, 0);

if (errors.length) {
  console.error(`\n✗ ${errors.length} content problem(s):\n`);
  for (const e of errors) console.error('  · ' + e);
  process.exit(1);
}

console.log('✓ Content valid');
console.log(`  ${C.modules.length} modules · ${lessonCount} lessons · ${quizCount} quiz questions`);
console.log(`  ${Object.keys(PR).length} bench drills · ${Object.values(PR).reduce((n, e) => n + e.recall.length, 0)} recall cards · ${DG.ids.length} diagrams`);
console.log(`  ${DL.dolls.length} dolls in the collection`);
console.log(`  ${SRC.sources.length} linked sources · ${SRC.estimates.length} declared estimates`);
console.log(`  ${TD.items.length} teardown entries · ${TD.items.filter((i) => i.danger).length} carry a safety warning`);
console.log(`  ${R.clues.length} clues · ${R.defects.length} defects · ${R.badges.length} badges · ${R.cheatsheets.length} cheat sheets`);

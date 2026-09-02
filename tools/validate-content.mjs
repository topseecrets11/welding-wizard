/* Content integrity checks for Weld Academy.
 * Run: node weld-academy/tools/validate-content.mjs
 * Exits non-zero on any failure. */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const sandbox = { window: {} };
for (const file of ['js/content.js', 'js/reference.js']) {
  const src = readFileSync(join(root, file), 'utf8');
  new Function('window', src)(sandbox.window);
}

const C = sandbox.window.WA_CONTENT;
const R = sandbox.window.WA_REFERENCE;

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
console.log(`  ${R.clues.length} clues · ${R.defects.length} defects · ${R.badges.length} badges · ${R.cheatsheets.length} cheat sheets`);

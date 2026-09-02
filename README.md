# Weld Academy ⚡

A gamified welding course **and** a shed companion app, in one offline web app.

Built for someone learning to weld from scratch — stick, MIG and TIG — who isn't a computer person
and isn't sold on apps. So: no login, no internet, no install. Open the file, it works.

---

## Open it

Double-click **`index.html`**. That's it.

Or, to use it on a phone (which is where the companion half earns its keep), serve the folder on
your network and open the address on the phone:

```bash
cd weld-academy
python3 -m http.server 8080      # then browse to http://<your-computer-ip>:8080
```

On an iPhone or Android, use *Add to Home Screen* and it opens like an app.

Everything is stored in that browser's `localStorage` — progress never leaves the device, and it
does not sync between devices. Photos in the weld log are stored on the device too; nothing is
uploaded anywhere.

---

## What's in it

### The course

Six modules, 27 lessons, and a five-question checkpoint quiz at the end of each module. Every quiz
answer comes with a written explanation whether you got it right or wrong.

| # | Module | Covers |
|---|--------|--------|
| 1 | Safety First | Arc eye, fume, burns, fire; PPE and helmet shade by amperage; hot-work area control, galvanising, confined spaces; electrical safety and work-clamp placement |
| 2 | Reading the Print | The five joints; positions (PA–PG with AWS 1G–4G equivalents); fillet vs groove, leg and throat sizing; welding symbols end to end |
| 3 | Stick / SMAW | Machine and polarity; AS/NZS 4855 electrode codes (E4313 / E4112 / E4818) and low-hydrogen rod storage; striking, arc length, angle, travel; flat → horizontal → vertical-up → overhead; troubleshooting including arc blow |
| 4 | MIG / GMAW | Gun and feeder anatomy; wire and gas selection; transfer modes and why they cap your thickness; angle, stick-out, travel; dialling in voltage and wire speed by ear |
| 5 | TIG / GTAW | Torch, gas lens, pedal, start types; tungsten selection and grinding; AC vs DC and the aluminium oxide problem; two-hand filler technique; amps per mm and heat management |
| 6 | Weld Quality | What a good weld looks like; the full defect gallery; hot vs cold cracking; distortion control and how welds actually get inspected (VT/PT/MT/UT/RT) |

**Metric and Australian throughout** — AS/NZS 4855 electrode designations, ISO position letters,
AS/NZS 1554 visual acceptance in plain English, litres per minute, millimetres. AWS equivalents are
given in brackets wherever they differ, because most welding videos online are American.

### The gamification

- **XP** — 10 per lesson, 15 per correct quiz answer (first sitting only; retakes are free
  practice), 25 for finishing a module, 20 for the daily challenge, 5 for a weld-log entry (once a
  day, so it can't be farmed).
- **Levels** — every 100 XP, with trade titles from *Shop Sweeper* up to *Master Welder*.
- **Streak** — counted by calendar day, shown as a flame in the header.
- **13 badges**, including one per module and *Ticket Ready* for the lot.
- **Daily challenge** — one question a day, drawn from the whole quiz pool by date. The reason to
  open it tomorrow.
- **Skill path** — modules unlock in order, but nothing is hard-blocked. If she's standing at a MIG
  machine on Saturday she can jump straight to the MIG module.

### The companion (the other half)

- **🩺 Weld Doctor** — tick what you can see, hear or remember about the job ("small holes in the
  bead", "it was windy", "a crack turned up two days later"), and it ranks the likely faults with
  *why it happened → fix it now → stop it happening again*, plus which process it bites you on.
  Thirteen defects, fifteen clues. It deliberately shows the top two or three rather than one
  confident answer, because faults ride together.
- **📋 Cheat sheets** — starting amps by electrode size for stick; volts and wire speed by plate
  thickness for MIG; tungsten size, amps and filler by thickness for TIG; fillet sizes and joint
  prep. Labelled as starting points, every time.
- **✅ Pre-flight checklist** — PPE, area, machine and metal, and pack-up. Resets itself each day.
- **📓 Weld log** — photo (straight from the phone camera), what you were doing, what went wrong.
  Images are resized to 1000 px and re-encoded before storing so a few photos don't fill the
  browser's storage quota.

---

## Honest limits

**This is not a qualification.** No certificate, no accreditation, no ticket. What it teaches is the
knowledge an accredited course teaches, so nothing has to be unlearned later — but the actual ticket
means TAFE (MEM Certificate II/III units) and a coded test welded on a real coupon and destructively
tested. This app is how you walk in already knowing what you're doing.

**The Weld Doctor does not look at photos.** It's a symptom-matching expert system, not a vision
model. That's a deliberate choice: it works in a shed with no signal, costs nothing, needs no API
key, and — most importantly — it can't confidently invent a wrong diagnosis about a weld the way an
image model can. The camera is used for the weld log instead.

If you ever do want real photo analysis, the whole diagnosis path is one function
(`diagnose(clueIds)` in `js/app.js`) returning ranked `{ defect, score }` — swap that for an API
call and the UI needs no changes.

**Progress is per-browser.** No accounts, no sync. Clearing site data clears progress.

---

## Files

```
weld-academy/
  index.html                 app shell (loads four plain scripts — no build step, no modules)
  css/styles.css             dark workshop theme, mobile first
  js/content.js              the curriculum: modules, lessons, quizzes
  js/reference.js            defects, clues, cheat sheets, checklist, badges, level titles
  js/progress.js             XP, levels, streaks, badges, quiz results, log, localStorage
  js/app.js                  hash router, views, event wiring
  tools/validate-content.mjs content integrity checks
  tools/e2e-smoke.cjs        browser walkthrough of the whole app
```

No dependencies, no bundler, no framework. Scripts are plain `<script src>` (not ES modules) so the
page works opened directly from disk over `file://`.

---

## Working on it

**Add a lesson:** drop another object into a module's `lessons` array in `js/content.js`
(`{ id, title, blurb, body: [...], keyPoints: [...], tip }`). Body paragraphs support `**bold**`.
Nothing else needs touching — progress, percentages and unlocks all count from the data.

**Add a defect:** add to `defects` in `js/reference.js` and weight it against existing clue ids in
`match`. Add a new clue to `clues` if the symptom isn't covered. The validator enforces that every
clue leads to at least one defect and every defect matches at least one clue.

**Checks:**

```bash
node weld-academy/tools/validate-content.mjs     # content integrity — quiz indices, clue wiring, table shapes
node weld-academy/tools/e2e-smoke.cjs            # 33 checks: full walkthrough in headless Chromium
WA_SHOTS=/tmp/shots node weld-academy/tools/e2e-smoke.cjs   # ...and capture screenshots
```

The smoke test needs Playwright available (`NODE_PATH=/usr/lib/node_modules` if it's installed
globally). It drives onboarding, a lesson, a full quiz, module unlocking, two Weld Doctor
diagnoses, the checklist, the log, persistence across reload, and checks for horizontal overflow and
tap-target size at 390 px and 1180 px.

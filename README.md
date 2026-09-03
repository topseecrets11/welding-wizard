# Weld Academy ⚡

A gamified welding course **and** a shed companion app, in one offline web app.

Built for someone learning to weld from scratch — stick, MIG and TIG — who is not a computer
person, is not sold on apps, and wants to be genuinely *proficient* in each process rather than
just informed about it. So: no login, no internet, no install, no build step. Open it and it works.

---

## Get it on the phone

**Quickest (a phone or tablet on your wifi):**

```bash
cd weld-academy
python3 -m http.server 8080
```

Then browse to `http://<your-computer-ip>:8080` on the phone. Chrome will offer **Install app** (or
Menu → *Add to Home Screen*). After that it opens full screen, has its own icon, and **works with no
signal at all** — which is the point, because sheds do not have reception.

**Or just double-click `index.html`** on a computer. Everything works except the install prompt and
the service worker (browsers only allow those over http/https).

**Or host it free** — GitHub Pages, Netlify drop, Cloudflare Pages. It is static files, nothing else.

Progress lives in that browser's `localStorage`. No account, nothing uploaded, no sync between
devices. Photos in the weld log stay on the device too.

---

## What's in it

### 9 units · 39 lessons · 39 bench drills · 45 quiz questions · 14 diagrams

**Core units — get proficient in each process**

| # | Unit | Covers |
|---|------|--------|
| 1 | Safety First | Arc eye, fume, burns, fire; PPE and helmet shade by amperage; hot-work area control, galvanising, confined spaces; electrical safety and work-clamp placement |
| 2 | Reading the Print | The five joints; positions (PA–PG with the AWS 1G–4G equivalents); fillet vs groove, leg and throat sizing; welding symbols end to end |
| 3 | Stick / SMAW | Machine and polarity; AS/NZS 4855 electrode codes (E4313 / E4112 / E4818) and low-hydrogen storage; striking, arc length, angle, travel; flat → horizontal → vertical up → overhead; arc blow and friends |
| 4 | MIG / GMAW | Gun and feeder anatomy; wire and gas selection; transfer modes and why they cap your thickness; angle, stick-out, travel; dialling in volts and wire speed by ear |
| 5 | TIG / GTAW | Torch, gas lens, pedal, start types; tungsten selection and grinding; AC vs DC and the aluminium oxide problem; the two-hand dance; amps per mm and heat management |
| 6 | Weld Quality | What a good weld looks like; the full defect gallery; hot vs cold cracking; distortion control and how welds actually get inspected |

**Mastery units — past competent**

| # | Unit | Covers |
|---|------|--------|
| 7 | Metal & Heat | The HAZ and why cracks start beside the weld; carbon equivalent and hardenable steels; preheat, interpass and measuring it properly; residual stress, stress relief and fatigue |
| 8 | Beyond Mild Steel | Stainless (sensitisation, purging, cross-contamination); aluminium alloys and filler choice; cast iron repair done properly; identifying mystery metal, dissimilar joints, and when to refuse a job |
| 9 | Fit-up & the Ticket | Measuring, cutting and fit-up; pipe positions and the root run; what a WPS is and what a coded test day involves; portfolio, tickets that pay, and where the work is |

**Metric and Australian throughout** — AS/NZS 4855 electrode designations, ISO position letters,
AS/NZS 1554 acceptance in plain English, litres per minute, millimetres. AWS equivalents in brackets
wherever they differ, because most welding videos online are American.

### Five ways into every lesson

Everybody takes information in differently, and the same person wants it differently at the bench
than on the couch. A switcher at the top of every lesson (it remembers your choice):

| Mode | What it is |
|------|-----------|
| 📖 **Read** | The full lesson in plain English, with the diagram |
| ⚡ **Guts** | Just the points that matter. Thirty seconds |
| 👁️ **Show** | Diagram first, words second |
| 🔧 **Do** | Go to the bench and do this — steps to tick, and pass marks to judge yourself against |
| 🧠 **Recall** | Flip cards. Get tested rather than re-reading |

This is not the "learning styles" myth (matching teaching to a preferred sense has never held up in
studies). It is two things that *are* well evidenced: presenting the same idea in several forms, and
**retrieval practice** — being made to recall something is far stronger than reading it again. The
Do and Recall modes are the two that actually move the needle.

### Bench drills, and real proficiency

Every lesson has a drill: a job to go and do, with what you need, numbered steps, and pass criteria
written the way a trainer would mark it. Some highlights — **fifty starts** in one session, the
**break test** that proves your MIG fusion, **cutting welds in half** to see actual penetration, and
**making four defects on purpose** so you can recognise them instantly afterwards.

Drills pay 20 XP, double a lesson, because that is where the skill comes from. And each unit shows a
**proficiency percentage** that only reaches 100% when the reading, the quiz *and* the bench drills
are all done. You cannot read your way to proficient.

### The gamification

- **XP**: lesson 10 · correct quiz answer 15 (first sitting only, so it can't be farmed) · bench
  drill 20 · unit complete 25 · daily challenge 20 · recall cards 5 · weld log entry 5 (once a day).
- **Levels** every 100 XP, with trade titles from *Shop Sweeper* up to *Master Welder*.
- **Streaks** counted by day, with a flame in the header.
- **18 badges**, including one per unit and *The Full Set* for the lot.
- **Daily challenge** — one question a day drawn from the whole pool by date. The reason to open it
  tomorrow.
- **The map** — a connected path of units with progress rings, a glowing current node, and locks
  that open as you go (but never hard-block you: if she is standing at a MIG machine on Saturday she
  can jump straight to unit 4).
- **The feel** — welding-spark confetti on a canvas, level-up and badge celebrations, XP that counts
  up, Android **haptics**, and synthesised sound (no audio files; mute it in Settings).

### The companion half

- **🩺 Weld Doctor** — tick what you can see, hear or remember ("small holes in the bead", "it was
  windy", "a crack turned up two days later") and it ranks the likely faults with *why it happened →
  fix it now → stop it happening again*, plus which process it bites you on. 15 clues, 13 defects.
  It shows the top two or three rather than one confident answer, because faults ride together.
- **📋 Cheat sheets** — starting amps by electrode size for stick; volts and wire speed by plate
  thickness for MIG; tungsten, amps and filler by thickness for TIG; fillet sizes and joint prep.
- **✅ Pre-flight checklist** — PPE, area, machine and metal, pack-up. Resets each day.
- **📓 Weld log** — photo straight from the camera, what you were doing, what went wrong. Images are
  resized to 1000 px before storing so a few photos don't fill the browser's quota.

---

## The optional AI weld scan

**Off by default, and the app is complete without it.** When it is off there is no half-built AI
UI on screen — the button simply is not there.

Turn it on in **Settings → AI weld scan** and the Doctor gains a camera button: photograph the weld,
a model looks at it, the symptoms it spots get ticked for you, and the offline Weld Doctor still
does the naming, the cause and the fix.

**Why that split.** The free open weld models are coarse. The well-known public dataset
([rikkarth/welding-defect-object-detection](https://huggingface.co/datasets/rikkarth/welding-defect-object-detection),
CC0, mirrored from Kaggle, 2,028 real photos) has three classes: *good weld / bad weld / defect*,
with YOLOv8 weights trained on it at
[avinashhm/welding-defect-yolov8](https://huggingface.co/models/avinashhm/welding-defect-yolov8).
It can spot and localise; it cannot tell porosity from undercut. Intel's
[qwen3.5-2b-vlm-weld-explainability-lora](https://huggingface.co/models/Intel/qwen3.5-2b-vlm-weld-explainability-lora)
is far richer but wants sensor telemetry from a robotic welding cell alongside the image.

So: the model does the spotting, and the expert system — which does know the difference — does the
diagnosis. That way the AI is never the thing that looks stupid.

**Providers** (`js/vision.js`, one fetch each — add another by adding one function):

| Provider | Setup | Notes |
|----------|-------|-------|
| `hfapi` | Model id + HF token | POSTs the image bytes to the Hugging Face Inference API. Free tier works; needs signal, and the first call may 503 while the model warms up |
| `space` / `custom` | An endpoint URL | Your own server or a free HF Space. Receives `POST { "image": "data:image/jpeg;base64,..." }`, replies `[{ "label": "porosity", "score": 0.9 }]` |

Model labels are matched to the Doctor's clue list by `LABEL_MAP` in `js/vision.js` — it already
covers porosity, undercut, overlap, lack of fusion/penetration, burn-through, cracks, slag, spatter,
distortion, tungsten, and the coarse *bad weld / defect / good weld* classes. Add a regex, add a
label.

Timeouts fail gracefully: *"No answer in 30 seconds — probably no signal out here. The symptom
checklist works offline."*

---

## Honest limits

**This is not a qualification.** No certificate, no accreditation, no ticket. What it teaches is the
knowledge an accredited course teaches, so nothing has to be unlearned later — but the ticket itself
means TAFE (MEM Certificate II/III units) and a coded test welded on a real coupon and destructively
tested. Unit 9 explains exactly what that day involves.

**Progress is per-browser.** No accounts, no sync. Clearing site data clears it.

**The Weld Doctor does not look at photos unless you set up the optional AI**, and even then it is a
coarse spotter feeding an expert system, not a magic diagnosis.

---

## Files

```
weld-academy/
  index.html                 shell — loads nine plain scripts, no modules, no build
  manifest.json              PWA manifest (installable, standalone, shortcuts)
  service-worker.js          cache-first offline
  icon.svg / icon-*.png      app icons, including a maskable one for Android
  css/styles.css             the whole design system
  js/content.js              units 1–6: lessons and quizzes
  js/content-mastery.js      units 7–9, plus their drills (merges into both stores)
  js/practice.js             bench drills and recall cards
  js/diagrams.js             14 hand-drawn inline SVG diagrams + the lesson map
  js/reference.js            defects, clues, cheat sheets, checklist, badges, levels
  js/progress.js             XP, levels, streaks, badges, drills, proficiency, storage
  js/juice.js                sparks, celebrations, sound, haptics, count-ups
  js/vision.js               the optional AI scan, provider-pluggable
  js/app.js                  router, views, event wiring
  tools/validate-content.mjs content integrity checks
  tools/e2e-smoke.cjs        full browser walkthrough
```

No dependencies, no bundler, no framework. Plain `<script src>` (not ES modules) so it works opened
straight from disk.

---

## Working on it

**Add a lesson:** another object in a unit's `lessons` array, plus a `practice.js` entry with a
drill and two recall cards. Progress, percentages, unlocks and the map all count from the data.

**Add a defect:** add to `defects` in `js/reference.js` and weight it against clue ids in `match`.

**Add a diagram:** add to `js/diagrams.js` and point a lesson at it in `WA_DIAGRAM_MAP`.

**Checks:**

```bash
node weld-academy/tools/validate-content.mjs     # quiz indices, drill/recall coverage, clue wiring,
                                                 # diagram map, badge coverage, table shapes
node weld-academy/tools/e2e-smoke.cjs            # 57 checks: full walkthrough in headless Chromium
WA_SHOTS=/tmp/shots node weld-academy/tools/e2e-smoke.cjs   # ...and capture screenshots
```

The smoke test needs Playwright available (`NODE_PATH=/usr/lib/node_modules` if it is installed
globally). It drives onboarding, all five lesson modes, a bench drill, recall cards, a full quiz,
unit unlocking, two Weld Doctor diagnoses, the vision label mapping, settings, the checklist, the
log, persistence across reload, the manifest, and checks overflow and tap-target size at 390 px,
800 px and 1180 px.

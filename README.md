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

### 11 units · 47 lessons · 47 bench drills · 55 quiz questions · 14 diagrams

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

**Also core — the practical stuff next to the welding**

| # | Unit | Covers |
|---|------|--------|
| 10 | Electrics & Salvage | Soldering that holds (and why a cold joint is the same fault as a weld sitting on top); a multimeter in three settings; reading what is inside a piece of scrap by weight, magnet and scratch; the honest economics of can collecting |

**Optional — not needed for any of the above**

| # | Unit | Covers |
|---|------|--------|
| 11 | The Metal Trade | Grades and why the same metal pays three prices; spot versus what a yard hands you; earnings versus profit, break-even and the Australian basics; precious metals realistically |

Unit 11 is deliberately off the main path — it sits under an *If you want it* heading, is open from
the start, and never gates anything. Leading with merchant jargon at someone who is not asking for
it reads as a lecture.

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

She picks her default during onboarding, so the very first lesson opens the way she likes. Every
lesson still has all five, one tap apart.

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

- **👷 Ask Old Mate** — the bloke who has been welding since before you were born. Tick what you can
  see, hear or remember ("small holes in the bead", "it was windy", "a crack turned up two days
  later") and he ranks the likely faults with *why it happened → fix it now → stop it happening
  again*, plus which process it bites you on. 15 clues, 13 defects. He gives you the top two or
  three rather than one confident answer, because faults ride together.
- **📋 Cheat sheets** — starting amps by electrode size for stick; volts and wire speed by plate
  thickness for MIG; tungsten, amps and filler by thickness for TIG; fillet sizes and joint prep.
- **✅ Pre-flight checklist** — PPE, area, machine and metal, pack-up. Resets each day.
- **📓 Weld log** — photo straight from the camera, what you were doing, what went wrong. Images are
  resized to 1000 px before storing so a few photos don't fill the browser's quota.
- **💰 Scrap & prices** — see below.

### Read it to me

Every lesson has a play bar: it reads the theory out loud, sentence by sentence, highlighting the
line it is on. Study in the ute, at the sink, or with the phone in a pocket.

It uses the phone's own speech engine (Web Speech API) — **no audio files, no API, no account**, and
Android's offline voices keep working with no signal. Two one-tap voices (*old and wise*, or
*warm and easy*), both overridable to any voice on the phone; speed cycles from the bar itself.

Reading a page aloud verbatim does not work, so it does not. `js/script.js` derives a spoken version
from the same content the screen uses: "3.2 mm rods at 90-120 A" is spoken as *"three point two
millimetre rods at 90 to 120 amps"*, trade shorthand is said rather than spelled, and every diagram
gets a sentence so the audio version does not quietly drop part of the explanation.

### Drive Mode 🚗

The one that changes the shape of the rest. It plays **a whole unit end to end like a podcast** —
lesson rolling into lesson with a spoken link between them — so there is nothing to tap for twenty
minutes.

It says where she is the way a podcast player does (*"1:20 in · 1:33 left in this one · 10:26 left
in the unit"*), and remembers it, so a phone call does not cost her the unit. `navigator.mediaSession`
puts the unit and lesson on the car stereo and wires the wheel buttons to play, pause and skip —
where skip means the **next lesson**, which is what that button should do on spoken content.

Lessons finished by ear count exactly like lessons finished by eye, so a week of driving genuinely
moves her through the course.

### Ask him in your own words

Type or say *"why is my weld full of little holes"* and get the porosity write-up back, read out
loud. **He never makes anything up:** every offline answer is a passage already in the app, and when
nothing matches he says so instead of guessing.

Retrieval is BM25F over ~105 passages built at load from the lessons, defects, cheat sheets, drills
and guides, with a synonym map so her words reach the course's words (*spitting* → spatter,
*birds nest* → feed, *what's copper at* → the live price). An optional AI upgrade rewords the same
matched passages if a key is set, and falls back to the offline answer on any failure.

### Her scales, and what is worth pulling apart

**The tally** values what is on her scales two ways at once — spot, and what a yard will actually
hand her — because showing only one of those is either lying by omission or teaching nothing. Log
the fuel against a load and the ledger shows what she actually *made*, not what she was paid.

**Worth stripping?** answers the other question: someone has handed her an alternator, is it worth
the hour? Twelve entries, each ending in *strip it, sell it whole, or leave it*, each with a word
association hook (*"heavy old telly, copper round the neck"*) because she learns with her hands.
The four genuinely hazardous ones say so plainly — refrigerant is licensed work, CRT tubes implode,
microwave capacitors hold a charge, and gold recovery means selling stripped pins to a refiner
rather than doing acid chemistry at a kitchen table.

### Where this comes from

Fourteen **real, tappable links** to the actual standards, the IARC monograph, the training package
and the container deposit schemes — because "built on Australian standards" in prose is exactly the
kind of unverifiable line worth distrusting. Every URL is checked in CI. Each unit carries a
*checked against* strip so the claim sits with the content.

The same page lists where the app is **estimating** rather than citing, which is what keeps the
cited half worth anything.

### The menu

A drawer from the top-left lists **everything**: every unit with its progress, Old Mate, all six
Field Kit pages, Drive Mode, the ticket path, the sources, the map and Settings. The bottom tabs
stay for the four places she goes constantly; the drawer is the contents page.

### Scrap & prices

Metal is the trade around the trade, so the app tracks what it is worth — a ticker on the map, and a
full page in the Field Kit.

| Shown | Source | Unit |
|-------|--------|------|
| Copper, gold, silver, platinum, palladium | api.gold-api.com | per kg (and per gram for the precious ones), in AUD |
| Bitcoin | CoinGecko | per coin in AUD, with the day's move |
| USD → AUD | api.frankfurter.dev | — |

All three are free, need no key, and are CORS-open so the phone calls them directly. Prices cache,
so with no signal you get the last ones with the time they were fetched rather than an error — and
fetching is deferred until after paint, so a bad connection never delays a page.

**No oil.** There is no free source a browser can call directly for it (Yahoo's endpoint blocks
cross-origin requests), and faking it would be worse than leaving it out.

Underneath the prices is the part that actually matters: six sections on **what a yard really pays**
(spot is the ceiling, not the offer), the metals that pay and how to tell them apart, sorting to get
the clean-grade price, what must never go in the trailer (gas bottles, sealed drums, lithium,
asbestos), the ID-and-EFT paperwork that scrap is now regulated by in several states, and how all of
it feeds back into welding — offcuts as practice stock, and metal identification being the same
skill as unit 8.

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

## The optional server — sync and the AI proxy, self-hosted

**Off by default, and the app is complete without it.** Everything above this line runs entirely in
the browser with zero backend. This adds two things on top, for anyone who wants them; the app never
requires it and never nags about it.

```bash
node weld-academy/server         # http://localhost:8787 — app + API, one process
```

**Zero npm dependencies.** Only Node's own built-ins (`http`, `https`, `fs`) — `node server` runs it,
nothing to `npm install`, nothing to go stale, nothing supply-chain-shaped to audit. A genuine toy,
on purpose.

**What it adds:**

- **Sync across devices.** She picks a code — any word — in **Settings → Sync**, and the same code
  on a second device pulls her progress across. That is the entire account system: no email, no
  password, no login screen. A code is a JSON file on disk (`server/data/<code>.json`); knowing the
  code is the only protection it has, same as a key under a pot, and the Settings copy says so
  plainly rather than implying anything stronger.
- **The AI proxy**, at `/api/ask`. Set `ANTHROPIC_API_KEY` in the server's environment and point
  **Settings → Ask Old Mate → Your own endpoint** at `<server>/api/ask` (there is a one-tap "use my
  sync server" button once a sync server is configured). The key lives on the server, never the
  phone — which incidentally is what fixes the whole *class* of bug that broke the earlier direct
  OpenAI option: a browser calling a provider's API hits CORS, a server calling it does not.

**What it deliberately does not do:** real auth (a sync code is obscurity, not a password), rate
limiting beyond a crude body-size cap, or HTTPS (put it behind a reverse proxy for that on a public
box). None of it replaces localStorage — sync is a periodic push and an occasional pull *against*
it, and if the server is unreachable the app does not know or care; every offline feature above this
line keeps working exactly as before with this process switched off.

**Verified for real, not just each half in isolation** — `tools/test-sync-integration.mjs` runs the
actual server, opens two genuinely separate browser contexts (no shared storage) with Playwright,
pushes progress from one, pulls it into the other, and checks it survives a reload. That test caught
two real bugs on the way in:

- `WA_PROGRESS.state` is exposed read-only on purpose (nothing outside `progress.js` should be able
  to replace it by assignment) — which meant the sync client's first attempt to apply a pulled
  snapshot threw immediately. Fixed with a proper `replaceState()` that merges onto `defaults()`, the
  same pattern `load()` already used, so an older snapshot missing a field this version added
  doesn't come back with holes in it.
- The pull path unwrapped the server's response envelope wrong — a stale double-wrap left over from
  an earlier draft — so a "successful" pull silently applied an empty state. The integration test is
  what caught it; two isolated unit tests of push and pull each passing individually did not, because
  the bug was only visible in the shape crossing the boundary between them.

**CORS is on deliberately, wide open** (`Access-Control-Allow-Origin: *` on `/api/*`). The app is not
necessarily served *by* this process — it might be the GitHub-hosted copy, or the offline-cached PWA,
pointed at a server running on another machine entirely as its sync target — so every real call is
cross-origin, and a JSON `PUT` triggers a CORS preflight. There is no cookie or credential involved to
leak by allowing any origin to ask it a question; the wildcard is the correct choice for what this is,
not a shortcut taken to make a test pass.

```bash
node weld-academy/tools/test-server.mjs              # 22 checks against the server alone
node weld-academy/tools/test-sync-integration.mjs     # 10 checks, real two-device round trip
```

---

## Honest limits

**This is not a qualification.** No certificate, no accreditation, no ticket. What it teaches is the
knowledge an accredited course teaches, so nothing has to be unlearned later — but the ticket itself
means an RTO and a coded test welded on a real coupon and destructively tested. Unit 9 explains what
that day involves, and the **Getting the ticket** page explains recognition of prior learning and
what evidence an assessor actually wants.

**Progress is per-browser.** No accounts, no sync. Clearing site data clears it.

**Old Mate does not look at photos unless you set up the optional AI**, and even then it is a coarse
spotter feeding an expert system, not a magic diagnosis.

**Offline answers can only come from what is in the app.** Ask him something outside it and he says
so rather than guessing — that is the trade for never inventing welding advice. On 14 realistic
questions the right passage comes first 12 times; in the other two it is in the *he also reckons*
tiles underneath.

**Speech with the screen off is unreliable on some Android versions.** Drive Mode holds a media
session and a wake lock to work around it, which is why the screen says to keep the phone plugged
in. It is the best a web app can do.

**There is no wake word** — voice asking is one tap, sized to hit without looking.

**Price feeds need signal.** Copper, gold, silver, platinum and palladium come from a live API;
steel, lead, stainless and brass have no free feed a phone can call, so those use a rough standing
figure and are marked *estimate* wherever they appear.

**Teardown metal contents are ranges, not promises.** A truck alternator and a small car one are
different animals. Refrigerant work is licensed, and the app says so rather than working around it.

**The scrap and trading content is general** and state rules differ — NSW bans cash payment for
scrap outright, other states vary.

**The nesting dolls are a collection, not a game engine.** They unlock from progress and reuse the
existing celebration; there is nothing to tap at, and the page says so.

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
  js/content-salvage.js      units 10–11: electrics & salvage, and the optional metal trade
  js/practice.js             bench drills and recall cards
  js/diagrams.js             14 hand-drawn inline SVG diagrams + the lesson map
  js/reference.js            defects, clues, cheat sheets, checklist, badges, levels
  js/sources.js              every linked source, and what the app is only estimating
  js/progress.js             XP, levels, streaks, badges, drills, proficiency, storage
  js/profile.js              the eight questions, the themes, and what they change
  js/juice.js                sparks, celebrations, sound, haptics, count-ups
  js/vision.js               the optional AI scan, provider-pluggable
  js/script.js               turning a lesson into something you can listen to
  js/narrator.js             read-aloud, on the phone's own speech engine
  js/ask.js                  ask him in your own words; BM25F over the app's own content
  js/drive.js                Drive Mode: whole units, media session, timestamps
  js/teardown.js             is it worth pulling apart, and what is inside it
  js/tally.js                her scales, spot vs yard, fuel costs, what she actually made
  js/dolls.js                the collection, drawn as inline SVG
  js/personal.js             every personal touch, in one file, as replaceable slots
  js/sync.js                 optional cross-device sync client, talks to server/
  js/market.js               metal and Bitcoin prices, cached and offline-safe
  js/app.js                  router, views, event wiring
  server/index.js            optional: sync + the AI proxy. Zero npm dependencies.
  tools/validate-content.mjs content integrity checks
  tools/check-links.mjs      the sources page's links, checked for real over the network
  tools/e2e-smoke.cjs        full browser walkthrough
  tools/test-server.mjs      the optional server, tested alone
  tools/test-sync-integration.mjs   real two-device sync round trip
```

No dependencies, no bundler, no framework, in the app itself. Plain `<script src>` (not ES modules)
so it works opened straight from disk. The optional server has no dependencies either — only Node's
own built-ins.

---

## Working on it

**Add a lesson:** another object in a unit's `lessons` array, plus a `practice.js` entry with a
drill and two recall cards. Progress, percentages, unlocks and the map all count from the data.

**Add a defect:** add to `defects` in `js/reference.js` and weight it against clue ids in `match`.

**Add a diagram:** add to `js/diagrams.js` and point a lesson at it in `WA_DIAGRAM_MAP`.

**On diagram sharpness:** they are inline SVG — vector, not images — so they are resolution
independent and render pin-sharp at any zoom and on any pixel density, which no PNG can do. They
also share a gradient and glow palette (`#gPlate`, `#gWeld`, `#gTung`, `#fGlow`, defined once in
`index.html`) so plates have depth and the bead reads as molten rather than flat orange.

**Checks:**

```bash
node weld-academy/tools/validate-content.mjs     # quiz indices, drill/recall coverage, clue wiring,
                                                 # diagram map, badge coverage, table shapes,
                                                 # spoken scripts, teardown verdicts, source links,
                                                 # doll reachability, offline cache completeness
node weld-academy/tools/e2e-smoke.cjs            # 195 checks: full walkthrough in headless Chromium
node weld-academy/tools/check-links.mjs          # every source link, for real, over the network
WA_SHOTS=/tmp/shots node weld-academy/tools/e2e-smoke.cjs   # ...and capture screenshots
```

The smoke test needs Playwright available (`NODE_PATH=/usr/lib/node_modules` if it is installed
globally). It drives the eight profile questions and the theme they set, all five lesson modes, a
bench drill, recall cards, a full quiz, unit unlocking, two Old Mate diagnoses, the tile-and-sheet
flow, the vision label mapping, Drive Mode playing a whole unit end to end with speech stubbed, the
offline question corpus and its refusal path, the tally's two valuations, the teardown verdicts and
their safety warnings, the sources page, the ticket path, the doll unlocks, and the hidden note
driven through three real timed presses — plus persistence across reload, the manifest, and overflow
and tap-target size at 390 px, 800 px and 1180 px.

`check-links.mjs` also runs in CI. Sites that block scripted requests are reported as unverified
rather than failing the build — a bot filter is not a dead link.

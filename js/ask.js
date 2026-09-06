/* ============================================================================
 * WELD ACADEMY — ASK OLD MATE
 * ----------------------------------------------------------------------------
 * She asks a question in her own words and gets an answer back.
 *
 * THE RULE THIS IS BUILT ON: he never makes anything up. Every answer offline
 * is a passage that is already in the app — a lesson, a defect write-up, a
 * cheat sheet, a drill, a teardown entry. When nothing matches he says so.
 * That is deliberate. She thinks AI is unreliable, and an app that confidently
 * invents a welding setting would prove her right in the worst way, with a
 * gas bottle involved.
 *
 * HOW IT FINDS THINGS
 *   A small inverted index built at load, scored by term overlap with IDF-ish
 *   weighting, plus a synonym map so the words she actually uses ("birds
 *   nest", "spitting", "what's copper at") reach the words the course uses
 *   ("feed roll", "spatter", "price"). No dependencies, no build step, and it
 *   runs in a millisecond on a phone.
 *
 * THE AI UPGRADE (off by default)
 *   If a chat key is configured in Settings, the same matched passages are
 *   handed to a model as grounding and it answers conversationally. Any
 *   failure — no signal, bad key, timeout, rubbish response — falls back to
 *   the offline answer. It can only ever improve the wording, never replace
 *   the source. Same contract as js/vision.js.
 * ==========================================================================*/

window.WA_ASK = (function () {
  'use strict';

  var TIMEOUT_MS = 20000;
  var docs = [];            // [{ id, title, text, where, href, kind }]
  var index = null;         // term -> [docIndex, ...]
  var built = false;

  /* --------------------------------------------------------------- corpus */

  /* Each document has a head and a body. The head — its name, what it is in one
     line, and its key points — says what the passage is *about*; the body only
     says what it mentions. Scoring them separately is the difference between
     "spatter" finding the spatter write-up and finding a lesson that happens to
     use the word twice. */
  function add(kind, title, head, body, where, href) {
    if (!head && !body) return;
    docs.push({
      kind: kind, title: title,
      head: String(head || ''),
      text: String(body || ''),
      where: where || '', href: href || ''
    });
  }

  function build() {
    if (built) return docs.length;
    docs = [];

    var C = window.WA_CONTENT, R = window.WA_REFERENCE, PR = window.WA_PRACTICE;

    (C && C.modules || []).forEach(function (m) {
      m.lessons.forEach(function (l) {
        add('lesson', l.title,
            [l.title, l.blurb, (l.keyPoints || []).join(' ')].filter(Boolean).join(' '),
            [(l.body || []).join(' '), l.tip].filter(Boolean).join(' '),
            m.title, '#/lesson/' + m.id + '/' + l.id);

        var pr = (PR || {})[l.id];
        if (pr && pr.practice) {
          add('drill', 'Drill: ' + l.title,
              [l.title, pr.practice.task].join(' '),
              [pr.practice.why, (pr.practice.steps || []).join(' '),
               (pr.practice.pass || []).join(' ')].join(' '),
              m.title, '#/lesson/' + m.id + '/' + l.id);
        }
      });
    });

    (R && R.defects || []).forEach(function (d) {
      add('defect', d.name,
          [d.name, d.plain].join(' '),
          [(d.causes || []).join(' '), (d.fixNow || []).join(' '),
           (d.prevent || []).join(' '), d.processNote].join(' '),
          'Old Mate', '#/doctor');
    });

    (R && R.cheatsheets || []).forEach(function (s) {
      var rows = (s.rows || []).map(function (r) { return r.join(' '); }).join(' ');
      add('cheatsheet', s.title, [s.title, s.note].join(' '),
          [rows, (s.extras || []).join(' ')].join(' '),
          'Cheat sheets', '#/kit/sheets');
    });

    (R && R.scrapGuide || []).forEach(function (sec) {
      add('scrap', sec.title, [sec.title, (sec.body || [])[0]].filter(Boolean).join(' '),
          [(sec.body || []).slice(1).join(' '), (sec.points || []).join(' ')].join(' '),
          'Money & metal', '#/kit/scrap');
    });

    (R && R.preflight || []).forEach(function (sec) {
      add('checklist', sec.title, sec.title, (sec.items || []).join(' '),
          'Pre-flight', '#/kit/checklist');
    });

    // Teardown entries, when that module is loaded.
    var TD = window.WA_TEARDOWN;
    (TD && TD.items || []).forEach(function (it) {
      add('teardown', it.name,
          [it.name, it.plain, it.hook].filter(Boolean).join(' '),
          [it.metals, it.verdict, (it.notes || []).join(' ')].join(' '),
          'What is in this thing', '#/teardown');
    });

    buildIndex();
    built = true;
    return docs.length;
  }

  /* ---------------------------------------------------------- the language */

  /* Words she would use → words the course uses. This is where a search that
     technically works becomes a search that answers the question. */
  var SYNONYMS = {
    'burnt': 'burn', 'burnout': 'burnthrough', 'blew': 'burnthrough',
    'holes': 'porosity', 'pinholes': 'porosity', 'bubbles': 'porosity',
    'pinholing': 'porosity', 'blowholes': 'porosity',
    'spitting': 'spatter', 'spat': 'spatter', 'sparking': 'spatter',
    'birdsnest': 'feed', 'birds': 'feed', 'nest': 'feed', 'nesting': 'feed',
    'stuck': 'stick', 'sticking': 'stick', 'glued': 'stick',
    'ally': 'aluminium', 'alloy': 'aluminium', 'allie': 'aluminium',
    'stainless': 'stainless', 'inox': 'stainless',
    'worth': 'price', 'paying': 'price', 'pays': 'price', 'value': 'price',
    'money': 'price', 'cost': 'price', 'quid': 'price',
    'gouge': 'undercut', 'groove': 'undercut',
    'warping': 'distortion', 'warped': 'distortion', 'bent': 'distortion',
    'crack': 'cracking', 'cracked': 'cracking', 'split': 'cracking',
    'settings': 'setting', 'amps': 'amperage', 'amperage': 'current',
    'volts': 'voltage', 'gas': 'shielding',
    'rod': 'electrode', 'rods': 'electrode', 'sticks': 'electrode',
    'wire': 'electrode', 'stinger': 'holder',
    'mask': 'helmet', 'lid': 'helmet', 'shield': 'helmet',
    'wear': 'ppe', 'wearing': 'ppe', 'clothes': 'ppe', 'clothing': 'ppe',
    'gloves': 'ppe', 'boots': 'ppe', 'leathers': 'ppe', 'apron': 'ppe',
    'fumes': 'fume', 'smoke': 'fume',
    'strip': 'stripping', 'pull': 'stripping', 'apart': 'stripping',
    'copper': 'copper', 'coppers': 'copper',
    'safe': 'safety', 'dangerous': 'safety', 'hurt': 'safety'
  };

  var STOP = /^(the|a|an|and|or|is|are|was|were|be|been|to|of|in|on|at|for|with|it|its|my|me|i|you|your|do|does|did|how|what|why|when|where|which|who|can|could|should|would|will|shall|if|then|than|that|this|these|those|there|here|so|but|not|no|yes|get|got|getting|go|going|about|from|by|as|too|very|just|like|any|some|out|up|down|off|keep|keeps|make|makes|need|needs)$/;

  function terms(text) {
    var raw = String(text || '').toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    var out = [];
    raw.forEach(function (w) {
      if (w.length < 2 || STOP.test(w)) return;
      out.push(w);
      var syn = SYNONYMS[w];
      if (syn && syn !== w) out.push(syn);
      // Crude stemming: plural and -ing forms reach the same root.
      if (/ies$/.test(w)) out.push(w.replace(/ies$/, 'y'));
      else if (/s$/.test(w) && !/ss$/.test(w)) out.push(w.replace(/s$/, ''));
      if (/ing$/.test(w) && w.length > 5) out.push(w.replace(/ing$/, ''));
    });
    return out;
  }


  /* How much more a word in the head counts than the same word in the body. */
  var HEAD_WEIGHT = 3;
  var avgHead = 0, avgBody = 0;

  /* BM25F: each field is normalised against the average length of that field,
     not of the whole document. This matters here because the two field types
     are wildly different sizes — a one-line defect summary against a lesson's
     four paragraphs. Normalising both against one average made short defect
     write-ups beat long lessons whose title and key points were a better
     match ("what shade lens do I need" landing on a bead-fault write-up that
     mentions shade in passing, rather than the lesson with the shade table). */
  function buildIndex() {
    index = {};
    var totalHead = 0, totalBody = 0;
    var built = [];

    docs.forEach(function (d, i) {
      var headTerms = terms(d.head);
      var bodyTerms = terms(d.text);
      d.titleTerms = terms(d.title);
      d.headLen = headTerms.length;
      d.bodyLen = bodyTerms.length;
      d.len = d.headLen + d.bodyLen;
      totalHead += d.headLen;
      totalBody += d.bodyLen;

      var hf = {}, bf = {};
      headTerms.forEach(function (t) { hf[t] = (hf[t] || 0) + 1; });
      bodyTerms.forEach(function (t) { bf[t] = (bf[t] || 0) + 1; });
      built.push({ i: i, hf: hf, bf: bf });
    });

    avgHead = docs.length ? (totalHead / docs.length) || 1 : 1;
    avgBody = docs.length ? (totalBody / docs.length) || 1 : 1;

    built.forEach(function (e) {
      var d = docs[e.i];
      var all = {};
      Object.keys(e.hf).forEach(function (t) { all[t] = 1; });
      Object.keys(e.bf).forEach(function (t) { all[t] = 1; });
      Object.keys(all).forEach(function (t) {
        // Each field's frequency normalised by that field's own length, then
        // combined — this is the pseudo-frequency BM25F scores on.
        var h = (e.hf[t] || 0) / (1 - B + B * (d.headLen / avgHead));
        var b = (e.bf[t] || 0) / (1 - B + B * (d.bodyLen / avgBody));
        (index[t] = index[t] || []).push({ i: e.i, f: HEAD_WEIGHT * h + b });
      });
    });
  }

  /* ---------------------------------------------------------------- search
   *
   * BM25 rather than a plain term count. The difference matters here: a long
   * lesson mentions "holes" in passing and would otherwise beat the Porosity
   * write-up, which is short and entirely about holes. Length normalisation
   * (b) stops the long documents winning on volume, and term saturation (k1)
   * stops one repeated word dominating. */
  var K1 = 1.4, B = 0.75;

  /* How someone describes a fault rather than asking about a topic. */
  var SYMPTOM = /\b(why|stop|fix|wrong|keeps?|full of|there is|there's|i have|i've got|my weld|it is|it's|came out|ended up|looks?|went)\b/i;

  /* A passage whose own name ties it to one process. */
  var PROCESS = /\b(TIG|MIG|SMAW|GMAW|GTAW)\b/;

  function search(question, limit) {
    build();
    var qs = terms(question);
    if (!qs.length) return [];

    var scores = {};
    var n = docs.length;
    qs.forEach(function (t) {
      var postings = index[t];
      if (!postings || !postings.length) return;
      var idf = Math.log(1 + (n - postings.length + 0.5) / (postings.length + 0.5));
      postings.forEach(function (p) {
        // Lengths are already normalised into p.f by buildIndex, so saturation
        // is all that is left to apply.
        scores[p.i] = (scores[p.i] || 0) + idf * (p.f * (K1 + 1)) / (p.f + K1);
      });
    });

    var out = Object.keys(scores).map(function (i) {
      var d = docs[i];
      var s = scores[i];
      // A word in the passage's own name is close to decisive, and worth more
      // when the word is rare: "spatter" naming the spatter write-up means far
      // more than "weld" appearing in a title.
      qs.forEach(function (t) {
        if (d.titleTerms.indexOf(t) === -1) return;
        var postings = index[t];
        var idf = postings ? Math.log(1 + (n - postings.length + 0.5) / (postings.length + 0.5)) : 1;
        s += 1.6 * idf;
      });
      // Nine times in ten she is describing a symptom, and the right shape of
      // answer to that is a defect write-up, not a lesson that mentions it.
      if (d.kind === 'defect' && SYMPTOM.test(question)) s += 1.4;
      // An answer that is specific to one process should not win a question
      // that never mentioned that process — "my weld is spitting" is not a
      // TIG question just because the TIG write-up uses the word.
      var proc = d.title.match(PROCESS);
      if (proc && !new RegExp(proc[0], 'i').test(question)) s *= 0.72;
      return { doc: d, score: s };
    });

    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, limit || 3);
  }

  /* ------------------------------------------------------- price questions */

  var PRICE_Q = /\b(price|worth|going|running|spot|per kilo|a kilo|kg)\b/i;
  var METALS = {
    copper: /\bcopper\b/i, gold: /\bgold\b/i, silver: /\bsilver\b/i,
    aluminium: /\b(aluminium|aluminum|ally|alloy)\b/i,
    bitcoin: /\b(bitcoin|btc)\b/i, platinum: /\bplatinum\b/i, palladium: /\bpalladium\b/i
  };

  function looksLikePrice(q) {
    if (!PRICE_Q.test(q)) return null;
    for (var k in METALS) if (METALS[k].test(q)) return k;
    return null;
  }

  function priceAnswer(metal) {
    var MK = window.WA_MARKET;
    if (!MK) return null;
    var row = MK.rows().filter(function (r) {
      return r.have && new RegExp(metal, 'i').test(r.name);
    })[0];
    if (!row) {
      return { text: 'I have not got a price for ' + metal + ' on this phone. ' +
        'The metals page pulls them in when you have signal.',
        where: 'Money & metal', href: '#/kit/scrap', kind: 'price' };
    }
    var ago = MK.fetchedAgo();
    return {
      text: metal.charAt(0).toUpperCase() + metal.slice(1) + ' is ' + row.primary +
        (row.secondary ? ' (' + row.secondary + ')' : '') + '. ' +
        (ago ? 'That is from ' + ago + '. ' : '') +
        'That is spot — the ceiling, not what a yard hands you.',
      where: 'Money & metal', href: '#/kit/scrap', kind: 'price'
    };
  }

  /* ------------------------------------------------------- offline answer */

  /* Trim a passage to the part that actually answers her, rather than reading
     a whole lesson at her. Picks the sentences carrying her words. */
  function excerpt(text, question, maxSentences) {
    var qs = terms(question);
    var sentences = String(text).match(/[^.!?]+[.!?]+/g) || [String(text)];
    var scored = sentences.map(function (s, i) {
      var st = terms(s);
      var hit = 0;
      qs.forEach(function (t) { if (st.indexOf(t) !== -1) hit++; });
      return { s: s.trim(), hit: hit, i: i };
    }).filter(function (x) { return x.s.length > 20; });

    var best = scored.filter(function (x) { return x.hit > 0; })
      .sort(function (a, b) { return b.hit - a.hit || a.i - b.i; })
      .slice(0, maxSentences || 3)
      .sort(function (a, b) { return a.i - b.i; });

    if (!best.length) best = scored.slice(0, maxSentences || 2);
    return best.map(function (x) { return x.s; }).join(' ');
  }

  function offline(question) {
    var metal = looksLikePrice(question);
    if (metal) {
      var p = priceAnswer(metal);
      if (p) return { ok: true, source: 'offline', answers: [p], question: question };
    }

    var hits = search(question, 3);
    if (!hits.length || hits[0].score < 1.2) {
      return {
        ok: false, source: 'offline', question: question,
        answers: [{
          text: 'That one is not in what I have been taught, and I am not going to ' +
                'guess at it — not with welding. Try different words, or ask someone ' +
                'who can get their hands on it.',
          where: '', href: '', kind: 'none'
        }]
      };
    }

    return {
      ok: true, source: 'offline', question: question,
      answers: hits.map(function (h) {
        return {
          text: excerpt(h.doc.text, question, 3),
          title: h.doc.title,
          where: h.doc.where,
          href: h.doc.href,
          kind: h.doc.kind
        };
      })
    };
  }

  /* --------------------------------------------------- the optional upgrade */

  function config() {
    var s = window.WA_PROGRESS.settings();
    return s.chat || { provider: 'off' };
  }

  function save(cfg) { window.WA_PROGRESS.setSetting('chat', cfg); }
  function isConfigured() { var c = config(); return !!(c.provider && c.provider !== 'off' && c.key); }
  function providerName() {
    var c = config();
    return c.provider === 'anthropic' ? 'Claude'
         : c.provider === 'custom' ? 'Custom endpoint' : 'Off';
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error('timeout')); }, ms);
      promise.then(function (v) { clearTimeout(t); resolve(v); },
                   function (e) { clearTimeout(t); reject(e); });
    });
  }

  /* The model is given the matched passages and told to answer from them. It
     is a rewriter, not a source. */
  function prompt(question, hits) {
    return 'You are Old Mate: a time-served Australian welder teaching someone ' +
      'practical and hands-on. Answer the question using ONLY the reference ' +
      'passages below. Australian usage, metric. Be brief — three or four ' +
      'sentences, plain words, no lists, no preamble. If the passages do not ' +
      'answer it, say "That is not something I have been taught" and nothing ' +
      'more. Never invent a setting, a number or a standard.\n\n' +
      'REFERENCE PASSAGES:\n' +
      hits.map(function (h, i) {
        return (i + 1) + '. [' + h.doc.title + '] ' + h.doc.text.slice(0, 1200);
      }).join('\n\n') +
      '\n\nQUESTION: ' + question;
  }

  var PROVIDERS = {
    anthropic: function (cfg, text) {
      return fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': cfg.key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: cfg.model || 'claude-opus-5',
          max_tokens: 400,
          messages: [{ role: 'user', content: text }]
        })
      }).then(function (r) { return r.json(); })
        .then(function (j) { return j && j.content && j.content[0] && j.content[0].text; });
    },
    /* There is deliberately no direct OpenAI option here. Their API sends no
       CORS headers, so a browser blocks the request before it leaves the
       phone — an option that can never work is worse than no option, and CI
       caught exactly that failure. Anyone running an OpenAI-backed proxy can
       point the custom endpoint below at it. */
    custom: function (cfg, text) {
      return fetch(cfg.url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + cfg.key },
        body: JSON.stringify({ prompt: text })
      }).then(function (r) { return r.json(); })
        .then(function (j) { return j && (j.text || j.answer || j.output); });
    }
  };

  /* The single entry point. Never rejects: an answer always comes back, and
     it is the offline one whenever anything at all goes wrong. */
  function answer(question) {
    var base = offline(question);
    if (!isConfigured() || !base.ok || base.answers[0].kind === 'price') {
      return Promise.resolve(base);
    }

    var cfg = config();
    var fn = PROVIDERS[cfg.provider];
    if (!fn) return Promise.resolve(base);

    var hits = search(question, 3);
    return withTimeout(fn(cfg, prompt(question, hits)), TIMEOUT_MS)
      .then(function (text) {
        text = (text || '').trim();
        if (!text || text.length < 10) return base;      // nothing usable
        return {
          ok: true, source: 'ai', question: question,
          answers: [{
            text: text,
            title: base.answers[0].title,
            where: base.answers[0].where,
            href: base.answers[0].href,
            kind: 'ai'
          }],
          also: base.answers.slice(1)
        };
      })
      .catch(function () { return base; });                // no signal, bad key, timeout
  }

  return {
    build: build,
    search: search,
    answer: answer,
    offline: offline,
    terms: terms,
    excerpt: excerpt,
    looksLikePrice: looksLikePrice,
    config: config, save: save, isConfigured: isConfigured, providerName: providerName,
    docCount: function () { build(); return docs.length; }
  };
})();

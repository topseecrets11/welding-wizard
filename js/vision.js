/* ============================================================================
 * WELD ACADEMY — VISION (optional AI weld scan)
 * ----------------------------------------------------------------------------
 * The app works completely without this. Nothing here is required, nothing
 * breaks if it is switched off, and there is no half-finished AI UI on screen
 * when no provider is configured — it simply is not there.
 *
 * WHAT IT DOES
 *   Takes a photo, asks a model what it sees, maps the answer onto the Weld
 *   Doctor's own clue list, and then hands over to the offline expert system
 *   for the naming, the cause and the fix.
 *
 * WHY THAT SPLIT
 *   The free open weld models are coarse — the well-known public dataset
 *   (CC0, mirrored at rikkarth/welding-defect-object-detection, with YOLOv8
 *   weights at avinashhm/welding-defect-yolov8) has three classes only:
 *   good weld / bad weld / defect. It can spot and localise, it cannot tell
 *   porosity from undercut. So the model does the spotting, and the expert
 *   system — which does know the difference — does the diagnosis. That way
 *   the AI is never the thing that looks stupid.
 *
 * PROVIDERS
 *   off      nothing (default)
 *   hfapi    Hugging Face Inference API: model id + token, image bytes POSTed,
 *            returns [{label, score}] for classification or detection boxes.
 *   space    A Hugging Face Space (or any server) you host, POSTed JSON
 *            { image: "data:image/jpeg;base64,..." }.
 *   custom   Same as space, but you supply the whole URL and header.
 *
 * All of them: one fetch, a timeout, and a normaliser. Add another provider by
 * adding one function to PROVIDERS below.
 * ==========================================================================*/

window.WA_VISION = (function () {
  'use strict';

  var TIMEOUT_MS = 30000;

  /* Model label → Weld Doctor clue ids. Deliberately generous with synonyms,
     because every model names its classes slightly differently. */
  var LABEL_MAP = [
    { match: /poros|pin ?hole|blow ?hole|gas pocket/i, clues: ['holes'] },
    { match: /undercut/i,                              clues: ['groove'] },
    { match: /overlap|cold ?lap|cold ?roll/i,          clues: ['sitting-on'] },
    { match: /lack of fusion|incomplete fusion|lof/i,  clues: ['sitting-on', 'uneven'] },
    { match: /lack of penetration|incomplete pen|lop/i, clues: ['not-through'] },
    { match: /burn ?through|burn ?out|excess pen/i,    clues: ['hole'] },
    { match: /crack/i,                                 clues: ['crack-hot'] },
    { match: /slag|inclusion/i,                        clues: ['glassy'] },
    { match: /spatter/i,                               clues: ['spatter'] },
    { match: /distort|warp/i,                          clues: ['warped'] },
    { match: /tungsten/i,                              clues: ['tungsten'] },
    // The coarse three-class models most free weights use:
    { match: /bad ?weld|defect/i,                      clues: ['uneven'] },
    { match: /good ?weld/i,                            clues: [] }
  ];

  function config() {
    var s = window.WA_PROGRESS.settings();
    return s.vision || { provider: 'off' };
  }

  function isConfigured() {
    var c = config();
    if (!c || !c.provider || c.provider === 'off') return false;
    if (c.provider === 'hfapi') return !!(c.model && c.token);
    return !!c.endpoint;
  }

  function providerName() {
    var c = config();
    return ({ hfapi: 'Hugging Face Inference API', space: 'Hosted Space', custom: 'Custom endpoint' })[c.provider] || 'Off';
  }

  function save(cfg) { window.WA_PROGRESS.setSetting('vision', cfg); }

  /* ------------------------------------------------------------- helpers */

  function dataUrlToBlob(dataUrl) {
    var parts = dataUrl.split(',');
    var mime = (parts[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
    var bin = atob(parts[1]);
    var buf = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return new Blob([buf], { type: mime });
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error('timeout')); }, ms);
      promise.then(function (v) { clearTimeout(t); resolve(v); },
                   function (e) { clearTimeout(t); reject(e); });
    });
  }

  /* Anything a provider returns gets flattened to [{label, score, box?}]. */
  function normalise(raw) {
    var out = [];

    function push(label, score, box) {
      if (!label) return;
      out.push({ label: String(label), score: typeof score === 'number' ? score : null, box: box || null });
    }

    if (Array.isArray(raw)) {
      raw.forEach(function (item) {
        if (!item) return;
        if (typeof item === 'string') return push(item, null);
        push(item.label || item.class || item.name || item.class_name,
             item.score != null ? item.score : item.confidence,
             item.box || item.bbox || null);
      });
    } else if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.predictions)) return normalise(raw.predictions);
      if (Array.isArray(raw.labels)) return normalise(raw.labels);
      if (Array.isArray(raw.data)) return normalise(raw.data);
      if (raw.label) push(raw.label, raw.score);
    }

    return out.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
  }

  function cluesFor(labels) {
    var set = {};
    labels.forEach(function (l) {
      if (l.score != null && l.score < 0.25) return;      // ignore weak guesses
      LABEL_MAP.forEach(function (m) {
        if (m.match.test(l.label)) m.clues.forEach(function (c) { set[c] = true; });
      });
    });
    return Object.keys(set);
  }

  /* ----------------------------------------------------------- providers */

  var PROVIDERS = {
    hfapi: function (dataUrl, c) {
      return fetch('https://api-inference.huggingface.co/models/' + c.model, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + c.token, 'Content-Type': 'application/octet-stream' },
        body: dataUrlToBlob(dataUrl)
      }).then(readJson);
    },

    space: function (dataUrl, c) {
      return fetch(c.endpoint, {
        method: 'POST',
        headers: headersFor(c),
        body: JSON.stringify({ image: dataUrl, data: [dataUrl] })
      }).then(readJson);
    },

    custom: function (dataUrl, c) {
      return fetch(c.endpoint, {
        method: 'POST',
        headers: headersFor(c),
        body: JSON.stringify({ image: dataUrl })
      }).then(readJson);
    }
  };

  function headersFor(c) {
    var h = { 'Content-Type': 'application/json' };
    if (c.token) h.Authorization = 'Bearer ' + c.token;
    return h;
  }

  function readJson(res) {
    if (!res.ok) {
      return res.text().then(function (t) {
        var msg = res.status === 503 ? 'The model is warming up — give it 20 seconds and try again.'
                : res.status === 401 || res.status === 403 ? 'That token was rejected.'
                : res.status === 404 ? 'Model or endpoint not found — check the name.'
                : 'Server said ' + res.status + '.';
        throw new Error(msg + (t && t.length < 200 ? ' ' + t : ''));
      });
    }
    return res.json();
  }

  /* -------------------------------------------------------------- public */

  /* analyse(dataUrl) → { ok, labels, clues, note, error } — never throws. */
  function analyse(dataUrl) {
    var c = config();
    var fn = PROVIDERS[c.provider];

    if (!fn) {
      return Promise.resolve({ ok: false, error: 'No AI provider is set up.', labels: [], clues: [] });
    }

    return withTimeout(fn(dataUrl, c), TIMEOUT_MS)
      .then(function (raw) {
        var labels = normalise(raw);
        var clues = cluesFor(labels);
        return {
          ok: true,
          labels: labels,
          clues: clues,
          note: labels.length
            ? 'The model spots and localises. The naming and the fix below come from the Weld Doctor.'
            : 'The model returned nothing it recognised. Tick what you can see instead.'
        };
      })
      .catch(function (e) {
        return {
          ok: false,
          labels: [], clues: [],
          error: e && e.message === 'timeout'
            ? 'No answer in 30 seconds — probably no signal out here. The symptom checklist works offline.'
            : (e && e.message) || 'Could not reach the model.'
        };
      });
  }

  return {
    isConfigured: isConfigured,
    providerName: providerName,
    config: config,
    save: save,
    analyse: analyse,
    normalise: normalise,      // exported for tests
    cluesFor: cluesFor
  };
})();

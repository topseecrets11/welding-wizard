/* ============================================================================
 * WELD ACADEMY — SYNC (optional)
 * ----------------------------------------------------------------------------
 * The app works completely without this, same promise as js/vision.js and
 * js/ask.js's AI upgrade: off by default, no UI when unconfigured, and every
 * failure falls back to what already works — which here is just "keep using
 * localStorage", the thing the whole app is built on regardless.
 *
 * WHAT IT IS: she types a code into Settings — any word — and the same code
 * on a second device pulls her progress across. That is the entire account
 * model. No email, no password, no login screen to explain to someone who
 * does not want one. It is obscurity, not security, and the server's own
 * comments say so; nothing sensitive should ever depend on a sync code being
 * secret.
 *
 * WHAT IT IS NOT: a replacement for localStorage. It is a periodic push and
 * an occasional pull against it. If the server is unreachable — closed
 * laptop, no self-hosting, wrong URL — the app does not know or care.
 * ==========================================================================*/

window.WA_SYNC = (function () {
  'use strict';

  var TIMEOUT_MS = 8000;
  var PUSH_DEBOUNCE_MS = 4000;
  var pushTimer = null;
  var lastPushedJSON = null;

  function P() { return window.WA_PROGRESS; }

  function config() {
    var s = P().settings();
    return s.sync || { url: '', code: '', auto: false };
  }

  function save(cfg) { P().setSetting('sync', cfg); }

  function isConfigured() {
    var c = config();
    return !!(c.url && c.code);
  }

  function withTimeout(promise, ms) {
    var ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
    return promise(ctl && ctl.signal).finally(function () { clearTimeout(t); });
  }

  function endpoint() {
    var c = config();
    return c.url.replace(/\/+$/, '') + '/api/state/' + encodeURIComponent(c.code);
  }

  /* Everything that matters, in one object — the same shape a fresh install
     would rebuild from scratch, so pulling it is just "become this". */
  function snapshot() {
    return {
      state: P().state,
      profile: (window.WA_PROFILE && window.WA_PROFILE.answers()) || null,
      exportedAt: new Date().toISOString()
    };
  }

  function applySnapshot(snap) {
    if (!snap || !snap.state) return false;
    // state is deliberately not writable from outside progress.js (see its
    // own comment on replaceState) — this is the sanctioned way in, and it
    // merges onto defaults so an older snapshot missing a newer field does
    // not leave holes in the state it produces.
    var applied = P().replaceState(snap.state);
    if (applied && snap.profile && window.WA_PROFILE) {
      window.WA_PROFILE.save(snap.profile);
    }
    return applied;
  }

  /* --------------------------------------------------------------- push */

  function push() {
    if (!isConfigured()) return Promise.resolve({ ok: false, reason: 'not configured' });
    var body = JSON.stringify(snapshot());
    if (body === lastPushedJSON) return Promise.resolve({ ok: true, reason: 'unchanged' });

    return withTimeout(function (signal) {
      return fetch(endpoint(), {
        method: 'PUT', signal: signal,
        headers: { 'content-type': 'application/json' },
        body: body
      });
    }, TIMEOUT_MS)
      .then(function (r) {
        if (!r.ok) return { ok: false, reason: 'server said ' + r.status };
        lastPushedJSON = body;
        return r.json().then(function (j) { return { ok: true, savedAt: j.savedAt }; });
      })
      .catch(function (e) { return { ok: false, reason: e.name === 'AbortError' ? 'timeout' : 'no signal' }; });
  }

  /* Called on things that change what matters, but coalesced — she is not
     paying a network round trip for every single tap. */
  function scheduleAutoPush() {
    var c = config();
    if (!c.auto || !isConfigured()) return;
    if (pushTimer) return;
    pushTimer = setTimeout(function () { pushTimer = null; push(); }, PUSH_DEBOUNCE_MS);
  }

  /* --------------------------------------------------------------- pull */

  function pull() {
    if (!isConfigured()) return Promise.resolve({ ok: false, reason: 'not configured' });
    return withTimeout(function (signal) {
      return fetch(endpoint(), { signal: signal });
    }, TIMEOUT_MS)
      .then(function (r) {
        if (r.status === 404) return { ok: false, reason: 'nothing saved under that code yet' };
        if (!r.ok) return { ok: false, reason: 'server said ' + r.status };
        // The server wraps whatever was PUT in { ok, state, savedAt } — and
        // what was PUT is itself a snapshot() object, { state, profile,
        // exportedAt }. So j.state here IS the snapshot, not a second layer
        // of wrapping — unwrap exactly once.
        return r.json().then(function (j) { return { ok: true, snapshot: j.state, savedAt: j.savedAt }; });
      })
      .catch(function (e) { return { ok: false, reason: e.name === 'AbortError' ? 'timeout' : 'no signal' }; });
  }

  /* Pull and become that state, in one step — what the "Sync now" button on
     a second device actually does. */
  function pullAndApply() {
    return pull().then(function (res) {
      if (!res.ok) return res;
      var applied = applySnapshot(res.snapshot);
      return { ok: applied, reason: applied ? undefined : 'nothing usable in that save' };
    });
  }

  function health() {
    var c = config();
    if (!c.url) return Promise.resolve({ ok: false, reason: 'no server set' });
    return withTimeout(function (signal) {
      return fetch(c.url.replace(/\/+$/, '') + '/api/health', { signal: signal });
    }, TIMEOUT_MS)
      .then(function (r) { return r.ok ? r.json() : { ok: false }; })
      .catch(function () { return { ok: false, reason: 'no signal' }; });
  }

  return {
    config: config, save: save, isConfigured: isConfigured,
    push: push, pull: pull, pullAndApply: pullAndApply,
    scheduleAutoPush: scheduleAutoPush, health: health
  };
})();

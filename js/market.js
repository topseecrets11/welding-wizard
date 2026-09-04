/* ============================================================================
 * WELD ACADEMY — METAL & MONEY
 * ----------------------------------------------------------------------------
 * Live-ish spot prices for the metals a welder actually handles, converted to
 * AUD and to the units a scrap yard weighs in (per kilo, per gram).
 *
 * SOURCES — all free, no key, and CORS-open so the phone can call them direct:
 *   api.gold-api.com     gold, silver, copper, platinum, palladium (USD)
 *   api.coingecko.com    Bitcoin in AUD, with 24h change
 *   api.frankfurter.dev  USD → AUD
 *
 * OIL is deliberately missing: there is no free browser-callable source for it
 * (Yahoo's endpoint blocks cross-origin requests). Add one provider entry below
 * and it appears — the ticker is data-driven.
 *
 * OFFLINE: every result is cached. With no signal the last known prices show
 * with the time they were fetched, rather than an error. Prices are never the
 * reason a page fails to load.
 * ==========================================================================*/

window.WA_MARKET = (function () {
  'use strict';

  var CACHE_KEY = 'weldAcademy.market';
  var MAX_AGE_MS = 30 * 60 * 1000;        // refetch at most every half hour
  var TIMEOUT_MS = 9000;

  var TROY_OZ_G = 31.1034768;
  var LB_KG = 0.45359237;

  /* What we show, in the order the ticker runs them. */
  var ITEMS = [
    { id: 'copper',    name: 'Copper',    icon: '🟠', symbol: 'HG',  unit: 'lb',  scrap: true,
      note: 'The scrapper\'s bread and butter. Clean bright wire pays best.' },
    { id: 'gold',      name: 'Gold',      icon: '🥇', symbol: 'XAU', unit: 'ozt',
      note: 'Spot is for pure bullion. Scrap jewellery pays by its carat fraction, minus the refiner\'s cut.' },
    { id: 'silver',    name: 'Silver',    icon: '🥈', symbol: 'XAG', unit: 'ozt',
      note: 'Sterling is 92.5% silver, so sterling scrap is worth about 0.925 of spot before margins.' },
    { id: 'platinum',  name: 'Platinum',  icon: '⚪', symbol: 'XPT', unit: 'ozt',
      note: 'Mostly met in catalytic converters — which are worth real money and are also heavily stolen. Sell them with paperwork.' },
    { id: 'palladium', name: 'Palladium', icon: '⚫', symbol: 'XPD', unit: 'ozt',
      note: 'Same story as platinum: cat converters, and a yard will want to know where it came from.' },
    { id: 'bitcoin',   name: 'Bitcoin',   icon: '₿',  coingecko: 'bitcoin', unit: 'coin',
      note: 'Not a scrap metal. In here because you asked, and because it moves more in a day than copper does in a year.' }
  ];

  var state = { prices: {}, fetchedAt: 0, usdAud: null, error: null, loading: false };
  var inflight = null;      // so a second caller waits on the first fetch

  /* ---------------------------------------------------------------- cache */

  function loadCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        var c = JSON.parse(raw);
        if (c && c.prices) state = { prices: c.prices, fetchedAt: c.fetchedAt || 0, usdAud: c.usdAud, error: null, loading: false };
      }
    } catch (e) { /* no cache, no problem */ }
    return state;
  }

  function saveCache() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        prices: state.prices, fetchedAt: state.fetchedAt, usdAud: state.usdAud
      }));
    } catch (e) { /* full or blocked — prices are disposable */ }
  }

  /* ---------------------------------------------------------------- fetch */

  function getJson(url) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIMEOUT_MS);
    return fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) {
        clearTimeout(timer);
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .catch(function (e) { clearTimeout(timer); throw e; });
  }

  function isFresh() {
    return state.fetchedAt && (Date.now() - state.fetchedAt) < MAX_AGE_MS;
  }

  /* refresh({force}) → Promise<state>. Never rejects. */
  function refresh(opts) {
    opts = opts || {};
    // Already fetching: hand back the same promise so callers that re-render
    // on resolve do it when the prices actually land, not before.
    if (inflight) return inflight;
    if (!opts.force && isFresh()) return Promise.resolve(state);

    state.loading = true;
    var prices = {};

    var jobs = [
      getJson('https://api.frankfurter.dev/v1/latest?base=USD&symbols=AUD')
        .then(function (d) { if (d && d.rates && d.rates.AUD) state.usdAud = d.rates.AUD; })
        .catch(function () { /* keep the last known rate */ }),

      getJson('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=aud&include_24hr_change=true')
        .then(function (d) {
          if (d && d.bitcoin && d.bitcoin.aud) {
            prices.bitcoin = { aud: d.bitcoin.aud, change: d.bitcoin.aud_24h_change };
          }
        })
        .catch(function () { /* fall back to cached */ })
    ];

    ITEMS.filter(function (i) { return i.symbol; }).forEach(function (item) {
      jobs.push(
        getJson('https://api.gold-api.com/price/' + item.symbol)
          .then(function (d) {
            if (d && typeof d.price === 'number') prices[item.id] = { usd: d.price };
          })
          .catch(function () { /* fall back to cached */ })
      );
    });

    inflight = Promise.all(jobs).then(function () {
      state.loading = false;
      inflight = null;
      var got = Object.keys(prices).length;
      if (got) {
        // Merge rather than replace, so one failed source doesn't blank the board.
        Object.keys(prices).forEach(function (k) { state.prices[k] = prices[k]; });
        state.fetchedAt = Date.now();
        state.error = null;
        saveCache();
      } else {
        state.error = state.fetchedAt
          ? 'No signal — showing the last prices I got.'
          : 'Could not reach the price feeds. They need internet; everything else in here does not.';
      }
      return state;
    });

    return inflight;
  }

  /* ------------------------------------------------------------ formatting */

  function aud(usd) {
    if (usd == null) return null;
    return state.usdAud ? usd * state.usdAud : null;
  }

  function money(v, dp) {
    if (v == null) return '—';
    dp = dp == null ? 2 : dp;
    return '$' + v.toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  }

  /* One row per item, already converted into the units people actually use. */
  function rows() {
    return ITEMS.map(function (item) {
      var p = state.prices[item.id];
      var row = { id: item.id, name: item.name, icon: item.icon, note: item.note, scrap: item.scrap,
                  primary: '—', secondary: '', change: null, have: false };

      if (!p) return row;
      row.have = true;

      if (item.unit === 'coin') {
        row.primary = money(p.aud, 0);
        row.secondary = 'per bitcoin';
        row.change = p.change;
        return row;
      }

      var perUnitAud = aud(p.usd);
      if (perUnitAud == null) {           // no FX yet — show USD honestly
        row.primary = 'US' + money(p.usd);
        row.secondary = item.unit === 'lb' ? 'per lb (USD)' : 'per troy oz (USD)';
        return row;
      }

      if (item.unit === 'lb') {
        row.primary = money(perUnitAud / LB_KG);
        row.secondary = 'per kg';
      } else {
        row.primary = money((perUnitAud / TROY_OZ_G) * 1000, 0);
        row.secondary = 'per kg · ' + money(perUnitAud / TROY_OZ_G) + '/g';
      }
      return row;
    });
  }

  function fetchedAgo() {
    if (!state.fetchedAt) return null;
    var mins = Math.round((Date.now() - state.fetchedAt) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + (hrs === 1 ? ' hour ago' : ' hours ago');
    var days = Math.round(hrs / 24);
    return days + (days === 1 ? ' day ago' : ' days ago');
  }

  return {
    load: loadCache,
    refresh: refresh,
    rows: rows,
    fetchedAgo: fetchedAgo,
    isFresh: isFresh,
    get state() { return state; },
    ITEMS: ITEMS
  };
})();

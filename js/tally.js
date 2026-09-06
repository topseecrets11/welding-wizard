/* ============================================================================
 * WELD ACADEMY — THE TALLY
 * ----------------------------------------------------------------------------
 * She owns scales, so the app keeps the ledger.
 *
 * Two entries in two taps: what metal, how many kilos. The pile is then valued
 * two ways at once, and that pairing is the entire point:
 *
 *   AT SPOT      what the metal is worth on the world market
 *   YARD PAYS    what someone will actually hand her, which is a good deal less
 *
 * Showing only the first would be lying by omission, and she would find out
 * the hard way at the weighbridge. Showing only the second teaches her nothing
 * about why. Showing both, side by side, every time, is how the gap between
 * them stops being a nasty surprise and starts being a number she can work.
 *
 * AND THEN THE REAL LESSON
 * A load is not what it paid. It is what it paid minus the fuel, minus the
 * hours, minus the run out to get it. Log the kilometres against a load and the
 * ledger shows what she actually MADE. Over a few loads that teaches revenue
 * versus profit better than any amount of prose, because it is her own money.
 * ==========================================================================*/

window.WA_TALLY = (function () {
  'use strict';

  /* What a yard typically pays as a fraction of spot. These are ranges, not
     promises, and the app says so wherever they are shown. They reflect the
     yard sorting, carting and on-selling the metal, and they move with the
     market and with how much you turn up with. */
  var YARD = {
    copper:    { low: 0.55, high: 0.75, label: 'Copper', icon: '🟠', grades: 'Bright and clean pays top; tinned or thin pays less.' },
    brass:     { low: 0.45, high: 0.60, label: 'Brass', icon: '🟡', spotOf: 'copper', spotFactor: 0.65,
                 grades: 'Priced off copper, roughly two-thirds. Keep it clean of steel fittings.' },
    aluminium: { low: 0.40, high: 0.65, label: 'Aluminium', icon: '⚪', flat: 1.60,
                 grades: 'Cast, extrusion and cans all grade differently. Keep them apart.' },
    lead:      { low: 0.45, high: 0.65, label: 'Lead', icon: '🔘', flat: 2.80,
                 grades: 'Wheel weights and battery lead grade lower than clean sheet.' },
    steel:     { low: 0.30, high: 0.60, label: 'Steel / iron', icon: '⬛', flat: 0.25,
                 grades: 'By the tonne, not the kilo. Clean heavy steel beats mixed light.' },
    stainless: { low: 0.35, high: 0.55, label: 'Stainless', icon: '✨', flat: 2.20,
                 grades: '304 pays, 430 barely does. A magnet tells them apart.' },
    silver:    { low: 0.75, high: 0.90, label: 'Silver', icon: '🥈',
                 grades: 'Sold by purity, not by the kilo of mixed material.' },
    gold:      { low: 0.80, high: 0.94, label: 'Gold', icon: '🥇',
                 grades: 'A refiner pays on assay. Scrap buyers pay less for the convenience.' }
  };

  function metals() {
    return Object.keys(YARD).map(function (k) {
      return { id: k, label: YARD[k].label, icon: YARD[k].icon, grades: YARD[k].grades };
    });
  }

  /* ---------------------------------------------------------------- state */

  function P() { return window.WA_PROGRESS; }

  function state() {
    var s = P().settings();
    if (!s.tally) s.tally = { pile: [], history: [], trips: [] };
    if (!s.tally.trips) s.tally.trips = [];
    return s.tally;
  }

  function save() { P().setSetting('tally', state()); }

  /* ------------------------------------------------------------- the pile */

  function add(metal, kg, note) {
    kg = parseFloat(kg);
    if (!YARD[metal] || !(kg > 0)) return null;
    var entry = { id: 't' + Date.now() + Math.random().toString(36).slice(2, 6),
                  metal: metal, kg: kg, note: note || '', ts: Date.now() };
    state().pile.push(entry);
    save();
    return entry;
  }

  function remove(id) {
    var t = state();
    t.pile = t.pile.filter(function (e) { return e.id !== id; });
    save();
  }

  function pile() { return state().pile.slice(); }

  /* Totals per metal, heaviest first. */
  function totals() {
    var by = {};
    state().pile.forEach(function (e) { by[e.metal] = (by[e.metal] || 0) + e.kg; });
    return Object.keys(by).map(function (m) {
      return { metal: m, label: YARD[m].label, icon: YARD[m].icon, kg: by[m] };
    }).sort(function (a, b) { return b.kg - a.kg; });
  }

  /* --------------------------------------------------------------- value */

  /* Spot for one kilo of a metal, or null when we genuinely do not know.
     Some of these have no live feed at all, and a stale fixed figure is
     flagged as an estimate rather than dressed up as a price. */
  function spotPerKg(metal) {
    var y = YARD[metal];
    if (!y) return null;
    var MK = window.WA_MARKET;

    if (y.spotOf && MK) {
      var base = MK.perKg(y.spotOf);
      return base == null ? null : { value: base * y.spotFactor, live: true };
    }
    if (MK) {
      var live = MK.perKg(metal);
      if (live != null) return { value: live, live: true };
    }
    // No feed for the common yard metals, so a rough standing figure — clearly
    // marked, because pretending otherwise is how she gets caught out.
    if (y.flat != null) return { value: y.flat, live: false };
    return null;
  }

  /* One line of the valuation: what it is worth, and what she will be handed. */
  function valueOf(metal, kg) {
    var s = spotPerKg(metal);
    var y = YARD[metal];
    if (!s || !y) return { metal: metal, kg: kg, known: false };
    return {
      metal: metal, kg: kg, known: true, live: s.live,
      spot: s.value * kg,
      yardLow: s.value * y.low * kg,
      yardHigh: s.value * y.high * kg,
      perKg: s.value
    };
  }

  function valuePile() {
    var lines = totals().map(function (t) {
      var v = valueOf(t.metal, t.kg);
      v.label = t.label; v.icon = t.icon;
      return v;
    });
    var sum = { spot: 0, yardLow: 0, yardHigh: 0, unknown: 0, anyEstimate: false };
    lines.forEach(function (l) {
      if (!l.known) { sum.unknown++; return; }
      if (!l.live) sum.anyEstimate = true;
      sum.spot += l.spot; sum.yardLow += l.yardLow; sum.yardHigh += l.yardHigh;
    });
    return { lines: lines, total: sum };
  }

  /* -------------------------------------------------- what it actually cost */

  /* A run out to pick something up is a cost against the load, whether or not
     it feels like one at the time. */
  function addTrip(km, litres, fuelPrice, note) {
    km = parseFloat(km) || 0;
    var cost;
    if (litres && fuelPrice) cost = parseFloat(litres) * parseFloat(fuelPrice);
    else cost = km * 0.22;            // rough running cost per km for a ute
    var trip = { id: 'k' + Date.now(), km: km, cost: cost, note: note || '', ts: Date.now() };
    state().trips.push(trip);
    save();
    return trip;
  }

  function trips() { return state().trips.slice(); }

  function tripCost() {
    return state().trips.reduce(function (n, t) { return n + t.cost; }, 0);
  }

  function removeTrip(id) {
    var t = state();
    t.trips = t.trips.filter(function (e) { return e.id !== id; });
    save();
  }

  /* ---------------------------------------------------------------- selling */

  /* Banking a load records what it was worth against what she was actually
     paid, and what it cost her to get there. Do that a few times and it is
     obvious which yards are straight and which runs are not worth making. */
  function sell(paid, note) {
    var t = state();
    if (!t.pile.length) return null;
    var v = valuePile();
    var costs = tripCost();
    var got = parseFloat(paid) || 0;
    var load = {
      id: 's' + Date.now(),
      ts: Date.now(),
      lines: v.lines.map(function (l) {
        return { metal: l.metal, kg: l.kg, spot: l.known ? l.spot : null };
      }),
      kg: v.lines.reduce(function (n, l) { return n + l.kg; }, 0),
      spot: v.total.spot,
      expectedLow: v.total.yardLow,
      expectedHigh: v.total.yardHigh,
      paid: got,
      costs: costs,
      profit: got - costs,
      note: note || ''
    };
    t.history.unshift(load);
    t.pile = [];
    t.trips = [];
    save();
    return load;
  }

  function history() { return state().history.slice(); }

  function clearPile() { var t = state(); t.pile = []; t.trips = []; save(); }

  /* Across everything she has sold: did the yards treat her right, and did the
     running around leave her ahead? */
  function lifetime() {
    var h = state().history;
    var out = { loads: h.length, kg: 0, paid: 0, costs: 0, profit: 0, spot: 0, ratio: null };
    h.forEach(function (l) {
      out.kg += l.kg; out.paid += l.paid; out.costs += l.costs || 0;
      out.profit += l.profit != null ? l.profit : l.paid;
      out.spot += l.spot || 0;
    });
    if (out.spot > 0) out.ratio = out.paid / out.spot;
    return out;
  }

  /* What Old Mate says when she asks out loud what she is sitting on. */
  function spoken() {
    var v = valuePile();
    if (!v.lines.length) return 'Your pile is empty. Nothing weighed in yet.';
    var bits = v.lines.map(function (l) {
      return Math.round(l.kg * 10) / 10 + ' kilos of ' + l.label.toLowerCase();
    });
    var list = bits.length > 1
      ? bits.slice(0, -1).join(', ') + ' and ' + bits[bits.length - 1]
      : bits[0];
    if (!v.total.spot) return 'You have got ' + list + '. No prices on this phone to value it with.';
    return 'You have got ' + list + '. About $' + Math.round(v.total.spot) +
      ' at spot, but expect somewhere between $' + Math.round(v.total.yardLow) +
      ' and $' + Math.round(v.total.yardHigh) + ' from a yard.';
  }

  return {
    metals: metals, YARD: YARD,
    add: add, remove: remove, pile: pile, totals: totals,
    spotPerKg: spotPerKg, valueOf: valueOf, valuePile: valuePile,
    addTrip: addTrip, trips: trips, tripCost: tripCost, removeTrip: removeTrip,
    sell: sell, history: history, clearPile: clearPile, lifetime: lifetime,
    spoken: spoken
  };
})();

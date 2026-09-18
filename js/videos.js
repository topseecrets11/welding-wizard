/* ============================================================================
 * WELD ACADEMY — VIDEO REFERENCES
 * ----------------------------------------------------------------------------
 * A small map from topic id to a short reference clip, keyed by the exact
 * same ids already used everywhere else in the app (defect ids today; lesson
 * ids can join the same map later with no new wiring). Every entry starts
 * empty — dropping in a real youtubeId and adjusting the timestamps is a
 * CONTENT change, not a code change, same as the hidden note and the unicorn
 * art elsewhere in this app: the code's job is just building the place for
 * it to live.
 *
 * WHY THIS STAYS OPTIONAL, ALWAYS
 *   The whole app promises to work with no signal — "the shed has no
 *   reception." Video can never keep that promise, so it never gets to be
 *   required. The SVG fault comparison (js/defect-art.js) is the one thing
 *   every defect must have, and stays the default, always-available view.
 *   A video chip only appears once a real clip exists for that id, and
 *   nothing about it — not even a thumbnail — is fetched until she taps it.
 *
 * THE SCRIPTS THESE MATCH
 *   Written already, one per defect id below, in Old Mate's voice, built
 *   from this same app's own causes/fixes so nothing said on camera can
 *   contradict what's on screen. Filming them is what turns an empty
 *   youtubeId into a real one — nothing here needs to change to accept that.
 * ==========================================================================*/

window.WA_VIDEOS = (function () {
  'use strict';

  /* youtubeId: '' means "not filmed yet" — has() is false, nothing renders,
     nothing breaks. start/end are seconds into the clip; end is optional. */
  var CLIPS = {
    'porosity':              { youtubeId: '', start: 0, end: 40, label: 'Porosity' },
    'undercut':               { youtubeId: '', start: 0, end: 38, label: 'Undercut' },
    'overlap':                { youtubeId: '', start: 0, end: 38, label: 'Overlap (cold lap)' },
    'lack-of-fusion':         { youtubeId: '', start: 0, end: 40, label: 'Lack of fusion' },
    'lack-of-penetration':    { youtubeId: '', start: 0, end: 38, label: 'Lack of penetration' },
    'burn-through':           { youtubeId: '', start: 0, end: 36, label: 'Burn-through' },
    'hot-crack':              { youtubeId: '', start: 0, end: 38, label: 'Hot cracking' },
    'cold-crack':             { youtubeId: '', start: 0, end: 38, label: 'Cold cracking' },
    'distortion':             { youtubeId: '', start: 0, end: 38, label: 'Distortion / warping' },
    'slag':                   { youtubeId: '', start: 0, end: 36, label: 'Slag inclusion' },
    'tungsten-contamination': { youtubeId: '', start: 0, end: 36, label: 'Tungsten contamination' },
    'spatter':                { youtubeId: '', start: 0, end: 36, label: 'Excessive spatter' },
    'technique':              { youtubeId: '', start: 0, end: 38, label: 'Inconsistent technique' }
  };

  function has(id) {
    var c = CLIPS[id];
    return !!(c && c.youtubeId);
  }

  function get(id) {
    return CLIPS[id] || null;
  }

  function ids() {
    return Object.keys(CLIPS);
  }

  /* The reliable fallback — opens YouTube properly rather than embedding,
     for whenever the embed itself is blocked or she'd rather watch full
     screen. */
  function watchUrl(id) {
    var c = get(id);
    if (!c || !c.youtubeId) return '';
    // A truthy check would silently drop a clip that genuinely starts at
    // 0:00 — start is a valid timestamp even when it's zero.
    return 'https://www.youtube.com/watch?v=' + encodeURIComponent(c.youtubeId) +
      (typeof c.start === 'number' ? '&t=' + Math.round(c.start) + 's' : '');
  }

  /* youtube-nocookie keeps a reference clip out of her YouTube history and
     recommendations — she didn't choose to watch a video, Old Mate showed
     her one. */
  function embedUrl(id) {
    var c = get(id);
    if (!c || !c.youtubeId) return '';
    var params = ['rel=0', 'modestbranding=1', 'playsinline=1'];
    if (typeof c.start === 'number') params.push('start=' + Math.round(c.start));
    if (typeof c.end === 'number') params.push('end=' + Math.round(c.end));
    return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(c.youtubeId) +
      '?' + params.join('&');
  }

  return {
    has: has, get: get, ids: ids,
    watchUrl: watchUrl, embedUrl: embedUrl,
    CLIPS: CLIPS
  };
})();

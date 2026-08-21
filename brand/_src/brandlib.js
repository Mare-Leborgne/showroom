const ot = require('opentype.js');
const fs = require('fs');
const path = require('path');

const C = {
  navyDeep: '#0B1424', navy: '#14213D',
  ivory: '#F3ECDD', ivory2: '#EAE1CE',
  brass: '#B8935A', brassInk: '#7E5E33', brassLit: '#F0DCA8',
  bordeaux: '#6E1F2E', ink: '#211E1A',
};

const font = ot.parse(fs.readFileSync(path.join(__dirname, 'PinyonScript-Regular.ttf')).buffer);

// "Mare Leborgne" as outlines. Converting to paths is the whole point: an SVG
// that referenced the font by name would fall back to a system cursive on any
// machine without Pinyon Script installed, which is every machine.
function wordmarkPath(text = 'Mare Leborgne', size = 1000) {
  const p = font.getPath(text, 0, 0, size);
  const bb = p.getBoundingBox();
  return { d: p.toPathData(3), bb };
}

function wordmarkSVG({ fill = C.brass, gradient = false, text = 'Mare Leborgne' } = {}) {
  const { d, bb } = wordmarkPath(text);
  const pad = 14;                                  // a little air so nothing is clipped
  const x = bb.x1 - pad, y = bb.y1 - pad;
  const w = (bb.x2 - bb.x1) + pad * 2, h = (bb.y2 - bb.y1) + pad * 2;
  const paint = gradient ? 'url(#brassSheen)' : fill;
  const defs = gradient ? `
  <defs>
    <linearGradient id="brassSheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#987644"/>
      <stop offset="32%"  stop-color="${C.brass}"/>
      <stop offset="50%"  stop-color="${C.brassLit}"/>
      <stop offset="68%"  stop-color="${C.brass}"/>
      <stop offset="100%" stop-color="#987644"/>
    </linearGradient>
  </defs>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(x)} ${r(y)} ${r(w)} ${r(h)}" role="img" aria-label="Mare Leborgne">
  <title>Mare Leborgne</title>${defs}
  <path fill="${paint}" d="${d}"/>
</svg>
`;
}

// the mark: the hero's own two contour lines. Second wave at .75 rather than
// the .55 it was drawn at — below about 20px the ghost line disappeared
// entirely and the mark read as a single wave with a smudge under it.
function markPaths(stroke, op2 = 0.75) {
  return `  <g fill="none" stroke="${stroke}" stroke-linecap="round">
    <path d="M4 12.5c4-4.5 8-4.5 12 0s8 4.5 12 0" stroke-width="2.6"/>
    <path d="M4 21c4-4.5 8-4.5 12 0s8 4.5 12 0" stroke-width="1.8" stroke-opacity="${op2}"/>
  </g>`;
}

function markSVG({ stroke = C.brass, bg = null, inset = 1, op2 = 0.75 } = {}) {
  const body = inset === 1 ? markPaths(stroke, op2)
    : `  <g transform="translate(16,16) scale(${inset}) translate(-16,-16)">\n${markPaths(stroke, op2)}\n  </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Mare Leborgne">
  <title>Mare Leborgne</title>
${bg ? `  <rect width="32" height="32" fill="${bg}"/>\n` : ''}${body}
</svg>
`;
}

function r(n) { return Math.round(n * 100) / 100; }

module.exports = { C, font, wordmarkPath, wordmarkSVG, markSVG, markPaths, r };

/* ── lockups ──────────────────────────────────────────────────────────
   The mark and the wordmark set together, at fixed proportions so nobody
   has to re-invent the spacing each time one is needed. The mark's visible
   ink spans x 4..28 and roughly y 10..23 inside its 32-unit box, so the
   maths works off that rather than off the box.                        */
const MARK_INK = { x: 4, w: 24, y: 9.6, h: 13.4 };

function lockupStacked({ stroke = C.brass, fill = C.brass } = {}) {
  const { d, bb } = wordmarkPath();
  const W = bb.x2 - bb.x1;
  const s = (W * 0.26) / MARK_INK.w;              // mark reads at ~26% of the wordmark
  const gap = W * 0.055;
  const markInkW = MARK_INK.w * s, markInkH = MARK_INK.h * s;
  const markX = bb.x1 + (W - markInkW) / 2 - MARK_INK.x * s;
  const markY = bb.y1 - gap - markInkH - MARK_INK.y * s;
  const pad = W * 0.03;
  const x = bb.x1 - pad, y = markY + MARK_INK.y * s - pad;
  const w = W + pad * 2, h = (bb.y2 + pad) - y;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(x)} ${r(y)} ${r(w)} ${r(h)}" role="img" aria-label="Mare Leborgne">
  <title>Mare Leborgne</title>
  <g transform="translate(${r(markX)},${r(markY)}) scale(${r(s)})">
${markPaths(stroke)}
  </g>
  <path fill="${fill}" d="${d}"/>
</svg>
`;
}

function lockupHorizontal({ stroke = C.brass, fill = C.brass } = {}) {
  const { d, bb } = wordmarkPath();
  const W = bb.x2 - bb.x1, H = bb.y2 - bb.y1;
  // 0.68 rather than matching the wordmark's full height: the script's
  // ascenders and descenders make that box taller than the letters read, and a
  // mark sized to the box optically outweighs the name it sits beside
  const s = (H * 0.68) / MARK_INK.h;
  const gap = W * 0.045;
  const markInkW = MARK_INK.w * s, markInkH = MARK_INK.h * s;
  const markX = bb.x1 - gap - markInkW - MARK_INK.x * s;
  const markY = bb.y1 + (H - markInkH) / 2 - MARK_INK.y * s;
  const pad = W * 0.03;
  const x = markX + MARK_INK.x * s - pad, y = bb.y1 - pad;
  const w = (bb.x2 + pad) - x, h = H + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(x)} ${r(y)} ${r(w)} ${r(h)}" role="img" aria-label="Mare Leborgne">
  <title>Mare Leborgne</title>
  <g transform="translate(${r(markX)},${r(markY)}) scale(${r(s)})">
${markPaths(stroke)}
  </g>
  <path fill="${fill}" d="${d}"/>
</svg>
`;
}

module.exports.lockupStacked = lockupStacked;
module.exports.lockupHorizontal = lockupHorizontal;

/* ── the wave lockup ──────────────────────────────────────────────────
   The signature sitting on water. This is the primary logo.

   Why this and not the mark set beside the name: the studio is called mare.
   The hero already floats the wordmark on a moving sea, and a signature
   conventionally sits on a ruled line — so one wave does both jobs at once,
   waterline and signature rule, and the two elements stop reading as two
   objects stacked together.

   Settled by drawing the alternatives rather than by argument:
     · Three periods ripples, and turns to mush below about 150px.
     · One period is a long lazy swell that needs too much vertical room.
     · Running the water through the descenders looked well at full size and
       read as a strikethrough small, so the waterline clears them.
   Two periods, two lines, clear of the descenders. Two lines because that is
   already the mark — the logo and the icon stay one language.               */
function waveLine(x0, y0, width, periods, amp) {
  const half = width / (periods * 2);
  let d = `M${r(x0)} ${r(y0)}`;
  for (let i = 0; i < periods * 2; i++) {
    const up = i % 2 === 0 ? -1 : 1;
    d += ` c ${r(half / 3)} ${r(amp * up)}, ${r(half / 3 * 2)} ${r(amp * up)}, ${r(half)} 0`;
  }
  return d;
}

function lockupWave({ fill = C.brass, stroke = C.brass, bg = null,
                      periods = 2, drop = 0.22, over = 0.06, sw = 26 } = {}) {
  const { d, bb } = wordmarkPath();
  const W = bb.x2 - bb.x1, H = bb.y2 - bb.y1;
  const waveW = W * (1 + over * 2);
  const x0 = bb.x1 - W * over;
  const amp = (waveW / (periods * 2)) * 0.22;
  const yBase = bb.y2 + H * drop;
  const gapLine = H * 0.16;

  const lines = [0, 1].map(i => {
    const y = yBase + i * gapLine;
    /* .62, between the mark's .75 and the hero sea's .55: this wave is long and
       thin, so it holds at a lower value than the icon does, but .55 started to
       disappear once the logo was set small. */
    return `<path d="${waveLine(x0, y, waveW, periods, amp * (i === 0 ? 1 : 0.82))}" stroke-width="${r(sw * (i === 0 ? 1 : 0.72))}" stroke-opacity="${i === 0 ? 1 : 0.62}"/>`;
  });

  const pad = bg ? H * 0.55 : W * 0.035;      // clear space, generous on a panel
  const top = bb.y1 - pad;
  const bottom = yBase + gapLine + amp + sw + pad;
  const vx = x0 - pad, vw = waveW + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(vx)} ${r(top)} ${r(vw)} ${r(bottom - top)}" role="img" aria-label="Mare Leborgne">
  <title>Mare Leborgne</title>
${bg ? `  <rect x="${r(vx)}" y="${r(top)}" width="${r(vw)}" height="${r(bottom - top)}" fill="${bg}"/>\n` : ''}  <g fill="none" stroke="${stroke}" stroke-linecap="round">
    ${lines.join('\n    ')}
  </g>
  <path fill="${fill}" d="${d}"/>
</svg>
`;
}

/* the wordmark on a ground of its own, for the times a transparent PNG will be
   dropped onto the wrong colour by somebody who is not thinking about it */
function wordmarkPanel({ fill = C.brass, bg = C.navyDeep } = {}) {
  const { d, bb } = wordmarkPath();
  const H = bb.y2 - bb.y1, pad = H * 0.55;
  const x = bb.x1 - pad, y = bb.y1 - pad;
  const w = (bb.x2 - bb.x1) + pad * 2, h = H + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(x)} ${r(y)} ${r(w)} ${r(h)}" role="img" aria-label="Mare Leborgne">
  <title>Mare Leborgne</title>
  <rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${bg}"/>
  <path fill="${fill}" d="${d}"/>
</svg>
`;
}

module.exports.lockupWave = lockupWave;
module.exports.wordmarkPanel = wordmarkPanel;
module.exports.waveLine = waveLine;

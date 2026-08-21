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

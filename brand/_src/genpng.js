const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..') + '/';     // the brand folder

// every PNG comes from the SVG that is already the source of truth, so the two
// can never drift apart
const JOBS = [
  ['logo/wordmark-brass.svg',            [800, 1600, 3200]],
  ['logo/wordmark-ivory.svg',            [800, 1600]],
  ['logo/wordmark-navy.svg',             [800, 1600]],
  ['logo/wordmark-gradient.svg',         [1600]],
  ['mark/mark-brass.svg',                [512]],
  ['mark/mark-ivory.svg',                [512]],
  ['mark/mark-navy.svg',                 [512]],
  ['mark/mark-tile-navy.svg',            [512, 1024]],
  ['mark/mark-tile-ivory.svg',           [512]],
  ['lockup/lockup-wave-brass.svg',        [800, 1600, 3200]],
  ['lockup/lockup-wave-ivory.svg',        [800, 1600]],
  ['lockup/lockup-wave-navy.svg',         [800, 1600]],
  ['lockup/lockup-wave-brass-on-navy.svg',[800, 1600, 3200]],
  ['lockup/lockup-wave-navy-on-ivory.svg',[1600]],
  ['logo/wordmark-brass-on-navy.svg',     [800, 1600]],
  ['logo/wordmark-ivory-on-navy.svg',     [1600]],
  ['logo/wordmark-navy-on-ivory.svg',     [1600]],
  ['lockup/lockup-stacked-brass.svg',    [1600]],
  ['lockup/lockup-stacked-ivory.svg',    [1600]],
  ['lockup/lockup-stacked-navy.svg',     [1600]],
  ['lockup/lockup-horizontal-brass.svg', [1600]],
  ['lockup/lockup-horizontal-ivory.svg', [1600]],
  ['lockup/lockup-horizontal-navy.svg',  [1600]],
];

(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  let total = 0;
  for (const [rel, widths] of JOBS) {
    const svg = fs.readFileSync(R + rel, 'utf8');
    const vb = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/).slice(1).map(Number);
    const aspect = vb[3] / vb[2];
    for (const W of widths) {
      const H = Math.round(W * aspect);
      const p = await b.newPage();
      await p.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
      await p.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${W}px;height:${H}px}</style>` + svg);
      const out = R + rel.replace(/\.svg$/, '') + '-' + W + '.png';
      // omitBackground keeps the alpha channel: these drop onto any colour
      await p.screenshot({ path: out, omitBackground: true });
      const sz = fs.statSync(out).size; total += sz;
      console.log('  ' + path.basename(out).padEnd(38) + W + 'x' + H + '  ' + (sz/1024).toFixed(1) + 'KB');
      await p.close();
    }
  }
  console.log('  --- ' + (total/1024).toFixed(0) + 'KB of PNG');
  await b.close();
})();

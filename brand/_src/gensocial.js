const puppeteer = require('puppeteer-core');
const fs = require('fs'), path = require('path');
const B = require('./brandlib.js');
const ROOT = require('path').resolve(__dirname, '../..') + '/';   // the repo root

// Cormorant Garamond and Jost, read from the site's own font files and handed
// to Chrome as data: URIs. The wordmark is outlines, so only these two are
// needed and neither has to be installed on the machine doing the rebuild.
const FACES = (() => {
  const css = fs.readFileSync(path.join(__dirname, 'fonts.css'), 'utf8');
  return css.replace(/url\(([^)]+)\)/g, (m, u) => {
    const name = u.split('/').pop();
    const file = path.resolve(__dirname, '../../fonts', name);
    if (!fs.existsSync(file)) return m;
    return 'url(data:font/woff2;base64,' + fs.readFileSync(file).toString('base64') + ')';
  });
})();

const NAVY_BG = 'radial-gradient(125% 95% at 50% 12%, #1c2b46 0%, #14213D 44%, #0B1424 100%)';

// the wordmark as outlines, so nothing here depends on a webfont arriving in
// time — which is what --virtual-time-budget was guarding against before
const wordmark = (paint) => B.wordmarkSVG({ fill: paint }).replace(/\n/g, '');
const gradWordmark = B.wordmarkSVG({ gradient: true }).replace(/\n/g, '');

const sea = (w, h, base) => `<svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
  <g fill="none" stroke="#B8935A" stroke-width="1">
    ${[0.62, 0.685, 0.762, 0.851, 0.952].map((f, i) => {
      const y = Math.round(h * f), a = [0.08, 0.11, 0.14, 0.17, 0.20][i], amp = 10 + i * 6;
      return `<path d="M0 ${y} C ${w*0.18} ${y-amp}, ${w*0.37} ${y+amp}, ${w*0.55} ${y} S ${w*0.85} ${y-amp}, ${w} ${y}" stroke-opacity="${a}"/>`;
    }).join('\n    ')}
  </g></svg>`;

const JOST = `font-family:'Jost','Futura','Century Gothic',sans-serif`;
const CORM = `font-family:'Cormorant Garamond',Georgia,serif`;

const PAGES = {
  // square profile picture. Everything sits inside the inscribed circle, since
  // LinkedIn, X and Instagram all crop a square avatar to a round one.
  'brand/social/avatar-1024.png': { w: 1024, h: 1024, html: `
    <div style="width:1024px;height:1024px;background:${NAVY_BG};position:relative;display:flex;align-items:center;justify-content:center">
      ${sea(1024, 1024)}
      <div style="position:relative;width:520px">${B.markSVG({ stroke: B.C.brass }).replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
    </div>` },

  'brand/social/avatar-ivory-1024.png': { w: 1024, h: 1024, html: `
    <div style="width:1024px;height:1024px;background:#F3ECDD;position:relative;display:flex;align-items:center;justify-content:center">
      <div style="position:relative;width:520px">${B.markSVG({ stroke: B.C.brassInk }).replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
    </div>` },

  // LinkedIn cover. The profile photo lands over the lower left on desktop and
  // the sides are cropped on a phone, so the type stays centred and high.
  'brand/social/linkedin-banner-1584x396.png': { w: 1584, h: 396, html: `
    <div style="width:1584px;height:396px;background:${NAVY_BG};position:relative;overflow:hidden">
      ${sea(1584, 396)}
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:26px">
        <div style="width:560px">${gradWordmark.replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
        <div style="${CORM};font-style:italic;font-weight:300;font-size:26px;letter-spacing:.02em;color:#E4DAC2;margin-top:16px">Sites, sur mesure.</div>
      </div>
      <div style="position:absolute;right:38px;bottom:24px;${JOST};font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:rgba(243,236,221,.45)">mareleborgne.com</div>
    </div>` },

  // a square share card, for the platforms that crop 1200x630 to a box
  'brand/social/share-square-1200.png': { w: 1200, h: 1200, html: `
    <div style="width:1200px;height:1200px;background:${NAVY_BG};position:relative;overflow:hidden">
      ${sea(1200, 1200)}
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="${JOST};font-size:15px;letter-spacing:.4em;text-transform:uppercase;color:#B8935A;margin-bottom:34px">Sydney</div>
        <div style="width:880px">${gradWordmark.replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
        <div style="width:80px;height:1px;background:rgba(184,147,90,.75);margin:34px 0"></div>
        <div style="${CORM};font-style:italic;font-weight:300;font-size:38px;color:#E4DAC2">Sites, sur mesure.</div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:52px;text-align:center;${JOST};font-size:14px;letter-spacing:.24em;text-transform:uppercase;color:rgba(243,236,221,.45)">mareleborgne.com</div>
    </div>` },

  // the site's own share card, rebuilt from outlines
  'og.png': { w: 1200, h: 630, html: `
    <div style="width:1200px;height:630px;background:${NAVY_BG};position:relative;overflow:hidden">
      ${sea(1200, 630)}
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="${JOST};font-size:13px;letter-spacing:.4em;text-transform:uppercase;color:#B8935A;margin-bottom:26px">Sydney</div>
        <div style="width:760px">${gradWordmark.replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
        <div style="width:70px;height:1px;background:rgba(184,147,90,.75);margin:26px 0"></div>
        <div style="${CORM};font-style:italic;font-weight:300;font-size:30px;color:#E4DAC2">Sites, sur mesure.</div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:34px;text-align:center;${JOST};font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:rgba(243,236,221,.45)">mareleborgne.com</div>
    </div>` },
};

(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  for (const [out, { w, h, html }] of Object.entries(PAGES)) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    // the two supporting faces are real webfonts; the wordmark is outlines
    // the two supporting faces come off disk, so nothing here needs a server
    await p.setContent(`<style>${FACES}
      *{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}</style>${html}`,
      { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 300));
    await p.screenshot({ path: ROOT + out });
    console.log('  ' + out.padEnd(46) + w + 'x' + h + '  ' + (fs.statSync(ROOT + out).size / 1024).toFixed(1) + 'KB');
    await p.close();
  }
  await b.close();
})();

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const B = require('./brandlib.js');
const ROOT = require('path').resolve(__dirname, '../..') + '/';   // the repo root
const SITE = 'https://mareleborgne.com';

const DISPLAY_W = 176;
const svg = B.wordmarkSVG({ fill: B.C.brassInk });
const vb = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/).slice(1).map(Number);
const aspect = vb[2] / vb[3];
const DISPLAY_H = Math.round(DISPLAY_W / aspect);

(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  // rendered at 3x so it stays crisp on a retina screen and when a client
  // scales it up; displayed at 176 by explicit width/height
  for (const [file, colour, mult] of [['wordmark-signature.png', B.C.brassInk, 3], ['wordmark-signature-dark.png', B.C.brass, 3]]) {
    const W = DISPLAY_W * mult, H = Math.round(W / aspect);
    const p = await b.newPage();
    await p.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await p.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${W}px;height:${H}px}</style>` + B.wordmarkSVG({ fill: colour }));
    await p.screenshot({ path: ROOT + 'brand/email/' + file, omitBackground: true });
    console.log('  brand/email/' + file.padEnd(32) + W + 'x' + H + '  ' + (fs.statSync(ROOT + 'brand/email/' + file).size / 1024).toFixed(1) + 'KB');
    await p.close();
  }
  await b.close();

  /* ── the signature itself ───────────────────────────────────────────
     Rules Gmail imposes, all of which shape what this can be:
       · <style> blocks are stripped. Every declaration is inline.
       · webfonts do not load. The script is a PNG; everything else is
         Georgia, which ships on every machine that matters and is the
         closest common face to the site's EB Garamond.
       · images must live at a public URL, so they are served from the site.
       · images are often blocked, so the alt text carries the name and the
         role line repeats "Mare Leborgne" in real text underneath.
     Tables rather than divs: Outlook still lays out with Word.            */
  const sig = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Georgia,'Times New Roman',serif;color:#211E1A"><tbody>
<tr><td style="padding:0 0 10px">
<a href="${SITE}/" style="text-decoration:none;border:0"><img src="${SITE}/brand/email/wordmark-signature.png" alt="Mare Leborgne" width="${DISPLAY_W}" height="${DISPLAY_H}" style="display:block;width:${DISPLAY_W}px;height:${DISPLAY_H}px;border:0;outline:none;text-decoration:none"></a>
</td></tr>
<tr><td style="padding:0 0 2px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.4;color:#14213D">Augusto Leborgne</td></tr>
<tr><td style="padding:0 0 10px;font-family:Helvetica,Arial,sans-serif;font-size:10px;line-height:1.6;letter-spacing:1.6px;text-transform:uppercase;color:#6b6255">Founder &nbsp;&middot;&nbsp; Mare Leborgne</td></tr>
<tr><td style="padding:0 0 10px"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tbody><tr><td style="width:${DISPLAY_W}px;height:1px;background-color:#B8935A;font-size:0;line-height:0">&nbsp;</td></tr></tbody></table></td></tr>
<tr><td style="padding:0 0 1px;font-family:Georgia,'Times New Roman',serif;font-size:13px;line-height:1.65"><a href="mailto:hello@mareleborgne.com" style="color:#7E5E33;text-decoration:none">hello@mareleborgne.com</a></td></tr>
<tr><td style="padding:0 0 1px;font-family:Georgia,'Times New Roman',serif;font-size:13px;line-height:1.65"><a href="${SITE}/" style="color:#7E5E33;text-decoration:none">mareleborgne.com</a></td></tr>
<tr><td style="padding:4px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:10px;line-height:1.6;letter-spacing:1.4px;text-transform:uppercase;color:#6b6255">Sydney, Australia</td></tr>
</tbody></table>`;

  fs.writeFileSync(ROOT + 'brand/email/signature.html', sig + '\n');
  console.log('  brand/email/signature.html      ' + sig.length + ' characters (Gmail allows 10,000)');

  const txt = `Augusto Leborgne
Founder · Mare Leborgne

hello@mareleborgne.com
mareleborgne.com
Sydney, Australia
`;
  fs.writeFileSync(ROOT + 'brand/email/signature.txt', txt);
  console.log('  brand/email/signature.txt       plain-text fallback');
  console.log('  wordmark displays at ' + DISPLAY_W + 'x' + DISPLAY_H);
})();

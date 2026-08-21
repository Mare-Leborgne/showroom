/* Builds brand/index.html — a contact sheet of everything in the folder, from
   the folder itself, so it cannot list a file that is no longer there. */
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..');
const kb = f => (fs.statSync(path.join(R, f)).size / 1024).toFixed(0) + ' KB';

const DARK = '#0B1424', LIGHT = '#F3ECDD';
const groups = [
  ['The logo', 'The signature sitting on water. The studio is called <em>mare</em>, the hero already floats the name on a moving sea, and a signature conventionally sits on a ruled line — so one wave is waterline and signature rule at once. Two lines, because that is already the mark.', [
    ['lockup/lockup-wave-brass-on-navy.svg', '#8d8d8d'], ['lockup/lockup-wave-brass.svg', DARK],
    ['lockup/lockup-wave-ivory.svg', DARK], ['lockup/lockup-wave-navy-on-ivory.svg', '#8d8d8d'],
    ['lockup/lockup-wave-navy.svg', LIGHT]]],
  ['On a ground of its own', 'For the times a transparent PNG would be dropped onto the wrong colour by somebody not thinking about it. Brass on navy is the site’s own pairing.', [
    ['logo/wordmark-brass-on-navy.svg', '#8d8d8d'], ['logo/wordmark-ivory-on-navy.svg', '#8d8d8d'],
    ['logo/wordmark-navy-on-ivory.svg', '#8d8d8d']]],
  ['The wordmark', 'On its own, transparent. Letters converted to outlines, so it renders the same on a machine that has never heard of Pinyon Script.', [
    ['logo/wordmark-brass.svg', DARK], ['logo/wordmark-ivory.svg', DARK],
    ['logo/wordmark-navy.svg', LIGHT], ['logo/wordmark-gradient.svg', DARK]]],
  ['The mark', 'The hero\u2019s two contour lines. Stands in for the name where there is no room for it.', [
    ['mark/mark-brass.svg', DARK], ['mark/mark-ivory.svg', DARK],
    ['mark/mark-navy.svg', LIGHT], ['mark/mark-tile-navy.svg', LIGHT], ['mark/mark-tile-ivory.svg', DARK]]],
  ['Other lockups', 'The mark set beside the name rather than under it, at fixed proportions so the spacing is not re-invented each time.', [
    ['lockup/lockup-stacked-brass.svg', DARK], ['lockup/lockup-stacked-ivory.svg', DARK],
    ['lockup/lockup-stacked-navy.svg', LIGHT],
    ['lockup/lockup-horizontal-brass.svg', DARK], ['lockup/lockup-horizontal-ivory.svg', DARK],
    ['lockup/lockup-horizontal-navy.svg', LIGHT]]],
];

const PALETTE = [['Navy deep','#0B1424'],['Navy','#14213D'],['Ivory','#F3ECDD'],['Ivory 2','#EAE1CE'],
  ['Brass','#B8935A'],['Brass ink','#7E5E33'],['Brass lit','#F0DCA8'],['Bordeaux','#6E1F2E'],['Ink','#211E1A']];

const RASTER = ['social/avatar-1024.png','social/avatar-ivory-1024.png',
  'social/linkedin-banner-1584x396.png','social/share-square-1200.png'];

function tile(file, bg) {
  // referenced, not inlined: each of these carries ~21KB of outlined path data,
  // and inlining twenty of them made a 389KB page out of a contact sheet
  const svg = `<img src="${file}" alt="" style="width:100%;height:auto;display:block">`;
  const isMark = /mark\//.test(file);
  return `<figure style="margin:0">
    <div style="background:${bg};border:1px solid rgba(20,33,61,.12);padding:${isMark ? '26px 34%' : '26px 22px'};display:flex;align-items:center;justify-content:center;min-height:132px">${svg}</div>
    <figcaption style="font:400 11px/1.7 'Jost',Helvetica,Arial,sans-serif;letter-spacing:.06em;color:#5f584b;padding-top:8px">
      <a href="${file}" style="color:#7E5E33;text-decoration:none">${file.split('/').pop()}</a> · ${kb(file)}
    </figcaption></figure>`;
}

const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Brand assets · Mare Leborgne</title>
<meta name="robots" content="noindex, nofollow">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-src 'none'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; form-action 'none'; upgrade-insecure-requests">
<meta name="referrer" content="strict-origin-when-cross-origin">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#EAE1CE;color:#211E1A;font:16px/1.7 Georgia,'Times New Roman',serif;padding:56px 28px 110px}
  .wrap{max-width:1060px;margin:0 auto}
  h1{font-weight:400;font-size:34px;margin-bottom:6px}
  .sub{color:#5f584b;font-style:italic;margin-bottom:12px}
  .sub a{color:#7E5E33}
  h2{font:400 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#7E5E33;margin:52px 0 6px}
  .note{color:#5f584b;font-size:14px;font-style:italic;margin-bottom:20px}
  .grid{display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
  .sw{height:76px;border:1px solid rgba(20,33,61,.12)}
  code{font:12px ui-monospace,Menlo,Consolas,monospace;background:rgba(20,33,61,.07);padding:1px 5px}
</style>
</head>
<body>
<div class="wrap">
  <h1>Brand assets</h1>
  <p class="sub">Every mark, and the sources to rebuild them. Usage, colour rules and the email signature are in <a href="README.md">README.md</a>.</p>

${groups.map(([t, note, files]) => `  <h2>${t}</h2>
  <p class="note">${note}</p>
  <div class="grid">
${files.map(([f, bg]) => '    ' + tile(f, bg)).join('\n')}
  </div>`).join('\n\n')}

  <h2>Social</h2>
  <p class="note">Avatars are square and everything sits inside the inscribed circle, because every platform crops them round.</p>
  <div class="grid">
${RASTER.map(f => `    <figure style="margin:0">
      <img src="${f}" alt="" style="width:100%;height:auto;display:block;border:1px solid rgba(20,33,61,.12)">
      <figcaption style="font:400 11px/1.7 'Jost',Helvetica,Arial,sans-serif;letter-spacing:.06em;color:#5f584b;padding-top:8px">
        <a href="${f}" style="color:#7E5E33;text-decoration:none">${f.split('/').pop()}</a> · ${kb(f)}</figcaption></figure>`).join('\n')}
  </div>

  <h2>The email signature</h2>
  <p class="note">Gmail loads no webfonts and strips stylesheets, so the script is an image and every rule is inline. <a href="email/install.html" style="color:#7E5E33">Open the installer &rarr;</a></p>

  <h2>Colours</h2>
  <p class="note">Brass and brass ink are not interchangeable. Brass is 2.4:1 on ivory — a rule or a fill, never words.</p>
  <div class="grid">
${PALETTE.map(([n, h]) => `    <div><div class="sw" style="background:${h}"></div>
      <div style="font:400 11px/1.7 'Jost',Helvetica,Arial,sans-serif;letter-spacing:.06em;color:#5f584b;padding-top:8px">${n} · <code>${h}</code></div></div>`).join('\n')}
  </div>

  <h2>Rebuilding</h2>
  <p class="note">The font makes the SVGs, the SVGs make the PNGs. Nothing is drawn twice, so the set cannot drift.</p>
  <p><code>cd brand/_src &amp;&amp; npm install opentype.js puppeteer-core &amp;&amp; node rebuild-brand.js</code></p>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(R, 'index.html'), html);
console.log('  brand/index.html  ' + (html.length / 1024).toFixed(1) + 'KB');

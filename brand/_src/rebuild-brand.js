/* Rebuilds every brand asset, in order, from the two things that are actually
   the source: PinyonScript-Regular.ttf and the mark's own path data.
     font  ->  outlined SVG  ->  PNG / ICO / social / signature
   Nothing is drawn twice, so the set cannot drift out of step with itself.

     npm install opentype.js puppeteer-core
     node rebuild-brand.js

   Chrome must be installed; set CHROME_PATH if it is somewhere unusual.
   Run it from this directory. Not used by the website at runtime. */
const { execFileSync } = require('child_process');
const path = require('path');

for (const m of ['opentype.js', 'puppeteer-core']) {
  try { require.resolve(m); }
  catch (e) {
    console.error('\n  ' + m + ' is not installed here.\n  Run:  npm install opentype.js puppeteer-core\n');
    process.exit(1);
  }
}

const STEPS = [
  ['gensvg.js',    'wordmark, mark and lockup SVGs, from the font outlines'],
  ['genpng.js',    'PNG renders of every SVG above'],
  ['genico.js',    'favicon.ico and the app icons'],
  ['gensocial.js', 'avatars, LinkedIn cover, share cards, og.png'],
  ['gensig.js',    'the email signature and its wordmark'],
  ['gensheet.js',  'the contact sheet at brand/index.html'],
];

for (const [file, what] of STEPS) {
  console.log('\n== ' + what);
  execFileSync(process.execPath, [path.join(__dirname, file)], { stdio: 'inherit', cwd: __dirname });
}
console.log('\n  done.');

/* Renders every raster icon from icon-card.html, so the four never drift apart.
 *
 *   npm install puppeteer-core     (once, in this directory)
 *   node rebuild-icons.js
 *
 * Chrome must be installed. If it is somewhere unusual, point CHROME_PATH at it.
 *
 * Nothing on the site loads this file — it is a build step, run by hand on the
 * rare occasion the mark changes. icon-card.html carries the equivalent Chrome
 * command line per icon if you would rather not install anything.
 */
const fs = require('fs');
const { pathToFileURL } = require('url');

let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e) {
  console.error('\n  puppeteer-core is not installed here.\n' +
                '  Run:  npm install puppeteer-core\n' +
                '  Or use the plain Chrome command lines in icon-card.html.\n');
  process.exit(1);
}

const CHROME = process.env.CHROME_PATH ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe';

const ICONS = [
  { file: 'apple-touch-icon.png',  size: 180, maskable: false },
  { file: 'icon-192.png',          size: 192, maskable: false },
  { file: 'icon-512.png',          size: 512, maskable: false },
  { file: 'icon-maskable-512.png', size: 512, maskable: true  },
];

(async () => {
  if (!fs.existsSync(CHROME)) {
    console.error('\n  No Chrome at ' + CHROME +
                  '\n  Set CHROME_PATH to where it actually is.\n');
    process.exit(1);
  }
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=1'] });
  const src = pathToFileURL('icon-card.html').href;
  for (const { file, size, maskable } of ICONS) {
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.goto(src + '?s=' + size + (maskable ? '&m=1' : ''), { waitUntil: 'load' });
    await page.screenshot({ path: file });
    await page.close();
    console.log('  ' + file + '  ' + size + 'x' + size + (maskable ? '  (maskable)' : ''));
  }
  await browser.close();
})();

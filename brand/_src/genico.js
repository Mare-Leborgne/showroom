const puppeteer = require('puppeteer-core');
const fs = require('fs');
const ROOT = require('path').resolve(__dirname, '../..') + '/';   // the repo root

const mark = (op2, scale) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0B1424"/>
  <g ${scale !== 1 ? `transform="translate(16,16) scale(${scale}) translate(-16,-16)"` : ''} fill="none" stroke="#B8935A" stroke-linecap="round">
    <path d="M4 12.5c4-4.5 8-4.5 12 0s8 4.5 12 0" stroke-width="2.6"/>
    <path d="M4 21c4-4.5 8-4.5 12 0s8 4.5 12 0" stroke-width="1.8" stroke-opacity="${op2}"/>
  </g></svg>`;

/* ICO is a directory of images; since Vista each entry may be a whole PNG
   rather than a raw bitmap, which is what this writes. Three entries, because
   the sizes Windows and old browsers actually ask for are 16, 32 and 48. */
function buildIco(pngs) {
  const n = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(n, 4);
  const dir = Buffer.alloc(16 * n);
  let offset = 6 + 16 * n;
  pngs.forEach((p, i) => {
    const o = i * 16;
    dir.writeUInt8(p.size >= 256 ? 0 : p.size, o);        // 0 means 256
    dir.writeUInt8(p.size >= 256 ? 0 : p.size, o + 1);
    dir.writeUInt8(0, o + 2); dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4); dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(p.buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += p.buf.length;
  });
  return Buffer.concat([header, dir, ...pngs.map(p => p.buf)]);
}

(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
  const render = async (size, svg) => {
    const p = await b.newPage();
    await p.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await p.setContent(`<style>html,body{margin:0;width:${size}px;height:${size}px;overflow:hidden}svg{display:block;width:${size}px;height:${size}px}</style>` + svg);
    const buf = Buffer.from(await p.screenshot());
    await p.close();
    return { size, buf };
  };

  // 16px gets the ghost wave a touch stronger still — at that size antialiasing
  // eats a 1.8-unit stroke almost entirely
  const icoParts = [await render(16, mark(0.85, 1)), await render(32, mark(0.75, 1)), await render(48, mark(0.75, 1))];
  fs.writeFileSync(ROOT + 'favicon.ico', buildIco(icoParts));
  console.log('  favicon.ico   16+32+48   ' + (fs.statSync(ROOT + 'favicon.ico').size / 1024).toFixed(1) + 'KB');

  // app icons, regenerated at the corrected opacity
  for (const [file, size, scale] of [['apple-touch-icon.png', 180, 1], ['icon-192.png', 192, 1],
                                     ['icon-512.png', 512, 1], ['icon-maskable-512.png', 512, 0.66]]) {
    const { buf } = await render(size, mark(0.75, scale));
    fs.writeFileSync(ROOT + file, buf);
    console.log('  ' + file.padEnd(24) + size + 'x' + size + '   ' + (buf.length / 1024).toFixed(1) + 'KB');
  }
  await b.close();
})();

const fs = require('fs'), path = require('path');
const B = require('./brandlib.js');
const R = path.resolve(__dirname, '..');           // the brand folder
const w = (p, s) => { fs.writeFileSync(path.join(R, p), s); console.log('  ' + p + '  ' + s.length + 'B'); };

// wordmark
w('logo/wordmark-brass.svg',    B.wordmarkSVG({ fill: B.C.brass }));
w('logo/wordmark-ivory.svg',    B.wordmarkSVG({ fill: B.C.ivory }));
w('logo/wordmark-navy.svg',     B.wordmarkSVG({ fill: B.C.navyDeep }));
w('logo/wordmark-gradient.svg', B.wordmarkSVG({ gradient: true }));

// mark
w('mark/mark-brass.svg',        B.markSVG({ stroke: B.C.brass }));
w('mark/mark-ivory.svg',        B.markSVG({ stroke: B.C.ivory }));
w('mark/mark-navy.svg',         B.markSVG({ stroke: B.C.navyDeep }));
w('mark/mark-tile-navy.svg',    B.markSVG({ stroke: B.C.brass, bg: B.C.navyDeep }));
w('mark/mark-tile-ivory.svg',   B.markSVG({ stroke: B.C.brassInk, bg: B.C.ivory }));

// lockups
w('lockup/lockup-stacked-brass.svg',    B.lockupStacked({ stroke: B.C.brass, fill: B.C.brass }));
w('lockup/lockup-stacked-ivory.svg',    B.lockupStacked({ stroke: B.C.ivory, fill: B.C.ivory }));
w('lockup/lockup-stacked-navy.svg',     B.lockupStacked({ stroke: B.C.navyDeep, fill: B.C.navyDeep }));
w('lockup/lockup-horizontal-brass.svg', B.lockupHorizontal({ stroke: B.C.brass, fill: B.C.brass }));
w('lockup/lockup-horizontal-ivory.svg', B.lockupHorizontal({ stroke: B.C.ivory, fill: B.C.ivory }));
w('lockup/lockup-horizontal-navy.svg',  B.lockupHorizontal({ stroke: B.C.navyDeep, fill: B.C.navyDeep }));

// favicon, at the corrected ghost-wave opacity
w('../favicon.svg', B.markSVG({ stroke: B.C.brass, bg: B.C.navyDeep }));

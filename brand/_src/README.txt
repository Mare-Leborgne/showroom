Sources. Not used by the website at runtime.

  PinyonScript-Regular.ttf   the wordmark's typeface, OFL, licence beside it
  brandlib.js                the mark's paths, the palette, and the outliner
  gen*.js                    one generator per family of output
  rebuild-brand.js           runs them all in order
  fonts.css                  the two supporting faces, for the social images

  npm install opentype.js puppeteer-core
  node rebuild-brand.js

A note on the folder name: GitHub Pages runs Jekyll unless told otherwise, and
Jekyll drops any directory beginning with an underscore from the built site.
The .nojekyll file at the repository root is what keeps this one published, so
the font and its licence stay reachable alongside the assets they produced.
Do not delete it.

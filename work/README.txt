Screenshots for the Work section of index.html.

The section is written and styled already; it is switched off with the `hidden`
attribute on <section class="work"> until there is a project in it. The long
comment above that section in index.html is the instruction sheet.


WHAT TO PUT HERE
----------------
One image per project. The card frame is 16:10 and crops with object-fit:cover,
so anything close to that ratio sits correctly.

  Size      1600 x 1000. The card is at most 1080 CSS pixels wide, so this
            still looks right on a 2x screen without paying for 3x.
  Format    .webp, quality ~80. Roughly a third the weight of a PNG
            screenshot at the same quality, and supported everywhere the
            rest of this page is.
  Weight    Aim under 200 KB each. A portfolio that loads slowly argues
            against itself.
  Naming    lowercase-with-hyphens.webp, matching the business.

Every card is loading="lazy", so nothing here is fetched until someone scrolls
to the section. Give the <img> its real width and height in the markup: that is
what reserves the space and stops the page jumping as each screenshot lands.


TO CONVERT A PNG SCREENSHOT
---------------------------
  npx @squoosh/cli --webp '{"quality":80}' shot.png
or, with ImageMagick installed:
  magick shot.png -resize 1600x1000^ -gravity center -extent 1600x1000 -quality 80 the-client.webp


A NOTE ON WHAT TO SHOOT
-----------------------
The whole page, top of the site, at a desktop width, with no browser chrome.
A cropped detail says less than the composition does, and the composition is
the argument this studio is making.

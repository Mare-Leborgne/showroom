# Mare Leborgne — brand assets

Everything the studio needs to put its name on something, plus the sources to
regenerate all of it. Nothing in here is used by the website itself except the
favicons and the email signature's wordmark; the site draws its own marks from
the stylesheet.

**None of this is published.** `_config.yml` at the repository root excludes the
brand kit from the site GitHub Pages builds, so every path under `/brand/`
returns 404 at mareleborgne.com. Use the files from this folder — clone, or
download the repository — rather than by linking to them.

The single exception is `email/wordmark-signature.png`. That one has to stay
public: it is fetched from mareleborgne.com by the mail client of every person
who has ever received an email from the studio, and unpublishing it would break
the wordmark in all of them at once, retroactively.

One thing this does not do: the repository itself is public, so anyone who
finds it on GitHub can read every file here. Keeping the kit off the domain and
making the repository private are two separate decisions.

---

## The logo

**`lockup/lockup-wave-brass-on-navy`** is the primary logo: the signature
sitting on water.

It is the wave version and not the mark-beside-the-name because the studio is
called *mare*. The hero already floats the wordmark on a moving sea, and a
signature conventionally sits on a ruled line — so one wave does both jobs at
once, waterline and signature rule, and the name and the water stop reading as
two objects that happen to be stacked. Two lines rather than one, because two
lines are already the mark: the logo and the icon stay one language.

The shape was settled by drawing the alternatives, not by argument. Three wave
periods ripples and turns to mush below about 150px. One period is a long lazy
swell that needs too much vertical room. Running the water *through* the
descenders looked well at full size and read as a strikethrough small, so the
waterline clears them. Two periods, two lines, clear of the descenders.

Use it on navy wherever there is a choice — that is the site's own pairing and
the studio's own colour. `lockup-wave-brass` is the same thing transparent, for
dropping onto navy you already have. `lockup-wave-navy-on-ivory` is the light
version, for paper.

## The marks

**The wordmark** is "Mare Leborgne" set in Pinyon Script. In every SVG here the
letters are **converted to outlines**, not set as live text. This is the whole
reason the files are portable: an SVG that named the font would fall back to
whatever cursive the opening machine happens to have, which on Windows is
usually Comic Sans.

**The mark** is the two contour lines from the hero's sea. It stands in for the
wordmark where there is no room for a name — favicons, app icons, avatars.

**The other lockups** set the mark beside the name rather than under the water
— stacked, and horizontal for wide, short spaces. Use them where the wave
version will not fit.

---

## Which file

| You need | Use |
|---|---|
| Anything at any size, on screen or in print | the `.svg` |
| Somewhere that will not take SVG (Word, Gmail, some social) | the `.png` |
| On navy, or any dark ground | `-brass` or `-ivory` |
| On ivory, white, or paper | `-navy` |
| Anywhere the background is out of your hands | `-on-navy` or `-on-ivory`, which bring their own |
| A single flat colour, e.g. a stamp or an engraver | `-navy` or `-ivory` |
| The site's own look, with the sheen across it | `wordmark-gradient` |

PNGs are transparent, so they drop onto any ground. The number in the filename
is the pixel width. Ask for roughly twice the size it will be displayed at.

```
lockup/   lockup-wave-* is the logo; the rest set the mark beside the name
logo/     wordmark on its own, transparent or on its own ground
mark/     the two contour lines, on their own and on a tile
social/   avatars, LinkedIn cover, square share card
email/    the Gmail signature
_src/     the font, the licence, and the generator
```

---

## The email signature

Open **`email/install.html`** from this folder in a browser — double-click it
— and follow it. There is a copy button and four steps.

It is not on the website. Nothing in this folder is: `_config.yml` at the
repository root keeps the whole brand kit out of what GitHub Pages publishes,
so these files 404 at mareleborgne.com. The installer still works offline
because the wordmark it previews is loaded from the live URL, which is the one
file here that stays public.

Three things about it are deliberate, and all three are Gmail's doing:

- **The script is an image.** Gmail does not load webfonts, so a signature that
  asked for Pinyon Script would arrive in whatever the reader's machine calls
  cursive. This is what was wrong with the old one.
- **Every style is written inline.** Gmail strips `<style>` blocks entirely.
- **The name and the studio appear as real text** under the wordmark, not only
  inside it. A great many people read mail with images turned off, and those
  readers still get a signature rather than a blank space and an alt tag.

The wordmark is set in the darker brass (`#7E5E33`), because white is what
Gmail shows by default: the lighter brass measures 2.85:1 on white and the
thin script strokes wash out. `wordmark-signature-dark.png` is the same mark in
the lighter brass, if a dark ground is ever the target instead.

`email/signature.txt` is the plain-text version some clients ask for.

**The image must stay at `mareleborgne.com`.** Every signature already sent
points at that URL; moving or deleting it breaks the mark in all of them,
retroactively. It is named individually in `_config.yml` for that reason — and
excluding `brand/` wholesale, which looked like the tidier way to write that
config, is exactly what took it offline once already.

---

## Favicons

The mark, at the sizes browsers and operating systems ask for. These live at
the repository root, not in this folder, because that is where they are looked
for.

```
favicon.svg              modern browsers
favicon.ico              16 / 32 / 48, for older browsers and Windows
apple-touch-icon.png     180, iOS home screen
icon-192.png             the smallest Android will accept
icon-512.png             splash screens, app switchers
icon-maskable-512.png    512, pulled inside Android's circular safe zone
```

The second contour line is drawn at **75% opacity here, not the 55% the site
used**. Below about 20 pixels the fainter line disappeared into the background
and the mark read as one wave with a smudge under it. At 16px it is stronger
again, at 85%, because antialiasing eats a hairline stroke almost entirely at
that size. Nothing else about the mark changed — same paths, same weights.

---

## Colours

| | Hex | Where |
|---|---|---|
| Navy deep | `#0B1424` | the ground everything dark sits on |
| Navy | `#14213D` | headings on ivory, the send button |
| Ivory | `#F3ECDD` | the light ground |
| Ivory 2 | `#EAE1CE` | the second light ground, for alternating bands |
| Brass | `#B8935A` | the mark, rules, anything decorative on navy |
| Brass ink | `#7E5E33` | brass where it has to be **read** on a light ground |
| Brass lit | `#F0DCA8` | the bright middle of the sheen, and hover |
| Bordeaux | `#6E1F2E` | emphasis, and the one accent |
| Ink | `#211E1A` | body text |

Brass and brass-ink are not interchangeable. Brass is 2.4:1 on ivory — fine for
a rule or a fill, not for words. Brass-ink clears 4.5:1 on both ivory grounds
and is the one to use whenever brass has to carry text.

---

## Type

| | | |
|---|---|---|
| **Pinyon Script** | the wordmark and the signature | OFL, in `_src/` |
| **Cormorant Garamond** | headings, the tagline, italic ledes | OFL |
| **EB Garamond** | body text | OFL |
| **Jost** | small caps, labels, buttons | OFL |

All four are open licence and free to install. In email, where none of them
load, the fallback is Georgia.

---

## Rebuilding

```
cd brand/_src
npm install opentype.js puppeteer-core
node rebuild-brand.js
```

Regenerates every SVG from the font outlines, every PNG from those SVGs, the
`.ico`, the app icons, the social images and the signature wordmark. Chrome
must be installed; set `CHROME_PATH` if it is somewhere unusual.

Because the PNGs are rendered from the SVGs and the SVGs are generated from the
font, the set cannot drift out of step with itself.

---

## Licence

The marks and the artwork are Mare Leborgne's. The four typefaces are under the
SIL Open Font License 1.1 — `_src/PinyonScript-OFL.txt` carries the full text,
and it covers redistributing the font file alongside these assets.

# Text to path

A browser and Cloudflare Worker compatible TypeScript ES module. Runtime dependency: `opentype.js` (MIT), tested with 2.0.0. The implementation does not use Node, the DOM, canvas, a database or network requests. The caller supplies an ArrayBuffer.

## Example 1: outline a two-line name block

```ts
import { textToPath } from './index';

// fontBuffer is a TTF or OTF ArrayBuffer already held by the caller.
const result = textToPath({
  font: fontBuffer,
  text: 'Alex Rivera\nOwner',
  sizeMm: 3.9,
  lineHeight: 1.4,
  letterSpacingMm: 0.05,
  align: 'center',
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg"
  width="${result.widthMm}mm" height="${result.heightMm}mm"
  viewBox="0 0 ${result.widthMm} ${result.heightMm}">
  <path d="${result.d}" fill="#000"/>
</svg>`;
```

## Example 2: fit a name inside a fixed template slot

```ts
import { fitTextToBox } from './index';

const result = fitTextToBox({
  font: fontBuffer,
  text: 'Alex Rivera',
  boxMm: { w: 55, h: 10 },
  maxSizeMm: 8,
  minSizeMm: 3.53,
  align: 'left',
});
if (!result.fits) {
  // Ask for shorter text. Do not make the engraving smaller than the minimum.
  throw new Error('Please shorten the name.');
}
const pathElement = `<path d="${result.d}" fill="#000"/>`;
```

## Coordinate contract

- All measurements and path coordinates are millimeters. Y increases downwards.
- `sizeMm` is the em size, not cap height. The baseline begins at the font ascender.
- Baseline separation is `sizeMm * lineHeight`. CRLF and CR normalize to LF. Empty lines count.
- Alignment uses advance widths, including kerning and spaces. Tracking occurs only between characters.
- Width includes trailing spaces and any glyph overhang. Height includes the em line boxes and any ink extending beyond them. Negative overhang is translated into the returned block so no ink is clipped.
- Paths use six decimal places. Positive tracking fitting uses 40 bisection steps with a 1e-9 mm comparison tolerance. Negative tracking searches downwards at 0.001 mm resolution, because glyph reversal can make width non-monotonic. Limit input length and size ranges in the host for responsiveness.
- Missing glyphs and invalid inputs throw rather than silently engraving a missing-character box.
- Kerning uses opentype.js font pair positioning. This is a Latin layout module, not a full shaping engine. Contextual scripts, bidirectional layout, combining sequences and advanced ligatures need a shaping layer and are not certified by these tests. Pre-shape those elsewhere or restrict the host catalog/input accordingly.
- Supply static TTF/OTF font instances. Variable font axis selection is outside this interface.

## Tests and font

`index.test.ts` uses Vitest and test-only Node file loading. Those APIs are not used in `index.ts`. The shared fixture is `../test-assets/Inter-Regular.ttf`, a regular static instance of Inter at optical size 14, with its OFL notice beside it. Shared Fraunces and Allura fixtures support template previews only. Keeping fixtures in the sibling folder leaves this module with exactly the three requested files.

In a project with `vitest`, `opentype.js`, TypeScript, `@types/node` and `@types/opentype.js`, run:

```sh
npx vitest run text-to-path/index.test.ts
```

Inter source: https://github.com/google/fonts/tree/main/ofl/inter

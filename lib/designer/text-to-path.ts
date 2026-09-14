import * as OpenType from 'opentype.js';

export interface TextToPathOptions {
  font: ArrayBuffer
  text: string
  sizeMm: number
  letterSpacingMm?: number
  lineHeight?: number
  align?: 'left' | 'center' | 'right'
}
export interface TextPath {
  d: string
  widthMm: number
  heightMm: number
  lines: number
  /** Top of block to first baseline, mm. */
  baselineMm: number
}

type Font = OpenType.Font;
type Glyph = OpenType.Glyph;
type Command = OpenType.PathCommand;
// Support ESM builds and the CommonJS namespace returned by some bundlers.
const api = (typeof OpenType.parse === 'function' ? OpenType :
  (OpenType as unknown as { default: typeof OpenType }).default);

function finite(value: number, label: string, positive = false): void {
  if (!Number.isFinite(value) || (positive && value <= 0)) {
    throw new RangeError(`${label} must be ${positive ? 'positive and ' : ''}finite.`);
  }
}
function prepare(opts: Omit<TextToPathOptions, 'sizeMm'>) {
  if (!(opts.font instanceof ArrayBuffer) || !opts.font.byteLength) throw new TypeError('A TTF or OTF ArrayBuffer is required.');
  if (typeof opts.text !== 'string') throw new TypeError('Text must be a string.');
  finite(opts.letterSpacingMm ?? 0, 'letterSpacingMm');
  finite(opts.lineHeight ?? 1.2, 'lineHeight', true);
  if (!['left', 'center', 'right'].includes(opts.align ?? 'left')) throw new RangeError('Unknown alignment.');
  const font = api.parse(opts.font);
  const lines = opts.text.replace(/\r\n?/g, '\n').split('\n');
  const glyphs = lines.map(line => Array.from(line, char => {
    const glyph = font.charToGlyph(char);
    if (!glyph.index && char !== '\u0000') throw new RangeError(`The font has no glyph for U+${char.codePointAt(0)!.toString(16).toUpperCase()}.`);
    return glyph;
  }));
  return { font, glyphs };
}
function translate(command: Command, dx: number, dy: number): Command {
  const c = { ...command } as Command & Record<string, number | string>;
  for (const x of ['x', 'x1', 'x2']) if (typeof c[x] === 'number') c[x] = (c[x] as number) + dx;
  for (const y of ['y', 'y1', 'y2']) if (typeof c[y] === 'number') c[y] = (c[y] as number) + dy;
  return c;
}
function layout(font: Font, rows: Glyph[][], opts: TextToPathOptions): TextPath {
  const scale = opts.sizeMm / font.unitsPerEm;
  const spacing = opts.letterSpacingMm ?? 0;
  const leading = opts.sizeMm * (opts.lineHeight ?? 1.2);
  const rowPaths = rows.map((glyphs, line) => {
    const path = new api.Path();
    let pen = 0;
    const baseline = font.ascender * scale + line * leading;
    glyphs.forEach((glyph, i) => {
      if (i) pen += font.getKerningValue(glyphs[i - 1], glyph) * scale + spacing;
      path.extend(glyph.getPath(pen, baseline, opts.sizeMm));
      pen += (glyph.advanceWidth ?? 0) * scale;
    });
    return { path, advance: pen };
  });
  const advanceWidth = Math.max(0, ...rowPaths.map(row => row.advance));
  const combined = new api.Path();
  rowPaths.forEach(row => {
    const dx = opts.align === 'center' ? (advanceWidth - row.advance) / 2 :
      opts.align === 'right' ? advanceWidth - row.advance : 0;
    combined.commands.push(...row.path.commands.map(c => translate(c, dx, 0)));
  });
  const box = combined.getBoundingBox();
  const hasInk = combined.commands.length > 0;
  const left = hasInk ? Math.min(0, box.x1) : 0;
  const top = hasInk ? Math.min(0, box.y1) : 0;
  const right = Math.max(advanceWidth, hasInk ? box.x2 : 0);
  const bottom = Math.max((rows.length - 1) * leading + opts.sizeMm, hasInk ? box.y2 : 0);
  const result = new api.Path();
  result.commands = combined.commands.map(c => translate(c, -left, -top));
  const number = (v: number) => String(Number(v.toFixed(6)));
  const d = result.commands.map(c => {
    switch(c.type) {
      case 'M': case 'L': return `${c.type}${number(c.x)} ${number(c.y)}`;
      case 'C': return `C${number(c.x1)} ${number(c.y1)} ${number(c.x2)} ${number(c.y2)} ${number(c.x)} ${number(c.y)}`;
      case 'Q': return `Q${number(c.x1)} ${number(c.y1)} ${number(c.x)} ${number(c.y)}`;
      case 'Z': return 'Z';
    }
  }).join('');
  return { d, widthMm: right - left, heightMm: bottom - top, lines: rows.length, baselineMm: font.ascender * scale - top };
}

export function textToPath(opts: TextToPathOptions): TextPath {
  finite(opts.sizeMm, 'sizeMm', true);
  const { font, glyphs } = prepare(opts);
  return layout(font, glyphs, opts);
}

export function fitTextToBox(
  opts: Omit<TextToPathOptions, 'sizeMm'> & {
    boxMm: { w: number; h: number }; maxSizeMm: number; minSizeMm: number
  }
): TextPath & { sizeMm: number; fits: boolean } {
  finite(opts.boxMm?.w, 'box width', true);
  finite(opts.boxMm?.h, 'box height', true);
  finite(opts.minSizeMm, 'minSizeMm', true);
  finite(opts.maxSizeMm, 'maxSizeMm', true);
  if (opts.minSizeMm > opts.maxSizeMm) throw new RangeError('minSizeMm exceeds maxSizeMm.');
  const { font, glyphs } = prepare(opts);
  const at = (sizeMm: number) => layout(font, glyphs, { ...opts, sizeMm });
  const fits = (p: TextPath) => p.widthMm <= opts.boxMm.w + 1e-9 && p.heightMm <= opts.boxMm.h + 1e-9;
  const max = at(opts.maxSizeMm);
  if (fits(max)) return { ...max, sizeMm: opts.maxSizeMm, fits: true };
  // Fixed negative tracking can reverse glyph positions at very small sizes.
  // Descending search handles that case without assuming monotonic width.
  if ((opts.letterSpacingMm ?? 0) < 0) {
    const steps = Math.ceil((opts.maxSizeMm - opts.minSizeMm) / 0.001);
    for (let i = 1; i <= steps; i++) {
      const sizeMm = Math.max(opts.minSizeMm, opts.maxSizeMm - i * 0.001);
      const candidate = at(sizeMm);
      if (fits(candidate)) return { ...candidate, sizeMm, fits: true };
    }
    return { ...at(opts.minSizeMm), sizeMm: opts.minSizeMm, fits: false };
  }
  const min = at(opts.minSizeMm);
  if (!fits(min)) return { ...min, sizeMm: opts.minSizeMm, fits: false };
  let lo = opts.minSizeMm;
  let hi = opts.maxSizeMm;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (fits(at(mid))) lo = mid; else hi = mid;
  }
  const result = at(lo);
  return { ...result, sizeMm: lo, fits: fits(result) };
}

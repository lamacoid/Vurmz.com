import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as OpenType from 'opentype.js';
import { textToPath, fitTextToBox } from './index';
const bytes = readFileSync(new URL('../test-assets/Inter-Regular.ttf', import.meta.url));
const font = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
const api = typeof OpenType.parse === 'function' ? OpenType : (OpenType as unknown as {default: typeof OpenType}).default;
const pathApi = api.Path as typeof api.Path & {
  fromSVG(d: string, options: {flipY: boolean; optimize: boolean; decimalPlaces: number}): OpenType.Path
};
const pathBox = (d: string) => {
  const path = pathApi.fromSVG(d, { flipY: false, optimize: false, decimalPlaces: 6 });
  return path.getBoundingBox();
};
describe('textToPath', () => {
  it('makes a nonempty, millimeter path for one glyph', () => {
    const p = textToPath({ font, text: 'A', sizeMm: 4 });
    expect(p.d).toContain('M'); expect(p.widthMm).toBeGreaterThan(0);
    expect(p.heightMm).toBeGreaterThanOrEqual(4); expect(p.lines).toBe(1);
    expect(pathBox(p.d).x1).toBeGreaterThanOrEqual(-1e-6);
    expect(pathBox(p.d).y1).toBeGreaterThanOrEqual(-1e-6);
  });
  it('adds tracking between characters, never after the final one', () => {
    const base = textToPath({ font, text: 'ABC', sizeMm: 4 });
    const spaced = textToPath({ font, text: 'ABC', sizeMm: 4, letterSpacingMm: 0.5 });
    expect(spaced.widthMm - base.widthMm).toBeCloseTo(1, 5);
  });
  it('places a second identical glyph at the requested line height', () => {
    const single = textToPath({ font, text: 'H', sizeMm: 4 });
    const double = textToPath({ font, text: 'H\nH', sizeMm: 4, lineHeight: 1.5 });
    expect(double.lines).toBe(2);
    expect(pathBox(double.d).y2 - pathBox(single.d).y2).toBeCloseTo(6, 5);
    expect(double.heightMm - single.heightMm).toBeCloseTo(6, 5);
  });
  it('centers the shorter line by advance width', () => {
    const left = textToPath({ font, text: 'HHHH\nH', sizeMm: 4 });
    const centered = textToPath({ font, text: 'HHHH\nH', sizeMm: 4, align: 'center' });
    const commandsLeft = pathApi.fromSVG(left.d, { flipY: false, optimize: false, decimalPlaces: 6 }).commands;
    const commandsCenter = pathApi.fromSVG(centered.d, { flipY: false, optimize: false, decimalPlaces: 6 }).commands;
    const singleCount = pathApi.fromSVG(textToPath({font,text:'HHHH',sizeMm:4}).d, {flipY:false, optimize:false, decimalPlaces:6}).commands.length;
    const a = commandsLeft[singleCount] as { x: number };
    const b = commandsCenter[singleCount] as { x: number };
    const long = textToPath({font,text:'HHHH',sizeMm:4});
    const short = textToPath({font,text:'H',sizeMm:4});
    expect(b.x-a.x).toBeCloseTo((long.widthMm-short.widthMm)/2, 5);
  });
  it('applies real AV kerning from the font', () => {
    const width = (text: string) => textToPath({font,text,sizeMm:10}).widthMm;
    expect(width('AV')).toBeLessThan(width('A') + width('V'));
  });
  it('keeps blank lines and empty text finite', () => {
    const p = textToPath({font,text:'\n',sizeMm:4});
    expect(p.d).toBe(''); expect(p.lines).toBe(2); expect(p.heightMm).toBeCloseTo(8.8);
  });
  it('rejects missing glyphs and invalid dimensions', () => {
    expect(()=>textToPath({font,text:'\u{1F996}',sizeMm:4})).toThrow();
    expect(()=>textToPath({font,text:'A',sizeMm:NaN})).toThrow();
  });
});
describe('fitTextToBox', () => {
  it('reports failure at the minimum without silently shrinking further', () => {
    const p=fitTextToBox({font,text:'Alex Rivera',boxMm:{w:1,h:1},maxSizeMm:8,minSizeMm:3});
    expect(p.fits).toBe(false); expect(p.sizeMm).toBe(3);
  });
  it('fits both dimensions and returns the largest allowed size if it fits', () => {
    const p=fitTextToBox({font,text:'Alex Rivera\nOwner',boxMm:{w:22,h:10},maxSizeMm:8,minSizeMm:1});
    expect(p.fits).toBe(true); expect(p.widthMm).toBeLessThanOrEqual(22.000001);
    expect(p.heightMm).toBeLessThanOrEqual(10.000001);
    expect(fitTextToBox({font,text:'A',boxMm:{w:100,h:100},maxSizeMm:8,minSizeMm:1}).sizeMm).toBe(8);
  });
});

#!/usr/bin/env python3
"""
Kerf — VURMZ house typeface (v1)
An industrial monoline geometric face built from centerline skeletons.

Every glyph is defined as a set of skeleton strokes (polylines + arcs). Each
stroke is expanded to a constant-width outline with round caps/joins, then all
strokes are boolean-unioned into clean, overlap-free contours. Constant stroke
width => true monoline; counters form naturally from the thin strokes.

Outputs: Kerf-Regular.ttf, Kerf-Regular.woff2, specimen.png
"""
import math
import os
import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

# ----------------------------------------------------------------------------
# Metrics
# ----------------------------------------------------------------------------
UPM    = 1000
CAP    = 700          # cap height
ASC    = 760          # ascender (line metric)
DESC   = -240         # descender (line metric)
STROKE = 70           # monoline weight
R      = STROKE / 2.0 # 35 — half stroke
SB     = 60           # default side bearing

HERE = os.path.dirname(os.path.abspath(__file__))

# ----------------------------------------------------------------------------
# Geometry primitives  -> all produce simple closed polygon contours
# ----------------------------------------------------------------------------
def disc(cx, cy, r=R, n=32):
    return [(cx + r * math.cos(2 * math.pi * i / n),
             cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)]

def rect_segment(a, b, r=R):
    ax, ay = a
    bx, by = b
    dx, dy = bx - ax, by - ay
    L = math.hypot(dx, dy)
    if L < 1e-6:
        return None
    nx, ny = -dy / L * r, dx / L * r        # left normal scaled to half-width
    return [(ax + nx, ay + ny), (bx + nx, by + ny),
            (bx - nx, by - ny), (ax - nx, ay - ny)]

def stroke_polyline(points, closed=False, r=R):
    """Round-capped, round-joined constant-width stroke -> list of contours."""
    contours = []
    n = len(points)
    if n == 1:                               # a lone dot
        contours.append(disc(points[0][0], points[0][1], r))
        return contours
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        a = points[i]
        b = points[(i + 1) % n]
        rs = rect_segment(a, b, r)
        if rs:
            contours.append(rs)
    for p in points:                         # discs => round caps + joins
        contours.append(disc(p[0], p[1], r))
    return contours

# arc / ellipse sampling along a centerline
def ell(cx, cy, rx, ry, a0, a1, step=7):
    n = max(2, int(abs(a1 - a0) / step) + 1)
    out = []
    for i in range(n + 1):
        t = math.radians(a0 + (a1 - a0) * i / n)
        out.append((cx + rx * math.cos(t), cy + ry * math.sin(t)))
    return out

def arc(cx, cy, r, a0, a1, step=7):
    return ell(cx, cy, r, r, a0, a1, step)

# ----------------------------------------------------------------------------
# Skeleton DSL — each glyph is a list of strokes.
#   ("L", [pts...])          open polyline
#   ("O", [pts...])          closed polyline (ring)
#   ("D", x, y[, r])         dot
# Helpers below build the pts lists.
# ----------------------------------------------------------------------------
def L(*pts):           return ("L", list(pts))
def O(pts):            return ("O", list(pts))
def D(x, y, r=52):     return ("D", (x, y), r)

# round-letter geometry
RC = 320               # centerline radius of round caps (O,C,G,Q)
ROX = 415              # center x for O
ROY = 350              # center y

G = {}                 # glyph name -> list of strokes

# ---- Letters --------------------------------------------------------------
G["A"] = [L((95, 0), (305, 700)), L((515, 0), (305, 700)),
          L((161, 220), (449, 220))]
G["B"] = [L((95, 0), (95, 700)),
          ("L", ell(95, 525, 215, 175, 90, -90)),
          ("L", ell(95, 175, 235, 175, 90, -90))]
G["C"] = [("L", arc(ROX, ROY, RC, 52, 308))]
G["D"] = [L((95, 0), (95, 700)),
          ("L", ell(95, 350, 300, 350, 90, -90))]
G["E"] = [L((95, 0), (95, 700)), L((95, 700), (430, 700)),
          L((95, 350), (395, 350)), L((95, 0), (430, 0))]
G["F"] = [L((95, 0), (95, 700)), L((95, 700), (430, 700)),
          L((95, 350), (395, 350))]
G["G"] = [("L", arc(ROX, ROY, RC, 52, 340)),
          L((735, 250), (735, 350)), L((735, 350), (470, 350))]
G["H"] = [L((95, 0), (95, 700)), L((525, 0), (525, 700)),
          L((95, 350), (525, 350))]
G["I"] = [L((95, 0), (95, 700))]
G["J"] = [L((360, 700), (360, 175)),
          ("L", ell(220, 175, 140, 165, 0, -185))]
G["K"] = [L((95, 0), (95, 700)),
          L((110, 350), (470, 700)), L((110, 350), (490, 0))]
G["L"] = [L((95, 0), (95, 700)), L((95, 0), (430, 0))]
G["M"] = [L((95, 0), (95, 700), (310, 170), (525, 700), (525, 0))]
G["N"] = [L((95, 0), (95, 700), (525, 0), (525, 700))]
G["O"] = [O(ell(ROX, ROY, RC, RC, 0, 360, step=6)[:-1])]
G["P"] = [L((95, 0), (95, 700)),
          ("L", ell(95, 525, 235, 175, 90, -90))]
G["Q"] = [O(ell(ROX, ROY, RC, RC, 0, 360, step=6)[:-1]),
          L((470, 215), (775, -40))]
G["R"] = [L((95, 0), (95, 700)),
          ("L", ell(95, 525, 235, 175, 90, -90)),
          L((150, 350), (470, 0))]
G["S"] = [("L", [
            (470, 545), (455, 620), (400, 670), (310, 690), (210, 685),
            (130, 645), (95, 565), (120, 470), (210, 415), (350, 360),
            (440, 300), (455, 215), (415, 120), (320, 80), (215, 75),
            (130, 105), (95, 165)])]
G["T"] = [L((60, 700), (560, 700)), L((310, 0), (310, 700))]
G["U"] = [L((95, 700), (95, 215)), L((525, 700), (525, 215)),
          ("L", ell(310, 215, 215, 215, 180, 360))]
G["V"] = [L((95, 700), (310, 0), (525, 700))]
G["W"] = [L((95, 700), (230, 0), (360, 500), (490, 0), (625, 700))]
G["X"] = [L((95, 0), (525, 700)), L((95, 700), (525, 0))]
G["Y"] = [L((95, 700), (310, 360)), L((525, 700), (310, 360)),
          L((310, 360), (310, 0))]
G["Z"] = [L((95, 700), (525, 700)), L((525, 700), (95, 0)),
          L((95, 0), (525, 0))]

# ---- Digits ---------------------------------------------------------------
G["zero"]  = [O(ell(300, 350, 220, 330, 0, 360, step=6)[:-1])]
G["one"]   = [L((180, 560), (300, 700), (300, 0))]
G["two"]   = [("L", ell(290, 510, 195, 190, 195, -20)),
              L((480, 510), (110, 0)), L((110, 0), (485, 0))]
G["three"] = [("L", ell(280, 525, 175, 175, 130, -120)),
              ("L", ell(280, 185, 195, 185, 120, -130))]
G["four"]  = [L((400, 700), (110, 235), (480, 235)), L((400, 700), (400, 0))]
G["five"]  = [L((430, 700), (130, 700), (118, 410)),
              ("L", ell(165, 230, 215, 215, 110, -118))]
G["six"]   = [("L", ell(300, 230, 210, 210, 0, 360, step=6)[:-1]),
              ("L", ell(300, 430, 210, 280, 90, 175))]
G["seven"] = [L((95, 700), (490, 700), (250, 0))]
G["eight"] = [O(ell(300, 520, 175, 165, 0, 360, step=6)[:-1]),
              O(ell(300, 180, 205, 185, 0, 360, step=6)[:-1])]
G["nine"]  = [("L", ell(300, 470, 210, 210, 0, 360, step=6)[:-1]),
              ("L", ell(300, 270, 210, 280, -90, -5))]

# ---- Punctuation ----------------------------------------------------------
G["space"]        = []
G["period"]       = [D(95, 52)]
G["comma"]        = [("L", [(110, 70), (95, -40), (45, -120)])]
G["exclam"]       = [L((95, 700), (95, 205)), D(95, 50)]
G["question"]     = [("L", ell(245, 505, 150, 165, 200, -35)),
                     L((245, 340), (245, 250)), D(245, 50)]
G["colon"]        = [D(95, 470), D(95, 150)]
G["semicolon"]    = [D(95, 470), ("L", [(110, 150), (95, 40), (45, -40)])]
G["hyphen"]       = [L((55, 350), (305, 350))]
G["slash"]        = [L((55, -40), (380, 730))]
G["ampersand"]    = [("L", [
                     (520, 270), (430, 90), (300, 25), (170, 55), (110, 160),
                     (150, 270), (300, 360), (360, 470), (330, 580),
                     (235, 615), (150, 565), (160, 460), (260, 360),
                     (470, 130), (560, 60)])]
G["apostrophe"]   = [("L", [(110, 700), (80, 545)])]
G["quotedbl"]     = [("L", [(110, 700), (80, 545)]), ("L", [(250, 700), (220, 545)])]
G["parenleft"]    = [("L", ell(330, 350, 175, 400, 138, 222))]
G["parenright"]   = [("L", ell(70, 350, 175, 400, 42, -42))]
G["plus"]         = [L((95, 350), (415, 350)), L((255, 190), (255, 510))]
G["at"]           = [("L", ell(320, 345, 285, 300, 325, 635)),     # outer ring, gap lower-right
                     L((560, 168), (598, 70)),                      # tail
                     O(ell(305, 355, 92, 115, 0, 360, step=8)[:-1]),# inner bowl
                     L((397, 250), (397, 470))]                     # inner 'a' stem
G["numbersign"]   = [L((150, 0), (250, 700)), L((360, 0), (460, 700)),
                     L((90, 230), (520, 230)), L((90, 470), (520, 470))]

# ----------------------------------------------------------------------------
# Build outlines
# ----------------------------------------------------------------------------
def glyph_contours(strokes):
    contours = []
    for s in strokes:
        kind = s[0]
        if kind == "D":
            _, (x, y), r = s
            contours += stroke_polyline([(x, y)], closed=False, r=r)
        elif kind == "O":
            pts = s[1]
            contours += stroke_polyline(pts, closed=True)
        else:  # "L"
            pts = s[1]
            contours += stroke_polyline(pts, closed=False)
    return contours

def _signed_area(pts):
    a = 0.0
    n = len(pts)
    for i in range(n):
        x0, y0 = pts[i]
        x1, y1 = pts[(i + 1) % n]
        a += x0 * y1 - x1 * y0
    return a * 0.5

def union_path(contours):
    """Boolean-union all contours into clean, overlap-free outlines."""
    paths = []
    for pts in contours:
        if _signed_area(pts) > 0:            # normalize every contour to CW
            pts = pts[::-1]
        p = pathops.Path()
        pen = p.getPen()
        pen.moveTo(pts[0])
        for q in pts[1:]:
            pen.lineTo(q)
        pen.closePath()
        paths.append(p)
    if not paths:
        return pathops.Path()
    builder = pathops.OpBuilder()
    for p in paths:
        builder.add(p, pathops.PathOp.UNION)
    return builder.resolve()

# manual advance widths for spacing-only glyphs
FIXED_ADV = {"space": 340}

def build():
    glyph_order = [".notdef"]
    glyphs = {}
    metrics = {}
    cmap = {}

    # .notdef — simple open rectangle
    nd = TTGlyphPen(None)
    for (x0, y0, x1, y1) in [(80, 0, 80, 700), (80, 700, 460, 700),
                              (460, 700, 460, 0), (460, 0, 80, 0)]:
        pass
    ndp = union_path(stroke_polyline(
        [(80, 0), (80, 700), (460, 700), (460, 0)], closed=True, r=30))
    ndp.draw(nd)
    glyphs[".notdef"] = nd.glyph()
    metrics[".notdef"] = (540, 80)

    name_for_cp = {}
    cps = {
        **{ord(c): c for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"},
        0x30: "zero", 0x31: "one", 0x32: "two", 0x33: "three", 0x34: "four",
        0x35: "five", 0x36: "six", 0x37: "seven", 0x38: "eight", 0x39: "nine",
        0x20: "space", 0x2E: "period", 0x2C: "comma", 0x21: "exclam",
        0x3F: "question", 0x3A: "colon", 0x3B: "semicolon", 0x2D: "hyphen",
        0x2F: "slash", 0x26: "ampersand", 0x27: "apostrophe", 0x22: "quotedbl",
        0x28: "parenleft", 0x29: "parenright", 0x2B: "plus", 0x40: "at",
        0x23: "numbersign",
    }
    # lowercase maps to the same caps (v1 is a unicase/caps face)
    for c in "abcdefghijklmnopqrstuvwxyz":
        cps[ord(c)] = c.upper()

    built = {}
    for cp, name in cps.items():
        if name not in G:
            continue
        if name not in built:
            strokes = G[name]
            if not strokes:                  # space
                adv = FIXED_ADV.get(name, 340)
                gp = TTGlyphPen(None)
                glyphs[name] = gp.glyph()
                metrics[name] = (adv, 0)
            else:
                contours = glyph_contours(strokes)
                xs = [p[0] for c in contours for p in c]
                xmin = min(xs)
                xmax = max(xs)
                path = union_path(contours)
                pen = TTGlyphPen(None)
                path.draw(pen)
                glyphs[name] = pen.glyph()
                adv = int(round(xmax + SB))
                metrics[name] = (adv, int(round(xmin)))
            built[name] = True
            glyph_order.append(name)
        cmap[cp] = name

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ASC, descent=DESC)
    fb.setupNameTable({
        "familyName": "Kerf",
        "styleName": "Regular",
        "uniqueFontIdentifier": "VURMZ;Kerf-Regular;1.0",
        "fullName": "Kerf Regular",
        "psName": "Kerf-Regular",
        "version": "Version 1.0",
        "manufacturer": "VURMZ",
        "designer": "VURMZ / Kerf",
        "description": "Industrial monoline geometric — VURMZ house typeface.",
    })
    fb.setupOS2(sTypoAscender=ASC, sTypoDescender=DESC, sTypoLineGap=0,
                usWinAscent=ASC, usWinDescent=-DESC, sCapHeight=CAP,
                sxHeight=CAP, achVendID="VRMZ")
    fb.setupPost()

    ttf = os.path.join(HERE, "Kerf-Regular.ttf")
    fb.font.save(ttf)
    print("wrote", ttf)

    # woff2
    from fontTools.ttLib import TTFont
    f = TTFont(ttf)
    f.flavor = "woff2"
    woff2 = os.path.join(HERE, "Kerf-Regular.woff2")
    f.save(woff2)
    print("wrote", woff2)
    return ttf


def specimen(ttf):
    from PIL import Image, ImageDraw, ImageFont
    W, H = 1500, 1040
    img = Image.new("RGB", (W, H), "#f6f5f1")
    d = ImageDraw.Draw(img)
    ink = "#1a1a1a"
    big   = ImageFont.truetype(ttf, 200)
    med   = ImageFont.truetype(ttf, 92)
    row   = ImageFont.truetype(ttf, 64)
    small = ImageFont.truetype(ttf, 44)
    d.text((50, 30),  "VURMZ",  font=big,  fill=ink)
    d.text((55, 270), "KERF",   font=med,  fill="#b4451f")
    d.text((55, 400), "ABCDEFGHIJKLM", font=row, fill=ink)
    d.text((55, 490), "NOPQRSTUVWXYZ", font=row, fill=ink)
    d.text((55, 600), "0123456789 & @ #", font=row, fill=ink)
    d.text((55, 700), ". , ! ? : ; - / ( ) + ' \"", font=row, fill=ink)
    d.text((55, 820), "NEED A GUY WITH SOME LASERS?", font=small, fill=ink)
    d.text((55, 890), "THE QUICK BROWN FOX JUMPS OVER", font=small, fill=ink)
    d.text((55, 950), "A LAZY DOG. 1234567890.", font=small, fill=ink)
    out = os.path.join(HERE, "specimen.png")
    img.save(out)
    print("wrote", out)


if __name__ == "__main__":
    ttf = build()
    specimen(ttf)

#!/usr/bin/env python3
"""Build the street-map mask from real OpenStreetMap data.

Fetches the roads around the shop (lib/site-info.ts coordinates) from the
Overpass API and writes public/images/maps/centennial-streets.svg: opaque
ink strokes on a transparent ground, weighted by road class, meant to be
used as a CSS mask so the site's color tokens do the coloring.

Run from the repo root, on a network that can reach overpass-api.de:
    python3 scripts/build-street-map.py
"""
import json
import math
import urllib.request
import urllib.parse
from pathlib import Path

# Centered on the shop (lib/site-info.ts), a window of the real south metro:
# roughly 8.5 km wide and 6 km tall.
LAT, LNG = 39.58, -104.87
HALF_LAT, HALF_LNG = 0.0275, 0.050
S, W, N, E = LAT - HALF_LAT, LNG - HALF_LNG, LAT + HALF_LAT, LNG + HALF_LNG

QUERY = f"""
[out:json][timeout:90];
way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|living_street|motorway_link|trunk_link|primary_link|secondary_link)$"]({S},{W},{N},{E});
out geom;
"""

# Stroke weight per road class, in viewBox units. The arterials carry the
# image; the residential grid is the texture behind them.
WEIGHTS = {
    "motorway": 5.0, "trunk": 5.0, "motorway_link": 2.6, "trunk_link": 2.6,
    "primary": 3.6, "primary_link": 2.2,
    "secondary": 2.6, "secondary_link": 1.8,
    "tertiary": 1.8,
    "unclassified": 1.1, "residential": 1.1, "living_street": 1.1,
}

WIDTH = 1600.0
COS = math.cos(math.radians(LAT))
HEIGHT = round(WIDTH * (N - S) / ((E - W) * COS), 1)
MIN_SEG = 2.0  # drop points closer than this many viewBox units


def fetch() -> dict:
    url = "https://overpass-api.de/api/interpreter"
    data = urllib.parse.urlencode({"data": QUERY}).encode()
    req = urllib.request.Request(url, data=data, headers={"User-Agent": "vurmz-site-map-build"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def project(lon: float, lat: float) -> tuple[float, float]:
    x = (lon - W) / (E - W) * WIDTH
    y = (N - lat) / (N - S) * HEIGHT
    return x, y


def path_for(way: dict) -> str | None:
    pts = []
    for g in way.get("geometry", []):
        x, y = project(g["lon"], g["lat"])
        if pts and abs(x - pts[-1][0]) < MIN_SEG and abs(y - pts[-1][1]) < MIN_SEG:
            continue
        pts.append((x, y))
    if len(pts) < 2:
        return None
    d = f"M{pts[0][0]:.1f} {pts[0][1]:.1f}"
    for x, y in pts[1:]:
        d += f"L{x:.1f} {y:.1f}"
    return d


def main() -> None:
    raw = fetch()
    by_weight: dict[float, list[str]] = {}
    ways = 0
    for el in raw.get("elements", []):
        wclass = el.get("tags", {}).get("highway")
        weight = WEIGHTS.get(wclass)
        if weight is None:
            continue
        d = path_for(el)
        if not d:
            continue
        by_weight.setdefault(weight, []).append(d)
        ways += 1

    groups = []
    for weight in sorted(by_weight, reverse=True):
        d = "".join(by_weight[weight])
        groups.append(f'<path stroke-width="{weight}" d="{d}"/>')

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH:.0f} {HEIGHT}">'
        f'<g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round">'
        + "".join(groups)
        + "</g></svg>"
    )
    out = Path("public/images/maps/centennial-streets.svg")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(svg)
    print(f"wrote {out} · {ways} ways · {len(svg) / 1024:.0f} KB · viewBox 1600x{HEIGHT}")


if __name__ == "__main__":
    main()

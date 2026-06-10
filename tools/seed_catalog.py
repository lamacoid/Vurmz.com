#!/usr/bin/env python3
"""
Seed the VURMZ shop catalog into the local D1 (miniflare) sqlite.

Real stocked/made-to-order products with salesman copy and suggested pricing.
Prices are first-pass suggestions — adjust freely in the admin.

Usage: python3 tools/seed_catalog.py
"""
import glob
import json
import os
import sqlite3
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

def find_db():
    cands = glob.glob(os.path.join(ROOT, ".wrangler/state/v3/d1/*/*.sqlite"))
    for db in cands:
        con = sqlite3.connect(db)
        try:
            row = con.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='products'").fetchone()
            if row:
                return db
        finally:
            con.close()
    raise SystemExit("No D1 sqlite with a products table found under .wrangler/state")

NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

# (id, slug, name, short, description, category_id, price_cents, pack_size,
#  made_to_order, lead_time_days, weight_grams, one_off, is_published, metadata)
P = [
    # ---- Coasters -----------------------------------------------------------
    ("prd_slate_coaster", "engraved-slate-coaster-set",
     "Slate Coasters — Set of 4",
     "Jet-black 4″ natural slate with cork feet. Your design etched in for good.",
     "Four genuine slate coasters, 4 inches across, with a raw stone edge and soft cork "
     "backing that won’t scratch a surface. We laser-etch your name, monogram, logo, or "
     "art straight into the stone — permanent, dishwasher-tough, impossible to ignore on a "
     "coffee table. Pick your text and font above; all four are cut to match.\n\n"
     "Keep a set on hand. Gift a set that lasts.",
     "cat_coasters", 3400, 4, 1, 3, 640, 0, 1, {}),

    ("prd_gold_ss_coaster", "gold-stainless-coaster-set",
     "Gold Stainless Coasters — Set of 4",
     "Mirror-gold 3.5″ stainless. Bold, modern, basically bulletproof.",
     "A four-piece set of 3.5″ gold-finish stainless steel coasters with a mirror shine "
     "that makes engraving pop. Rust-proof, heat-proof, and heavy enough to feel premium in "
     "the hand. Your design comes through crisp and bright against the gold.\n\n"
     "The set that makes a bar cart look expensive.",
     "cat_coasters", 4400, 4, 1, 3, 520, 0, 1, {}),

    ("prd_brushed_ss_coaster", "brushed-stainless-coaster-set",
     "Brushed Stainless Coasters — Set of 4",
     "Satin-brushed stainless — understated, premium, fingerprint-friendly.",
     "Four 3.5″ brushed stainless coasters with a soft satin grain that hides smudges and "
     "reads high-end. The laser leaves a clean, frosted mark that contrasts beautifully with "
     "the brushed finish. Built for daily use, dressed for company.\n\n"
     "Quietly the nicest coasters in the room.",
     "cat_coasters", 4200, 4, 1, 3, 520, 0, 1, {}),

    ("prd_pine_coaster", "pine-wood-coaster-set",
     "Pine Wood Coasters — Set of 4",
     "Square pine, softened edges, ¼″ solid. Natural, stained, or scorched.",
     "Four solid pine coasters cut square with gently rounded edges — warm, light, ready "
     "for your mark. We finish them three ways: clean natural, rich stain, or a smoky scorched "
     "edge for that woodshop look. Tell us your finish in the order notes.\n\n"
     "Real wood, real character, made to order.",
     "cat_coasters", 2600, 4, 1, 4, 300, 0, 1, {}),

    # ---- Knives -------------------------------------------------------------
    ("prd_survival_knife", "survival-knife-personalized",
     "Survival Knife — Personalized",
     "Full-tang survival blade, engraved with your name. Only 5 in this run.",
     "A rugged full-tang survival / hunting knife, deep-engraved on the blade or handle with "
     "your name, initials, coordinates, or a short message. Five are prepped and ready right "
     "now — when they’re gone, they’re gone until the next batch.\n\n"
     "A blade that’s actually yours. Add your text above.",
     "cat_knives", 6400, 1, 1, 5, 380, 0, 1, {}),

    # ---- Gifts --------------------------------------------------------------
    ("prd_mini_mailbox", "personalized-mini-mailbox",
     "Personalized Mini Mailbox",
     "A keepsake mini mailbox — engraved for the gift that gets the “awww.”",
     "A charming white mini mailbox that doubles as a card box, gift box, or just-because "
     "keepsake. We can engrave a 4×3 panel on the side, or a tidy 2×2 on the front or "
     "back — names, a date, a little message. Tell us where you want it in the notes.\n\n"
     "Weddings, anniversaries, new homes — this one lands.",
     "cat_gifts", 3800, 1, 1, 4, 350, 0, 1, {}),

    ("prd_softtouch_pen", "soft-touch-stylus-pen",
     "Soft-Touch Stylus Pen",
     "Velvet soft-touch metal pen + touchscreen stylus. Your name, etched clean.",
     "A weighted metal pen with a grippy soft-touch coating that feels like suede, tipped with "
     "a capacitive stylus for phones and tablets. We laser your name or logo into the barrel "
     "— crisp, permanent, professional. Stocked in a range of colors; name your pick in "
     "the notes.\n\nThe giveaway people actually keep. Ask about bulk.",
     "cat_gifts", 1400, 1, 1, 2, 30, 0, 1, {}),

    ("prd_byo_engraving", "bring-your-own-item-engraving",
     "Bring Your Own Item — Engraving",
     "Tumbler, flask, knife, heirloom? Bring it — we’ll laser it clean. From $15.",
     "Bring your own item and we’ll engrave it: tumblers, flasks, knives, tools, lighters, "
     "watches, pet tags, instruments, that thing your grandfather left you. Metal, wood, glass, "
     "leather, acrylic, slate — if it’s solid, we can mark it. Drop it off in the "
     "South Denver metro or ship it in.\n\nAdd your text and font above to get started; final "
     "pricing depends on size and material. When in doubt, just ask — the $15 is a "
     "starting point.",
     "cat_gifts", 1500, 1, 1, 3, 200, 0, 1, {}),

    ("prd_jewelry_marking", "custom-jewelry-marking",
     "Custom Jewelry Marking",
     "Rings, pendants, dog tags, bracelets — names, dates, coordinates, even handwriting. From $20.",
     "Fine-detail laser marking for jewelry and small metal keepsakes — rings (inside or "
     "out), pendants, lockets, bar necklaces, ID and pet tags, cuffs and bracelets. Names, "
     "dates, coordinates, a short quote, or your own handwriting and a fingerprint turned into "
     "metal. Bring your own piece or ask and I’ll source a blank.\n\nThe detail that turns metal "
     "into a memory. Add your text above; final price depends on the piece — from $20.",
     "cat_gifts", 2000, 1, 1, 4, 30, 0, 1, {}),

    # ---- Keychains / Cards & Tags ------------------------------------------
    ("prd_anodized_card", "anodized-aluminum-wallet-card",
     "Anodized Aluminum Wallet Card",
     "Credit-card-sized anodized aluminum. Laser pops bright on color — wallet-ready.",
     "A slim, indestructible wallet card in anodized aluminum, the same size as a credit card. "
     "The laser strips the color anodize to a bright silver mark, so your text, art, or QR code "
     "reads sharp and stays forever. Huge range of colors in stock.\n\nEDC keepsakes, business "
     "cards that don’t bend, message cards that outlive the moment.",
     "cat_keychains", 1800, 1, 1, 2, 15, 0, 1, {}),

    # ---- Art & Home Decor ---------------------------------------------------
    ("prd_wood_sign", "custom-wood-sign",
     "Custom Wood Sign",
     "Small-batch wood signs, cut and engraved to your words. From $32.",
     "Custom signage and decor cut from quality plywood and solid wood stock we keep on hand. "
     "Names, addresses, bar signs, nursery decor, shop signs — you bring the words and the "
     "vibe, we design and engrave. Sizes and shapes to fit your space.\n\nMade to order, built "
     "to hang for years. Tell us what you’re picturing in the notes.",
     "cat_decor", 3200, 1, 1, 5, 250, 0, 1, {}),

    ("prd_vinyl_decal", "custom-vinyl-decal",
     "Custom Vinyl Decal",
     "Any design, up to 12×12″. Colors stocked — or we source your exact shade.",
     "Precision-cut vinyl decals for cars, laptops, windows, walls, tumblers, and gear — "
     "up to 12×12″. We stock a deep range of colors and finishes (matte, gloss, "
     "metallic) and can source any specific color or pattern you need. Send your art or "
     "describe it in the notes and we’ll handle the rest.\n\nWeatherproof, clean-lined, "
     "and stuck on right.",
     "cat_decor", 1200, 1, 1, 3, 30, 0, 1, {"engravable": False}),

    ("prd_iron_on", "custom-iron-on-transfer",
     "Custom Iron-On Transfer",
     "Press-ready iron-ons for tees, totes, and merch. Your art, your colors.",
     "Heat-press iron-on transfers for apparel and fabric — shirts, hoodies, totes, hats, "
     "team merch. Single pieces or small runs, in the colors you want. Send your design in the "
     "notes and we’ll cut and weed it ready to press (or press it for you).\n\nTurn a "
     "blank tee into your thing.",
     "cat_decor", 1000, 1, 1, 3, 20, 0, 1, {"engravable": False}),

    ("prd_wood_plant_marker", "wood-plant-markers",
     "Wood Plant Markers — Set of 6",
     "Six wood garden stakes, engraved with your herbs and veggies. Tidy beds, happy gardener.",
     "A set of six solid wood plant markers, laser-engraved with whatever you’re growing — "
     "herbs, veggies, flowers, seed starts. Clean and rustic, and a serious upgrade from a "
     "faded marker on a popsicle stick. List your plant names in the engraving box "
     "(comma-separated) or the order notes and I’ll cut one per marker.\n\nMade for raised beds, "
     "gifts for the gardener, and seed-starting season.",
     "cat_decor", 2200, 6, 1, 4, 120, 0, 1, {}),

    ("prd_alu_plant_marker", "aluminum-plant-markers",
     "Aluminum Plant Markers — Set of 6",
     "Six weatherproof aluminum garden stakes. Engraved deep — won’t fade in sun or rain.",
     "Six anodized aluminum plant markers built to live outside for years: rustproof, "
     "UV-proof, and engraved deep so the labels never wash out or fade. The modern, permanent "
     "answer to plant tags. List one plant name per marker in the engraving box or the order "
     "notes.\n\nFor the gardener who’s done re-labeling every spring.",
     "cat_decor", 3000, 6, 1, 4, 150, 0, 1, {}),

    ("prd_wood_diffuser", "scent-infused-wood-diffuser",
     "Scent-Infused Wood Diffuser — Coming Soon",
     "Non-oily, slow-release scented wood. Launching soon.",
     "A clean take on the reed diffuser: scent infused into natural wood — no oily mess, "
     "no spills, just a slow, even release. In development now.\n\nWant first dibs? Text me and "
     "I’ll put you on the list.",
     "cat_decor", 2400, 1, 1, 0, 150, 0, 0, {}),   # is_published = 0 (draft)
]

COLS = ("id, slug, name, description, short_description, category_id, audience, "
        "price_cents, pack_size, position, is_published, made_to_order, lead_time_days, "
        "weight_grams, hero_media_id, one_off, metadata, created_at, updated_at, deleted_at, sold_at")
PLACE = ", ".join(["?"] * 21)

def main():
    db = find_db()
    con = sqlite3.connect(db)
    try:
        # Retire the earlier demo rows (keep referential integrity with the test order)
        con.execute("UPDATE products SET deleted_at = ?, is_published = 0 WHERE id IN ('prod_demo_coaster','prod_demo_plaque')", (NOW,))
        for pos, p in enumerate(P, start=1):
            (pid, slug, name, short, desc, cat, price, pack, mto, lead, wt, one, pub, meta) = p
            con.execute(
                f"INSERT OR REPLACE INTO products ({COLS}) VALUES ({PLACE})",
                (pid, slug, name, desc, short, cat, "shop", price, pack, pos * 10, pub,
                 mto, lead, wt, None, one, json.dumps(meta), NOW, NOW, None, None),
            )
        con.commit()
        rows = con.execute(
            "SELECT c.slug, count(*) FROM products p JOIN categories c ON c.id=p.category_id "
            "WHERE p.deleted_at IS NULL AND p.is_published=1 GROUP BY c.slug ORDER BY c.position"
        ).fetchall()
        print(f"DB: {db}")
        print("Published products per category:")
        for slug, n in rows:
            print(f"  {slug}: {n}")
        total = con.execute("SELECT count(*) FROM products WHERE deleted_at IS NULL AND is_published=1").fetchone()[0]
        draft = con.execute("SELECT count(*) FROM products WHERE deleted_at IS NULL AND is_published=0").fetchone()[0]
        print(f"Total published: {total}  |  drafts (coming soon): {draft}")
    finally:
        con.close()

if __name__ == "__main__":
    main()

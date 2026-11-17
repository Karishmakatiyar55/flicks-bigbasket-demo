#!/usr/bin/env python3
"""Cut the product photos, banners and the Brand of the Day bubble out of the screen pieces.

The pieces in src/assets (home_b.jpg, brand_a.jpg ...) come from scripts/crop_screens.py.
This script cuts smaller pictures from them so rows, grids and the basket can use real photos.
Boxes are in 390-wide screen units (x0, y0, x1, y1). Run from the repo root:
    python3 scripts/cut_assets.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, "src", "assets")

CUTS = {
    # product photos (each includes the app's own + at its bottom-right corner)
    "p_truffle": ("home_b", 28, 75, 120, 178), "p_ferrero": ("home_b", 141, 75, 233, 178), "p_dryfruit": ("home_b", 254, 75, 345, 178),
    "p_paneer": ("home_c", 20, 189, 113, 292), "p_tomato": ("home_c", 133, 189, 226, 292), "p_yogurt": ("home_c", 246, 189, 338, 292),
    "p_bru1": ("brand_a", 20, 60, 139, 191), "p_bru2": ("brand_a", 159, 60, 278, 191),
    "p_rl1": ("brand_c", 20, 60, 139, 191), "p_rl2": ("brand_c", 159, 60, 278, 191),
    "p_lexp": ("pdp_a", 17, 65, 127, 192), "p_lindt": ("pdp_a", 135, 65, 245, 192),
    # banners used as the static cards between Flicks in swipeable rows
    "b_bru": ("brand_a", 13, 369, 377, 463), "b_redlabel": ("brand_b", 13, 238, 377, 453), "b_bedding": ("se_banner", 39, 10, 352, 172), "b_bod": ("brand_hero", 0, 58, 390, 220),
    # Brand of the Day bubble from the bottom bar
    "bod": ("home_foot", 323, 7, 373, 57),
}

def main():
    for name, (src, x0, y0, x1, y1) in CUTS.items():
        im = Image.open(os.path.join(A, src + ".jpg")).convert("RGB")
        k = im.width / 390
        im.crop((round(x0 * k), round(y0 * k), round(x1 * k), round(y1 * k))).save(os.path.join(A, name + ".jpg"), quality=84, optimize=True)
    print(f"cut {len(CUTS)} pictures into {A}")

if __name__ == "__main__":
    main()

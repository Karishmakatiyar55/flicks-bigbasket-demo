#!/usr/bin/env python3
"""Re-create the screen pieces in src/assets from a bigbasket screen recording.

Only needed if you change which part of a screen is used. The recording and its
frames are NOT kept in this repo.

1. Extract frames at 4 fps from the recording (1206x2622 iPhone capture):
       mkdir -p frames
       ffmpeg -i recording.mp4 -vf fps=4 -q:v 3 frames/h_%04d.jpg
2. Run (from the repo root):
       python3 scripts/crop_screens.py --frames frames --pdp pdp.jpg --search search.jpg
   where pdp.jpg / search.jpg are the 610x1356 product-page and search-page screenshots.

Frame numbers below refer to that 4 fps extraction. Scroll offsets between frames
were found by matching pixel strips (home 13->25: 1101 px, brand 41->59: 1443 px,
59->87: 832 px, categories 248->251: 1372 px).
"""
import argparse
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "assets")

# piece name: (frame number or screenshot key, y0, y1) in source pixels
PIECES = {
    "home_top": (13, 0, 150), "home_a": (13, 150, 730), "home_b": (13, 1800, 2370),
    "home_c": (25, 1269, 2370), "home_foot": (13, 2370, 2622), "home_mast": (13, 730, 1800),
    "brand_top": (59, 0, 330), "brand_hero": (41, 150, 830), "brand_a": (41, 830, 2560),
    "brand_b": (59, 1117, 2560), "brand_c": (87, 1728, 2560),
    "cat_top": (248, 0, 300), "cat_a": (248, 300, 2380), "cat_b": (251, 1008, 1130),
    "cat_c": (251, 1130, 2380), "cat_foot": (248, 2380, 2622),
    "sb_top": (266, 0, 300), "sb_a": (266, 300, 2380), "sb_foot": (266, 2380, 2622),
    "pdp_top": ("pdp", 0, 180), "pdp_a": ("pdp", 180, 795), "pdp_b": ("pdp", 795, 1210),
    "pdp_foot": ("pdp", 1210, 1356),
    "se_top": ("search", 0, 170), "se_a": ("search", 170, 482),
    "se_banner": ("search", 482, 790), "se_b": ("search", 790, 1356),
}


def clean_indicators(im):
    """Paint out the screen-recording indicators so the status bar reads as a plain phone.

    - iPhone capture: the red recording dot inside the Dynamic Island -> island black.
    - Android screenshots: the green camera/mic dot beside the battery -> bar background.
    Only searches the top status-bar rows; the green battery icon is left alone.
    """
    from PIL import ImageDraw
    import numpy as np
    a = np.asarray(im.convert("RGB")).astype(int)
    h, w = a.shape[:2]
    rows = min(h, 60) if w <= 640 else min(h, int(w * 0.14))
    r, g, b = a[:rows, :, 0], a[:rows, :, 1], a[:rows, :, 2]
    d = ImageDraw.Draw(im)
    targets = [((r > 170) & (g < 90) & (b < 90), None)]          # red dot -> sample left of it
    if w <= 640:                                                  # Android screenshot
        green = (g > 150) & (r < 120) & (b < 130)
        green[:, : int(w * 0.85)] = False                         # only the dot right of the icons
        targets.append((green, None))
    for mask, _ in targets:
        ys, xs = np.nonzero(mask)
        if not len(xs):
            continue
        x0, x1, y0, y1 = xs.min() - 6, xs.max() + 6, ys.min() - 6, ys.max() + 6
        sx = max(0, x0 - 4)
        fill = tuple(int(v) for v in a[(y0 + y1) // 2, sx])
        d.ellipse([x0, y0, x1, y1], fill=fill)
    return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", required=True)
    ap.add_argument("--pdp", required=True)
    ap.add_argument("--search", required=True)
    a = ap.parse_args()
    shots = {"pdp": a.pdp, "search": a.search}
    meta = {}
    for name, (src, y0, y1) in PIECES.items():
        path = shots[src] if isinstance(src, str) else os.path.join(a.frames, f"h_{src:04d}.jpg")
        im = Image.open(path)
        w = im.width
        piece = im.crop((0, y0, w, y1)).convert("RGB")
        if w > 780:
            piece = piece.resize((780, round((y1 - y0) * 780 / w)), Image.LANCZOS)
        if name.endswith("_top"):
            piece = clean_indicators(piece)
        piece.save(os.path.join(OUT, f"{name}.jpg"), quality=80, optimize=True)
        meta[name] = {"sw": w, "sh": y1 - y0}
    with open(os.path.join(ROOT, "src", "meta.json"), "w") as f:
        json.dump(meta, f)
    print(f"wrote {len(meta)} pieces to {OUT}")


if __name__ == "__main__":
    main()

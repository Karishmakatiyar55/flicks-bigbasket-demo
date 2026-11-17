#!/usr/bin/env python3
"""Build index.html: join the files in src/ into one self-contained page.

    src/template.html   page shell
    src/font.css        Figtree, embedded
    src/app.css         styles
    src/data.js         Flicks, catalogue, categories, searches
    src/app.js          the app
    src/assets/*.jpg    cuts from the bigbasket app, inlined as IMG[name] = [width, height, data URI]

Usage (from the repo root):
    python3 scripts/build.py
"""
import base64
import glob
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
# Pieces of the old guided tour that the app no longer shows.
SKIP = {"home_top", "home_b", "home_c", "home_foot", "cat_foot", "sb_foot", "se_banner"}


def read(name):
    with open(os.path.join(SRC, name), encoding="utf-8") as f:
        return f.read()


def data_uri(path, mime):
    with open(path, "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode()


def main():
    images = {}
    for path in sorted(glob.glob(os.path.join(SRC, "assets", "*.jpg"))):
        key = os.path.splitext(os.path.basename(path))[0]
        if key in SKIP:
            continue
        with Image.open(path) as im:
            images[key] = [im.width, im.height, data_uri(path, "image/jpeg")]
    data = (
        "const IMG = " + json.dumps(images) + ";\n"
        + "const FLAMLOGO = " + json.dumps(data_uri(os.path.join(SRC, "assets", "flam_logo.png"), "image/png")) + ";\n"
        + "const BBLOGO = " + json.dumps(data_uri(os.path.join(SRC, "assets", "bb_logo.png"), "image/png")) + ";\n"
        + read("data.js")
    )
    html = read("template.html")
    for mark, text in (("/*CSS*/", read("font.css") + read("app.css")), ("/*DATA*/", data), ("/*APP*/", read("app.js"))):
        if mark not in html:
            raise SystemExit(f"build failed: {mark} is missing from src/template.html")
        html = html.replace(mark, text)
    out = os.path.join(ROOT, "index.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"wrote {out} ({os.path.getsize(out) / 1e6:.2f} MB, {len(images)} pictures)")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Build index.html: inline every image from src/assets into src/template.html.

Usage (from the repo root):
    python3 scripts/build.py
"""
import base64
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")


def data_uri(path, mime):
    with open(path, "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode()


def main():
    with open(os.path.join(SRC, "template.html"), encoding="utf-8") as f:
        html = f.read()
    with open(os.path.join(SRC, "meta.json"), encoding="utf-8") as f:
        meta = json.load(f)

    images = {k: data_uri(os.path.join(SRC, "assets", f"{k}.jpg"), "image/jpeg") for k in meta}
    html = html.replace("%%IMAGES%%", json.dumps(images))
    html = html.replace("%%META%%", json.dumps(meta))
    html = html.replace("%%FLAMLOGO%%", data_uri(os.path.join(SRC, "assets", "flam_logo.png"), "image/png"))
    html = html.replace("%%BBLOGO%%", data_uri(os.path.join(SRC, "assets", "bb_logo.png"), "image/png"))
    if "%%" in html:
        raise SystemExit("build failed: a %%placeholder%% in src/template.html was not filled")

    out = os.path.join(ROOT, "index.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"wrote {out} ({os.path.getsize(out) / 1e6:.2f} MB)")


if __name__ == "__main__":
    main()

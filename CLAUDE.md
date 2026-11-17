# Working in this repo

## Always push every change

The owner wants every change in this repo pushed to GitHub automatically, without being asked. After any change to the demo, in the same turn:

1. Edit the source, not the build: the files in `src/` (`app.js`, `data.js`, `app.css`, `template.html`) or `src/assets/`.
2. Rebuild: `python3 scripts/build.py` (regenerates `index.html`). Never hand-edit `index.html`.
3. Commit with a short message describing the change, then `git push origin main`.
4. Confirm with `git ls-remote origin main` that the remote matches `git rev-parse HEAD`, and say so in one line. If the push fails, say so plainly and do not report the change as published.

Push straight to `main` (it serves the GitHub Pages link); no branches or PRs unless asked.

## Never commit

- The original screen recording or extracted frames (`*.mp4`, `*.mov`, `frames/`). The owner does not want the recording shown anywhere.

## Demo rules to keep (set 17 Nov 2026: build it like the noon and Instacart demos)

- It is a working replica of the bigbasket app with Flicks placed in it, not a guided tour. No explanatory text on the page (no "concept demo" notes, no Flicks badges, no step panel); notes live in the README only.
- Flicks come from the saved `flicks-ad-tags` codes, unchanged, and each one must match the category of the slot it sits in.
- No audio leaks: a Flick is silenced unless at least half of it is on screen; leaving a screen removes every Flick on it.
- Flicks saved as web embeds run as their ad tag (`https://flicks.flamapp.live/<id>/ad.js`), so the app can hide their button, follow their options and add them to the basket. Every Flick has an Add to basket.
- Swipeable banner rows start with two Flicks side by side, then a static banner, then more Flicks.
- Every category tile and home tab opens an aisle page; an aisle carries a Flick only where a saved one fits it.
- Swipeable banner rows open on a Flick and carry several Flicks between the app's own banners.
- No button inside a Flick where the app shows its own; never hide the option switcher (do not blanket-hide `[data-vertex-trigger]`).
- Prices in rupees that fit each item.
- The slots list (desktop panel and phone sheet) shows slot types only, never brand or Flick names.
- Desktop: thin Flam x bigbasket header, Flam dark style, slots list beside a framed phone. Phones (860 px and under): the app fills the screen; a rose "Ad slots" pill that blinks until opened once; dark Flam sheet with rose category bars and a close button.

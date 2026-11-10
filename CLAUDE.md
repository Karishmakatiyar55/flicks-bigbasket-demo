# Working in this repo

## Always push every change

The owner wants every change in this repo pushed to GitHub automatically, without being asked. After any change to the demo, in the same turn:

1. Edit the source, not the build: `src/template.html` (copy, steps, styles, Flicks IDs) or `src/assets/`.
2. Rebuild: `python3 scripts/build.py` (regenerates `index.html`). Never hand-edit `index.html`.
3. Commit with a short message describing the change, then `git push origin main`.
4. Confirm with `git ls-remote origin main` that the remote matches `git rev-parse HEAD`, and say so in one line. If the push fails, say so plainly and do not report the change as published.

Push straight to `main` (it serves the GitHub Pages link); no branches or PRs unless asked.

## Never commit

- The original screen recording or extracted frames (`*.mp4`, `*.mov`, `frames/`). The owner does not want the recording shown anywhere.

## Demo rules to keep

- Flicks auto-play: once scrolling or swiping settles (~220 ms), the Flick that is at least 60% on screen loads by itself, with no tap. Only one plays at a time.
- No audio leaks: the playing Flick's iframe is removed the moment it drops below 50% visible (vertical scroll or sideways swipe), on navigation, step change or a hidden tab.
- Every slot is a swipeable row of Flicks (see `SLOTS[*].flicks`), with a swipe hint, dots/counter and desktop arrows.
- Phones (< 760 px wide): the bigbasket app fills the screen, nothing else shown. Desktop: guided steps beside a framed phone.
- Flam branding: dark maroon/copper glow with grain, bold white Inter Tight headlines, cream pill chips, the Flam logo gradient (#EEF0B4 → #B5DFC6 → #F2F0FF) for highlights.

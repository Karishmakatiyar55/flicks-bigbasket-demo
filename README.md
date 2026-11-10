# Flicks × bigbasket — inventory demo

An interactive demo of where **Flicks** (Flam's swappable video format) can run inside the bigbasket app, made to pitch the idea to bigbasket's ad-tech partner.

Open `index.html` in a browser. It is one self-contained file; only the fonts and the Flicks players load from the web.

- **On a phone** (narrower than 760 px) it opens as the full-screen bigbasket app. Glowing rings and hints show what to tap next.
- **On desktop** the guided steps sit beside a framed phone. Use the step bar, the buttons or the ← → keys.

## The six placements

| # | Placement | Type | Flick |
|---|---|---|---|
| 1 | Home festive masthead ("powered by…") | Replace existing ad | Juice Flavor Swap |
| 2 | Brand of the Day → brand store hero | Replace existing ad | Beverage Can Swap |
| 3 | Product page, "Complete the gift" | New inventory | Necklace Swap (9:16) |
| 4 | Search landing banner | Replace existing ad | Lip Shade Swap |
| 5 | Categories, above Beauty & Personal Care | New inventory | Eyeshadow Makeup Swap |
| 6 | Order again / Smart Basket | New inventory | General Mills Cereal Swap |

## Audio rule

A Flick loads only when its slot is tapped. Scrolling, wheel or touch movement, going back, changing step or hiding the tab removes the player's iframe entirely, so no sound can carry over.

## Layout

```
index.html               built page (open this / serve with GitHub Pages)
src/template.html        page source: markup, styles, screens, steps, Flicks IDs
src/meta.json            source size of each screen piece
src/assets/              screen pieces cropped from the recording + Flam and bigbasket logos
scripts/build.py         inlines src/assets into src/template.html -> index.html
scripts/crop_screens.py  re-crops the screen pieces from a recording (not stored here)
```

To change copy, steps or Flicks IDs, edit `src/template.html`, then run:

```
python3 scripts/build.py
```

## Notes

- The Flicks players load from `flicks.flamapp.live`. If they don't appear when the file is opened directly, serve it over https (for example GitHub Pages) in case the embeds are limited to approved sites.
- Headlines use Inter Tight as a stand-in for Flam's brand typeface.
- Screens are captured from the bigbasket app for pitch purposes only.

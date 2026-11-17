# Flicks on bigbasket: concept demo

A clickable concept of Flam Flicks (interactive video ads) placed inside the bigbasket app, built the same way as the noon and Instacart demos.

Open `index.html` in Chrome or Safari, or host the single file anywhere static (GitHub Pages). On a laptop it shows the app in a phone frame with the list of ad slots beside it, in Flam's style. On a phone the app fills the screen and the blinking "Ad slots" button opens the list.

## Screens

Home, Categories, Smart Basket (Order again), search and search results, category pages, the Brand of the Day store, the product page from the recording, product pages for the Flick products, Watch and shop, and the basket. The + buttons work everywhere, including the ones inside the app pictures, and everything added lands in one basket.

## Ad slots (19 entries in the on-page list, grouped by slot type, no brand names)

| Slot type | Where | Flick |
|---|---|---|
| Swipeable banners | Home banner carousel: two Flicks, a banner, two Flicks, a banner | Doritos, Ben & Jerry's, Coca-Cola, Sony |
| Swipeable banners | Search banner carousel: two Flicks, a banner, a Flick, a banner | Ulta Beauty lipstick, e.l.f. eyeshadow, M&M's |
| Sponsored products in rows | Home: Shop festive essentials | M&M's |
| Sponsored products in rows | Home: Order again | General Mills |
| Sponsored products in rows | Product page: Complete the gift | M&M's |
| Sponsored products in rows | Basket: Before you checkout | Doritos, M&M's |
| Brand shelves | Home | Ben & Jerry's |
| Brand shelves | Smart Basket | General Mills |
| Shoppable video | Home: Watch and shop row | DY necklace, Doritos, Ben & Jerry's |
| Shoppable video | Watch and shop page | nine Flicks |
| Search | Brand ad at top of results (`chips`, `cereal`, `ice cream`, `headphones`, `juice`, `cola`, `lipstick`, `lego`) | by search |
| Search | Sponsored product inside results (`chocolate`) | M&M's |
| Category, brand and product pages | Categories: aisle banners above Snacks & Drinks and Beauty & Personal Care | Doritos, e.l.f. |
| Category, brand and product pages | Category pages: one or two banners where a saved Flick fits the aisle | see `CATS` in `src/data.js` |
| Category, brand and product pages | Brand of the Day store | Coca-Cola |
| Category, brand and product pages | Product page video | any Flick product |
| Display cards in the feed | Home | Tropicana |

Every tile on the Categories screen, every home tab and every masthead tile opens an aisle page. An aisle gets a Flick only where a saved Flick fits it (for example Tropicana and Coca-Cola in beverages, LEGO in toys, the lipstick and eyeshadow in beauty); aisles with no fitting Flick (meat, atta, oil, hair care and so on) show products only.

## How it behaves

- Every Flick runs as its ad tag in its own frame. All of them are in the `BRANDS` block in `src/data.js`.
- Five Flicks (Tropicana, Coca-Cola, Ulta lipstick, e.l.f. eyeshadow, DY necklace) are saved as web embeds. The embed is a frame around the same Flick's ad tag at `https://flicks.flamapp.live/<id>/ad.js`, so the page runs that tag directly; that is what lets the app hide the Flick's own button, follow its options and control its sound.
- Picking an option in a video updates the name, price, pack size, dots and the + button around it; the app's product tiles switch the video back.
- The app shows its own Add to basket button for each Flick, so the button inside the Flick is hidden. The option switcher and sound button are left alone.
- Sound: a Flick can only be heard while at least half of it is on screen; scrolling it away, swiping its row, switching tab or leaving the screen silences it. Leaving a screen removes all of its Flicks.
- Loading: Flicks start before they scroll into view (within about one screen), the nearest four (phones) or six (desktop) are kept running, and the tags are fetched in the background after the page opens.
- A Flick that fails to load says so and offers Retry.
- Browser Back steps back inside the app.

## Notes (kept here only; the page itself carries no notes)

Concept demo built by Flam for partner conversations. Not affiliated with or endorsed by bigbasket or the brands shown.

- The app content around the ads (header, festive masthead, category grids, product photos, the Brand of the Day store, Smart Basket, search page) is cut from a screen recording of the bigbasket app and embedded in the file. Names, prices and offers are as shown in the recording. Those pictures belong to bigbasket and the brands in them.
- The Flick products have no still photo: the Flick is their picture. Their rupee prices and pack sizes are illustrative.
- M&M's, lipstick, eyeshadow and necklace options are shown as "1 of 3" because their names were not available. Tropicana and Coca-Cola option names were read from the Flicks' own thumbnails.
- The bottom bar and status bar are redrawn; the Brand of the Day bubble is cut from the recording.

## Editing

```
index.html               built page (open this / serve with GitHub Pages)
src/template.html        page shell
src/app.css              styles
src/data.js              Flicks, catalogue, categories, searches
src/app.js               the app: screens, basket, Flick frames, sound rule, slots list
src/font.css             Figtree, embedded
src/assets/              cuts from the recording + Flam and bigbasket logos
scripts/build.py         joins src/ into index.html
scripts/cut_assets.py    cuts product photos and banners out of the screen pieces
scripts/crop_screens.py  re-crops the screen pieces from a recording (not stored here)
```

After a change in `src/`, run `python3 scripts/build.py`.

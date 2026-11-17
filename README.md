# Flicks on bigbasket: concept demo

A clickable concept of Flam Flicks (interactive video ads) placed inside the bigbasket app, built the same way as the noon and Instacart demos.

Open `index.html` in Chrome or Safari, or host the single file anywhere static (GitHub Pages). On a laptop it shows the app in a phone frame with the list of ad slots beside it, in Flam's style. On a phone the app fills the screen and the blinking "Ad slots" button opens the list.

## Screens

Home, Categories, Smart Basket (Order again), search and search results, category pages, the Brand of the Day store, the product page from the recording, product pages for the Flick products, Watch and shop, and the basket. The + buttons work everywhere, including the ones inside the app pictures, and everything added lands in one basket.

## Ad slots (18 entries in the on-page list, grouped by slot type, no brand names)

| Slot type | Where | Flick |
|---|---|---|
| Swipeable banners | Home banner carousel, three Flicks between the app's own banners, a Flick first | Doritos, Ben & Jerry's, Sony |
| Swipeable banners | Search banner carousel | LipShade swap, Beverage Can Swap |
| Sponsored products in rows | Home: Shop festive essentials | M&M's |
| Sponsored products in rows | Home: Order again | General Mills |
| Sponsored products in rows | Product page: Complete the gift | M&M's |
| Sponsored products in rows | Basket: Before you checkout | Doritos, M&M's |
| Brand shelves | Home | Ben & Jerry's |
| Brand shelves | Smart Basket | General Mills |
| Shoppable video | Home: Watch and shop row | Necklace Swap, Doritos, Ben & Jerry's |
| Shoppable video | Watch and shop page | Doritos, Ben & Jerry's, General Mills, M&M's, Sony |
| Search | Brand ad at top of results (`chips`, `cereal`, `ice cream`, `headphones`) | Doritos, General Mills, Ben & Jerry's, Sony |
| Search | Sponsored product inside results (`chocolate`) | M&M's |
| Category, brand and product pages | Categories: aisle banners above Snacks & Drinks and Beauty & Personal Care | Doritos, Eyeshadow Makeup Swap |
| Category, brand and product pages | Category page banner | by category: M&M's, Juice Flavor Swap, Doritos, Ben & Jerry's, General Mills, LipShade swap, Sony |
| Category, brand and product pages | Brand of the Day store hero | Beverage Can Swap |
| Category, brand and product pages | Product page video | any Flick product |
| Display cards in the feed | Home | Juice Flavor Swap |

Each Flick sits in a slot of its own category (chips in snacks and the `chips` search, ice cream in frozen, cereal in breakfast and reorder, chocolate in gifting, beauty in the beauty aisle, drinks in beverages).

## How it behaves

- Every Flick is Flam's saved tag or embed code, unchanged, in its own frame. All of them are in the `BRANDS` block in `src/data.js`.
- Two kinds of Flick are used. Ad tags (Doritos, Ben & Jerry's, General Mills, M&M's, Sony): picking an option in the video updates the name, price, pack size, dots and the + button around it, and the app's product tiles switch the video back. Web embeds (the juice, can, lip shade, eyeshadow and necklace swaps): shown as they are, with the app's own headline and button.
- The app shows its own button for each ad-tag Flick, so the button inside the Flick is hidden. The option switcher and sound button are left alone.
- Sound: an ad-tag Flick can only be heard while at least half of it is on screen; scrolling it away, swiping its row, switching tab or leaving the screen silences it. A web-embed Flick runs only while at least half of it is on screen and is removed the moment it is not. Leaving a screen removes all of its Flicks.
- At most four ad-tag Flicks are kept running at once (those nearest the screen).
- A Flick that fails to load says so and offers Retry.
- Browser Back steps back inside the app.

## Notes (kept here only; the page itself carries no notes)

Concept demo built by Flam for partner conversations. Not affiliated with or endorsed by bigbasket or the brands shown.

- The app content around the ads (header, festive masthead, category grids, product photos, the Brand of the Day store, Smart Basket, search page) is cut from a screen recording of the bigbasket app and embedded in the file. Names, prices and offers are as shown in the recording. Those pictures belong to bigbasket and the brands in them.
- The Flick products (Doritos, Ben & Jerry's, General Mills, M&M's, Sony) have no still photo: the Flick is their picture. Their rupee prices and pack sizes are illustrative.
- M&M's options are shown as "1 of 3" because their names were not available.
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

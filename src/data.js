/* =====================================================================
   FLICKS: every creative used in the demo, one record each.
   Every Flick runs as its ad tag (ad.js), so the app can follow the option picked in the video.
   variants follow each Flick's own order. named:false = option names are
   not known here, so the UI shows "1 of 3" instead of a name.
   ===================================================================== */
const T1 = "https://native-ads-dev.appless.workers.dev/", T2 = "https://flicks.flamapp.live/";
const BRANDS = {
  dor:{ name:"Doritos", av:"D", avc:"#d12a1e", src:T1+"6a96c6969e74536944c4167f_vqdcng/ad.js", unit:"Flavour", named:true, retail:true, cat:"snacks",
    head:"Pick your crunch", prod:"Doritos Tortilla Chips", pack:"262 g", r:4.4, eta:"5 mins",
    desc:"Bold, crunchy tortilla chips in a sharing bag. Imported.",
    variants:[{n:"Cool Ranch",c:"#1f6fd1",p:449,was:499},{n:"Nacho Cheese",c:"#d12a1e",p:449,was:499},{n:"Spicy Sweet Chili",c:"#7b2a8c",p:449,was:499}] },
  bj:{ name:"Ben & Jerry's", av:"B&J", avc:"#2a6fb7", src:T1+"6a96c6969e74536944c4167f_z1fp1a/ad.js", unit:"Flavour", named:true, retail:true, cat:"icecream",
    head:"Which tub tonight?", prod:"Ben & Jerry's Ice Cream", pack:"473 ml", r:4.6, eta:"5 mins",
    desc:"Ice cream with big chunks and swirls, made with Fairtrade ingredients. Imported.",
    variants:[{n:"Cherry Garcia",c:"#c2325b",p:675,was:750},{n:"Razz Up!",c:"#d6497f",p:675,was:750},{n:"Chunky Monkey",c:"#e2b93b",p:675,was:750}] },
  gm:{ name:"General Mills", av:"GM", avc:"#1f4aa8", src:T1+"kbf8k6/ad.js", dsp:"dv360", unit:"Cereal", named:true, retail:true, cat:"cereals",
    head:"Breakfast, three ways", prod:"General Mills", r:4.5, eta:"5 mins",
    desc:"A family favourite for breakfast or a snack, any time of day. Imported.",
    variants:[{n:"Lucky Charms Cereal",pack:"297 g",short:"Lucky Charms",c:"#d8343f",p:749,was:849},{n:"Honey Nut Cheerios Cereal",pack:"306 g",short:"Honey Nut Cheerios",c:"#f2b632",p:699,was:799},{n:"Cinnamon Toast Crunch Cereal",pack:"340 g",short:"Cinnamon Toast Crunch",c:"#b8742f",p:749,was:849}] },
  mms:{ name:"M&M's", av:"m&m", avc:"#6b3f1d", src:T1+"6a8e82a03252dba34b484fa9_xvaz4d/ad.js", unit:"Pack", named:false, retail:true, cat:"gifts",
    head:"A sweeter festive gift", prod:"M&M's Chocolate Candies", pack:"100 g", r:4.5, eta:"5 mins",
    desc:"Colourful candy-coated chocolates to share or gift.",
    variants:[{n:"Pack 1",c:"#d8232a",p:165,was:180},{n:"Pack 2",c:"#f2b632",p:165,was:180},{n:"Pack 3",c:"#2f8f3c",p:165,was:180}] },
  sony:{ name:"Sony", av:"SONY", avc:"#111", src:T1+"6a96c6969e74536944c4167f_dj5rq6/ad.js", unit:"Colour", named:true, retail:true, cat:"electronics",
    head:"All-day noise cancelling", prod:"Sony WH-CH720N Wireless Noise Cancelling Headphones", pack:"1 pc", r:4.4, eta:"10 mins", comma:true,
    desc:"Lightweight over-ear headphones with dual noise sensor technology and up to 35 hours of battery.",
    variants:[{n:"Black",c:"#1d1d1f",p:7990,was:14990},{n:"White",c:"#ecebe8",p:7990,was:14990},{n:"Blue",c:"#3c5a8a",p:8490,was:14990}] },
  /* The five below are saved as web embeds (embed.js + <flam-embed id>). The embed is a frame around the same Flick's own ad tag,
     https://flicks.flamapp.live/<id>/ad.js, so the tag is run directly: the app can then hide the Flick's button, follow its options and control sound. */
  juice:{ name:"Tropicana", av:"T", avc:"#1f8f3a", src:T2+"tyon6l/ad.js", unit:"Juice", named:true, retail:true, cat:"beverages",
    head:"Fresh juice, pick your flavour", prod:"Tropicana", pack:"1 L", r:4.4, eta:"5 mins",
    desc:"Chilled fruit juices and lemonades, ready to pour. Imported.",
    variants:[{n:"Classic Lemonade",c:"#efe6a0",p:249,was:275},{n:"Refreshers Strawberry Limeade",short:"Strawberry Limeade",c:"#ee8f86",p:249,was:275},{n:"Pure Premium Lots of Pulp Orange Juice",short:"Orange, Lots of Pulp",c:"#f5a31c",p:299,was:325}] },
  can:{ name:"Coca-Cola", av:"Coke", avc:"#e1001a", src:T2+"n0489i/ad.js", unit:"Flavour", named:true, retail:true, cat:"beverages",
    head:"Zero Sugar, three ways", prod:"Coca-Cola Zero Sugar", pack:"330 ml Can", r:4.5, eta:"5 mins",
    desc:"The taste of Coca-Cola with zero sugar, in a chilled can.",
    variants:[{n:"Original",c:"#e1001a",p:40,was:null},{n:"Cherry",c:"#b0124f",p:95,was:110},{n:"Vanilla",c:"#f08a1c",p:95,was:110}] },
  lip:{ name:"Ulta Beauty", av:"ULTA", avc:"#e8601c", src:T2+"onflg2/ad.js", unit:"Shade", named:false, retail:true, cat:"beauty",
    head:"Let your lips do the talking", prod:"Matte Lipstick", pack:"3 g", r:4.5, eta:"10 mins",
    desc:"A creamy matte lipstick with full colour in one swipe.",
    variants:[{n:"Shade 1",c:"#d83a5c",p:1950,was:null},{n:"Shade 2",c:"#8c5148",p:1950,was:null},{n:"Shade 3",c:"#d99a86",p:1950,was:null}] },
  eye:{ name:"e.l.f.", av:"e.l.f.", avc:"#111", src:T2+"it6hi9/ad.js", unit:"Look", named:false, retail:true, cat:"beauty",
    head:"Mix and match your eye look", prod:"e.l.f. Eyeshadow Palette", pack:"1 pc", r:4.4, eta:"10 mins",
    desc:"Blendable eyeshadow shades for everyday and festive looks.",
    variants:[{n:"Look 1",c:"#c98f6b",p:899,was:999},{n:"Look 2",c:"#cfc3c0",p:899,was:999},{n:"Look 3",c:"#8a9a3a",p:899,was:999}] },
  neck:{ name:"DY", av:"DY", avc:"#111", src:T2+"ikutv6/ad.js", tall:true, unit:"Style", named:false, retail:true, cat:"jewellery",
    head:"Festive ready", prod:"Gold-Tone Pendant Necklace", pack:"1 pc", r:4.6, eta:"",
    desc:"A pendant necklace on a fine chain, in three styles.",
    variants:[{n:"Style 1",c:"#d4a95a",p:4999,was:6249},{n:"Style 2",c:"#c9c9c9",p:4999,was:6249},{n:"Style 3",c:"#e0b8a0",p:4999,was:6249}] },
  lego:{ name:"LEGO", av:"LEGO", avc:"#e3000b", src:T1+"6a96c6969e74536944c4167f_u008vu/ad.js", unit:"Set", named:true, retail:true, cat:"toys",
    head:"Build your grid", prod:"LEGO Speed Champions", pack:"1 set", r:4.8, eta:"10 mins",
    desc:"Collectible F1 race car building set for ages 10 and up, with driver minifigure.",
    variants:[{n:"Ferrari SF-24 F1 Race Car",short:"Ferrari SF-24",c:"#d8232a",p:2599,was:2999},{n:"McLaren F1 Team MCL38 Race Car",short:"McLaren MCL38",c:"#f58220",p:2599,was:2999},{n:"Mercedes-AMG F1 W15 Race Car",short:"Mercedes W15",c:"#8fa3a8",p:2599,was:2999}] }
};

/* ============ catalogue: listings as they appear in the bigbasket app recording ============ */
const P = {};
const prod = (id,br,n,p,was,pack,o={}) => { P[id] = Object.assign({id, br, n, p, was, pack, img:"p_"+id}, o); };
prod("truffle","LINDBERG","Truffle Treats Gift Box - Assorted Chocolates",299,459,"162 g - (14 pcs)",{pdp:1});
prod("ferrero","FERRERO ROCHER","Chocolate Gift Pack",721,879,"300 g - (24 pcs)");
prod("dryfruit","BB ROYAL ORGANIC","Premium Dry Fruit Collection",699,1199,"450 g");
prod("paneer","MILKY MIST","High Protein Low Fat Paneer",115,165,"200 g");
prod("tomato","FRESHO!","Local Tomato",29,52.5,"1 kg");
prod("yogurt","EPIGAMIA","Everyday Yogurt",22,25,"");
prod("bru1","BRU","Southern Trails Instant Coffee Blend",157.5,175,"50 g - Pouch");
prod("bru2","BRU","Gold Edition Rich Flavour Freeze Dried Coffee",99,null,"22.5 g - (15 Sachets)");
prod("rl1","RED LABEL","Natural Care Tea",493,660,"");
prod("rl2","RED LABEL","Tea",482,580,"");
prod("lexp","LINDBERG","Expressions Gift Box - Assorted Chocolates",299,499,"180 g - (16 pcs)");
prod("lindt","LINDT","Lindor Milk Chocolate Gift Box",346,475,"75 g");
// The Flick products: one listing per option of each retail Flick. They have no photo: the Flick is their picture.
const vshort = (k,i) => BRANDS[k].variants[i].short || BRANDS[k].variants[i].n;
function vname(k,i){ const b = BRANDS[k], v = b.variants[i]; return b.comma ? `${b.prod}, ${v.n}` : b.named ? `${b.prod} ${v.n}`.replace(/^General Mills /,"") : b.prod; }
const vpack = (k,i) => BRANDS[k].variants[i].pack || BRANDS[k].pack || "";
Object.keys(BRANDS).forEach(k=>{ const b = BRANDS[k]; if(!b.retail) return;
  b.variants.forEach((v,i)=>{ P[`${k}-${i}`] = {id:`${k}-${i}`, brand:k, vi:i, br:b.name.toUpperCase(), n:b.named ? vname(k,i) : `${b.prod} (${v.n.toLowerCase()})`, p:v.p, was:v.was, pack:vpack(k,i), c:v.c}; }); });

const AGAIN = ["paneer","tomato","yogurt"];
// Every tile on the Categories screen, every home tab and every masthead tile opens one of these.
// ads: the Flicks that belong in that aisle (none where no saved Flick fits). ids: listings with real photos.
const CATS = {
  fresh:{name:"Fresh", ads:["juice"], ids:["tomato","paneer","yogurt"]},
  fruits:{name:"Fruits & Veggies", ads:["juice"], ids:["tomato"]},
  bakery:{name:"Bakery & Batters", ads:[], ids:[]},
  dairy:{name:"Dairy", ads:["bj"], ids:["paneer","yogurt"]},
  meat:{name:"Eggs, Meat & Fish", ads:[], ids:[]},
  atta:{name:"Atta, Rice, Dal & More", ads:[], ids:[]},
  oil:{name:"Oil, Ghee & Masala", ads:[], ids:[]},
  cereals:{name:"Dry Fruits & Cereals", ads:["gm"], ids:["dryfruit"]},
  kitchen:{name:"Kitchen Must-Haves", ads:[], ids:[]},
  beverages:{name:"Hot & Cold Beverages", ads:["juice","can"], ids:["bru1","bru2","rl1","rl2"]},
  snacks:{name:"Namkeen & Chips", ads:["dor"], ids:[]},
  biscuits:{name:"Biscuits & Cookies", ads:["mms"], ids:[]},
  frozen:{name:"Instant & Frozen Food", ads:["bj"], ids:[]},
  gifts:{name:"Sweets & Chocolates", ads:["mms"], ids:["truffle","ferrero","lexp","lindt","dryfruit"]},
  icecream:{name:"Ice Creams & More", ads:["bj"], ids:["yogurt"]},
  sauces:{name:"Sauces & Spreads", ads:[], ids:[]},
  gourmet:{name:"Gourmet & World Food", ads:["gm","dor"], ids:["lindt","ferrero"]},
  bath:{name:"Bath, Body & Oral Care", ads:[], ids:[]},
  hair:{name:"Hair Care", ads:[], ids:[]},
  beauty:{name:"Beauty & Cosmetics", ads:["lip","eye"], ids:[]},
  mens:{name:"Men's Grooming", ads:[], ids:[]},
  hygiene:{name:"Feminine Hygiene", ads:[], ids:[]},
  wellness:{name:"Sexual Wellness", ads:[], ids:[]},
  pharmacy:{name:"Health & Pharmacy", ads:[], ids:[]},
  baby:{name:"Baby Care", ads:[], ids:[]},
  electronics:{name:"Electronics", ads:["sony"], ids:[]},
  appliances:{name:"Home Appliances", ads:[], ids:[]},
  homeneeds:{name:"Home Needs", ads:[], ids:[]},
  toys:{name:"Toys & Sports", ads:["lego"], ids:[]},
  jewellery:{name:"Jewellery Collection", ads:["neck"], ids:[]},
  pooja:{name:"Pooja Essentials", ads:[], ids:["dryfruit"]},
  cooking:{name:"Festive Cooking", ads:[], ids:["paneer","tomato"]},
  winter:{name:"Winter", ads:[], ids:["bru1","bru2","rl1","rl2","lindt"]}
};
const SEARCH = {
  chips:{ad:"dor", ids:[]}, cereal:{ad:"gm", ids:["dryfruit"]}, "ice cream":{ad:"bj", ids:["yogurt"]},
  chocolate:{inline:"mms", ids:["truffle","ferrero","lexp","lindt"]}, coffee:{ids:["bru1","bru2"]}, tea:{ids:["rl1","rl2"]},
  headphones:{ad:"sony", ids:[]}, juice:{ad:"juice", ids:[]}, cola:{ad:"can", ids:[]}, lipstick:{ad:"lip", ids:[]}, lego:{ad:"lego", ids:[]}
};
const ALIAS = {doritos:"chips", nachos:"chips", cereals:"cereal", breakfast:"cereal", icecream:"ice cream", "ben":"ice cream", chocolates:"chocolate", gift:"chocolate", bru:"coffee", "red label":"tea", sony:"headphones", headphone:"headphones", tropicana:"juice", lemonade:"juice", coke:"cola", "coca":"cola", "soft drink":"cola", makeup:"lipstick", lips:"lipstick", toys:"lego", toy:"lego"};

/* =====================================================================
   FLICKS: every creative used in the demo, one record each.
   Tags and embed codes are Flam's saved ones, unchanged. Two kinds:
     src   = an ad tag (ad.js). The page can follow the option picked in the video.
     embed = a web embed (embed.js + <flam-embed>). Shown as it is.
   variants follow each Flick's own order. named:false = option names are
   not known here, so the UI shows "1 of 3" instead of a name.
   ===================================================================== */
const T1 = "https://native-ads-dev.appless.workers.dev/";
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
  juice:{ name:"Juice Flavor Swap", embed:"tyon6l", ar:[1080,1080], head:"Fresh juice, pick your flavour", cat:"beverages" },
  can:{ name:"Beverage Can Swap", embed:"n0489i", ar:[1080,1080], head:"One sip, every flavour", cat:"beverages" },
  lip:{ name:"LipShade swap", embed:"onflg2", ar:[1080,1080], head:"One look, every shade", cat:"beauty" },
  eye:{ name:"Eyeshadow Makeup Swap", embed:"it6hi9", ar:[1080,1080], head:"Festive eyes, three looks", cat:"beauty" },
  neck:{ name:"Necklace Swap", embed:"ikutv6", ar:[1080,1920], tall:true, dark:true, head:"Festive ready", cat:"" }
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
const CATS = {
  gifts:{name:"Chocolates & Gifting", ad:"mms", ids:["truffle","ferrero","lexp","lindt","dryfruit"]},
  beverages:{name:"Hot & Cold Beverages", ad:"juice", ids:["bru1","bru2","rl1","rl2"]},
  snacks:{name:"Namkeen & Chips", ad:"dor", ids:[]},
  icecream:{name:"Ice Creams & More", ad:"bj", ids:["yogurt"]},
  cereals:{name:"Dry Fruits & Cereals", ad:"gm", ids:["dryfruit"]},
  beauty:{name:"Beauty & Cosmetics", ad:"lip", ids:[]},
  electronics:{name:"Electronics", ad:"sony", ids:[]}
};
const SEARCH = {
  chips:{ad:"dor", ids:[]}, cereal:{ad:"gm", ids:["dryfruit"]}, "ice cream":{ad:"bj", ids:["yogurt"]},
  chocolate:{inline:"mms", ids:["truffle","ferrero","lexp","lindt"]}, coffee:{ids:["bru1","bru2"]}, tea:{ids:["rl1","rl2"]},
  headphones:{ad:"sony", ids:[]}
};
const ALIAS = {doritos:"chips", nachos:"chips", cereals:"cereal", breakfast:"cereal", icecream:"ice cream", "ben":"ice cream", chocolates:"chocolate", gift:"chocolate", bru:"coffee", "red label":"tea", sony:"headphones", headphone:"headphones"};

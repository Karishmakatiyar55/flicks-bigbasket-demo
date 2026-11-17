/* ================= helpers ================= */
const $ = (s,r=document) => r.querySelector(s), $$ = (s,r=document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const num = n => Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2);
const priceHTML = (p,was) => `₹${num(p)}${was?` <s>₹${num(was)}</s>`:""}`;
const offHTML = (p,was) => was ? `<span class="off">${Math.round((1-p/was)*100)}% OFF</span>` : "";
const sv = (d,w=20) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  search:sv('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.500-3.500"/>'), right:sv('<path d="M9 6l6 6-6 6"/>',16), back:sv('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  home:sv('<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',22), grid:sv('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 4v16M4 12h16"/>',22),
  again:sv('<path d="M4 9a8 5 0 0 1 14-2M20 15a8 5 0 0 1-14 2"/><path d="M18 3v4h-4M6 21v-4h4"/>',22), basket:sv('<path d="M5 10h14l-1.500 9h-11zM9 10l3-6 3 6"/>',20),
  plus:sv('<path d="M12 5v14M5 12h14"/>',16), minus:sv('<path d="M5 12h14"/>',16), x:sv('<path d="M6 6l12 12M18 6L6 18"/>',16), share:sv('<path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6"/>'),
  bolt:`<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>`,
  play:`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`
};
const APP = $("#app"), VIEW = $("#view"), OVER = $("#over");
const av = k => `<i class="av" style="background:${BRANDS[k].avc}">${esc(BRANDS[k].av)}</i>`;
const dots = (id,n=3) => `<span class="dots" data-sd="${id}">${Array.from({length:n},(_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</span>`;
function toast(t){ const el=$("#toast"); el.textContent=t; el.classList.add("on"); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove("on"),2300); }
const out = what => toast(`${what} is outside this demo`);

/* ================= basket ================= */
const CART = {};
const qty = pid => CART[pid]||0, cartCount = () => Object.values(CART).reduce((a,b)=>a+b,0);
const cartTotal = () => Math.round(Object.keys(CART).reduce((a,id)=>a+P[id].p*CART[id],0)*100)/100;
const addc = (pid,attr="") => `<div class="addc" data-add="${pid}" ${attr} onclick="event.stopPropagation()"></div>`;
function refreshAdds(){
  $$("[data-add]").forEach(el=>{ const pid=el.dataset.add, q=qty(pid); el.classList.toggle("has", !!q);
    el.innerHTML = q ? `<button aria-label="Remove one" onclick="addToCart('${pid}',-1)">${I.minus}</button><span class="q">${q}</span><button aria-label="Add one" onclick="addToCart('${pid}',1)">${I.plus}</button>`
                     : `<button aria-label="Add to basket" onclick="addToCart('${pid}',1)">${I.plus}</button>`; });
  // the app's own + buttons inside the cuts: invisible until something is added, then the app's green stepper sits on top
  $$("[data-padd]").forEach(el=>{ const pid=el.dataset.padd, q=qty(pid);
    el.innerHTML = q ? `<div class="pst" onclick="event.stopPropagation()"><button aria-label="Remove one" onclick="addToCart('${pid}',-1)">${I.minus}</button><span>${q}</span><button aria-label="Add one" onclick="addToCart('${pid}',1)">${I.plus}</button></div>`
                     : `<button aria-label="Add to basket" onclick="event.stopPropagation();addToCart('${pid}',1)"></button>`; });
  const n = cartCount(); APP.classList.toggle("hascart", !!n);
  $$("[data-bbar]").forEach(el=>{ el.classList.toggle("on", !!n); el.innerHTML = `<span><b>${n} item${n>1?"s":""}</b> · ₹${num(cartTotal())}</span><b>View Basket ›</b>`; });
}
function addToCart(pid,n=1,quiet){ if(!P[pid]) return;
  CART[pid]=Math.max(0,qty(pid)+n); if(!CART[pid]) delete CART[pid];
  refreshAdds(); $$(`[data-add="${pid}"],[data-padd="${pid}"]`).forEach(e=>{e.classList.remove("bump");void e.offsetWidth;e.classList.add("bump")});
  if(n>0 && !quiet) toast(`Added: ${P[pid].n.slice(0,44)}${P[pid].n.length>44?"...":""}`);
  const cl = $("#cartlist"); if(cl){ cl.innerHTML = cartList(); refreshAdds(); }
}

/* ================= Flick embed ================= */
function tagDoc(slotId, b){
  // The bridge runs before the Flick. It reports render status, option switches and click-throughs
  // to this page, and gives the page a mute switch so sound can never keep playing off screen.
  const bridge = `(function(){var av=function(s){return /av01|av1/i.test(String(s||''))};try{if(window.VideoDecoder&&VideoDecoder.isConfigSupported){var o=VideoDecoder.isConfigSupported.bind(VideoDecoder);VideoDecoder.isConfigSupported=function(q){return q&&av(q.codec)?Promise.resolve({supported:false,config:q}):o(q)}}}catch(e){}try{var mc=navigator.mediaCapabilities;if(mc&&mc.decodingInfo){var od=mc.decodingInfo.bind(mc);mc.decodingInfo=function(q){return q&&q.video&&av(q.video.contentType)?Promise.resolve({supported:false,smooth:false,powerEfficient:false}):od(q)}}}catch(e){}})();
(function(){var S=${JSON.stringify(slotId)},RD=0;function t(m){m.flam=1;m.slot=S;try{parent.postMessage(m,"*")}catch(e){}}
function deep(root,sel,out){try{var a=root.querySelectorAll(sel);for(var i=0;i<a.length;i++)out.push(a[i]);var all=root.querySelectorAll("*");for(var j=0;j<all.length;j++)if(all[j].shadowRoot)deep(all[j].shadowRoot,sel,out)}catch(e){}return out}
/* ---- sound guard: starts silenced; the host page un-silences only the Flick that is on screen ---- */
var M=true,E=[],G=[];
function reg(el){if(E.indexOf(el)<0){E.push(el);el.addEventListener("volumechange",function(){if(M&&!el.muted){el.__fm=1;el.muted=true}})}}
function apply(){var m=deep(document,"video,audio",[]);for(var q=0;q<m.length;q++)reg(m[q]);for(var i=0;i<E.length;i++){var el=E[i];if(M){if(!el.muted){el.__fm=1;el.muted=true}}else if(el.__fm){el.__fm=0;el.muted=false}}for(var k=0;k<G.length;k++){try{G[k].gain.value=M?0:1}catch(e){}}}
try{var op=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){reg(this);if(M&&!this.muted){this.__fm=1;this.muted=true}return op.apply(this,arguments)}}catch(e){}
try{if(window.AudioNode){var oc=AudioNode.prototype.connect,odc=AudioNode.prototype.disconnect;
var gf=function(ctx){if(!ctx.__fg){var g=ctx.createGain();g.gain.value=M?0:1;oc.call(g,ctx.destination);ctx.__fg=g;G.push(g)}return ctx.__fg};
AudioNode.prototype.connect=function(d){if(d&&this.context&&d===this.context.destination){var a=Array.prototype.slice.call(arguments);a[0]=gf(this.context);return oc.apply(this,a)}return oc.apply(this,arguments)};
AudioNode.prototype.disconnect=function(d){if(d&&this.context&&d===this.context.destination&&this.context.__fg){var a=Array.prototype.slice.call(arguments);a[0]=this.context.__fg;return odc.apply(this,a)}return odc.apply(this,arguments)}}}catch(e){}
window.__flamMuted=function(){return M};
window.addEventListener("message",function(e){var d=e.data;if(!d||d.flamCmd!=="mute")return;M=!!d.on;apply()});
setInterval(function(){if(M)apply()},700);
/* ---- click-throughs stay inside the app ---- */
window.__vxOpen=function(u){t({type:"cta",url:u||""});return true};
window.ExitApi={exit:function(n,u){t({type:"cta",url:u||""})}};
window.open=function(u){t({type:"cta",url:String(u||"")});return null};
document.addEventListener("click",function(e){var a=e.target&&e.target.closest&&e.target.closest("a[target=_blank]");if(a){e.preventDefault();t({type:"cta",url:a.href});return}
var p=e.composedPath?e.composedPath():[],inP=false;for(var i=0;i<p.length;i++){var n=p[i];if(!n||!n.tagName)continue;var g=n.tagName;if(g==="BUTTON"||g==="A"||g==="INPUT"||g==="SELECT"||(n.getAttribute&&n.getAttribute("role")==="button"))return;if(g==="VERTEX-PLAYER"){inP=true;break}}if(inP)t({type:"tap"})},true);
function ready(){if(RD)return;RD=1;t({type:"ready"})}
function hook(v){if(v.__flam)return;v.__flam=1;
v.addEventListener("vertex-ready",ready);
v.addEventListener("vertex-error",function(e){var d=e.detail||{};if(d.recovered||d.severity==="warning")return;t({type:"error",msg:(d.message||d.code||"render error")+""})});
v.addEventListener("vertex-cta",function(e){var d=e.detail||{};t({type:"cta",url:d.url||""})});
v.addEventListener("vertex-diff-change",function(e){var d=e.detail||{};var x=d.diff!=null?d.diff:(d.diffId!=null?d.diffId:d.diff_id);t({type:"switch",diff:+x||0,initial:!!d.initial})});}
/* The app shows its own button beside each Flick, so the Flick's built-in button is hidden. The option switcher and the sound button are never touched:
   the rule only goes in when the player has a recognisable switcher, and it excludes the switcher and anything holding it. */
function nocta(ps){for(var i=0;i<ps.length;i++){try{var r=ps[i].shadowRoot;if(!r||r.querySelector("style[data-nocta]"))continue;
if(!r.querySelector(".vx-swatch,.vx-picker,[data-vertex-diff]"))continue;
var st=document.createElement("style");st.setAttribute("data-nocta","");
st.textContent="[data-vertex-trigger]:not(.vx-swatch):not(.vx-picker):not([data-vertex-diff]):not(.vx-picker *):not(:has(.vx-swatch,.vx-picker,[data-vertex-diff])){visibility:hidden!important;opacity:0!important;pointer-events:none!important}";
r.appendChild(st)}catch(e){}}}
var until=Date.now()+6e4;(function again(){var ps=deep(document,"vertex-player",[]);for(var i=0;i<ps.length;i++)hook(ps[i]);nocta(ps);
if(!RD){for(var k=0;k<ps.length;k++){try{var vd=ps[k].shadowRoot&&ps[k].shadowRoot.querySelector("video");if(vd&&vd.readyState>=2){ready();break}}catch(e){}}}
if(Date.now()<until)setTimeout(again,250)})();
try{new MutationObserver(function(){var v=document.querySelector("vertex-player");if(v)hook(v)}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
window.addEventListener("error",function(e){var s=e.target;if(s&&s.tagName==="SCRIPT")t({type:"error",msg:"The Flick could not be loaded"})},true);
t({type:"boot"});})();`;
  const cfg = !b.dsp ? "" : `<script>window.AD_CONFIG=window.AD_CONFIG||{};window.AD_CONFIG.dsp="dv360_studio";window.AD_CONFIG.publisherInfo={"publisher_id":"\${PUBLISHER_ID}","adsxt_publisher_id":"\${ADSXT_PUBLISHER_ID}","universal_site_id":"\${UNIVERSAL_SITE_ID}","source_url":"\${SOURCE_URL}","source_url_enc":"\${SOURCE_URL_ENC}","adsxt_ad_system_domain":"\${ADSXT_AD_SYSTEM_DOMAIN}"};window.AD_CONFIG.clickTracker={"mode":"exit","template":""};<\/script>`;
  const src = /^[\w-]+:\/\/[^"'<>\s]+$/.test(b.src) ? b.src : "";
  return `<!doctype html>
<meta charset=utf-8>
<meta name=ad.orientation content=portrait,landscape>
<style>html,body{margin:0;height:100%;background:#eef1ee;overflow:hidden}</style>
<script>${bridge}<\/script>
<script>var ExitApi=window.ExitApi||{exit:function(){}},clickTag="\${CLICK_URL_UNESC}";<\/script>
${cfg}
<script src="${src}"><\/script>`;
}

let SLOTS = {};
const VMEM = {}; let CURH = "#/home";
// cta: what the app's button for this Flick does. tap: whether a plain tap on the video opens the product page.
function flick(id, brand, opt={}){
  const b = BRANDS[brand], v = opt.v != null ? opt.v : (VMEM[CURH+"|"+id] || 0);
  SLOTS[id] = { id, brand, v, want:v, ready:false, error:false, mounted:false, on:opt.on||null, cta:opt.cta||"pdp", tap:opt.tap!==false && !!b.retail, lastCta:0, muted:null, timer:null };
  return `<div class="flick ${b.tall?"tall":""}" data-slot="${id}"><div class="fstate"></div></div>`;
}
const baseOf = b => b.tall ? [360,640] : [540,540];
function mount(host){
  const s = SLOTS[host.dataset.slot]; if(!s || s.mounted || s.error) return;
  s.mounted = true; s.ready = false; s.muted = null;
  const b = BRANDS[s.brand], [bw,bh] = baseOf(b);
  const f = document.createElement("iframe");
  f.title = `${b.name} Flick`; f.setAttribute("allow","autoplay; fullscreen; encrypted-media"); f.setAttribute("scrolling","no");
  f.style.width = bw+"px"; f.style.height = bh+"px";
  f.srcdoc = tagDoc(s.id, b);
  host.prepend(f); fitFlick(host);
  clearTimeout(s.timer);
  s.timer = setTimeout(()=>{ if(s.ready||s.error||!s.mounted) return;
    host.querySelector(".fstate")?.classList.add("hide");
    if(!host.querySelector(".fwarn")) host.insertAdjacentHTML("beforeend",`<button class="fwarn" onclick="retryFlick('${s.id}')">Still loading. Tap to retry</button>`);
  }, 12000);
}
function unmount(host){
  const s = SLOTS[host.dataset.slot]; if(!s || !s.mounted) return;
  clearTimeout(s.timer); s.mounted = false; s.ready = false; s.muted = null; s.want = s.v;
  // Removing the frame destroys the player and anything inside it, so nothing can keep playing.
  host.querySelector("iframe")?.remove(); host.querySelector(".fwarn")?.remove();
  const st = host.querySelector(".fstate"); if(st) st.className = "fstate";
}
function retryFlick(id){ const host = $(`.flick[data-slot="${id}"]`), s = SLOTS[id]; if(!host||!s) return; s.error=false; unmount(host); const st=host.querySelector(".fstate"); st.className="fstate"; st.innerHTML=""; mount(host); audit(); }
function fitFlick(host){ const f = host.querySelector("iframe"), s = SLOTS[host.dataset.slot]; if(!f||!s) return; const [bw] = baseOf(BRANDS[s.brand]); const w = host.clientWidth; if(w) f.style.transform = `scale(${w/bw})`; }
const frameWin = host => host.querySelector("iframe")?.contentWindow;
function swatchFor(id, i){
  try{ const r = $(`.flick[data-slot="${id}"] iframe`).contentDocument.querySelector("vertex-player").shadowRoot;
    return Array.from(r.querySelectorAll("button[data-vertex-diff]")).find(b=>+b.getAttribute("data-vertex-diff")===i) || r.querySelectorAll(".vx-swatch")[i] || null; }catch(e){ return null; }
}
// Switch the Flick from the app's own UI (option chips, product tiles under the video).
function setVariant(id, i){ const s = SLOTS[id]; if(!s) return; s.want = i; if(s.ready){ const sw = swatchFor(id, i); if(sw) sw.click(); } applyVariant(id, i); }
function applyVariant(id, i){
  const s = SLOTS[id]; if(!s) return; const b = BRANDS[s.brand]; if(!b.variants) return; const n = b.variants.length; i = Math.max(0, Math.min(i, n-1));
  const changed = s.v !== i; s.v = i; VMEM[CURH+"|"+id] = i;
  const v = b.variants[i], pid = `${s.brand}-${i}`;
  $$(`[data-sn="${id}"]`).forEach(e=>e.textContent = vname(s.brand,i));
  $$(`[data-sv="${id}"]`).forEach(e=>e.textContent = b.named ? vshort(s.brand,i) : `${i+1} of ${n}`);
  $$(`[data-sp="${id}"]`).forEach(e=>e.innerHTML = priceHTML(v.p, v.was));
  $$(`[data-so="${id}"]`).forEach(e=>e.innerHTML = offHTML(v.p, v.was));
  $$(`[data-sk="${id}"]`).forEach(e=>e.textContent = vpack(s.brand,i));
  $$(`[data-sa="${id}"]`).forEach(e=>e.dataset.add = pid);
  $$(`[data-sd="${id}"] i`).forEach((e,j)=>e.classList.toggle("on", j===i));
  $$(`[data-sync="${id}"]`).forEach(e=>e.classList.toggle("on", +e.dataset.i===i));
  if(changed) $$(`[data-spop="${id}"]`).forEach(e=>{ e.classList.remove("pop"); void e.offsetWidth; e.classList.add("pop"); });
  refreshAdds(); if(s.on) s.on(i, changed);
}
function ctaGo(id){ const s = SLOTS[id]; if(!s) return; const b = BRANDS[s.brand];
  if(s.cta==="pdp") go(`#/p/${s.brand}/${s.v}`);
  else if(s.cta==="add") addToCart(`${s.brand}-${s.v}`);
  else if(s.cta==="cat" && b.cat) go(`#/cat/${b.cat}`);
}
function pickOrOpen(id, i){ const s = SLOTS[id]; if(!s) return; if(s.v===i) go(`#/p/${s.brand}/${i}`); else setVariant(id, i); }
window.addEventListener("message", e=>{
  const m = e.data; if(!m || m.flam!==1) return; const s = SLOTS[m.slot]; if(!s) return;
  const host = $(`.flick[data-slot="${m.slot}"]`); if(!host || e.source !== frameWin(host)) return;
  if(m.type==="boot"){ s.muted = null; audit(); }
  else if(m.type==="ready"){ s.ready = true; clearTimeout(s.timer); host.querySelector(".fstate")?.classList.add("hide"); host.querySelector(".fwarn")?.remove();
    if(s.want) setTimeout(()=>setVariant(m.slot, s.want), 80); s.muted = null; audit(); }
  else if(m.type==="error"){ s.error = true; s.mounted = false; clearTimeout(s.timer); host.querySelector("iframe")?.remove(); host.querySelector(".fwarn")?.remove();
    const st = host.querySelector(".fstate"); st.className = "fstate err";
    st.innerHTML = `<div><b>Flick didn't load</b>${esc(m.msg)}<br><button class="fretry" onclick="retryFlick('${s.id}')">Retry</button></div>`; }
  else if(m.type==="switch"){ if(m.initial && s.want) return; applyVariant(m.slot, m.diff); }
  else if(m.type==="cta" || m.type==="tap"){ const now = Date.now(); if(now - s.lastCta < 900) return; s.lastCta = now;
    if(m.type==="tap"){ if(s.tap) go(`#/p/${s.brand}/${s.v}`); return; }
    ctaGo(m.slot); }
});

/* ---- mount and sound control ----
   Flicks are started well before they scroll into view so they are already playing when they arrive, and only the nearest few are kept running.
   A Flick can be heard only while at least half of it is on screen, in front, with the tab visible. */
const MAXLIVE = matchMedia("(pointer: coarse)").matches ? 4 : 6;
const CLIP = /(^|\s)(scr|row|hero|vm)(\s|$)/;
function vis(h){
  const r = h.getBoundingClientRect(), a = r.width*r.height; if(!a) return {ratio:0, dist:1e9};
  let x1=r.left, y1=r.top, x2=r.right, y2=r.bottom, dist=0;
  for(let p=h.parentElement; p; p=p.parentElement){
    if(p===APP || CLIP.test(p.className||"")){ const q = p.getBoundingClientRect();
      dist = Math.max(dist, q.left-r.right, r.left-q.right, q.top-r.bottom, r.top-q.bottom);
      x1=Math.max(x1,q.left); y1=Math.max(y1,q.top); x2=Math.min(x2,q.right); y2=Math.min(y2,q.bottom); }
    if(p===APP) break;
  }
  return {ratio: Math.max(0,x2-x1)*Math.max(0,y2-y1)/a, dist};
}
function audit(){
  const ov = OVER.classList.contains("on"); let best=null, bestR=0; const list=[], cand=[];
  $$(".flick[data-slot]", APP).forEach(h=>{ const s = SLOTS[h.dataset.slot]; if(!s) return; const {ratio,dist} = vis(h); const over = !!h.closest("#over");
    const ok = ratio >= .5 && !document.hidden && (!ov || over);
    cand.push([dist - ratio*1000 - (over?5000:0), h, dist, ratio]);
    list.push([h,s]); if(ok && ratio + (over?1:0) > bestR){ bestR = ratio + (over?1:0); best = s; } });
  cand.sort((a,b)=>a[0]-b[0]).forEach(([_,h,dist,ratio],i)=>{ if(dist < 900 && (i < MAXLIVE || ratio > 0)) mount(h); else if(dist > 1500 || (i >= MAXLIVE && ratio === 0)) unmount(h); });
  list.forEach(([h,s])=>{ if(!s.mounted) return; const mute = s !== best; if(s.muted === mute) return; s.muted = mute; try{ frameWin(h).postMessage({flamCmd:"mute", on:mute}, "*"); }catch(e){} });
}
let auditT=0; const sched = () => { if(auditT) return; auditT = setTimeout(()=>{ auditT=0; audit(); }, 90); };
APP.addEventListener("scroll", sched, true);
addEventListener("resize", ()=>{ $$(".flick[data-slot]").forEach(fitFlick); sched(); });
document.addEventListener("visibilitychange", audit);
addEventListener("pagehide", ()=>$$(".flick[data-slot]").forEach(unmount));
setInterval(audit, 1200);

/* ================= building blocks ================= */
const pic = (k,alt="") => IMG[k] ? `<img src="${IMG[k][2]}" width="${IMG[k][0]}" height="${IMG[k][1]}" alt="${esc(alt)}" draggable="false">` : "";
const HU = k => IMG[k][1]*390/IMG[k][0];   // height of a cut in 390-wide screen units
// A cut from the real app, shown full width from y0 to y1 (screen units). zones: [x,y,w,h,handler,label] tap areas,
// or ["add",x,y,w,h,productId,round] for the app's own + button inside the cut.
function seg(k, y0, y1, zones, anchor){ y0 = y0||0; y1 = y1||HU(k); const H = y1-y0;
  const pc = (x,y,w,h) => `left:${x/3.9}%;top:${(y-y0)/H*100}%;width:${w/3.9}%;height:${h/H*100}%`;
  const z = (zones||[]).map(a=> a[0]==="add" ? `<div class="padd ${a[6]?"round":""}" data-padd="${a[5]}" style="${pc(a[1],a[2],a[3],a[4])}"></div>`
    : `<button class="hs" style="${pc(a[0],a[1],a[2],a[3])}" onclick="${a[4]}" aria-label="${esc(a[5]||"Open")}"></button>`).join("");
  return `<div class="slice" ${anchor?`data-anchor="${anchor}"`:""} style="aspect-ratio:390/${H}"><img src="${IMG[k][2]}" alt="" draggable="false" style="top:${-y0/H*100}%">${z}</div>`; }
const stpad = c => `<div class="stpad" style="--stbg:${c||"#fff"}"></div>`;
function nav(on){ const it = [["home","Home",I.home,"go('#/home')"],["cats","Categories",I.grid,"go('#/cats')"],["again","Order again",I.again,"go('#/again')"]];
  return `<button class="bbar" data-bbar onclick="go('#/basket')"></button><nav class="nav"><div class="pill">${it.map(([k,l,ic,fn])=>`<button class="nb ${k===on?"on":""}" onclick="${fn}">${ic}<span>${l}</span></button>`).join("")}</div><button class="bod" onclick="go('#/brand')" aria-label="Brand of the Day">${pic("bod")}</button></nav>`; }
const etaHTML = t => t ? `<div class="eta">${I.bolt} ${t}</div>` : "";
function tile(pid, w){ const x = P[pid]; if(!x) return "";
  return `<div class="tile" ${w?`style="width:${w}px"`:""} onclick="openP('${pid}')" role="button" tabindex="0" aria-label="${esc(x.n)}"><div class="im ph">${pic(x.img,x.n)}${addc(pid)}</div>
  <div class="tb">${offHTML(x.p,x.was)}<div class="price">${priceHTML(x.p,x.was)}</div><div class="pbr">${esc(x.br)}</div><div class="pname">${esc(x.n)}</div>${x.pack?`<div class="ppack">${esc(x.pack)}</div>`:""}</div></div>`; }
const row = ids => `<div class="row">${ids.map(id=>tile(id)).join("")}</div>`;
const sec = (t, body, more, sub) => `<section class="sec"><div class="sec-h"><h2>${t}</h2>${more?`<button class="more" onclick="${more}" aria-label="See all">${I.right}</button>`:""}</div>${sub?`<div class="sec-sub">${sub}</div>`:""}${body}</section>`;
function openP(pid){ const x = P[pid]; if(!x) return; if(x.brand) go(`#/p/${x.brand}/${x.vi}`); else if(x.pdp) go("#/pdp"); else toast(`${x.n.slice(0,40)}: the full product page is outside this demo`); }

// Sponsored product: a tile in a product row. The Flick is the product picture; price, name and + follow the option on screen.
function adTile(id, k, anchor, w=168){ const b = BRANDS[k], v = b.variants[0];
  return `<div class="tile" style="width:${w}px" data-anchor="${anchor}"><div class="im fl">${flick(id,k)}${addc(`${k}-0`,`data-sa="${id}"`)}</div>
  <div class="tb" data-spop="${id}" onclick="ctaGo('${id}')"><span data-so="${id}">${offHTML(v.p,v.was)}</span><div class="price" data-sp="${id}">${priceHTML(v.p,v.was)}</div><div class="pbr">${esc(b.name)} · Sponsored</div><div class="pname" data-sn="${id}">${esc(vname(k,0))}</div><div class="ppack" data-sk="${id}">${esc(vpack(k,0))}</div>${dots(id)}</div></div>`; }
// Banner card: Flick on top, the app's own headline, price and button under it.
function adCard(id, k, anchor, o={}){ const b = BRANDS[k], v = b.variants[0];
  return `<div class="adcard ${o.cls||""}" data-anchor="${anchor}" style="${o.style||""}">${flick(id,k,{cta:"add"})}
  <div class="adb" data-spop="${id}"><div><div class="br">${av(k)}${esc(b.name)}<span class="sp">Sponsored</span></div><h4 style="margin-top:6px">${esc(o.head||b.head)}</h4></div>
  <div class="vline"><span><b data-sv="${id}">${b.named?esc(vshort(k,0)):"1 of 3"}</b> · <b data-sp="${id}">${priceHTML(v.p,v.was)}</b></span>${dots(id)}</div>
  <button class="cta" onclick="ctaGo('${id}')">Add to basket</button></div></div>`; }
const stat = (k, fn) => `<button class="stat" style="background-image:url(${IMG[k][2]})" onclick="${fn}">${pic(k)}</button>`;
const hero = (id, cards) => `<div class="hero" data-hero="${id}">${cards.join("")}</div><div class="hdots" data-hd="${id}">${cards.map((_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</div>`;
const mini = (id,k,i) => { const v = BRANDS[k].variants[i]; return `<div class="mini ${i?"":"on"}" data-sync="${id}" data-i="${i}" onclick="pickOrOpen('${id}',${i})" role="button" tabindex="0"><span class="nm"><i class="sw" style="background:${v.c}"></i><span>${esc(vshort(k,i))}</span></span><b class="price">${priceHTML(v.p)}</b>${addc(`${k}-${i}`)}</div>`; };
const minis = (id,k) => `<div class="prow">${BRANDS[k].variants.map((_,i)=>mini(id,k,i)).join("")}</div>`;
// Brand shelf: a brand's block on a page, video on top and its three products under it.
function shelf(id, k, anchor, bg, title){
  return `<section class="shelf" style="background:${bg}" data-anchor="${anchor}"><div class="sh"><div><h3>${title}</h3><div class="sp">Sponsored · ${esc(BRANDS[k].name)}</div></div>${av(k)}</div>
  <div class="box">${flick(id,k)}${minis(id,k)}</div><button class="all" onclick="go('#/cat/${BRANDS[k].cat}')">View All ${I.right}</button></section>`; }
function brandAd(id, k, anchor){ const b = BRANDS[k];
  return `<div class="brandad" data-anchor="${anchor}"><div class="bh">${av(k)}<div><b>${esc(b.head)}</b><span>Sponsored · ${esc(b.name)}</span></div>${dots(id)}</div>${flick(id,k)}${minis(id,k)}</div>`; }
// Video card in the Watch and shop row.
function watchCard(id, k, anchor){ const b = BRANDS[k], v = b.variants[0];
  return `<div class="adcard tcard" data-anchor="${anchor}">${flick(id,k,{cta:"add"})}
  <div class="adb" data-spop="${id}"><div class="br">${av(k)}${esc(b.name)} ${dots(id)}</div><div class="vline"><b data-sv="${id}" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.named?esc(vshort(k,0)):"1 of 3"}</b><b data-sp="${id}">${priceHTML(v.p)}</b></div>
  <div style="display:flex;gap:6px"><button class="cta" style="flex:1;padding:0 8px" onclick="ctaGo('${id}')">Add</button><button class="cta ghost" style="padding:0 12px" onclick="go('#/watch/${k}')" aria-label="Open in Watch and shop">${I.play}</button></div></div></div>`; }

/* ================= screens ================= */
function homeScreen(){
  const T = (x,y,fn,l) => [x,y,80,80,fn,l];
  return `<div class="screen">${stpad("#830f56")}<div class="scr" id="scr">
  ${seg("home_a",0,0,[[345,20,34,34,"out('Your account')","Account"],[12,68,280,47,"go('#/search/')","Search"],[300,68,78,47,"out('Shopping lists')","Lists"],
    [72,123,71,54,"go('#/cat/fresh')","Fresh"],[145,123,71,54,"go('#/cat/gifts')","Celebrations"],[217,123,71,54,"go('#/cat/electronics')","Electronics"],[289,123,71,54,"go('#/cat/winter')","Winter"]])}
  ${hero("h1",[adCard("hero","dor","hero"),adCard("hero2","bj","hero2"),stat("b_bod","go('#/brand')"),adCard("hero3","can","hero3"),adCard("hero4","sony","hero4"),stat("b_redlabel","go('#/brand')")])}
  ${seg("home_mast",0,0,[T(16,95,"go('#/cat/gifts')","Gift boxes"),T(109,95,"go('#/cat/gifts')","Dry fruits and sweets"),T(201,95,"go('#/cat/electronics')","Gifting for brother"),T(294,95,"go('#/cat/gifts')","Gifting for sister"),
    T(16,187,"go('#/cat/pooja')","Pooja essentials"),T(109,187,"go('#/cat/beauty')","Festive ready"),T(201,187,"go('#/cat/cooking')","Festive cooking"),T(294,187,"go('#/cat/snacks')","Party time"),
    [0,283,390,58,"toast('Offer codes are not active in this demo')","Offers"]])}
  <div class="panel">${sec("Shop festive essentials", `<div class="row">${tile("truffle")}${adTile("fest","mms","fest")}${tile("ferrero")}${tile("dryfruit")}</div>`, "go('#/cat/gifts')")}</div>
  <div class="wide" style="margin-top:14px">${adCard("disp","juice","disp")}</div>
  ${sec("Order again", `<div class="row">${tile("paneer")}${adTile("again","gm","again")}${tile("tomato")}${tile("yogurt")}</div>`, "go('#/again')")}
  ${sec("Watch and shop", `<div class="row">${watchCard("w1","neck","w1")}${watchCard("w2","dor","w2")}${watchCard("w3","bj","w3")}<button class="more-v" onclick="go('#/watch')"><i>${I.play}</i><b>Watch more</b><span>Shop as you watch</span></button></div>`, "go('#/watch')", "Sponsored")}
  ${shelf("shelf","bj","shelf","#1c5fa8","Which tub tonight?<br>Three flavours, one scoop away.")}
  </div>${nav("home")}</div>`;
}
function catsScreen(){
  const xs = [13,107,201,295], R = (y,h,ids) => ids.map((id,i)=>[xs[i],y,82,h,`go('#/cat/${id}')`,CATS[id].name]);
  return `<div class="screen">${stpad()}<div class="top">${seg("cat_top",48,0,[[335,56,46,40,"go('#/search/')","Search"]])}</div><div class="scr" id="scr">
  ${seg("cat_a",0,400,[...R(73,122,["fruits","bakery","dairy","meat"]),...R(254,122,["atta","oil","cereals","kitchen"])])}
  <div class="wide" style="margin:4px 13px 6px">${adCard("aisle","dor","aisle",{head:"Snack aisle: pick your crunch"})}</div>
  ${seg("cat_a",400,0,[...R(434,122,["beverages","snacks","biscuits","frozen"]),...R(568,104,["gifts","icecream","sauces","gourmet"])])}
  ${seg("cat_b",0,0,R(0,39,["gifts","icecream","sauces","gourmet"]))}
  <div class="wide" style="margin:8px 13px 6px">${adCard("aisle2","eye","aisle2")}</div>
  ${seg("cat_c",0,304,[...R(38,122,["bath","hair","beauty","mens"]),...R(172,122,["hygiene","wellness","pharmacy","baby"])])}
  </div>${nav("cats")}</div>`;
}
function againScreen(){
  return `<div class="screen">${stpad()}<div class="top">${seg("sb_top",48,0,[[335,56,46,40,"go('#/search/')","Search"]])}</div><div class="scr" id="scr">
  <div style="height:8px"></div>${brandAd("restock","gm","restock")}
  ${seg("sb_a",0,622,[["add",193,467,34,34,"paneer"],["add",347,467,34,34,"tomato"],[146,194,82,36,"toast('We will let you know when it is back')","Notify"],[300,194,82,36,"toast('We will let you know when it is back')","Notify"],
    [0,120,74,560,"out('Other Smart Basket aisles')","Aisles"],[80,22,300,44,"out('Other Smart Basket aisles')","Aisles"]])}
  </div>${nav("again")}</div>`;
}
function brandScreen(){
  const adds = (a,b) => [["add",105,157,34,34,a],["add",244,157,34,34,b]];
  return `<div class="screen">${stpad("#ecebe6")}<div class="top">${seg("brand_top",48,0,[[8,55,50,50,"back()","Back"],[332,55,50,50,"go('#/search/')","Search"]])}</div><div class="scr" id="scr">
  ${seg("brand_hero",58,0,[])}
  <div class="wide" style="margin:16px 13px 18px">${adCard("store","can","store")}</div>
  ${seg("brand_a",0,0,[...adds("bru1","bru2"),[13,369,364,94,"go('#/search/coffee')","BRU range"],[340,8,40,40,"go('#/search/coffee')","See all"]])}
  ${seg("brand_b",0,0,[[13,238,364,215,"go('#/search/tea')","Red Label range"],[13,60,364,150,"go('#/search/tea')","Red Label teas"]])}
  ${seg("brand_c",0,262,[...adds("rl1","rl2"),[340,8,40,40,"go('#/search/tea')","See all"]])}
  </div><button class="bbar" data-bbar onclick="go('#/basket')"></button></div>`;
}
// The product page from the recording (Truffle Treats gift box), with a sponsored row added.
function pdpScreen(){
  return `<div class="screen">${stpad()}<div class="top">${seg("pdp_top",42,0,[[10,48,54,54,"back()","Back"],[288,50,44,50,"go('#/search/')","Search"],[338,50,44,50,"toast('Link copied')","Share"]])}</div><div class="scr" id="scr">
  <div class="pmedia" style="display:flex;justify-content:center;padding:14px 0"><div class="tile" style="width:46%;padding:0;background:none"><div class="im ph" style="border-radius:14px">${pic("p_truffle","Truffle Treats Gift Box")}${addc("truffle")}</div></div></div>
  ${sec("Complete the gift", `<div class="row">${adTile("gift","mms","gift")}${tile("ferrero")}${tile("dryfruit")}</div>`, "", "Sponsored")}
  ${seg("pdp_a",0,0,[["add",93,158,34,34,"lexp",1],["add",211,158,34,34,"lindt",1],["add",330,158,34,34,"ferrero",1],[340,26,40,34,"go('#/cat/gifts')","See all"]])}
  ${seg("pdp_b",0,155,[[13,14,364,48,"go('#/cat/gifts')","More from Lindberg"],[13,88,364,62,"go('#/cat/gifts')","More chocolates and gifts"]])}
  </div><div class="top" style="border-top:1px solid var(--line)">${seg("pdp_foot",0,72,[["add",13,10,364,50,"truffle",1]])}</div><button class="bbar" data-bbar onclick="go('#/basket')"></button></div>`;
}
const topBar = (t, extra="") => `${stpad()}<div class="stop"><button class="rbtn" onclick="back()" aria-label="Back">${I.back}</button><b>${t}</b>${extra}<button class="rbtn" onclick="go('#/search/')" aria-label="Search">${I.search}</button></div>`;
// Product page of a Flick product: the Flick is the product media. Option chips, title, price and Add to Basket follow it.
function productScreen(k, i){ const b = BRANDS[k]; if(!b || !b.retail) return pdpScreen(); i = Math.max(0,Math.min(i,b.variants.length-1)); const v = b.variants[i];
  const on = j => { const pid = `${k}-${j}`; $$("[data-buy]").forEach(e=>e.dataset.buy = pid); $$("[data-ol]").forEach(e=>e.textContent = b.named ? vshort(k,j) : `${j+1} of 3`); keepHash(`#/p/${k}/${j}`); };
  return `<div class="screen">${topBar(esc(b.name))}<div class="scr" id="scr">
  <div class="pmedia" data-anchor="pdp">${flick("pdp",k,{v:i,cta:"add",tap:false,on})}</div>
  <div class="pinfo"><span class="bchip">${esc(b.name)}</span><h1 data-sn="pdp" data-spop="pdp">${esc(vname(k,i))}</h1><div class="ppack" data-sk="pdp" style="margin-bottom:6px">${esc(vpack(k,i))}</div>
  <div style="display:flex;align-items:center;gap:8px"><div class="price" data-sp="pdp">${priceHTML(v.p,v.was)}</div><span data-so="pdp">${offHTML(v.p,v.was)}</span></div>${etaHTML(b.eta)}
  <div class="opt"><label>${b.unit}: <b data-ol>${b.named?esc(vshort(k,i)):`${i+1} of 3`}</b></label><div class="opts">${b.variants.map((x,j)=>`<button class="optb ${j===i?"on":""}" data-sync="pdp" data-i="${j}" onclick="setVariant('pdp',${j})"><i style="background:${x.c}"></i>${esc(vshort(k,j))}</button>`).join("")}</div></div>
  <div class="kv"><h3>About the product</h3><p>${esc(b.desc)}</p></div></div>
  <div class="buybar"><button class="buy" data-buy="${k}-${i}" onclick="addToCart(this.dataset.buy)">Add to Basket</button></div><button class="bbar" data-bbar onclick="go('#/basket')"></button></div>`;
}
function catScreen(id){ if(!CATS[id]) id = "gifts"; const c = CATS[id];
  return `<div class="screen">${topBar(esc(c.name))}<div class="scr" id="scr">
  <div class="chips"><span class="chip on">All</span><span class="chip">Offers</span><span class="chip">New launches</span><span class="chip">Top rated</span></div>
  ${c.ads[0]?brandAd("catb",c.ads[0],"catb"):""}${c.ids.length?`<div class="grid">${c.ids.map(p=>tile(p)).join("")}</div>`:""}
  ${c.ads[1]?`<div style="height:14px"></div>${brandAd("catb2",c.ads[1],"catb2")}`:""}
  ${sec(c.ids.length?"Order again":"Popular right now", `<div class="grid">${(c.ids.length?AGAIN:AGAIN.concat(["bru1","ferrero","rl1"])).filter(p=>!c.ids.includes(p)).map(p=>tile(p)).join("")}</div>`)}
  </div><button class="bbar" data-bbar onclick="go('#/basket')"></button></div>`;
}
function searchKey(q){ if(!q) return ""; const all = Object.keys(SEARCH); return all.find(k=>q.includes(k) || k.includes(q)) || (Object.keys(ALIAS).find(a=>q.includes(a)) ? ALIAS[Object.keys(ALIAS).find(a=>q.includes(a))] : ""); }
function searchScreen(q){
  q = (q||"").trim().toLowerCase(); const cfg = SEARCH[searchKey(q)]; let body;
  const sug = `<div class="sugg">${Object.keys(SEARCH).map(s=>`<button class="chip" onclick="go('#/search/${encodeURIComponent(s)}')">${I.search} ${s}</button>`).join("")}</div>`;
  if(!q) body = `${seg("se_a",0,0,[[13,48,90,110,"go('#/cat/gifts')","Diwali Shopping"],[112,48,90,110,"go('#/cat/jewellery')","Jewellery Collection"],[211,48,90,110,"go('#/search/tea')","Tea and premix"],[310,48,80,110,"go('#/search/chocolate')","Chocolate gifting"]])}
    ${hero("h2",[adCard("sban","lip","sban"),adCard("sban2","eye","sban2"),stat("b_bedding","out('This offer')"),adCard("sban3","mms","sban3"),stat("b_bru","go('#/search/coffee')")])}
    ${sec("Trending searches", sug)}${seg("se_b",0,190,[[13,48,364,112,"out('This collection')"]])}`;
  else { let ids = cfg ? cfg.ids : Object.keys(P).filter(id=>P[id].img && (P[id].n+" "+P[id].br).toLowerCase().includes(q));
    if(!cfg && !ids.length) body = `<div class="empty"><h3>No results for "${esc(q)}" in this demo</h3><p>Try one of these</p>${sug}</div>`;
    else { const t = ids.map(p=>tile(p));
      if(cfg && cfg.inline) t.splice(1,0,adTile("inl",cfg.inline,"inline",0).replace('style="width:0px"',""));
      body = `<div class="chips"><span class="chip on">All</span><span class="chip">Offers</span><span class="chip">Brand</span><span class="chip">Pack size</span></div>${cfg&&cfg.ad?brandAd("top",cfg.ad,"top"):""}
      ${t.length?`<div class="grid">${t.join("")}</div>`:""}${t.length<3?sec("Order again", `<div class="grid">${AGAIN.filter(p=>!ids.includes(p)).map(p=>tile(p)).join("")}</div>`):""}`; } }
  return `<div class="screen">${stpad()}<div class="top">${seg("se_top",42,0,[[13,54,40,50,"back()","Back"],[284,56,36,44,"out('Voice search')","Voice search"],[330,54,50,50,"out('Shopping lists')","Lists"]])}
    <input class="sinput" id="q" style="left:13.5%;top:${(64-42)/(HU("se_top")-42)*100}%;width:58%;height:${28/(HU("se_top")-42)*100}%" value="${esc(q)}" placeholder="Search 'chips'" enterkeyhint="search" autocomplete="off" aria-label="Search" onkeydown="if(event.key==='Enter')go('#/search/'+encodeURIComponent(this.value.trim()))"></div>
  <div class="scr" id="scr">${body}</div><button class="bbar" data-bbar onclick="go('#/basket')"></button></div>`;
}
// Watch and shop: a feed of shoppable videos. Each one adds the option on screen to the basket.
const WATCH = ["dor","bj","juice","gm","can","mms","lip","sony","neck"];
function watchScreen(){
  const card = k => { const b = BRANDS[k], v = b.variants[0], id = "wv_"+k;
    return `<article class="wcard" data-anchor="wv-${k}"><div class="wh">${av(k)}<div><b>${esc(b.name)}</b><span>Sponsored · ${esc(b.head)}</span></div>${dots(id)}</div>
    ${flick(id,k,{cta:"add",tap:false})}
    <div class="wb" data-spop="${id}"><div class="pname" style="min-height:0;font-size:14px" data-sn="${id}">${esc(vname(k,0))}</div><div class="price" style="font-size:18px;margin-top:4px" data-sp="${id}">${priceHTML(v.p,v.was)}</div>
    <div class="wr"><button class="cta" onclick="ctaGo('${id}')">Add to Basket</button><div class="wq">${addc(`${k}-0`,`data-sa="${id}"`)}</div><button class="cta ghost" style="height:44px" onclick="go('#/p/${k}/'+SLOTS['${id}'].v)">Details</button></div></div></article>`; };
  return `<div class="screen">${topBar("Watch and shop")}<div class="scr" id="scr" style="background:var(--bg)">${WATCH.map(card).join("")}</div><button class="bbar" data-bbar onclick="go('#/basket')"></button></div>`;
}
const cthumb = x => x.img ? pic(x.img) : `<span class="swb" style="background:${x.c||"#ccc"}"></span>`;
function cartList(){ const ids = Object.keys(CART), tot = cartTotal(), mrp = Math.round(ids.reduce((a,id)=>a+(P[id].was||P[id].p)*CART[id],0)*100)/100;
  return !ids.length ? `<div class="empty"><div style="width:84px;height:84px;border-radius:50%;background:var(--mint);color:var(--green);display:grid;place-items:center;margin:auto">${I.basket.replace('width="20" height="20"','width="40" height="40"')}</div><h3>Your basket is empty</h3><p>Add something to get started</p><button class="cta" onclick="go('#/home')">Start shopping</button></div>`
   : `<div style="padding:0 13px">${ids.map(id=>`<div class="cart-i"><div class="mi">${cthumb(P[id])}</div><div class="nm"><small>${esc(P[id].br)}</small>${esc(P[id].n)}<b>₹${num(P[id].p)}</b></div><div class="step"><button aria-label="Remove one" onclick="addToCart('${id}',-1)">−</button><span>${CART[id]}</span><button aria-label="Add one" onclick="addToCart('${id}',1,1)">+</button></div></div>`).join("")}
     <div style="padding:12px 0 4px"><div class="tot"><span>Item total (MRP)</span><span>₹${num(mrp)}</span></div>${mrp>tot?`<div class="tot" style="color:var(--green)"><span>Savings</span><span>−₹${num(Math.round((mrp-tot)*100)/100)}</span></div>`:""}<div class="tot g"><span>To pay</span><span>₹${num(tot)}</span></div></div>
     <button class="buy" onclick="out('Checkout')">Proceed to checkout</button></div>`; }
function basketScreen(){
  return `<div class="screen">${topBar(`Review Basket`)}<div class="scr" id="scr"><div id="cartlist">${cartList()}</div>
  ${sec("Before you checkout", `<div class="row">${adTile("cart1","dor","cart1")}${adTile("cart2","mms","cart2")}${tile("ferrero")}${tile("bru1")}</div>`, "", "Sponsored")}
  ${sec("Order again", row(AGAIN))}</div></div>`;
}

/* ================= overlay: a Flick full screen ================= */
function openOver(html){ OVER.innerHTML = html; OVER.classList.add("on"); try{ history.pushState({ov:1}, ""); OVSTATE = true; }catch(e){} sizeOver(); audit(); }
let OVSTATE = false;
function closeOver(silent){ if(!OVER.classList.contains("on")) return; $$(".flick[data-slot]", OVER).forEach(h=>{ unmount(h); delete SLOTS[h.dataset.slot]; });
  OVER.classList.remove("on"); OVER.innerHTML = ""; if(OVSTATE && !silent){ OVSTATE = false; try{ history.back(); }catch(e){} } OVSTATE = false; audit(); }
addEventListener("popstate", ()=>{ if(OVER.classList.contains("on")){ OVSTATE = false; closeOver(true); } });
function sizeOver(){ const vm = $(".vm", OVER), f = vm && vm.querySelector(".flick"); if(!f) return; const tall = f.classList.contains("tall"); const w = Math.min(vm.clientWidth, vm.clientHeight * (tall ? 9/16 : 1)); f.style.width = w+"px"; f.style.flex = "none"; fitFlick(f); }

/* ================= router ================= */
const NAV = [], SCROLL = {}; let lastHash = "", pendingAnchor = null;
function go(h){ const rep = OVSTATE; if(rep) closeOver(true);
  if(location.hash === h){ if(rep) history.back(); else render(false); } else if(rep) location.replace(h); else location.hash = h; }
function back(){ if(NAV.length > 1) history.back(); else location.hash = "#/home"; }
function parse(){ const p = (location.hash || "#/home").replace(/^#\/?/,"").split("/"); return {name:p[0]||"home", a:decodeURIComponent(p[1]||""), b:p[2]}; }
function keepHash(h){ if(location.hash === h) return; history.replaceState(history.state, "", h); CURH = lastHash = h; if(NAV.length) NAV[NAV.length-1] = h; }
const TABS = ["home","cats","again"];
function bindHero(h){ const d = $(`[data-hd="${h.dataset.hero}"]`); if(!d) return; const kids = Array.from(h.children);
  h.addEventListener("scroll", ()=>{ const x = h.scrollLeft; let bi = 0; kids.forEach((c,i)=>{ if(Math.abs(c.offsetLeft - h.offsetLeft - 13 - x) < Math.abs(kids[bi].offsetLeft - h.offsetLeft - 13 - x)) bi = i; });
    if(x >= h.scrollWidth - h.clientWidth - 4) bi = kids.length-1;
    Array.from(d.children).forEach((e,i)=>e.classList.toggle("on", i===bi)); }, {passive:true}); }
function render(anim=true){
  const r = parse(), h = location.hash || "#/home";
  const old = $("#scr", VIEW); if(old && lastHash) SCROLL[lastHash] = old.scrollTop;
  let dir = "enter";
  if(NAV.length > 1 && NAV[NAV.length-2] === h){ NAV.pop(); dir = "enter-back"; } else if(NAV[NAV.length-1] !== h) NAV.push(h);
  closeOver(true);
  // Leaving a screen removes its Flicks outright, so nothing can keep playing behind the next screen.
  $$(".flick[data-slot]", VIEW).forEach(unmount); SLOTS = {}; CURH = h;
  const S = {home:homeScreen, cats:catsScreen, again:againScreen, brand:brandScreen, pdp:pdpScreen, search:()=>searchScreen(r.a), watch:watchScreen, cat:()=>catScreen(r.a), p:()=>productScreen(r.a, +r.b||0), basket:basketScreen};
  const name = S[r.name] ? r.name : "home";
  VIEW.innerHTML = S[name]();
  const scrn = $(".screen", VIEW), sc = $("#scr", VIEW);
  if(anim && lastHash && !TABS.includes(name)) scrn.classList.add(dir);
  APP.style.setProperty("--sbink", name==="home" ? "#fff" : "#1f2420");
  APP.classList.toggle("nonav", !TABS.includes(name)); APP.classList.toggle("hasbuy", name==="p" || name==="pdp"); APP.classList.toggle("nobar", name==="basket");
  document.body.classList.toggle("lowpill", !TABS.includes(name));
  lastHash = h;
  Object.values(SLOTS).forEach(s=>{ if(s.v) applyVariant(s.id, s.v); });
  refreshAdds(); $$(".hero", VIEW).forEach(bindHero);
  if(dir === "enter-back" && SCROLL[h] && sc) sc.scrollTop = SCROLL[h];
  if(name === "watch" && r.a && !pendingAnchor) pendingAnchor = "wv-"+r.a;
  const anc = pendingAnchor; pendingAnchor = null;
  if(anc) setTimeout(()=>scrollToAnchor(anc), 80);
  if(name === "search" && !r.a && anim) setTimeout(()=>$("#q")?.focus({preventScroll:true}), 300);
  audit(); buildGuide();
}
addEventListener("hashchange", ()=>render(true));

/* ================= ad slots list: slot types only, no brand names ================= */
const GUIDE = [
  ["Swipeable banners", [["Home: banner carousel","#/home","hero"],["Search: banner carousel","#/search/","sban"]]],
  ["Sponsored products in rows", [["Home: festive essentials row","#/home","fest"],["Home: Order again row","#/home","again"],["Product page: Complete the gift","#/pdp","gift"],["Basket: before you checkout","#/basket","cart1"]]],
  ["Brand shelves", [["Home: brand shelf","#/home","shelf"],["Smart Basket: restock shelf","#/again","restock"]]],
  ["Shoppable video", [["Home: Watch and shop row","#/home","w1"],["Watch and shop page","#/watch","wv-dor"]]],
  ["Search", [["Brand ad at top of results","#/search/chips","top"],["Sponsored product inside results","#/search/chocolate","inline"]]],
  ["Category, brand and product pages", [["Categories: aisle banner","#/cats","aisle"],["Categories: second aisle banner","#/cats","aisle2"],["Category page banner","#/cat/beverages","catb"],["Category page: second banner","#/cat/beverages","catb2"],["Brand of the Day store","#/brand","store"],["Product page video","#/p/gm/0","pdp"]]],
  ["Display cards in the feed", [["Home: display card","#/home","disp"]]]
];
let curPick = "";
function buildGuide(){ let n = 0;
  $("#glist").innerHTML = GUIDE.map(([sec,items],si)=>`<h6>${sec}</h6>` + items.map((it,ii)=>{ n++; const key = si+"-"+ii;
    return `<button class="gitem ${key===curPick?"cur":""}" onclick="pick(${si},${ii})"><span class="n">${n}</span>${it[0]}</button>`; }).join("")).join("");
  $("#gcount").textContent = n;
}
let guideAt = 0;
function pick(si, ii){ if(Date.now() - guideAt < 500) return;   // the tap that opened the list must not also pick from it
  const it = GUIDE[si][1][ii]; curPick = si+"-"+ii; toggleGuide(false);
  const have = location.hash || "#/home", rep = OVSTATE;
  if(have === it[1]){ closeOver(); scrollToAnchor(it[2]); buildGuide(); }
  else { closeOver(true); pendingAnchor = it[2]; if(rep) location.replace(it[1]); else location.hash = it[1]; }
}
function scrollToAnchor(a){
  const sc = $("#scr", VIEW), el = sc && sc.querySelector(`[data-anchor="${a}"]`); if(!el) return;
  const k = sc.getBoundingClientRect().height / (sc.clientHeight || 1);
  const hr = el.closest(".row,.hero");
  if(hr){ const left = (el.getBoundingClientRect().left - hr.getBoundingClientRect().left)/k + hr.scrollLeft - 13; hr.scrollTo({left:Math.max(0,left), behavior:"smooth"}); }
  const tgt = el.closest(".sec") || el;
  const top = (tgt.getBoundingClientRect().top - sc.getBoundingClientRect().top)/k + sc.scrollTop - 8;
  sc.scrollTo({top:Math.max(0,top), behavior:"smooth"});
  setTimeout(()=>{ $$(".pulse").forEach(e=>e.classList.remove("pulse")); void el.offsetWidth; el.classList.add("pulse"); audit(); }, 420);
}
function toggleGuide(force){ const p = $("#side"), on = force === undefined ? !p.classList.contains("on") : force; if(on) guideAt = Date.now(); p.classList.toggle("on", on); $("#gscrim").classList.toggle("on", on); $("#gpill").setAttribute("aria-expanded", on); if(on) $("#gpill").classList.remove("hl"); }
$("#gscrim").addEventListener("click", ()=>{ if(Date.now() - guideAt > 500) toggleGuide(false); });
document.addEventListener("keydown", e=>{ if(e.key === "Escape"){ toggleGuide(false); closeOver(); } if((e.key==="Enter"||e.key===" ") && e.target.matches && e.target.matches("[role=button]")){ e.preventDefault(); e.target.click(); } });
// The phone button can be dragged out of the way; a short move still counts as a tap.
(function(){ const b = $("#gpill"); let sx, sy, ox, oy, moved;
  b.addEventListener("pointerdown", e=>{ sx=e.clientX; sy=e.clientY; const r=b.getBoundingClientRect(); ox=r.left; oy=r.top; moved=false; b.setPointerCapture(e.pointerId); });
  b.addEventListener("pointermove", e=>{ if(sx==null) return; const dx=e.clientX-sx, dy=e.clientY-sy; if(!moved && Math.hypot(dx,dy)<8) return; moved=true;
    b.style.left=Math.max(6,Math.min(innerWidth-b.offsetWidth-6,ox+dx))+"px"; b.style.top=Math.max(6,Math.min(innerHeight-b.offsetHeight-6,oy+dy))+"px"; b.style.right="auto"; b.style.bottom="auto"; });
  b.addEventListener("pointerup", ()=>{ if(sx==null) return; sx=null; if(!moved) toggleGuide(); });
  setTimeout(()=>b.classList.add("hl"), 1500);   // blinks until the list has been opened once
})();

/* ================= phone scaling ================= */
function fit(){ const slot = $("#phoneSlot"), phone = $("#phone");
  if(innerWidth <= 860){ slot.style.width = slot.style.height = ""; phone.style.transform = ""; return; }
  const s = Math.min(1, (innerHeight - 52 - 40) / 868, (innerWidth - 440) / 414);
  phone.style.transform = `scale(${s})`; slot.style.width = (414*s)+"px"; slot.style.height = (868*s)+"px";
}
addEventListener("resize", fit);
$("#flamLogo").src = FLAMLOGO; $("#bbLogo").src = BBLOGO;
fit(); render(false);
(function(){ const list = Object.values(BRANDS).map(b=>b.src); let i = 0;
  const next = () => { if(i >= list.length) return; fetch(list[i++], {mode:"no-cors", credentials:"omit"}).catch(()=>{}).finally(()=>setTimeout(next, 250)); };
  setTimeout(next, 1500); })();

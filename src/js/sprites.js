export const FALLBACK_SPRITE = "https://thearms.fr/file/unknow";
const BAD_SPRITE_RE = /(missingno|placeholder)/i;

export function isBadSprite(url){
  if (!url){ return true; }
  const u = String(url);
  if (BAD_SPRITE_RE.test(u)){ return true; }
  if (/\/0\//.test(u)){ return true; }
  return false;
}

export function isValidPokemon(p){
  const name = (p?.name?.fr || p?.name?.en || "").trim();
  if (!name){ return false; }
  if (/missing\s*no/i.test(name)){ return false; }
  if (p?.pokedex_id === 0){ return false; }
  return true;
}

export function listCandidateSprites(p){
  const urls = [];
  urls.push(p?.sprites?.regular, p?.sprites?.shiny);
  const gx = p?.sprites?.gmax;
  if (gx){
    if (typeof gx === "string"){ urls.push(gx); }
    else { urls.push(gx.regular, gx.shiny); }
  }
  if (Array.isArray(p?.formes)){
    for (const f of p.formes){
      if (f?.sprites){ urls.push(f.sprites.regular, f.sprites.shiny); }
      else { urls.push(f?.image, f?.sprite); }
    }
  }
  const megaList = Array.isArray(p?.evolution?.mega) ? p.evolution.mega : (Array.isArray(p?.mega) ? p.mega : []);
  for (const m of megaList){
    if (m?.sprites){ urls.push(m.sprites.regular, m.sprites.shiny); }
    else { urls.push(m?.image, m?.sprite); }
  }
  return urls.filter(u => !!u && !isBadSprite(u));
}

export function primarySprite(p){
  const first = listCandidateSprites(p).find(Boolean);
  if (first){ return first; }
  return FALLBACK_SPRITE;
}

export function collectVariants(p){
  const out = [];
  const add = (key, label, url) => {
    if (!url || isBadSprite(url)){ return; }
    if (!out.some(v => v.url === url)){ out.push({ key, label, url }); }
  };
  add("regular", "Normal", p?.sprites?.regular);
  add("shiny",   "Shiny",  p?.sprites?.shiny);
  const gx = p?.sprites?.gmax;
  if (gx){
    if (typeof gx === "string"){ add("gmax", "Gigamax", gx); }
    else { add("gmax", "Gigamax (Normal)", gx.regular); add("gmax", "Gigamax (Shiny)", gx.shiny); }
  }
  if (Array.isArray(p?.formes)){
    for (const f of p.formes){
      const base = f?.name || "Forme";
      if (f?.sprites){ add("forme", `${base} (Normal)`, f.sprites.regular); add("forme", `${base} (Shiny)`, f.sprites.shiny); }
      else { add("forme", base, f?.image || f?.sprite); }
    }
  }
  const megaList = Array.isArray(p?.evolution?.mega) ? p.evolution.mega : (Array.isArray(p?.mega) ? p.mega : []);
  for (const m of megaList){
    const orb = (m?.orbe || m?.name || "").toString();
    let suffix = "";
    if (/\bX\b/i.test(orb)){ suffix = " X"; }
    else if (/\bY\b/i.test(orb)){ suffix = " Y"; }
    const base = `Méga${suffix}`;
    if (m?.sprites){ add("mega", `${base} (Normal)`, m.sprites.regular); add("mega", `${base} (Shiny)`, m.sprites.shiny); }
    else { add("mega", base, m?.image || m?.sprite); }
  }
  return out;
}

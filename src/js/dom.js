import { typeIconUrl } from "./types.js";

export function createEl(tag, className = "", attrs = {}){
  const n = document.createElement(tag);
  if (className){ n.className = className; }
  for (const [k, v] of Object.entries(attrs)){
    if (v == null){ continue; }
    if (k === "text"){ n.textContent = v; }
    else if (k === "html"){ n.innerHTML = v; }
    else if (k === "dataset"){ Object.assign(n.dataset, v); }
    else { n.setAttribute(k, v); }
  }
  return n;
}

export function renderTypes(types = []){
  const wrap = createEl("div", "types");
  for (const t of (types || [])){
    const chip = createEl("span", "chip");
    const img  = createEl("img", "", {
      src: t?.image || typeIconUrl(t?.name),
      alt: t?.name || "Type",
      width: 14,
      height: 14,
      loading: "lazy"
    });
    chip.append(img, document.createTextNode(" " + (t?.name || "")));
    wrap.append(chip);
  }
  return wrap;
}

export function renderMovesBlock(){ return createEl("ul", "moves"); }

export function renderMetaBlock(p){
  const m = createEl("div", "meta");
  m.append(
    createEl("span", "", { text: p.generation ? `Gen ${p.generation}` : (p.category || "") }),
    createEl("span", "", { text: p.category || "" })
  );
  return m;
}

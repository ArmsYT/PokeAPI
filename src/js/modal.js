import { select, selectAll } from "./utils.js";
import { createEl, renderTypes } from "./dom.js";
import { buildDetailSections } from "./details.js";
import { collectVariants, primarySprite, FALLBACK_SPRITE } from "./sprites.js";

let lastFocused = null;

export function openModal(p){
  const root  = select("#pkm-modal");
  const body  = root.querySelector(".modal__body");
  const title = root.querySelector("#pkm-modal-title");

  title.textContent = `#${p?.pokedex_id} - ${p.name?.fr || p.name?.en || ""} | Génération N°${p?.generation}`;
  body.innerHTML = "";
  let variants = collectVariants(p);
  if (!variants.length){ variants = [{ key:"regular", label: p?.sprites?.regular ? "Normal" : "Sprite", url: primarySprite(p) }]; }

  const grid = createEl("div", "variants");
  for (const v of variants){
    const card = createEl("div", "variant");
    const img  = createEl("img", "", { src: v.url || FALLBACK_SPRITE, alt: `${title.textContent} — ${v.label}`, loading: "lazy" });
    img.onerror = () => { img.src = FALLBACK_SPRITE; };
    const lab  = createEl("div", "v-label", { text: v.label });
    card.append(img, lab);
    grid.append(card);
  }
  body.append(createEl("strong", "md-title", { text: "Variantes" }), grid);
  body.append(buildDetailSections(p));

  lastFocused = document.activeElement;
  root.classList.add("open");
  root.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const focusables = selectAll("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])", root).filter(el => !el.hasAttribute("disabled"));
  const first = focusables[0], last = focusables[focusables.length - 1];
  (first || root).focus();

  const onKey = e => {
    if (e.key === "Escape"){ closeModal(); }
    if (e.key === "Tab" && focusables.length){
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  };
  root._onKey = onKey;
  window.addEventListener("keydown", onKey);
  root.querySelectorAll("[data-close]").forEach(b => b.onclick = closeModal);
}

export function closeModal(){
  const root = select("#pkm-modal");
  if (!root.classList.contains("open")){ return; }
  root.classList.remove("open");
  root.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (root._onKey){ window.removeEventListener("keydown", root._onKey); root._onKey = null; }
  if (lastFocused && document.body.contains(lastFocused)){ lastFocused.focus(); }
}

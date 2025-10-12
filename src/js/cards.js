import { createEl, renderTypes, renderMovesBlock, renderMetaBlock } from "./dom.js";
import { gradientFor } from "./types.js";
import { primarySprite, FALLBACK_SPRITE } from "./sprites.js";
import { openModal } from "./modal.js";

export function renderDetailsToggle(p){
  const det = createEl("details", "details");
  const sum = createEl("summary", "", { text: "Détails" });
  sum.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); openModal(p); });
  det.append(sum);
  return det;
}

export function buildCard(p){
  const card = createEl("a", "card", { href: `#${p.pokedex_id}`, "aria-label": p.name?.fr || p.name?.en || "Pokemon" });
  const coverArea = createEl("div", "cover-area");
  const wrapper   = createEl("div", "wrapper");
  const cover     = createEl("div", "cover");
  cover.style.background = gradientFor(p.types);
  wrapper.append(cover);
  const title = createEl("div", "title", { text: `#${p.pokedex_id} - ${p.name?.fr || p.name?.en || ""}` });
  const img   = createEl("img", "character", { src: primarySprite(p), alt: (p.name?.fr || p.name?.en || "Pokemon") + " – sprite", loading: "lazy" });
  img.onerror = () => { img.src = FALLBACK_SPRITE; };
  coverArea.append(wrapper, title, img);
  const info = createEl("div", "info");
  info.append(renderTypes(p.types), renderMovesBlock(), renderMetaBlock(p), renderDetailsToggle(p));
  card.append(coverArea, info);
  return card;
}

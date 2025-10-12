import { toLowerNoAccent } from "./utils.js";

export const TYPE_SLUG = {
  plante:"plante", poison:"poison", feu:"feu", eau:"eau", electrik:"electrik",
  glace:"glace", combat:"combat", psy:"psy", sol:"sol", vol:"vol",
  insecte:"insecte", roche:"roche", spectre:"spectre",
  dragon:"dragon", tenebres:"tenebres", acier:"acier", fee:"fee", normal:"normal"
};

export function typeIconUrl(nameFR){
  const slug = TYPE_SLUG[toLowerNoAccent(nameFR || "")];
  if (slug){ return `https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/${slug}.png`; }
  return "https://thearms.fr/file/unknow";
}

export const TYPE_GRADIENT = {
  plante:"linear-gradient(135deg,#86efac 0%, #34d399 45%, #22c55e 100%)",
  poison:"linear-gradient(135deg,#c084fc 0%, #a855f7 45%, #7e22ce 100%)",
  feu:"linear-gradient(135deg,#fb7185 0%, #f43f5e 45%, #ef4444 100%)",
  eau:"linear-gradient(135deg,#93c5fd 0%, #60a5fa 45%, #38bdf8 100%)",
  electrik:"linear-gradient(135deg,#fde68a 0%, #f59e0b 45%, #f97316 100%)",
  sol:"linear-gradient(135deg,#f59e0b 0%, #d97706 45%, #92400e 100%)",
  roche:"linear-gradient(135deg,#e5e7eb 0%, #94a3b8 45%, #64748b 100%)",
  acier:"linear-gradient(135deg,#cbd5e1 0%, #94a3b8 45%, #475569 100%)",
  insecte:"linear-gradient(135deg,#bef264 0%, #84cc16 45%, #4d7c0f 100%)",
  vol:"linear-gradient(135deg,#a5b4fc 0%, #60a5fa 45%, #38bdf8 100%)",
  psy:"linear-gradient(135deg,#f0abfc 0%, #e879f9 45%, #a21caf 100%)",
  spectre:"linear-gradient(135deg,#a78bfa 0%, #8b5cf6 45%, #6d28d9 100%)",
  tenebres:"linear-gradient(135deg,#94a3b8 0%, #64748b 45%, #334155 100%)",
  dragon:"linear-gradient(135deg,#93c5fd 0%, #6366f1 45%, #7c3aed 100%)",
  fee:"linear-gradient(135deg,#f9a8d4 0%, #f472b6 45%, #db2777 100%)",
  glace:"linear-gradient(135deg,#bae6fd 0%, #7dd3fc 45%, #38bdf8 100%)",
  normal:"linear-gradient(135deg,#e2e8f0 0%, #cbd5e1 45%, #94a3b8 100%)",
  combat:"linear-gradient(135deg,#fca5a5 0%, #ef4444 45%, #991b1b 100%)"
};

export function gradientFor(types){
  const g = TYPE_GRADIENT[toLowerNoAccent(types?.[0]?.name || "")];
  if (g){ return g; }
  return TYPE_GRADIENT.normal;
}

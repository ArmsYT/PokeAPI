import { numberFR } from "./utils.js";
import { typeIconUrl } from "./types.js";
import { createEl } from "./dom.js";
import { FALLBACK_SPRITE } from "./sprites.js"; // <-- AJOUT

export function buildDetailSections(p){
  const frag = document.createDocumentFragment();

  const eggGroups = Array.isArray(p.egg_groups) ? p.egg_groups.join(", ") : "—";
  const sex = `${p.sexe?.male ?? "?"}% ♂ • ${p.sexe?.female ?? "?"}% ♀`;
  const pairs = [
    ["Categorie", p.category],
    ["Taille / Poids", `${p.height || "?"} • ${p.weight || "?"}`],
    ["Groupes d'œufs", eggGroups],
    ["Sexe", sex],
    ["Taux de capture", String(p.catch_rate ?? "?")],
    ["Exp. niveau 100", numberFR.format(p.level_100 ?? 0)]
  ];

  const infoGrid = createEl("dl", "info-grid");
  for (const [k, v] of pairs){
    const box = createEl("div");
    box.append(createEl("dt", "", { text: k }), createEl("dd", "", { text: v }));
    infoGrid.append(box);
  }
  frag.append(infoGrid);

  if (p.stats){
    frag.append(createEl("strong", "md-title", { text: "Stats de base" }));
    const dl = createEl("dl", "stats-grid");
    const s = p.stats;
    const stats = [
      ["PV", s.hp], ["ATK", s.atk], ["DEF", s.def],
      ["ATK SPÉ", s.spe_atk], ["DEF SPÉ", s.spe_def], ["VITESSE", s.vit]
    ];
    for (const [k, v] of stats){
      const b = createEl("div");
      b.append(createEl("dt", "", { text: k }), createEl("dd", "", { text: String(v) }));
      dl.append(b);
    }
    frag.append(dl);
  }

  if (Array.isArray(p.talents) && p.talents.length){
    const wrap = createEl("div");
    wrap.append(createEl("strong", "md-title", { text: "Talents" }));
    const ul = createEl("ul", "md-list");
    for (const t of p.talents){
      ul.append(createEl("li", "", { text: t.tc ? `${t.name} (caché)` : t.name }));
    }
    wrap.append(ul);
    frag.append(wrap);
  }

  if (Array.isArray(p.types) && p.types.length){
    frag.append(createEl("strong", "md-title", { text: "Types" }));
    const ulT = createEl("ul", "resist type-list");
    for (const t of p.types){
      const li = createEl("li");
      const left = createEl("span", "res-left");
      left.append(createEl("img", "res-icon", {
        src: typeIconUrl(t.name), alt: t.name, title: t.name, width: 18, height: 18, loading: "lazy"
      }));
      li.append(left, createEl("span", "", { text: t.name }));
      ulT.append(li);
    }
    frag.append(ulT);
  }

  if (Array.isArray(p.resistances)){
    frag.append(createEl("strong", "md-title", { text: "Résistances / Faiblesses" }));
    const ul = createEl("ul", "resist");
    for (const r of p.resistances){
      const li = createEl("li");
      const left = createEl("span", "res-left");
      left.append(createEl("img", "res-icon", {
        src: typeIconUrl(r.name), alt: r.name, title: r.name, width: 18, height: 18, loading: "lazy"
      }));
      li.append(left, createEl("span", "", { text: `×${r.multiplier}` }));
      ul.append(li);
    }
    frag.append(ul);
  }

  // === ÉVOLUTIONS : affichage en cartes avec image (comme les Variantes) ===
  (function(){
    const evoSpriteUrl = (id) =>
      (Number.isFinite(id) && id > 0)
        ? `https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${id}/regular.png`
        : FALLBACK_SPRITE;

    const items = [];
    const add = (evo) => {
      const id = Number(evo?.pokedex_id);
      const name = (evo?.name || "").trim();
      if (!name || !Number.isFinite(id) || id <= 0) { return; }
      const label = `#${id} - ${name}${evo?.condition ? ` (${evo.condition})` : ""}`;
      items.push({ id, label });
    };

    const pre = p?.evolution?.pre;
    if (Array.isArray(pre)) { pre.forEach(add); }
    else if (pre) { add(pre); }

    const next = p?.evolution?.next;
    if (Array.isArray(next)) { next.forEach(add); }

    // dédoublonnage par id
    const seen = new Set();
    const list = items.filter(it => !seen.has(it.id) && seen.add(it.id));

    if (!list.length) { return; }

    frag.append(createEl("strong", "md-title", { text: "Évolutions" }));
    const grid = createEl("div", "variants evolutions"); // réutilise le style .variants/.variant
    for (const it of list){
      const card = createEl("div", "variant");
      const img  = createEl("img", "", {
        src: evoSpriteUrl(it.id),
        alt: it.label,
        loading: "lazy"
      });
      img.onerror = () => { img.src = FALLBACK_SPRITE; };
      const lab  = createEl("div", "v-label", { text: it.label });
      card.append(img, lab);
      grid.append(card);
    }
    frag.append(grid);
  })();

  return frag;
}

import { numberFR } from "./utils.js";
import { typeIconUrl } from "./types.js";
import { createEl } from "./dom.js";

export function buildDetailSections(p){
  const frag = document.createDocumentFragment();

  const head = createEl("div", "kv");
  head.append(
    createEl("strong", "", { text: `#${p.pokedex_id} ${p.name?.fr || p.name?.en || ""}` }),
    createEl("span", "", { text: `${p.generation ? `Génération ${p.generation} — ` : ""}${p.category || ""}` })
  );
  frag.append(head);

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

  const eggGroups = Array.isArray(p.egg_groups) ? p.egg_groups.join(", ") : "—";
  const sex = `${p.sexe?.male ?? "?"}% ♂ • ${p.sexe?.female ?? "?"}% ♀`;
  const pairs = [
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
    for (const t of p.talents){ ul.append(createEl("li", "", { text: t.tc ? `${t.name} (caché)` : t.name })); }
    wrap.append(ul);
    frag.append(wrap);
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

  (function(){
    const clean = v => (v == null ? "" : String(v).trim());
    const valid = v => {
      const s = clean(v).toLowerCase();
      return !!s && s !== "undefined" && s !== "null" && s !== "nil";
    };
    const lines = [];
    const pre = p.evolution?.pre;
    if (Array.isArray(pre)){
      for (const pr of pre){ if (valid(pr?.name)){ lines.push(`${pr.name}${valid(pr?.condition) ? ` (${pr.condition})` : ""}`); } }
    } else if (pre && valid(pre.name)){
      lines.push(`${pre.name}${valid(pre.condition) ? ` (${pre.condition})` : ""}`);
    }
    const next = Array.isArray(p.evolution?.next) ? p.evolution.next : null;
    if (next && next.length){
      for (const n of next){
        if (!valid(n?.name)){ continue; }
        lines.push(`${n.name}${valid(n?.condition) ? ` (${n.condition})` : ""}`);
      }
    }
    if (!lines.length){ return; }
    frag.append(createEl("strong", "md-title", { text: "Évolutions" }));
    const ul = createEl("ul", "md-list");
    for (const label of lines){ ul.append(createEl("li", "", { text: label })); }
    frag.append(ul);
  })();

  return frag;
}

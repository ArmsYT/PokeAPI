const API_URL = "https://tyradex.vercel.app/api/v1/pokemon";
const FALLBACK_SPRITE = "https://thearms.fr/file/unknow";

const select = (s, root = document) => root.querySelector(s);
const selectAll = (s, root = document) => Array.from(root.querySelectorAll(s));
const numberFR = new Intl.NumberFormat("fr-FR");

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function toLowerNoAccent(s = "") { return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase(); }

const TYPE_SLUG = {
  plante:"plante", poison:"poison", feu:"feu", eau:"eau", electrik:"electrik",
  glace:"glace", combat:"combat", psy:"psy", sol:"sol", vol:"vol",
  insecte:"insecte", roche:"roche", spectre:"spectre",
  dragon:"dragon", tenebres:"tenebres", acier:"acier", fee:"fee", normal:"normal"
};

function typeIconUrl(nameFR) {
  const slug = TYPE_SLUG[toLowerNoAccent(nameFR || "")];
  if (slug) { return `https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types/${slug}.png`; }
  else { return FALLBACK_SPRITE; }
}

const TYPE_GRADIENT = {
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

function gradientFor(types) {
  const g = TYPE_GRADIENT[toLowerNoAccent(types?.[0]?.name || "")];
  if (g) { return g; } else { return TYPE_GRADIENT.normal; }
}

const BAD_SPRITE_RE = /(missingno|placeholder)/i;

function isBadSprite(url) {
  if (!url) { return true; }
  const u = String(url);
  if (BAD_SPRITE_RE.test(u)) { return true; }
  if (/\/0\//.test(u)) { return true; }
  return false;
}

function isValidPokemon(p) {
  const name = (p?.name?.fr || p?.name?.en || "").trim();
  if (!name) { return false; }
  if (/missing\s*no/i.test(name)) { return false; }
  if (p?.pokedex_id === 0) { return false; }
  return true;
}

function listCandidateSprites(p) {
  const urls = [];
  urls.push(p?.sprites?.regular, p?.sprites?.shiny);
  const gx = p?.sprites?.gmax;
  if (gx) {
    if (typeof gx === "string") { urls.push(gx); }
    else { urls.push(gx.regular, gx.shiny); }
  }
  if (Array.isArray(p?.formes)) {
    for (const f of p.formes) {
      if (f?.sprites) { urls.push(f.sprites.regular, f.sprites.shiny); }
      else { urls.push(f?.image, f?.sprite); }
    }
  }
  const megaList = Array.isArray(p?.evolution?.mega) ? p.evolution.mega
                   : (Array.isArray(p?.mega) ? p.mega : []);
  for (const m of megaList) {
    if (m?.sprites) { urls.push(m.sprites.regular, m.sprites.shiny); }
    else { urls.push(m?.image, m?.sprite); }
  }
  return urls.filter(u => !!u && !isBadSprite(u));
}

function primarySprite(p) {
  const first = listCandidateSprites(p).find(Boolean);
  if (first) { return first; } else { return FALLBACK_SPRITE; }
}

function collectVariants(p) {
  const out = [];
  const add = (key, label, url) => {
    if (!url || isBadSprite(url)) { return; }
    if (!out.some(v => v.url === url)) { out.push({ key, label, url }); }
  };
  add("regular", "Normal", p?.sprites?.regular);
  add("shiny",   "Shiny",  p?.sprites?.shiny);
  const gx = p?.sprites?.gmax;
  if (gx) {
    if (typeof gx === "string") {
      add("gmax", "Gigamax", gx);
    } else {
      add("gmax", "Gigamax (Normal)", gx.regular);
      add("gmax", "Gigamax (Shiny)",  gx.shiny);
    }
  }
  if (Array.isArray(p?.formes)) {
    for (const f of p.formes) {
      const base = f?.name || "Forme";
      if (f?.sprites) {
        add("forme", `${base} (Normal)`, f.sprites.regular);
        add("forme", `${base} (Shiny)`,  f.sprites.shiny);
      } else {
        add("forme", base, f?.image || f?.sprite);
      }
    }
  }
  const megaList = Array.isArray(p?.evolution?.mega) ? p.evolution.mega
                   : (Array.isArray(p?.mega) ? p.mega : []);
  for (const m of megaList) {
    const orb = (m?.orbe || m?.name || "").toString();
    let suffix = "";
    if (/\bX\b/i.test(orb)) { suffix = " X"; }
    else if (/\bY\b/i.test(orb)) { suffix = " Y"; }
    const base = `Méga${suffix}`;
    if (m?.sprites) {
      add("mega", `${base} (Normal)`, m.sprites.regular);
      add("mega", `${base} (Shiny)`,  m.sprites.shiny);
    } else {
      add("mega", base, m?.image || m?.sprite);
    }
  }
  return out;
}

function createEl(tag, className = "", attrs = {}) {
  const n = document.createElement(tag);
  if (className) { n.className = className; }
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) { continue; }
    if (k === "text") { n.textContent = v; }
    else if (k === "html") { n.innerHTML = v; }
    else if (k === "dataset") { Object.assign(n.dataset, v); }
    else { n.setAttribute(k, v); }
  }
  return n;
}

function renderTypes(types = []) {
  const wrap = createEl("div", "types");
  for (const t of (types || [])) {
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

function renderMovesBlock() { return createEl("ul", "moves"); }

function renderMetaBlock(p) {
  const m = createEl("div", "meta");
  m.append(
    createEl("span", "", { text: p.generation ? `Gen ${p.generation}` : (p.category || "") }),
    createEl("span", "", { text: p.category || "" })
  );
  return m;
}

function buildDetailSections(p) {
  const frag = document.createDocumentFragment();
  const head = createEl("div", "kv");
  head.append(
    createEl("strong", "", { text: `#${p.pokedex_id} ${p.name?.fr || p.name?.en || ""}` }),
    createEl("span", "", { text: `${p.generation ? `Génération ${p.generation} — ` : ""}${p.category || ""}` })
  );
  frag.append(head);
  const eggGroups = Array.isArray(p.egg_groups) ? p.egg_groups.join(", ") : "—";
  const sex = `${p.sexe?.male ?? "?"}% ♂ • ${p.sexe?.female ?? "?"}% ♀`;
  const pairs = [
    ["Taille / Poids", `${p.height || "?"} • ${p.weight || "?"}`],
    ["Groupes d'œufs", eggGroups],
    ["Sexe",           sex],
    ["Taux de capture", String(p.catch_rate ?? "?")],
    ["Exp. niveau 100", numberFR.format(p.level_100 ?? 0)]
  ];
  const infoGrid = createEl("dl", "info-grid");
  for (const [k, v] of pairs) {
    const box = createEl("div");
    box.append(createEl("dt", "", { text: k }), createEl("dd", "", { text: v }));
    infoGrid.append(box);
  }
  frag.append(infoGrid);
  if (p.stats) {
    frag.append(createEl("strong", "md-title", { text: "Stats de base" }));
    const dl = createEl("dl", "stats-grid");
    const s = p.stats;
    const stats = [
      ["PV", s.hp], ["ATK", s.atk], ["DEF", s.def],
      ["ATK SPÉ", s.spe_atk], ["DEF SPÉ", s.spe_def], ["VITESSE", s.vit]
    ];
    for (const [k, v] of stats) {
      const b = createEl("div");
      b.append(createEl("dt", "", { text: k }), createEl("dd", "", { text: String(v) }));
      dl.append(b);
    }
    frag.append(dl);
  }
  if (Array.isArray(p.talents) && p.talents.length) {
    const wrap = createEl("div");
    wrap.append(createEl("strong", "md-title", { text: "Talents" }));
    const ul = createEl("ul", "md-list");
    for (const t of p.talents) { ul.append(createEl("li", "", { text: t.tc ? `${t.name} (caché)` : t.name })); }
    wrap.append(ul);
    frag.append(wrap);
  }
  if (Array.isArray(p.resistances)) {
    frag.append(createEl("strong", "md-title", { text: "Résistances / Faiblesses" }));
    const ul = createEl("ul", "resist");
    for (const r of p.resistances) {
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
    const clean = (v) => (v == null ? "" : String(v).trim());
    const valid = (v) => {
      const s = clean(v).toLowerCase();
      return !!s && s !== "undefined" && s !== "null" && s !== "nil";
    };
    const lines = [];
    const pre = p.evolution?.pre;
    if (Array.isArray(pre)) {
      for (const pr of pre) {
        if (valid(pr?.name)) { lines.push(`${pr.name}${valid(pr?.condition) ? ` (${pr.condition})` : ""}`); }
      }
    } else if (pre && valid(pre.name)) {
      lines.push(`${pre.name}${valid(pre.condition) ? ` (${pre.condition})` : ""}`);
    }
    const next = Array.isArray(p.evolution?.next) ? p.evolution.next : null;
    if (next && next.length) {
      for (const n of next) {
        if (!valid(n?.name)) { continue; }
        lines.push(`${n.name}${valid(n?.condition) ? ` (${n.condition})` : ""}`);
      }
    }
    if (!lines.length) { return; }
    frag.append(createEl("strong", "md-title", { text: "Évolutions" }));
    const ul = createEl("ul", "md-list");
    for (const label of lines) { ul.append(createEl("li", "", { text: label })); }
    frag.append(ul);
  })();
  return frag;
}

let lastFocused = null;

function openModal(p) {
  const root  = select("#pkm-modal");
  const body  = root.querySelector(".modal__body");
  const title = root.querySelector("#pkm-modal-title");
  const types = root.querySelector(".modal__types");
  title.textContent = p.name?.fr || p.name?.en || "";
  types.innerHTML = "";
  types.append(renderTypes(p.types));
  body.innerHTML = "";
  let variants = collectVariants(p);
  if (!variants.length) {
    variants = [{ key:"regular", label: p?.sprites?.regular ? "Normal" : "Sprite", url: primarySprite(p) }];
  }
  const grid = createEl("div", "variants");
  for (const v of variants) {
    const card = createEl("div", "variant");
    const img  = createEl("img", "", {
      src: v.url || FALLBACK_SPRITE,
      alt: `${title.textContent} — ${v.label}`,
      loading: "lazy"
    });
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
  const focusables = selectAll("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])", root)
    .filter(el => !el.hasAttribute("disabled"));
  const first = focusables[0], last = focusables[focusables.length - 1];
  (first || root).focus();
  const onKey = (e) => {
    if (e.key === "Escape") { closeModal(); }
    if (e.key === "Tab" && focusables.length) {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  };
  root._onKey = onKey;
  window.addEventListener("keydown", onKey);
  root.querySelectorAll("[data-close]").forEach(b => b.onclick = closeModal);
}

function closeModal() {
  const root = select("#pkm-modal");
  if (!root.classList.contains("open")) { return; }
  root.classList.remove("open");
  root.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (root._onKey) {
    window.removeEventListener("keydown", root._onKey);
    root._onKey = null;
  }
  if (lastFocused && document.body.contains(lastFocused)) { lastFocused.focus(); }
}

function renderDetailsToggle(p) {
  const det = createEl("details", "details");
  const sum = createEl("summary", "", { text: "Détails" });
  sum.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(p);
  });
  det.append(sum);
  return det;
}

function buildCard(p) {
  const card = createEl("a", "card", {
    href: `#${p.pokedex_id}`,
    "aria-label": p.name?.fr || p.name?.en || "Pokemon"
  });
  const coverArea = createEl("div", "cover-area");
  const wrapper   = createEl("div", "wrapper");
  const cover     = createEl("div", "cover");
  cover.style.background = gradientFor(p.types);
  wrapper.append(cover);
  const title = createEl("div", "title", { text: `#${p.pokedex_id} - ${p.name?.fr || p.name?.en || ""}` });
  const img   = createEl("img", "character", {
    src: primarySprite(p),
    alt: (p.name?.fr || p.name?.en || "Pokemon") + " – sprite",
    loading: "lazy"
  });
  img.onerror = () => { img.src = FALLBACK_SPRITE; };
  coverArea.append(wrapper, title, img);
  const info = createEl("div", "info");
  info.append(
    renderTypes(p.types),
    renderMovesBlock(),
    renderMetaBlock(p),
    renderDetailsToggle(p)
  );
  card.append(coverArea, info);
  return card;
}

let ALL = [];
let pageSize = 25;
let currentPage = 1;

function totalPages() {
  if (pageSize === -1) { return 1; }
  return Math.max(1, Math.ceil(ALL.length / pageSize));
}

function sliceForCurrentPage() {
  if (pageSize === -1) { return ALL; }
  const start = (currentPage - 1) * pageSize;
  return ALL.slice(start, start + pageSize);
}

function renderPage() {
  const grid = select("#grid");
  const frag = document.createDocumentFragment();
  for (const p of sliceForCurrentPage()) {
    try { frag.append(buildCard(p)); }
    catch (e) { console.warn("Card error", p?.pokedex_id, e); }
  }
  grid.innerHTML = "";
  grid.append(frag);
  const info = select("#pageInfo");
  const prev = select("#prev");
  const next = select("#next");
  const tp = totalPages();
  info.textContent = pageSize === -1 ? `Tous (${ALL.length})` : `Page ${currentPage}/${tp}`;
  prev.disabled = (currentPage <= 1) || (pageSize === -1);
  next.disabled = (currentPage >= tp) || (pageSize === -1);
}

async function initApp() {
  const grid = select("#grid");
  grid.innerHTML = '<p style="grid-column:1/-1;color:#94a3b8">Chargement des Pokémon…</p>';
  try {
    const res = await fetch(API_URL, { headers: { accept: "application/json" } });
    if (!res.ok) { throw new Error(`HTTP ${res.status}`); }
    ALL = await res.json();
    ALL = ALL.filter(isValidPokemon);
    const sel  = select("#pageSize");
    const prev = select("#prev");
    const next = select("#next");
    sel.addEventListener("change", () => {
      pageSize = parseInt(sel.value, 10);
      currentPage = 1;
      renderPage();
    });
    prev.addEventListener("click", () => {
      currentPage = clamp(currentPage - 1, 1, totalPages());
      renderPage();
    });
    next.addEventListener("click", () => {
      currentPage = clamp(currentPage + 1, 1, totalPages());
      renderPage();
    });
    renderPage();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="grid-column:1/-1;color:#ef4444">Échec du chargement : ${err.message}</p>`;
  }
}

window.addEventListener("DOMContentLoaded", initApp);

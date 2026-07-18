// ============ ÉTAT + RENDU DE LA GRILLE ============

const AppState = {
  all: [],          // tous les Pokémon (dédupliqués par pokedex_id)
  filtered: [],      // après recherche / filtre type / tri
  page: 1,
  perPage: 60,        // 15 | 30 | 60 | "all"
  order: "id-asc",
  type: "",
  generation: "",
  search: "",
  loadedCount: 0,      // pour le mode "Tout" (scroll infini)
  observer: null,
  isLoadingBatch: false,
};

const gridEl = document.getElementById("pokemonGrid");
const paginationEl = document.getElementById("pagination");
const emptyStateEl = document.getElementById("emptyState");
const resultsCountEl = document.getElementById("resultsCount");
const sentinelEl = document.getElementById("sentinel");
const statsPanelsEl = document.getElementById("statsPanels");
const statsSummaryEl = document.getElementById("statsSummary");
const statsTypesEl = document.getElementById("statsTypes");
const statsGenerationsEl = document.getElementById("statsGenerations");
const statsGendersEl = document.getElementById("statsGenders");
const statsRecordsEl = document.getElementById("statsRecords");

// Le texte "Chargement de la suite..." du scroll infini est posé en CSS
// (::after / attr()) pour rester visuellement figé pendant l'animation ;
// on synchronise sa traduction via un attribut data-* mis à jour ici.
function updateSentinelLoadingText() {
  if (sentinelEl) sentinelEl.dataset.loadingText = t("loadingMore");
}
updateSentinelLoadingText();

// Clés i18n (et ordre d'affichage) pour les statistiques moyennes affichées
// sous la pagination.
const AVG_STAT_KEYS = { hp: "statHp", atk: "statAtk", def: "statDef", spe_atk: "statSpeAtk", spe_def: "statSpeDef", vit: "statVit" };
const AVG_STAT_MAX = 200;

function computeAverageStats(list) {
  const keys = Object.keys(AVG_STAT_KEYS);
  const sums = Object.fromEntries(keys.map(k => [k, 0]));
  let count = 0;
  list.forEach(p => {
    if (!p.stats) return;
    count++;
    keys.forEach(k => { sums[k] += p.stats[k] || 0; });
  });
  if (count === 0) return null;
  const avgs = {};
  keys.forEach(k => { avgs[k] = sums[k] / count; });
  return { avgs, count };
}

function statsSummaryHTML(list) {
  const data = computeAverageStats(list);
  if (!data) return "";
  const rows = Object.entries(AVG_STAT_KEYS).map(([key, i18nKey]) => {
    const val = data.avgs[key];
    const pct = Math.min(100, Math.round((val / AVG_STAT_MAX) * 100));
    return `
      <div class="avg-stat-row">
        <span class="avg-stat-name">${t(i18nKey)}</span>
        <span class="avg-stat-value">${val.toFixed(1)}</span>
        <div class="avg-stat-bar-track"><div class="avg-stat-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
  }).join("");
  return `
    <h3 class="stats-summary-title">${t("statsSummaryTitle")} <span class="stats-summary-count">${t("statsSummaryCount", { n: data.count })}</span></h3>
    <div class="avg-stats-grid">${rows}</div>`;
}

// ---- Répartition par type / génération + records (à côté des moyennes) ----

function computeTypeBreakdown(list) {
  const counts = new Map();
  list.forEach(p => {
    (p.types || []).forEach(t2 => {
      counts.set(t2.name, (counts.get(t2.name) || 0) + 1);
    });
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
}

function computeGenerationBreakdown(list) {
  const counts = new Map();
  list.forEach(p => {
    if (p.generation == null) return;
    counts.set(p.generation, (counts.get(p.generation) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => a[0] - b[0]);
}

const RECORD_DEFS = [
  { key: "atk", labelKey: "recordHighestAtk" },
  { key: "def", labelKey: "recordHighestDef" },
  { key: "hp", labelKey: "recordHighestHp" },
  { key: "vit", labelKey: "recordHighestVit" },
];

function computeRecords(list) {
  return RECORD_DEFS.map(def => {
    let best = null;
    list.forEach(p => {
      const val = p.stats?.[def.key];
      if (val == null) return;
      if (!best || val > best.value) best = { pokemon: p, value: val };
    });
    return best ? { ...def, ...best } : null;
  }).filter(Boolean);
}

// Barre façon "statistiques moyennes" : une ligne par entrée, largeur
// proportionnelle à la valeur la plus haute du groupe (pas à une échelle
// fixe comme les stats de combat, ici les échelles varient trop d'une
// recherche à l'autre).
function barRowHTML({ label, iconUrl, value, maxValue, barColor }) {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  return `
    <div class="avg-stat-row">
      <span class="avg-stat-name">${iconUrl ? `<img class="type-stat-icon" src="${iconUrl}" alt="" onerror="handleImgError(this)">` : ""}${escapeHtml(label)}</span>
      <span class="avg-stat-value">${value}</span>
      <div class="avg-stat-bar-track"><div class="avg-stat-bar-fill" style="width:${pct}%;${barColor ? `background:${barColor}` : ""}"></div></div>
    </div>`;
}

function statsTypesHTML(list) {
  const types = computeTypeBreakdown(list);
  if (!types.length) return "";
  const max = types[0].count;
  const rows = types.map(entry => barRowHTML({
    label: typeDisplayName(entry.name),
    iconUrl: typeIconUrl(entry.name),
    value: entry.count,
    maxValue: max,
    barColor: typeColor(entry.name),
  })).join("");
  return `<h3 class="stats-summary-title">${t("statsBreakdownTypesTitle")}</h3><div class="avg-stats-grid">${rows}</div>`;
}

function statsGenerationsHTML(list) {
  const gens = computeGenerationBreakdown(list);
  if (!gens.length) return "";
  const max = Math.max(...gens.map(([, count]) => count));
  const rows = gens.map(([gen, count]) => barRowHTML({
    label: t("generationLabel", { n: gen }),
    value: count,
    maxValue: max,
  })).join("");
  return `<h3 class="stats-summary-title">${t("statsBreakdownGenTitle")}</h3><div class="avg-stats-grid">${rows}</div>`;
}

// Même logique de classification que sexeText() dans modal.js : un Pokémon
// est mixte si male ET female sont > 0, uniquement mâle/femelle si un seul
// des deux est > 0, sinon asexué (sexe null ou les deux à 0/absents).
function categorizeSex(p) {
  const male = p.sexe?.male ?? 0;
  const female = p.sexe?.female ?? 0;
  if (male > 0 && female > 0) return "mixed";
  if (male > 0) return "maleOnly";
  if (female > 0) return "femaleOnly";
  return "genderless";
}

const SEX_CATEGORY_LABEL_KEYS = {
  mixed: "sexCategoryMixed",
  maleOnly: "sexCategoryMaleOnly",
  femaleOnly: "sexCategoryFemaleOnly",
  genderless: "modalSexless",
};

function computeSexBreakdown(list) {
  const counts = new Map();
  list.forEach(p => {
    const cat = categorizeSex(p);
    counts.set(cat, (counts.get(cat) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function statsGendersHTML(list) {
  const breakdown = computeSexBreakdown(list);
  if (!breakdown.length) return "";
  const max = breakdown[0][1];
  const rows = breakdown.map(([cat, count]) => barRowHTML({
    label: t(SEX_CATEGORY_LABEL_KEYS[cat]),
    value: count,
    maxValue: max,
  })).join("");
  return `<h3 class="stats-summary-title">${t("statsBreakdownSexTitle")}</h3><div class="avg-stats-grid">${rows}</div>`;
}

function recordCardHTML(record) {
  const p = record.pokemon;
  const img = p.sprites?.regular || TyradexAPI.spriteUrl(p.pokedex_id);
  const name = localizedName(p.name);
  return `
    <div class="record-card" data-id="${p.pokedex_id}">
      <img src="${img}" alt="" onerror="handleImgError(this)">
      <div class="record-info">
        <span class="record-label">${t(record.labelKey)}</span>
        <span class="record-name">${escapeHtml(name)}</span>
        <span class="record-value">${record.value}</span>
      </div>
    </div>`;
}

function statsRecordsHTML(list) {
  const records = computeRecords(list);
  if (!records.length) return "";
  return `<h3 class="stats-summary-title">${t("statsBreakdownRecordsTitle")}</h3><div class="records-grid">${records.map(recordCardHTML).join("")}</div>`;
}

function wireStatsRecords() {
  if (!statsRecordsEl) return;
  statsRecordsEl.querySelectorAll(".record-card[data-id]").forEach(card => {
    card.addEventListener("click", () => openPokemonModal(Number(card.dataset.id)));
  });
}

// Une carte par statistique (moyennes / types / générations / records),
// calculées sur l'ensemble des résultats filtrés (pas seulement la
// page/le lot actuellement affiché), pour rester représentatif même en
// pagination ou en scroll infini partiellement chargé.
function renderStatsSummary() {
  const list = AppState.filtered;
  if (!statsPanelsEl) return;
  if (list.length === 0) {
    statsPanelsEl.hidden = true;
    statsSummaryEl.innerHTML = "";
    statsTypesEl.innerHTML = "";
    statsGenerationsEl.innerHTML = "";
    statsGendersEl.innerHTML = "";
    statsRecordsEl.innerHTML = "";
    return;
  }
  statsPanelsEl.hidden = false;
  statsSummaryEl.innerHTML = statsSummaryHTML(list);
  statsTypesEl.innerHTML = statsTypesHTML(list);
  statsGenerationsEl.innerHTML = statsGenerationsHTML(list);
  statsGendersEl.innerHTML = statsGendersHTML(list);
  statsRecordsEl.innerHTML = statsRecordsHTML(list);
  wireStatsRecords();
}

function renderSkeletons(count = 12) {
  gridEl.innerHTML = Array.from({ length: count })
    .map(() => `<div class="card-skeleton"></div>`)
    .join("");
  paginationEl.innerHTML = "";
  emptyStateEl.hidden = true;
}

function applyFiltersAndSort() {
  let list = AppState.all;

  if (AppState.search.trim()) {
    const q = AppState.search.trim().toLowerCase();
    list = list.filter(p =>
      (p.name?.fr || "").toLowerCase().includes(q) ||
      (p.name?.en || "").toLowerCase().includes(q) ||
      (p.name?.jp || "").toLowerCase().includes(q) ||
      String(p.pokedex_id).includes(q)
    );
  }

  if (AppState.type) {
    list = list.filter(p => (p.types || []).some(t => t.name === AppState.type));
  }

  if (AppState.generation) {
    list = list.filter(p => String(p.generation) === String(AppState.generation));
  }

  const sorters = {
    "id-asc": (a, b) => a.pokedex_id - b.pokedex_id,
    "name-asc": (a, b) => (a.name?.fr || "").localeCompare(b.name?.fr || "", "fr"),
    "atk-desc": (a, b) => (b.stats?.atk || 0) - (a.stats?.atk || 0),
    "def-desc": (a, b) => (b.stats?.def || 0) - (a.stats?.def || 0),
    "vit-desc": (a, b) => (b.stats?.vit || 0) - (a.stats?.vit || 0),
    "hp-desc": (a, b) => (b.stats?.hp || 0) - (a.stats?.hp || 0),
  };
  list = [...list].sort(sorters[AppState.order] || sorters["id-asc"]);

  AppState.filtered = list;
  resultsCountEl.textContent = t("resultsCount", { n: list.length });
}

function pokeCardHTML(p) {
  const img = p.sprites?.regular || TyradexAPI.spriteUrl(p.pokedex_id);
  const types = (p.types || []).map(t => typeBadge(t)).join("");
  const name = localizedName(p.name);
  return `
    <div class="poke-card" data-id="${p.pokedex_id}" tabindex="0" role="button" aria-label="${escapeHtml(name)}">
      <span class="poke-id">${padId(p.pokedex_id)}</span>
      <div class="poke-img-wrap"><img src="${img}" alt="${escapeHtml(name)}" loading="lazy" onerror="handleImgError(this)"></div>
      <div class="poke-name">${escapeHtml(name)}</div>
      <div class="poke-types">${types}</div>
    </div>`;
}

function renderGrid() {
  const isAll = AppState.perPage === "all";
  const isEmpty = AppState.filtered.length === 0;
  emptyStateEl.hidden = !isEmpty;
  renderStatsSummary();

  let toShow;
  if (isAll) {
    toShow = AppState.filtered.slice(0, AppState.loadedCount);
  } else {
    const start = (AppState.page - 1) * AppState.perPage;
    toShow = AppState.filtered.slice(start, start + AppState.perPage);
  }

  gridEl.innerHTML = toShow.map(pokeCardHTML).join("");
  gridEl.querySelectorAll(".poke-card").forEach(card => {
    card.addEventListener("click", () => openPokemonModal(Number(card.dataset.id)));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPokemonModal(Number(card.dataset.id)); }
    });
  });

  // Aucun résultat : pas de pagination ni de scroll infini à afficher.
  if (isEmpty) {
    paginationEl.innerHTML = "";
    teardownInfiniteScroll();
    return;
  }

  if (isAll) {
    paginationEl.innerHTML = "";
    setupInfiniteScroll();
  } else {
    renderPagination();
    teardownInfiniteScroll();
  }
}

function renderPagination() {
  const total = AppState.filtered.length;
  const perPage = AppState.perPage;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(AppState.page, pageCount);
  AppState.page = current;

  const buttons = [];
  buttons.push(`<button data-page="prev" ${current === 1 ? "disabled" : ""}>&larr;</button>`);

  const windowSize = 1;
  const pages = new Set([1, pageCount]);
  for (let i = current - windowSize; i <= current + windowSize; i++) {
    if (i >= 1 && i <= pageCount) pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) buttons.push(`<span class="dots">…</span>`);
    buttons.push(`<button data-page="${p}" class="${p === current ? "active" : ""}">${p}</button>`);
    prev = p;
  }

  buttons.push(`<button data-page="next" ${current === pageCount ? "disabled" : ""}>&rarr;</button>`);
  paginationEl.innerHTML = buttons.join("");

  paginationEl.querySelectorAll("button[data-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.page;
      if (val === "prev") AppState.page = Math.max(1, AppState.page - 1);
      else if (val === "next") AppState.page = Math.min(pageCount, AppState.page + 1);
      else AppState.page = Number(val);
      renderGrid();
      document.getElementById("content").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupInfiniteScroll() {
  teardownInfiniteScroll();
  if (AppState.loadedCount >= AppState.filtered.length) return;

  // rootMargin volontairement petit : on ne veut déclencher un nouveau lot
  // que lorsque la sentinelle approche vraiment du bas de l'écran, pas
  // plusieurs écrans à l'avance (sinon toute la liste s'enchaîne d'un coup
  // en cascade et ça ne ressemble plus à un chargement progressif).
  AppState.observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) requestMoreForInfiniteScroll();
    });
  }, { rootMargin: "120px" });
  AppState.observer.observe(sentinelEl);
}

function teardownInfiniteScroll() {
  if (AppState.observer) {
    AppState.observer.disconnect();
    AppState.observer = null;
  }
  AppState.isLoadingBatch = false;
  sentinelEl.classList.remove("loading");
}

function requestMoreForInfiniteScroll() {
  if (AppState.isLoadingBatch) return;
  if (AppState.loadedCount >= AppState.filtered.length) return;

  AppState.isLoadingBatch = true;
  sentinelEl.classList.add("loading");

  // Petite pause volontaire : même si les données sont déjà en mémoire, on
  // veut un chargement visiblement progressif au fil du scroll plutôt
  // qu'un enchaînement instantané de tous les lots.
  setTimeout(() => {
    loadMoreForInfiniteScroll();
    sentinelEl.classList.remove("loading");
    AppState.isLoadingBatch = false;
  }, 250);
}

function loadMoreForInfiniteScroll() {
  const BATCH = 30;
  if (AppState.loadedCount >= AppState.filtered.length) return;
  AppState.loadedCount = Math.min(AppState.filtered.length, AppState.loadedCount + BATCH);

  const start = AppState.loadedCount - BATCH;
  const nextItems = AppState.filtered.slice(Math.max(0, start), AppState.loadedCount);
  gridEl.insertAdjacentHTML("beforeend", nextItems.map(pokeCardHTML).join(""));
  gridEl.querySelectorAll(".poke-card").forEach(card => {
    if (card.dataset.bound) return;
    card.dataset.bound = "1";
    card.addEventListener("click", () => openPokemonModal(Number(card.dataset.id)));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPokemonModal(Number(card.dataset.id)); }
    });
  });

  if (AppState.loadedCount >= AppState.filtered.length) teardownInfiniteScroll();
}

function refreshView({ resetPage = true } = {}) {
  applyFiltersAndSort();
  if (resetPage) {
    AppState.page = 1;
    AppState.loadedCount = AppState.perPage === "all" ? Math.min(30, AppState.filtered.length) : 0;
  }
  renderGrid();
}

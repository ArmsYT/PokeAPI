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
const statsSummaryEl = document.getElementById("statsSummary");

// Libellés/échelle pour les statistiques moyennes affichées sous la
// pagination (noms distincts de ceux du modal pour éviter toute collision
// de déclaration `const` entre scripts qui partagent le même scope global).
const AVG_STAT_LABELS = { hp: "PV", atk: "Attaque", def: "Défense", spe_atk: "Atq. Spé.", spe_def: "Déf. Spé.", vit: "Vitesse" };
const AVG_STAT_MAX = 200;

function computeAverageStats(list) {
  const keys = Object.keys(AVG_STAT_LABELS);
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
  const rows = Object.entries(AVG_STAT_LABELS).map(([key, label]) => {
    const val = data.avgs[key];
    const pct = Math.min(100, Math.round((val / AVG_STAT_MAX) * 100));
    return `
      <div class="avg-stat-row">
        <span class="avg-stat-name">${label}</span>
        <span class="avg-stat-value">${val.toFixed(1)}</span>
        <div class="avg-stat-bar-track"><div class="avg-stat-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
  }).join("");
  return `
    <h3 class="stats-summary-title">Statistiques moyennes <span class="stats-summary-count">(${data.count} Pokémon)</span></h3>
    <div class="avg-stats-grid">${rows}</div>`;
}

// Moyennes calculées sur l'ensemble des résultats filtrés (pas seulement
// la page/le lot actuellement affiché), pour rester représentatif même en
// pagination ou en scroll infini partiellement chargé.
function renderStatsSummary() {
  const list = AppState.filtered;
  if (!statsSummaryEl) return;
  if (list.length === 0) {
    statsSummaryEl.hidden = true;
    statsSummaryEl.innerHTML = "";
    return;
  }
  statsSummaryEl.hidden = false;
  statsSummaryEl.innerHTML = statsSummaryHTML(list);
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
  resultsCountEl.textContent = `${list.length} Pokémon`;
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

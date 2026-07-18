// ============ CONTRÔLEUR PRINCIPAL ============

const searchInput = document.getElementById("searchInput");
const perPageSelect = document.getElementById("perPageSelect");
const orderSelect = document.getElementById("orderSelect");
const typeSelect = document.getElementById("typeSelect");
const genSelect = document.getElementById("genSelect");

// La `value` de chaque option reste le nom français (c'est ce que l'API
// renvoie dans p.types, donc ce qui sert de base au filtrage) ; seul le
// texte affiché est traduit via la table TYPE_NAME_TRANSLATIONS.
function populateTypeSelect() {
  const options = ALL_TYPES.map(typeName => `<option value="${typeName}" data-icon="${typeIconUrl(typeName)}">${typeDisplayName(typeName)}</option>`).join("");
  typeSelect.insertAdjacentHTML("beforeend", options);
}

// Retraduit le texte des options de type déjà en place (leur `value`/nombre
// ne change jamais, contrairement aux générations) — appelée à chaque
// changement de langue.
function retranslateTypeOptions() {
  [...typeSelect.options].forEach(opt => {
    if (opt.value) opt.textContent = typeDisplayName(opt.value);
  });
}

// Reconstruit les options dynamiques "Génération N" (en gardant "Toutes",
// toujours la première option du select) — appelée au chargement initial et
// de nouveau à chaque changement de langue pour retraduire leur libellé.
function populateGenSelect() {
  // On préserve la sélection courante : reconstruire les options fait perdre
  // la sélection native si on ne la restaure pas explicitement après coup.
  const currentValue = genSelect.value;
  [...genSelect.options].slice(1).forEach(o => o.remove());
  const gens = [...new Set(AppState.all.map(p => p.generation).filter(g => g != null))].sort((a, b) => a - b);
  const options = gens.map(g => `<option value="${g}">${t("generationLabel", { n: g })}</option>`).join("");
  genSelect.insertAdjacentHTML("beforeend", options);
  const restored = [...genSelect.options].find(o => o.value === currentValue);
  if (restored) restored.selected = true;
}

function wireControls() {
  searchInput.addEventListener("input", debounce((e) => {
    AppState.search = e.target.value;
    refreshView({ resetPage: true });
  }, 250));

  perPageSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    AppState.perPage = val === "all" ? "all" : Number(val);
    refreshView({ resetPage: true });
  });

  orderSelect.addEventListener("change", (e) => {
    AppState.order = e.target.value;
    refreshView({ resetPage: true });
  });

  typeSelect.addEventListener("change", (e) => {
    AppState.type = e.target.value;
    refreshView({ resetPage: true });
  });

  genSelect.addEventListener("change", (e) => {
    AppState.generation = e.target.value;
    refreshView({ resetPage: true });
  });

  // Raccourci clavier Ctrl+K / Cmd+K : focus direct sur la recherche
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && key === "k") {
      e.preventDefault();
      searchInput.focus();
      if (typeof searchInput.select === "function") searchInput.select();
    }
  });
}

function dedupePokemon(list) {
  const seen = new Map();
  for (const p of list) {
    // pokedex_id 0 = MissingNo, une entrée de test/glitch qui n'a pas sa place
    // dans un Pokédex normal.
    if (!p.pokedex_id || p.pokedex_id <= 0) continue;
    if (!seen.has(p.pokedex_id)) seen.set(p.pokedex_id, p);
  }
  return [...seen.values()];
}

function syncStateFromSelects() {
  // On part de la valeur réellement sélectionnée dans le HTML (attribut
  // `selected`) plutôt que d'un défaut codé en dur, pour rester cohérent
  // si le markup change.
  const perPageVal = perPageSelect.value;
  AppState.perPage = perPageVal === "all" ? "all" : Number(perPageVal);
  AppState.order = orderSelect.value;
}

async function init() {
  applyStaticTranslations();
  updateSentinelLoadingText();
  wireControls();
  renderSkeletons(24);
  syncStateFromSelects();

  // Selects avec options statiques : on peut les remplacer par le composant
  // custom tout de suite.
  enhanceSelect(perPageSelect);
  enhanceSelect(orderSelect);
  // Type/génération : options ajoutées dynamiquement plus bas, mais on les
  // enrichit dès maintenant (le composant lit les <option> à l'ouverture).
  enhanceSelect(typeSelect);
  enhanceSelect(genSelect);

  // Chargée en parallèle : image de secours pour les sprites cassés/manquants.
  TyradexAPI.loadFallbackImage();

  try {
    const data = await TyradexAPI.getAllPokemon();
    AppState.all = dedupePokemon(data);
    populateTypeSelect();
    populateGenSelect();
    refreshView({ resetPage: true });
  } catch (err) {
    gridEl.innerHTML = "";
    emptyStateEl.hidden = false;
    emptyStateEl.removeAttribute("data-i18n-key");
    emptyStateEl.textContent = t("fetchError");
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", init);

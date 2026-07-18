// ============ MODAL DÉTAIL POKÉMON ============

const modalOverlay = document.getElementById("pokemonModal");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModal");

function findPokemon(pokedexId) {
  return AppState.all.find(p => p.pokedex_id === pokedexId);
}

function buildGalleryItems(p) {
  const items = [];
  if (p.sprites?.regular) items.push({ label: "Normal", img: p.sprites.regular, shiny: false });
  if (p.sprites?.shiny) items.push({ label: "Shiny", img: p.sprites.shiny, shiny: true });
  if (p.sprites?.gmax?.regular) items.push({ label: "Gigamax", img: p.sprites.gmax.regular, shiny: false });
  if (p.sprites?.gmax?.shiny) items.push({ label: "Gigamax Shiny", img: p.sprites.gmax.shiny, shiny: true });
  if (Array.isArray(p.evolution?.mega)) {
    p.evolution.mega.forEach(m => {
      if (m.sprites?.regular) items.push({ label: m.orbe || "Méga", img: m.sprites.regular, shiny: false });
      if (m.sprites?.shiny) items.push({ label: `${m.orbe || "Méga"} Shiny`, img: m.sprites.shiny, shiny: true });
    });
  }
  if (items.length === 0) items.push({ label: "Normal", img: TyradexAPI.spriteUrl(p.pokedex_id), shiny: false });
  return items;
}

function galleryHTML(p) {
  const items = buildGalleryItems(p);
  const main = items[0];
  const thumbs = items.map((it, i) => `
    <button data-idx="${i}" class="${i === 0 ? "active" : ""}" title="${escapeHtml(it.label)}">
      <img src="${it.img}" alt="${escapeHtml(it.label)}" onerror="handleImgError(this)">
    </button>`).join("");

  return `
    <div class="modal-gallery">
      <div class="gallery-main" id="galleryMain">
        ${main.shiny ? '<span class="shiny-star">✨</span>' : ""}
        <img src="${main.img}" alt="${escapeHtml(p.name?.fr)}" id="galleryMainImg" onerror="handleImgError(this)">
      </div>
      <div class="gallery-thumbs" id="galleryThumbs" data-items='${JSON.stringify(items).replace(/'/g, "&#39;")}'>
        ${thumbs}
      </div>
    </div>`;
}

function wireGallery() {
  const thumbsWrap = document.getElementById("galleryThumbs");
  if (!thumbsWrap) return;
  const items = JSON.parse(thumbsWrap.dataset.items.replace(/&#39;/g, "'"));
  const mainWrap = document.getElementById("galleryMain");
  thumbsWrap.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      thumbsWrap.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const it = items[Number(btn.dataset.idx)];
      mainWrap.innerHTML = `${it.shiny ? '<span class="shiny-star">✨</span>' : ""}<img src="${it.img}" alt="${escapeHtml(it.label)}" onerror="handleImgError(this)">`;
    });
  });
}

function sexeText(p) {
  if (!p.sexe || (p.sexe.male == null && p.sexe.female == null)) return "Asexué";
  const male = p.sexe.male ?? 0;
  const female = p.sexe.female ?? 0;
  return `♂ ${male}% · ♀ ${female}%`;
}

function infoHeadHTML(p) {
  const types = (p.types || []).map(t => typeBadge(t)).join("");
  const mainName = localizedName(p.name);
  // Sous-titre : les autres langues disponibles (hors celle déjà affichée en titre).
  const altNames = AVAILABLE_LANGS
    .filter(l => l !== CURRENT_LANG)
    .map(l => p.name?.[l])
    .filter(n => n && n !== mainName)
    .join(" · ");
  return `
    <div class="modal-info-head">
      <div class="poke-num">${padId(p.pokedex_id)}</div>
      <h2>${escapeHtml(mainName)}</h2>
      ${altNames ? `<div class="poke-alt-names">${escapeHtml(altNames)}</div>` : ""}
      ${p.category ? `<div class="poke-category">${escapeHtml(p.category)}</div>` : ""}
      <div class="poke-types">${types}</div>
      <div class="info-mini-grid">
        <div class="info-mini"><div class="mini-label">Génération</div><div class="mini-value">${p.generation ?? "—"}</div></div>
        <div class="info-mini"><div class="mini-label">Taille</div><div class="mini-value">${p.height ?? "—"}</div></div>
        <div class="info-mini"><div class="mini-label">Poids</div><div class="mini-value">${p.weight ?? "—"}</div></div>
        <div class="info-mini"><div class="mini-label">Taux de capture</div><div class="mini-value">${p.catch_rate ?? "—"}</div></div>
        <div class="info-mini"><div class="mini-label">XP niv. 100</div><div class="mini-value">${p.level_100 ? p.level_100.toLocaleString("fr-FR") : "—"}</div></div>
        <div class="info-mini"><div class="mini-label">Sexe</div><div class="mini-value">${sexeText(p)}</div></div>
      </div>
    </div>`;
}

const STAT_LABELS = { hp: "PV", atk: "Attaque", def: "Défense", spe_atk: "Atq. Spé.", spe_def: "Déf. Spé.", vit: "Vitesse" };
const STAT_MAX = 200;

function statsHTML(p) {
  if (!p.stats) return `<p class="no-data">Statistiques non disponibles.</p>`;
  return Object.entries(STAT_LABELS).map(([key, label]) => {
    const val = p.stats[key] ?? 0;
    const pct = Math.min(100, Math.round((val / STAT_MAX) * 100));
    return `
      <div class="stat-row">
        <span class="stat-name">${label}</span>
        <span class="stat-value">${val}</span>
        <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
  }).join("");
}

function talentsHTML(p) {
  if (!Array.isArray(p.talents) || p.talents.length === 0) return `<p class="no-data">Aucun talent renseigné.</p>`;
  return `<div class="talent-list">${p.talents.map(t => `
    <span class="talent-chip ${t.tc ? "hidden-talent" : ""}">${escapeHtml(t.name)}${t.tc ? '<span class="tc-tag">Talent caché</span>' : ""}</span>
  `).join("")}</div>`;
}

function matchupsHTML(p) {
  if (!Array.isArray(p.resistances) || p.resistances.length === 0) return `<p class="no-data">Données de faiblesses non disponibles.</p>`;

  const groups = [
    { title: "Immunisé (×0)", test: m => m === 0, color: "#3a3f4b" },
    { title: "Très résistant (×0.25)", test: m => m === 0.25, color: "#2e7d4f" },
    { title: "Résistant (×0.5)", test: m => m === 0.5, color: "#4caf7d" },
    { title: "Vulnérable (×2)", test: m => m === 2, color: "#d9534f" },
    { title: "Très vulnérable (×4)", test: m => m === 4, color: "#a12622" },
  ];

  const blocks = groups.map(g => {
    const entries = p.resistances.filter(r => g.test(r.multiplier));
    if (entries.length === 0) return "";
    const chips = entries.map(r => `
      <span class="matchup-chip" style="background:${g.color}">
        ${r.image ? `<img src="${r.image}" alt="" onerror="handleImgError(this)">` : ""}${r.name}
      </span>`).join("");
    return `<div><div class="matchup-group-title">${g.title}</div><div class="matchup-row">${chips}</div></div>`;
  }).filter(Boolean).join("");

  return `<div class="matchup-groups">${blocks || '<p class="no-data">Aucune particularité.</p>'}</div>`;
}

function evoNodeHTML(pokedexId, name, isCurrent = false) {
  return `
    <div class="evo-node" data-id="${pokedexId}" style="${isCurrent ? "border-color:var(--accent);" : ""}">
      <img src="${TyradexAPI.spriteUrl(pokedexId)}" alt="${escapeHtml(name)}" onerror="handleImgError(this)">
      <span class="evo-name">${escapeHtml(name)}</span>
    </div>`;
}

function evoArrowHTML(condition) {
  return `<span class="evo-arrow">→${condition ? `<span class="evo-condition">${escapeHtml(condition)}</span>` : ""}</span>`;
}

// Le champ `condition` d'une entrée pre/next décrit toujours la transition
// FORWARD (vers le maillon suivant de la chaîne complète), qu'elle vienne
// du tableau "pre" ou "next" de l'API Tyradex.
function evolutionsHTML(p) {
  const pre = Array.isArray(p.evolution?.pre) ? p.evolution.pre : [];
  const next = Array.isArray(p.evolution?.next) ? p.evolution.next : [];

  if (pre.length === 0 && next.length === 0) {
    return `<p class="no-data">Ce Pokémon n'évolue pas.</p>`;
  }

  // Les entrées pre/next de l'API ne donnent qu'un nom en français ; si le
  // Pokémon correspondant est dans nos données complètes, on affiche plutôt
  // son nom dans la langue actuellement choisie.
  const evoName = (e) => localizedName(findPokemon(e.pokedex_id)?.name) || e.name;

  const chainNodes = [
    ...pre.map(e => ({ id: e.pokedex_id, name: evoName(e) })),
    { id: p.pokedex_id, name: localizedName(p.name), current: true },
    ...next.map(e => ({ id: e.pokedex_id, name: evoName(e) })),
  ];
  const edgeConditions = [...pre.map(e => e.condition), ...next.map(e => e.condition)];

  const parts = [];
  chainNodes.forEach((node, i) => {
    parts.push(evoNodeHTML(node.id, node.name, !!node.current));
    if (i < chainNodes.length - 1) parts.push(evoArrowHTML(edgeConditions[i]));
  });

  return `<div class="evolution-chain">${parts.join("")}</div>`;
}

function wireEvolutionClicks() {
  modalContent.querySelectorAll(".evo-node[data-id]").forEach(node => {
    node.addEventListener("click", () => {
      const id = Number(node.dataset.id);
      if (id === Number(modalContent.dataset.currentId)) return;
      openPokemonModal(id);
    });
  });
}

function renderModalBody(p) {
  modalContent.dataset.currentId = p.pokedex_id;
  modalContent.innerHTML = `
    <div class="modal-head">
      ${galleryHTML(p)}
      ${infoHeadHTML(p)}
    </div>

    <div class="modal-section">
      <h3>Statistiques de base</h3>
      ${statsHTML(p)}
    </div>

    <div class="modal-section">
      <h3>Talents</h3>
      ${talentsHTML(p)}
    </div>

    <div class="modal-section">
      <h3>Faiblesses &amp; résistances</h3>
      ${matchupsHTML(p)}
    </div>

    <div class="modal-section">
      <h3>Évolutions</h3>
      ${evolutionsHTML(p)}
    </div>
  `;
  wireGallery();
  wireEvolutionClicks();
}

async function openPokemonModal(pokedexId) {
  modalOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  modalContent.innerHTML = `<div class="modal-loading">Chargement...</div>`;

  const p = findPokemon(pokedexId);
  if (!p) {
    modalContent.innerHTML = `<p class="no-data">Impossible de charger ce Pokémon.</p>`;
    return;
  }
  renderModalBody(p);
}

function closePokemonModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = "";
  modalContent.innerHTML = "";
}

// Ré-affiche la fiche déjà ouverte (ex : après un changement de langue),
// sans la fermer/rouvrir.
function refreshOpenModalIfAny() {
  if (modalOverlay.hidden) return;
  const id = Number(modalContent.dataset.currentId);
  const p = findPokemon(id);
  if (p) renderModalBody(p);
}

closeModalBtn.addEventListener("click", closePokemonModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closePokemonModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalOverlay.hidden) closePokemonModal();
});

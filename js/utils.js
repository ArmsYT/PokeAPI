// ============ UTILITAIRES PARTAGÉS ============

// Langue d'affichage des noms de Pokémon (fr / en / jp), persistée.
// Ne concerne que les noms (données fournies par l'API dans les 3 langues) :
// le reste de l'interface (labels, types...) reste en français.
const LANG_STORAGE_KEY = "pokedex-lang";
const AVAILABLE_LANGS = ["fr", "en", "jp"];
let CURRENT_LANG = AVAILABLE_LANGS.includes(localStorage.getItem(LANG_STORAGE_KEY))
  ? localStorage.getItem(LANG_STORAGE_KEY)
  : "fr";

function setCurrentLang(lang) {
  if (!AVAILABLE_LANGS.includes(lang)) return;
  CURRENT_LANG = lang;
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) { /* ignore */ }
}

// Retourne le nom d'un Pokémon dans la langue actuellement choisie, avec
// repli sur le français puis l'anglais puis le japonais si absent.
function localizedName(nameObj) {
  if (!nameObj) return "";
  return nameObj[CURRENT_LANG] || nameObj.fr || nameObj.en || nameObj.jp || "";
}

// Image de secours affichée en cas d'erreur de chargement (sprite manquant/cassé).
// Valeur par défaut minimale en attendant la récupération de la vraie image
// via l'API https://thearms.fr/api/site (voir loadFallbackImage() dans api.js).
let FALLBACK_IMAGE_URL = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#2c313d"/><text x="32" y="40" font-size="26" text-anchor="middle" fill="#9aa1b1" font-family="sans-serif">?</text></svg>`
);

function handleImgError(img) {
  if (!img || img.dataset.fallbackApplied === "1") return;
  img.dataset.fallbackApplied = "1";
  img.onerror = null;
  img.src = FALLBACK_IMAGE_URL;
}

const TYPE_SLUGS = {
  "Normal": "normal", "Feu": "feu", "Eau": "eau", "Plante": "plante",
  "Électrik": "electrik", "Glace": "glace", "Combat": "combat", "Poison": "poison",
  "Sol": "sol", "Vol": "vol", "Psy": "psy", "Insecte": "insecte",
  "Roche": "roche", "Spectre": "spectre", "Dragon": "dragon", "Ténèbres": "tenebres",
  "Acier": "acier", "Fée": "fee"
};

const ALL_TYPES = Object.keys(TYPE_SLUGS);

function typeColor(typeName) {
  const slug = TYPE_SLUGS[typeName];
  return slug ? `var(--type-${slug})` : "#777";
}

const TYPE_ICON_BASE = "https://raw.githubusercontent.com/Yarkis01/TyraDex/images/types";

function typeIconUrl(typeName) {
  const slug = TYPE_SLUGS[typeName];
  return slug ? `${TYPE_ICON_BASE}/${slug}.png` : null;
}

function typeBadge(type, size = "normal") {
  const color = typeColor(type.name);
  return `<span class="type-badge" style="background:${color}">
    ${type.image ? `<img src="${type.image}" alt="" onerror="handleImgError(this)">` : ""}${typeDisplayName(type.name)}
  </span>`;
}

function slugifyName(name) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function padId(id) {
  return "#" + String(id).padStart(3, "0");
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

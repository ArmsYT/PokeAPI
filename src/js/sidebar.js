// Sidebar + GitHub card — autonome et robuste
const DEFAULTS = {
  githubUser: null,      // si null, on lit #sidebar[data-github]
  apiTimeoutMs: 4000,    // timeout pour l'appel API
};

// i18n minimal
const I18N = {
  fr: { siteTitle: "Pokémon API", loading: "Chargement du profil…" },
  en: { siteTitle: "Pokémon API", loading: "Loading profile…" },
};
const LANG = (navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en";
const t = (k) => (I18N[LANG] && I18N[LANG][k]) || I18N.en[k] || k;

// Helpers DOM
const $ = (s, r=document) => r.querySelector(s);

// Fallback sans API : avatar + liens visibles immédiatement
function applyGitHubFallback(user){
  const profile = `https://github.com/${user}`;
  const png = `${profile}.png?size=80`;

  const avatar = $("#ghAvatar");
  const wAvatar = $("#ghwAvatar");
  const link = $("#ghLink");
  const meta = $("#ghMeta");
  const credits = $("#ghwName");

  if (avatar){ avatar.src = png; avatar.alt = `${user} avatar`; }
  if (wAvatar){ wAvatar.href = png; }
  if (link){ link.href = profile; link.textContent = user; }
  if (meta){ meta.textContent = `@${user}`; }
  if (credits){ credits.href = profile; credits.textContent = user; }
}

// API GitHub (si dispo) : remplace les infos fallback par les vraies
async function enhanceWithGitHubAPI(user, timeoutMs){
  const meta = $("#ghMeta");
  if (meta){ meta.textContent = t("loading"); }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try{
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const u = await res.json();

    const avatar = $("#ghAvatar");
    const wAvatar = $("#ghwAvatar");
    const link = $("#ghLink");
    const credits = $("#ghwName");

    if (avatar){ avatar.src = `${u.avatar_url}?s=80`; avatar.alt = `${u.login} avatar`; }
    if (wAvatar){ wAvatar.href = `${u.avatar_url}?s=80`; }
    if (link){ link.href = u.html_url; link.textContent = u.name || u.login; }
    if (meta){ meta.textContent = `@${u.login}`; }
    if (credits){ credits.href = u.html_url; credits.textContent = u.name || u.login; }
  }catch(err){
    // On garde le fallback et on log en debug
    console.debug("[Sidebar/GitHub] fallback kept:", err?.message || err);
  }
}

// Actions des boutons : on déclenche un CustomEvent ET on propose un callback
function wireActions(onAction){
  const root = $("#sidebar");
  if (!root) return;

  root.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;

    // Callback direct si fourni
    if (typeof onAction === "function"){
      onAction(action);
    }
    // Toujours émettre un évènement pour les intégrations simples
    document.dispatchEvent(new CustomEvent("sidebar:action", { detail: { action } }));

    if (action === "scrollTop"){
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

// Entrée publique : initialise la sidebar
export function initSidebar(options = {}){
  const cfg = { ...DEFAULTS, ...options };
  const sb = $("#sidebar");
  if (!sb) return;

  const user = (cfg.githubUser && String(cfg.githubUser).trim())
    || sb.dataset.github
    || "octocat"; // garde un rendu même si rien n'est défini

  // Fallback immédiat (avatar + liens)
  applyGitHubFallback(user);
  // Tentative d’enrichissement via l’API (si OK)
  enhanceWithGitHubAPI(user, cfg.apiTimeoutMs);

  // Actions boutons
  wireActions(cfg.onAction);
}

// Auto-init si chargé directement en <script type="module">
document.addEventListener("DOMContentLoaded", () => {
  if ($("#sidebar")) initSidebar();
});

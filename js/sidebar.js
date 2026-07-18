// ============ SIDEBAR : navigation, mobile toggle, à propos, changelog ============

const sidebarEl = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const burgerBtn = document.getElementById("burgerBtn");

const aboutView = document.getElementById("aboutView");
const changelogView = document.getElementById("changelogView");
const changelogContent = document.getElementById("changelogContent");

function openMobileSidebar() { document.body.classList.add("sidebar-open"); }
function closeMobileSidebar() { document.body.classList.remove("sidebar-open"); }

burgerBtn.addEventListener("click", openMobileSidebar);
sidebarBackdrop.addEventListener("click", closeMobileSidebar);

function setActiveNav(id) {
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  if (id) document.getElementById(id)?.classList.add("active");
}

document.getElementById("navHome").addEventListener("click", () => {
  aboutView.hidden = true;
  changelogView.hidden = true;
  setActiveNav(null);
  closeMobileSidebar();
});

document.getElementById("navAbout").addEventListener("click", () => {
  changelogView.hidden = true;
  aboutView.hidden = false;
  setActiveNav("navAbout");
  closeMobileSidebar();
});
document.getElementById("closeAbout").addEventListener("click", () => {
  aboutView.hidden = true;
  setActiveNav(null);
});

document.getElementById("navChangelog").addEventListener("click", () => {
  aboutView.hidden = true;
  changelogView.hidden = false;
  setActiveNav("navChangelog");
  closeMobileSidebar();
  loadChangelog();
});
document.getElementById("closeChangelog").addEventListener("click", () => {
  changelogView.hidden = true;
  setActiveNav(null);
});

[aboutView, changelogView].forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.hidden = true;
      setActiveNav(null);
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!aboutView.hidden) { aboutView.hidden = true; setActiveNav(null); }
  if (!changelogView.hidden) { changelogView.hidden = true; setActiveNav(null); }
});

// ---- Changelog : chargement des fichiers markdown datés ----
let changelogLoaded = false;
let changelogEntriesCache = null; // [{ dateStr, frText }], rempli une seule fois (source FR)

// Les fichiers de changelog sont nommés "AAAA-MM-JJ-HH-mm-ss.md" : les secondes
// servent uniquement à garantir un nom de fichier unique par modification
// (éviter les doublons/écrasements), elles ne sont pas affichées.
// Format affiché : "HH:MM JJ/MM/AAAA".
function formatChangelogDate(stamp) {
  const match = stamp.match(/^(\d{4})-(\d{2})-(\d{2})(?:-(\d{2})-(\d{2})-(\d{2}))?$/);
  if (!match) return stamp;
  const [, year, month, day, h = "00", m = "00"] = match;
  return `${h}:${m} ${day}/${month}/${year}`;
}

// Chaque fichier de changelog est écrit en français (source canonique). Si une
// traduction existe pour la langue courante dans CHANGELOG_TRANSLATIONS, on
// l'utilise à la place ; sinon on retombe sur le texte français d'origine.
function changelogTextForCurrentLang(dateStr, frText) {
  const translated = typeof CHANGELOG_TRANSLATIONS !== "undefined"
    ? CHANGELOG_TRANSLATIONS[dateStr]?.[CURRENT_LANG]
    : null;
  return translated || frText;
}

function renderChangelogEntries() {
  if (!changelogEntriesCache) return;
  const html = changelogEntriesCache.map(e => {
    const text = changelogTextForCurrentLang(e.dateStr, e.frText);
    const parsedHtml = window.marked ? marked.parse(text) : `<pre>${escapeHtml(text)}</pre>`;
    return `
      <div class="changelog-entry">
        <span class="changelog-date">${escapeHtml(formatChangelogDate(e.dateStr))}</span>
        ${parsedHtml}
      </div>`;
  }).join("") || `<p class="no-data">${t("changelogEmpty")}</p>`;
  changelogContent.innerHTML = html;
}

// Si le changelog a déjà été chargé, on le re-rend dans la nouvelle langue
// (appelé depuis lang.js lors d'un changement de langue).
function refreshChangelogIfLoaded() {
  if (changelogLoaded) renderChangelogEntries();
}

async function loadChangelog() {
  if (changelogLoaded) return;
  changelogContent.innerHTML = `<p class="loading-text">${t("changelogLoading")}</p>`;

  try {
    const res = await fetch("changelogs/index.json");
    if (!res.ok) throw new Error("index.json introuvable");
    const files = await res.json(); // ex: ["2026-07-18.md", "2026-06-01.md"]

    const sorted = [...files].sort((a, b) => b.localeCompare(a)); // dates récentes en premier

    changelogEntriesCache = await Promise.all(sorted.map(async (filename) => {
      const r = await fetch(`changelogs/${filename}`);
      const text = r.ok ? await r.text() : "*Erreur de chargement.*";
      const dateStr = filename.replace(/\.md$/i, "");
      return { dateStr, frText: text };
    }));

    renderChangelogEntries();
    changelogLoaded = true;
  } catch (err) {
    changelogContent.innerHTML = `<p class="no-data">${t("changelogError", { error: escapeHtml(err.message) })}</p>`;
  }
}

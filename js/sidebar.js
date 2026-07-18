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

// Les fichiers de changelog sont nommés "AAAA-MM-JJ_HH-mm-ss.md" : les secondes
// servent uniquement à garantir un nom de fichier unique par modification
// (éviter les doublons/écrasements), elles ne sont pas affichées.
// Format affiché : "JJ:MM:AAAA HH:MM".
function formatChangelogDate(stamp) {
  const match = stamp.match(/^(\d{4})-(\d{2})-(\d{2})(?:_(\d{2})-(\d{2})-(\d{2}))?$/);
  if (!match) return stamp;
  const [, year, month, day, h = "00", m = "00"] = match;
  return `${day}:${month}:${year} ${h}:${m}`;
}

async function loadChangelog() {
  if (changelogLoaded) return;
  changelogContent.innerHTML = `<p class="loading-text">Chargement...</p>`;

  try {
    const res = await fetch("changelogs/index.json");
    if (!res.ok) throw new Error("index.json introuvable");
    const files = await res.json(); // ex: ["2026-07-18.md", "2026-06-01.md"]

    const sorted = [...files].sort((a, b) => b.localeCompare(a)); // dates récentes en premier

    const entries = await Promise.all(sorted.map(async (filename) => {
      const r = await fetch(`changelogs/${filename}`);
      const text = r.ok ? await r.text() : "*Erreur de chargement.*";
      const dateStr = filename.replace(/\.md$/i, "");
      return { dateStr, html: window.marked ? marked.parse(text) : `<pre>${escapeHtml(text)}</pre>` };
    }));

    changelogContent.innerHTML = entries.map(e => `
      <div class="changelog-entry">
        <span class="changelog-date">${escapeHtml(formatChangelogDate(e.dateStr))}</span>
        ${e.html}
      </div>`).join("") || `<p class="no-data">Aucune entrée de changelog pour le moment.</p>`;

    changelogLoaded = true;
  } catch (err) {
    changelogContent.innerHTML = `<p class="no-data">Impossible de charger le changelog (${escapeHtml(err.message)}).</p>`;
  }
}

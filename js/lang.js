// ============ SÉLECTEUR DE LANGUE (noms des Pokémon) ============

const langSwitcher = document.getElementById("langSwitcher");
const langTrigger = document.getElementById("langTrigger");
const langTriggerLabel = document.getElementById("langTriggerLabel");
const langMenu = document.getElementById("langMenu");

const LANG_LABELS = { fr: "FR", en: "EN", jp: "JP" };

function syncLangTriggerLabel() {
  if (!langTriggerLabel) return;
  langTriggerLabel.textContent = LANG_LABELS[CURRENT_LANG] || "FR";
  langMenu.querySelectorAll("li[data-lang]").forEach(li => {
    li.classList.toggle("active", li.dataset.lang === CURRENT_LANG);
    li.setAttribute("aria-selected", li.dataset.lang === CURRENT_LANG ? "true" : "false");
  });
}

function openLangMenu() {
  langMenu.hidden = false;
  langTrigger.setAttribute("aria-expanded", "true");
  langSwitcher.classList.add("open");
}

function closeLangMenu() {
  langMenu.hidden = true;
  langTrigger.setAttribute("aria-expanded", "false");
  langSwitcher.classList.remove("open");
}

function toggleLangMenu() {
  if (langMenu.hidden) openLangMenu();
  else closeLangMenu();
}

function chooseLang(lang) {
  if (lang === CURRENT_LANG) { closeLangMenu(); return; }
  setCurrentLang(lang);
  syncLangTriggerLabel();
  closeLangMenu();
  refreshView({ resetPage: false });
  refreshOpenModalIfAny();
}

if (langTrigger && langMenu) {
  syncLangTriggerLabel();

  langTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLangMenu();
  });

  langMenu.querySelectorAll("li[data-lang]").forEach(li => {
    li.addEventListener("click", () => chooseLang(li.dataset.lang));
  });

  document.addEventListener("click", (e) => {
    if (!langMenu.hidden && !langSwitcher.contains(e.target)) closeLangMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !langMenu.hidden) closeLangMenu();
  });
}

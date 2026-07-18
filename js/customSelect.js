// ============ SELECT CUSTOM (stylable) ============
// Remplace visuellement un <select> natif par un bouton + listbox custom,
// entièrement stylable (le natif ne permet pas de retirer le surlignage
// bleu du système sur les options). Le <select> d'origine reste la source
// de vérité : on met à jour sa `.value` et on déclenche un `change` dessus,
// donc tout le code existant qui écoute `select.addEventListener("change", ...)`
// continue de fonctionner sans modification.

// Registre des selects déjà transformés : permet de forcer une resynchro
// explicite du libellé affiché (ex: après un changement de langue qui modifie
// le texte des <option> sans changer leur `value`), plutôt que de dépendre
// uniquement du MutationObserver (asynchrone, et pas toujours fiable selon
// l'environnement d'exécution).
const ENHANCED_SELECTS = [];

function refreshAllCustomSelects() {
  ENHANCED_SELECTS.forEach(fn => fn());
}

function enhanceSelect(selectEl) {
  if (!selectEl || selectEl.dataset.enhanced === "1") return;
  selectEl.dataset.enhanced = "1";

  const wrapper = document.createElement("div");
  wrapper.className = "custom-select";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select-trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");

  const label = document.createElement("span");
  label.className = "custom-select-label";
  trigger.appendChild(label);
  trigger.insertAdjacentHTML("beforeend", `<svg viewBox="0 0 24 24" class="custom-select-chevron"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

  const list = document.createElement("ul");
  list.className = "custom-select-list";
  list.setAttribute("role", "listbox");
  list.hidden = true;

  selectEl.insertAdjacentElement("afterend", wrapper);
  wrapper.appendChild(trigger);
  wrapper.appendChild(list);
  selectEl.classList.add("native-select-hidden");
  selectEl.tabIndex = -1;
  selectEl.setAttribute("aria-hidden", "true");

  // Construit le contenu (icône optionnelle + texte) d'une <option>, utilisé
  // à la fois pour les entrées de la liste et pour le libellé du trigger.
  function optionContent(opt) {
    const frag = document.createDocumentFragment();
    const iconUrl = opt?.dataset.icon;
    if (iconUrl && iconUrl !== "null") {
      const img = document.createElement("img");
      img.src = iconUrl;
      img.alt = "";
      img.className = "custom-select-icon";
      img.addEventListener("error", () => handleImgError(img));
      frag.appendChild(img);
    }
    frag.appendChild(document.createTextNode(opt ? opt.textContent : ""));
    return frag;
  }

  function renderList() {
    list.innerHTML = "";
    [...selectEl.options].forEach((opt) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.dataset.value = opt.value;
      li.appendChild(optionContent(opt));
      const isSelected = opt.value === selectEl.value;
      li.className = "custom-select-option" + (isSelected ? " selected" : "");
      li.setAttribute("aria-selected", isSelected ? "true" : "false");
      li.addEventListener("click", () => selectValue(opt.value));
      list.appendChild(li);
    });
  }

  function selectValue(value) {
    if (selectEl.value !== value) {
      // On sélectionne l'<option> elle-même (plutôt que d'assigner
      // `select.value`) : ça reste standard et fonctionne de façon plus
      // fiable quel que soit l'environnement.
      const target = [...selectEl.options].find((o) => o.value === value);
      if (target) target.selected = true;
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    }
    updateLabel();
    closeList();
    trigger.focus();
  }

  function updateLabel() {
    // On retrouve l'option via sa `value` plutôt que `selectedIndex`, qui
    // n'est pas toujours fiable selon la façon dont le select a été peuplé.
    const opt = [...selectEl.options].find(o => o.value === selectEl.value) || selectEl.options[0];
    label.innerHTML = "";
    label.appendChild(optionContent(opt));
  }

  function openList() {
    renderList();
    list.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    wrapper.classList.add("open");
    const current = list.querySelector(".selected");
    (current || list.firstElementChild)?.classList.add("focused");
    document.addEventListener("click", onOutsideClick);
  }

  function closeList() {
    list.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    wrapper.classList.remove("open");
    document.removeEventListener("click", onOutsideClick);
  }

  function onOutsideClick(e) {
    if (!wrapper.contains(e.target)) closeList();
  }

  function moveFocus(dir) {
    const items = [...list.children];
    if (items.length === 0) return;
    let idx = items.findIndex((li) => li.classList.contains("focused"));
    items.forEach((li) => li.classList.remove("focused"));
    idx = idx === -1 ? 0 : (idx + dir + items.length) % items.length;
    items[idx].classList.add("focused");
    if (typeof items[idx].scrollIntoView === "function") items[idx].scrollIntoView({ block: "nearest" });
  }

  trigger.addEventListener("click", () => {
    if (list.hidden) openList();
    else closeList();
  });

  trigger.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (list.hidden) openList();
      else moveFocus(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (list.hidden) { openList(); return; }
      const focused = list.querySelector(".focused");
      if (focused) selectValue(focused.dataset.value);
    } else if (e.key === "Escape") {
      closeList();
    } else if (e.key === "Tab") {
      closeList();
    }
  });

  // Si les options du <select> natif changent après coup (ex: peuplées
  // dynamiquement une fois les données chargées), on garde l'affichage synchro.
  const observer = new MutationObserver(updateLabel);
  observer.observe(selectEl, { childList: true, subtree: true });

  updateLabel();
  ENHANCED_SELECTS.push(updateLabel);
}

function enhanceAllSelects(selector = "select") {
  document.querySelectorAll(selector).forEach(enhanceSelect);
}

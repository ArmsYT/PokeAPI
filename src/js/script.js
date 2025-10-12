import { select } from "./utils.js";
import { isValidPokemon } from "./sprites.js";
import { buildCard } from "./cards.js";
import { searchState, getDataset, searchPokemon, wireSearch } from "./search.js";
import { pageState, setPageSize, setCurrentPage, totalPages, sliceForCurrentPage, wirePagination } from "./pagination.js";

const API_URL = "https://tyradex.vercel.app/api/v1/pokemon";
let ALL = [];

function renderPage(){
  const grid = select("#grid");
  const data = sliceForCurrentPage(getDataset(ALL));

  if (!data.length){
    grid.innerHTML = '<p style="grid-column:1/-1;color:#94a3b8">Aucun Pokémon trouvé.</p>';
  } else {
    const frag = document.createDocumentFragment();
    for (const p of data){
      try { frag.append(buildCard(p)); } catch(e){ console.warn("Card error", p?.pokedex_id, e); }
    }
    grid.innerHTML = "";
    grid.append(frag);
  }

  const info = select("#pageInfo");
  const prev = select("#prev");
  const next = select("#next");
  const tp = totalPages(getDataset(ALL));

  info.textContent = (pageState.pageSize === -1)
    ? (searchState.active ? `Résultat : ${getDataset(ALL).length}` : `Tous (${getDataset(ALL).length})`)
    : `Page ${pageState.currentPage}/${tp}`;

  if (prev){ prev.disabled = (pageState.currentPage <= 1) || (pageState.pageSize === -1); }
  if (next){ next.disabled = (pageState.currentPage >= tp) || (pageState.pageSize === -1); }

  const sel = select("#pageSize");
  if (sel && String(pageState.pageSize) !== sel.value){ sel.value = String(pageState.pageSize); }
}

async function initApp(){
  const grid = select("#grid");
  grid.innerHTML = '<p style="grid-column:1/-1;color:#94a3b8">Chargement des Pokémon…</p>';

  try{
    const res = await fetch(API_URL, { headers: { accept: "application/json" } });
    if (!res.ok){ throw new Error(`HTTP ${res.status}`); }
    ALL = await res.json();
    ALL = ALL.filter(isValidPokemon);

    wirePagination({ getDataset: () => getDataset(ALL), render: renderPage });

    wireSearch({
      onQuery: (q) => {
        const { pageSize, currentPage } = searchPokemon(ALL, q, pageState.pageSize);
        if (typeof pageSize !== "undefined"){ setPageSize(pageSize); }
        if (typeof currentPage !== "undefined"){ setCurrentPage(currentPage); }
        renderPage();
      }
    });

    renderPage();
  } catch(err){
    console.error(err);
    grid.innerHTML = `<p style="grid-column:1/-1;color:#ef4444">Échec du chargement : ${err.message}</p>`;
  }
}


// état local d’exemple
const ui = {
  gens: new Set(),           // Set<number>
  types: new Set(),          // Set<string> ex: "Feu"
  flags: { hasMega:false, hasGmax:false, dualType:false, monoType:false },
  sort: "id",                // "id" | "name" | "atk" | "def" | "vit"
  pageSize: 25,              // -1 = tout
  compact:false, dense:false
};

// écoute l’évènement envoyé par la sidebar
document.addEventListener("sidebar:action", ({ detail:{ action } }) => {
  const [cmd, arg] = action.split(":");

  if (cmd === "reset") {
    ui.gens.clear(); ui.types.clear();
    ui.flags = { hasMega:false, hasGmax:false, dualType:false, monoType:false };
    ui.sort = "id"; ui.pageSize = 25; ui.compact = false; ui.dense = false;
    setPageSize(25); setCurrentPage(1);
    clearSearch(); // <- si tu as une barre de recherche
    renderPage();
    return;
  }

  if (cmd === "focus-search") {
    const el = document.querySelector("#searchId");
    if (el){ el.focus(); el.select?.(); }
    return;
  }

  if (cmd === "random") {
    const ds = getDataset(ALL);                 // ton dataset courant
    if (ds.length){ openModal(ds[Math.floor(Math.random()*ds.length)]); }
    return;
  }

  if (action === "scrollTop") { window.scrollTo({top:0,behavior:"smooth"}); return; }
  if (action === "scrollBottom") { window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"}); return; }

  if (action === "page-prev") { setCurrentPage(Math.max(1, pageState.currentPage-1)); renderPage(); return; }
  if (action === "page-next") { setCurrentPage(pageState.currentPage+1); renderPage(); return; }

  if (cmd === "size") {
    const n = parseInt(arg,10);
    ui.pageSize = n; setPageSize(n); setCurrentPage(1); renderPage(); return;
  }

  if (cmd === "sort") {
    ui.sort = arg; setSort(arg); setCurrentPage(1); renderPage(); return;
  }

  if (cmd === "gen") {
    if (arg === "clear") { ui.gens.clear(); }
    else { const g = parseInt(arg,10); ui.gens.has(g) ? ui.gens.delete(g) : ui.gens.add(g); }
    applyFilters(ui); setCurrentPage(1); renderPage(); return;
  }

  if (cmd === "type") {
    if (arg === "clear") { ui.types.clear(); }
    else { ui.types.has(arg) ? ui.types.delete(arg) : ui.types.add(arg); }
    applyFilters(ui); setCurrentPage(1); renderPage(); return;
  }

  if (cmd === "flag") {
    ui.flags[arg] = !ui.flags[arg];
    applyFilters(ui); setCurrentPage(1); renderPage(); return;
  }
  if (cmd === "flags" && arg === "clear") {
    ui.flags = { hasMega:false, hasGmax:false, dualType:false, monoType:false };
    applyFilters(ui); setCurrentPage(1); renderPage(); return;
  }

  if (cmd === "view") {
    if (arg === "compact"){ ui.compact = !ui.compact; document.documentElement.classList.toggle("view-compact", ui.compact); }
    if (arg === "dense"){ ui.dense = !ui.dense; document.documentElement.classList.toggle("view-dense", ui.dense); }
    if (arg === "reset"){ ui.compact = false; ui.dense = false; document.documentElement.classList.remove("view-compact","view-dense"); }
    return;
  }
});


window.addEventListener("DOMContentLoaded", initApp);

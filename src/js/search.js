export const searchState = { active: false, savedPageSize: 25, current: [] };

function toLowerNoAccent(s = ""){ return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase(); }

export function getDataset(all){
  return searchState.active ? searchState.current : all;
}

export function searchPokemon(all, query, currentPageSize){
  const raw = String(query || "").trim();

  if (raw === ""){
    const pageSize = searchState.active ? searchState.savedPageSize : currentPageSize;
    searchState.active = false;
    searchState.current = [];
    return { pageSize, currentPage: 1 };
  }

  if (!searchState.active){ searchState.savedPageSize = currentPageSize; }
  searchState.active = true;

  if (/^\d+$/.test(raw)){
    const pid = parseInt(raw, 10);
    const hit = all.find(p => p.pokedex_id === pid);
    searchState.current = hit ? [hit] : [];
    return { pageSize: -1, currentPage: 1 };
  }

  const q = toLowerNoAccent(raw);
  const matchName = s => toLowerNoAccent(s || "").includes(q);
  searchState.current = all.filter(p =>
    matchName(p?.name?.fr) || matchName(p?.name?.en) || matchName(p?.name?.jp)
  );

  const pageSize = searchState.current.length === 1 ? -1 : searchState.savedPageSize;
  return { pageSize, currentPage: 1 };
}

export function debounce(fn, delay = 150){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

export function wireSearch({ onQuery }){
  const input = document.querySelector("#searchId");
  const btn = document.querySelector("#searchBtn");
  if (!input || !btn){ return; }

  const live = debounce(q => onQuery(q), 150);

  input.addEventListener("input", e => { live(e.target.value); });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter"){ e.preventDefault(); onQuery(input.value); }
    else if (e.key === "Escape"){ input.value = ""; onQuery(""); }
  });

  btn.addEventListener("click", () => { onQuery(input.value); });
}

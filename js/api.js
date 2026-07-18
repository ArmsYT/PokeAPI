// ============ API TYRADEX ============
const TyradexAPI = (() => {
  const BASE = "https://tyradex.app/api/v1";
  const CACHE_KEY = "pokedex-cache-v1";
  const CACHE_TTL = 1000 * 60 * 60 * 12; // 12h

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erreur API (" + res.status + ") sur " + url);
    return res.json();
  }

  /**
   * Récupère la liste complète des Pokémon (avec cache localStorage).
   */
  async function getAllPokemon(forceRefresh = false) {
    if (!forceRefresh) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL && Array.isArray(parsed.data)) {
            return parsed.data;
          }
        }
      } catch (e) { /* cache corrompu, on ignore */ }
    }

    const data = await fetchJSON(`${BASE}/pokemon`);
    // On ne garde que les fiches "de base" (pas les formes régionales en double)
    // pour la grille principale ; les formes restent accessibles via `formes`.
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) { /* quota dépassé, tant pis */ }
    return data;
  }

  async function getPokemonByRegion(nameSlug, region) {
    return fetchJSON(`${BASE}/pokemon/${encodeURIComponent(nameSlug)}/${encodeURIComponent(region)}`);
  }

  function spriteUrl(pokedexId, variant = "regular") {
    // Pas d'identifiant valide (0 / null / undefined) : on ne construit pas
    // une URL vers un sprite "de base" inexistant, on part direct sur le fallback.
    if (!pokedexId) return FALLBACK_IMAGE_URL;
    return `https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${pokedexId}/${variant}.png`;
  }

  /**
   * Récupère l'image de secours (utilisée en cas d'erreur de chargement d'un
   * sprite) depuis l'API personnelle https://thearms.fr/api/site.
   */
  async function loadFallbackImage() {
    try {
      const res = await fetch("https://thearms.fr/api/site");
      if (!res.ok) return;
      const data = await res.json();
      const url = data?.links?.[0]?.icon || data?.logo;
      if (url) FALLBACK_IMAGE_URL = url;
    } catch (e) { /* on garde le fallback SVG local */ }
  }

  return { getAllPokemon, getPokemonByRegion, spriteUrl, loadFallbackImage };
})();

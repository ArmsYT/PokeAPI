// ============ CATÉGORIE TRADUITE (via PokeAPI) ============
// Tyradex ne fournit la "catégorie" du Pokémon (ex: "Pokémon Flamme") qu'en
// français. On va chercher sa traduction à la demande sur l'API publique
// PokeAPI (pokeapi.co), qui couvre les mêmes numéros de Pokédex national et
// fournit ce texte dans de nombreuses langues (dont l'anglais et le
// japonais). Résultat mis en cache en local pour éviter de re-fetch à
// chaque ouverture de fiche.
const PokeApiSpecies = (() => {
  const BASE = "https://pokeapi.co/api/v2/pokemon-species";
  const CACHE_KEY = "pokedex-species-cache-v1";
  const CACHE_TTL = 1000 * 60 * 60 * 24 * 30; // 30 jours : ce texte ne change jamais

  function readCache() {
    try {
      return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function writeCache(cache) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) { /* quota dépassé, tant pis */ }
  }

  // Récupère la catégorie ("genus") d'un Pokémon dans la langue demandée
  // ("en" ou "jp"). Retourne `null` en français (pas besoin, Tyradex l'a
  // déjà) ou si la donnée est introuvable/l'API est injoignable.
  async function getCategory(pokedexId, lang) {
    if (!pokedexId || lang === "fr") return null;

    const cache = readCache();
    const cached = cache[pokedexId];
    const isFresh = cached?.timestamp && Date.now() - cached.timestamp < CACHE_TTL;
    if (isFresh) return cached.genera?.[lang] || null;

    try {
      const res = await fetch(`${BASE}/${pokedexId}`);
      if (!res.ok) return cached?.genera?.[lang] || null;
      const data = await res.json();
      const genera = {};
      (data.genera || []).forEach(g => {
        const name = g.language?.name;
        if (name === "en") genera.en = g.genus;
        // "ja-Hrkt" = version kana (toujours présente) ; "ja" (kanji) est un
        // bonus si dispo, on la préfère quand elle existe.
        if ((name === "ja-Hrkt" || name === "ja") && (!genera.jp || name === "ja")) genera.jp = g.genus;
      });
      cache[pokedexId] = { timestamp: Date.now(), genera };
      writeCache(cache);
      return genera[lang] || null;
    } catch (e) {
      // Hors ligne / requête bloquée : on retombe sur le français (déjà
      // affiché), rien de cassé côté interface.
      return cached?.genera?.[lang] || null;
    }
  }

  return { getCategory };
})();

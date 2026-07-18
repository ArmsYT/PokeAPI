// ============ TRADUCTIONS DE L'INTERFACE (FR / EN / JP) ============
// Couvre tout le texte "chrome" de l'interface (labels, boutons, titres de
// section, messages...). Les données brutes de l'API (types, talents,
// catégories, conditions d'évolution) ne sont fournies qu'en français par
// Tyradex et restent donc en français quelle que soit la langue choisie —
// seuls les noms des Pokémon eux-mêmes ont une traduction côté API.

const I18N = {
  fr: {
    brand: "PokéDex",
    navApiLink: "Lien vers l'API",
    navAbout: "À propos",
    navChangelog: "Changelog",
    githubSub: "Voir le profil GitHub",
    license: "Licence MIT",
    burgerMenu: "Menu",
    searchPlaceholder: "Rechercher un Pokémon...",
    langSwitcherTitle: "Langue de l'interface",
    themeToggleTitle: "Changer de thème",
    filterPerPage: "Par page",
    filterOrder: "Ordre",
    filterType: "Type",
    filterGeneration: "Génération",
    perPageAll: "Tout",
    orderIdAsc: "ID croissant",
    orderNameAsc: "Nom A → Z",
    orderAtk: "Attaque",
    orderDef: "Défense",
    orderVit: "Vitesse",
    orderHp: "PV",
    allTypes: "Tous les types",
    allGenerations: "Toutes",
    generationLabel: "Génération {n}",
    resultsCount: "{n} Pokémon",
    emptyState: "Aucun Pokémon ne correspond à ta recherche.",
    fetchError: "Impossible de charger les données de l'API Tyradex. Réessaie plus tard.",
    loadingMore: "Chargement de la suite...",
    statsSummaryTitle: "Statistiques moyennes",
    statsSummaryCount: "({n} Pokémon)",
    statsBreakdownTypesTitle: "Répartition par type",
    statsBreakdownGenTitle: "Répartition par génération",
    statsBreakdownRecordsTitle: "Records",
    recordHighestAtk: "Attaque la plus haute",
    recordHighestDef: "Défense la plus haute",
    recordHighestHp: "PV les plus hauts",
    recordHighestVit: "Vitesse la plus haute",
    statsBreakdownSexTitle: "Répartition par sexe",
    sexCategoryMixed: "Mixte (♂/♀)",
    sexCategoryMaleOnly: "Mâle uniquement",
    sexCategoryFemaleOnly: "Femelle uniquement",
    statHp: "PV",
    statAtk: "Attaque",
    statDef: "Défense",
    statSpeAtk: "Atq. Spé.",
    statSpeDef: "Déf. Spé.",
    statVit: "Vitesse",
    aboutTitle: "À propos",
    aboutP1: 'Ce PokéDex est un projet personnel qui exploite l\'API publique et gratuite <a href="https://tyradex.app" target="_blank" rel="noopener">Tyradex</a>, une API Pokémon entièrement en français créée par <a href="https://github.com/Yarkis01" target="_blank" rel="noopener">Yarkis01</a> et <a href="https://github.com/Ashzuu" target="_blank" rel="noopener">Ashzuu</a>.',
    aboutP2: "Le site permet de parcourir l'intégralité du Pokédex national : recherche par nom, filtres par type, tri par statistiques, pagination configurable, et une fiche détaillée pour chaque Pokémon (statistiques, talents, faiblesses/résistances, évolutions, formes chromatiques...).",
    aboutTechTitle: "Technologies",
    aboutTechText: "HTML, CSS et JavaScript natifs (aucun framework), pensé pour être hébergé gratuitement sur GitHub Pages.",
    aboutCreditsTitle: "Crédits",
    aboutCreditsText: 'Données Pokémon fournies par <a href="https://tyradex.app" target="_blank" rel="noopener">Tyradex</a> (sources : Poképédia &amp; Serebii). Pokémon et tous les noms respectifs sont des marques déposées de The Pokémon Company International, Game Freak et Nintendo.',
    aboutAuthorTitle: "Auteur",
    aboutAuthorText: 'Développé par <a href="https://github.com/ArmsYT" target="_blank" rel="noopener">ArmsYT</a>, sous licence MIT.',
    changelogTitle: "Changelog",
    changelogLoading: "Chargement...",
    changelogEmpty: "Aucune entrée de changelog pour le moment.",
    changelogError: "Impossible de charger le changelog ({error}).",
    modalLoading: "Chargement...",
    modalLoadError: "Impossible de charger ce Pokémon.",
    modalMiniGeneration: "Génération",
    modalMiniHeight: "Taille",
    modalMiniWeight: "Poids",
    modalMiniCatchRate: "Taux de capture",
    modalMiniXp100: "XP niv. 100",
    modalMiniSex: "Sexe",
    modalSexless: "Asexué",
    modalSectionStats: "Statistiques de base",
    modalSectionTalents: "Talents",
    modalSectionMatchups: "Faiblesses & résistances",
    modalSectionEvolutions: "Évolutions",
    modalTalentHidden: "Talent caché",
    modalNoTalents: "Aucun talent renseigné.",
    modalNoStats: "Statistiques non disponibles.",
    modalNoMatchups: "Données de faiblesses non disponibles.",
    modalNoMatchupsNeutral: "Aucune particularité.",
    modalNoEvolution: "Ce Pokémon n'évolue pas.",
    matchupImmune: "Immunisé (×0)",
    matchupVeryResistant: "Très résistant (×0.25)",
    matchupResistant: "Résistant (×0.5)",
    matchupVulnerable: "Vulnérable (×2)",
    matchupVeryVulnerable: "Très vulnérable (×4)",
  },
  en: {
    brand: "PokéDex",
    navApiLink: "API link",
    navAbout: "About",
    navChangelog: "Changelog",
    githubSub: "View GitHub profile",
    license: "MIT License",
    burgerMenu: "Menu",
    searchPlaceholder: "Search a Pokémon...",
    langSwitcherTitle: "Interface language",
    themeToggleTitle: "Toggle theme",
    filterPerPage: "Per page",
    filterOrder: "Sort by",
    filterType: "Type",
    filterGeneration: "Generation",
    perPageAll: "All",
    orderIdAsc: "ID ascending",
    orderNameAsc: "Name A → Z",
    orderAtk: "Attack",
    orderDef: "Defense",
    orderVit: "Speed",
    orderHp: "HP",
    allTypes: "All types",
    allGenerations: "All",
    generationLabel: "Generation {n}",
    resultsCount: "{n} Pokémon",
    emptyState: "No Pokémon matches your search.",
    fetchError: "Unable to load data from the Tyradex API. Please try again later.",
    loadingMore: "Loading more...",
    statsSummaryTitle: "Average stats",
    statsSummaryCount: "({n} Pokémon)",
    statsBreakdownTypesTitle: "Breakdown by type",
    statsBreakdownGenTitle: "Breakdown by generation",
    statsBreakdownRecordsTitle: "Records",
    recordHighestAtk: "Highest Attack",
    recordHighestDef: "Highest Defense",
    recordHighestHp: "Highest HP",
    recordHighestVit: "Highest Speed",
    statsBreakdownSexTitle: "Breakdown by gender",
    sexCategoryMixed: "Mixed (♂/♀)",
    sexCategoryMaleOnly: "Male only",
    sexCategoryFemaleOnly: "Female only",
    statHp: "HP",
    statAtk: "Attack",
    statDef: "Defense",
    statSpeAtk: "Sp. Atk",
    statSpeDef: "Sp. Def",
    statVit: "Speed",
    aboutTitle: "About",
    aboutP1: 'This PokéDex is a personal project built on the free, public <a href="https://tyradex.app" target="_blank" rel="noopener">Tyradex</a> API, a fully French-language Pokémon API created by <a href="https://github.com/Yarkis01" target="_blank" rel="noopener">Yarkis01</a> and <a href="https://github.com/Ashzuu" target="_blank" rel="noopener">Ashzuu</a>.',
    aboutP2: "The site lets you browse the entire National Pokédex: search by name, filter by type, sort by stats, configurable pagination, and a detailed page for every Pokémon (stats, abilities, weaknesses/resistances, evolutions, shiny forms...).",
    aboutTechTitle: "Technologies",
    aboutTechText: "Native HTML, CSS and JavaScript (no framework), built to be hosted for free on GitHub Pages.",
    aboutCreditsTitle: "Credits",
    aboutCreditsText: 'Pokémon data provided by <a href="https://tyradex.app" target="_blank" rel="noopener">Tyradex</a> (sources: Poképédia &amp; Serebii). Pokémon and all related names are trademarks of The Pokémon Company International, Game Freak and Nintendo.',
    aboutAuthorTitle: "Author",
    aboutAuthorText: 'Developed by <a href="https://github.com/ArmsYT" target="_blank" rel="noopener">ArmsYT</a>, under the MIT license.',
    changelogTitle: "Changelog",
    changelogLoading: "Loading...",
    changelogEmpty: "No changelog entry yet.",
    changelogError: "Unable to load the changelog ({error}).",
    modalLoading: "Loading...",
    modalLoadError: "Unable to load this Pokémon.",
    modalMiniGeneration: "Generation",
    modalMiniHeight: "Height",
    modalMiniWeight: "Weight",
    modalMiniCatchRate: "Catch rate",
    modalMiniXp100: "XP at lvl 100",
    modalMiniSex: "Gender",
    modalSexless: "Genderless",
    modalSectionStats: "Base stats",
    modalSectionTalents: "Abilities",
    modalSectionMatchups: "Weaknesses & resistances",
    modalSectionEvolutions: "Evolutions",
    modalTalentHidden: "Hidden ability",
    modalNoTalents: "No abilities listed.",
    modalNoStats: "Stats not available.",
    modalNoMatchups: "Weakness data not available.",
    modalNoMatchupsNeutral: "No notable matchups.",
    modalNoEvolution: "This Pokémon does not evolve.",
    matchupImmune: "Immune (×0)",
    matchupVeryResistant: "Very resistant (×0.25)",
    matchupResistant: "Resistant (×0.5)",
    matchupVulnerable: "Vulnerable (×2)",
    matchupVeryVulnerable: "Very vulnerable (×4)",
  },
  jp: {
    brand: "PokéDex",
    navApiLink: "APIへのリンク",
    navAbout: "概要",
    navChangelog: "更新履歴",
    githubSub: "GitHubプロフィールを見る",
    license: "MITライセンス",
    burgerMenu: "メニュー",
    searchPlaceholder: "ポケモンを検索...",
    langSwitcherTitle: "インターフェース言語",
    themeToggleTitle: "テーマを切り替える",
    filterPerPage: "1ページの件数",
    filterOrder: "並び替え",
    filterType: "タイプ",
    filterGeneration: "世代",
    perPageAll: "すべて",
    orderIdAsc: "ID順（昇順）",
    orderNameAsc: "名前順（A→Z）",
    orderAtk: "こうげき",
    orderDef: "ぼうぎょ",
    orderVit: "すばやさ",
    orderHp: "HP",
    allTypes: "すべてのタイプ",
    allGenerations: "すべて",
    generationLabel: "第{n}世代",
    resultsCount: "ポケモン {n}匹",
    emptyState: "検索条件に一致するポケモンが見つかりません。",
    fetchError: "Tyradex APIのデータを読み込めませんでした。しばらくしてから再度お試しください。",
    loadingMore: "続きを読み込み中...",
    statsSummaryTitle: "平均ステータス",
    statsSummaryCount: "（ポケモン {n}匹）",
    statsBreakdownTypesTitle: "タイプ別内訳",
    statsBreakdownGenTitle: "世代別内訳",
    statsBreakdownRecordsTitle: "記録",
    recordHighestAtk: "最高こうげき",
    recordHighestDef: "最高ぼうぎょ",
    recordHighestHp: "最高HP",
    recordHighestVit: "最高すばやさ",
    statsBreakdownSexTitle: "性別別内訳",
    sexCategoryMixed: "混合（♂/♀）",
    sexCategoryMaleOnly: "オスのみ",
    sexCategoryFemaleOnly: "メスのみ",
    statHp: "HP",
    statAtk: "こうげき",
    statDef: "ぼうぎょ",
    statSpeAtk: "とくこう",
    statSpeDef: "とくぼう",
    statVit: "すばやさ",
    aboutTitle: "概要",
    aboutP1: 'このポケダックスは、無料で公開されている<a href="https://tyradex.app" target="_blank" rel="noopener">Tyradex</a> APIを利用した個人プロジェクトです。Tyradexは<a href="https://github.com/Yarkis01" target="_blank" rel="noopener">Yarkis01</a>氏と<a href="https://github.com/Ashzuu" target="_blank" rel="noopener">Ashzuu</a>氏によって作られた、完全フランス語対応のポケモンAPIです。',
    aboutP2: "このサイトでは、全国図鑑を丸ごと閲覧できます。名前で検索、タイプで絞り込み、ステータスで並び替え、ページ表示件数の設定、そして各ポケモンの詳細ページ（ステータス、特性、弱点・耐性、進化、色違いなど）を確認できます。",
    aboutTechTitle: "技術",
    aboutTechText: "フレームワークを使用せず、素のHTML・CSS・JavaScriptで構築。GitHub Pagesで無料ホスティングできるように作られています。",
    aboutCreditsTitle: "クレジット",
    aboutCreditsText: 'ポケモンデータは<a href="https://tyradex.app" target="_blank" rel="noopener">Tyradex</a>（出典：Poképédia、Serebii）によって提供されています。ポケモンおよび関連する名称はThe Pokémon Company International、Game Freak、Nintendoの商標です。',
    aboutAuthorTitle: "作者",
    aboutAuthorText: '<a href="https://github.com/ArmsYT" target="_blank" rel="noopener">ArmsYT</a>により開発。MITライセンスのもとで公開されています。',
    changelogTitle: "更新履歴",
    changelogLoading: "読み込み中...",
    changelogEmpty: "更新履歴はまだありません。",
    changelogError: "更新履歴を読み込めませんでした（{error}）。",
    modalLoading: "読み込み中...",
    modalLoadError: "このポケモンを読み込めませんでした。",
    modalMiniGeneration: "世代",
    modalMiniHeight: "たかさ",
    modalMiniWeight: "おもさ",
    modalMiniCatchRate: "捕獲率",
    modalMiniXp100: "Lv.100 経験値",
    modalMiniSex: "性別",
    modalSexless: "性別なし",
    modalSectionStats: "基本ステータス",
    modalSectionTalents: "とくせい",
    modalSectionMatchups: "弱点と耐性",
    modalSectionEvolutions: "進化",
    modalTalentHidden: "隠れ特性",
    modalNoTalents: "特性の情報がありません。",
    modalNoStats: "ステータス情報がありません。",
    modalNoMatchups: "弱点データがありません。",
    modalNoMatchupsNeutral: "特筆すべき相性はありません。",
    modalNoEvolution: "このポケモンは進化しません。",
    matchupImmune: "無効 (×0)",
    matchupVeryResistant: "とても耐性あり (×0.25)",
    matchupResistant: "耐性あり (×0.5)",
    matchupVulnerable: "弱点 (×2)",
    matchupVeryVulnerable: "重大な弱点 (×4)",
  },
};

// Code de langue HTML standard (l'attribut `lang` utilise "ja", pas "jp").
const LANG_HTML_CODE = { fr: "fr", en: "en", jp: "ja" };
// Locale utilisée pour le formatage des nombres (ex: XP niveau 100).
const LANG_LOCALE = { fr: "fr-FR", en: "en-US", jp: "ja-JP" };

// Traduction des 18 types Pokémon (l'API Tyradex ne fournit que le nom
// français : cette table est maintenue à la main, indexée par le même slug
// que TYPE_SLUGS/typeIconUrl dans utils.js).
const TYPE_NAME_TRANSLATIONS = {
  normal: { fr: "Normal", en: "Normal", jp: "ノーマル" },
  feu: { fr: "Feu", en: "Fire", jp: "ほのお" },
  eau: { fr: "Eau", en: "Water", jp: "みず" },
  plante: { fr: "Plante", en: "Grass", jp: "くさ" },
  electrik: { fr: "Électrik", en: "Electric", jp: "でんき" },
  glace: { fr: "Glace", en: "Ice", jp: "こおり" },
  combat: { fr: "Combat", en: "Fighting", jp: "かくとう" },
  poison: { fr: "Poison", en: "Poison", jp: "どく" },
  sol: { fr: "Sol", en: "Ground", jp: "じめん" },
  vol: { fr: "Vol", en: "Flying", jp: "ひこう" },
  psy: { fr: "Psy", en: "Psychic", jp: "エスパー" },
  insecte: { fr: "Insecte", en: "Bug", jp: "むし" },
  roche: { fr: "Roche", en: "Rock", jp: "いわ" },
  spectre: { fr: "Spectre", en: "Ghost", jp: "ゴースト" },
  dragon: { fr: "Dragon", en: "Dragon", jp: "ドラゴン" },
  tenebres: { fr: "Ténèbres", en: "Dark", jp: "あく" },
  acier: { fr: "Acier", en: "Steel", jp: "はがね" },
  fee: { fr: "Fée", en: "Fairy", jp: "フェアリー" },
};

// Traduit un nom de type donné en français (tel que fourni par l'API) vers
// la langue actuelle. Le nom français reste toujours la valeur "source de
// vérité" utilisée pour le filtrage (AppState.type, comparaison p.types) —
// seul l'affichage change.
function typeDisplayName(frenchName) {
  const slug = TYPE_SLUGS[frenchName];
  const entry = slug && TYPE_NAME_TRANSLATIONS[slug];
  return entry ? (entry[CURRENT_LANG] || entry.fr) : frenchName;
}

// Récupère une chaîne traduite dans la langue actuelle, avec repli sur le
// français si la clé/langue est manquante, et remplace les `{var}` fournis.
function t(key, vars) {
  const dict = I18N[CURRENT_LANG] || I18N.fr;
  let str = dict[key] ?? I18N.fr[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
    });
  }
  return str;
}

// Applique les traductions à tous les éléments statiques du DOM marqués
// avec les attributs data-i18n* : texte simple, HTML de confiance (contenu
// interne fixe avec liens), ou attributs (placeholder/title/aria-label).
function applyStaticTranslations(root = document) {
  // NB : la clé s'appelle "data-i18n-key" (et pas "data-i18n") — linkedom,
  // utilisé par le harnais de test, a un bug qui fait que `dataset.i18n`
  // renvoie toujours `null` pour l'attribut exact "data-i18n" (sans suite),
  // alors que "data-i18n-key" fonctionne normalement partout, y compris en
  // navigateur réel. On garde donc ce nom pour éviter le piège.
  root.querySelectorAll("[data-i18n-key]").forEach(el => {
    el.textContent = t(el.dataset.i18nKey);
  });
  root.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  root.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.setAttribute("title", t(el.dataset.i18nTitle));
  });
  root.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });
  document.documentElement.setAttribute("lang", LANG_HTML_CODE[CURRENT_LANG] || "fr");
}

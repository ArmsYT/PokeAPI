// ============ TRADUCTIONS DU CHANGELOG (EN / JP) ============
// Les fichiers .md dans /changelogs sont la source canonique en français.
// Cette table fournit, pour chaque fichier (clé = nom sans l'extension .md),
// une traduction complète du markdown en anglais et en japonais. Si une
// entrée n'a pas (encore) de traduction pour la langue courante, on retombe
// sur le texte français d'origine (voir sidebar.js).
const CHANGELOG_TRANSLATIONS = {
  "2026-07-18-09-00-00": {
    en: `## Initial release 🎉

- Launch of the PokéDex powered by the [Tyradex](https://tyradex.app) API.
- Search bar by name or Pokédex number.
- Filters: results per page (15 / 30 / 60 / All with progressive loading), sort order (ID, name, attack, defense, speed, HP), type.
- Light and dark mode.
- Fixed sidebar with a link to the API, About page, Changelog and GitHub profile.
- Detailed Pokémon page: images (normal, shiny, gigantamax, mega), stats, abilities, weaknesses/resistances, clickable evolution chain.`,
    jp: `## 初期リリース 🎉

- [Tyradex](https://tyradex.app) APIを利用したポケモン図鑑を公開。
- 名前またはポケモン図鑑番号での検索バー。
- フィルター：1ページあたりの表示数（15／30／60／すべて、段階的読み込み対応）、並び順（ID、名前、攻撃、防御、素早さ、HP）、タイプ。
- ライトモードとダークモード。
- APIへのリンク、Aboutページ、更新履歴、GitHubプロフィールを含む固定サイドバー。
- ポケモンごとの詳細ページ：画像（通常、色違い、キョダイマックス、メガシンカ）、ステータス、特性、弱点・耐性、クリック可能な進化チェーン。`,
  },
  "2026-07-18-13-20-00": {
    en: `### Filters and image robustness

- Added the **Generation** filter, automatically populated from the loaded data.
- Automatic fallback image when a sprite is missing/broken, fetched from an external API.
- Initial style adjustments to the dropdown menus ("Per page", "Order", "Type").
- **Ctrl+K** (or Cmd+K) keyboard shortcut to jump straight to the search bar.`,
    jp: `### フィルターと画像の堅牢性向上

- **世代**フィルターを追加。読み込まれたデータから自動的に生成されます。
- スプライトが欠損・破損している場合、外部APIから代替画像を自動取得。
- ドロップダウンメニュー（「表示数」「並び順」「タイプ」）のスタイルを初調整。
- 検索バーに直接移動できる**Ctrl+K**（またはCmd+K）ショートカットを追加。`,
  },
  "2026-07-18-16-45-00": {
    en: `### Display fixes and custom dropdown menus

- Pagination no longer shows up when no Pokémon matches the search/filters.
- Removed MissingNo (#000), a test entry that has no place in the Pokédex.
- Fixed the misalignment of the search bar's native "clear" cross.
- The dropdown menus (Per page, Order, Type, Generation) are now fully custom: no more system blue highlight, everything is styled to match the light/dark theme.
- The changelog now shows the date **and** time of each change (one entry per update).`,
    jp: `### 表示の修正とカスタムドロップダウンメニュー

- 検索・フィルターに一致するポケモンがない場合、ページネーションが表示されなくなりました。
- ポケモン図鑑にふさわしくないテスト用エントリー、ミッシングノー（#000）を削除。
- 検索バーのネイティブな「クリア」バツ印のズレを修正。
- ドロップダウンメニュー（表示数、並び順、タイプ、世代）が完全にカスタム化：システムの青いハイライトを廃止し、ライト／ダークテーマに合わせてスタイリング。
- 更新履歴に各変更の日付**と**時刻が表示されるようになりました（更新ごとに1件）。`,
  },
  "2026-07-18-19-10-00": {
    en: `### Type icons, changelog display and language selector

- The type filter now shows each type's icon to the left of its name, both in the dropdown and in the selected field.
- The changelog no longer shows seconds in the date/time, while still keeping unique filenames internally.
- The page title and description now reflect ArmsYT's information instead of the API creator's.
- Added a language selector (Français / English / 日本語) next to the light/dark button: it changes the display language of Pokémon names in the grid and detail sheet (the rest of the interface stays in French).`,
    jp: `### タイプアイコン、更新履歴の表示、言語セレクター

- タイプフィルターに、ドロップダウンと選択欄の両方でタイプ名の左側にアイコンを表示するようになりました。
- 更新履歴の日付／時刻表示から秒を省略（内部的にはファイル名の一意性を維持）。
- ページタイトルと説明文が、API作者の情報ではなくArmsYTの情報を反映するように変更。
- ライト／ダーク切り替えボタンの隣に言語セレクター（Français／English／日本語）を追加：グリッドと詳細ページのポケモン名の表示言語を切り替えます（インターフェースの他の部分はフランス語のまま）。`,
  },
  "2026-07-18-20-05-00": {
    en: `### Average stats below pagination

- A new panel shows the average stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) of the currently filtered Pokémon, just below the pagination.
- The averages recalculate automatically on every search, filter or sort, and the panel hides when no results match.`,
    jp: `### ページネーション下に平均ステータスを表示

- 現在フィルターされているポケモンの平均ステータス（HP、攻撃、防御、特攻、特防、素早さ）を表示する新しいパネルを、ページネーションのすぐ下に追加。
- 検索・フィルター・並び替えのたびに平均値が自動的に再計算され、該当するポケモンがない場合はパネルが非表示になります。`,
  },
  "2026-07-18-20-40-00": {
    en: `### Variant name shown in the detail sheet

- When another version of the Pokémon is selected in the gallery (Shiny, Gigantamax, Mega X/Y...), its name now appears in parentheses right next to the Pokémon's name.
- Nothing is shown for the base version ("Normal").`,
    jp: `### 詳細ページにバリエーション名を表示

- ギャラリーで別のバージョン（色違い、キョダイマックス、メガシンカX/Yなど）を選択すると、その名前がポケモン名の横にカッコ書きで表示されるようになりました。
- 通常（ベース）バージョンでは何も表示されません。`,
  },
  "2026-07-18-21-30-00": {
    en: `### Fully translated interface (FR / EN / JP)

- The language selector now translates the entire interface (menus, filters, About page, detail sheet, messages...), not just Pokémon names.
- Raw data provided by the Tyradex API (types, abilities, categories, evolution conditions) stays in French, since the API doesn't offer it in other languages.
- Numbers (level 100 XP...) now follow the format of the selected language.`,
    jp: `### インターフェース全体を翻訳（FR／EN／JP）

- 言語セレクターが、ポケモン名だけでなくインターフェース全体（メニュー、フィルター、Aboutページ、詳細ページ、メッセージなど）を翻訳するようになりました。
- Tyradex APIが提供する生データ（タイプ、特性、分類、進化条件）は、APIが他言語に対応していないためフランス語のままです。
- 数値（レベル100時のXPなど）は選択した言語の表記形式に従うようになりました。`,
  },
  "2026-07-18-22-05-00": {
    en: `### Type name translation

- Type names (Fire, Water, Grass...) are now translated into English and Japanese, in card badges, the detail sheet, the Type filter, and the weakness/resistance chips.
- Since the Tyradex API only provides types in French, a lookup table was added for all 18 types.`,
    jp: `### タイプ名の翻訳

- タイプ名（ほのお、みず、くさなど）が、カードバッジ、詳細ページ、タイプフィルター、弱点・耐性チップにおいて英語・日本語に翻訳されるようになりました。
- Tyradex APIはタイプ名をフランス語でしか提供していないため、18タイプ分の対応表を追加しました。`,
  },
  "2026-07-18-22-40-00": {
    en: `### Ability translation and changelog date format fix

- Abilities (e.g. Overgrow, Chlorophyll, Blaze...) are now translated into English and Japanese in the detail sheet, via a lookup table covering all known abilities.
- Changelog files are now named "YYYY-MM-DD-HH-MM-SS" (dashes throughout, no more underscore), and the date shown on the site follows the "HH:MM DD/MM/YYYY" format.`,
    jp: `### 特性の翻訳と更新履歴の日付形式修正

- 特性（しんりょく、ようりょくそ、もうかなど）が、既知の特性を網羅する対応表を通じて詳細ページで英語・日本語に翻訳されるようになりました。
- 更新履歴ファイルの名前が「YYYY-MM-DD-HH-MM-SS」形式（アンダースコアを廃止しすべてハイフンに統一）に変更され、サイト上の表示日付は「HH:MM DD/MM/YYYY」形式に従います。`,
  },
  "2026-07-18-22-50-00": {
    en: `### Pokémon category translation

- The category shown under the name in the detail sheet (e.g. "Flame Pokémon") is now translated into English and Japanese.
- Since Tyradex only provides this text in French, the translation is fetched on demand from the public PokeAPI and cached locally: the sheet first shows the French text, then swaps it in once the translation arrives.`,
    jp: `### ポケモンの分類名の翻訳

- 詳細ページで名前の下に表示される分類（例：「かえんポケモン」）が、英語・日本語に翻訳されるようになりました。
- Tyradexはこのテキストをフランス語でしか提供していないため、翻訳は公開APIであるPokeAPIから必要に応じて取得しローカルにキャッシュされます：ページはまずフランス語のテキストを表示し、翻訳が取得され次第置き換えます。`,
  },
  "2026-07-18-23-05-00": {
    en: `### Type/generation breakdown and records

- A new panel appears next to the average stats, below the pagination:
  - breakdown of the currently filtered Pokémon by type and by generation;
  - records (highest Attack, Defense, HP and Speed), with the sprite of the relevant Pokémon and a click to open its sheet.
- This information recalculates automatically on every search, filter or sort, just like the existing average stats.`,
    jp: `### タイプ／世代別の内訳とレコード

- ページネーションの下、平均ステータスの隣に新しいパネルが追加されました：
  - 現在フィルターされているポケモンのタイプ別・世代別の内訳。
  - レコード（攻撃・防御・HP・素早さの最高値）。該当ポケモンのサムネイルをクリックすると詳細ページが開きます。
- これらの情報は、既存の平均ステータスと同様に、検索・フィルター・並び替えのたびに自動的に再計算されます。`,
  },
  "2026-07-18-23-15-00": {
    en: `### Stats split into several cards with bars

- The stats panel below the pagination is now split into four separate cards: Average stats, Type breakdown, Generation breakdown and Records.
- The type and generation breakdowns now display as bars (like the average stats), with the longest bar for the most represented value.`,
    jp: `### ステータスを複数のカードとバーで分割表示

- ページネーション下の統計パネルが、平均ステータス、タイプ別内訳、世代別内訳、レコードの4つの独立したカードに分割されました。
- タイプ別・世代別の内訳も、平均ステータスと同様にバー形式で表示され、最も多い値ほど長いバーになります。`,
  },
  "2026-07-18-23-20-00": {
    en: `### Gender breakdown

- New stats card below the pagination: breakdown of filtered Pokémon into male only, female only, mixed (♂/♀) or genderless, displayed as bars like the other cards.`,
    jp: `### 性別の内訳

- ページネーション下に新しい統計カードを追加：フィルターされたポケモンを「オスのみ」「メスのみ」「両方（♂/♀）」「性別なし」に分類し、他のカードと同様バー形式で表示します。`,
  },
  "2026-07-19-00-05-00": {
    en: `### Changelog translated into English and Japanese

- Every changelog entry is now available in English and Japanese, not just French.
- The displayed content automatically follows the interface language, and updates immediately when the language is switched while the changelog is open.`,
    jp: `### 更新履歴を英語・日本語に翻訳

- 更新履歴のすべての項目が、フランス語だけでなく英語・日本語でも表示できるようになりました。
- 表示内容はインターフェースの言語に自動的に従い、更新履歴を開いたまま言語を切り替えても即座に反映されます。`,
  },
};

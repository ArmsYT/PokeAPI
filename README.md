# PokéDex — Tyradex

Un PokéDex complet en HTML / CSS / JS natifs, propulsé par l'API française gratuite [Tyradex](https://tyradex.app).

Pensé pour être hébergé gratuitement sur **GitHub Pages** (aucune étape de build nécessaire).

## Fonctionnalités

- Barre de recherche (nom ou numéro de Pokédex), raccourci **Ctrl+K** / Cmd+K
- Filtres : nombre de Pokémon par page (15 / 30 / 60 / Tout avec chargement progressif au scroll), ordre (ID, nom, attaque, défense, vitesse, PV), type, génération
- Mode clair & sombre (persisté)
- Menus déroulants entièrement custom (stylés, sans dépendre du rendu natif du système)
- Image de secours automatique (via une API externe) si un sprite est manquant ou cassé
- Sidebar fixe : lien vers l'API, page À propos, Changelog (basé sur des fichiers Markdown horodatés), profil GitHub + licence
- Fiche détaillée au clic sur une carte : galerie d'images (normal, shiny, gigamax, méga...), infos complètes, statistiques, talents, faiblesses/résistances, chaîne d'évolution cliquable

## Structure

```
index.html
css/style.css
js/
  theme.js         thème clair/sombre
  api.js           appels à l'API Tyradex + cache + image de secours
  utils.js         helpers partagés (types, slugs, fallback image, etc.)
  render.js        grille, recherche/filtres/tri, pagination & scroll infini
  modal.js         fiche détaillée d'un Pokémon
  sidebar.js       navigation, À propos, Changelog
  customSelect.js  menus déroulants custom (remplace les <select> natifs)
  app.js           initialisation
changelogs/
  index.json                     liste des fichiers de changelog
  AAAA-MM-JJ_HH-mm-ss.md         une entrée par modification
```

## Ajouter une entrée de changelog

1. Crée un fichier `changelogs/AAAA-MM-JJ_HH-mm-ss.md` (un fichier par modification) avec le contenu en Markdown.
2. Ajoute le nom du fichier dans `changelogs/index.json`.
3. L'entrée s'affichera automatiquement triée par date/heure, au format `JJ:MM:AAAA HH:MM` (les secondes du nom de fichier ne servent qu'à éviter les doublons, elles ne sont pas affichées).

## Déploiement sur GitHub Pages

1. Pousse ce dossier sur un dépôt GitHub.
2. Settings → Pages → Source : branche `main`, dossier `/root`.
3. Le site est servi statiquement, aucune compilation requise.

## Crédits

Données Pokémon fournies par [Tyradex](https://tyradex.app) (sources : Poképédia & Serebii). Pokémon et tous les noms respectifs sont des marques déposées de The Pokémon Company International, Game Freak et Nintendo.

## Licence

MIT — voir [LICENSE](LICENSE).

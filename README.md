# Pokémon API

---

## ✨ Fonctionnalités

- **Cartes 3D hover** (CSS pur), format élargi
- **Modal détaillé** : sprites *Normal*, *Shiny*, formes, **Méga** et **GigaMax**
- **Types / résistances / faiblesses** avec icônes + infobulles
- **Stats de base**, talents & évolutions
- **Recherche temps réel** (par **ID** et **nom**)
- **Pagination** : 10 / 25 / 50 / 100 / **Tout**
- **Sidebar fixe**
- **Navigation** : About & Changelog

---

## 🗂️ Arborescence

```bash
.
├── index.html # page principale (grille + modal)
├── README.md # Read me du projet
├── LICENSE # License MIT
├── src/
│    └── css/
│    │    ├── tokens.css # variables / design tokens
│    │    ├── base.css # reset & fond
│    │    ├── toolbar.css # barre d’outils (top)
│    │    ├── card.css # style des cartes
│    │    ├── details.css # listes, stats, résistances, types
│    │    ├── modal.css # modal + scrollbar custom
│    │    ├── sidebar.css # sidebar fixe + carte GitHub
│    │    └── responsive.css # ajustements mobiles
│    ├── img/
│    │    ├── pokeball.png # Icône du site
│    ├── pages/
│    │    ├── about.html
│    │    ├── changelog.html
│    ├── js/
│    │    ├── cards.js # Affichage des cartes
│    │    ├── details.js # Affichages des informations en plus de la carte
│    │    ├── dom.js 
│    │    ├── modal.js # Ouverture / Fermeture du modal des informations
│    │    ├── pagination.js
│    │    ├── script.js 
│    │    ├── search.js # recherche temps réel (ID + nom)
│    │    ├── sidebar.js # sidebar + dispatcher d’actions + GitHub
│    │    ├── sprites.js
│    │    ├── types.js
│    │    └── utils.js # helpers (DOM, formatage, fetch, etc.)
```

> Si certains modules ne sont pas encore séparés chez toi, tu peux conserver un seul `script.js` et migrer progressivement.

---

## 🔌 Données & API

- Source : [**TyraDex**](https://tyradex.vercel.app/) Endpoint principal utilisé : [`https://tyradex.vercel.app/api/v1/pokemon`](https://tyradex.vercel.app/)
- Les sprites (normal/shiny/mega/gmax) sont fournis par TyraDex (GitHub raw CDNs).
- Un fallback est prévu lorsque certaines URLs sont manquantes.

---

## 🚀 Installation & lancement

1. **Cloner**
  ```bash
  git clone https://github.com/ArmsYT/PokeAPI.git
  cd PokeAPI
  ```

---


## 🧭 Utilisation

- Recherche : tape un ID (ex. 6) ou un nom (ex. dracau) → la grille se filtre en temps réel.
- Voir + sur une carte → ouvre le modal détaillé.
- Sidebar : actions de pagination.

---

## ⚡ Performance

- Lazy images (loading="lazy")
- Rendu DOM par fragments
- Fallback offline pour la carte GitHub (pas de “trou” visuel)
- CSS modulaire, uniquement ce qu’il faut par page

---

## 📜 Licence & 🛡️ Mentions

Code sous [MIT LICENSE](https://github.com/ArmsYT/PokeAPI/blob/main/LICENSE).
Disclaimer : Projet non officiel. Pokémon et les noms associés sont des marques déposées de leurs propriétaires respectifs. Les visuels et données sont fournis à titre informatif via l’API publique TyraDex.

---

## 🙌 Crédits

- Données & sprites : [TyraDex](https://tyradex.vercel.app/)
- Design & intégration : [ArmsYT](https://www.github.com/ArmsYT)

---

## 📧 Contact
Pour toutes questions, suggestions ou contributions: 📩 [Arms](mailto:armsgfx@gmail.com).

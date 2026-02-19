# front-ccd

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## 📋 État d'avancement des fonctionnalités

| ID | Catégorie | Fonctionnalité | Complexité | Statut |
| :-- | :--- | :--- | :---: | :---: |
| **1** | **Articles** | Ajout d’un article (Admin) | ⭐ | ❌ |
| **2** | **Articles** | Affichage du catalogue (Pagination 10/page) | ⭐⭐ | ❌ |
| **3** | **Articles** | Filtrage avancé (Catégorie, Âge, État) | ⭐⭐ | ❌ |
| **4** | **Articles** | Modification d’un article (Gestion des stocks) | ⭐⭐ | ❌ |
| **5** | **Articles** | Identification par Code-barre / QR Code | ⭐⭐⭐ | ❌ |
| **6** | **Abonnés** | Inscription abonné (Préférences & Cookies) | ⭐⭐ | ❌ |
| **7** | **Abonnés** | Liste des abonnés (Admin) | ⭐ | ❌ |
| **8** | **Abonnés** | Modification des préférences (via Email) | ⭐⭐ | ❌ |
| **9** | **Box** | Paramétrage de campagne (Poids max) | ⭐ | ❌ |
| **10** | **Box** | Lancement de la composition (Optimisation) | ⭐⭐⭐ | ❌ |
| **11** | **Box** | Affichage des box composées (Scores & Détails) | ⭐⭐ | ❌ |
| **12** | **Box** | Validation individuelle des box | ⭐⭐ | ❌ |
| **13** | **Box** | Consultation de sa box (Espace Abonné) | ⭐ | ❌ |
| **14** | **Historique**| Historique personnel des box reçues | ⭐⭐ | ❌ |
| **15** | **Historique**| Historique global & Synthèse (Admin) | ⭐⭐ | ❌ |
| **16** | **Système** | Authentification (Abonné vs Gestionnaire) | ⭐⭐ | ❌ |
| **17** | **Système** | Tableau de bord (Statistiques & Graphiques) | ⭐⭐⭐ | ❌ |
| **18** | **Bonus** | Génération de Bon de préparation (PDF/Print) | ⭐⭐⭐ | ❌ |
| **19** | **Bonus** | Notifications par Email (MailCatcher) | ⭐⭐⭐ | ❌ |

---

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

| ID | Fonctionnalité | Complexité | Statut |
| :-- | :--- | :--- | :---: |
| **1** | Ajout d’un article (Admin) | ⭐ (Facile) | ❌ |
| **2** | Affichage du catalogue (Pagination 10/page) | ⭐ (Facile) | ❌ |
| **3** | Filtrage avancé (Catégorie, Âge, État) | ⭐⭐ (Avancé) | ❌ |
| **4** | Modification d’un article (Gestion des stocks) | ⭐⭐ (Avancé) | ❌ |
| **5** | Identification par Code-barre / QR Code | ⭐⭐ (Avancé) | ❌ |
| **6** | Inscription abonné (Préférences & Cookies) | ⭐ (Facile) | ❌ |
| **7** | Affichage de la liste des abonnés (Admin) | ⭐ (Facile) | ❌ |
| **8** | Modification des préférences (via Email) | ⭐⭐ (Avancé) | ❌ |
| **9** | Paramétrage de campagne (Poids max) | ⭐ (Facile) | ❌ |
| **10** | Lancement de la composition (Optimisation) | ⭐ (Facile) | ❌ |
| **11** | Affichage des box composées (Scores & Détails) | ⭐ (Facile) | ❌ |
| **12** | Validation individuelle des box | ⭐⭐ (Avancé) | ❌ |
| **13** | Consultation de sa box (Espace Abonné) | ⭐ (Facile) | ❌ |
| **14** | Historique personnel des box reçues | ⭐⭐ (Avancé) | ❌ |
| **15** | Historique global & Synthèse (Admin) | ⭐⭐ (Avancé) | ❌ |
| **16** | Authentification (Abonné vs Gestionnaire) | ⭐⭐ (Avancé) | ❌ |
| **17** | Tableau de bord (Statistiques & Graphiques) | ⭐⭐ (Avancé) | ❌ |
| **18** | Bon de préparation (Génération document) | ⭐⭐⭐ (Super avancé) | ❌ |
| **19** | Notification par email (MailCatcher) | ⭐⭐⭐ (Super avancé) | ❌ |

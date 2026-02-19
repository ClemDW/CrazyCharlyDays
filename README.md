# Projet Crazy Charly Days - Équipe Jus de Raison

Ce dépôt contient l'application développée par l'équipe **Jus de Raison** dans le cadre du projet Crazy Charly Days. Notre solution vise à optimiser la gestion, la répartition et la distribution d'articles via un système de box intelligentes.

## 👥 Membres de l'équipe

| Nom & Prénom | Parcours |
| --- | --- |
| **ALLART Noah** | RA-IL-1 |
| **ARMBRUSTER Loup** | RA-IL-1 |
| **FONTAINE Léo** | RA-IL-2 |
| **DE WACSH Clément** | DWM-2 |
| **TOPCU Semih** | DWM-2 |
| **BESANÇON Marcelin** | DWM-1 |
| **DENIS Oscar** | DACS |

## 🔗 Liens utiles

* **Dépôt Git :** [https://github.com/ClemDW/CrazyCharlyDays](https://github.com/ClemDW/CrazyCharlyDays)
* **Application finale :** *En attente de déploiement*

---

## 💻 Partie Application Web

L'interface utilisateur a été développée avec le framework **Vue.js** (Vue 3 + Vite), offrant une Single-Page Application (SPA) réactive.

### Fonctionnalités implantées

L'application couvre l'ensemble du cycle de vie des campagnes, de la gestion du catalogue à la répartition des produits :

* **F01 - Authentification & Sécurité :** Espace de connexion sécurisé administrateur (`AuthView.vue`).
* **F02 - Tableau de bord & Statistiques :** Visualisation des indicateurs de performance, de la répartition et de l'état global du système (`AdminDashboard.vue`, `AdminStats.vue`).
* **F03 - Gestion du Catalogue (Articles) :** Liste complète, filtres, ajout, modification et suppression des articles intégrés au système (`Catalog.vue`, `CreateArticle.vue`, `ArticleEdit.vue`). 
* **F04 - Gestion des Abonnés :** Interface de suivi des utilisateurs et de configuration des profils et préférences de leurs enfants (`AdminSubscribers.vue`).
* **F05 - Configuration de Campagne :** Initialisation et paramétrage des événements périodiques (poids moyen, budget, dates) (`CampaignConfig.vue`).
* **F06 - Génération & Gestion des Box :** Visualisation des box proposées, déclenchement de l'algorithme d'optimisation (répartition des articles) et validation des résultats (`AdminBoxes.vue`).

### Connexion Front / Back

La communication entre Vue.js et le serveur Express s'appuie sur une **API REST** :
* Le frontend émet des requêtes HTTP asynchrones (GET, POST, PUT, DELETE) vers les routes exposées par le backend (`/articles`, `/users`, `/box`, `/campaign`, `/optimize`).
* Un plugin dédié (`src/plugins/api.js`) centralise les appels API pour intercepter et standardiser les requêtes/réponses.
* Les payloads respectent rigoureusement le format JSON (tranches d'âge, énumérations, états) pour correspondre au typage fort du backend en base de données.
* Les assets volumineux (comme les images uploadées converties en Base64/Fichiers) sont gérés avec des limites configurées sur le serveur Express.

### Notes pour les tests

* **Identifiants de test :** `admin@ccd.com` / `password123`
* **Données pré-saisies :** Un jeu de données de test peut être chargé via le module `csv_manager` (voir section Optimisation).
* **Fonctionnalités additionnelles :** Mise en place d'un système de typage strict pour les catégories et tranches d'âge afin de garantir l'intégrité des données dès la saisie.

---

## ⚙️ Architecture & Optimisation

Le cœur de notre application repose sur une architecture backend robuste, conçue pour assurer la fluidité des échanges entre l'interface utilisateur et le moteur de calcul.

### Organisation du Backend

Nous avons adopté une structure modulaire pour faciliter la maintenance et l'évolution du code :

* **`controllers/`** : Point d'entrée de l'API. Ils orchestrent la logique métier et répondent aux requêtes du frontend.
* **`csv_manager/`** : Module dédié à l'interopérabilité, permettant l'importation massive et l'exportation des données (articles et abonnés).
* **`entities/`** : Définition des modèles de données. Nous utilisons des objets TypeScript `as const` pour gérer les énumérations (catégories, états, rôles), garantissant une sécurité de type de bout en bout.
* **`optimisation/`** : Le moteur algorithmique du projet. Ce module contient les fonctions de calcul de score et les algorithmes de répartition des articles dans les box.

### Choix Technologiques

* **PostgreSQL** : Nous avons choisi ce système de gestion de base de données relationnelle car il offre une gestion native et performante des types complexes (comme les tableaux et les enums).
* **TypeORM (Active Record)** : L'utilisation de cet ORM permet une manipulation fluide des données sous forme d'objets, simplifiant les opérations de création et de récupération tout en protégeant l'application contre les injections SQL.
* **REST API** : La communication est centralisée dans un serveur Express (`server.ts`), offrant une interface claire et documentée pour le frontend.

### Exemple d'utilisation pour tester la méthode d'optimisation sur un jeu de données

```js
import { loadCSV } from "./csv_manager/csv_loader";
import { saveCSV } from "./csv_manager/csv_saver";
import { Solver } from "./optimisation/Solver";

// Chargement du CSV contenant les données dans la BDD
loadCSV("/chemin/vers/fichier.csv");

// Résolution du problème d'optimisation à partir des données chargées
let res = Solver.solve();

// Génération du CSV à partir du résultat de l'optimisation
let csvString = Solver.generateCSVString(res);

// Sauvegarde du CSV généré dans un fichier dédié
saveCSV(csvString, "/chemin/vers/resultat.csv");
```

---

# Déploiement 
## Fonctionallité clé : Déploiement on-push sur docketu

Le serveur **Docketu** est hébergé sur le réseau interne de l'université
et *n'est pas accessible depuis Internet*. Les runners cloud de GitHub
Actions ne peuvent donc tout simplement pas l'atteindre. Pour contourner
cette contrainte, nous avons mis en place un **self-hosted runner** :
une machine personnelle connectée au réseau WiFi universitaire
**eduroam**, qui agit comme relais entre GitHub et Docketu.

Ce choix présente plusieurs avantages concrets. D'abord, il permet un
**déploiement entièrement automatique** : un simple `git push` sur la
branche `main` suffit à mettre à jour l'application en production, sans
aucune intervention manuelle sur le serveur. Cela élimine les erreurs
humaines et garantit que le code déployé correspond toujours à l'état du
dépôt.

Ensuite, la sécurité est assurée par un système de **clés SSH ed25519**
à deux niveaux : une première paire permet au runner de se connecter à
Docketu (clé privée stockée chiffrée dans les **GitHub Secrets**), et
une seconde permet à Docketu de récupérer le code depuis GitHub via
`git clone` / `git pull`. Aucun mot de passe ne transite, et les clés
privées ne sont jamais exposées dans le code.

Enfin, cette architecture est **reproductible et transparente** : toute
la logique de déploiement est décrite dans un unique fichier
`deploy.yml` versionné dans le dépôt. N'importe quel membre de l'équipe
peut comprendre, auditer ou modifier le pipeline sans documentation
externe.

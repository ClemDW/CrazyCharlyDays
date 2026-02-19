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

## 💻 Partie Application Web (A COMPLETER)

### Fonctionnalités implantées

* [Lister ici les numéros des fonctionnalités, ex: F01 - Gestion du catalogue, etc.]

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

## 🚀 Déploiement (A COMPLETER)

Le déploiement de l'application suit une méthodologie d'intégration continue :

1. **Environnement local** : Utilisation de Docker pour harmoniser les instances PostgreSQL entre les développeurs.
2. **Validation** : Scripts de migration pour assurer la cohérence du schéma de base de données.
3. **Hébergement** : [Détaillez ici si vous utilisez Heroku, Vercel, un VPS, etc.]

---

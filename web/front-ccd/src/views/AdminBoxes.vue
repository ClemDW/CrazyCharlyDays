<script setup lang="ts">
import { ref, reactive, computed } from "vue";

interface Article {
  description: string;
  category: string;
  ageRange: string;
  state: string;
  weight: number;
  price: number;
}

interface Box {
  id: number;
  subscriberEmail: string;
  subscriberName: string;
  childAge: string;
  score: number;
  articles: Article[];
  validated: boolean;
}

// --- Mock data ---
const boxes = reactive<Box[]>([
  {
    id: 1,
    subscriberEmail: "marie@test.com",
    subscriberName: "Marie Dupont",
    childAge: "PE — 3-6 ans",
    score: 87,
    validated: true,
    articles: [
      {
        description: "Puzzle en bois 24 pièces",
        category: "Jeux d'éveil et éducatifs",
        ageRange: "PE",
        state: "Très bon état",
        weight: 350,
        price: 4.5,
      },
      {
        description: "Figurine dinosaure T-Rex",
        category: "Figurines et poupées",
        ageRange: "PE",
        state: "Bon état",
        weight: 200,
        price: 3.0,
      },
      {
        description: "Livre « Le petit prince »",
        category: "Livres jeunesse",
        ageRange: "PE",
        state: "Neuf",
        weight: 300,
        price: 5.0,
      },
      {
        description: "Jeu de construction 50 pièces",
        category: "Jeux de construction",
        ageRange: "PE",
        state: "Très bon état",
        weight: 600,
        price: 7.0,
      },
      {
        description: "Jeu de cartes « 7 familles »",
        category: "Jeux de société",
        ageRange: "PE",
        state: "Neuf",
        weight: 150,
        price: 2.5,
      },
      {
        description: "Ballon en mousse",
        category: "Jeux d'extérieur",
        ageRange: "PE",
        state: "Bon état",
        weight: 250,
        price: 2.5,
      },
    ],
  },
  {
    id: 2,
    subscriberEmail: "jean@test.com",
    subscriberName: "Jean Martin",
    childAge: "EN — 6-10 ans",
    score: 72,
    validated: false,
    articles: [
      {
        description: "Monopoly Junior",
        category: "Jeux de société",
        ageRange: "EN",
        state: "Bon état",
        weight: 800,
        price: 8.0,
      },
      {
        description: "Robot à assembler",
        category: "Jeux de construction",
        ageRange: "EN",
        state: "Neuf",
        weight: 450,
        price: 12.0,
      },
      {
        description: "BD Astérix tome 5",
        category: "Livres jeunesse",
        ageRange: "EN",
        state: "Très bon état",
        weight: 280,
        price: 4.0,
      },
      {
        description: "Corde à sauter",
        category: "Jeux d'extérieur",
        ageRange: "EN",
        state: "Neuf",
        weight: 120,
        price: 2.0,
      },
    ],
  },
  {
    id: 3,
    subscriberEmail: "sophie@test.com",
    subscriberName: "Sophie Leroy",
    childAge: "BB — 0-3 ans",
    score: 93,
    validated: true,
    articles: [
      {
        description: "Hochet en bois",
        category: "Jeux d'éveil et éducatifs",
        ageRange: "BB",
        state: "Neuf",
        weight: 100,
        price: 3.0,
      },
      {
        description: "Peluche lapin",
        category: "Figurines et poupées",
        ageRange: "BB",
        state: "Très bon état",
        weight: 200,
        price: 5.0,
      },
      {
        description: "Cubes empilables",
        category: "Jeux de construction",
        ageRange: "BB",
        state: "Neuf",
        weight: 400,
        price: 6.0,
      },
      {
        description: "Imagier animaux",
        category: "Livres jeunesse",
        ageRange: "BB",
        state: "Neuf",
        weight: 250,
        price: 4.5,
      },
      {
        description: "Tapis d'éveil pliant",
        category: "Jeux d'éveil et éducatifs",
        ageRange: "BB",
        state: "Bon état",
        weight: 500,
        price: 8.0,
      },
    ],
  },
]);

// Computed helpers
function totalWeight(box: Box): number {
  return box.articles.reduce((sum, a) => sum + a.weight, 0);
}

function totalPrice(box: Box): number {
  return box.articles.reduce((sum, a) => sum + a.price, 0);
}

function scoreClass(score: number): string {
  if (score >= 85) return "score-high";
  if (score >= 60) return "score-mid";
  return "score-low";
}

// Expanded toggle
const expandedIds = ref<Set<number>>(new Set());

function toggleExpand(id: number) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id);
  } else {
    expandedIds.value.add(id);
  }
}
</script>

<template>
  <div class="admin-boxes">
    <h1>Box composées</h1>
    <p class="subtitle">
      Visualisation de toutes les box proposées par l'optimisation.
    </p>

    <p class="summary">
      {{ boxes.length }} box au total ·
      {{ boxes.filter((b) => b.validated).length }} validées ·
      {{ boxes.filter((b) => !b.validated).length }} en attente
    </p>

    <div v-for="box in boxes" :key="box.id" class="box-card">
      <!-- Header row -->
      <div class="box-header" @click="toggleExpand(box.id)">
        <div class="box-title">
          <span class="expand-icon">{{
            expandedIds.has(box.id) ? "▾" : "▸"
          }}</span>
          <h2>📦 Box #{{ box.id }}</h2>
          <span
            :class="['badge', box.validated ? 'badge-ok' : 'badge-pending']"
          >
            {{ box.validated ? "✅ Validée" : "⏳ En attente" }}
          </span>
        </div>
        <div :class="['score', scoreClass(box.score)]">
          {{ box.score }}<small>/100</small>
        </div>
      </div>

      <!-- Meta -->
      <div class="box-meta">
        <span
          ><strong>{{ box.subscriberName }}</strong> ({{
            box.subscriberEmail
          }})</span
        >
        <span>Âge : {{ box.childAge }}</span>
        <span>Poids : {{ totalWeight(box) }} g</span>
        <span>Prix : {{ totalPrice(box).toFixed(2) }} €</span>
      </div>

      <!-- Expanded articles table -->
      <div v-if="expandedIds.has(box.id)" class="box-details">
        <table class="articles-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Article</th>
              <th>Catégorie</th>
              <th>Âge</th>
              <th>État</th>
              <th>Poids</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(article, idx) in box.articles" :key="idx">
              <td class="cell-num">{{ idx + 1 }}</td>
              <td>{{ article.description }}</td>
              <td>{{ article.category }}</td>
              <td>{{ article.ageRange }}</td>
              <td>{{ article.state }}</td>
              <td class="cell-num">{{ article.weight }} g</td>
              <td class="cell-num">{{ article.price.toFixed(2) }} €</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5"><strong>Total</strong></td>
              <td class="cell-num">
                <strong>{{ totalWeight(box) }} g</strong>
              </td>
              <td class="cell-num">
                <strong>{{ totalPrice(box).toFixed(2) }} €</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-boxes {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem 2rem;
  font-family: "Inter", "Segoe UI", sans-serif;
}

h1 {
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #666;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.summary {
  font-size: 0.88rem;
  color: #888;
  margin-bottom: 1.5rem;
}

/* Box card */
.box-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #fff;
  margin-bottom: 1rem;
  overflow: hidden;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background 0.1s;
}

.box-header:hover {
  background: #f8f9fb;
}

.box-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.box-title h2 {
  font-size: 1rem;
  margin: 0;
}

.expand-icon {
  font-size: 1rem;
  color: #999;
  width: 1rem;
}

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-ok {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge-pending {
  background: #fff3e0;
  color: #e65100;
}

/* Score */
.score {
  font-size: 1.4rem;
  font-weight: 800;
  min-width: 3.5rem;
  text-align: center;
}

.score small {
  font-size: 0.7rem;
  font-weight: 500;
  color: #999;
}

.score-high {
  color: #2e7d32;
}

.score-mid {
  color: #f57c00;
}

.score-low {
  color: #c62828;
}

/* Meta */
.box-meta {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 0 1.25rem 0.75rem;
  font-size: 0.85rem;
  color: #555;
}

/* Details */
.box-details {
  border-top: 1px solid #f0f0f0;
  padding: 1rem 1.25rem;
}

/* Table */
.articles-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.articles-table th {
  text-align: left;
  font-weight: 600;
  color: #555;
  padding: 0.45rem 0.6rem;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.articles-table td {
  padding: 0.45rem 0.6rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.articles-table tfoot td {
  border-bottom: none;
  border-top: 2px solid #e0e0e0;
  padding-top: 0.6rem;
}

.articles-table tbody tr:hover {
  background: #f8f9fb;
}

.cell-num {
  text-align: right;
  white-space: nowrap;
}

/* Responsive */
@media (max-width: 640px) {
  .box-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .box-meta {
    flex-direction: column;
    gap: 0.25rem;
  }

  .articles-table {
    font-size: 0.78rem;
  }

  .articles-table th,
  .articles-table td {
    padding: 0.35rem 0.4rem;
  }
}
</style>

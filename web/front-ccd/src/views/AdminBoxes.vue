<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface Article {
  id: string;
  description: string;
  category: string;
  age_range: string;
  state: string;
  weight: number;
  price: number;
}

interface Box {
  id_user: string;
  subscriberEmail: string;
  subscriberName: string;
  score: number;
  total_weight: number;
  total_price: number;
  articles: Article[];
  validated: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const boxes = ref<Box[]>([]);
const loading = ref(true);
const error = ref("");
const globalScore = ref(0);

async function fetchBoxes() {
  loading.value = true;
  error.value = "";
  try {
    const response = await axios.get(`${API_URL}/box/detailed`);
    const data = response.data.jsonObject;
    boxes.value = data.boxes;
    globalScore.value = data.score;
  } catch (err: any) {
    console.error("Erreur lors du chargement des boxes:", err);
    error.value =
      "Impossible de charger les boxes. Assurez-vous que le backend est démarré.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchBoxes();
});

function scoreClass(score: number): string {
  if (score >= 40) return "score-high";
  if (score >= 20) return "score-mid";
  return "score-low";
}

// Expanded toggle
const expandedIds = ref<Set<string>>(new Set());

function toggleExpand(id_user: string) {
  if (expandedIds.value.has(id_user)) {
    expandedIds.value.delete(id_user);
  } else {
    expandedIds.value.add(id_user);
  }
}
</script>

<template>
  <div class="admin-boxes">
    <h1>Box composées</h1>
    <p class="subtitle">
      Visualisation de toutes les box proposées par l'optimisation.
    </p>

    <!-- Loading / Error -->
    <div v-if="loading" class="loading-state">
      <span class="spinner">⏳</span> Optimisation en cours...
    </div>

    <div v-if="error" class="msg error">
      {{ error }}
      <button @click="fetchBoxes" class="retry-btn">Réessayer</button>
    </div>

    <!-- Summary -->
    <p v-if="!loading && !error" class="summary">
      {{ boxes.length }} box proposées · Score global :
      <strong>{{ globalScore }}</strong>
    </p>

    <div v-for="(box, idx) in boxes" :key="box.id_user" class="box-card">
      <!-- Header row -->
      <div class="box-header" @click="toggleExpand(box.id_user)">
        <div class="box-title">
          <span class="expand-icon">{{
            expandedIds.has(box.id_user) ? "▾" : "▸"
          }}</span>
          <h2>📦 Box #{{ idx + 1 }}</h2>
          <span
            :class="['badge', box.validated ? 'badge-ok' : 'badge-pending']"
          >
            {{ box.validated ? "✅ Validée" : "⏳ Proposée" }}
          </span>
        </div>
        <div :class="['score', scoreClass(box.score)]">
          {{ box.score }}
        </div>
      </div>

      <!-- Meta -->
      <div class="box-meta">
        <span
          ><strong>{{ box.subscriberName }}</strong> ({{
            box.subscriberEmail
          }})</span
        >
        <span>Poids : {{ box.total_weight }} g</span>
        <span>Prix : {{ (box.total_price || 0).toFixed(2) }} €</span>
      </div>

      <!-- Expanded articles table -->
      <div v-if="expandedIds.has(box.id_user)" class="box-details">
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
          <tbody v-if="box.articles.length > 0">
            <tr v-for="(article, aIdx) in box.articles" :key="article.id">
              <td class="cell-num">{{ aIdx + 1 }}</td>
              <td>{{ article.description }}</td>
              <td>{{ article.category }}</td>
              <td>{{ article.age_range }}</td>
              <td>{{ article.state }}</td>
              <td class="cell-num">{{ article.weight }} g</td>
              <td class="cell-num">{{ (article.price || 0).toFixed(2) }} €</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7" class="empty-row">Aucun article assigné</td>
            </tr>
          </tbody>
          <tfoot v-if="box.articles.length > 0">
            <tr>
              <td colspan="5"><strong>Total</strong></td>
              <td class="cell-num">
                <strong>{{ box.total_weight }} g</strong>
              </td>
              <td class="cell-num">
                <strong>{{ (box.total_price || 0).toFixed(2) }} €</strong>
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

/* Loading / Error */
.loading-state {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}

.spinner {
  display: inline-block;
  animation: rotate 2s linear infinite;
  font-size: 1.5rem;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-left: 1rem;
  padding: 0.3rem 0.8rem;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty-row {
  text-align: center;
  padding: 2rem !important;
  color: #999;
  font-style: italic;
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

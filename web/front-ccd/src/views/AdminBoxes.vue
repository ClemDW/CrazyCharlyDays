<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

type Article = {
  id_article: string;
  description: string;
  category: string;
  age_range: string;
  state: string;
  weight: number;
  price: number;
};

type AdminBox = {
  id_box: string;
  score_box: number;
  total_weight: number;
  total_price: number;
  validated: boolean;
  user: {
    name: string;
    family_name: string;
    email: string;
  } | null;
  campaign: {
    date: string;
    status: string;
  } | null;
  articles: Article[];
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const boxes = ref<AdminBox[]>([]);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const validatingIds = ref<Set<string>>(new Set());

async function fetchBoxes() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch(`${API_BASE_URL}/box/admin`);
    if (!response.ok) {
      throw new Error("Impossible de charger les box");
    }
    const data = await response.json();
    boxes.value = Array.isArray(data) ? data : [];
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des box composées.";
  } finally {
    loading.value = false;
  }
}

async function validateBox(boxId: string) {
  validatingIds.value.add(boxId);
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await fetch(`${API_BASE_URL}/box/${boxId}/validate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Validation impossible");
    }

    boxes.value = boxes.value.map((box) =>
      box.id_box === boxId ? { ...box, validated: true } : box,
    );
    successMessage.value = data?.message || "Box validée avec succès.";
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Erreur lors de la validation de la box.";
  } finally {
    validatingIds.value.delete(boxId);
  }
}

onMounted(fetchBoxes);

// Computed helpers
function totalWeight(box: AdminBox): number {
  if (typeof box.total_weight === "number" && box.total_weight > 0) {
    return box.total_weight;
  }
  return box.articles.reduce((sum, a) => sum + a.weight, 0);
}

function totalPrice(box: AdminBox): number {
  if (typeof box.total_price === "number" && box.total_price > 0) {
    return box.total_price;
  }
  return box.articles.reduce((sum, a) => sum + a.price, 0);
}

function scoreClass(score: number): string {
  if (score >= 85) return "score-high";
  if (score >= 60) return "score-mid";
  return "score-low";
}

// Expanded toggle
const expandedIds = ref<Set<string>>(new Set());

function toggleExpand(id: string) {
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

    <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="msg success">{{ successMessage }}</p>
    <p v-if="loading" class="summary">Chargement des box...</p>

    <p v-else class="summary">
      {{ boxes.length }} box au total ·
      {{ boxes.filter((b) => b.validated).length }} validées ·
      {{ boxes.filter((b) => !b.validated).length }} en attente
    </p>

    <div v-for="box in boxes" :key="box.id_box" class="box-card">
      <!-- Header row -->
      <div class="box-header" @click="toggleExpand(box.id_box)">
        <div class="box-title">
          <span class="expand-icon">{{
            expandedIds.has(box.id_box) ? "▾" : "▸"
          }}</span>
          <h2>📦 Box #{{ box.id_box.slice(0, 8) }}</h2>
          <span
            :class="['badge', box.validated ? 'badge-ok' : 'badge-pending']"
          >
            {{ box.validated ? "✅ Validée" : "⏳ En attente" }}
          </span>
        </div>
        <div :class="['score', scoreClass(box.score_box)]">
          {{ box.score_box }}<small>/100</small>
        </div>
      </div>

      <!-- Meta -->
      <div class="box-meta">
        <span
          ><strong
            >{{ box.user?.name }} {{ box.user?.family_name || "" }}</strong
          >
          ({{
            box.user?.email || "Email inconnu"
          }})</span
        >
        <span v-if="box.campaign"
          >Campagne : {{ new Date(box.campaign.date).toLocaleDateString() }}</span
        >
        <span>Poids : {{ totalWeight(box) }} g</span>
        <span>Prix : {{ totalPrice(box).toFixed(2) }} €</span>
      </div>

      <div v-if="!box.validated" class="box-actions">
        <button
          class="btn-validate"
          :disabled="validatingIds.has(box.id_box)"
          @click.stop="validateBox(box.id_box)"
        >
          {{ validatingIds.has(box.id_box) ? "Validation..." : "Valider cette box" }}
        </button>
      </div>

      <!-- Expanded articles table -->
      <div v-if="expandedIds.has(box.id_box)" class="box-details">
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
              <td>{{ article.age_range }}</td>
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

.msg {
  padding: 0.65rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.msg.error {
  background: #fdecea;
  color: #c62828;
}

.msg.success {
  background: #e8f5e9;
  color: #2e7d32;
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

.box-actions {
  padding: 0 1.25rem 1rem;
}

.btn-validate {
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: 6px;
  background: #2e7d32;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-validate:disabled {
  opacity: 0.55;
  cursor: not-allowed;
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

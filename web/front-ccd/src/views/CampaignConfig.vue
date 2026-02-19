<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { getCookie, setCookie } from "@/utils/cookie";

const API_URL = "http://localhost:3000";
const router = useRouter();

// --- State ---
const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);
const maxWeight = ref<number | null>(null);
const errorMessage = ref("");
const successMessage = ref("");
const configSaved = ref(false);
const loading = ref(false);

// --- Load saved config on mount ---
onMounted(() => {
  const saved = getCookie("campaign_config");
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    if (data.minPrice != null) minPrice.value = data.minPrice;
    if (data.maxPrice != null) maxPrice.value = data.maxPrice;
    if (data.maxWeight != null) maxWeight.value = data.maxWeight;
    configSaved.value = true;
    successMessage.value = "Configuration précédente restaurée.";
  } catch {
    // Cookie invalide
  }
});

// --- Submit ---
async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!minPrice.value || minPrice.value <= 0) {
    errorMessage.value =
      "Veuillez saisir un prix minimum valide (supérieur à 0).";
    return;
  }

  if (!maxPrice.value || maxPrice.value <= 0) {
    errorMessage.value =
      "Veuillez saisir un prix maximum valide (supérieur à 0).";
    return;
  }

  if (minPrice.value > maxPrice.value) {
    errorMessage.value =
      "Le prix minimum ne peut pas dépasser le prix maximum.";
    return;
  }

  if (!maxWeight.value || maxWeight.value <= 0) {
    errorMessage.value =
      "Veuillez saisir un poids maximum valide (supérieur à 0).";
    return;
  }

  loading.value = true;
  try {
    // Create a new campaign via API
    const response = await axios.post(`${API_URL}/campaign`, {
      date: new Date().toISOString(),
      max_weight: maxWeight.value,
      min_price: minPrice.value,
      max_price: maxPrice.value,
      total_weight: 0,
      total_price: 0,
      status: "IN_PROGRESS",
    });

    const campaignId = response.data.id_camp;

    // Save to cookie (90 days)
    const payload = {
      campaignId,
      minPrice: minPrice.value,
      maxPrice: maxPrice.value,
      maxWeight: maxWeight.value,
    };
    setCookie("campaign_config", JSON.stringify(payload), 90);

    configSaved.value = true;
    successMessage.value = `Campagne créée avec succès (ID : ${campaignId}). Prix ${minPrice.value}€ – ${maxPrice.value}€, poids max ${maxWeight.value} g.`;
  } catch (error: any) {
    console.error("Erreur :", error);
    errorMessage.value =
      error.response?.data?.message ||
      "Erreur lors de la création de la campagne.";
  } finally {
    loading.value = false;
  }
}

const compositionLoading = ref(false);
const compositionResult = ref<any>(null);
const compositionError = ref("");
const csvData = ref("");

async function launchComposition() {
  if (!configSaved.value) return;
  compositionLoading.value = true;
  compositionError.value = "";
  compositionResult.value = null;

  try {
    const response = await axios.get(`${API_URL}/optimize`);
    compositionResult.value = response.data.jsonObject;
    csvData.value = response.data.csv;
    successMessage.value = `Composition terminée ! Score global : ${response.data.jsonObject.score}`;
  } catch (error: any) {
    console.error("Erreur lors de la composition :", error);
    compositionError.value =
      error.response?.data?.message ||
      "Erreur lors du lancement de la composition.";
  } finally {
    compositionLoading.value = false;
  }
}

function downloadCSV() {
  if (!csvData.value) return;
  const blob = new Blob([csvData.value], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "composition.csv";
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="config-container">
    <h1>Paramétrage de campagne</h1>
    <p class="subtitle">
      Définissez les paramètres de la campagne avant de lancer la composition
      des box.
    </p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="minPrice">Prix minimum par box (en €)</label>
        <div class="input-with-unit">
          <input
            id="minPrice"
            v-model.number="minPrice"
            type="number"
            min="1"
            step="0.01"
            placeholder="Ex : 15"
          />
          <span class="unit">€</span>
        </div>
      </div>

      <div class="form-group">
        <label for="maxPrice">Prix maximum par box (en €)</label>
        <div class="input-with-unit">
          <input
            id="maxPrice"
            v-model.number="maxPrice"
            type="number"
            min="1"
            step="0.01"
            placeholder="Ex : 30"
          />
          <span class="unit">€</span>
        </div>
      </div>

      <div class="form-group">
        <label for="maxWeight">Poids maximum par box (en grammes)</label>
        <div class="input-with-unit">
          <input
            id="maxWeight"
            v-model.number="maxWeight"
            type="number"
            min="1"
            placeholder="Ex : 2000"
          />
          <span class="unit">g</span>
        </div>
      </div>

      <!-- Messages -->
      <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="msg success">{{ successMessage }}</p>

      <!-- Submit -->
      <button type="submit" class="btn-submit" :disabled="loading">
        {{ loading ? "Création en cours..." : "Enregistrer la configuration" }}
      </button>
    </form>

    <!-- Launch button (outside the form) -->
    <button
      class="btn-launch"
      :disabled="!configSaved || compositionLoading"
      @click="launchComposition"
    >
      {{
        compositionLoading
          ? "⏳ Optimisation en cours..."
          : "🚀 Lancer la composition"
      }}
    </button>

    <!-- Composition error -->
    <p v-if="compositionError" class="msg error" style="margin-top: 1rem">
      {{ compositionError }}
    </p>

    <!-- Composition results -->
    <div v-if="compositionResult" class="results">
      <h2>Résultats de la composition</h2>
      <p class="score-badge">
        Score global : <strong>{{ compositionResult.score }}</strong>
      </p>
      <p class="subtitle">
        {{ compositionResult.boxes.length }} box(es) composée(s)
      </p>

      <button v-if="csvData" class="btn-csv" @click="downloadCSV">
        📥 Télécharger le CSV
      </button>

      <div
        v-for="(box, idx) in compositionResult.boxes"
        :key="idx"
        class="result-box"
      >
        <div class="box-header">
          <h3>
            📦 {{ box.userName }}
            <span class="box-user-id">({{ box.id_user.slice(0, 8) }}…)</span>
          </h3>
          <div class="box-metrics">
            <span class="metric-badge score">⭐ {{ box.score }}</span>
            <span
              class="metric-badge weight"
              :class="{
                warning:
                  (maxWeight || 0) > 0 &&
                  box.total_weight > (maxWeight || 0) * 0.9,
              }"
            >
              ⚖️ {{ box.total_weight }} / {{ maxWeight || 0 }}g
            </span>
            <span class="metric-badge price">💰 {{ box.total_price }}€</span>
          </div>
        </div>
        <ul>
          <li v-for="art in box.articles" :key="art.id">
            <span class="art-cat">{{ art.category }}</span>
            <span class="art-age">{{ art.age_range }}</span>
            <span class="art-state">{{ art.state }}</span>
            <span class="art-details"
              >{{ art.weight }}g | {{ art.price }}€</span
            >
          </li>
        </ul>
        <p v-if="box.articles.length === 0" class="empty-box">
          Aucun article assigné
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Inter", "Segoe UI", sans-serif;
}

h1 {
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-with-unit input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.input-with-unit input:focus {
  outline: none;
  border-color: #4f8cff;
  box-shadow: 0 0 0 2px rgba(79, 140, 255, 0.25);
}

.unit {
  font-weight: 600;
  color: #555;
  font-size: 1rem;
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

.btn-submit {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background: #4f8cff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-submit:hover {
  background: #3a75e0;
}

.btn-launch {
  display: block;
  width: 100%;
  margin-top: 1rem;
  padding: 0.85rem;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.15s,
    opacity 0.15s;
}

.btn-launch:hover:not(:disabled) {
  background: #1b5e20;
}

.btn-launch:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Composition results */
.results {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e0e0e0;
}

.score-badge {
  font-size: 1.1rem;
  color: #2e7d32;
  margin-bottom: 0.5rem;
}

.btn-csv {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  margin-bottom: 1rem;
  background: #1565c0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-csv:hover {
  background: #0d47a1;
}

.result-box {
  background: #f8f9fb;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
}

.result-box h3 {
  font-size: 0.95rem;
  margin: 0;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.box-metrics {
  display: flex;
  gap: 0.5rem;
}

.metric-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric-badge.score {
  background: #fff3e0;
  color: #ef6c00;
}
.metric-badge.weight {
  background: #e1f5fe;
  color: #0277bd;
}
.metric-badge.weight.warning {
  background: #fffde7;
  color: #fbc02d;
  border: 1px solid #fbc02d;
}
.metric-badge.price {
  background: #f1f8e9;
  color: #33691e;
}

.art-details {
  font-size: 0.75rem;
  color: #666;
  margin-left: auto;
}

.box-user-id {
  color: #999;
  font-weight: 400;
  font-size: 0.8rem;
}

.result-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.result-box li {
  display: flex;
  gap: 0.25rem;
}

.art-cat,
.art-age,
.art-state {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.art-cat {
  background: #e3f2fd;
  color: #1565c0;
}
.art-age {
  background: #f3e5f5;
  color: #7b1fa2;
}
.art-state {
  background: #e8f5e9;
  color: #2e7d32;
}

.empty-box {
  color: #999;
  font-size: 0.85rem;
  font-style: italic;
}
</style>

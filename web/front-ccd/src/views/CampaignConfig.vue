<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// --- State ---
const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);
const maxWeight = ref<number | null>(null);
const errorMessage = ref("");
const successMessage = ref("");
const configSaved = ref(false);

// --- Cookie helpers ---
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

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
function handleSubmit() {
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

  const payload = {
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    maxWeight: maxWeight.value,
  };

  setCookie("campaign_config", JSON.stringify(payload), 90);

  console.log("Campaign config:", payload);
  configSaved.value = true;
  successMessage.value = `Configuration enregistrée : prix ${minPrice.value}€ – ${maxPrice.value}€, poids max ${maxWeight.value} g.`;
}

function launchComposition() {
  if (!configSaved.value) return;
  console.log("Lancement de la composition avec la configuration actuelle.");
  // TODO: intégrer la logique de composition
  alert("Composition lancée !");
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
      <button type="submit" class="btn-submit">
        Enregistrer la configuration
      </button>
    </form>

    <!-- Launch button (outside the form) -->
    <button
      class="btn-launch"
      :disabled="!configSaved"
      @click="launchComposition"
    >
      🚀 Lancer la composition
    </button>
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
</style>

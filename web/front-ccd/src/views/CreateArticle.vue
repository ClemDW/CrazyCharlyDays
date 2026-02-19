<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const description = ref("");
const category = ref("SOC");
const ageRange = ref("BB");
const state = ref("N");
const price = ref<number | null>(null);
const weight = ref<number | null>(null);
const code_barre = ref("");
const photoPreview = ref<string | null>(null);

const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

function onPhotoChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function removePhoto() {
  photoPreview.value = null;
  // Reset the file input
  const input = document.getElementById("photo") as HTMLInputElement;
  if (input) input.value = "";
}

async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!description.value.trim()) {
    errorMessage.value = "Veuillez saisir une description.";
    return;
  }
  if (!price.value || price.value <= 0) {
    errorMessage.value = "Veuillez saisir un prix valide.";
    return;
  }
  if (!weight.value || weight.value <= 0) {
    errorMessage.value = "Veuillez saisir un poids valide.";
    return;
  }

  const payload = {
    description: description.value.trim(),
    category: category.value,
    age_range: ageRange.value,
    state: state.value,
    price: price.value,
    weight: weight.value,
    code_barre: code_barre.value.trim() || undefined,
    picture: photoPreview.value || undefined,
  };

  loading.value = true;
  try {
    const response = await axios.post(
      "http://localhost:3000/articles",
      payload,
    );
    console.log("Article créé :", response.data);
    successMessage.value = `Article « ${description.value.trim()} » ajouté avec succès (ID : ${response.data.id_article}).`;

    // Reset
    description.value = "";
    price.value = null;
    weight.value = null;
    code_barre.value = "";
    photoPreview.value = null;
    const fileInput = document.getElementById("photo") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  } catch (error: any) {
    console.error("Erreur lors de la création :", error);
    errorMessage.value =
      error.response?.data?.message ||
      "Erreur lors de la création de l'article.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="create-article">
    <h1>Création d'un article</h1>
    <p class="subtitle">Ajoutez un nouveau jouet, jeu ou livre au catalogue.</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="description">Description</label>
        <input
          id="description"
          v-model="description"
          type="text"
          placeholder="Ex : Puzzle en bois 24 pièces"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="categorie-list">Catégorie</label>
          <select id="categorie-list" v-model="category">
            <option value="SOC">SOC — Jeux de société</option>
            <option value="FIG">FIG — Figurines et poupées</option>
            <option value="CON">CON — Jeux de construction</option>
            <option value="EXT">EXT — Jeux d'extérieur</option>
            <option value="EVL">EVL — Jeux d'éveil et éducatifs</option>
            <option value="LIV">LIV — Livres jeunesse</option>
          </select>
        </div>

        <div class="form-group">
          <label for="age_range-list">Tranche d'âge</label>
          <select id="age_range-list" v-model="ageRange">
            <option value="BB">BB — 0-3 ans</option>
            <option value="PE">PE — 3-6 ans</option>
            <option value="EN">EN — 6-10 ans</option>
            <option value="AD">AD — 10+ ans</option>
          </select>
        </div>

        <div class="form-group">
          <label for="state-list">État</label>
          <select id="state-list" v-model="state">
            <option value="N">N — Neuf</option>
            <option value="TB">TB — Très bon état</option>
            <option value="B">B — Bon état</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="prix">Prix (€)</label>
          <div class="input-with-unit">
            <input
              id="prix"
              v-model.number="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex : 5.00"
            />
            <span class="unit">€</span>
          </div>
        </div>

        <div class="form-group">
          <label for="poids">Poids (g)</label>
          <div class="input-with-unit">
            <input
              id="poids"
              v-model.number="weight"
              type="number"
              min="0"
              placeholder="Ex : 350"
            />
            <span class="unit">g</span>
          </div>
        </div>
      </div>

      <!-- Barcode / QR Code -->
      <div class="form-group">
        <label for="code_barre">Code-barre / QR Code (Optionnel)</label>
        <input
          id="code_barre"
          v-model="code_barre"
          type="text"
          placeholder="Scannez ou saisissez un code..."
        />
        <p class="help-text">
          Utilisez ce champ pour associer un identifiant physique à l'article.
        </p>
      </div>

      <!-- Photo upload -->
      <div class="form-group">
        <label for="photo">Photo de l'article</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          class="file-input"
          @change="onPhotoChange"
        />
        <div v-if="photoPreview" class="photo-preview">
          <img :src="photoPreview" alt="Aperçu" />
          <button type="button" class="btn-remove-photo" @click="removePhoto">
            ✕ Supprimer la photo
          </button>
        </div>
      </div>

      <!-- Messages -->
      <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="msg success">{{ successMessage }}</p>

      <button type="submit" class="btn-submit" :disabled="loading">
        {{ loading ? "Ajout en cours..." : "Ajouter l'article" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.create-article {
  max-width: 650px;
  margin: 2rem auto;
  padding: 0 1.5rem 2rem;
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

.help-text {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
}

.form-group {
  margin-bottom: 1rem;
  flex: 1;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4f8cff;
  box-shadow: 0 0 0 2px rgba(79, 140, 255, 0.25);
}

.form-row {
  display: flex;
  gap: 1rem;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-with-unit input {
  flex: 1;
}

.unit {
  font-weight: 600;
  color: #555;
  font-size: 1rem;
}

/* Photo */
.file-input {
  display: block;
  font-size: 0.9rem;
  padding: 0.4rem 0;
}

.photo-preview {
  margin-top: 0.75rem;
  text-align: center;
}

.photo-preview img {
  max-width: 100%;
  max-height: 250px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  object-fit: contain;
}

.btn-remove-photo {
  display: block;
  margin: 0.5rem auto 0;
  background: none;
  border: none;
  color: #e04040;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-remove-photo:hover {
  text-decoration: underline;
}

/* Messages */
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
</style>

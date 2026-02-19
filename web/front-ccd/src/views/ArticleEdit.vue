<script>
export default {
  props: ["id"],
  data() {
    return {
      article: null,
      form: {
        description: "",
        category: "",
        age_range: "",
        state: "",
        price: 0,
        weight: 0,
      },
      loading: true,
      submitting: false,
      error: null,
      success: null,
    };
  },
  methods: {
    async fetchArticle() {
      this.loading = true;
      try {
        const response = await this.$api.get(`/articles/${this.id}`);
        this.article = response.data;

        // Pré-remplissage du formulaire
        this.form = {
          description: this.article.description,
          category: this.article.category,
          age_range: this.article.age_range,
          state: this.article.state,
          price: this.article.price,
          weight: this.article.weight,
        };
      } catch (err) {
        console.error("Erreur chargement article:", err);
        this.error = "Impossible de charger les données de l'article.";
      } finally {
        this.loading = false;
      }
    },
    async submitForm() {
      this.submitting = true;
      this.error = null;
      this.success = null;

      try {
        await this.$api.put(`/articles/${this.id}`, this.form);
        this.success = "Article mis à jour avec succès !";
        setTimeout(() => {
          this.$router.push({
            name: "article-detail",
            params: { id: this.id },
          });
        }, 1500);
      } catch (err) {
        console.error("Erreur lors de la mise à jour:", err);
        this.error =
          err.response?.data?.message ||
          "Une erreur est survenue lors de la sauvegarde.";
      } finally {
        this.submitting = false;
      }
    },
    cancel() {
      this.$router.push({ name: "article-detail", params: { id: this.id } });
    },
  },
  mounted() {
    this.fetchArticle();
  },
};
</script>

<template>
  <div class="article-edit">
    <button class="back-btn" @click="cancel">← Annuler</button>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-else class="edit-card">
      <h1>Modifier l'article</h1>

      <div v-if="error" class="alert error">{{ error }}</div>
      <div v-if="success" class="alert success">{{ success }}</div>

      <form v-if="article" @submit.prevent="submitForm">
        <div class="form-group">
          <label>Description</label>
          <input v-model="form.description" type="text" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="categorie-list">Catégorie</label>
            <select id="categorie-list" v-model="form.category" required>
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
            <select id="age_range-list" v-model="form.age_range" required>
              <option value="BB">BB — 0-3 ans</option>
              <option value="PE">PE — 3-6 ans</option>
              <option value="EN">EN — 6-10 ans</option>
              <option value="AD">AD — 10+ ans</option>
            </select>
          </div>

          <div class="form-group">
            <label for="state-list">État</label>
            <select id="state-list" v-model="form.state" required>
              <option value="N">N — Neuf</option>
              <option value="TB">TB — Très bon état</option>
              <option value="B">B — Bon état</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Prix (€)</label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div class="form-group">
            <label>Poids (kg)</label>
            <input
              v-model.number="form.weight"
              type="number"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div class="actions">
          <button
            type="button"
            class="btn secondary"
            @click="cancel"
            :disabled="submitting"
          >
            Annuler
          </button>
          <button type="submit" class="btn primary" :disabled="submitting">
            {{
              submitting ? "Enregistrement..." : "Enregistrer les modifications"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.article-edit {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: "Inter", sans-serif;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 0;
}

.edit-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h1 {
  margin-top: 0;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: white;
}

input:focus,
select:focus {
  outline: none;
  border-color: #4f8cff;
  box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.1);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn.primary {
  background: #4f8cff;
  color: white;
  border: none;
}

.btn.primary:hover {
  background: #3a75e0;
}

.btn.secondary {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn.secondary:hover {
  background: #f9f9f9;
  border-color: #ccc;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.alert.error {
  background: #fdeaea;
  color: #e55;
  border: 1px solid #fbd5d5;
}

.alert.success {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>

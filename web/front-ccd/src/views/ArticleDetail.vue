<script>
export default {
  props: ["id"],
  data() {
    return {
      article: null,
      loading: true,
      error: null,
    };
  },
  methods: {
    fetchArticle() {
      this.loading = true;
      this.error = null;
      this.$api
        .get(`/articles/${this.id}`)
        .then((response) => {
          this.article = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération de l'article:", error);
          this.error = "Impossible de charger l'article.";
          this.loading = false;
        });
    },
    goBack() {
      this.$router.push({ name: "catalog" });
    },
  },
  mounted() {
    this.fetchArticle();
  },
};
</script>

<template>
  <div class="article-detail">
    <button class="back-btn" @click="goBack">← Retour au catalogue</button>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="article" class="detail-card">
      <div class="header">
        <h1>{{ article.description }}</h1>
        <img
          v-if="article.picture"
          :src="(($root && $root.apiUrl) || 'http://localhost:3000') + '/images/' + article.picture"
          :alt="article.description"
          class="article-image"
        />
      </div>

      <div class="info-grid">
        <div class="info-item">
          <span class="label">Catégorie</span>
          <span class="value">{{ article.category }}</span>
        </div>
        <div class="info-item">
          <span class="label">Age</span>
          <span class="value">{{ article.age_range }}</span>
        </div>
        <div class="info-item">
          <span class="label">État</span>
          <span class="value">{{ article.state }}</span>
        </div>
        <div class="info-item">
          <span class="label">Prix</span>
          <span class="value price">{{ article.price }} €</span>
        </div>
        <div class="info-item">
          <span class="label">Poids</span>
          <span class="value">{{ article.weight }} kg</span>
        </div>
      </div>

      <div class="actions">
        <button
          class="action-btn primary"
          @click="
            $router.push({
              name: 'article-edit',
              params: { id: article.id_article },
            })
          "
        >
          Modifier l'article
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: "Inter", sans-serif;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 20px;
  padding: 0;
}

.back-btn:hover {
  color: #333;
  text-decoration: underline;
}

.detail-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.article-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #eee;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.85rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.price {
  color: #27ae60;
  font-weight: 700;
  font-size: 1.3rem;
}

.code {
  font-family: monospace;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  border: 1px solid #ccc;
  background: white;
  color: #555;
}

.action-btn.primary {
  background: #4f8cff;
  color: white;
  border: none;
}

.action-btn:hover {
  opacity: 0.9;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #e55;
}
</style>

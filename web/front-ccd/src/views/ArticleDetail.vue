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
      // Mock Data Logic (replace with API call when backend is ready)
      // Simulating API fetch
      this.loading = true;
      setTimeout(() => {
        const mockArticles = [
          {
            id: 1,
            description: "Monopoly Classique",
            categorie: "Jeux de société",
            tranche_age: "8+",
            etat: "Neuf",
            prix: 25,
            poids: 1.2,
            image:
              "https://m.media-amazon.com/images/I/81q5+I08jUL._AC_SL1500_.jpg",
          },
          {
            id: 2,
            description: "Sophie la girafe",
            categorie: "Jouets éveil",
            tranche_age: "0-2",
            etat: "Bon état",
            prix: 10,
            poids: 0.3,
            image:
              "https://m.media-amazon.com/images/I/71u+tM+g3LL._AC_SL1500_.jpg",
          },
          {
            id: 3,
            description: "Lego Star Wars",
            categorie: "Construction",
            tranche_age: "9-14",
            etat: "Occasion",
            prix: 45,
            poids: 0.8,
            image:
              "https://m.media-amazon.com/images/I/81I3-jXlC0L._AC_SL1500_.jpg",
          },
          {
            id: 4,
            description: "Barbie Dreamhouse",
            categorie: "Poupées",
            tranche_age: "3-8",
            etat: "Neuf",
            prix: 120,
            poids: 3.5,
            image:
              "https://m.media-amazon.com/images/I/71wF7B13nCL._AC_SL1500_.jpg",
          },
          {
            id: 5,
            description: "Uno",
            categorie: "Jeux de société",
            tranche_age: "7+",
            etat: "Bon état",
            prix: 8,
            poids: 0.2,
            image:
              "https://m.media-amazon.com/images/I/61Nl-HhJ0TL._AC_SL1500_.jpg",
          },
        ];

        // Find article by ID (handling both string/number types)
        this.article = mockArticles.find(
          (a) => a.id.toString() === this.id.toString(),
        );

        if (!this.article) {
          this.error = "Article non trouvé";
        }
        this.loading = false;
      }, 300);
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
          v-if="article.image"
          :src="article.image"
          :alt="article.description"
          class="article-image"
        />
      </div>

      <div class="info-grid">
        <div class="info-item">
          <span class="label">Catégorie</span>
          <span class="value">{{ article.categorie }}</span>
        </div>
        <div class="info-item">
          <span class="label">Age</span>
          <span class="value">{{ article.tranche_age }}</span>
        </div>
        <div class="info-item">
          <span class="label">État</span>
          <span class="value">{{ article.etat }}</span>
        </div>
        <div class="info-item">
          <span class="label">Prix</span>
          <span class="value price">{{ article.prix }} €</span>
        </div>
        <div class="info-item">
          <span class="label">Poids</span>
          <span class="value">{{ article.poids }} kg</span>
        </div>
        <div class="info-item">
          <span class="label">ID (UUID)</span>
          <span class="value code">{{ article.id }}</span>
        </div>
      </div>

      <div class="actions">
        <!-- Placeholder actions -->
        <button class="action-btn">Modifier</button>
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

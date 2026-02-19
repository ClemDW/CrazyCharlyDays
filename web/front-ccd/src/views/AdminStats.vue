<script>
import { AGE_RANGES, DEFAULT_CATEGORIES } from "@/constants/subscriber";

export default {
  data() {
    return {
      loading: true,
      error: null,
      stats: {
        articlesByCategory: {},
        articlesByAge: {},
        articlesByState: {},
        subscribersByAge: {},
        avgCampaignScore: 0,
        totalArticles: 0,
        totalSubscribers: 0,
      }
    };
  },
  computed: {
    categoryLabels() {
      const labels = {};
      DEFAULT_CATEGORIES.forEach(c => labels[c.code] = c.label);
      return labels;
    },
    ageLabels() {
      const labels = {};
      AGE_RANGES.forEach(a => labels[a.code] = a.label);
      return labels;
    }
  },
  async mounted() {
    await this.fetchStats();
  },
  methods: {
    async fetchStats() {
      this.loading = true;
      try {
        const [articlesResp, usersResp, usertochildResp, boxesResp] = await Promise.all([
          this.$api.get("/articles"),
          this.$api.get("/users"),
          this.$api.get("/usertochild/all").catch(() => this.$api.get("/users")), // Fallback if no /all
          this.$api.get("/box")
        ]);

        // 1. Statistiques Articles
        const articles = articlesResp.data || [];
        this.stats.totalArticles = articles.length;
        articles.forEach(a => {
          const cat = a.category || "Inconnue";
          const age = a.age_range || "Non spécifié";
          const state = a.state || "Inconnu";
          
          this.stats.articlesByCategory[cat] = (this.stats.articlesByCategory[cat] || 0) + 1;
          this.stats.articlesByAge[age] = (this.stats.articlesByAge[age] || 0) + 1;
          this.stats.articlesByState[state] = (this.stats.articlesByState[state] || 0) + 1;
        });

        // 2. Statistiques Abonnés par âge
        const users = usersResp.data || [];
        this.stats.totalSubscribers = users.length;
        
        let allChildren = [];
        try {
            // On parallélise les requêtes pour les enfants
            const childrenPromises = users.map(u => 
                this.$api.get(`/usertochild/${u.id_user}`).catch(() => ({ data: [] }))
            );
            const results = await Promise.all(childrenPromises);
            results.forEach(res => {
                if (Array.isArray(res.data)) {
                    allChildren.push(...res.data);
                }
            });
        } catch(e) { 
            console.warn("Erreur lors de la récupération groupée des enfants:", e);
        }

        allChildren.forEach(c => {
          const age = c.age_range || "Non spécifié";
          this.stats.subscribersByAge[age] = (this.stats.subscribersByAge[age] || 0) + 1;
        });

        // 3. Score moyen des dernières campagnes
        const boxes = boxesResp.data || [];
        const validatedBoxes = boxes.filter(b => b.validated);
        if (validatedBoxes.length > 0) {
          const totalScore = validatedBoxes.reduce((acc, b) => acc + (Number(b.score_box) || 0), 0);
          this.stats.avgCampaignScore = (totalScore / validatedBoxes.length).toFixed(1);
        }

      } catch (err) {
        console.error("Erreur stats:", err);
        this.error = "Impossible de charger les statistiques.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<template>
  <div class="stats-container">
    <div class="header">
      <RouterLink to="/admin" class="back-link">← Retour Dashboard</RouterLink>
      <h1>📊 Statistiques Avancées</h1>
    </div>

    <div v-if="loading" class="loading">Chargement des données...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="stats-grid">
      <!-- Section Globale -->
      <div class="stats-card summary">
        <h3>Résumé</h3>
        <div class="metrics">
          <div class="metric">
            <span class="value">{{ stats.totalArticles }}</span>
            <span class="label">Articles total</span>
          </div>
          <div class="metric">
            <span class="value">{{ stats.totalSubscribers }}</span>
            <span class="label">Abonnés total</span>
          </div>
          <div class="metric">
            <span class="value">{{ stats.avgCampaignScore }}</span>
            <span class="label">Score moyen</span>
          </div>
        </div>
      </div>

      <!-- Articles par Catégorie -->
      <div class="stats-card">
        <h3>Articles par Catégorie</h3>
        <ul>
          <li v-for="(count, cat) in stats.articlesByCategory" :key="cat">
            <span class="label">{{ categoryLabels[cat] || cat }}</span>
            <span class="count">{{ count }}</span>
          </li>
        </ul>
      </div>

      <!-- Articles par Tranche d'âge -->
      <div class="stats-card">
        <h3>Articles par Âge</h3>
        <ul>
          <li v-for="(count, age) in stats.articlesByAge" :key="age">
            <span class="label">{{ ageLabels[age] || age }}</span>
            <span class="count">{{ count }}</span>
          </li>
        </ul>
      </div>

      <!-- Répartition par État -->
      <div class="stats-card">
        <h3>Répartition par État</h3>
        <div class="state-bars">
          <div v-for="(count, state) in stats.articlesByState" :key="state" class="state-item">
             <div class="state-label">{{ state }} : {{ count }}</div>
             <div class="bar-bg">
               <div class="bar-fill" :style="{ width: (stats.totalArticles > 0 ? (count / stats.totalArticles * 100) : 0) + '%' }"></div>
             </div>
          </div>
        </div>
      </div>

      <!-- Abonnés par Tranche d'âge -->
      <div class="stats-card">
        <h3>Abonnés par Âge</h3>
        <ul>
          <li v-for="(count, age) in stats.subscribersByAge" :key="age">
            <span class="label">{{ ageLabels[age] || age }}</span>
            <span class="count">{{ count }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Inter', sans-serif;
}

.header {
  margin-bottom: 2rem;
}

.back-link {
  text-decoration: none;
  color: #4f8cff;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: inline-block;
}

h1 {
  color: #1a1a2e;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.summary {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}

.metrics {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.metric {
  text-align: center;
}

.metric .value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
}

.metric .label {
  font-size: 0.85rem;
  opacity: 0.8;
}

h3 {
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
  color: #1a1a2e;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.summary h3 {
  color: white;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f9f9f9;
}

.count {
  font-weight: 700;
  background: #f0f4ff;
  color: #4f8cff;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.state-item {
  margin-bottom: 1rem;
}

.state-label {
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.bar-bg {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #4f8cff;
  border-radius: 4px;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: #666;
}

.error {
  color: #ff4d4f;
}
</style>

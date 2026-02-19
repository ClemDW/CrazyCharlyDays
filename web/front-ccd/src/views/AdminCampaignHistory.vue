<script>
const STATUS_LABELS = {
  IN_PROGRESS: { label: "En cours", color: "#f59e0b" },
  COMPLETED:   { label: "Terminée", color: "#10b981" },
  CANCELLED:   { label: "Annulée", color: "#ef4444" },
};

export default {
  data() {
    return {
      loading: true,
      error: null,
      campaigns: [],    // données enrichies
      expandedId: null, // pour afficher les box d'une campagne
    };
  },
  async mounted() {
    await this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        const [campResp, boxResp, artResp] = await Promise.all([
          this.$api.get("/campaign"),
          this.$api.get("/box"),
          this.$api.get("/articles"),
        ]);

        const boxes    = boxResp.data    || [];
        const articles = artResp.data    || [];
        const camps    = campResp.data   || [];

        // Agrégation par campagne
        this.campaigns = camps.map((c) => {
          const campBoxes = boxes.filter((b) => b.id_camp === c.id_camp);
          const campArticles = articles.filter((a) =>
            campBoxes.some((b) => b.id_box === a.id_box)
          );
          const validatedBoxes = campBoxes.filter((b) => b.validated);
          const totalScore = campBoxes.reduce(
            (s, b) => s + (Number(b.score_box) || 0),
            0
          );
          return {
            ...c,
            nbBoxes: campBoxes.length,
            nbBoxesValidated: validatedBoxes.length,
            nbArticles: campArticles.length,
            avgScore: campBoxes.length > 0
              ? (totalScore / campBoxes.length).toFixed(1)
              : "—",
            totalPoids: campBoxes.reduce((s, b) => s + (Number(b.total_weight) || 0), 0).toFixed(2),
            totalPrix:  campBoxes.reduce((s, b) => s + (Number(b.total_price)  || 0), 0).toFixed(2),
            statusInfo: STATUS_LABELS[c.status] || { label: c.status, color: "#888" },
            boxes: campBoxes,
          };
        });

        // Plus récente d'abord
        this.campaigns.sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch (err) {
        console.error("Erreur chargement historique:", err);
        this.error = "Impossible de charger l'historique des campagnes.";
      } finally {
        this.loading = false;
      }
    },

    toggle(id) {
      this.expandedId = this.expandedId === id ? null : id;
    },

    formatDate(d) {
      if (!d) return "—";
      return new Date(d).toLocaleDateString("fr-FR", {
        day: "2-digit", month: "long", year: "numeric",
      });
    },
  },
};
</script>

<template>
  <div class="history-page">
    <div class="page-header">
      <RouterLink to="/admin" class="back-link">← Retour Dashboard</RouterLink>
      <div class="title-row">
        <h1>📋 Historique des Campagnes</h1>
        <button class="refresh-btn" @click="load" :disabled="loading">↻ Actualiser</button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <span class="spinner"></span> Chargement de l'historique…
    </div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>

    <div v-else>
      <!-- Résumé global -->
      <div class="global-summary">
        <div class="gs-stat">
          <span class="gs-value">{{ campaigns.length }}</span>
          <span class="gs-label">Campagnes</span>
        </div>
        <div class="gs-stat">
          <span class="gs-value">{{ campaigns.reduce((s, c) => s + c.nbBoxes, 0) }}</span>
          <span class="gs-label">Box distribuées</span>
        </div>
        <div class="gs-stat">
          <span class="gs-value">{{ campaigns.reduce((s, c) => s + c.nbArticles, 0) }}</span>
          <span class="gs-label">Articles distribués</span>
        </div>
        <div class="gs-stat">
          <span class="gs-value">
            {{
              campaigns.filter(c => c.nbBoxes > 0).length > 0
                ? (campaigns.reduce((s, c) => s + parseFloat(c.avgScore) || 0, 0) / campaigns.filter(c => c.nbBoxes > 0).length).toFixed(1)
                : "—"
            }}
          </span>
          <span class="gs-label">Score moyen global</span>
        </div>
      </div>

      <!-- Liste des campagnes -->
      <div v-if="campaigns.length === 0" class="empty">Aucune campagne enregistrée.</div>

      <div class="camp-list">
        <div v-for="camp in campaigns" :key="camp.id_camp" class="camp-card">
          <!-- En-tête cliquable -->
          <div class="camp-header" @click="toggle(camp.id_camp)">
            <div class="camp-title">
              <span class="camp-date">{{ formatDate(camp.date) }}</span>
              <span class="status-badge" :style="{ background: camp.statusInfo.color + '22', color: camp.statusInfo.color }">
                {{ camp.statusInfo.label }}
              </span>
            </div>

            <div class="camp-metrics">
              <div class="metric-chip">
                <span class="mc-val">{{ camp.nbBoxes }}</span>
                <span class="mc-lbl">box</span>
              </div>
              <div class="metric-chip">
                <span class="mc-val">{{ camp.nbArticles }}</span>
                <span class="mc-lbl">articles</span>
              </div>
              <div class="metric-chip highlighted">
                <span class="mc-val">{{ camp.avgScore }}</span>
                <span class="mc-lbl">score moy.</span>
              </div>
              <div class="metric-chip">
                <span class="mc-val">{{ camp.totalPrix }} €</span>
                <span class="mc-lbl">valeur totale</span>
              </div>
              <span class="expand-icon" :class="{ rotated: expandedId === camp.id_camp }">▼</span>
            </div>
          </div>

          <!-- Détail dépliable — liste des box -->
          <div v-if="expandedId === camp.id_camp" class="camp-detail">
            <div class="detail-meta">
              <span>Poids max : <strong>{{ camp.max_weight }} kg</strong></span>
              <span>Prix min / max : <strong>{{ camp.min_price }} € / {{ camp.max_price }} €</strong></span>
              <span>Box validées : <strong>{{ camp.nbBoxesValidated }} / {{ camp.nbBoxes }}</strong></span>
            </div>

            <div v-if="camp.boxes.length === 0" class="empty-sub">Aucune box pour cette campagne.</div>
            <table v-else class="box-table">
              <thead>
                <tr>
                  <th>ID box</th>
                  <th>Score</th>
                  <th>Poids (kg)</th>
                  <th>Prix (€)</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="box in camp.boxes" :key="box.id_box">
                  <td class="id-cell">{{ box.id_box.substring(0, 8) }}…</td>
                  <td class="score-cell">{{ box.score_box }}</td>
                  <td>{{ box.total_weight }}</td>
                  <td>{{ box.total_price }}</td>
                  <td>
                    <span :class="['val-badge', box.validated ? 'validated' : 'pending']">
                      {{ box.validated ? "✓ Validée" : "En attente" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-page {
  max-width: 950px;
  margin: 2rem auto;
  padding: 0 1rem 3rem;
  font-family: 'Inter', sans-serif;
}

.page-header { margin-bottom: 2rem; }

.back-link {
  text-decoration: none;
  color: #4f8cff;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 0.6rem;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h1 { margin: 0; color: #1a1a2e; }

.refresh-btn {
  background: #f0f4ff;
  border: 1px solid #d0d9ff;
  color: #4f8cff;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s;
}
.refresh-btn:hover { background: #dce7ff; }

/* Global summary */
.global-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin-bottom: 2rem;
}

.gs-stat { text-align: center; color: white; }
.gs-value { display: block; font-size: 2.2rem; font-weight: 800; }
.gs-label { font-size: 0.8rem; opacity: 0.75; }

/* Campaign cards */
.camp-list { display: flex; flex-direction: column; gap: 0.75rem; }

.camp-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.camp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  cursor: pointer;
  gap: 1rem;
  transition: background 0.12s;
}
.camp-header:hover { background: #fafbff; }

.camp-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.camp-date { font-weight: 700; color: #1a1a2e; }

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
}

.camp-metrics {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.metric-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f7ff;
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  min-width: 60px;
}
.metric-chip.highlighted { background: #eef2ff; }
.mc-val { font-size: 1rem; font-weight: 700; color: #1a1a2e; }
.mc-lbl { font-size: 0.65rem; color: #888; }
.metric-chip.highlighted .mc-val { color: #4f8cff; }

.expand-icon {
  font-size: 0.8rem;
  color: #aaa;
  transition: transform 0.2s;
  margin-left: 0.25rem;
}
.expand-icon.rotated { transform: rotate(180deg); }

/* Detail panel */
.camp-detail {
  padding: 1rem 1.25rem 1.25rem;
  border-top: 1px solid #f0f0f0;
  background: #fafbff;
}

.detail-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 1rem;
}

.box-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.box-table th {
  background: #f0f4ff;
  padding: 0.5rem 0.75rem;
  text-align: left;
  color: #4f8cff;
  font-weight: 600;
}
.box-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.id-cell { font-family: monospace; color: #888; }
.score-cell { font-weight: 700; color: #1a1a2e; }

.val-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}
.val-badge.validated { background: #d1fae5; color: #059669; }
.val-badge.pending   { background: #fef3c7; color: #d97706; }

/* States */
.loading {
  text-align: center;
  padding: 4rem;
  color: #888;
  font-size: 1.05rem;
}
.spinner {
  display: inline-block;
  border: 3px solid #ddd;
  border-top-color: #4f8cff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 0.7s linear infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-msg { color: #ef4444; text-align: center; padding: 2rem; }
.empty, .empty-sub { color: #aaa; text-align: center; padding: 1.5rem; font-size: 0.9rem; }

@media (max-width: 640px) {
  .global-summary { grid-template-columns: repeat(2, 1fr); }
  .camp-header { flex-direction: column; align-items: flex-start; }
  .detail-meta { flex-direction: column; gap: 0.5rem; }
}
</style>

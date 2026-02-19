<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="dashboard">
    <h1>🛠️ Dashboard Admin</h1>
    <p class="subtitle">
      Gérez l'ensemble des fonctionnalités d'administration.
    </p>

    <div class="card-grid">
      <RouterLink to="/create-article" class="dash-card">
        <span class="card-icon">📝</span>
        <h2>Créer un article</h2>
        <p>Ajouter un jouet, jeu ou livre au catalogue.</p>
      </RouterLink>

      <RouterLink to="/admin/campaign" class="dash-card">
        <span class="card-icon">⚙️</span>
        <h2>Paramétrage campagne</h2>
        <p>Définir le prix min/max et le poids maximum par box.</p>
      </RouterLink>

      <RouterLink to="/admin/boxes" class="dash-card">
        <span class="card-icon">📦</span>
        <h2>Box composées</h2>
        <p>Visualiser les box proposées par l'optimisation.</p>
      </RouterLink>

      <RouterLink to="/admin/subscribers" class="dash-card">
        <span class="card-icon">👥</span>
        <h2>Liste des abonnés</h2>
        <p>Consulter les abonnés, tranches d'âge et préférences.</p>
      </RouterLink>

      <RouterLink to="/admin/stats" class="dash-card stats-card">
        <span class="card-icon">📊</span>
        <h2>Statistiques</h2>
        <p>Analyse des stocks, abonnés et performances.</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem 2rem;
  font-family: "Inter", "Segoe UI", sans-serif;
}

h1 {
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.dash-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.15s,
    box-shadow 0.15s,
    border-color 0.15s;
}

.dash-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-color: #4f8cff;
}

.card-icon {
  font-size: 2.2rem;
  margin-bottom: 0.75rem;
}

.dash-card h2 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.4rem 0;
  color: #1a1a2e;
}

.dash-card p {
  font-size: 0.85rem;
  color: #777;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>

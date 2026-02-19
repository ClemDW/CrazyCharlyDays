<script>
import SubscriberChildrenForm from "@/components/SubscriberChildrenForm.vue";
import { DEFAULT_CATEGORIES } from "@/constants/subscriber";

export default {
  components: {
    SubscriberChildrenForm,
  },
  data() {
    return {
      email: "",
      isAuthenticated: false,
      error: null,
      loading: false,
      subscriber: null,
    };
  },
  methods: {
    login() {
      if (!this.email) {
        this.error = "Veuillez entrer une adresse email.";
        return;
      }
      this.loading = true;
      this.error = null;

      // Simulate API call to find subscriber
      setTimeout(() => {
        // Mock success for any email containing '@'
        if (this.email.includes("@")) {
          this.isAuthenticated = true;
          // Mock data
          this.subscriber = {
            email: this.email,
            children: [
              {
                name: "Lucas",
                ageRange: "EN",
                categories: [...DEFAULT_CATEGORIES],
              },
              {
                name: "Emma",
                ageRange: "PE",
                categories: [...DEFAULT_CATEGORIES],
              },
            ],
            boxes: [
              {
                id: 1,
                name: "Box de Noël 2025",
                date: "2025-12-15",
                articles: [
                  { id: 101, name: "Lego Star Wars", category: "Construction" },
                  { id: 102, name: "Poupée Elsa", category: "Figurines" },
                  {
                    id: 103,
                    name: "Livre : Le Petit Prince",
                    category: "Livres",
                  },
                ],
              },
              {
                id: 2,
                name: "Box Automne 2025",
                date: "2025-09-20",
                articles: [
                  { id: 201, name: "Puzzle Forêt", category: "Éveil" },
                  {
                    id: 202,
                    name: "Voiture Télécommandée",
                    category: "Extérieur",
                  },
                ],
              },
            ],
          };
        } else {
          this.error = "Aucun abonné trouvé avec cet email.";
        }
        this.loading = false;
      }, 500);
    },
    saveProfile() {
      this.loading = true;
      setTimeout(() => {
        alert("Modifications enregistrées avec succès !");
        this.loading = false;
      }, 500);
    },
    // Handled by SubscriberChildrenForm
  },
};
</script>

<template>
  <div class="profile-page">
    <h1>Mon Profil</h1>

    <!-- Login Section -->
    <div v-if="!isAuthenticated" class="login-section">
      <p>
        Veuillez renseigner votre email pour accéder à vos préférences et celles
        de vos enfants.
      </p>
      <div class="input-group">
        <input
          v-model="email"
          type="email"
          placeholder="votre.email@exemple.com"
          @keyup.enter="login"
        />
        <button @click="login" :disabled="loading">
          {{ loading ? "Recherche..." : "Accéder" }}
        </button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <!-- Profile Editor -->
    <div v-else class="profile-editor">
      <div class="header-info">
        <p>
          Connecté en tant que : <strong>{{ subscriber.email }}</strong>
        </p>
        <button class="logout-btn" @click="isAuthenticated = false">
          Déconnexion
        </button>
      </div>

      <!-- Children Section -->
      <section class="section">
        <h2>Mes Enfants & Préférences</h2>
        <p class="desc">
          Gérez le profil de chaque enfant et ses catégories préférées.
        </p>

        <SubscriberChildrenForm v-model="subscriber.children" />
      </section>

      <div class="save-actions">
        <button class="save-btn" @click="saveProfile" :disabled="loading">
          {{ loading ? "Enregistrement..." : "Enregistrer les modifications" }}
        </button>
      </div>

      <!-- Box History Section -->
      <section class="section history-section">
        <hr />
        <h2>Historique de mes Box</h2>
        <p class="desc">Retrouvez ici les box que vous avez déjà reçues.</p>

        <div
          v-if="subscriber.boxes && subscriber.boxes.length > 0"
          class="box-list"
        >
          <div v-for="box in subscriber.boxes" :key="box.id" class="box-card">
            <div class="box-header">
              <span class="box-name">{{ box.name }}</span>
              <span class="box-date">{{
                new Date(box.date).toLocaleDateString()
              }}</span>
            </div>
            <ul class="article-list">
              <li
                v-for="article in box.articles"
                :key="article.id"
                class="article-item"
              >
                <span class="article-name">{{ article.name }}</span>
                <span class="article-category">{{ article.category }}</span>
              </li>
            </ul>
          </div>
        </div>
        <p v-else class="no-history">Vous n'avez pas encore reçu de box.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: "Inter", sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.login-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-top: 1rem;
  justify-content: center;
}

input[type="email"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 60%;
}

button {
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  background-color: #4f8cff;
  color: white;
  font-weight: 600;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #e55;
  margin-top: 10px;
}

.profile-editor {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.logout-btn {
  background: #eee;
  color: #555;
  padding: 6px 12px;
  font-size: 0.85rem;
}

.section {
  margin-bottom: 2.5rem;
}

h2 {
  font-size: 1.25rem;
  color: #4f8cff;
  margin-bottom: 0.5rem;
}

.desc {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
}

/* Children styles moved to SubscriberChildrenForm.vue */

.save-actions {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.save-btn {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  background: #27ae60;
}
.save-btn:hover {
  background: #219150;
}

/* History Section Styles */
.history-section {
  margin-top: 3rem;
}

.box-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.box-card {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 1.25rem;
  background: #fafafa;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.box-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.box-name {
  font-weight: 700;
  color: #2c3e50;
}

.box-date {
  font-size: 0.85rem;
  color: #888;
}

.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-item {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 0.95rem;
  border-bottom: 1px dashed #eee;
}

.article-item:last-child {
  border-bottom: none;
}

.article-category {
  font-size: 0.8rem;
  color: #4f8cff;
  background: rgba(79, 140, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.no-history {
  text-align: center;
  color: #999;
  font-style: italic;
  margin-top: 2rem;
}

hr {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #eee;
}
</style>

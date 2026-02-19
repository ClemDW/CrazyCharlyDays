<script setup lang="ts">
import { ref, reactive } from "vue";

interface Article {
  description: string;
  category: string;
  ageRange: string;
  state: string;
  weight: number;
  price: number;
}

interface Box {
  id: number;
  campaignDate: string;
  childAge: string;
  articles: Article[];
  totalWeight: number;
  totalPrice: number;
  validated: boolean;
}

// --- State ---
const email = ref("");
const searched = ref(false);
const errorMessage = ref("");
const boxes = reactive<Box[]>([]);

// --- Cookie helper ---
function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

// --- Mock data (simulates validated boxes for demo purposes) ---
const MOCK_BOXES: Record<string, Box[]> = {
  "marie@test.com": [
    {
      id: 1,
      campaignDate: "Février 2025",
      childAge: "PE — 3-6 ans",
      validated: true,
      totalWeight: 1850,
      totalPrice: 24.5,
      articles: [
        {
          description: "Puzzle en bois 24 pièces",
          category: "Jeux d'éveil et éducatifs",
          ageRange: "PE",
          state: "Très bon état",
          weight: 350,
          price: 4.5,
        },
        {
          description: "Figurine dinosaure T-Rex",
          category: "Figurines et poupées",
          ageRange: "PE",
          state: "Bon état",
          weight: 200,
          price: 3.0,
        },
        {
          description: "Livre « Le petit prince »",
          category: "Livres jeunesse",
          ageRange: "PE",
          state: "Neuf",
          weight: 300,
          price: 5.0,
        },
        {
          description: "Jeu de construction 50 pièces",
          category: "Jeux de construction",
          ageRange: "PE",
          state: "Très bon état",
          weight: 600,
          price: 7.0,
        },
        {
          description: "Jeu de cartes « 7 familles »",
          category: "Jeux de société",
          ageRange: "PE",
          state: "Neuf",
          weight: 150,
          price: 2.5,
        },
        {
          description: "Ballon en mousse",
          category: "Jeux d'extérieur",
          ageRange: "PE",
          state: "Bon état",
          weight: 250,
          price: 2.5,
        },
      ],
    },
  ],
};

// --- Search ---
function handleSearch() {
  errorMessage.value = "";
  boxes.splice(0);
  searched.value = false;

  const trimmed = email.value.trim().toLowerCase();
  if (!trimmed) {
    errorMessage.value = "Veuillez saisir votre adresse email.";
    return;
  }

  searched.value = true;

  // Check subscriber cookie to see if email matches
  const subscriberCookie = getCookie("subscriber");
  let knownEmail = false;
  if (subscriberCookie) {
    try {
      const data = JSON.parse(subscriberCookie);
      if (data.email && data.email.toLowerCase() === trimmed) {
        knownEmail = true;
      }
    } catch {
      // ignore
    }
  }

  // Look up mock boxes
  const found = MOCK_BOXES[trimmed];
  if (found) {
    // Only show validated boxes
    const validated = found.filter((b) => b.validated);
    validated.forEach((b) => boxes.push(b));
  }
}
</script>

<template>
  <div class="mybox-container">
    <h1>Ma Box</h1>
    <p class="subtitle">
      Consultez la composition de la box qui vous est destinée en renseignant
      votre adresse email.
    </p>

    <form @submit.prevent="handleSearch" class="search-form">
      <div class="search-row">
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="votre@email.com"
          class="search-input"
        />
        <button type="submit" class="btn-search">Rechercher</button>
      </div>
    </form>

    <p v-if="errorMessage" class="msg error">{{ errorMessage }}</p>

    <!-- No results -->
    <div
      v-if="searched && boxes.length === 0 && !errorMessage"
      class="no-result"
    >
      <p>Aucune box validée trouvée pour cette adresse email.</p>
      <p class="hint">
        Vérifiez votre email ou revenez plus tard lorsque votre box aura été
        composée et validée.
      </p>
    </div>

    <!-- Box results -->
    <div v-for="box in boxes" :key="box.id" class="box-card">
      <div class="box-header">
        <h2>📦 Box #{{ box.id }} — {{ box.campaignDate }}</h2>
        <span class="badge validated">✅ Validée</span>
      </div>
      <p class="box-meta">
        Tranche d'âge : <strong>{{ box.childAge }}</strong> · Poids total :
        <strong>{{ box.totalWeight }} g</strong> · Valeur :
        <strong>{{ box.totalPrice.toFixed(2) }} €</strong>
      </p>

      <table class="articles-table">
        <thead>
          <tr>
            <th>Article</th>
            <th>Catégorie</th>
            <th>État</th>
            <th>Poids</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(article, idx) in box.articles" :key="idx">
            <td>{{ article.description }}</td>
            <td>{{ article.category }}</td>
            <td>{{ article.state }}</td>
            <td>{{ article.weight }} g</td>
            <td>{{ article.price.toFixed(2) }} €</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.mybox-container {
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
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* Search */
.search-form {
  margin-bottom: 1.25rem;
}

.search-row {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.55rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: #4f8cff;
  box-shadow: 0 0 0 2px rgba(79, 140, 255, 0.25);
}

.btn-search {
  padding: 0.55rem 1.25rem;
  background: #4f8cff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-search:hover {
  background: #3a75e0;
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

.no-result {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

.no-result .hint {
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.5rem;
}

/* Box card */
.box-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  background: #fff;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.box-header h2 {
  font-size: 1.1rem;
  margin: 0;
}

.badge.validated {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.box-meta {
  font-size: 0.88rem;
  color: #555;
  margin-bottom: 1rem;
}

/* Table */
.articles-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.articles-table th {
  text-align: left;
  font-weight: 600;
  color: #555;
  padding: 0.5rem 0.75rem;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.articles-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.articles-table tbody tr:last-child td {
  border-bottom: none;
}

.articles-table tbody tr:hover {
  background: #f8f9fb;
}

/* Responsive */
@media (max-width: 640px) {
  .search-row {
    flex-direction: column;
  }

  .articles-table {
    font-size: 0.8rem;
  }

  .articles-table th,
  .articles-table td {
    padding: 0.4rem 0.5rem;
  }

  .box-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

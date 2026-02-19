<script>
import { Html5QrcodeScanner } from "html5-qrcode";

export default {
  data() {
    return {
      articles: [],
      currentPage: 1,
      perPage: 10,
      filters: {
        categorie: "",
        tranche_age: "",
        etat: "",
      },
      searchQuery: "",
      showScanner: false,
      scanner: null,
    };
  },
  computed: {
    filteredArticles() {
      return this.articles.filter((article) => {
        let matchesSearch = true;
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          const description = (article.description || "").toLowerCase();
          const id = (article.id || article.id_article || "")
            .toString()
            .toLowerCase();
          matchesSearch = description.includes(query) || id.includes(query);
        }

        return (
          matchesSearch &&
          (!this.filters.categorie ||
            article.category === this.filters.categorie) &&
          (!this.filters.tranche_age ||
            article.age_range === this.filters.tranche_age) &&
          (!this.filters.etat || article.state === this.filters.etat)
        );
      });
    },
    totalPages() {
      return Math.ceil(this.filteredArticles.length / this.perPage) || 1;
    },
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredArticles.slice(start, start + this.perPage);
    },
    uniqueCategories() {
      return [...new Set(this.articles.map((a) => a.category).filter(Boolean))];
    },
    uniqueTranchesAge() {
      return [
        ...new Set(this.articles.map((a) => a.age_range).filter(Boolean)),
      ];
    },
    uniqueEtats() {
      return [...new Set(this.articles.map((a) => a.state).filter(Boolean))];
    },
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1;
      },
    },
    searchQuery(newVal) {
      if (!newVal) return;

      // 1. If it's a full URL from our app
      if (newVal.includes("/catalog/")) {
        const parts = newVal.split("/catalog/");
        if (parts.length > 1) {
          const id = parts[1].split("/")[0].split("?")[0]; // Clean UUID
          if (id && id.length >= 36) {
            // Basic UUID length check
            this.$router.push({ name: "article-detail", params: { id } });
            return;
          }
        }
      }
    },
  },
  methods: {
    fetchCatalog() {
      this.$api
        .get("/articles")
        .then((response) => {
          console.log("Articles chargés depuis l'API:", response.data);
          this.articles = response.data;
          // Fallback if data is empty (temporary for dev without backend)
          if (!this.articles || this.articles.length === 0) {
            this.useMockData();
          }
        })
        .catch(() => {
          // Fallback if API fails
          this.useMockData();
        });
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    resetFilters() {
      this.filters = { categorie: "", tranche_age: "", etat: "" };
      this.searchQuery = "";
    },
    getAgeBadgeClass(age) {
      if (!age) return "";
      if (
        age.includes("0-") ||
        age.includes("1-") ||
        age.includes("2-") ||
        age.includes("3")
      )
        return "age-bb";
      if (
        age.includes("3-") ||
        age.includes("4-") ||
        age.includes("5-") ||
        age.includes("6")
      )
        return "age-pe";
      if (
        age.includes("7") ||
        age.includes("8") ||
        age.includes("9") ||
        age.includes("10")
      )
        return "age-en";
      return "age-ad";
    },
    toggleScanner() {
      this.showScanner = !this.showScanner;
      if (this.showScanner) {
        this.$nextTick(() => {
          this.startScanner();
        });
      } else {
        this.stopScanner();
      }
    },
    startScanner() {
      // Use a slight delay to ensure DOM is ready
      setTimeout(() => {
        this.scanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false,
        );
        this.scanner.render(this.onScanSuccess, this.onScanFailure);
      }, 100);
    },
    stopScanner() {
      if (this.scanner) {
        this.scanner.clear().catch((error) => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
        this.scanner = null;
      }
    },
    onScanSuccess(decodedText, decodedResult) {
      console.log(`Code matched = ${decodedText}`, decodedResult);

      // Check if the decoded text is a URL matching our app
      try {
        // Simple check for /catalog/ segment
        if (decodedText.includes("/catalog/")) {
          // Extract the part after /catalog/
          // Supports full URL (http://...) or partial path
          const parts = decodedText.split("/catalog/");
          if (parts.length > 1) {
            const id = parts[1].split("/")[0]; // Take segment after catalog
            if (id) {
              this.showScanner = false;
              this.stopScanner();
              this.$router.push({ name: "article-detail", params: { id } });
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing scanned URL", e);
      }

      this.searchQuery = decodedText;
      this.showScanner = false; // Close scanner
      this.stopScanner();
    },
    onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
      // for example:
      // console.warn(`Code scan error = ${error}`);
    },
  },
  mounted() {
    this.fetchCatalog();
  },
  beforeUnmount() {
    this.stopScanner();
  },
};
</script>

<template>
  <div class="catalog">
    <div class="header-actions">
      <h1>Catalogue</h1>
      <button class="scanner-btn" @click="toggleScanner">
        📷 Scanner un article
      </button>
    </div>

    <!-- Scanner Modal/Area -->
    <div v-if="showScanner" class="scanner-overlay">
      <div class="scanner-container">
        <div id="reader"></div>
        <button class="close-scanner" @click="toggleScanner">Fermer</button>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rechercher par nom, UUID ou scan..."
        class="search-input"
      />
    </div>

    <!-- Filtres -->
    <div class="filters">
      <select v-model="filters.categorie">
        <option value="">Toutes les catégories</option>
        <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>

      <select v-model="filters.tranche_age">
        <option value="">Toutes les tranches d'âge</option>
        <option v-for="age in uniqueTranchesAge" :key="age" :value="age">
          {{ age }}
        </option>
      </select>

      <select v-model="filters.etat">
        <option value="">Tous les états</option>
        <option v-for="etat in uniqueEtats" :key="etat" :value="etat">
          {{ etat }}
        </option>
      </select>

      <button class="reset" @click="resetFilters">Réinitialiser</button>
    </div>

    <!-- Résultats -->
    <p class="results-count">
      {{ filteredArticles.length }} article(s) trouvé(s)
    </p>

    <div v-if="paginatedArticles.length === 0" class="empty">
      Aucun article ne correspond aux filtres sélectionnés.
    </div>

    <!-- Table Layout -->
    <div class="table-wrapper" v-if="paginatedArticles.length > 0">
      <table class="catalog-table">
        <thead>
          <tr>
            <th>Description / Nom</th>
            <th>Catégorie</th>
            <th>Age</th>
            <th>État</th>
            <th>Prix / Poids</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in paginatedArticles" :key="article.id_article">
            <td class="cell-name">{{ article.description }}</td>
            <td>
              <span class="category-badge">{{ article.category }}</span>
            </td>
            <td>
              <span :class="['age-badge', getAgeBadgeClass(article.age_range)]">
                {{ article.age_range }}
              </span>
            </td>
            <td>
              <span class="state-badge">{{ article.state }}</span>
            </td>
            <td class="cell-price">
              {{ article.price }} €
              <span class="weight">({{ article.weight }} kg)</span>
            </td>
            <td>
              <!-- Placeholder for future actions -->
              <button
                class="action-btn"
                @click="
                  $router.push({
                    name: 'article-detail',
                    params: { id: article.id_article },
                  })
                "
              >
                Voir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        ‹ Précédent
      </button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Suivant ›
      </button>
    </div>
  </div>
</template>

<style scoped>
.catalog {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1.5rem 2rem;
  font-family: "Inter", "Segoe UI", sans-serif;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.scanner-btn {
  background-color: #4f8cff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.scanner-btn:hover {
  background-color: #3a75e0;
}

.scanner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.scanner-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

#reader {
  width: 100%;
  min-height: 250px;
}

.close-scanner {
  margin-top: 15px;
  padding: 8px 16px;
  background: #e55;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.reset {
  padding: 8px 16px;
  border: 1px solid #e55;
  border-radius: 6px;
  background: #fff;
  color: #e55;
  cursor: pointer;
  font-weight: 500;
}

.reset:hover {
  background: #e55;
  color: #fff;
}

.results-count {
  font-size: 0.9em;
  color: #777;
  margin-bottom: 12px;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
}

/* Table Style */
.table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.catalog-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: #fff;
  overflow: hidden;
}

.catalog-table thead th {
  text-align: left;
  font-weight: 600;
  color: #555;
  padding: 1rem;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: #f8f9fb;
}

.catalog-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
  color: #333;
}

.catalog-table tbody tr:hover {
  background: #f8f9fb;
}

.cell-name {
  font-weight: 600;
  color: #2c3e50;
}

.cell-price {
  font-weight: 600;
  color: #27ae60;
}

.weight {
  font-weight: 400;
  color: #7f8c8d;
  font-size: 0.85em;
}

/* Badges */
.category-badge,
.state-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  background: #eff2f7;
  color: #555;
  font-size: 0.8em;
  font-weight: 500;
}

.age-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.age-bb {
  background: #e91e63;
}
.age-pe {
  background: #ff9800;
}
.age-en {
  background: #4caf50;
}
.age-ad {
  background: #3f51b5;
}

.action-btn {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  color: #555;
}

.action-btn:hover {
  background: #f0f0f0;
  border-color: #bbb;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: default;
}

.pagination span {
  color: #555;
  font-weight: 500;
}
</style>

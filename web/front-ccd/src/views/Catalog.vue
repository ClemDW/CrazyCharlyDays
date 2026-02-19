<script>
export default {
    data() {
        return {
            articles: [],
            currentPage: 1,
            perPage: 10,
            filters: {
                categorie: '',
                tranche_age: '',
                etat: ''
            }
        }
    },
    computed: {
        filteredArticles() {
            return this.articles.filter(article => {
                return (
                    (!this.filters.categorie   || article.categorie   === this.filters.categorie) &&
                    (!this.filters.tranche_age || article.tranche_age === this.filters.tranche_age) &&
                    (!this.filters.etat        || article.etat        === this.filters.etat)
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
            return [...new Set(this.articles.map(a => a.categorie).filter(Boolean))];
        },
        uniqueTranchesAge() {
            return [...new Set(this.articles.map(a => a.tranche_age).filter(Boolean))];
        },
        uniqueEtats() {
            return [...new Set(this.articles.map(a => a.etat).filter(Boolean))];
        }
    },
    watch: {
        filters: {
            deep: true,
            handler() {
                this.currentPage = 1;
            }
        }
    },
    methods: {
        fetchCatalog() {
            this.$api.get('/catalog').then(response => {
                this.articles = response.data;
            });
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        resetFilters() {
            this.filters = { categorie: '', tranche_age: '', etat: '' };
        }
    },
    mounted() {
        this.fetchCatalog();
    }
}
</script>

<template>
    <div class="catalog">

        <!-- Filtres -->
        <div class="filters">
            <select v-model="filters.categorie">
                <option value="">Toutes les catégories</option>
                <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>

            <select v-model="filters.tranche_age">
                <option value="">Toutes les tranches d'âge</option>
                <option v-for="age in uniqueTranchesAge" :key="age" :value="age">{{ age }}</option>
            </select>

            <select v-model="filters.etat">
                <option value="">Tous les états</option>
                <option v-for="etat in uniqueEtats" :key="etat" :value="etat">{{ etat }}</option>
            </select>

            <button class="reset" @click="resetFilters">Réinitialiser</button>
        </div>

        <!-- Résultats -->
        <p class="results-count">{{ filteredArticles.length }} article(s) trouvé(s)</p>

        <div v-if="paginatedArticles.length === 0" class="empty">
            Aucun article ne correspond aux filtres sélectionnés.
        </div>

        <div class="article" v-for="article in paginatedArticles" :key="article.id">
            <p>{{ article.description }}</p>
            <p>{{ article.categorie }} — {{ article.tranche_age }} — {{ article.etat }}</p>
            <p>{{ article.prix }} € · {{ article.poids }} kg</p>
        </div>

        <!-- Pagination -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">‹ Précédent</button>
            <span>Page {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Suivant ›</button>
        </div>

    </div>
</template>

<style scoped>
.catalog {
    max-width: 800px;
    margin: 0 auto;
    padding: 16px;
}

.filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}

.filters select {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
}

.reset {
    padding: 6px 12px;
    border: 1px solid #e55;
    border-radius: 4px;
    background: #fff;
    color: #e55;
    cursor: pointer;
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
}

.article {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 10px;
}

.article p {
    margin: 4px 0;
    color: #333;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 20px;
}

.pagination button {
    padding: 6px 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
}

.pagination button:disabled {
    opacity: 0.4;
    cursor: default;
}

.pagination span {
    color: #555;
}
</style>
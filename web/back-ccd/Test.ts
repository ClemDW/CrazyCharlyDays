import { Article, BoxWithArticle, Campaign, State, UserToChild } from "./Temp";
import Score from "./Score";
// ====== DONNÉES ======

// Articles
const articles: Article[] = [
    { id_article: "a1", description: "Monopoly Junior", category: "SOC", age_range: "PE", state: State.N, price: 8, weight: 400 },
    { id_article: "a2", description: "Barbie Aventurière", category: "FIG", age_range: "PE", state: State.TB, price: 5, weight: 300 },
    { id_article: "a3", description: "Puzzle éducatif", category: "EVL", age_range: "PE", state: State.TB, price: 7, weight: 350 },
    { id_article: "a4", description: "Cubes alphabet", category: "CON", age_range: "PE", state: State.N, price: 4, weight: 300 },
    { id_article: "a5", description: "Livre cache-cache", category: "LIV", age_range: "PE", state: State.N, price: 3, weight: 200 },
    { id_article: "a6", description: "Kapla 200 pièces", category: "CON", age_range: "EN", state: State.B, price: 10, weight: 600 },
    { id_article: "a7", description: "Cerf-volant Pirate", category: "EXT", age_range: "EN", state: State.N, price: 6, weight: 400 },
    { id_article: "a8", description: "Le Petit Nicolas", category: "LIV", age_range: "EN", state: State.TB, price: 5, weight: 200 },
];

// Abonnés
const users: UserToChild[] = [
    { id_user: "Alice", age_range: "PE", preferences: ["SOC","FIG","EVL","CON","LIV","EXT"] },
    { id_user: "Bob", age_range: "EN", preferences: ["EXT","CON","SOC","EVL","FIG","LIV"] },
    { id_user: "Clara", age_range: "PE", preferences: ["EVL","LIV","FIG","SOC","CON","EXT"] }
];

// Campagne
const campaign: Campaign = {
    max_weight: 1200
};

// Composition
const boxes: BoxWithArticle[] = [
    {
        box: { id_box: "b1", id_user: "Alice" },
        articles: [articles[0], articles[1], articles[3]] // a1, a2, a4
    },
    {
        box: { id_box: "b2", id_user: "Bob" },
        articles: [articles[6], articles[5], articles[7]] // a7, a6, a8
    },
    {
        box: { id_box: "b3", id_user: "Clara" },
        articles: [articles[2], articles[4]] // a3, a5
    }
];

// ====== TEST ======

const scorer = new Score();
const result = scorer.evaluateComposition(boxes, campaign, users);

console.log("Score calculé :", result.score);
console.log("Détail par box :", result.perBoxScore);

if (result.score === 70) {
    console.log("✅ Test réussi : score = 70");
} else {
    console.log("❌ Test échoué : score attendu = 70");
}
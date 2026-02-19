import {BoxWithArticle} from "./Temp";
import Score from "./Score";
import {Article} from "../entities/Article";
import {State} from "../entities/enums/State";
import {UserToChild} from "../entities/UserToChild";
import {Campaign} from "../entities/Campaign";
import {Categories} from "../entities/enums/Categories";
import {AgeRange} from "../entities/enums/AgeRange";
import {StateCampaign} from "../entities/enums/StateCampaign";
// ====== DONNÉES ======

// Articles
const articles: Article[] = [
    { id_article: "a1", description: "Monopoly Junior", category: Categories.SOC, age_range: AgeRange.PE, state: State.N, price: 8, weight: 400, id_box: null },
    { id_article: "a2", description: "Barbie Aventurière", category: Categories.FIG, age_range: AgeRange.PE, state: State.TB, price: 5, weight: 300, id_box: null },
    { id_article: "a3", description: "Puzzle éducatif", category: Categories.EVL, age_range: AgeRange.PE, state: State.TB, price: 7, weight: 350, id_box: null },
    { id_article: "a4", description: "Cubes alphabet", category: Categories.CON, age_range: AgeRange.PE, state: State.N, price: 4, weight: 300, id_box: null },
    { id_article: "a5", description: "Livre cache-cache", category: Categories.LIV, age_range: AgeRange.PE, state: State.N, price: 3, weight: 200, id_box: null },
    { id_article: "a6", description: "Kapla 200 pièces", category: Categories.CON, age_range: AgeRange.EN, state: State.B, price: 10, weight: 600, id_box: null },
    { id_article: "a7", description: "Cerf-volant Pirate", category: Categories.EXT, age_range: AgeRange.EN, state: State.N, price: 6, weight: 400, id_box: null },
    { id_article: "a8", description: "Le Petit Nicolas", category: Categories.LIV, age_range: AgeRange.EN, state: State.TB, price: 5, weight: 200, id_box: null },
];

// Abonnés
const users: UserToChild[] = [
    { id_user: "Alice", age_range: AgeRange.PE, preferences: [Categories.SOC,Categories.FIG,Categories.EVL,Categories.CON,Categories.LIV,Categories.EXT] },
    { id_user: "Bob", age_range: AgeRange.EN, preferences: [Categories.EXT,Categories.CON,Categories.SOC,Categories.EVL,Categories.FIG,Categories.LIV] },
    { id_user: "Clara", age_range: AgeRange.PE, preferences: [Categories.EVL,Categories.LIV,Categories.FIG,Categories.SOC,Categories.CON,Categories.EXT] }
];

// Campagne
const campaign: Campaign = {
    id_camp: "c1",
    max_weight: 1200,
    date: new Date(),
    status: StateCampaign.IN_PROGRESS,
    total_price: 0,
    total_weight: 0,
    validated: true,
    min_price: 0,
    max_price: 0
};

// Composition
const boxes1: BoxWithArticle[] = [
    {
        box: { id_box: "b1", id_user: "Alice", id_camp: "c1", score_box: 0, total_weight:0, validated: false, total_price: 0},
        articles: [articles[0], articles[1], articles[3]] // a1, a2, a4
    },
    {
        box: { id_box: "b2", id_user: "Bob", id_camp: "c1", score_box: 0, total_weight:0, validated: false, total_price: 0 },
        articles: [articles[6], articles[5], articles[7]] // a7, a6, a8
    },
    {
        box: { id_box: "b3", id_user: "Clara", id_camp: "c1", score_box: 0, total_weight:0, validated: false, total_price: 0 },
        articles: [articles[2], articles[4]] // a3, a5
    }
];

const boxes2: BoxWithArticle[] = [
    {
        box: { id_box: "b1", id_user: "Alice", id_camp: "c1", score_box: 0, total_weight:0, validated: false, total_price: 0 },
        articles: [articles[0], articles[1], articles[2]] // a1, a2, a3
    },
    {
        box: { id_box: "b2", id_user: "Bob", id_camp: "c1", score_box: 0, total_weight:0, validated: false, total_price: 0 },
        articles: [articles[6], articles[5]] // a7, a6
    },
    {
        box: { id_box: "b3", id_user: "Clara", id_camp: "c1", score_box: 0, total_weight:0, validated: false, total_price: 0 },
        articles: [articles[3], articles[4]] // a4, a5
    }
];

// ====== TEST ======

const scorer = new Score();
const result1 = scorer.evaluateComposition(boxes1, campaign, users);

console.log("Score calculé :", result1.score);
console.log("Détail par box :", result1.perBoxScore);

if (result1.score === 70) {
    console.log("✅ Test réussi : score = 70");
} else {
    console.log("❌ Test échoué : score attendu = 70");
}

const result2 = scorer.evaluateComposition(boxes2, campaign, users);

console.log("Score calculé :", result2.score);
console.log("Détail par box :", result2.perBoxScore);

if (result2.score === 62) {
    console.log("✅ Test réussi : score = 62");
} else {
    console.log("❌ Test échoué : score attendu = 62");
}
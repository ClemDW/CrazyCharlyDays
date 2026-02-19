import {Article} from "../entities/Article";
import {Campaign} from "../entities/Campaign";
import Glouton from "./Glouton";
import Score from "./Score";
import {UserToChild} from "../entities/UserToChild";
import {State} from "../entities/enums/State";


function runTest(
    testName: string,
    articles: Article[],
    users: UserToChild[],
    campaign: Campaign,
    expectedScore: number,
    expectedComposition: Record<string, string[]>
) {

    console.log("\n====================================");
    console.log("TEST :", testName);
    console.log("====================================");

    const glouton = new Glouton(new Score());

    const result = glouton.optimize(
        articles,
        campaign,
        users
    );

    console.log("Score obtenu :", result.score);

    for (const box of result.boxes) {
        console.log(
            box.box.id_user,
            "→",
            box.articles.map(a => a.id_article)
        );
    }

    if (result.score < expectedScore) {
        console.log("Test échoué. Score obtenu :", result.score, "< Score attendu :", expectedScore);
        return;
    }

    console.log("TEST RÉUSSI - Score obtenu :", result.score, ">= Score attendu :", expectedScore);
}

const articles2: Article[] = [
    { id_article: "a1", description: "Loto des animaux", category: "SOC", age_range: "PE", state: State.N, price: 5, weight: 300 },
    { id_article: "a2", description: "Poupée Clara", category: "FIG", age_range: "PE", state: State.TB, price: 8, weight: 400 },
    { id_article: "a3", description: "Duplo Ferme", category: "CON", age_range: "PE", state: State.B, price: 9, weight: 500 },
    { id_article: "a4", description: "Ballon sauteur", category: "EXT", age_range: "PE", state: State.N, price: 4, weight: 500 },
    { id_article: "a5", description: "Imagier sonore", category: "EVL", age_range: "PE", state: State.TB, price: 6, weight: 250 },
    { id_article: "a6", description: "T'choupi à l'école", category: "LIV", age_range: "PE", state: State.N, price: 3, weight: 150 },
];

const users2: UserToChild[] = [
    { id_user: "Emma", age_range: "PE", preferences: ["SOC","EVL","FIG","CON","EXT","LIV"] },
    { id_user: "Lucas", age_range: "PE", preferences: ["EXT","CON","SOC","FIG","EVL","LIV"] }
];

runTest(
    "Cas 1 - Score 41",
    articles2,
    users2,
    { max_weight: 1000 },
    41,
    {
        "Emma": ["a1","a5"],
        "Lucas": ["a4","a3"]
    }
);

const articles3: Article[] = [
    { id_article: "a1", description: "Uno Junior", category: "SOC", age_range: "PE", state: State.N, price: 5, weight: 200 },
    { id_article: "a2", description: "Poupée Léa", category: "FIG", age_range: "PE", state: State.TB, price: 7, weight: 350 },
    { id_article: "a3", description: "Cubes empilables", category: "CON", age_range: "PE", state: State.B, price: 4, weight: 300 },
    { id_article: "a4", description: "Trottinette 3 roues", category: "EXT", age_range: "PE", state: State.N, price: 15, weight: 900 },
    { id_article: "a5", description: "Livre cache-cache", category: "LIV", age_range: "PE", state: State.TB, price: 3, weight: 150 },
    { id_article: "a6", description: "Puzzle animaux", category: "EVL", age_range: "PE", state: State.N, price: 6, weight: 250 },
    { id_article: "a7", description: "Risk Junior", category: "SOC", age_range: "EN", state: State.B, price: 9, weight: 500 },
    { id_article: "a8", description: "Figurine chevalier", category: "FIG", age_range: "EN", state: State.N, price: 6, weight: 200 },
    { id_article: "a9", description: "Lego City", category: "CON", age_range: "EN", state: State.TB, price: 20, weight: 700 },
    { id_article: "a10", description: "Corde à sauter", category: "EXT", age_range: "EN", state: State.N, price: 2, weight: 100 },
    { id_article: "a11", description: "Globe interactif", category: "EVL", age_range: "EN", state: State.B, price: 18, weight: 600 },
    { id_article: "a12", description: "Peluche musicale", category: "EVL", age_range: "BB", state: State.TB, price: 8, weight: 250 },
    { id_article: "a13", description: "Livre tissu jungle", category: "LIV", age_range: "BB", state: State.N, price: 4, weight: 100 },
    { id_article: "a14", description: "Hochet dentition", category: "EVL", age_range: "BB", state: State.B, price: 3, weight: 80 },
    { id_article: "a15", description: "Cube sensoriel", category: "CON", age_range: "BB", state: State.TB, price: 5, weight: 200 },
];

const users3: UserToChild[] = [
    { id_user: "Emma", age_range: "PE", preferences: ["SOC","FIG","EVL","CON","LIV","EXT"] },
    { id_user: "Hugo", age_range: "EN", preferences: ["EXT","CON","EVL","SOC","FIG","LIV"] },
    { id_user: "Chloé", age_range: "BB", preferences: ["EVL","LIV","CON","FIG","SOC","EXT"] },
    { id_user: "Léa", age_range: "PE", preferences: ["FIG","EVL","SOC","LIV","CON","EXT"] }
];

runTest(
    "Cas 2 - Score 78",
    articles3,
    users3,
    { max_weight: 1500 },
    78,
    {
        "Emma": ["a1","a2"],
        "Hugo": ["a10","a9"],
        "Chloé": ["a12","a13"],
        "Léa": ["a6","a5"]
    }
);

const articles4: Article[] = [
    { id_article: "a1", description: "Uno Junior", category: "SOC", age_range: "PE", state: State.N, price: 5, weight: 200 },
    { id_article: "a2", description: "Poupée Clara", category: "FIG", age_range: "PE", state: State.TB, price: 7, weight: 350 },
    { id_article: "a3", description: "Mega Bloks", category: "CON", age_range: "PE", state: State.B, price: 9, weight: 500 },
    { id_article: "a4", description: "Trottinette", category: "EXT", age_range: "PE", state: State.N, price: 12, weight: 800 },
    { id_article: "a5", description: "Xylophone", category: "EVL", age_range: "PE", state: State.TB, price: 6, weight: 300 },
    { id_article: "a6", description: "Mon premier atlas", category: "LIV", age_range: "PE", state: State.N, price: 4, weight: 200 },
    { id_article: "a7", description: "Cluedo", category: "SOC", age_range: "EN", state: State.B, price: 8, weight: 400 },
    { id_article: "a8", description: "Figurine Dragon", category: "FIG", age_range: "EN", state: State.N, price: 10, weight: 200 },
    { id_article: "a9", description: "Meccano", category: "CON", age_range: "EN", state: State.TB, price: 11, weight: 600 },
    { id_article: "a10", description: "Frisbee", category: "EXT", age_range: "EN", state: State.N, price: 3, weight: 150 },
];

const users4: UserToChild[] = [
    { id_user: "Léa", age_range: "PE", preferences: ["FIG","SOC","EVL","CON","EXT","LIV"] },
    { id_user: "Noah", age_range: "EN", preferences: ["CON","EXT","SOC","EVL","FIG","LIV"] },
    { id_user: "Jade", age_range: "PE", preferences: ["EVL","LIV","FIG","SOC","CON","EXT"] }
];

runTest(
    "Cas 3 - Score 63",
    articles4,
    users4,
    { max_weight: 1200 },
    63,
    {
        "Léa": ["a2","a1"],
        "Noah": ["a9","a10"],
        "Jade": ["a5","a6"]
    }
);

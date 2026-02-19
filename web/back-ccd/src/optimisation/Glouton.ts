import { BoxWithArticle } from "./Temp";
import Score from "./Score";
import {Campaign} from "../entities/Campaign";
import {UserToChild} from "../entities/UserToChild";
import {Article} from "../entities/Article";

type CompositionResult = {
    boxes: BoxWithArticle[],
    score: number
}

export default class Glouton {

    constructor(private scoreService: Score) {}

    optimize(
        articles: Article[],
        campaign: Campaign,
        usersToChild: UserToChild[]
    ): CompositionResult {

        // Initialisation correcte des boxes
        let boxes: BoxWithArticle[] = usersToChild.map((utc, index) => ({
            box: {
                id_box: "box_" + index,
                id_user: utc.id_user
            },
            articles: []
        }));

        let remainingArticles = [...articles];

        // Score initial
        this.scoreService.usedArticles.clear();
        let currentScore = this.scoreService.evaluateComposition(boxes, campaign, usersToChild).score;

        let improved = true;

        while (improved) {
            improved = false;

            let bestGain = 0;
            let bestMove: {
                article: Article,
                box: BoxWithArticle
            } | null = null;

            for (const article of remainingArticles) {

                for (const box of boxes) {

                    const user = usersToChild.find(u => u.id_user === box.box.id_user);
                    if (!user) continue;

                    // compatibilité âge
                    if (user.age_range !== article.age_range) continue;

                    // contrainte poids
                    const currentWeight = box.articles.reduce((s, a) => s + a.weight, 0);
                    if (currentWeight + article.weight > campaign.max_weight)
                        continue;

                    // Simulation
                    box.articles.push(article);

                    this.scoreService.usedArticles.clear();
                    const newScore =
                        this.scoreService.evaluateComposition(boxes, campaign, usersToChild).score;

                    const gain = newScore - currentScore;

                    box.articles.pop();

                    if (gain > bestGain) {
                        bestGain = gain;
                        bestMove = { article, box };
                    }
                }
            }

            if (bestMove && bestGain > 0) {
                bestMove.box.articles.push(bestMove.article);
                remainingArticles =
                    remainingArticles.filter(a => a.id_article !== bestMove.article.id_article);

                this.scoreService.usedArticles.clear();
                currentScore =
                    this.scoreService.evaluateComposition(boxes, campaign, usersToChild).score;

                improved = true;
            }
        }

        return {
            boxes,
            score: currentScore
        };
    }
}

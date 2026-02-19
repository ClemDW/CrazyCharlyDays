import { BoxWithArticle } from "./Temp";
import Score from "./Score";
import { Campaign } from "../entities/Campaign";
import { UserToChild } from "../entities/UserToChild";
import { Article } from "../entities/Article";

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

        // Initialisation des box vides
        const boxes: BoxWithArticle[] = usersToChild.map((utc, index) => ({
            box: {
                id_box: "box_" + index,
                id_user: utc.id_user,
                id_camp: campaign.id_camp,
                score_box: 0,
                total_weight: 0,
                total_price: 0,
                validated: false
            },
            articles: []
        }));

        const remainingArticles = new Set(articles);

        let currentScore =
            this.scoreService.evaluateComposition(boxes, campaign, usersToChild).score;

        let improved = true;

        while (improved) {
            improved = false;

            let bestGain = 0;
            let bestArticle: Article | null = null;
            let bestBox: BoxWithArticle | null = null;

            for (const article of remainingArticles) {

                for (const box of boxes) {

                    const user = usersToChild.find(
                        u => u.id_user === box.box.id_user
                    );
                    if (!user) continue;

                    // compatibilité âge rapide
                    if (article.age_range !== user.age_range) continue;

                    // simulation propre
                    box.articles.push(article);

                    const newScore =
                        this.scoreService.evaluateComposition(
                            boxes,
                            campaign,
                            usersToChild
                        ).score;

                    const gain = newScore - currentScore;

                    box.articles.pop();

                    if (gain > bestGain) {
                        bestGain = gain;
                        bestArticle = article;
                        bestBox = box;
                    }
                }
            }

            if (bestArticle && bestBox && bestGain > 0) {

                bestBox.articles.push(bestArticle);
                remainingArticles.delete(bestArticle);

                currentScore =
                    this.scoreService.evaluateComposition(
                        boxes,
                        campaign,
                        usersToChild
                    ).score;

                improved = true;
            }
        }

        return {
            boxes,
            score: currentScore
        };
    }
}

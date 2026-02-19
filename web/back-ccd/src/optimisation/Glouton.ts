import { BoxWithArticle, CompositionResult } from "./Temp";
import Score from "./Score";
import { Campaign } from "../entities/Campaign";
import { Usertochild } from "../entities/UserToChild";
import { Article } from "../entities/Article";
import { Box } from "../entities/Box";

export default class Glouton {

    constructor(private scoreService: Score) {}

    optimize(
        articles: Article[],
        campaign: Campaign,
        usersToChild: Usertochild[]
    ): CompositionResult {

        // box vides
        const boxes: BoxWithArticle[] = usersToChild.map((utc, index) => {
            const b = new Box();
            b.id_box = "box_" + index;
            b.id_user = utc.id_user;
            b.id_camp = campaign.id_camp;
            b.score_box = 0;
            b.total_weight = 0;
            b.total_price = 0;
            b.validated = false;

            return {
                box: b,
                articles: []
            };
        });

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

                    // compatibilité age rapide
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

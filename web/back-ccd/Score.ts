type ScoreResult = {
    score: number;
    perBoxScore: Map<string, number>
}

import { BoxWithArticle } from "./Temp";

const INVALID_SCORE = -9999999999999;

export default class Score {

    usedArticles = new Set<string>();

    evaluateComposition(boxes : Array<BoxWithArticle>, campaign: Campaign, usersToChild: Array<UserToChild>) : ScoreResult {
        this.usedArticles = new Set<string>();
        let totalScore = 0;
        let perBoxScore = new Map<string, number>();

        for (const box of boxes) {
            // Règle 7 : Tout le monde est servi
            if (box.articles.length === 0) {
                totalScore -= 10;
            }
            else {
                let userToChild = usersToChild.find(utc => utc.id_user === box.box.id_user);
                if (userToChild) {
                    let score = this.evaluateBox(box, campaign, userToChild);
                    if (score === INVALID_SCORE) {
                        return {
                            score: 0,
                            perBoxScore: new Map<string, number>()
                        }
                    }
                    perBoxScore.set(box.box.id_box, score);
                    totalScore += score;
                }
            }

            // Règle 8 : Equité
            for (const otherBox of boxes) {
                if (box.box.id_box !== otherBox.box.id_box) {
                    if (otherBox.articles.length - box.articles.length >= 2) {
                        totalScore -= 10;
                        break;
                    }
                }
            }
        }

        return {
            score: totalScore,
            perBoxScore: perBoxScore
        }
    }

    evaluateBox(box: BoxWithArticle, campaign: Campaign, child: UserToChild) : number {
        let totalWeight = 0;
        let score = 0;
        let categoriesCount = new Map<string, number>();

        for (const article of box.articles) {
            // Règle 1 : Unicité des articles
            if (this.usedArticles.has(article.id_article)) {
                return INVALID_SCORE;
            }
            this.usedArticles.add(article.id_article);

            // Règle 2 : Compatibilité d'âge
            if (article.age_range !== child.age_range){
                return INVALID_SCORE;
            }

            // Règle 3 : Poids limité
            totalWeight += article.weight;
            if (totalWeight > campaign.max_weight) {
                return INVALID_SCORE;
            }

            // Règle 4 : Gain par préférence de catégorie
            let preferences = child.preferences;
            let idx = preferences.findIndex(pref => pref === article.category);

            // Règle 6 : Utilités dégressives
            if (!categoriesCount.has(article.category)) {
                categoriesCount.set(article.category, 1);
            }
            else {
                idx += categoriesCount.get(article.category);
                categoriesCount.set(article.category, categoriesCount.get(article.category) + 1);
            }

            switch (idx) {
                case 0: score += 10; break;
                case 1: score += 8; break;
                case 2: score += 6; break;
                case 3: score += 4; break;
                case 4: score += 2; break;
                default: score+= 1; break;
            }

            // Règle 5 : Bonus d'état
            switch (article.state) {
                case State.N: score += 2; break;
                case State.TB: score += 1; break;
                default: break;
            }

        }
        return score;
    }
}
import {Article} from "../entities/Article";
import {Campaign} from "../entities/Campaign";
import {Usertochild} from "../entities/UserToChild";
import {User} from "../entities/User";
import Score from "./Score";
import {AppDataSource} from "../data-source";
import {IsNull} from "typeorm";
import {StateCampaign} from "../entities/enums/StateCampaign";
import RecuitSimule from "./RecuitSimule";

export default class Solver {

    /**
     * Résout le problème d'optimisation, en exécutant l'algorithme Glouton, et en retournant le résultat.
     */
    async solve() {
        // Récupérer les données depuis la DB (articles disponibles)
        const articleRepo = AppDataSource.getRepository(Article);
        const articles = await articleRepo.find({ where: { id_box: IsNull() } });

        // On prend la dernière campagne
        const campaignRepo = AppDataSource.getRepository(Campaign);
        const campaign = await campaignRepo.findOne({
            where: {status: StateCampaign.IN_PROGRESS.code},
            order: { date: "DESC" }
        });
        if (!campaign) {
            throw new Error("Aucune campagne trouvée.");
        }

        const childRepo = AppDataSource.getRepository(Usertochild);
        const usersToChild = await childRepo.find();

        // Lancer l'optimisation
        const method = new RecuitSimule(new Score());
        return method.optimize(articles, campaign, usersToChild);
    }

    /**
     * Génère la chaîne CSV correspondant au résultat de l'optimisation.
     * @param result Le résultat de l'optimisation (CompositionResult).
     */
    async generateCSVString(result: any): Promise<string> {
        let csvContent = `${result.score}\n`;

        // Pour chaque box, on liste les articles
        for (const box of result.boxes) {
            // Récupérer les infos de l'utilisateur
            const user = await User.findOneBy({ id_user: box.box.id_user });
            const userName = user ? user.name : "Unknown";

            for (const article of box.articles) {
                // (1) Le prénom de l’abonné
                // (2) L’id de l’article
                // (3) La catégorie de l’article
                // (4) La tranche d’âge de l’article
                // (5) L’état de l’article

                const articleId = article.external_id || article.id_article; // Utilise external_id si dispo
                const category = article.category;
                const ageRange = article.age_range;
                const state = article.state;

                const line = `${userName};${articleId};${category};${ageRange};${state}`;
                csvContent += line + "\n";
            }
        }

        return csvContent;
    }
}


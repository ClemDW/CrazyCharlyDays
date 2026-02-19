import { Article } from "../entities/Article";
import { Campaign } from "../entities/Campaign";
import { Usertochild } from "../entities/UserToChild";
import { User } from "../entities/User";
import Glouton from "./Glouton";
import Score from "./Score";

export default class Solver {

    /**
     * Résout le problème d'optimisation en chargeant les données depuis un CSV,
     * en exécutant l'algorithme Glouton, et en retournant le résultat.
     * @param inputCSVPath Chemin vers le fichier CSV d'entrée.
     */
    async solve() {
        // Récupérer les données depuis la DB
        const articles = await Article.find();

        // On suppose qu'il n'y a qu'une campagne active ou la dernière
        // Le CSV loader crée une nouvelle campagne, on prend la dernière créée
        const campaign = await Campaign.findOne({
            order: { date: "DESC" }
        });

        if (!campaign) {
            throw new Error("Aucune campagne trouvée.");
        }

        const usersToChild = await Usertochild.find();

        // Lancer l'optimisation
        const glouton = new Glouton(new Score());
        const result = glouton.optimize(articles, campaign, usersToChild);

        return result;
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


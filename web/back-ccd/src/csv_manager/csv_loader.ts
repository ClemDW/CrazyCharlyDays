import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../../.env") }); 

import { AppDataSource } from "../data-source";

import * as fs from "fs";
import { Article } from "../entities/Article";
import { Campaign } from "../entities/Campaign";
import { Usertochild } from "../entities/UserToChild";
import { CategoryKey } from "../entities/enums/Categories";
import { AgeRangeKey } from "../entities/enums/AgeRange";
import { StateKey } from "../entities/enums/State";
import { User } from "../entities/User";
import { StateCampaign } from "../entities/enums/StateCampaign";

/**
 * 
 * @returns 
 */
async function initializeDatabase() : Promise<void> {

    return AppDataSource.initialize()
        .then(() => {
            console.log("Connexion à PostgreSQL réussie !");
        })
        .catch((error) => {
            console.error("Erreur de connexion :", error);
            process.exit(1); // Sortie en cas d'échec
        });

}



/**
 * Charge un fichier CSV complexe et enregistre les données selon la section
 * @param CSVFilePath 
 */
async function loadCSV(CSVFilePath: string) {
    try {
        // Initialiser la DB si ce n'est pas déjà fait
        if (!AppDataSource.isInitialized) {
            await initializeDatabase();
        }

        // Lire le contenu du fichier
        const content = fs.readFileSync(CSVFilePath, "utf-8");
        const lines = content.split("\n").map(l => l.trim()).filter(l => l.length > 0);

        let currentSection = "";

        // Parcours des lignes du CSV
        for (const line of lines) {

            // Détection du changement de section
            if (line === "articles" || line === "abonnes" || line === "parametres") {
                currentSection = line;
                continue;
            }

            const data = line.split(";");

            if (currentSection === "articles") {

                const article = new Article();
                // data[0] est l'ID (a1, a2...), on l'ignore si la DB génère un UUID, 
                // ou on l'utilise si id_article est une string manuelle.
                article.description = data[1];
                article.category = data[2] as CategoryKey;
                article.age_range = data[3] as AgeRangeKey;
                article.state = data[4] as StateKey;
                article.price = parseFloat(data[5]);
                article.weight = parseFloat(data[6]);

                await article.save();
                console.log(`Article ajouté : ${article.description}`);

            } else if (currentSection === "abonnes") {

                const user = new User();
                console.log(`Processing user: ${data[1]}`);
                user.name = data[1];
                user.role = "USER"; // Par défaut, tous les abonnés sont des utilisateurs
                await user.save();

                const userToChild = new Usertochild();
                userToChild.age_range = data[2] as AgeRangeKey;
                userToChild.preference = data[3].split(",").map(p => p.trim());
                userToChild.save();

                console.log(`Abonné ajouté : ${data[1]}`);

            } else if (currentSection === "parametres") {

                const campaign = new Campaign();
                campaign.date = new Date();
                campaign.max_weight = parseFloat(data[0]);
                campaign.status = StateCampaign.IN_PROGRESS.code;
                campaign.save();

            }
        }

        console.log("✅ Importation terminée avec succès !");

    } catch (error) {
        console.error("❌ Erreur lors de la lecture du CSV :", error);
    }
}


export { loadCSV };
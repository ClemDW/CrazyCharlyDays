
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../.env") }); 

import { AppDataSource } from "./data-source";

async function testConnection() {
    try {

        console.log(process.env.POSTGRES_PASSWORD);

        console.log("⏳ Tentative de connexion à la base de données...");

        // Initialisation de la source de données
        await AppDataSource.initialize();

        console.log("🚀 Connexion à PostgreSQL réussie !");

        // Optionnel : Afficher les entités chargées pour vérifier que TypeORM les voit
        const entities = AppDataSource.entityMetadatas.map(entity => entity.name);
        console.log("📁 Entités chargées :", entities.join(", "));

        // On ferme la connexion proprement après le test
        await AppDataSource.destroy();
        console.log("✅ Test terminé, connexion fermée.");

    } catch (error) {
        console.error("❌ Erreur de connexion :", error);
        process.exit(1); // Sortie en cas d'échec
    }
}

testConnection();
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
    .then(() => {
        console.log("🚀 Connexion à PostgreSQL réussie !");
        
        // C'est ici que vous pouvez lancer votre serveur (Express par exemple)
    })
    .catch((error) => console.log("❌ Erreur de connexion : ", error));
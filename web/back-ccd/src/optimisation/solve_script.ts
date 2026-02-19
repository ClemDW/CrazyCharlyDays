import Solver from "./Solver";
import * as path from "path";
import { saveCSV } from "../csv_manager/csv_saver";

(async () => {
    // Exemple d'utilisation
    const solver = new Solver();

    // Chemin vers le fichier d'entrée (à adapter selon vos besoins)
    // Ici on suppose que l'argument est passé en ligne de commande, sinon on prend un défaut
    const outputFile = process.argv[3] || path.join(__dirname, "../../../donnees_test_ccd_22026/solutions/solution_pb1.csv");

    try {
        const result = await solver.solve();

        console.log(`Optimisation terminée. Score: ${result.score}`);

        const csvContent = await solver.generateCSVString(result);
        await saveCSV(csvContent, outputFile);

    } catch (error) {
        console.error("Erreur lors de l'exécution :", error);
    }
})();


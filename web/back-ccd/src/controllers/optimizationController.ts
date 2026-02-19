import { Request, Response } from "express";
import { saveCSV } from "../csv_manager/csv_saver";
import Solver from "../optimisation/Solver";

export const OptimizationController = {
    /**
     * Lance l'optimisation des boxes.
     * Utilise les données existantes en base (articles, utilisateurs, campagne).
     */
    async optimize(req: Request, res: Response) {
        try {
            const solver = new Solver();

            // On optimise juste ce qui est en DB
            const result = await solver.solve();

            // Génère le CSV de sortie
            const csvOutput = await solver.generateCSVString(result);

            // Sauvegarde le CSV
            await saveCSV(csvOutput, "solution.csv");

            // Retourne le fichier CSV
            res.header("Content-Type", "text/csv");
            res.attachment("solution.csv");
            return res.send(csvOutput);

        } catch (error) {
            console.error("Erreur lors de l'optimisation :", error);
            return res.status(500).json({
                message: "Erreur lors de l'optimisation",
                details: error instanceof Error ? error.message : "Erreur inconnue"
            });
        }
    }
};



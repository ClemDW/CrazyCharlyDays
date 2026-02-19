import { Request, Response } from "express";
import { saveCSV } from "../csv_manager/csv_saver";
import Solver from "../optimisation/Solver";
import {User} from "../entities/User";

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

            const boxesPromise = result.boxes.map(async (box: any) =>  {
                const user = await User.findOneBy({ id_user: box.box.id_user });
                return ({
                    userName: user ? user.name : "Unknown",
                    id_user: box.box.id_user,
                    articles: box.articles.map((a: any) => ({
                        id: a.id_article,
                        category: a.category,
                        age_range: a.age_range,
                        state: a.state
                    }))
                })
            });

            const boxes = await Promise.all(boxesPromise);

            let json = {
                csv: csvOutput,
                jsonObject: {
                    score: result.score,
                    boxes: boxes
                }
            };

            // Retourne le fichier CSV
            res.header("Content-Type", "text/csv");
            res.attachment("solution.csv");
            return res.json(json);

        } catch (error) {
            console.error("Erreur lors de l'optimisation :", error);
            return res.status(500).json({
                message: "Erreur lors de l'optimisation",
                details: error instanceof Error ? error.message : "Erreur inconnue"
            });
        }
    }
};



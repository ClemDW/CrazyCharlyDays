import { Request, Response } from "express";
import { saveCSV } from "../csv_manager/csv_saver";
import Solver from "../optimisation/Solver";
import { User } from "../entities/User";
import { AgeRange } from "../entities/enums/AgeRange";
import { Categories } from "../entities/enums/Categories";
import { State } from "../entities/enums/State";

// Helper to map codes to names
const getAgeRangeName = (code: string) => (AgeRange as any)[code]?.name || code;
const getCategoryName = (code: string) =>
  (Categories as any)[code]?.name || code;
const getStateName = (code: string) => (State as any)[code]?.name || code;

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

      const boxesPromise = result.boxes.map(async (box: any) => {
        const user = await User.findOneBy({ id_user: box.box.id_user });
        return {
          userName: user ? user.name : "Unknown",
          id_user: box.box.id_user,
          score: box.box.score_box,
          total_weight: box.box.total_weight,
          total_price: box.box.total_price,
          articles: box.articles.map((a: any) => ({
            id: a.id_article,
            description: a.description,
            category: getCategoryName(a.category),
            age_range: getAgeRangeName(a.age_range),
            state: getStateName(a.state),
            weight: a.weight,
            price: a.price,
          })),
        };
      });

      const boxes = await Promise.all(boxesPromise);

      let json = {
        csv: csvOutput,
        jsonObject: {
          score: result.score,
          boxes: boxes,
        },
      };

      // On renvoie le JSON (qui contient le CSV pour le téléchargement côté client)
      return res.json(json);
    } catch (error) {
      console.error("Erreur lors de l'optimisation :", error);
      return res.status(500).json({
        message: "Erreur lors de l'optimisation",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  },
};

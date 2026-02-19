import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Box } from "../entities/Box";
import { Article } from "../entities/Article";
import { User } from "../entities/User";
import { AgeRange } from "../entities/enums/AgeRange";
import { Categories } from "../entities/enums/Categories";
import { State } from "../entities/enums/State";

// Helper to map codes to names
const getAgeRangeName = (code: string) => (AgeRange as any)[code]?.name || code;
const getCategoryName = (code: string) =>
  (Categories as any)[code]?.name || code;
const getStateName = (code: string) => (State as any)[code]?.name || code;

export const BoxController = {
  async create(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Box);
      const newBox = repo.create(req.body);
      const savedBox = await repo.save(newBox);
      return res.status(201).json(savedBox);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de la box", error });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Box);
      const boxes = await repo.find();
      return res.json(boxes);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },

  /**
   * Retourne la liste détaillée des boxes avec utilisateurs et articles.
   */
  async getDetailed(req: Request, res: Response) {
    try {
      const boxRepo = AppDataSource.getRepository(Box);
      const articleRepo = AppDataSource.getRepository(Article);
      const userRepo = AppDataSource.getRepository(User);

      const boxes = await boxRepo.find();

      const detailedBoxes = await Promise.all(
        boxes.map(async (box) => {
          const user = await userRepo.findOneBy({ id_user: box.id_user });
          const articles = await articleRepo.find({
            where: { id_box: box.id_box },
          });

          return {
            id_user: box.id_user,
            id_box: box.id_box,
            subscriberName: user ? user.name : "Unknown",
            subscriberEmail: user ? user.email : "Unknown",
            score: box.score_box,
            total_weight: box.total_weight,
            total_price: box.total_price,
            validated: box.validated,
            articles: articles.map((a) => ({
              id: a.id_article,
              description: a.description,
              category: getCategoryName(a.category),
              age_range: getAgeRangeName(a.age_range),
              state: getStateName(a.state),
              weight: a.weight,
              price: a.price,
            })),
          };
        }),
      );

      // On calcule un score global "approximatif" pour l'affichage (somme des scores individuels)
      const totalGlobalScore = detailedBoxes.reduce(
        (sum, b) => sum + (b.score || 0),
        0,
      );

      return res.json({
        jsonObject: {
          boxes: detailedBoxes,
          score: totalGlobalScore,
        },
      });
    } catch (error) {
      console.error("Erreur getDetailed:", error);
      return res
        .status(500)
        .json({
          message: "Erreur serveur lors de la récupération des détails",
        });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Box);
      const box = await repo.findOneBy({ id_box: req.params.id as any });
      if (!box) return res.status(404).json({ message: "Box non trouvée" });
      return res.json(box);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Box);
      const box = await repo.findOneBy({ id_box: req.params.id as any });
      if (!box) return res.status(404).json({ message: "Box non trouvée" });

      repo.merge(box, req.body);
      const updatedBox = await repo.save(box);
      return res.json(updatedBox);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la modification" });
    }
  },
};

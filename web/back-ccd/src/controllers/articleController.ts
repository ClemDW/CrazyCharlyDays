import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Article } from "../entities/Article";

export const ArticleController = {
  async create(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Article);

      // Build article data from body + uploaded file
      const articleData = { ...req.body };
      if ((req as any).file) {
        articleData.picture = (req as any).file.filename;
      }

      const newArticle = repo.create(articleData);
      const savedArticle = await repo.save(newArticle);

      return res.status(201).json(savedArticle);
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      return res.status(500).json({
        message: "Impossible de créer l'article",
        details: error,
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Article);

      // Récupère tous les articles
      const articles = await repo.find();

      return res.json(articles);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Article);
      const article = await repo.findOneBy({
        id_article: req.params.id as string,
      });

      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }

      return res.json(article);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const repo = AppDataSource.getRepository(Article);

      // 1. Chercher si l'article existe
      const article = await repo.findOneBy({ id_article: id as string });

      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }

      // 2. Fusionner les anciennes données avec les nouvelles du JSON (req.body)
      // merge() copie les propriétés de req.body dans l'objet article
      repo.merge(article, req.body);

      // 3. Sauvegarder les modifications
      const updatedArticle = await repo.save(article);

      return res.json(updatedArticle);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la modification", error });
    }
  },
};

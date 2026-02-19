import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usertochild } from "../entities/UserToChild";

export const UserToChildController = {
  async create(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Usertochild);
      const newData = repo.create(req.body);
      const savedData = await repo.save(newData);
      return res.status(201).json(savedData);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la création", error });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Usertochild);
      // Return all children for this user
      const data = await repo.findBy({ id_user: req.params.id as string });
      if (!data || data.length === 0)
        return res
          .status(404)
          .json({ message: "Préférences enfant non trouvées" });
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Usertochild);
      const data = await repo.findOneBy({ id_user: req.params.id as string });
      if (!data) return res.status(404).json({ message: "Non trouvé" });

      repo.merge(data, req.body);
      const updated = await repo.save(data);
      return res.json(updated);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la modification" });
    }
  },
};

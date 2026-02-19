import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Box } from "../entities/Box";

export const BoxController = {
    async create(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Box);
            const newBox = repo.create(req.body);
            const savedBox = await repo.save(newBox);
            return res.status(201).json(savedBox);
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la création de la box", error });
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
            return res.status(500).json({ message: "Erreur lors de la modification" });
        }
    }
};
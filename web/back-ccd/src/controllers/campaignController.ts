import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Campaign } from "../entities/Campaign";

export const CampaignController = {
    async create(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Campaign);
            const newCampaign = repo.create(req.body);
            const savedCampaign = await repo.save(newCampaign);
            return res.status(201).json(savedCampaign);
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la création de la campagne", error });
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Campaign);
            const campaigns = await repo.find({ order: { date: "DESC" } });
            return res.json(campaigns);
        } catch (error) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getOne(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Campaign);
            const campaign = await repo.findOneBy({ id_camp: req.params.id as string });
            if (!campaign) return res.status(404).json({ message: "Campagne non trouvée" });
            return res.json(campaign);
        } catch (error) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Campaign);
            const campaign = await repo.findOneBy({ id_camp: req.params.id as string });
            if (!campaign) return res.status(404).json({ message: "Campagne non trouvée" });

            repo.merge(campaign, req.body);
            const updated = await repo.save(campaign);
            return res.json(updated);
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la modification" });
        }
    }
};
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Campaign } from "../entities/Campaign";
import { Box } from "../entities/Box";
import { User } from "../entities/User";
import { Article } from "../entities/Article";
import { sendBoxReadyEmail } from "../services/emailService";

export const CampaignController = {
  async create(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Campaign);
      const newCampaign = repo.create(req.body);
      const savedCampaign = await repo.save(newCampaign);
      return res.status(201).json(savedCampaign);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de la campagne", error });
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
      const campaign = await repo.findOneBy({
        id_camp: req.params.id as string,
      });
      if (!campaign)
        return res.status(404).json({ message: "Campagne non trouvée" });
      return res.json(campaign);
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Campaign);
      const campaign = await repo.findOneBy({
        id_camp: req.params.id as string,
      });
      if (!campaign)
        return res.status(404).json({ message: "Campagne non trouvée" });

      const previousStatus = campaign.status;

      repo.merge(campaign, req.body);
      const updated = await repo.save(campaign);

      // --- Auto-send emails when campaign becomes VALIDATED ---
      if (updated.status === "VALIDATED" && previousStatus !== "VALIDATED") {
        // Fire-and-forget: don't block the response
        (async () => {
          try {
            const boxRepo = AppDataSource.getRepository(Box);
            const userRepo = AppDataSource.getRepository(User);
            const articleRepo = AppDataSource.getRepository(Article);

            const boxes = await boxRepo.findBy({
              id_camp: updated.id_camp as any,
            });
            console.log(
              `📦 Campagne ${updated.id_camp} validée — ${boxes.length} box à notifier`,
            );

            for (const box of boxes) {
              try {
                const user = await userRepo.findOneBy({
                  id_user: box.id_user as any,
                });
                if (!user) {
                  console.warn(
                    `⚠️ Utilisateur ${box.id_user} introuvable pour la box ${box.id_box}`,
                  );
                  continue;
                }

                const articles = await articleRepo.findBy({
                  id_box: box.id_box as any,
                });

                await sendBoxReadyEmail(
                  user.email,
                  `${user.name} ${user.family_name}`,
                  articles,
                );
              } catch (emailErr) {
                console.error(
                  `❌ Erreur email pour box ${box.id_box}:`,
                  emailErr,
                );
              }
            }

            console.log("✅ Notifications email terminées");
          } catch (err) {
            console.error("❌ Erreur lors de l'envoi des notifications:", err);
          }
        })();
      }

      return res.json(updated);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la modification" });
    }
  },
};

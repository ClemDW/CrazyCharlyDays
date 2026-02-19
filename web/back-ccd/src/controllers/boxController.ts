import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Box } from "../entities/Box";
import { Article } from "../entities/Article";
import { User } from "../entities/User";
import { Campaign } from "../entities/Campaign";

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

    async getAdminView(req: Request, res: Response) {
        try {
            const boxRepo = AppDataSource.getRepository(Box);
            const articleRepo = AppDataSource.getRepository(Article);
            const userRepo = AppDataSource.getRepository(User);
            const campaignRepo = AppDataSource.getRepository(Campaign);

            const [boxes, articles, users, campaigns] = await Promise.all([
                boxRepo.find(),
                articleRepo.find(),
                userRepo.find(),
                campaignRepo.find(),
            ]);

            const usersById = new Map(users.map((u) => [u.id_user, u]));
            const campaignsById = new Map(campaigns.map((c) => [c.id_camp, c]));

            const articlesByBoxId = new Map<string, Article[]>();
            for (const article of articles) {
                if (!article.id_box) continue;
                if (!articlesByBoxId.has(article.id_box)) {
                    articlesByBoxId.set(article.id_box, []);
                }
                articlesByBoxId.get(article.id_box)?.push(article);
            }

            const data = boxes.map((box) => {
                const user = usersById.get(box.id_user);
                const campaign = campaignsById.get(box.id_camp);

                return {
                    id_box: box.id_box,
                    id_camp: box.id_camp,
                    id_user: box.id_user,
                    score_box: box.score_box,
                    total_weight: box.total_weight,
                    total_price: box.total_price,
                    validated: box.validated,
                    user: user
                        ? {
                              id_user: user.id_user,
                              name: user.name,
                              family_name: user.family_name,
                              email: user.email,
                          }
                        : null,
                    campaign: campaign
                        ? {
                              id_camp: campaign.id_camp,
                              date: campaign.date,
                              status: campaign.status,
                          }
                        : null,
                    articles: articlesByBoxId.get(box.id_box) ?? [],
                };
            });

            return res.json(data);
        } catch (error) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async validate(req: Request, res: Response) {
        try {
            const boxId = req.params.id as string;

            const result = await AppDataSource.transaction(async (manager) => {
                const boxRepo = manager.getRepository(Box);
                const articleRepo = manager.getRepository(Article);

                const box = await boxRepo.findOneBy({ id_box: boxId });
                if (!box) {
                    return { status: 404, body: { message: "Box non trouvée" } };
                }

                if (box.validated) {
                    const currentArticles = await articleRepo.findBy({ id_box: box.id_box });
                    return {
                        status: 200,
                        body: {
                            message: "Box déjà validée",
                            box,
                            articles_count: currentArticles.length,
                            history_recorded: true,
                        },
                    };
                }

                const articles = await articleRepo.findBy({ id_box: box.id_box });
                if (articles.length === 0) {
                    return {
                        status: 400,
                        body: { message: "Impossible de valider une box vide" },
                    };
                }

                box.validated = true;
                const savedBox = await boxRepo.save(box);

                return {
                    status: 200,
                    body: {
                        message:
                            "Box validée : les articles sont retirés du stock disponible et l'envoi est enregistré dans l'historique",
                        box: savedBox,
                        articles_count: articles.length,
                        history_recorded: true,
                    },
                };
            });

            return res.status(result.status).json(result.body);
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la validation de la box" });
        }
    },

    async getHistory(req: Request, res: Response) {
        try {
            const boxRepo = AppDataSource.getRepository(Box);
            const articleRepo = AppDataSource.getRepository(Article);
            const userRepo = AppDataSource.getRepository(User);
            const campaignRepo = AppDataSource.getRepository(Campaign);

            const [boxes, articles, users, campaigns] = await Promise.all([
                boxRepo.find({ where: { validated: true } }),
                articleRepo.find(),
                userRepo.find(),
                campaignRepo.find(),
            ]);

            const usersById = new Map(users.map((u) => [u.id_user, u]));
            const campaignsById = new Map(campaigns.map((c) => [c.id_camp, c]));

            const articlesByBoxId = new Map<string, Article[]>();
            for (const article of articles) {
                if (!article.id_box) continue;
                if (!articlesByBoxId.has(article.id_box)) {
                    articlesByBoxId.set(article.id_box, []);
                }
                articlesByBoxId.get(article.id_box)?.push(article);
            }

            const history = boxes
                .map((box) => ({
                    id_box: box.id_box,
                    id_user: box.id_user,
                    user: usersById.get(box.id_user) ?? null,
                    campaign: campaignsById.get(box.id_camp) ?? null,
                    articles: articlesByBoxId.get(box.id_box) ?? [],
                    total_price: box.total_price,
                    total_weight: box.total_weight,
                    score_box: box.score_box,
                }))
                .sort((a, b) => {
                    const dateA = a.campaign?.date ? new Date(a.campaign.date).getTime() : 0;
                    const dateB = b.campaign?.date ? new Date(b.campaign.date).getTime() : 0;
                    return dateB - dateA;
                });

            return res.json(history);
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
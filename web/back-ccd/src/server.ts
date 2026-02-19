import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { Article } from "./entities/Article";
import { User } from "./entities/User";
import { Usertochild } from "./entities/UserToChild";
import { Box } from "./entities/Box";
import { Campaign } from "./entities/Campaign";

// ────────────────────────────────────────────
//  DataSource (TypeORM)
// ────────────────────────────────────────────
const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: [Article, User, Usertochild, Box, Campaign],
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ════════════════════════════════════════════
//  📦 ARTICLES
// ════════════════════════════════════════════

// POST /articles — Ajouter un article
app.post("/articles", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Article);
    const article = repo.create(req.body);
    const saved = await repo.save(article);
    res.status(201).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'article", details: err });
  }
});

// GET /articles — Catalogue avec pagination + filtres
app.get("/articles", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Article);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const qb = repo.createQueryBuilder("article");

    // Filtres optionnels
    if (req.query.cat) {
      qb.andWhere("article.category = :cat", { cat: req.query.cat });
    }
    if (req.query.age) {
      qb.andWhere("article.age_range = :age", { age: req.query.age });
    }
    if (req.query.state) {
      qb.andWhere("article.state = :state", { state: req.query.state });
    }

    const [articles, total] = await qb.skip(skip).take(limit).getManyAndCount();

    res.json({
      data: articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des articles",
      details: err,
    });
  }
});

// GET /articles/scan/:code_barre — Rechercher par code-barre
app.get("/articles/scan/:code_barre", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Article);
    const article = await repo.findOneBy({
      id_article: req.params.code_barre as any,
    });
    if (!article) {
      return res.status(404).json({ error: "Article non trouvé" });
    }
    res.json(article);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche", details: err });
  }
});

// GET /articles/:id — Détails d'un article
app.get("/articles/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Article);
    const article = await repo.findOneBy({ id_article: req.params.id as any });
    if (!article) {
      return res.status(404).json({ error: "Article non trouvé" });
    }
    res.json(article);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération", details: err });
  }
});

// PUT /articles/:id — Modifier un article
app.put("/articles/:id", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Article);
    const article = await repo.findOneBy({ id_article: req.params.id as any });
    if (!article) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    // Vérifier si l'article est lié à une box validée
    if (article.id_box) {
      const boxRepo = AppDataSource.getRepository(Box);
      const box = await boxRepo.findOneBy({ id_box: article.id_box });
      if (box && box.validated) {
        return res.status(403).json({
          error:
            "Modification interdite : cet article est lié à une box validée",
        });
      }
    }

    repo.merge(article, req.body);
    const updated = await repo.save(article);
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la modification", details: err });
  }
});

// ════════════════════════════════════════════
//  👥 SUBSCRIBERS (Users)
// ════════════════════════════════════════════

// POST /subscribers — Inscription
app.post("/subscribers", async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const childRepo = AppDataSource.getRepository(Usertochild);

    const { name, family_name, email, children } = req.body;

    // Créer le User
    const user = userRepo.create({
      name,
      family_name,
      email,
      role: "user" as any,
    });
    const savedUser = await userRepo.save(user);

    // Créer les liens Usertochild
    if (Array.isArray(children)) {
      for (const child of children) {
        const utc = childRepo.create({
          id_user: savedUser.id_user,
          age_range: child.age_range,
          preferences: child.preferences || [],
        });
        await childRepo.save(utc);
      }
    }

    res.status(201).json(savedUser);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de l'inscription", details: err });
  }
});

// GET /subscribers — (Admin) Liste de tous les abonnés
app.get("/subscribers", async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const childRepo = AppDataSource.getRepository(Usertochild);

    const users = await userRepo.find({ where: { role: "user" as any } });

    const result = await Promise.all(
      users.map(async (u) => {
        const children = await childRepo.find({
          where: { id_user: u.id_user },
        });
        return { ...u, children };
      }),
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des abonnés",
      details: err,
    });
  }
});

// GET /subscribers/:email — Profil par email
app.get("/subscribers/:email", async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const childRepo = AppDataSource.getRepository(Usertochild);

    const user = await userRepo.findOneBy({
      email: req.params.email as string,
    });
    if (!user) {
      return res.status(404).json({ error: "Abonné non trouvé" });
    }

    const children = await childRepo.find({ where: { id_user: user.id_user } });
    res.json({ ...user, children });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération", details: err });
  }
});

// PUT /subscribers/:id_user — Modifier les préférences
app.put("/subscribers/:id_user", async (req: Request, res: Response) => {
  try {
    const childRepo = AppDataSource.getRepository(Usertochild);
    const children = await childRepo.find({
      where: { id_user: req.params.id_user as any },
    });

    if (children.length === 0) {
      return res
        .status(404)
        .json({ error: "Aucun enfant trouvé pour cet abonné" });
    }

    // Mettre à jour les enfants (on attend un tableau)
    if (Array.isArray(req.body.children)) {
      for (
        let i = 0;
        i < req.body.children.length && i < children.length;
        i++
      ) {
        const update = req.body.children[i];
        if (update.age_range) children[i].age_range = update.age_range;
        if (update.preferences) children[i].preferences = update.preferences;
        await childRepo.save(children[i]);
      }
    }

    res.json({ message: "Préférences mises à jour", children });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour", details: err });
  }
});

// ════════════════════════════════════════════
//  🎁 CAMPAIGNS & BOXES
// ════════════════════════════════════════════

// POST /campaigns — Créer une campagne
app.post("/campaigns", async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Campaign);
    const campaign = repo.create({
      ...req.body,
      date: new Date(),
      status: "en cours" as any,
    });
    const saved = await repo.save(campaign);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la création de la campagne",
      details: err,
    });
  }
});

// POST /campaigns/:id/optimize — Lancer l'optimisation
app.post("/campaigns/:id/optimize", async (req: Request, res: Response) => {
  try {
    const campRepo = AppDataSource.getRepository(Campaign);
    const campaign = await campRepo.findOneBy({
      id_camp: req.params.id as any,
    });
    if (!campaign) {
      return res.status(404).json({ error: "Campagne non trouvée" });
    }

    // TODO: Appeler le service d'optimisation externe
    // Pour l'instant, on retourne un placeholder
    res.json({
      message: "Optimisation lancée",
      campaign_id: campaign.id_camp,
      status: "en cours",
    });
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors du lancement de l'optimisation",
      details: err,
    });
  }
});

// GET /campaigns/:id/boxes — Visualiser les box d'une campagne
app.get("/campaigns/:id/boxes", async (req: Request, res: Response) => {
  try {
    const boxRepo = AppDataSource.getRepository(Box);
    const articleRepo = AppDataSource.getRepository(Article);

    const boxes = await boxRepo.find({
      where: { id_camp: req.params.id as any },
    });

    const result = await Promise.all(
      boxes.map(async (box) => {
        const articles = await articleRepo.find({
          where: { id_box: box.id_box },
        });
        return { ...box, articles };
      }),
    );

    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des box", details: err });
  }
});

// PATCH /boxes/:id/validate — Valider une box
app.patch("/boxes/:id/validate", async (req: Request, res: Response) => {
  try {
    const boxRepo = AppDataSource.getRepository(Box);
    const box = await boxRepo.findOneBy({ id_box: req.params.id as any });
    if (!box) {
      return res.status(404).json({ error: "Box non trouvée" });
    }

    box.validated = true;
    await boxRepo.save(box);

    res.json({ message: "Box validée", box });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la validation", details: err });
  }
});

// GET /my-box?email=... — Box validée pour un abonné
app.get("/my-box", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: "Paramètre email requis" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });
    if (!user) {
      return res.status(404).json({ error: "Abonné non trouvé" });
    }

    const boxRepo = AppDataSource.getRepository(Box);
    const articleRepo = AppDataSource.getRepository(Article);
    const boxes = await boxRepo.find({
      where: { id_user: user.id_user, validated: true },
    });

    const result = await Promise.all(
      boxes.map(async (box) => {
        const articles = await articleRepo.find({
          where: { id_box: box.id_box },
        });
        return { ...box, articles };
      }),
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération de la box",
      details: err,
    });
  }
});

// ════════════════════════════════════════════
//  📊 HISTORIQUE & STATISTIQUES
// ════════════════════════════════════════════

// GET /history/global — Vue d'ensemble des campagnes terminées
app.get("/history/global", async (req: Request, res: Response) => {
  try {
    const campRepo = AppDataSource.getRepository(Campaign);
    const campaigns = await campRepo.find({
      where: { status: "terminé" as any },
      order: { date: "DESC" },
    });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération de l'historique",
      details: err,
    });
  }
});

// GET /history/subscriber/:id — Historique d'un abonné
app.get("/history/subscriber/:id", async (req: Request, res: Response) => {
  try {
    const boxRepo = AppDataSource.getRepository(Box);
    const articleRepo = AppDataSource.getRepository(Article);

    const boxes = await boxRepo.find({
      where: { id_user: req.params.id as any, validated: true },
    });

    const result = await Promise.all(
      boxes.map(async (box) => {
        const articles = await articleRepo.find({
          where: { id_box: box.id_box },
        });
        return { ...box, articles };
      }),
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération de l'historique",
      details: err,
    });
  }
});

// GET /dashboard/stats — Statistiques pour le tableau de bord
app.get("/dashboard/stats", async (req: Request, res: Response) => {
  try {
    const articleRepo = AppDataSource.getRepository(Article);
    const userRepo = AppDataSource.getRepository(User);
    const boxRepo = AppDataSource.getRepository(Box);
    const campRepo = AppDataSource.getRepository(Campaign);

    const [totalArticles, totalSubscribers, totalBoxes, totalCampaigns] =
      await Promise.all([
        articleRepo.count(),
        userRepo.count({ where: { role: "user" as any } }),
        boxRepo.count(),
        campRepo.count(),
      ]);

    // Articles disponibles (non liés à une box)
    const availableArticles = await articleRepo
      .createQueryBuilder("a")
      .where("a.id_box IS NULL")
      .getCount();

    // Box validées
    const validatedBoxes = await boxRepo.count({ where: { validated: true } });

    // Répartition par catégorie
    const categoryStats = await articleRepo
      .createQueryBuilder("a")
      .select("a.category", "category")
      .addSelect("COUNT(*)", "count")
      .groupBy("a.category")
      .getRawMany();

    // Répartition par tranche d'âge
    const ageStats = await articleRepo
      .createQueryBuilder("a")
      .select("a.age_range", "age_range")
      .addSelect("COUNT(*)", "count")
      .groupBy("a.age_range")
      .getRawMany();

    res.json({
      totalArticles,
      availableArticles,
      totalSubscribers,
      totalBoxes,
      validatedBoxes,
      totalCampaigns,
      categoryStats,
      ageStats,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors du calcul des statistiques", details: err });
  }
});

// GET /boxes/:id/print — Données pour le bon de préparation
app.get("/boxes/:id/print", async (req: Request, res: Response) => {
  try {
    const boxRepo = AppDataSource.getRepository(Box);
    const articleRepo = AppDataSource.getRepository(Article);
    const userRepo = AppDataSource.getRepository(User);

    const box = await boxRepo.findOneBy({ id_box: req.params.id as any });
    if (!box) {
      return res.status(404).json({ error: "Box non trouvée" });
    }

    const user = await userRepo.findOneBy({ id_user: box.id_user });
    const articles = await articleRepo.find({ where: { id_box: box.id_box } });

    res.json({
      box: {
        id: box.id_box,
        score: box.score_box,
        total_weight: box.total_weight,
        total_price: box.total_price,
        validated: box.validated,
      },
      subscriber: user
        ? { name: user.name, family_name: user.family_name, email: user.email }
        : null,
      articles: articles.map((a) => ({
        description: a.description,
        category: a.category,
        age_range: a.age_range,
        state: a.state,
        price: a.price,
        weight: a.weight,
      })),
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la génération du bon", details: err });
  }
});

// ════════════════════════════════════════════
//  🚀 DÉMARRAGE
// ════════════════════════════════════════════
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Base de données connectée");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base de données :", err);
  });

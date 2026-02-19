import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import { Article } from "./entities/Article";
import { User } from "./entities/User";
import { Usertochild } from "./entities/UserToChild";
import { Box } from "./entities/Box";
import { Campaign } from "./entities/Campaign";
import { ArticleController } from "./controllers/articleController";
import { AppDataSource } from "./data-source";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ════════════════════════════════════════════
//  📦 ARTICLES
// ════════════════════════════════════════════

// Quand on appelle GET /articles, Express exécute la méthode getAll du contrôleur
app.get("/articles", ArticleController.getAll);

// Quand on appelle GET /articles/:id (ex: /articles/123), il exécute getOne
app.get("/articles/:id", ArticleController.getOne);

// Quand on fait un POST avec un JSON, il exécute create
app.post("/articles", ArticleController.create);

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

app.put("/articles/:id", ArticleController.update);

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

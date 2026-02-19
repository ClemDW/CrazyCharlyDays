import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../.env") });

import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import { Article } from "./entities/Article";
import { ArticleController } from "./controllers/articleController";
import { UserController } from "./controllers/userController";
import { AppDataSource } from "./data-source";
import { UserToChildController } from "./controllers/userToChildController";
import { BoxController } from "./controllers/boxController";
import { CampaignController } from "./controllers/campaignController";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.BACKEND_PORT;


app.get("/articles", ArticleController.getAll);
app.get("/articles/:id", ArticleController.getOne);
app.post("/articles", ArticleController.create);
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



app.post("/users", UserController.create);
app.get("/users", UserController.getAll);
app.get("/users/:id", UserController.getOne);
app.put("/users/:id", UserController.update);
app.delete("/users/:id", UserController.delete);



app.post("/usertochild", UserToChildController.create);
app.get("/usertochild/:id", UserToChildController.getOne);
app.put("/usertochild/:id", UserToChildController.update);



app.post("/box", BoxController.create);
app.get("/box", BoxController.getAll);
app.get("/box/:id", BoxController.getOne);
app.put("/box/:id", BoxController.update);



app.post("/campaign", CampaignController.create);
app.get("/campaign", CampaignController.getAll);
app.get("/campaign/:id", CampaignController.getOne);
app.put("/campaign/:id", CampaignController.update);


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

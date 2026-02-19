import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../../../.env") });

import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import { Article } from "./entities/Article";
import { ArticleController } from "./controllers/articleController";
import { UserController } from "./controllers/userController";
import { OptimizationController } from "./controllers/optimizationController";
import { AppDataSource } from "./data-source";
import { UserToChildController } from "./controllers/userToChildController";
import { BoxController } from "./controllers/boxController";
import { CampaignController } from "./controllers/campaignController";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increase limit for Base64 images

const PORT = process.env.PORT || process.env.BACKEND_PORT || 3000;

// Serve uploaded images (Base64 saved as files) as static files
app.use("/images", express.static(path.join(__dirname, "../images")));

/**
 * Endpoint pour lancer l'optimisation.
 * Utilise les données existantes en base (dernière campagne, tous les articles).
 * Retourne le fichier CSV résultant.
 */
app.get("/optimize", OptimizationController.optimize);

// ════════════════════════════════════════════
//  📦 ARTICLES
// ════════════════════════════════════════════

app.get("/articles", ArticleController.getAll);
app.get("/articles/:id", ArticleController.getOne);
app.post("/articles", ArticleController.create);
app.put("/articles/:id", ArticleController.update);

app.post("/users", UserController.create);
app.get("/users", UserController.getAll);
app.get("/users/:id", UserController.getOne);
app.put("/users/:id", UserController.update);
app.delete("/users/:id", UserController.delete);

app.post("/usertochild", UserToChildController.create);
app.get("/usertochild/:id", UserToChildController.getOne);
app.put("/usertochild/:id", UserToChildController.update);
app.delete("/usertochild/:id", UserToChildController.deleteByUser);

app.post("/box", BoxController.create);
app.get("/box", BoxController.getAll);
app.get("/box/detailed", BoxController.getDetailed);
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

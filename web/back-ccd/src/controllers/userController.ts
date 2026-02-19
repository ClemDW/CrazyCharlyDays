import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export const UserController = {
    /**
     * Création d'un nouvel utilisateur
     */
    async create(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(User);

            // Vérification optionnelle : l'email existe-t-il déjà ?
            if (req.body.email) {
                const existingUser = await repo.findOneBy({ email: req.body.email });
                if (existingUser) {
                    return res.status(400).json({ message: "Cet email est déjà utilisé" });
                }
            }

            const newUser = repo.create(req.body);
            const savedUser = await repo.save(newUser);

            return res.status(201).json(savedUser);
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error);
            return res.status(500).json({
                message: "Impossible de créer l'utilisateur",
                details: error
            });
        }
    },

    /**
     * Récupération de tous les utilisateurs
     */
    async getAll(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(User);
            const users = await repo.find();

            return res.json(users);
        } catch (error) {
            console.error("Erreur lors de la récupération :", error);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },

    /**
     * Récupération d'un utilisateur par son ID (UUID)
     */
    async getOne(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(User);
            const user = await repo.findOneBy({ id_user: req.params.id as string });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },

    /**
     * Mise à jour d'un utilisateur
     */
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = AppDataSource.getRepository(User);

            const user = await repo.findOneBy({ id_user: id as string });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            // Fusion des données : écrase les propriétés de l'utilisateur par celles de req.body
            repo.merge(user, req.body);
            
            const updatedUser = await repo.save(user);
            return res.json(updatedUser);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            return res.status(500).json({ message: "Erreur lors de la modification", error });
        }
    },

    /**
     * Suppression d'un utilisateur
     */
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = AppDataSource.getRepository(User);

            const user = await repo.findOneBy({ id_user: id as string });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            await repo.remove(user);
            return res.json({ message: "Utilisateur supprimé avec succès" });
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }
};
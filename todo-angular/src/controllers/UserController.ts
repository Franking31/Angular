import { Request, Response } from "express";
import User from "../models/Users";

class UserController {
  // Créer un utilisateur
  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
      }

      const user = await User.create({ username, email, password });
      return res.status(201).json({ message: "Utilisateur créé", user });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error });
    }
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
    }
  }

  // Récupérer un utilisateur par ID
  async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error });
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      user.username = username || user.username;
      user.email = email || user.email;
      user.password = password || user.password;

      await user.save();
      return res.status(200).json({ message: "Utilisateur mis à jour", user });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error });
    }
  }

  // Supprimer un utilisateur
  async deleteUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      await user.destroy();
      return res.status(200).json({ message: "Utilisateur supprimé" });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error });
    }
  }
}

export default new UserController();

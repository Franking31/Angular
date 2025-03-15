import { Request, Response } from "express";
import Project from "../models/Project";
import User from "../models/Users";

class ProjectController {
  // Créer un projet
  async createProject(req: Request, res: Response): Promise<Response> {
    try {
      const { name, userId } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      const project = await Project.create({ name, userId });
      return res.status(201).json({ message: "Projet créé", project });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la création du projet", error });
    }
  }

  // Récupérer tous les projets
  async getAllProjects(req: Request, res: Response): Promise<Response> {
    try {
      const projects = await Project.findAll();
      return res.status(200).json(projects);
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la récupération des projets", error });
    }
  }

  // Récupérer un projet par ID
  async getProjectById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }
      return res.status(200).json(project);
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la récupération du projet", error });
    }
  }

  // Mettre à jour un projet
  async updateProject(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, userId } = req.body;

    try {
      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }

      project.name = name || project.name;
      project.userId = userId || project.userId;

      await project.save();
      return res.status(200).json({ message: "Projet mis à jour", project });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour du projet", error });
    }
  }

  // Supprimer un projet
  async deleteProject(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }

      await project.destroy();
      return res.status(200).json({ message: "Projet supprimé" });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la suppression du projet", error });
    }
  }
}

export default new ProjectController();

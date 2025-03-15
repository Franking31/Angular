import { Request, Response } from "express";
import { check, validationResult } from "express-validator"; // Ajout de express-validator
import Project from "../models/Project";
import User from "../models/Users"; // Correction du nom du modèle (Users → User)

class ProjectController {
  // Middleware de validation pour createProject
  private validateCreateProject = [
    check("name")
      .notEmpty()
      .withMessage("Le nom du projet est requis")
      .isString()
      .withMessage("Le nom doit être une chaîne de caractères"),
    check("userId")
      .notEmpty()
      .withMessage("L'ID de l'utilisateur est requis")
      .isInt()
      .withMessage("L'ID de l'utilisateur doit être un entier")
  ];

  // Créer un projet
  async createProject(req: Request, res: Response): Promise<Response> {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

  // Middleware de validation pour updateProject
  private validateUpdateProject = [
    check("name")
      .optional()
      .isString()
      .withMessage("Le nom doit être une chaîne de caractères"),
    check("userId")
      .optional()
      .isInt()
      .withMessage("L'ID de l'utilisateur doit être un entier")
  ];

  // Mettre à jour un projet
  async updateProject(req: Request, res: Response): Promise<Response> {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

  // Récupérer tous les projets (pas de validation nécessaire ici)
  async getAllProjects(req: Request, res: Response): Promise<Response> {
    try {
      const projects = await Project.findAll();
      return res.status(200).json(projects);
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la récupération des projets", error });
    }
  }

  // Récupérer un projet par ID (pas de validation nécessaire ici)
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

  // Supprimer un projet (pas de validation nécessaire ici)
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

export default new ProjectController
();
import { Request, Response } from "express";
import { check, validationResult } from "express-validator"; // Ajout de express-validator
import Task from "../models/tasks";
import { TaskStatus } from "../models/tasks";
import Project from "../models/Project"; // Ajout pour vérifier l'existence du projet

class TaskController {
  // Middleware de validation pour createTask
  private validateCreateTask = [
    check("title")
      .notEmpty()
      .withMessage("Le titre de la tâche est requis")
      .isString()
      .withMessage("Le titre doit être une chaîne de caractères"),
    check("description")
      .optional()
      .isString()
      .withMessage("La description doit être une chaîne de caractères"),
    check("plannedEndDate")
      .optional()
      .isISO8601()
      .withMessage("La date de fin planifiée doit être une date valide au format ISO 8601"),
    check("projectId")
      .notEmpty()
      .withMessage("L'ID du projet est requis")
      .isInt()
      .withMessage("L'ID du projet doit être un entier")
  ];

  /**
   * Créer une nouvelle tâche
   * @param req 
   * @param res 
   * @returns 
   */
  async createTask(req: Request, res: Response): Promise<Response> {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, plannedEndDate, projectId } = req.body;

      // Vérifier si l'image est bien présente dans la requête
      if (!req.file) {
        return res.status(400).json({ message: "L'image est obligatoire" });
      }

      // Vérifier si le projet existe
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      // Créer la tâche
      const task = await Task.create({
        title,
        description,
        completed: false,
        imageUrl,
        projectId,
        status: TaskStatus.New,
        startDate: new Date(),
        endDate: plannedEndDate ? new Date(plannedEndDate) : null,
      });

      return res.status(201).json({ message: "Tâche créée", task });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la création de la tâche", error });
    }
  }

  /**
   * Obtenir une tâche par son ID
   * @param req 
   * @param res 
   * @returns 
   */
  async getTaskById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const task = await Task.findByPk(id);

      if (!task) {
        return res.status(404).json({ message: `Tâche avec l'ID ${id} non trouvée` });
      }

      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la récupération de la tâche", error });
    }
  }

  // Middleware de validation pour updateTask
  private validateUpdateTask = [
    check("title")
      .optional()
      .isString()
      .withMessage("Le titre doit être une chaîne de caractères"),
    check("description")
      .optional()
      .isString()
      .withMessage("La description doit être une chaîne de caractères"),
    check("status")
      .optional()
      .isIn(Object.values(TaskStatus))
      .withMessage(`Le statut doit être l'une des valeurs suivantes : ${Object.values(TaskStatus).join(", ")}`),
    check("plannedEndDate")
      .optional()
      .isISO8601()
      .withMessage("La date de fin planifiée doit être une date valide au format ISO 8601")
  ];

  /**
   * Mettre à jour une tâche
   * @param req 
   * @param res 
   * @returns 
   */
  async updateTask(req: Request, res: Response): Promise<Response> {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { title, description, status, plannedEndDate } = req.body;

      const task = await Task.findByPk(id);

      if (!task) {
        return res.status(404).json({ message: `Tâche avec l'ID ${id} non trouvée` });
      }

      // Mise à jour des propriétés de la tâche
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.endDate = plannedEndDate ? new Date(plannedEndDate) : task.endDate;

      await task.save();

      return res.status(200).json({ message: "Tâche mise à jour", task });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche", error });
    }
  }

  /**
   * Démarrer une tâche (changer son statut en "InProgress")
   * @param req 
   * @param res 
   * @returns 
   */
  async startTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);

      if (!task) {
        return res.status(404).json({ message: `Tâche avec l'ID ${id} non trouvée` });
      }

      if (task.status === TaskStatus.New) {
        task.status = TaskStatus.IN_PROGRESS;
        task.startDate = new Date();
        await task.save();
        return res.status(200).json({ message: "Tâche démarrée", task });
      }

      return res.status(400).json({ message: `Tâche ne peut pas être démarrée, statut actuel: ${task.status}` });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors du démarrage de la tâche", error });
    }
  }

  /**
   * Compléter une tâche (changer son statut en "Completed")
   * @param req 
   * @param res 
   * @returns 
   */
  async completeTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);

      if (!task) {
        return res.status(404).json({ message: `Tâche avec l'ID ${id} non trouvée` });
      }

      if (task.status === TaskStatus.IN_PROGRESS) {
        task.status = TaskStatus.COMPLETED;
        task.endDate = new Date();
        await task.save();
        return res.status(200).json({ message: "Tâche complétée", task });
      }

      return res.status(400).json({ message: `Tâche ne peut pas être complétée, statut actuel: ${task.status}` });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la complétion de la tâche", error });
    }
  }

  /**
   * Supprimer une tâche
   * @param req 
   * @param res 
   * @returns 
   */
  async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const task = await Task.findByPk(id);

      if (!task) {
        return res.status(404).json({ message: `Tâche avec l'ID ${id} non trouvée` });
      }

      await task.destroy();

      return res.status(200).json({ message: "Tâche supprimée" });
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la suppression de la tâche", error });
    }
  }
}

export default new TaskController
();
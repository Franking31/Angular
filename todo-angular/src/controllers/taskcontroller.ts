import { Request, Response } from "express";
import Task from "../models/tasks"; // Assurez-vous que le modèle Task est bien importé
import { TaskStatus } from "../models/tasks"; // Importation de l'énumération TaskStatus

class TaskController {
  /**
   * Créer une nouvelle tâche
   * @param req 
   * @param res 
   * @returns 
   */
  async createTask(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, plannedEndDate, projectId } = req.body;

      // Vérifier si l'image est bien présente dans la requête
      if (!req.file) {
        return res.status(400).json({ message: "L'image est obligatoire" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      // Créer la tâche
      const task = await Task.create({
        title,
        description,
        completed: false,
        imageUrl,
        projectId,
        status: TaskStatus.New, // Utilisation de l'énumération TaskStatus
        startDate: new Date(),
        endDate: plannedEndDate,
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

  /**
   * Mettre à jour une tâche
   * @param req 
   * @param res 
   * @returns 
   */
  async updateTask(req: Request, res: Response): Promise<Response> {
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
      task.status = status || task.status; // Utilisation de TaskStatus si nécessaire
      task.endDate = plannedEndDate || task.endDate;

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

      if (task.status === TaskStatus.New) { // Utilisation de TaskStatus
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

      if (task.status === TaskStatus.IN_PROGRESS) { // Utilisation de TaskStatus
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

export default new TaskController();

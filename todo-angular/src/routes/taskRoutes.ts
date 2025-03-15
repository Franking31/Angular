import express from 'express';
import multer from 'multer';
import { check, validationResult } from 'express-validator'; // Ajout de express-validator
import Task from '../models/tasks';
import { TaskStatus } from '../models/tasks'; // Importation de l'énumération
import path from 'path';
import Project from '../models/Project'; // Pour vérifier l'existence du projet
import taskController from '../controllers/taskcontroller'; // Importation du TaskController

const router = express.Router();

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware de validation pour la création d'une tâche
const validateTaskCreation = [
  check('title')
    .notEmpty()
    .withMessage('Le titre de la tâche est requis')
    .isString()
    .withMessage('Le titre doit être une chaîne de caractères'),
  check('description')
    .optional()
    .isString()
    .withMessage('La description doit être une chaîne de caractères'),
  check('projectId')
    .notEmpty()
    .withMessage('L\'ID du projet est requis')
    .isInt()
    .withMessage('L\'ID du projet doit être un entier'),
  check('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(`Le statut doit être l'une des valeurs suivantes : ${Object.values(TaskStatus).join(', ')}`),
  check('plannedEndDate')
    .optional()
    .isISO8601()
    .withMessage('La date de fin planifiée doit être une date valide au format ISO 8601'),
];

// Middleware de validation pour la mise à jour d'une tâche
const validateTaskUpdate = [
  check('title')
    .optional()
    .isString()
    .withMessage('Le titre doit être une chaîne de caractères'),
  check('description')
    .optional()
    .isString()
    .withMessage('La description doit être une chaîne de caractères'),
  check('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(`Le statut doit être l'une des valeurs suivantes : ${Object.values(TaskStatus).join(', ')}`),
  check('plannedEndDate')
    .optional()
    .isISO8601()
    .withMessage('La date de fin planifiée doit être une date valide au format ISO 8601'),
];

// Route pour créer une tâche
router.post(
  "/",
  upload.single("image"),
  validateTaskCreation,
  async (req: express.Request, res: express.Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { title, description, projectId, status, plannedEndDate } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      if (!req.file) {
        res.status(400).json({ message: "L'image est obligatoire" });
        return;
      }

      const project = await Project.findByPk(projectId);
      if (!project) {
        res.status(404).json({ message: "Projet non trouvé" });
        return;
      }

      const newTask = await Task.create({
        title,
        description,
        projectId,
        imageUrl,
        status: status || TaskStatus.New,
        startDate: new Date(),
        endDate: plannedEndDate ? new Date(plannedEndDate) : null,
      });

      res.status(201).json({ message: "Tâche créée", task: newTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la création de la tâche", error });
    }
  }
);

// Route pour obtenir une tâche par ID
router.get(
  "/:id",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const task = await taskController.getTaskById(req, res as any); // Réutilisation de la logique de TaskController
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la récupération de la tâche", error });
    }
  }
);

// Route pour mettre à jour une tâche
router.put(
  "/:id",
  validateTaskUpdate,
  async (req: express.Request, res: express.Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const task = await taskController.updateTask(req, res as any); // Réutilisation de la logique de TaskController
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour de la tâche", error });
    }
  }
);

// Route pour démarrer une tâche (changer le statut en "IN_PROGRESS")
router.patch(
  "/:id/start",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const task = await taskController.startTask(req, res as any); // Réutilisation de la logique de TaskController
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors du démarrage de la tâche", error });
    }
  }
);

// Route pour compléter une tâche (changer le statut en "COMPLETED")
router.patch(
  "/:id/complete",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const task = await taskController.completeTask(req, res as any); // Réutilisation de la logique de TaskController
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la complétion de la tâche", error });
    }
  }
);

// Route pour supprimer une tâche
router.delete(
  "/:id",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const task = await taskController.deleteTask(req, res as any); // Réutilisation de la logique de TaskController
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la tâche", error });
    }
  }
);

export default router;
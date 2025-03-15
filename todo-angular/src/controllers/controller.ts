import { Request, Response } from "express";
import User from "../models/Users";
import Project from "../models/Project";
import Task from "../models/tasks";
import multer from "multer";
import path from "path";

// Configuration de Multer pour l'upload des images
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Seuls les fichiers images sont autorisés !"));
        }
    }
});

// Création d'un utilisateur
export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
};

// Création d'un projet
export const createProject = async (req: Request, res: Response) => {
    try {
        const { name, userId } = req.body;
        const project = await Project.create({ name, userId });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création du projet" });
    }
};

// Création d'une tâche avec upload d'image
export const createTask = async (req: Request, res: Response) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            const { title, description, projectId } = req.body;
            const image = req.file ? req.file.filename : null;
            const task = await Task.create({ title, description, projectId, image });
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la création de la tâche" });
        }
    });
};

// Récupération des tâches d'un projet
export const getTasksByProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.findAll({ where: { projectId } });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
    }
};

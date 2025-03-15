import express from 'express';
import Project from '../models/Project';
import User from '../models/Users';

const Projectrouter = express.Router();

Projectrouter.post("/", async (req, res): Promise<void> => {
    const { name, userId } = req.body;

    if (!name || !userId) {
      res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
      return; // On termine la fonction ici
    }

    try {
      const newProject = await Project.create({ name, userId });
      res.status(201).json(newProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la création du projet." });
    }
  });
Projectrouter.get("/", async (req, res): Promise<void> => {
    try {
      const projects = await Project.findAll({ include: User });
      res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la récupération des projets." });
    }
  });
Projectrouter.get("/:id", async (req, res): Promise<void> => {
    const { id } = req.params;
  
    try {
      const project = await Project.findByPk(id, { include: User });
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: "Projet non trouvé." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la récupération du projet." });
    }
  });
Projectrouter.put("/:id", async (req, res): Promise<void> => {
    const { id } = req.params;
    const { name, userId } = req.body;
  
    if (!name || !userId) {
      res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
      return; // On termine la fonction ici
    }
  
    try {
      const project = await Project.findByPk(id);
      if (project) {
        project.name = name;
        project.userId = userId;
        await project.save();
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: "Projet non trouvé." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la modification du projet." });
    }
  });
Projectrouter.delete("/:id", async (req, res): Promise<void> => {
    const { id } = req.params;
  
    try {
      const project = await Project.findByPk(id);
      if (project) {
        await project.destroy();
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Projet non trouvé." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la suppression du projet." });
    }
  });
export default Projectrouter;
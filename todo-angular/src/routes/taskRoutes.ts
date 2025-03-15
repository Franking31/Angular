import  express from 'express';
import multer from 'multer';
import Task from '../models/tasks';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res): Promise<void> => {
    const { title, description, projectId, status, startDate, endDate } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
    if (!title || !projectId || !startDate || !endDate) {
      res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
      return; // On termine la fonction ici
    }
  
    try {
      const newTask = await Task.create({ 
        title, 
        description, 
        projectId, 
        imageUrl, 
        status, 
        startDate, 
        endDate 
      });
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la création de la tâche." });
    }
  });
  
export default router;
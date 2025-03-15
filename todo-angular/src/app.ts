import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

// Import des routes
import TaskRouter from './routes/taskRoutes';
import ProjectRouter from './routes/projectRoutes';
import UserRouter from './routes/userRoutes';

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors()); // Si tu veux permettre les requêtes cross-origin
app.use(bodyParser.json()); // Pour parser les requêtes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Pour parser les formulaires URL-encodés

// Routes
app.use('/api/tasks', TaskRouter);   // Route pour les tâches
app.use('/api/projects', ProjectRouter);  // Route pour les projets
app.use('/api/users', UserRouter);  // Route pour les utilisateurs

// Middleware pour servir les fichiers statiques (comme les images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route de base
app.get('/', (req, res) => {
  res.send('API fonctionnelle');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Page non trouvée' });
});

// Gestion des erreurs générales
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;


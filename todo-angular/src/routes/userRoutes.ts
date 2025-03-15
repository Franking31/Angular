import express, { Request, Response } from 'express';
import User from '../models/Users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserRouter = express.Router();

// Interface for request bodies
interface UserRegisterBody {
  username: string;
  email: string;
  password: string;
}

interface UserLoginBody {
  email: string;
  password: string;
}

UserRouter.post("/register", async (req: Request<{}, {}, UserRegisterBody>, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
    return;
  }

  try {
    const user = await User.create({ 
      username, 
      email, 
      password: bcrypt.hashSync(password, 10) 
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    res.status(500).json({ message: "Une erreur est survenue lors de la création de l'utilisateur." });
  }
});

UserRouter.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé." });
    }
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération de l'utilisateur." });
  }
});

UserRouter.put('/:id', async (req: Request<{ id: string }, {}, UserRegisterBody>, res: Response): Promise<void> => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur modification utilisateur:', error);
    res.status(500).json({ message: "Une erreur est survenue lors de la modification de l'utilisateur" });
  }
});

UserRouter.post('/login', async (req: Request<{}, {}, UserLoginBody>, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Mot de passe invalide" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username }, 
      'your_jwt_secret', // Consider moving this to an environment variable
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: "Connexion réussie", 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ message: "Une erreur est survenue lors de la connexion" });
  }
});

export default UserRouter;
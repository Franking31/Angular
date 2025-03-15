import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'todo_db2',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3307,
      dialect: 'mysql',
      dialectOptions: {
        connectTimeout: 60000 // Augmente le délai de connexion
      },
      logging: console.log, // Active les logs SQL pour voir ce qui se passe
    }
  );
  

export default sequelize;
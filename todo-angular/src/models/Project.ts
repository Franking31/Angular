import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./Users";

class Project extends Model {
  public id!: number;
  public name!: string;
  public userId!: number;
}

Project.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "projects" }
);

// Définition des relations
Project.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Project, { foreignKey: "userId" });

// Création de la table si elle n'existe pas
sequelize.sync({ alter: true }) // Utilise `force: true` pour supprimer et recréer la table
  .then(() => console.log("Table `projects` synchronisée avec la base de données."))
  .catch((err) => console.error("Erreur de synchronisation:", err));

export default Project;

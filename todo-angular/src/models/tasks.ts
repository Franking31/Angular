import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Project from "./Project";

export enum TaskStatus {
    New = "new",
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
}

class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public completed!: boolean;
  public imageUrl!: string;
  public projectId!: number;
  public startDate!: Date;
  public endDate!: Date;
  public status!: TaskStatus;
}

Task.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false }, // Image obligatoire
    projectId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("new", "pending", "in_progress", "completed"),
      defaultValue: "pending",
    },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: "tasks" }
);

// Définition des relations
Task.belongsTo(Project, { foreignKey: "projectId" });
Project.hasMany(Task, { foreignKey: "projectId" });

// Création de la table si elle n'existe pas
sequelize.sync({ alter: true })
  .then(() => console.log("Table `tasks` synchronisée avec la base de données."))
  .catch((err) => console.error("Erreur de synchronisation:", err));

export default Task;

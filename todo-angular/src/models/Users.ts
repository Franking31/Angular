import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true, // Active createdAt et updatedAt
  }
);

// Création de la table si elle n'existe pas
sequelize.sync({ alter: true })
  .then(() => console.log("Table `users` synchronisée avec la base de données."))
  .catch((err) => console.error("Erreur de synchronisation:", err));

export default User;

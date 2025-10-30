import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import User from "./User.js";

const History = sequelize.define("History", {
  action: { type: DataTypes.STRING, allowNull: false }, // e.g., "Connexion", "Création Produit"
  details: { type: DataTypes.TEXT }, // Détails optionnels
  ipAddress: { type: DataTypes.STRING },
  userAgent: { type: DataTypes.STRING }
});

History.belongsTo(User);

export default History;

import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import User from "./User.js";

const Category = sequelize.define("Category", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: false }
});

Category.belongsTo(User); // chaque catégorie appartient à un utilisateur

export default Category;

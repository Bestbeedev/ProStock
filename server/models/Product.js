import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import User from "./User.js";
import Category from "./Category.js";

const Product = sequelize.define("Product", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
  createdAtStock: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // entrée stock
  lastModifiedBy: { type: DataTypes.INTEGER }, // UserId
  lastModifiedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

Product.belongsTo(User);
Product.belongsTo(Category);

export default Product;

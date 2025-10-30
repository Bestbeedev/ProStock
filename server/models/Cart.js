import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import User from "./User.js";
import Product from "./Product.js";

const Cart = sequelize.define("Cart", {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

Cart.belongsTo(User);
Cart.belongsTo(Product);

export default Cart;

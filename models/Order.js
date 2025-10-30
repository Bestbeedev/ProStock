import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import User from "./User.js";
import Product from "./Product.js";

const Order = sequelize.define("Order", {
  status: { type: DataTypes.STRING, defaultValue: "en attente" }, // ex: "en attente", "payée", "annulée"
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  deliveryAddress: { type: DataTypes.STRING, allowNull: true },
  paymentMethod: { type: DataTypes.STRING, allowNull: true } // ex: "carte", "fictif"
});

// Relations
Order.belongsTo(User, { as: "buyer" });
Order.belongsToMany(Product, { through: "OrderProducts" });
Product.belongsToMany(Order, { through: "OrderProducts" });

export default Order;

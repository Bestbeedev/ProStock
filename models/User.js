import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const User = sequelize.define("User", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  profileImage: { type: DataTypes.STRING, allowNull: true },
  geoLocation: { type: DataTypes.STRING, allowNull: true }
});

export default User;

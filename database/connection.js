import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

// Récupérer le __dirname équivalent en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"), // chemin correct vers sqlite
  logging: false
});

export default sequelize;

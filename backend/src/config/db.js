import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Lidhja me MySQL përmes Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // mos e mbushë konzollën me SQL
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

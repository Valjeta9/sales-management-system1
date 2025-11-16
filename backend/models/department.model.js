import { DataTypes } from "sequelize";
import { sequelize } from "../src/config/db.js";

export const Department = sequelize.define(
  "Department",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    department_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "departments",
    timestamps: true, // shton createdAt dhe updatedAt
  }
);

import { DataTypes } from "sequelize";
import { sequelize } from "../src/config/db.js";

const InventoryLog = sequelize.define("InventoryLog", {
  log_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  changed_by: { type: DataTypes.INTEGER, allowNull: true },
  change_type: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  new_stock: { type: DataTypes.INTEGER, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default InventoryLog;


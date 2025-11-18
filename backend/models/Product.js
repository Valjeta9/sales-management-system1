import { DataTypes } from "sequelize";
import { sequelize } from "../src/config/db.js";

const Product = sequelize.define(
  "Product",
  {
    product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    category_id: { type: DataTypes.INTEGER },
    image: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

export default Product;

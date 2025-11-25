import Product from "./Product.js";
import User from "./users/userModel.js";
import InventoryLog from "./InventoryLog.js";

// =========================
// RELACIONET
// =========================

Product.hasMany(InventoryLog, {
  foreignKey: "product_id",
});

InventoryLog.belongsTo(Product, {
  foreignKey: "product_id",
});

User.hasMany(InventoryLog, {
  foreignKey: "changed_by",
});

InventoryLog.belongsTo(User, {
  foreignKey: "changed_by",
});

export { Product, User, InventoryLog };
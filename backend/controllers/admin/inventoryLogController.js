import InventoryLog from "../../models/InventoryLog.js";
import Product from "../../models/Product.js";
import User from "../../models/users/userModel.js";


export const getInventoryLogs = async (req, res) => {
  try {
    const logs = await InventoryLog.findAll({
      include: [
        { model: Product, attributes: ["name"] },
        { model: User, attributes: ["name"] },
      ],
      order: [["timestamp", "DESC"]],
    });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching logs" });
  }
};

export const getInventoryLog = async (req, res) => {
  try {
    const log = await InventoryLog.findByPk(req.params.id, {
      include: [
        { model: Product, attributes: ["name"] },
        { model: User, attributes: ["name"] },
      ],
    });

    if (!log) return res.status(404).json({ message: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: "Error fetching log" });
  }
};

export const createInventoryLog = async (req, res) => {
  try {
 
    const user = await User.findByPk(changed_by);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can change stock" });
    }

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newStock =
      change_type === "increase"
        ? product.stock + Number(amount)
        : product.stock - Number(amount);

    if (newStock < 0)
      return res.status(400).json({ message: "Stock cannot be negative" });

    await product.update({ stock: newStock });

    const log = await InventoryLog.create({
      product_id,
      changed_by: user.user_id,
      change_type,
      amount,
      new_stock: newStock,
    });

    const fullLog = await InventoryLog.findByPk(log.log_id, {
      include: [
        { model: Product, attributes: ["name"] },
        { model: User, attributes: ["name"] },
      ],
    });

    res.status(201).json(fullLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating log" });
  }
};

export const deleteInventoryLog = async (req, res) => {
  try {
    const deleted = await InventoryLog.destroy({
      where: { log_id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "Log not found" });

    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting log" });
  }
};

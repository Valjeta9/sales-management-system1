import express from "express";
import {
  getInventoryLogs,
  getInventoryLog,
  createInventoryLog,
  deleteInventoryLog,
} from "../../controllers/admin/inventoryLogController.js";

const router = express.Router();

router.get("/", getInventoryLogs);
router.get("/:id", getInventoryLog);
router.post("/", createInventoryLog);
router.delete("/:id", deleteInventoryLog);

export default router;

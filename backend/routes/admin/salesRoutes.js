import express from "express";
import { getSales } from "../../controllers/admin/salesController.js";

const router = express.Router();

router.get("/", getSales);

export default router;

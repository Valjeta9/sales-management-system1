// routes/analyticsRoutes.js
import express from "express";
import {
  getSalesByMonth,
  getRevenueByCategory,
  getTopCustomers,
  getBestSellingProducts,
} from "../../controllers/admin/analyticsController.js";

const router = express.Router();

router.get("/sales-by-month", getSalesByMonth);
router.get("/revenue-by-category", getRevenueByCategory);
router.get("/top-customers", getTopCustomers);
router.get("/best-products", getBestSellingProducts);

export default router;

// backend/controllers/admin/analyticsController.js
import { sequelize } from "../../src/config/db.js";

/**
 * Helper: lexon datat nga query string
 * startDate / endDate vijnë nga frontend (yyyy-mm-dd)
 */
function getDateRange(req) {
  const { startDate, endDate } = req.query;

  // default shumë “broad” nëse nuk dërgohen nga frontend
  const safeStart = startDate || "2000-01-01";
  const safeEnd = endDate || "2100-01-01";

  return { startDate: safeStart, endDate: safeEnd };
}

/* =====================================================
   1. SALES BY MONTH  (filtrim me datë + kategori)
   GET /api/analytics/sales-by-month?startDate=...&endDate=...&category_id=...
===================================================== */
export const getSalesByMonth = async (req, res) => {
  try {
    const category_id = req.query.category_id || null;
    const range = req.query.range || "12m";

    let dateFilter = "";
    
    if (range === "30d") {
      dateFilter = "AND o.order_date >= NOW() - INTERVAL 30 DAY";
    } else if (range === "90d") {
      dateFilter = "AND o.order_date >= NOW() - INTERVAL 90 DAY";
    } else if (range === "12m") {
      dateFilter = "AND o.order_date >= NOW() - INTERVAL 12 MONTH";
    }

    const categoryJoin = category_id
      ? "JOIN order_items oi ON oi.order_id = o.order_id JOIN products p ON p.product_id = oi.product_id"
      : "";

    const categoryFilter = category_id
      ? `AND p.category_id = ${category_id}`
      : "";

    const [rows] = await sequelize.query(`
      SELECT 
        YEAR(o.order_date) AS year,
        MONTH(o.order_date) AS month_num,
        SUM(o.total) AS revenue,
        COUNT(*) AS orders
      FROM orders o
      ${categoryJoin}
      WHERE o.status IN ('completed','shipped')
      ${dateFilter}
      ${categoryFilter}
      GROUP BY YEAR(o.order_date), MONTH(o.order_date)
      ORDER BY YEAR(o.order_date), MONTH(o.order_date)
    `);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const formatted = rows.map(r => ({
      month: monthNames[r.month_num - 1],
      revenue: r.revenue,
      orders: r.orders
    }));

    res.json(formatted);

  } catch (error) {
    console.error("Error in getSalesByMonth:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* =====================================================
   2. REVENUE BY CATEGORY  (filtrim me datë)
   GET /api/analytics/revenue-by-category?startDate=...&endDate=...
===================================================== */
export const getRevenueByCategory = async (req, res) => {
  try {
    const { startDate, endDate } = getDateRange(req);

    const [rows] = await sequelize.query(
      `
      SELECT 
        c.category_id,
        c.name AS category,
        COALESCE(SUM(oi.subtotal), 0) AS revenue
      FROM categories c
      LEFT JOIN products p 
        ON p.category_id = c.category_id
      LEFT JOIN order_items oi 
        ON oi.product_id = p.product_id
      LEFT JOIN orders o 
        ON o.order_id = oi.order_id
       AND o.status IN ('completed','shipped')
       AND o.order_date BETWEEN :startDate AND :endDate
      GROUP BY c.category_id, c.name
      ORDER BY revenue DESC
    `,
      { replacements: { startDate, endDate } }
    );

    res.json(rows);
  } catch (error) {
    console.error("Error in getRevenueByCategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* =====================================================
   3. TOP CUSTOMERS  (filtrim me datë + kategori)
   GET /api/analytics/top-customers?startDate=...&endDate=...&category_id=...
===================================================== */
export const getTopCustomers = async (req, res) => {
  try {
    const { startDate, endDate } = getDateRange(req);
    const categoryId = req.query.category_id
      ? Number(req.query.category_id)
      : null;

    const [rows] = await sequelize.query(
      `
      SELECT 
        u.user_id,
        u.name,
        SUM(o.total) AS total_spent
      FROM orders o
      JOIN users u ON u.user_id = o.consumer_id
      LEFT JOIN order_items oi ON oi.order_id = o.order_id
      LEFT JOIN products p     ON p.product_id = oi.product_id
      WHERE 
        o.status IN ('completed','shipped')
        AND o.order_date BETWEEN :startDate AND :endDate
        AND (:categoryId IS NULL OR p.category_id = :categoryId)
      GROUP BY u.user_id, u.name
      ORDER BY total_spent DESC
      LIMIT 5
    `,
      { replacements: { startDate, endDate, categoryId } }
    );

    res.json(rows);
  } catch (error) {
    console.error("Error in getTopCustomers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   4. BEST SELLING PRODUCTS (filtrim me datë + kategori)
   GET /api/analytics/best-products?startDate=...&endDate=...&category_id=...
===================================================== */
export const getBestSellingProducts = async (req, res) => {
  try {
    const { startDate, endDate } = getDateRange(req);
    const categoryId = req.query.category_id
      ? Number(req.query.category_id)
      : null;

    const [rows] = await sequelize.query(
      `
      SELECT 
        p.product_id,
        p.name,
        SUM(oi.quantity) AS total_sold
      FROM order_items oi
      JOIN orders o   ON o.order_id = oi.order_id
      JOIN products p ON p.product_id = oi.product_id
      WHERE 
        o.status IN ('completed','shipped')
        AND o.order_date BETWEEN :startDate AND :endDate
        AND (:categoryId IS NULL OR p.category_id = :categoryId)
      GROUP BY p.product_id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `,
      { replacements: { startDate, endDate, categoryId } }
    );

    res.json(rows);
  } catch (error) {
    console.error("Error in getBestSellingProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

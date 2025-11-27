import { sequelize } from "../../src/config/db.js";
import { QueryTypes } from "sequelize";

export const getSales = async (req, res) => {
  try {
    const { startDate, endDate, status, payment_method } = req.query;

    let query = `
      SELECT 
        o.order_id,
        o.total,
        o.status,
        o.payment_method,
        o.order_date,
        u.name AS customer
      FROM orders o
      LEFT JOIN users u ON o.consumer_id = u.user_id
      WHERE 1=1
    `;

    const params = [];

    if (startDate) {
      query += " AND DATE(o.order_date) >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND DATE(o.order_date) <= ?";
      params.push(endDate);
    }

    if (status && status !== "all") {
      query += " AND o.status = ?";
      params.push(status);
    }

    if (payment_method && payment_method !== "all") {
      query += " AND o.payment_method = ?";
      params.push(payment_method);
    }

    query += " ORDER BY o.order_date ASC";

    const rows = await sequelize.query(query, {
      replacements: params,
      type: QueryTypes.SELECT
    });

    res.json(rows);
  } catch (error) {
    console.error("Error in getSales:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

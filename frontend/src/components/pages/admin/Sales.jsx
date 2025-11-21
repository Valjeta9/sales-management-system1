import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Sales() {
  const [sales, setSales] = useState([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "all",
    payment_method: "all",
  });

  // -------------------------------
  // FETCH SALES  (me useCallback)
  // -------------------------------
  const fetchSales = useCallback(async () => {
    try {
      const { startDate, endDate, status, payment_method } = filters;

      const res = await axios.get("http://localhost:5000/api/sales", {
        params: {
          startDate,
          endDate,
          status,
          payment_method,
        },
      });

      setSales(res.data);
    } catch (error) {
      console.log("Error fetching sales:", error);
    }
  }, [filters]);

  // Run ONCE on page load + when filters change
  useEffect(() => {
  setTimeout(() => {
    fetchSales();
  }, 0);
}, [fetchSales]);


  return (
    <div className="container-fluid text-white">
      <h1 className="text-success mb-4">Sales</h1>

      {/* -----------------------------
          FILTER BAR
      ----------------------------- */}
      <div className="row mb-4">

        {/* Date range */}
        <div className="col-md-4">
          <label>Date Range</label>
          <input
            type="date"
            className="form-control mb-2"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />

          <input
            type="date"
            className="form-control"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>

        {/* Status */}
        <div className="col-md-4">
          <label>Status</label>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="col-md-4">
          <label>Payment Method</label>
          <select
            className="form-select"
            value={filters.payment_method}
            onChange={(e) =>
              setFilters({ ...filters, payment_method: e.target.value })
            }
          >
            <option value="all">All</option>
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
            <option value="cash-on-delivery">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* FILTER BUTTON */}
      <button className="btn btn-success mb-3" onClick={fetchSales}>
        Filter
      </button>

      {/* -----------------------------
          SALES TABLE
      ----------------------------- */}
      <table className="table table-dark table-striped text-white">
        <thead>
          <tr>
            <th>Date</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment Method</th>
          </tr>
        </thead>

        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No sales found.
              </td>
            </tr>
          ) : (
            sales.map((s) => (
              <tr key={s.order_id}>
                <td>{new Date(s.order_date).toLocaleDateString()}</td>
                <td>{s.order_id}</td>
                <td>{s.consumer?.name || "Unknown"}</td>
                <td>${s.total}</td>

                <td>
                  <span
                    className={`badge ${
                      s.status === "completed"
                        ? "bg-success"
                        : s.status === "pending"
                        ? "bg-warning"
                        : s.status === "shipped"
                        ? "bg-info"
                        : "bg-danger"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>

                <td>{s.payment_method}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
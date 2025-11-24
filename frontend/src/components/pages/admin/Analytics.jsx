import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // category_id ose ""
  const [dateRange, setDateRange] = useState("30d"); // "30d", "90d", "12m"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------------
  // FETCH ANALYTICS (range + category)
  // ---------------------------------------------------
  const fetchAnalytics = async (category_id = "", range = "30d") => {
    try {
      setLoading(true);
      setError("");

      const categoryQuery = category_id ? `&category_id=${category_id}` : "";

      const [salesRes, catRes, custRes, prodRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/analytics/sales-by-month?range=${range}${categoryQuery}`
        ),
        axios.get(
          `http://localhost:5000/api/analytics/revenue-by-category?range=${range}${categoryQuery}`
        ),
        axios.get(
          `http://localhost:5000/api/analytics/top-customers?range=${range}${categoryQuery}`
        ),
        axios.get(
          `http://localhost:5000/api/analytics/best-products?range=${range}${categoryQuery}`
        ),
      ]);

      setSalesByMonth(salesRes.data || []);
      setRevenueByCategory(catRes.data || []);
      setTopCustomers(custRes.data || []);
      setBestProducts(prodRes.data || []);
    } catch (err) {
      console.error("Error fetching analytics", err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  // Load fillestare: 30 ditët e fundit, pa kategori
  useEffect(() => {
    fetchAnalytics("", "30d");
  }, []);

  // ---------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------
  const handleCategoryChange = (e) => {
    const id = e.target.value; // "" ose category_id
    setSelectedCategory(id);
    fetchAnalytics(id, dateRange);
  };

  const handleDateRangeChange = (e) => {
    const range = e.target.value;
    setDateRange(range);
    fetchAnalytics(selectedCategory, range);
  };

  // ---------------------------------------------------
  // EXPORT – CSV
  // ---------------------------------------------------
  const handleExportCSV = () => {
    let csv = "Section,Label,Value\n";

    // Sales by Month
    salesByMonth.forEach((row) => {
      csv += `Sales by Month,${row.month} - Orders,${row.orders}\n`;
      csv += `Sales by Month,${row.month} - Revenue,${row.revenue}\n`;
    });

    // Revenue by Category
    revenueByCategory.forEach((row) => {
      csv += `Revenue by Category,${row.category},${row.revenue}\n`;
    });

    // Top Customers
    topCustomers.forEach((row) => {
      csv += `Top Customers,${row.name},${row.total_spent}\n`;
    });

    // Best Products
    bestProducts.forEach((row) => {
      csv += `Best-Selling Products,${row.name},${row.total_sold}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------------
  // EXPORT – "PDF" (Print current view)
  // ---------------------------------------------------
  const handleExportPDF = () => {
    window.print(); // thjesht print / save as PDF nga browseri
  };

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  if (loading) {
    return <div className="text-white">Loading analytics...</div>;
  }

  return (
    <div className="container-fluid text-white">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-success mb-1">Analytics</h2>
          <small className="text-muted">
            Overview of your store performance
          </small>
        </div>

        <div>
          <button
            className="btn btn-outline-light btn-sm me-2"
            onClick={handleExportPDF}
          >
            Export to PDF
          </button>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleExportCSV}
          >
            Export to CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger py-2">{error}</div>
      )}

      {/* Filters */}
      <div className="d-flex gap-3 mb-4">
        {/* Date Range */}
        <select
          className="form-select bg-dark text-white border-secondary"
          style={{ width: "200px" }}
          value={dateRange}
          onChange={handleDateRangeChange}
        >
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="12m">Last 12 Months</option>
        </select>

        {/* Category Filter */}
        <select
          className="form-select bg-dark text-white border-secondary"
          style={{ width: "200px" }}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {revenueByCategory
            .filter((c) => c.category_id && c.category)
            .map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.category}
              </option>
            ))}
        </select>
      </div>

      {/* Sales Chart */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Sales by Month</h5>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2b2b2b" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3 Cards */}
      <div className="row">
        {/* Revenue by Category */}
        <div className="col-md-4 mb-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <h5 className="card-title mb-3 text-white">
                Revenue by Category
              </h5>
              {revenueByCategory.map((cat, index) => {
                const revenue = Number(cat.revenue) || 0;
                const max = Number(revenueByCategory[0]?.revenue) || 1;
                return (
                  <div key={`${cat.category_id}-${index}`} className="mb-3">
                    <div className="d-flex justify-content-between text-white">
                      <span>{cat.category}</span>
                      <span>${revenue.toFixed(2)}</span>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${Math.min(
                            100,
                            (revenue / max) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="col-md-4 mb-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <h5 className="card-title mb-3 text-white">
                Top Customers
              </h5>
              {topCustomers.map((cust, index) => {
                const spent = Number(cust.total_spent) || 0;
                const max = Number(topCustomers[0]?.total_spent) || 1;
                return (
                  <div key={`${cust.name}-${index}`} className="mb-3">
                    <div className="d-flex justify-content-between text-white">
                      <span>{cust.name}</span>
                      <span>${spent.toFixed(2)}</span>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${Math.min(
                            100,
                            (spent / max) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Best-Selling Products */}
        <div className="col-md-4 mb-3">
          <div className="card bg-dark border-secondary h-100">
            <div className="card-body">
              <h5 className="card-title mb-3 text-white">
                Best-Selling Products
              </h5>
              {bestProducts.map((prod, index) => {
                const sold = Number(prod.total_sold) || 0;
                const max = Number(bestProducts[0]?.total_sold) || 1;
                return (
                  <div key={`${prod.name}-${index}`} className="mb-3">
                    <div className="d-flex justify-content-between text-white">
                      <span>{prod.name}</span>
                      <span>{sold} sold</span>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${Math.min(
                            100,
                            (sold / max) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

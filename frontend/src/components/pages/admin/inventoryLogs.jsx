import { useEffect, useState } from "react";
import axios from "axios";

export default function InventoryLogs() {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    changed_by: "",
    change_type: "increase",
    amount: "",
  });

  const fetchData = async () => {
    try {
      const [logsRes, productsRes, adminsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/inventory-logs"),
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/users?role=admin"), 
      ]);
      setLogs(logsRes.data);
      setProducts(productsRes.data);
      setAdmins(adminsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    setFormData({ product_id: "", changed_by: "", change_type: "increase", amount: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/inventory-logs", formData);
      setLogs([res.data, ...logs]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding log");
    }
  };

  return (
    <div className="container-fluid text-white">
      <h1 className="text-success mb-4">Inventory Logs</h1>

      <button className="btn btn-success mb-3" onClick={handleAdd}>
        Add Inventory Log
      </button>

      <table className="table table-dark table-striped text-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Changed By</th>
            <th>Type</th>
            <th>Amount</th>
            <th>New Stock</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.log_id}>
              <td>{l.log_id}</td>
              <td>{l.Product?.name}</td>
              <td>{l.User?.name || "System"}</td>
              <td>{l.change_type}</td>
              <td>{l.amount}</td>
              <td>{l.new_stock}</td>
              <td>{new Date(l.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Add Inventory Log</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <select
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleChange}
                    className="form-select mb-2"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.product_id} value={p.product_id}>{p.name}</option>
                    ))}
                  </select>

                  <select
                    name="changed_by"
                    value={formData.changed_by}
                    onChange={handleChange}
                    className="form-select mb-2"
                    required
                  >
                    <option value="">Select Admin</option>
                    {admins.map((a) => (
                      <option key={a.user_id} value={a.user_id}>{a.name}</option>
                    ))}
                  </select>

                  <select
                    name="change_type"
                    value={formData.change_type}
                    onChange={handleChange}
                    className="form-select mb-2"
                  >
                    <option value="increase">Increase</option>
                    <option value="decrease">Decrease</option>
                  </select>

                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-control mb-2"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
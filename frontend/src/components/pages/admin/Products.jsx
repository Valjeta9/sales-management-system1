import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    status: "active",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      status: "active",
      image: null,
    });
    setPreviewImage(null);
    setEditProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      status: product.status,
      image: null,
    });
    setPreviewImage(product.image_path ? `http://localhost:5000/${product.image_path}` : null);
    setEditProduct(product);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${deleteId}`);
      setProducts(products.filter((p) => p.product_id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category_id", formData.category_id);
      data.append("status", formData.status);
      if (formData.image) data.append("image", formData.image);

      if (editProduct) {
        const res = await axios.put(
          `http://localhost:5000/api/products/${editProduct.product_id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setProducts(products.map((p) =>
          p.product_id === editProduct.product_id ? res.data : p
        ));
      } else {
        const res = await axios.post("http://localhost:5000/api/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts([...products, res.data]);
      }

      setShowModal(false);
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-white">Loading products...</p>;

  return (
    <div className="container-fluid text-white">
      <h1 className="text-success mb-4">Products</h1>

      <button className="btn btn-success mb-3" onClick={handleAdd}>
        Add New Product
      </button>

      {/* Product table */}
      <table className="table table-striped theme-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price ($)</th>
            <th>Stock</th>
            <th>Category ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              <td>
                {p.image ? (
                  <img
                    src={`http://localhost:5000/${p.image}`}
                    alt={p.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                ) : "No image"}
              </td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category_id}</td>
              <td>{p.status}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(p.product_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">{editProduct ? "Edit Product" : "Add Product"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="form-control mb-2" required />
                  <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="form-control mb-2" required />
                  <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="form-control mb-2" required />
                  <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="form-control mb-2" required />
                  <input type="number" name="category_id" placeholder="Category ID" value={formData.category_id} onChange={handleChange} className="form-control mb-2" required />
                  <select name="status" value={formData.status} onChange={handleChange} className="form-select mb-2">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <input type="file" name="image" accept="image/*" onChange={handleChange} className="form-control mb-2" />
                  {previewImage && <img src={previewImage} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
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

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this product?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                <button className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
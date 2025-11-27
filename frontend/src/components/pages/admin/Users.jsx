import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  // Filter
  const [filter, setFilter] = useState("all");

  // Delete Modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Edit Modal
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState({
    user_id: "",
    name: "",
    email: "",
    role: "",
    status: "",
  });

  // ⭐ ADD USER MODAL
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "consumer",
    status: "active",
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${deleteId}`);

      setUsers(
        users.map((u) =>
          u.user_id === deleteId ? { ...u, status: "deleted" } : u
        )
      );
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

  // Restore User
  const restoreUser = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, {
        status: "active",
      });

      setUsers(
        users.map((u) =>
          u.user_id === id ? { ...u, status: "active" } : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Edit User
  const handleEditClick = (user) => {
    setEditUser(user);
    setShowEdit(true);
  };

  const saveEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${editUser.user_id}`,
        editUser
      );

      setUsers(
        users.map((u) =>
          u.user_id === editUser.user_id ? res.data : u
        )
      );

      setShowEdit(false);
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  // ⭐ ADD USER FUNCTION
  const saveNewUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users", newUser);

      setUsers([...users, res.data]); // add new entry to UI list

      // Reset fields and close modal
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "consumer",
        status: "active",
      });

      setShowAdd(false);
    } catch (err) {
      console.error("Add user error:", err);
    }
  };

  // Filter + Search together
  const filteredUsers = users
    .filter((u) =>
      filter === "all" ? true : u.status === filter
    )
    .filter((u) =>
      `${u.name} ${u.email} ${u.role} ${u.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  if (loading)
    return <p className="text-white">Loading users...</p>;

  return (
    <div className="container-fluid text-white">
      <h1 className="text-success mb-4">Users</h1>

      {/* ⭐ ADD USER BUTTON */}
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowAdd(true)}
      >
        + Add User
      </button>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search users..."
        className="form-control mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER BUTTONS */}
      <div className="mb-3">
        <button
          className={`btn me-2 ${
            filter === "all" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={`btn me-2 ${
            filter === "active" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>

        <button
          className={`btn ${
            filter === "deleted" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setFilter("deleted")}
        >
          Deleted
        </button>
      </div>

     <table className="table theme-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map((u) => (
              <tr
                key={u.user_id}
                className={u.status === "deleted" ? "deleted-row" : ""}
              >
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="text-capitalize">{u.role}</td>
                <td>
                  <span
                    className={`badge ${
                      u.status === "active"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td>
                  {u.status === "active" ? (
                    <>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditClick(u)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteClick(u.user_id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => restoreUser(u.user_id)}
                      >
                        Restore
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* DELETE CONFIRMATION MODAL */}
      {showConfirm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelDelete}
                ></button>
              </div>

              <div className="modal-body">
                <p>Are you sure you want to delete this user?</p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEdit && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEdit(false)}
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      name: e.target.value,
                    })
                  }
                />

                <label className="form-label mt-2">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      email: e.target.value,
                    })
                  }
                />

                <label className="form-label mt-2">Role</label>
                <select
                  className="form-select"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="consumer">Consumer</option>
                </select>

                <label className="form-label mt-2">Status</label>
                <select
                  className="form-select"
                  value={editUser.status}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="deleted">Deleted</option>
                </select>
              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={saveEdit}>
                  Save Changes
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ ADD USER MODAL */}
      {showAdd && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Add User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAdd(false)}
                ></button>
              </div>

              <div className="modal-body">

                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      name: e.target.value,
                    })
                  }
                />

                <label className="form-label mt-2">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      email: e.target.value,
                    })
                  }
                />

                <label className="form-label mt-2">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      password: e.target.value,
                    })
                  }
                />

                <label className="form-label mt-2">Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="consumer">Consumer</option>
                </select>

                <label className="form-label mt-2">Status</label>
                <select
                  className="form-select"
                  value={newUser.status}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="deleted">Deleted</option>
                </select>

              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={saveNewUser}>
                  Add User
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

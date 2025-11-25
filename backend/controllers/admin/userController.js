import User from "../../models/users/userModel.js";

export const fetchUsers = async (req, res) => {
  try {
    const role = req.query.role; 
    const users = await User.findAll({
      attributes: ["user_id", "name", "email", "role", "status"],
      where: role ? { role } : {}, 
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};


export const addUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      status,
    });

    res.json(newUser);
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const editUser = async (req, res) => {
  try {
    await User.update(req.body, {
      where: { user_id: req.params.user_id }
    });

    const updatedUser = await User.findByPk(req.params.user_id);

    res.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const removeUser = async (req, res) => {
  try {
    await User.update(
      { status: "deleted" },
      { where: { user_id: req.params.user_id } }
    );

    const updatedUser = await User.findByPk(req.params.user_id);

    res.json(updatedUser);
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
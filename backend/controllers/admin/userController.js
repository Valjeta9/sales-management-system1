import User from "../../models/users/userModel.js";

// GET all users
export const fetchUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE user
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


// UPDATE user
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


// DELETE user
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


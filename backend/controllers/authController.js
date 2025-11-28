import { sequelize } from "../src/config/db.js";
import jwt from "jsonwebtoken";

// ==========================
// HELPERS
// ==========================

// ACCESS TOKEN (15 min)
const createAccessToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// REFRESH TOKEN (7 days)
const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// ==========================
// LOGIN
// ==========================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await sequelize.query(
      "SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1",
      { replacements: [email, password] }
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = rows[0];

    if (user.status === "deleted")
      return res
        .status(403)
        .json({ message: "Account is deactivated" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Access Token – 15 min
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    // Refresh Token – 7 days
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Success",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// ME
// ==========================
export const me = (req, res) => {
  return res.json({
    id: req.user.id,
    role: req.user.role,
  });
};

// ==========================
// REFRESH TOKEN HANDLER
// ==========================
export const refresh = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, data) => {
    if (err)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { id: data.id, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Access token refreshed" });
  });
};

// ==========================
// LOGOUT
// ==========================
export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

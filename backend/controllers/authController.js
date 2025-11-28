import { sequelize } from "../src/config/db.js";
import jwt from "jsonwebtoken";

// ==========================
// HELPERS
// ==========================

// ACCESS TOKEN → skadon pas 10 sekondave
const createAccessToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "10s" } // 10 sekonda
  );
};

// REFRESH TOKEN → skadon pas 10 sekondave
const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "10s" } // 10 sekonda
  );
};

// ==========================
// LOGIN (COOKIE-BASED AUTH)
// ==========================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kontrollo nese user ekziston
    const [rows] = await sequelize.query(
      "SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1",
      { replacements: [email, password] }
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    if (user.status === "deleted") {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Krijo tokenat
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Vendosi tokenat në cookies → maxAge 10 sekonda
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 10 * 1000, // 10 sekonda
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 10 * 1000, // 10 sekonda
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
// ME (Kontroll i identitetit të userit)
// ==========================
export const me = (req, res) => {
  return res.json({
    id: req.user.id,
    role: req.user.role,
  });
};

// ==========================
// REFRESH ACCESS TOKEN (10 sekonda)
// ==========================
export const refresh = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: userData.id, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: "10s" } // 10 sekonda
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 10 * 1000, // 10 sekonda
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

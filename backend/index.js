import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import { sequelize, connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Test endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Serve image uploads
app.use('/uploads', express.static('uploads'));

// ==========================
// AUTH ROUTES (cookie-based)
// ==========================
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

// ==========================
// ADMIN ROUTES
// ==========================
import userRoutes from "./routes/admin/userRoutes.js";
app.use("/api/users", userRoutes);

import productRoutes from "./routes/admin/productRoutes.js";
app.use("/api/products", productRoutes);

import salesRoutes from "./routes/admin/salesRoutes.js";
app.use("/api/sales", salesRoutes);

import analyticsRoutes from "./routes/admin/analyticsRoutes.js";
app.use("/api/analytics", analyticsRoutes);

import settingsRoutes from "./routes/admin/settingsRoutes.js";
app.use("/api/settings", settingsRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    console.log("✓ Database connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();

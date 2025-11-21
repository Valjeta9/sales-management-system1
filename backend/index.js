import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sequelize, connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

import userRoutes from "./routes/admin/userRoutes.js";
app.use("/api/users", userRoutes);

import productRoutes from "./routes/productRoutes.js";
app.use("/api/products", productRoutes);

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

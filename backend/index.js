import express from "express";
import dotenv from "dotenv";
import { sequelize, connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();  // no force, no alter – SAFE
    console.log("✓ Database connected and models synced");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();

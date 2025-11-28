import express from "express";
import { login, logout, me } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// LOGIN
router.post("/login", login);

// LOGOUT
router.post("/logout", logout);

// GET CURRENT USER
router.get("/me", verifyToken, me);

export default router;

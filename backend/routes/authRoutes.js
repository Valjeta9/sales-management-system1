import express from "express";
import { 
  login, 
  logout, 
  me, 
  refresh 
} from "../controllers/authController.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", verifyToken, me);

router.post("/refresh", refresh);

export default router;

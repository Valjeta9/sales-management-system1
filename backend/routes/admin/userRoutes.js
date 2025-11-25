import express from "express";
import { fetchUsers, addUser, editUser, removeUser } 
  from "../../controllers/admin/userController.js";

const router = express.Router();

router.get("/", fetchUsers);
router.post("/", addUser);
router.put("/:user_id", editUser);
router.delete("/:user_id", removeUser);

export default router;
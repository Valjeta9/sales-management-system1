import express from "express";
import multer from "multer";
import { getSettings, updateSettings } from "../../controllers/admin/settingsController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/", getSettings);
router.put("/", upload.single("logo"), updateSettings);

export default router;

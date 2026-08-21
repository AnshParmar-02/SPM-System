import express from "express";
import { registerStudent, loginUser, getProfile } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

export default router;
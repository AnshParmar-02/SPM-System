import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getAllUsers, getUserById, updateUser, deleteUser, createUser } from "../controllers/userController.js";

const router = express.Router();

// All routes are Admin only
router.use(protect, authorizeRoles("admin"));

router.get("/", getAllUsers);
router.post("/", protect, authorizeRoles("admin"), createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
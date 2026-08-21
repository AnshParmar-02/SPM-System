import express from "express";
import AcademicYear from "../models/AcademicYear.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createAcademicYear, getAllAcademicYears, getActiveAcademicYear, updateAcademicYear, deleteAcademicYear } from "../controllers/academicYearController.js";

const router = express.Router();

// Public route
router.get("/active", protect, getActiveAcademicYear);


// Admin only routes
router.post("/", protect, authorizeRoles("admin"), createAcademicYear);
router.get("/", protect, authorizeRoles("admin"), getAllAcademicYears);
router.put("/:id", protect, authorizeRoles("admin"), updateAcademicYear);
router.delete("/:id", protect, authorizeRoles("admin"), deleteAcademicYear);

export default router;
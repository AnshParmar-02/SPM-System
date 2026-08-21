import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { assignGuideToProject, assignGuideToStudent, createGuide, createStudent, getAllProjectFiles, getDashboardStats, getGuides, getProjectDistribution, getRecentActivity, getStudents } from "../controllers/coordinatorController.js";

const router = express.Router();

router.get("/stats", protect, authorizeRoles("coordinator"), getDashboardStats);

router.get("/distribution",protect, authorizeRoles("coordinator"), getProjectDistribution);

router.get("/recent-activity",protect, authorizeRoles("coordinator"), getRecentActivity);

//routes for guide management section
router.get("/get-guides", protect, authorizeRoles("coordinator"), getGuides);

router.post("/create-guide", protect, authorizeRoles("coordinator"), createGuide);

router.post("/assign-guide", protect, authorizeRoles("coordinator"), assignGuideToProject);

//routes for student management section
router.get("/get-students", protect, authorizeRoles("coordinator"), getStudents);

router.post("/create-student", protect, authorizeRoles("coordinator"), createStudent);

router.post("/assign-guideTostudent", protect, authorizeRoles("coordinator"), assignGuideToStudent);

//routes for all submited files
router.get("/all-files", protect, authorizeRoles("coordinator"), getAllProjectFiles);

export default router;
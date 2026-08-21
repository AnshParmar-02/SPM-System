import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { acceptStudentRequest, getGuideDashboardStats, getGuideNotifications, getGuideProjectFiles, getStudentStats, markProjectComplete, rejectStudentRequest, sendFeedbackToStudent } from "../controllers/guideController.js";

const router = express.Router();

//get stats for guide dashboard
router.get("/dashboard-stat", protect, authorizeRoles("guide"), getGuideDashboardStats);
router.get("/notification", protect, authorizeRoles("guide"), getGuideNotifications);
router.get("/notification", protect, authorizeRoles("guide"), getStudentStats);

//accept and reject request
router.put("/accept-request/:id", protect, authorizeRoles("guide"), acceptStudentRequest);
router.put("/reject-request/:id", protect, authorizeRoles("guide"), rejectStudentRequest);

//mark as completed project in assigned student section
router.put('/mark-complete/:id', protect, authorizeRoles("guide"), markProjectComplete);

//send feedback to student
router.post('/feedback', protect, authorizeRoles("guide"), sendFeedbackToStudent);

//fetch all assigned students project files
router.get("/project-files", protect, authorizeRoles("guide"), getGuideProjectFiles);

export default router;
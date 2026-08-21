import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  createProject,
  getMyProject,
  updateProject,
  getAvailableStudents,
  requestGuide,
  getPendingProjects,
  approveProject,
  rejectProject,
  getAssignedProjects,
  acceptGuide,
  getStudentGuide,
  getAllGuides,
  getGuidePendingRequests,
  getGuideStudents,
  sendProjectProposal,
  getStudentFeedbacks,
} from "../controllers/projectController.js";

const router = express.Router();

// Student

//for group
router.post("/create", protect, authorizeRoles("student"), createProject);
router.get("/my-project", protect, authorizeRoles("student"), getMyProject);
router.put("/update-project/:id", protect, authorizeRoles("student"), updateProject);
router.get("/available-students", protect, authorizeRoles("student"), getAvailableStudents);

//for guide section
router.put("/:id/request-guide", protect, authorizeRoles("student"), requestGuide);
router.get("/get-assigned-guide", protect, authorizeRoles("student"), getStudentGuide);
router.get("/get-available-guides", protect, authorizeRoles("student"), getAllGuides);

//for project section
router.post("/send-proposal/:projectId", protect, authorizeRoles("student"), sendProjectProposal);

//for feedback section
router.get('/feedbacks', protect, authorizeRoles("student"), getStudentFeedbacks)



// Coordinator
router.get("/pending", protect, authorizeRoles("coordinator"), getPendingProjects);
router.put("/:id/approve", protect, authorizeRoles("coordinator"), approveProject);
router.put("/:id/reject", protect, authorizeRoles("coordinator"), rejectProject);


// Guide
router.get("/assigned", protect, authorizeRoles("guide"), getAssignedProjects);
router.put("/:id/accept-guide", protect, authorizeRoles("guide"), acceptGuide);
//add api for display all pending request of supervision which is send by students
router.get("/guide/pending-requests", protect, authorizeRoles("guide"), getGuidePendingRequests);
//add all assigned particular guide to the student api
router.get("/guide/assigned-students", protect, authorizeRoles("guide"), getGuideStudents);
//get stats for guide dashboard
// router.get("/guide/")

export default router;
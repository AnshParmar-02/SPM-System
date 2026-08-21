import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getUploadedFiles, uploadFiles } from "../controllers/submissionController.js";
import upload from "../config/multer.js";

const router = express.Router();

//for upload file section
router.post("/upload-files", protect, authorizeRoles("student"), upload.array("files"), uploadFiles);

//get uploaded files for particular student
router.get("/my-files", protect, authorizeRoles("student"), getUploadedFiles);


export default router;
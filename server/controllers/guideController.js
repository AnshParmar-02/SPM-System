import Project from "../models/Project.js"
import Group from "../models/Group.js"
import User from "../models/User.js"
import Submission from '../models/Submission.js'
import Feedback from '../models/Feedback.js'

export const getGuideDashboardStats = async (req, res) => {

  try {

    const guideId = req.user.id

    // Assigned projects
    const assignedProjects = await Project.find({
      assignedGuide: guideId
    })

    const projectCount = assignedProjects.length

    let studentCount = 0

    for (let project of assignedProjects) {

      if (project.projectType === "individual") {

        studentCount += 1

      } else if (project.projectType === "group") {

        const group = await Group.findById(project.groupId)

        if (group) {
          studentCount += group.members.length
        }

      }

    }

    // Pending supervision requests
    const pendingRequests = await Project.countDocuments({
      "guideRequest.guide": guideId,
      "guideRequest.status": "pending"
    })

    res.json({
      students: studentCount,
      projects: projectCount,
      pendingRequests
    })

  } catch (error) {

    console.error(error)
    res.status(500).json({ message: "Server Error" })

  }

}

//get guide notification
export const getGuideNotifications = async (req, res) => {

  try {

    const guideId = req.user.id

    const projects = await Project.find({
      "guideRequest.guide": guideId,
      "guideRequest.status": "pending"
    })
    .populate("createdBy", "name")
    .sort({ createdAt: -1 })

    const notifications = projects.map((project) => ({
      _id: project._id,
      message: `New supervision request from ${project.createdBy.name} for project "${project.title}"`,
      createdAt: project.guideRequest.requestedAt
    }))

    res.json(notifications)

  } catch (error) {

    console.error(error)
    res.status(500).json({ message: "Server Error" })

  }

}

//accept student request
export const acceptStudentRequest = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    console.log(project);
    

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.assignedGuide = req.user.id;
    project.guideRequest.status = "accepted";
    project.guideApprovalStatus = "accepted";
    project.status = "in-progress";

    await project.save();

    res.json({ message: "Guide assigned successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//reject student request
export const rejectStudentRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Check if this guide is the one requested
    if (
      !project.guideRequest ||
      project.guideRequest.guide?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Only allow reject if request is pending
    if (project.guideRequest.status !== "pending") {
      return res.status(400).json({
        message: "Request already handled",
      });
    }

    // ✅ Update fields
    project.guideRequest.status = "rejected";
    project.guideApprovalStatus = "rejected";
    project.assignedGuide = null;

    await project.save();

    res.json({
      message: "Guide request rejected successfully",
      project,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get student stats
export const getStudentStats = async (req, res) => {
  try {

    const guideId = req.user.id;

    const projects = await Project.find({
      assignedGuide: guideId,
    }).populate("groupId");

    let totalStudents = 0;
    let completedProjects = 0;
    let inProgress = 0;

    for (let project of projects) {

      if (project.projectType === "individual") {
        totalStudents += 1;
      }

      if (project.projectType === "group" && project.groupId) {
        totalStudents += project.groupId.members.length;
      }

      if (project.status === "completed") {
        completedProjects += 1;
      }

      if (project.status === "in-progress") {
        inProgress += 1;
      }
    }

    res.status(200).json({
      totalStudents,
      completedProjects,
      inProgress,
      totalProjects: projects.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//mark project completed
export const markProjectComplete = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Only allow if project is in-progress
    if (project.status !== "in-progress") {
      return res.status(400).json({
        message: "Only in-progress projects can be marked as completed",
      });
    }

    // Optional: check guide ownership
    if (project.assignedGuide?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    project.status = "completed";
    project.completedAt = new Date();

    await project.save();

    res.json({
      message: "Project marked as completed",
      project,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get assigned students files
export const getGuideProjectFiles = async (req, res) => {
  try {
    const guideId = req.user._id;

    // 1️⃣ Get all projects assigned to this guide
    const projects = await Project.find({
      assignedGuide: guideId,
    });

    const projectIds = projects.map((p) => p._id);
    

    // 2️⃣ Get all submissions of those projects
    const files = await Submission.find({
      projectId: { $in: projectIds },
    })
      .populate("uploadedBy", "name email")
      .populate("projectId", "title status");

    res.json(files);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

export const sendFeedbackToStudent = async (req, res) => {
  try {
    const { studentId, projectId, title, type, message } = req.body;

    // ✅ Check project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Check guide is assigned to this project
    if (project.assignedGuide?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Create feedback
    const feedback = await Feedback.create({
      studentId,
      projectId,
      guideId: req.user._id,
      title,
      type,
      message,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};
import Project from "../models/Project.js";
import AcademicYear from "../models/AcademicYear.js";
import User from "../models/User.js";
import Feedback from '../models/Feedback.js';
import Group from "../models/Group.js";

/* STUDENT APIs */

// Create Project
export const createProject = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students allowed" });
    }

    const { title, description, projectType, partnerIds } = req.body;

    const activeYear = await AcademicYear.findOne({ isActive: true });

    if (!activeYear) {
      return res.status(400).json({ message: "No active academic year" });
    }

    if (req.user.currentProjectId) {
      return res.status(400).json({ message: "You already have a project" });
    }

    let studentsArray = [req.user._id];
    let group = null;

    // GROUP PROJECT LOGIC
    if (projectType === "group") {

      if (!partnerIds || partnerIds.length === 0) {
        return res.status(400).json({ message: "Select partners" });
      }

      const partners = await User.find({
        _id: { $in: partnerIds },
        currentProjectId: { $ne: null },
      });

      if (partners.length > 0) {
        return res.status(400).json({
          message: "One partner already has project",
        });
      }

      studentsArray = [...studentsArray, ...partnerIds];

      // CREATE GROUP
      group = await Group.create({
        groupName: `Group-${Date.now()}`,
        leaderId: req.user._id,
        members: studentsArray,
        academicYear: activeYear._id,
      });
    }

    // CREATE PROJECT
    const project = await Project.create({
      title,
      description,
      projectType,
      createdBy: req.user._id,
      academicYear: activeYear._id,
      groupId: group ? group._id : null,
    });

    // UPDATE USERS
    await User.updateMany(
      { _id: { $in: studentsArray } },
      { $set: { currentProjectId: project._id } }
    );

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get my project
// export const getMyProject = async (req, res) => {
//   try {

//     console.log(req.user);
//     const project = await Project.findOne({
//       students: req.user._id,
//     })
//       .populate("students", "name email")
//       .populate("guide", "name email");

//     if (!project) {
//       return res.status(404).json({ message: "No project found" });
//     }

//     res.json(project);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getMyProject = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "currentProjectId",
      populate: [
        { path: "createdBy", select: "name email" },
        { path: "assignedGuide", select: "name email" },
      ],
    });

    if (!user.currentProjectId) {
      return res.status(404).json({ message: "No project found" });
    }

    res.status(200).json(user.currentProjectId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update project if rejected
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.students.includes(req.user._id)) {
      return res.status(403).json({ message: "Not your project" });
    }

    if (project.proposalStatus !== "rejected") {
      return res.status(400).json({
        message: "Only rejected project can be edited",
      });
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.proposalStatus = "pending";

    await project.save();

    res.json({ message: "Project updated and resubmitted", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//available student
export const getAvailableStudents = async (req, res) => {
  try {
    const activeYear = await AcademicYear.findOne({ isActive: true });

    if (!activeYear) {
      return res.status(400).json({ message: "No active academic year" });
    }

    const students = await User.find({
      role: "student",
      academicYear: activeYear.year, // same academic year
      currentProjectId: null, // student has no project
      _id: { $ne: req.user._id }, // exclude current student
    }).select("name email");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//request guide
export const requestGuide = async (req, res) => {
  try {
    const { guideId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project.coordinatorApprovalStatus) {
      return res.status(400).json({
        message: "Coordinator approval required first",
      });
    }

    project.assignedGuide = guideId;
    project.guideApproved = false;
    project.guideRequest = {
      guide: guideId,
      status: "pending",
      requestedAt: new Date(),
    };

    await project.save();

    res.json({ message: "Guide request sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get student assigned guide
export const getStudentGuide = async (req, res) => {
  try {
    const project = await Project.findOne({
      createdBy: req.user.id,
    }).populate("assignedGuide", "name email role");

    if (!project || !project.assignedGuide) {
      return res.json(null);
    }

    res.json({
      guide: project.assignedGuide,
      status: project.guideApprovalStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all guides
export const getAllGuides = async (req, res) => {
  try {
    const guides = await User.find({ role: "guide" }).select("-password");

    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//send project proposal to coordinator
export const sendProjectProposal = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent sending if already approved
    if (project.coordinatorApprovalStatus === "approved") {
      return res.status(400).json({
        message: "Project already approved by coordinator",
      });
    }

    // Update proposal status
    project.coordinatorApprovalStatus = "pending";
    project.rejectionReason = "";

    await project.save();

    res.status(200).json({
      message: "Project proposal sent to coordinator",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//fetch student feedback
export const getStudentFeedbacks = async (req, res) => {
  try {
    // ✅ Logged-in student ID from token
    const studentId = req.user._id;

    const feedbacks = await Feedback.find({ studentId })
      .populate("projectId", "title")
      .populate("guideId", "name email")
      .sort({ createdAt: -1 });

    res.json(feedbacks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};


/* COURSE COORDINATOR APIs */

//view pending
// export const getPendingProjects = async (req, res) => {
//   const projects = await Project.find({
//     coordinatorApprovalStatus: "pending",
//   }).populate("students", "name email");

//   res.json(projects);
// };
// export const getPendingProjects = async (req, res) => {

//   const pending = await Project.find({
//     coordinatorApprovalStatus: "pending",
//   });

//   res.json(pending);
// };
export const getPendingProjects = async (req, res) => {
  try {
    if (req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Access denied" });
    }

    const pendingProjects = await Project.find({
      status: "proposal",
      coordinatorApprovalStatus: "pending",
    })
      .populate("createdBy", "name email")
      .populate("assignedGuide", "name email");

    res.json(pendingProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//approve
export const approveProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  project.coordinatorApprovalStatus = "approved";
  project.coordinatorApproved = true;
  project.status = "in-progress"

  await project.save();

  res.json({ message: "Project approved" });
};

//reject
export const rejectProject = async (req, res) => {
  const { reason } = req.body;

  const project = await Project.findById(req.params.id);

  project.proposalStatus = "rejected";
  project.feedback = reason;

  await project.save();

  res.json({ message: "Project rejected" });
};

/* GUIDE APIs */

//get assigned project
// export const getAssignedProjects = async (req, res) => {
//   const projects = await Project.find({
//     assignedGuide: req.user._id,
//     guideApproved: true,
//   }).populate("students", "name email");

//   res.json(projects);
// };
export const getAssignedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      assignedGuide: req.user._id,
      guideApprovalStatus: "accepted",
    }).populate("createdBy", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//accept guide
export const acceptGuide = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

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

//get guide pending request
export const getGuidePendingRequests = async (req, res) => {
  try {
    const projects = await Project.find({
      "guideRequest.guide": req.user.id,
      "guideRequest.status": "pending",
    })
      .populate("createdBy", "name email")
      .populate("guideRequest.guide", "name");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all students assigned to guide
export const getGuideStudents = async (req, res) => {
  try {
    const projects = await Project.find({
      assignedGuide: req.user.id,
    })
      .populate("createdBy", "name email")
      .populate({
        path: "groupId",
        populate: [
          { path: "leaderId", select: "name email" },
          { path: "members", select: "name email" },
        ],
      });

    const result = projects.map((project) => {
      let students = [];

      if (project.projectType === "group" && project.groupId) {
        students = [
          project.groupId.leaderId,
          ...project.groupId.members,
        ];
      } else {
        students = [project.createdBy];
      }

      return {
        projectId: project._id,
        projectTitle: project.title,
        status: project.status,
        students,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

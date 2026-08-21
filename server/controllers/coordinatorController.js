import User from "../models/User.js";
import Project from "../models/Project.js";
import Submission from "../models/Submission.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });

    const totalGuides = await User.countDocuments({ role: "guide" });

    const totalProjects = await Project.countDocuments();

    const pendingApprovals = await Project.countDocuments({
      coordinatorApprovalStatus: "pending",
    });

    res.json({
      totalStudents,
      totalGuides,
      totalProjects,
      pendingApprovals,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectDistribution = async (req, res) => {
  try {
    const distribution = await Project.aggregate([
      {
        $match: {
          assignedGuide: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedGuide",
          totalProjects: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "guide",
        },
      },
      {
        $unwind: "$guide",
      },
      {
        $project: {
          name: "$guide.name",
          projects: "$totalProjects",
        },
      },
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const activities = await Project.find()
      .populate("createdBy", "name")
      .populate("assignedGuide", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const formatted = activities.map((p) => ({
      student: p.createdBy?.name,
      project: p.title,
      guide: p.assignedGuide?.name || "Not Assigned",
      status: p.coordinatorApprovalStatus,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get guide
export const getGuides = async (req, res) => {
  try {
    const guides = await User.find({ role: "guide" }).select("-password");

    const guidesWithProjects = await Promise.all(
      guides.map(async (guide) => {
        const totalProjects = await Project.countDocuments({
          assignedGuide: guide._id,
        });

        return {
          ...guide._doc,
          totalProjects,
        };
      }),
    );

    res.json(guidesWithProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- CREATE GUIDE ---------------- */

export const createGuide = async (req, res) => {
  try {
    const { name, email, expertise, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const guide = new User({
      name,
      email,
      expertise,
      password,
      role: "guide",
    });

    await guide.save();

    res.status(201).json(guide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- ASSIGN GUIDE ---------------- */

export const assignGuideToProject = async (req, res) => {
  try {
    const { guideId, projectId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.assignedGuide = guideId;
    project.guideApprovalStatus = "accepted";

    await project.save();

    res.json({ message: "Guide assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET STUDENTS */

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .populate("currentProjectId", "title")
      .select("-password");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* CREATE STUDENT */

export const createStudent = async (req, res) => {
  try {
    const { name, email, password, semester } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const student = new User({
      name,
      email,
      password,
      semester,
      role: "student",
    });

    await student.save();

    res.status(201).json(student);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: error.message });
  }
};


/* ASSIGN GUIDE TO STUDENT */

export const assignGuideToStudent = async (req, res) => {
  try {
    const { studentId, guideId } = req.body;

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.assignedGuide = guideId;

    await student.save();

    res.json({ message: "Guide assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjectFiles = async (req, res) => {
  try {

    const files = await Submission.find()
      .populate("uploadedBy", "name email")
      .populate("projectId", "title status");

    res.json(files);

  } catch (error) {
    console.error("GET FILES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

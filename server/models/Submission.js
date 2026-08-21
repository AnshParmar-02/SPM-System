import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileType: {
      type: String,
      enum: ["proposal", "report", "code", "presentation"],
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;

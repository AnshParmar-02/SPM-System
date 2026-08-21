// models/WeeklyProgress.js

import mongoose from "mongoose";

const weeklyProgressSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    weekNumber: Number,

    title: String, // e.g. "Login Module Completed"

    description: String,

    files: [
      {
        name: String,
        url: String,
        size: Number,
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "evaluated"],
      default: "pending",
    },

    evaluation: {
      marks: Number,
      feedback: String,
      status: {
        type: String,
        enum: ["approved", "revision", "rejected"],
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("WeeklyProgress", weeklyProgressSchema);

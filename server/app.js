import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import academicYearRoutes from "./routes/academicYearRoutes.js";
import projectRoutes from './routes/projectRoutes.js';
import guideRoutes from './routes/guideRoutes.js';
import coordinatorRoutes from './routes/coordinatorRoutes.js'
import submissionRoutes from './routes/submissionRoutes.js';
import upload from "./config/multer.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/academic-year", academicYearRoutes);

app.use('/api/project', projectRoutes);

app.use('/api/guide', guideRoutes);

app.use('/api/coordinator', coordinatorRoutes)

app.use("/uploads", express.static("uploads"));
app.use("/api/submission", submissionRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Student Project Management API Running...");
});

export default app;
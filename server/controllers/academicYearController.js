import AcademicYear from "../models/AcademicYear.js";


// Create academic year
export const createAcademicYear = async (req, res) => {
  try {
    const { year, semester, isActive } = req.body;

    if (isActive) {
      await AcademicYear.updateMany({}, { isActive: false });
    }

    const academicYear = await AcademicYear.create({
      year,
      semester,
      isActive: isActive || false,
    });

    res.status(201).json(academicYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all academic years
export const getAllAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.find().sort({ createdAt: -1 });
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get active academic year
export const getActiveAcademicYear = async (req, res) => {
  try {
    const activeYear = await AcademicYear.findOne({ isActive: true });

    if (!activeYear) {
      return res.status(404).json({ message: "No active academic year" });
    }

    res.json(activeYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update academic year
export const updateAcademicYear = async (req, res) => {
  try {
    const { year, semester, isActive } = req.body;

    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }

    if (isActive) {
      await AcademicYear.updateMany({}, { isActive: false });
    }

    academicYear.year = year || academicYear.year;
    academicYear.semester = semester || academicYear.semester;
    academicYear.isActive =
      isActive !== undefined ? isActive : academicYear.isActive;

    await academicYear.save();

    res.json({ message: "Academic year updated", academicYear });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete academic year
export const deleteAcademicYear = async (req, res) => {
  try {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }

    await academicYear.deleteOne();

    res.json({ message: "Academic year deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
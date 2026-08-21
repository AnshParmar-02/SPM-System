import Submission from "../models/Submission.js";

//upload files
export const uploadFiles = async (req, res) => {
  try {
    console.log("Body:",req.body);
    console.log("Files:",req.files);
    
    
    const { type, projectId } = req.body;

    const savedFiles = [];

    for (const file of req.files) {
      const newFile = await Submission.create({
        name: file.originalname,
        size: file.size,
        fileType: type,
        fileUrl: `/uploads/${file.filename}`,
        uploadedBy: req.user._id,
        projectId: projectId,
      });

      savedFiles.push(newFile);
    }

    res.json(savedFiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

//get uploaded files for particular student
export const getUploadedFiles = async (req, res) => {
  try {
    const files = await Submission.find({
      uploadedBy: req.user._id,
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
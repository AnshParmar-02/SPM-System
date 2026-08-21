import { useState, useEffect } from "react";
import API from "@/api/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Upload, FileText, Presentation, Code, Download } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { toast } from "react-toastify";

export default function UploadFiles() {
  const [report, setReport] = useState(null);
  const [presentation, setPresentation] = useState(null);
  const [code, setCode] = useState(null);

  const [files, setFiles] = useState([]);
  const [project, setProject] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyProject();
    fetchFiles();
  }, []);

    //fetchMy project
  const fetchMyProject = async () => {
    try {
      const res = await API.get("/project/my-project", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setProject(res.data);
    } catch (error) {
      setProject(null);
    }
  };

  const fetchFiles = async () => {
    const res = await API.get("/submission/my-files", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setFiles(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      if (report) {
        const formData = new FormData();
        formData.append("files", report);
        formData.append("type", "report");
        formData.append("projectId", project._id);

        await API.post("/submission/upload-files", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (presentation) {
        const formData = new FormData();
        formData.append("files", presentation);
        formData.append("type", "presentation");
        formData.append("projectId", project._id);

        await API.post("/submission/upload-files", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (code) {
        const formData = new FormData();
        formData.append("files", code);
        formData.append("type", "code");
        formData.append("projectId", project._id);

        await API.post("/submission/upload-files", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success("Files Uploaded");

      setReport(null);
      setPresentation(null);
      setCode(null);

      fetchFiles();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const getIcon = (type) => {
    if (type === "report") return <FileText className="text-blue-500" />;
    if (type === "presentation")
      return <Presentation className="text-orange-500" />;
    if (type === "code") return <Code className="text-green-600" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold">Upload & Manage Files</h2>

            <p className="text-sm opacity-90">
              Upload reports, presentation and project code files
            </p>
          </CardContent>
        </Card>

        {/* Upload Section */}

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-dashed border-indigo-400 border-2 hover:border-indigo-500 transition text-indigo-500">
            <CardContent className="p-6 space-y-3">
              <FileText />

              <p className="font-medium">Upload Report</p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setReport(e.target.files[0])}
              />
            </CardContent>
          </Card>

          <Card className="border-dashed border-orange-400 border-2 hover:border-orange-500 transition text-orange-500">
            <CardContent className="p-6 space-y-3">
              <Presentation />

              <p className="font-medium">Upload Presentation</p>

              <input
                type="file"
                accept=".ppt,.pptx"
                onChange={(e) => setPresentation(e.target.files[0])}
              />
            </CardContent>
          </Card>

          <Card className="border-dashed border-purple-400 border-2 hover:border-purple-500 transition text-purple-500">
            <CardContent className="p-6 space-y-3">
              <Code />

              <p className="font-medium">Upload Code (ZIP)</p>

              <input
                type="file"
                accept=".zip"
                onChange={(e) => setCode(e.target.files[0])}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            className="flex gap-2 bg-indigo-500 text-white p-5"
          >
            <Upload size={16} />
            Upload Files
          </Button>
        </div>

        {/* Uploaded Files */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {files.map((file) => (
            <Card key={file._id} className=''>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(file.fileType)}

                  <div>
                    <p className="font-medium">{file.name}</p>

                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <p>{new Date(file.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  className='bg-blue-500 text-white rounded-lg p-4'
                  onClick={() =>
                    window.open(`http://localhost:5050${file.fileUrl}`)
                  }
                >
                  <Download size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import API from "@/api/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { FileText, Code, Presentation, Download, Search } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";

export default function UploadedFiles() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await API.get("/coordinator/all-files", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setFiles(res.data);
  };

  const filteredFiles = files.filter((file) => {
    const matchSearch =
      file.name.toLowerCase().includes(search.toLowerCase()) ||
      file.uploadedBy.name.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "all" || file.fileType === filter;

    return matchSearch && matchFilter;
  });

  const total = files.length;
  const presentations = files.filter((f) => f.fileType === "presentation").length;
  const reports = files.filter((f) => f.fileType === "report").length;
  const codes = files.filter((f) => f.fileType === "code").length;

  const getIcon = (type) => {
    if (type === "presentation")
      return <Presentation className="text-orange-500" />;
    if (type === "report") return <FileText className="text-blue-500" />;
    if (type === "report") return <FileText className="text-blue-500" />;
    if (type === "code") return <Code className="text-green-600" />;

    return <FileText />;
  };

  return (
   <DashboardLayout>
    <div className="space-y-8">
      {/* Header */}

      <Card className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold">Student Files</h2>

          <p className="text-sm opacity-90">
            Manage files shared with and received from students
          </p>
        </CardContent>
      </Card>

      {/* Filters + Search */}

      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Files
          </Button>

          <Button
            variant={filter === "presentation" ? "default" : "outline"}
            onClick={() => setFilter("presentation")}
          >
            Presentation
          </Button>

          <Button
            variant={filter === "code" ? "default" : "outline"}
            onClick={() => setFilter("code")}
          >
            Code
          </Button>

          <Button
            variant={filter === "report" ? "default" : "outline"}
            onClick={() => setFilter("report")}
          >
            Reports
          </Button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-indigo-50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Files</p>
            <p className="text-xl font-bold">{total}</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Presentations</p>
            <p className="text-xl font-bold">{presentations}</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Reports</p>
            <p className="text-xl font-bold">{reports}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Code Files</p>
            <p className="text-xl font-bold">{codes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Files List */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <Card key={file._id} className="hover:shadow-md transition">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getIcon(file.fileType)}
                </div>

                <div>
                  <p className="font-medium">{file.name}</p>

                  <p className="text-sm text-muted-foreground">
                    By {file.uploadedBy.name}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Badge variant="secondary">{file.type}</Badge>

                <Button
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  onClick={() => window.open(`http://localhost:5050${file.fileUrl}`)}
                >
                  <Download size={16} className="mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
   </DashboardLayout>
  );
}

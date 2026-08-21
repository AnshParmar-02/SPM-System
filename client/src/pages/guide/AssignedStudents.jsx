import { useEffect, useState } from "react";
import API from "@/api/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Search } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { toast } from "react-toastify";

export default function AssignedStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await API.get("/project/guide/assigned-students", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setStudents(res.data);
  };

  const handleComplete = async (id) => {
    const res = await API.put(
      `/guide/mark-complete/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    toast.success(res.data.message);

    fetchStudents()
  };

  const handleSubmitFeedback = async () => {
  try {
    const requests = selectedStudent.students.map((student) =>
      API.post(
        "/guide/feedback",
        {
          studentId: student._id,
          projectId: selectedStudent.projectId,
          title: feedbackTitle,
          type: feedbackType,
          message: feedbackMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
    );

    await Promise.all(requests);

    toast.success("Feedback sent successfully.");

    setSelectedStudent(null);
    setFeedbackTitle("");
    setFeedbackType("");
    setFeedbackMessage("");
  } catch (error) {
    toast.error("Failed to send feedback.");
  }
};

  const filteredStudents = students.filter((s) => {
    console.log(students);
    
    
  if (!search) return true;

  const searchText = search.toLowerCase();

  const studentMatch = s.students?.some((student) =>
    student?.name?.toLowerCase().includes(searchText)
  );

  const projectMatch = s.ProjectTitle?.toLowerCase().includes(searchText);

  return studentMatch || projectMatch;
});

  const completed = students.filter((s) => s.status === "completed").length;
  const progress = students.filter((s) => s.status === "in-progress").length;
  const totalStudents = students.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}

        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold">Assigned Students</h2>

            <p className="text-sm opacity-90 mt-1">
              Manage your assigned students and their projects
            </p>
          </CardContent>
        </Card>

        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-blue-100 border-blue-100 text-blue-700">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total students</p>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-100 border-green-100 text-green-700">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                Completed Projects
              </p>
              <p className="text-2xl font-bold">{completed}</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 border-yellow-100 text-yellow-700">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{progress}</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-100 border-purple-100 text-purple-700">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

          <Input
            placeholder="Search by student or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-gray-300"
          />
        </div>

        {/* Students List */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((s) => {
  const student = s.createdBy || s.students?.[0]; // fallback for group

  return (
    <Card key={s._id} className="hover:shadow-md transition">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="border-slate-700">
            <AvatarFallback>
              {student?.name?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium">{student?.name || "Unknown Student"}</p>

            <p className="text-sm text-muted-foreground">
              {student?.email || "No Email"}
            </p>
          </div>
        </div>

        <div className="text-sm">
          <p>
            <span className="font-medium">Project:</span> {s.projectTitle}
          </p>

          <Badge className="mt-2">{s.status}</Badge>
        </div>

        <div className="flex gap-3 pt-3">
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => setSelectedStudent(s)}
          >
            Feedback
          </Button>

          {s.status === "completed" ? (
            <span className="text-green-600 font-semibold">Completed</span>
          ) : s.status === "in-progress" ? (
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleComplete(s.projectId)}
            >
              Mark Complete
            </Button>
          ) : (
            <span className="text-yellow-500">Proposal Pending</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
})}
        </div>

        {/* Feedback Modal */}

        <Dialog
          open={!!selectedStudent}
          onOpenChange={() => setSelectedStudent(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Project Feedback</DialogTitle>
            </DialogHeader>

            {selectedStudent && (
  <div className="space-y-4">

    <div className="text-sm space-y-2">

      <div>
        <b>Students:</b>
        <ul className="list-disc ml-5">
          {selectedStudent.students?.map((student) => (
            <li key={student._id}>{student.name}</li>
          ))}
        </ul>
      </div>

      <p>
        <b>Project:</b> {selectedStudent.title}
      </p>

    </div>

    <div className="space-y-2">
      <Label>Feedback Title</Label>
      <Input
        value={feedbackTitle}
        onChange={(e) => setFeedbackTitle(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <Label>Feedback Type</Label>

      <select
        className="w-full border rounded-md p-2"
        value={feedbackType}
        onChange={(e) => setFeedbackType(e.target.value)}
      >
        <option value="">Select Type</option>
        <option value="suggestion">Suggestion</option>
        <option value="issue">Issue</option>
        <option value="improvement">Improvement</option>
      </select>
    </div>

    <div className="space-y-2">
      <Label>Feedback Message</Label>

      <Textarea
        value={feedbackMessage}
        onChange={(e) => setFeedbackMessage(e.target.value)}
      />
    </div>

    <div className="flex justify-end gap-3 pt-3">
      <Button
        variant="outline"
        onClick={() => setSelectedStudent(null)}
      >
        Cancel
      </Button>

      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleSubmitFeedback}
      >
        Submit Feedback
      </Button>
    </div>

  </div>
)}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

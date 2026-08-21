import { useEffect, useState } from "react";
import API from "@/api/axios";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [guides, setGuides] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    semester: "",
  });

  const [guideId, setGuideId] = useState("");

  /* FETCH STUDENTS */

  const fetchStudents = async () => {
    const res = await API.get("/coordinator/get-students", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data);
  };

  /* FETCH GUIDES */

  const fetchGuides = async () => {
    const res = await API.get("/coordinator/get-guides", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGuides(res.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchGuides();
  }, []);

  /* CREATE STUDENT */

  const handleCreateStudent = async (e) => {
    e.preventDefault();

    const res = await API.post("/coordinator/create-student", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Student create successfully.");

    setShowAddModal(false);
    fetchStudents();
  };

  /* ASSIGN GUIDE */

  const handleAssignGuide = async () => {
    await axios.post(
      "/coordinator/assign-guideTostudent",
      {
        studentId: selectedStudent._id,
        guideId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setShowAssignModal(false);
    fetchStudents();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <Card className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold">Manage Students</h2>

            <p className="text-sm opacity-90 mt-1">
              Show and manages all students
            </p>
          </CardContent>
        </Card>
        {/* HEADER */}

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Student Management</h2>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Add Student
          </button>
        </div>

        {/* STUDENT TABLE */}

        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Semester</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="p-3">{student.name}</td>

                  <td className="p-3">{student.email}</td>

                  <td className="p-3">{student.semester}</td>

                  <td className="p-3">
                    {student.currentProjectId
                      ? student.currentProjectId.title
                      : "Not Assigned"}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowAssignModal(true);
                      }}
                      className="px-3 py-1 border bg-indigo-600 text-white rounded"
                    >
                      Assign Guide
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD STUDENT MODAL */}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[400px]">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold mb-4">Add Student</h3>
              <X
                  onClick={() => setShowAddModal(false)}
                  className="pointer text-black"
                />
              </div>
              

              <form onSubmit={handleCreateStudent} className="space-y-3">
                <input
                  placeholder="Name"
                  className="w-full border p-2 rounded"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <input
                  placeholder="Semester"
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setForm({ ...form, semester: e.target.value })
                  }
                />

                <button className="w-full bg-black text-white p-2 rounded">
                  Create Student
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ASSIGN GUIDE MODAL */}

        {showAssignModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[400px]">
              <h3 className="text-lg font-semibold mb-4">Assign Guide</h3>

              <select
                className="w-full border p-2 rounded mb-4"
                onChange={(e) => setGuideId(e.target.value)}
              >
                <option>Select Guide</option>

                {guides.map((guide) => (
                  <option key={guide._id} value={guide._id}>
                    {guide.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssignGuide}
                className="w-full bg-black text-white p-2 rounded"
              >
                Assign Guide
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

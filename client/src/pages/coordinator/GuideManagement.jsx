import { useEffect, useState } from "react";
import API from "@/api/axios";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";

export default function GuideManagement() {
  const [guides, setGuides] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    expertise: "",
  });

  const [projectId, setProjectId] = useState("");

  /* ---------------- FETCH GUIDES ---------------- */

  const fetchGuides = async () => {
    const res = await API.get("/coordinator/get-guides", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
    setGuides(res.data);
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  /* ---------------- CREATE GUIDE ---------------- */

  const handleCreateGuide = async (e) => {
    e.preventDefault();

    try {
        const res = await API.post("/coordinator/create-guide", {
      ...form,
      role: "guide",
    }, {
        headers: { Authorization: `Bearer ${token}` }
      });

    toast.success("Guide create succesfully.")

    setShowAddModal(false);
    fetchGuides();
        
    } catch (error) {
     toast.error(error)   
    }
  };

  /* ---------------- ASSIGN GUIDE ---------------- */

  const handleAssignGuide = async () => {
    await API.post("/coordinator/assign-guide",  {
        headers: { Authorization: `Bearer ${token}` }
      }, {
      guideId: selectedGuide._id,
      projectId,
    });

    setShowAssignModal(false);
    fetchGuides();
  };

  return (
    <DashboardLayout>
    <div className="space-y-6">

        <Card className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold">Manage Guides</h2>

            <p className="text-sm opacity-90 mt-1">
              Show and manages all guides
            </p>
          </CardContent>
        </Card>
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Guide Management</h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Add Guide
        </button>
      </div>

      {/* GUIDE TABLE */}

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Projects</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {guides.map((guide) => (
              <tr key={guide._id} className="border-t">
                <td className="p-3">{guide.name}</td>

                <td className="p-3">{guide.email}</td>

                <td className="p-3">{guide.totalProjects}</td>

                <td className="p-3">
                  <button
                    onClick={() => {
                      setSelectedGuide(guide);
                      setShowAssignModal(true);
                    }}
                    className="px-3 py-1 border bg-indigo-600 text-white rounded"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD GUIDE MODAL */}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Add Guide</h3>

            <form onSubmit={handleCreateGuide} className="space-y-3">
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
                placeholder="Expertise"
                className="w-full border p-2 rounded"
                onChange={(e) => setForm({ ...form, expertise: e.target.value })}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <button className="w-full bg-black text-white p-2 rounded">
                Create Guide
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

            <input
              placeholder="Project ID"
              className="w-full border p-2 rounded mb-4"
              onChange={(e) => setProjectId(e.target.value)}
            />

            <button
              onClick={handleAssignGuide}
              className="w-full bg-black text-white p-2 rounded"
            >
              Assign
            </button>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}

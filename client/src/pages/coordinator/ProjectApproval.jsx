import { useEffect, useState } from "react";
import API from "@/api/axios";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { toast } from "react-toastify";

const ProjectApproval = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/project/pending");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const approveProject = async (id) => {
    await API.put(`/project/${id}/approve`);
    toast.success("Project approved successfully.")
    setSelectedProject(null);
    fetchProjects();
  };

  const rejectProject = async (id) => {
    await API.put(`/project/${id}/reject`);
    toast.success("Project reject successfully.")
    setSelectedProject(null);
    fetchProjects();
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6">Project Approval Requests</h2>

        {/* Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-5 border"
            >
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>

              <p className="text-sm text-gray-600 line-clamp-2">
                {project.description}
              </p>

              <div className="mt-4 text-sm text-gray-500">
                <p>
                  <span className="font-medium">Student:</span>{" "}
                  {project.createdBy?.name}
                </p>

                <p>
                  <span className="font-medium">Submitted:</span>{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-end gap-3">

                <button
                  onClick={() => rejectProject(project._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Reject
                </button>

                <button
                  onClick={() => approveProject(project._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                {selectedProject.title}
              </h3>

              <p className="text-gray-700 mb-4">
                {selectedProject.description}
              </p>

              <p className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Student:</span>{" "}
                {selectedProject.createdBy?.name}
              </p>

              <p className="text-sm text-gray-500 mb-6">
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(selectedProject.createdAt).toLocaleDateString()}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded border"
                >
                  Close
                </button>

                <button
                  onClick={() => rejectProject(selectedProject._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Reject
                </button>

                <button
                  onClick={() => approveProject(selectedProject._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectApproval;

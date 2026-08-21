import { useState, useEffect } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/Layout/DashboardLayout";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle2,
  Edit2,
  HelpCircle,
  Send,
  XCircle,
} from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: {
      icon: CheckCircle2,
      text: "Approved",
      className: "bg-green-50 text-green-700 border-green-200",
      iconColor: "text-green-600",
    },
    rejected: {
      icon: XCircle,
      text: "Rejected",
      className: "bg-red-50 text-red-700 border-red-200",
      iconColor: "text-red-600",
    },
    pending: {
      icon: HelpCircle,
      text: "Pending",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      iconColor: "text-yellow-600",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} px-3 py-1 text-sm rounded-lg p-4 font-medium`}
    >
      <Icon className={`w-4 h-4 mr-1.5 ${config.iconColor}`} />
      {config.text}
    </Badge>
  );
};

function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("individual");
  const [students, setStudents] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // get students list
  useEffect(() => {
    fetchMyProject();
    fetchStudents();
  }, []);

  //fetch students
  const fetchStudents = async () => {
    try {
      const res = await API.get("/project/available-students", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStudents(res.data);
    } catch (err) {
      toast.error(err);
    }
  };

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

    setLoading(false);
  };

  // select partners
  const handlePartnerSelect = (id) => {
    if (selectedPartners.includes(id)) {
      setSelectedPartners(selectedPartners.filter((p) => p !== id));
    } else {
      setSelectedPartners([...selectedPartners, id]);
    }
  };

  // create project
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/project/create",
        {
          title,
          description,
          projectType,
          partnerIds: selectedPartners,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchMyProject();

      toast.success("Project Created");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // update project
  const onUpdate = async () => {};

  // send proposal to coordinator
  const onSendProposal = async () => {
    try {
      const token = localStorage.getItem(localStorage.getItem("token"));

      const res = await API.post(
        `/project/send-proposal/${project._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message || "Proposal sent successfully");

      // refresh project data
      fetchMyProject();
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send proposal");
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <DashboardLayout>
      {/* If project exist */}
      {project ? (
        <div>
            <div className="text-2xl pb-2">
                <strong><h1>Show your project details</h1></strong>  
            </div>
        
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-3">{project.title}</CardTitle>
              {project && (
                <StatusBadge status={project.coordinatorApprovalStatus} />
              )}
            </div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <Badge variant="outline" className="capitalize">
                    {project.projectType}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Team Members */}
            {project.projectType === "group" &&
              project.students?.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Team Members ({project.students.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.students.map((student) => (
                        <Badge
                          key={student._id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {student.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <Button
                className="p-5 bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={onSendProposal}
              >
                Send Proposal
              </Button>

              <Button className="p-5" variant="outline" onClick={onUpdate}>
                Update Project
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      ) : (
        <div className="max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create New Project</CardTitle>
              <p className="text-sm text-muted-foreground">
                Submit your final year project details.
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Title */}

                <div className="space-y-2">
                  <Label>Project Title</Label>

                  <Input
                    placeholder="Enter project title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Project Description */}

                <div className="space-y-2">
                  <Label>Project Description</Label>

                  <Textarea
                    placeholder="Describe your project idea"
                    rows={4}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Project Type */}

                <div className="space-y-3">
                  <Label>Project Type</Label>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={
                        projectType === "individual" ? "default" : "outline"
                      }
                      onClick={() => setProjectType("individual")}
                    >
                      Individual
                    </Button>

                    <Button
                      type="button"
                      variant={projectType === "group" ? "default" : "outline"}
                      onClick={() => setProjectType("group")}
                    >
                      Group
                    </Button>
                  </div>
                </div>

                {/* Partner Selection */}

                {projectType === "group" && (
                  <div className="space-y-4 border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <Label>Select Group Members</Label>

                      <span className="text-sm text-muted-foreground">
                        {students.length} students
                      </span>
                    </div>

                    {/* Scrollable container */}

                    <div className="grid sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                      {students.map((student) => (
                        <div
                          key={student._id}
                          className="flex items-center gap-3 border rounded-md p-3 hover:bg-muted/50 transition"
                        >
                          <Checkbox
                            onCheckedChange={() =>
                              handlePartnerSelect(student._id)
                            }
                          />

                          <div className="text-sm">
                            <p className="font-medium">{student.name}</p>

                            <p className="text-muted-foreground text-xs">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}

                <Button className="w-full bg-indigo-600 text-white">
                  Create Project
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CreateProject;

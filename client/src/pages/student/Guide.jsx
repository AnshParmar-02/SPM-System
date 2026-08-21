import { useEffect, useState } from "react";
import API from "@/api/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import GuideCard from "@/components/guide/GuideCard";
import MyProposalCard from "@/components/guide/MyProposalCard.jsx";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { toast } from "react-toastify";
import { CircleCheckBig, CircleQuestionMark, CircleXIcon } from "lucide-react";

const Guide = () => {
  const [guides, setGuides] = useState([]);
  const [proposal, setProposal] = useState(null);
  const [project, setProject] = useState(null);
  const [guide, setGuide] = useState(null);

  const token = localStorage.getItem("token");

  const fetchGuides = async () => {
    const res = await API.get("/project/get-available-guides", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setGuides(res.data);
  };

  const getMyProject = async () => {
    try {
      const res = await API.get("/project/my-project");

      setProject(res.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Failed to load project");
      }
    }
  };

  const fetchMyProposal = async () => {
    try {
      const res = await API.get("/project/get-assigned-guide", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProposal(res.data);
    } catch (error) {
      setProposal(null);
    }
  };

  const sendProposal = async (guideId) => {
    try {
      const project = await API.get("/project/my-project", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProject(project.data);
      const projectId = project.data._id;

      const res = await API.put(
        `/project/${projectId}/request-guide`,
        { guideId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Successfully send proposal to guide.");
      setProposal(res.data.project.guideRequest);
    } catch (error) {
      toast.error(error);
    }
  };

  const getAssignedGuide = async () => {
    try {
      const res = await API.get("/project/get-assigned-guide");

      setGuide(res.data.guide);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Failed to load guide");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="rounded-xl bg-green-100 text-green-700">
            <CircleCheckBig size="14px" />
            Approved
          </Badge>
        );

      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 rounded-md">
            <CircleXIcon size="14px" />
            Rejected
          </Badge>
        );

      case "pending":
        // default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 rounded-md">
            <CircleQuestionMark size="14px" />
            Pending
          </Badge>
        );
    }
  };

  useEffect(() => {
    getMyProject();
    getAssignedGuide();
    fetchGuides();
    fetchMyProposal();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Page Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Select Project Guide
            </h1>

            <p className="text-sm text-muted-foreground">
              Choose a guide and send a supervision request for your project.
            </p>
          </div>
        </div>

        {/* My Proposal Card */}

        {proposal && (
          <Card className="rounded-xl border border-indigo-100 bg-white-50/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-indigo-700">
                Current Guide
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 bg-indigo-500 text-white">
                  <AvatarFallback>
                    {guide?.name?.charAt(0) || "G"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium text-gray-800">{guide?.name}</p>
                  <p className="text-sm text-gray-500">{guide?.email}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(proposal?.status)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guides Section */}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Guides</h2>

            <p className="text-sm text-muted-foreground">
              {guides.length} guides available
            </p>
          </div>

          {/* Guides Grid */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card
                key={guide._id}
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl border border-indigo-100 bg-indigo-50/40 shadow-sm"
              >
                <CardHeader className="flex flex-row items-center text-center gap-3">
                  <Avatar className="h-10 w-10 bg-indigo-500 text-white">
                    <AvatarFallback className="text-lg">
                      {guide.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <CardTitle className="text-base">{guide.name}</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-2">
                    <h5 className="text-gray-700">Email</h5>
                    <p className="text-sm text-muted-foreground">
                      {guide.email}
                    </p>
                  </div>
                  <div className="mb-2">
                    <h5 className="text-gray-700">Expertise</h5>
                    <p className="text-sm text-muted-foreground">
                      {guide.expertise}
                    </p>
                  </div>
                  <Button
                    className="w-full bg-indigo-600 text-white"
                    disabled={proposal}
                    onClick={() => sendProposal(guide._id)}
                  >
                    Send Proposal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Guide;

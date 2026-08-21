import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FolderClosed,
  UserPen,
  MessageCircle,
  CalendarClock,
  Bell,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  Users,
  ChevronRight,
  Plus,
} from "lucide-react";

import DashboardLayout from "../components/Layout/DashboardLayout";
import API from "../api/axios";

// shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: {
      icon: CheckCircle2,
      text: "Approved",
      className: "rounded bg-green-50 text-green-700 border-green-200",
      iconColor: "text-green-600",
    },
    rejected: {
      icon: XCircle,
      text: "Rejected",
      className: "rounded bg-red-50 text-red-700 border-red-200",
      iconColor: "text-red-600",
    },
    pending: {
      icon: HelpCircle,
      text: "Pending",
      className: "rounded bg-yellow-50 text-yellow-700 border-yellow-200",
      iconColor: "text-yellow-600",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} px-3 py-1 text-sm font-medium`}
    >
      <Icon className={`w-4 h-4 mr-1.5 ${config.iconColor}`} />
      {config.text}
    </Badge>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, subtitle, loading }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-100 text-primary group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {title}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <p className="text-2xl font-bold text-slate-800 truncate">
                  {value}
                </p>
                {subtitle && (
                  <p className="text-xs text-gray-700 mt-1">
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
export default function StudentDashboard() {
  const [project, setProject] = useState(null);
  const [guide, setGuide] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState({
    project: true,
    guide: true,
    feedback: true,
    deadlines: true,
  });

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch project data
  const getMyProject = async () => {
    try {
      const res = await API.get("/project/my-project");
      setProject(res.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Failed to load project");
      }
    } finally {
      setLoading((prev) => ({ ...prev, project: false }));
    }
  };

  // Fetch assigned guide
  const getAssignedGuide = async () => {
    try {
      const res = await API.get("/project/get-assigned-guide");
      setGuide(res.data.guide);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Failed to load guide");
      }
    } finally {
      setLoading((prev) => ({ ...prev, guide: false }));
    }
  };

  // Fetch feedback (you'll need to implement this API)
  const getFeedbacks = async () => {
    try {
      const res = await API.get("/project/feedbacks");

      setFeedbacks(res.data);
      // setFeedbacks([]); // Placeholder
    } catch (error) {
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading((prev) => ({ ...prev, feedback: false }));
    }
  };

  // Fetch deadlines (you'll need to implement this API)
  const getDeadlines = async () => {
    try {
      // const res = await API.get("/project/deadlines");
      // setDeadlines(res.data);
      setDeadlines([]); // Placeholder
    } catch (error) {
      console.error("Failed to load deadlines");
    } finally {
      setLoading((prev) => ({ ...prev, deadlines: false }));
    }
  };

  useEffect(() => {
    getMyProject();
    getAssignedGuide();
    getFeedbacks();
    getDeadlines();
  }, []);

  // Loading state
  if (Object.values(loading).some((state) => state)) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 overflow-y-hidden">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Welcome back, <span className="text-primary">{user.name}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening with your projects today.
            </p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 shadow-sm p-4"
            onClick={() => navigate("/student/create-project")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={FolderClosed}
            title="My Project"
            value={project?.title || "No Project"}
            subtitle={
              project
                ? `Created: ${new Date(project.createdAt).toLocaleDateString()}`
                : null
            }
            loading={loading.project}
          />
          <StatCard
            icon={UserPen}
            title="Guide"
            value={guide?.name || "Not Assigned"}
            subtitle={guide?.department || null}
            loading={loading.guide}
          />
          <StatCard
            icon={MessageCircle}
            title="Feedback"
            value={feedbacks.length}
            subtitle={`${feedbacks.filter((f) => !f.read).length} unread`}
            loading={loading.feedback}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="bg-muted/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Project Details</CardTitle>
                  {project && (
                    <StatusBadge status={project.coordinatorApprovalStatus} />
                  )}
                </div>
                <CardDescription>
                  Complete information about your current project
                </CardDescription>
              </CardHeader>

              {/* <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" /> */}
              
              <CardContent className="p-6 space-y-6">
                {project ? (
                  <>
                    {/* Title */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Project Title
                        </p>
                        <p className="text-xl font-semibold text-gray-800">
                          {project.title}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">
                        Description
                      </label>
                      <p className="text-base leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Project Type & Team Size */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Project Type
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="w-4 h-4 text-indigo-500" />
                            <span className="font-medium capitalize">
                              {project.projectType}
                            </span>
                          </div>
                        </div>
                      </div>
                      {project.type === "group" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Team Members
                          </label>
                          <p className="font-medium">
                            {project.teamMembers?.length || 1}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Rejection Reason (if any) */}
                    {project.rejectionReason && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Rejection Reason</AlertTitle>
                        <AlertDescription>
                          {project.rejectionReason}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        className="hover:bg-gray-100"
                        onClick={() => navigate("/student/create-project")}
                      >
                        Update Project
                      </Button>

                      {project.coordinatorApprovalStatus === "pending" && (
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          Send Proposal
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FolderClosed className="w-12 h-12 mx-auto text-muted-foreground/40" />

                    <h3 className="mt-4 text-lg font-semibold text-gray-800">
                      No Project Yet
                    </h3>

                    <p className="text-sm text-muted-foreground mt-1">
                      Create your first project to get started
                    </p>

                    <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                      Create Project
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Progress (if approved) */}
            {project?.coordinatorApprovalStatus === "approved" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Completion</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  {/* Add more milestones here */}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            {/* Latest Feedback */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Latest Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedbacks.length > 0 ? (
                  <div className="space-y-4">
                    {feedbacks.slice(0, 3).map((feedback, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">
                              {feedback.guideId.name}
                            </p>
                            <p className="text-xs text-gray-400 mb-2">
                              {new Date(
                                feedback.createdAt,
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                          {!feedback.read && (
                            <Badge className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {feedback.message}
                        </p>
                        <Separator />
                      </div>
                    ))}
                    {feedbacks.length > 3 && (
                      <Button variant="ghost" className="w-full text-sm">
                        View all feedback
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mt-2">
                      No feedback yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarClock className="w-5 h-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                {deadlines.length > 0 ? (
                  <div className="space-y-3">
                    {deadlines.map((deadline, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {deadline.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Due:{" "}
                            {new Date(deadline.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {deadline.daysLeft} days left
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarClock className="w-8 h-8 mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mt-2">
                      No deadlines scheduled
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            {/* <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className={`w-2 h-2 mt-2 rounded-full ${notification.read ? "bg-gray-300" : "bg-primary"}`}
                        />
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-8 h-8 mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mt-2">
                      No notifications
                    </p>
                  </div>
                )}
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

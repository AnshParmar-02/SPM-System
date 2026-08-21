import DashboardLayout from "@/components/Layout/DashboardLayout";
import React, { useEffect, useState } from "react";
import API from "@/api/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";

const projectDistribution = [
  { name: "Dr Shah", projects: 6 },
  { name: "Dr Patel", projects: 4 },
  { name: "Dr Mehta", projects: 7 },
  { name: "Dr Joshi", projects: 3 },
];

const recentActivities = [
  {
    student: "Rahul",
    project: "AI Chatbot",
    guide: "Dr Shah",
    status: "Submitted",
  },
  {
    student: "Priya",
    project: "Blockchain Voting",
    guide: "Dr Patel",
    status: "Approved",
  },
  {
    student: "Amit",
    project: "Smart Attendance",
    guide: "Dr Mehta",
    status: "Pending",
  },
];

const CoordinatorDashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token")

  const statsData = [
    { title: "Total Students", value: stats.totalStudents || 0 },
    { title: "Total Guides", value: stats.totalGuides || 0 },
    { title: "Total Projects", value: stats.totalProjects || 0 },
    { title: "Pending Approvals", value: stats.pendingApprovals || 0 },
  ];

  const getDashboardStats = async () => {
    return await API.get("/coordinator/stats",{
        headers: { Authorization: `Bearer ${token}` }
      });
  };

  const getProjectDistribution = async () => {
    return await API.get("/coordinator/distribution",{
        headers: { Authorization: `Bearer ${token}` }
      });
  };

  const getRecentActivity = async () => {
    return await API.get("/coordinator/recent-activity", {
        headers: { Authorization: `Bearer ${token}` }
      });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await getDashboardStats();
        const chartRes = await getProjectDistribution();
        const activityRes = await getRecentActivity();
        
        setStats(statsRes.data);
        setChartData(chartRes.data);
        setActivities(activityRes.data);
      } catch (error) {
        toast.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold">Welcome</h2>

            <p className="text-sm opacity-90 mt-1">
              Show and manages students, guides, projects and proposals requests
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Graph + Activity */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Project Distribution Graph */}

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Distribution by Guide</CardTitle>
            </CardHeader>

            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />

                  <Tooltip />

                  <Bar dataKey="projects" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}

          <Card>
            <CardHeader>
              <CardTitle>Recent Project Activity</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="border-b pb-3 last:border-none">
                  <p className="font-medium">{activity.student}</p>

                  <p className="text-sm text-muted-foreground">
                    {activity.project}
                  </p>

                  <div className="flex justify-between text-xs mt-1">
                    <span>{activity.guide}</span>

                    <span className="font-medium">{activity.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorDashboard;

import { useEffect, useState } from "react";
import API from "@/api/axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/Layout/DashboardLayout";

export default function Feedback({ token }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFeedbacks = async () => {
    try {
      const res = await API.get("/project/feedbacks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedbacks(res.data);
    } catch (error) {
      console.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedbacks();
  }, []);

  const getBadgeVariant = (type) => {
    switch (type) {
      case "suggestion":
        return (
            <Badge className="rounded-xl bg-yellow-100 text-yellow-700">
            improvement
          </Badge>
        );
      case "issue":
        return (
            <Badge className="rounded-xl bg-red-100 text-red-700">
            improvement
          </Badge>
        );
      case "improvement":
        return (
            <Badge className="rounded-xl bg-blue-100 text-blue-700">
            improvement
          </Badge>
        );
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading feedback...
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <DashboardLayout>
      <div className="p-6 text-center text-muted-foreground border rounded-xl">
        No feedback received yet 🚀
      </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <div className="space-y-8">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold">Feedback</h2>

            <p className="text-sm opacity-90">
              See feedback nad review which is given by guide
            </p>
          </CardContent>
        </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {feedbacks.map((fb) => (
          <Card
            key={fb._id}
            className="hover:shadow-lg transition-all duration-300 border"
          >
            <CardContent className="p-4 space-y-3">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-slate-700">{fb.title}</h3>
                {/* <Badge variant={getBadgeVariant(fb.type)}>{fb.type}</Badge> */}
                {getBadgeVariant(fb.type)}
              </div>

              {/* Message */}
              <p className="text-sm text-muted-foreground">{fb.message}</p>

              {/* Meta Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Project:</strong>  {fb.projectId?.title}</p>
                <p><strong>Guide:</strong> {fb.guideId?.name}</p>
              </div>

              {/* Date */}
              <div className="text-xs text-right text-gray-400">
                {new Date(fb.createdAt).toLocaleDateString("en-GB")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </DashboardLayout>
  );
}

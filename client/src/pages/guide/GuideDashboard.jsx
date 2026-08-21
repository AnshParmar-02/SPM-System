import { useEffect, useState } from "react"
import API from "@/api/axios"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Users, FolderKanban, Bell, Clock } from "lucide-react"
import DashboardLayout from "@/components/Layout/DashboardLayout"

const GuideDashboard = () => {

  const [stats, setStats] = useState({
    students: 0,
    projects: 0,
    pendingRequests: 0
  })

  const [notifications, setNotifications] = useState([])

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchStats()
    fetchNotifications()
  }, [])

  const fetchStats = async () => {

    try {

      const res = await API.get("/guide/dashboard-stat", {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(res.data);
      

      setStats(res.data)

    } catch (error) {
      console.error(error)
    }

  }

  const fetchNotifications = async () => {

    try {

      const res = await API.get("/guide/notification", {
        headers: { Authorization: `Bearer ${token}` }
      })

      setNotifications(res.data)

    } catch (error) {
      console.error(error)
    }

  }

  return (
   <DashboardLayout>
    <div className="space-y-8">

      {/* Welcome Card */}

      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">

        <CardContent className="p-6">

          <h2 className="text-2xl font-semibold">
            Welcome Back 👋
          </h2>

          <p className="text-sm opacity-90 mt-1">
            Manage student projects, proposals and supervision requests
          </p>

        </CardContent>

      </Card>

      {/* Stats Section */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <Card className="hover:shadow-md transition">

          <CardContent className="flex items-center gap-4 p-6">

            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="text-indigo-600"/>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Assigned Students
              </p>

              <p className="text-2xl font-bold">
                {stats.students}
              </p>
            </div>

          </CardContent>

        </Card>

        <Card className="hover:shadow-md transition">

          <CardContent className="flex items-center gap-4 p-6">

            <div className="p-3 bg-purple-100 rounded-lg">
              <FolderKanban className="text-purple-600"/>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Assigned Projects
              </p>

              <p className="text-2xl font-bold">
                {stats.projects}
              </p>
            </div>

          </CardContent>

        </Card>

        <Card className="hover:shadow-md transition">

          <CardContent className="flex items-center gap-4 p-6">

            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="text-orange-600"/>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Pending Requests
              </p>

              <p className="text-2xl font-bold">
                {stats.pendingRequests}
              </p>
            </div>

          </CardContent>

        </Card>

      </div>

      {/* Notifications Section */}

      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle className="flex items-center gap-2">
            <Bell size={18}/>
            Notifications
          </CardTitle>

          <Badge variant="secondary">
            {notifications.length}
          </Badge>

        </CardHeader>

        <CardContent className="space-y-4 max-h-72 overflow-y-auto">

          {notifications.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No notifications
            </p>
          )}

          {notifications.map((note) => (

            <div
              key={note._id}
              className="border rounded-lg p-4 hover:bg-muted/40 transition"
            >

              <p className="text-sm font-medium">
                {note.message}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>

            </div>

          ))}

        </CardContent>

      </Card>

    </div>
   </DashboardLayout>
  )

}

export default GuideDashboard
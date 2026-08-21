import { useEffect, useState } from "react"
import API from "@/api/axios"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Search, Clock } from "lucide-react"
import DashboardLayout from "@/components/Layout/DashboardLayout"
import { toast } from "react-toastify"

const ManageRequest = () => {

  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState("")

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {

      const res = await API.get("/project/guide/pending-requests", {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setRequests(res.data)

    } catch (error) {
      console.error(error)
    }
  }

  const handleAccept = async (id) => {

    try {

      await API.put(`/guide/accept-request/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success("Student request Accepted.")

      fetchRequests()

    } catch (error) {
      toast.error(error)
    }

  }

  const handleReject = async (id) => {

    try {

      await API.put(`/guide/reject-request/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success("Student request rejected.")

      fetchRequests()

    } catch (error) {
      toast.error(error)
    }

  }

  const filteredRequests = requests.filter((req) =>

    req.createdBy.name.toLowerCase().includes(search.toLowerCase()) ||
    req.title.toLowerCase().includes(search.toLowerCase())

  )
  

  return (
   <DashboardLayout>
    <div className="space-y-8">

      {/* Header Card */}

      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">

        <CardContent className="p-6">

          <h2 className="text-2xl font-semibold">
            Pending Supervision Requests
          </h2>

          <p className="text-sm opacity-90 mt-1">
            Review and respond to student supervision requests
          </p>

        </CardContent>

      </Card>


      {/* Search */}

      <div className="relative max-w-md">

        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>

        <Input
          placeholder="Search by student or project name..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="pl-9"
        />

      </div>


      {/* Requests List */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredRequests.length === 0 && (
          <p className="text-muted-foreground">
            No pending requests
          </p>
        )}

        {filteredRequests.map((req) => (

          <Card
            key={req._id}
            className="hover:shadow-md transition"
          >

            <CardHeader>

              <CardTitle className="flex items-center justify-between">

                {req.title}

                <Badge variant="secondary">
                  {req.coordinatorApprovalStatus}
                </Badge>

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-3 text-sm">

              <p>
                <span className="font-medium">Student:</span>{" "}
                {req.createdBy.name}
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                {req.createdBy.email}
              </p>

              <p>
                <span className="font-medium">Project Name:</span>{" "}
                {req.title}
              </p>

              <p className="flex items-center gap-2 text-muted-foreground">

                <Clock size={14}/>

                {new Date(req.createdAt).toLocaleDateString()}

              </p>

              {/* Buttons */}

              <div className="flex gap-3 pt-3">

                <Button
                  className={`flex-1 ${ req.coordinatorApprovalStatus !== "pending" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-400 cursor-not-allowed"}`}
                  onClick={()=>handleAccept(req._id)}
                >
                  Accept
                </Button>

                <Button
                  variant="destructive"
                  className={`flex-1 ${ req.coordinatorApprovalStatus !== "pending" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-red-400 cursor-not-allowed"}`}
                  onClick={()=>handleReject(req._id)}
                >
                  Reject
                </Button>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>
   </DashboardLayout>
  )

}

export default ManageRequest
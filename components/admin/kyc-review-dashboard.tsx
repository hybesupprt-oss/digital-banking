import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, CheckCircle, XCircle, Clock, FileText, User, Calendar } from "lucide-react"

// Mock KYC submissions for admin review
const mockSubmissions = [
  {
    id: "1",
    userId: "user-1",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "in_review",
    documentsCount: 2,
    riskScore: 15,
    priority: "normal",
  },
  {
    id: "2",
    userId: "user-2",
    userName: "Jane Smith",
    userEmail: "jane.smith@example.com",
    submittedAt: "2024-01-14T15:45:00Z",
    status: "pending",
    documentsCount: 3,
    riskScore: 8,
    priority: "low",
  },
  {
    id: "3",
    userId: "user-3",
    userName: "Mike Johnson",
    userEmail: "mike.johnson@example.com",
    submittedAt: "2024-01-13T09:20:00Z",
    status: "pending",
    documentsCount: 2,
    riskScore: 45,
    priority: "high",
  },
]

export function KycReviewDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_review":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 30) return "text-red-600"
    if (score >= 15) return "text-yellow-600"
    return "text-green-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>KYC Submissions</span>
          <Badge variant="secondary">{mockSubmissions.length} submissions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <Avatar>
                  <AvatarFallback>
                    {submission.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-sm">{submission.userName}</p>
                    <Badge className={getPriorityColor(submission.priority)}>{submission.priority} priority</Badge>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {submission.userEmail}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(submission.submittedAt)}
                    </span>
                    <span className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      {submission.documentsCount} documents
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-muted-foreground">Risk Score:</span>
                    <span className={`text-xs font-medium ${getRiskScoreColor(submission.riskScore)}`}>
                      {submission.riskScore}/100
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(submission.status)}>{submission.status.replace("_", " ")}</Badge>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>

                  {submission.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {mockSubmissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No KYC submissions pending review</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

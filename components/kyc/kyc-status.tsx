import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertCircle, XCircle, Shield } from "lucide-react"
import type { User } from "@/lib/auth"

interface KycStatusProps {
  user: User
}

export function KycStatus({ user }: KycStatusProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          title: "Verified",
          description: "Your identity has been successfully verified",
          color: "bg-green-100 text-green-800",
          bgColor: "bg-green-50 border-green-200",
        }
      case "pending":
        return {
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          title: "Verification Pending",
          description: "Please complete your identity verification",
          color: "bg-yellow-100 text-yellow-800",
          bgColor: "bg-yellow-50 border-yellow-200",
        }
      case "in_review":
        return {
          icon: <Clock className="h-5 w-5 text-blue-600" />,
          title: "Under Review",
          description: "We are reviewing your submitted documents",
          color: "bg-blue-100 text-blue-800",
          bgColor: "bg-blue-50 border-blue-200",
        }
      case "rejected":
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          title: "Additional Information Required",
          description: "Please resubmit your verification documents",
          color: "bg-red-100 text-red-800",
          bgColor: "bg-red-50 border-red-200",
        }
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
          title: "Not Started",
          description: "Identity verification not yet started",
          color: "bg-gray-100 text-gray-800",
          bgColor: "bg-gray-50 border-gray-200",
        }
    }
  }

  const statusInfo = getStatusInfo(user.kycStatus)

  return (
    <Card className={statusInfo.bgColor}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Shield className="mr-2 h-5 w-5" />
          Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          {statusInfo.icon}
          <div className="flex-1">
            <Badge className={statusInfo.color}>{statusInfo.title}</Badge>
            <p className="text-sm text-muted-foreground mt-1">{statusInfo.description}</p>
          </div>
        </div>

        {user.kycStatus === "pending" && (
          <Button className="w-full" size="sm">
            Start Verification
          </Button>
        )}

        {user.kycStatus === "rejected" && (
          <Button className="w-full bg-transparent" size="sm" variant="outline">
            Resubmit Documents
          </Button>
        )}

        {user.kycStatus === "in_review" && (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">Review typically takes 1-2 business days</p>
          </div>
        )}

        {user.kycStatus === "approved" && (
          <div className="text-center py-2">
            <p className="text-sm text-green-700">All banking features are now available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

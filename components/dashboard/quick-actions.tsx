import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, CreditCard, FileText, Settings, Shield, AlertCircle, CheckCircle, Clock } from "lucide-react"
import type { User } from "@/lib/auth"

interface QuickActionsProps {
  user: User
}

export function QuickActions({ user }: QuickActionsProps) {
  const getKycStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Verified",
          variant: "default" as const,
          color: "text-green-600",
        }
      case "pending":
        return {
          icon: <Clock className="h-4 w-4" />,
          text: "Verification Pending",
          variant: "secondary" as const,
          color: "text-yellow-600",
        }
      case "in_review":
        return {
          icon: <Clock className="h-4 w-4" />,
          text: "Under Review",
          variant: "secondary" as const,
          color: "text-blue-600",
        }
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Action Required",
          variant: "destructive" as const,
          color: "text-red-600",
        }
    }
  }

  const kycInfo = getKycStatusInfo(user.kycStatus)

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transfer Money
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Bills
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View Statements
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Identity Verification</span>
            <Badge variant={kycInfo.variant} className="flex items-center space-x-1">
              {kycInfo.icon}
              <span>{kycInfo.text}</span>
            </Badge>
          </div>

          {user.kycStatus !== "approved" && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Complete your identity verification to unlock all banking features.
              </p>
              <Button size="sm" className="w-full">
                Complete Verification
              </Button>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Account Type:</span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span>Member Since:</span>
              <span className="font-medium">2024</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-accent">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">Security Notice</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Your account is protected with bank-level security. Never share your login credentials.
              </p>
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

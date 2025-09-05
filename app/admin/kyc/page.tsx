import { requireRole } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KycReviewDashboard } from "@/components/admin/kyc-review-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Clock, CheckCircle } from "lucide-react"

export default async function AdminKycPage() {
  const user = await requireRole(["admin", "manager"])

  // Mock KYC statistics
  const stats = {
    pending: 12,
    inReview: 8,
    approved: 156,
    rejected: 3,
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">KYC Management</h1>
          <p className="text-muted-foreground">Review and manage customer identity verification submissions</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.inReview}</p>
                  <p className="text-sm text-muted-foreground">In Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KYC Review Dashboard */}
        <KycReviewDashboard />
      </main>
    </div>
  )
}

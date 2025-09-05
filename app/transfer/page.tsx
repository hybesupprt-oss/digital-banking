import { requireAuth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TransferForm } from "@/components/transactions/transfer-form"
import { RecentTransfers } from "@/components/transactions/recent-transfers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock } from "lucide-react"

export default async function TransferPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Transfer Money</h1>
          <p className="text-muted-foreground">Send money between your accounts or to other members securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <TransferForm userId={user.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Notice */}
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="mr-2 h-5 w-5 text-accent" />
                  Secure Transfers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p>All transfers are encrypted and monitored for security</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p>Transfers between your accounts are instant</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <p>External transfers may take 1-3 business days</p>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5" />
                  Daily Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Internal Transfers:</span>
                  <span className="font-medium">$10,000</span>
                </div>
                <div className="flex justify-between">
                  <span>External Transfers:</span>
                  <span className="font-medium">$2,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Used Today:</span>
                  <span className="font-medium text-muted-foreground">$0</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transfers */}
            <RecentTransfers userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

import { requireAuth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KycVerificationForm } from "@/components/kyc/kyc-verification-form"
import { KycStatus } from "@/components/kyc/kyc-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText } from "lucide-react"

export default async function KycPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Identity Verification</h1>
          <p className="text-muted-foreground">
            Complete your identity verification to unlock all banking features and ensure account security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KYC Form */}
          <div className="lg:col-span-2">
            <KycVerificationForm user={user} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <KycStatus user={user} />

            {/* Requirements Info */}
            <Card className="border-accent">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="mr-2 h-5 w-5 text-accent" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Identity Verification</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Government-issued photo ID</li>
                    <li>• Driver's license or passport</li>
                    <li>• Must be current and valid</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Address Verification</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Utility bill (last 3 months)</li>
                    <li>• Bank statement</li>
                    <li>• Lease agreement</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Secure & Private</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Your documents are encrypted and stored securely. We comply with all banking regulations and
                      privacy laws.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

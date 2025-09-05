import { requireAuth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AccountOverview } from "@/components/dashboard/account-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { WelcomeBanner } from "@/components/dashboard/welcome-banner"
import { Suspense } from "react"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { welcome?: string }
}) {
  const user = await requireAuth()
  const isNewUser = searchParams.welcome === "true"

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {isNewUser && <WelcomeBanner user={user} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-lg" />}>
              <AccountOverview userId={user.id} />
            </Suspense>

            <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
              <RecentTransactions userId={user.id} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions user={user} />
          </div>
        </div>
      </main>
    </div>
  )
}

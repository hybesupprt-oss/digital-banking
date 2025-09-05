import { Suspense } from "react"
import { AccountDetails } from "@/components/accounts/account-details"
import { AccountActions } from "@/components/accounts/account-actions"
import { AccountAlerts } from "@/components/accounts/account-alerts"

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Account Management</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
            <AccountDetails />
          </Suspense>
        </div>

        <div className="space-y-6">
          <AccountActions />
          <AccountAlerts />
        </div>
      </div>
    </div>
  )
}

import { Suspense } from "react"
import { BillPayDashboard } from "@/components/bill-pay/bill-pay-dashboard"
import { PayeeManagement } from "@/components/bill-pay/payee-management"
import { QuickPay } from "@/components/bill-pay/quick-pay"

export default function BillPayPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Bill Pay & Payments</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
            <BillPayDashboard />
          </Suspense>
          <PayeeManagement />
        </div>

        <div className="space-y-6">
          <QuickPay />
        </div>
      </div>
    </div>
  )
}

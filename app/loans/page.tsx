import { Suspense } from "react"
import { LoanDashboard } from "@/components/loans/loan-dashboard"
import { LoanCalculator } from "@/components/loans/loan-calculator"
import { LoanProducts } from "@/components/loans/loan-products"

export default function LoansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Loans & Credit</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
            <LoanDashboard />
          </Suspense>
          <LoanProducts />
        </div>

        <div className="space-y-6">
          <LoanCalculator />
        </div>
      </div>
    </div>
  )
}

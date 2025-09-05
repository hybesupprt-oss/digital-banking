import { Suspense } from "react"
import { StatementsOverview } from "@/components/statements/statements-overview"
import { StatementFilters } from "@/components/statements/statement-filters"

export default function StatementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Account Statements</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <StatementFilters />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
            <StatementsOverview />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

import { requireAuth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TransactionHistory } from "@/components/transactions/transaction-history"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: {
    account?: string
    type?: string
    dateFrom?: string
    dateTo?: string
    page?: string
  }
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Transaction History</h1>
            <p className="text-muted-foreground">View and manage all your account transactions</p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <TransactionFilters searchParams={searchParams} />
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-3">
            <TransactionHistory userId={user.id} searchParams={searchParams} />
          </div>
        </div>
      </main>
    </div>
  )
}

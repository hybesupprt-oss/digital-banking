import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, CreditCard, Coffee, Fuel, ShoppingCart } from "lucide-react"

interface RecentTransactionsProps {
  userId: string
}

// Mock transaction data for demo
const mockTransactions = [
  {
    id: "1",
    description: "Direct Deposit - Payroll",
    amount: 2500.0,
    type: "credit",
    category: "Income",
    date: "2024-01-15",
    status: "completed",
    account: "Primary Checking",
  },
  {
    id: "2",
    description: "Starbucks Coffee",
    amount: -4.85,
    type: "debit",
    category: "Food & Dining",
    date: "2024-01-14",
    status: "completed",
    account: "Primary Checking",
  },
  {
    id: "3",
    description: "Shell Gas Station",
    amount: -45.2,
    type: "debit",
    category: "Gas & Fuel",
    date: "2024-01-14",
    status: "completed",
    account: "Primary Checking",
  },
  {
    id: "4",
    description: "Amazon Purchase",
    amount: -89.99,
    type: "debit",
    category: "Shopping",
    date: "2024-01-13",
    status: "completed",
    account: "Rewards Credit Card",
  },
  {
    id: "5",
    description: "Transfer to Savings",
    amount: -500.0,
    type: "transfer",
    category: "Transfer",
    date: "2024-01-12",
    status: "completed",
    account: "Primary Checking",
  },
]

export async function RecentTransactions({ userId }: RecentTransactionsProps) {
  // In production, fetch real transaction data:
  // const transactions = await sql`SELECT * FROM transactions WHERE from_account_id IN (SELECT id FROM accounts WHERE user_id = ${userId}) OR to_account_id IN (SELECT id FROM accounts WHERE user_id = ${userId}) ORDER BY created_at DESC LIMIT 10`

  const transactions = mockTransactions

  const getTransactionIcon = (category: string, type: string) => {
    if (type === "transfer") return <ArrowUpRight className="h-4 w-4" />

    switch (category.toLowerCase()) {
      case "income":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "food & dining":
        return <Coffee className="h-4 w-4" />
      case "gas & fuel":
        return <Fuel className="h-4 w-4" />
      case "shopping":
        return <ShoppingCart className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-muted rounded-full">
                  {getTransactionIcon(transaction.category, transaction.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{transaction.account}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-foreground"}`}>
                  {transaction.amount > 0 ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
                <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent transactions</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

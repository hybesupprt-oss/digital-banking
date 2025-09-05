import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowDownLeft,
  ArrowRightLeft,
  CreditCard,
  Building,
  Coffee,
  Fuel,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface TransactionHistoryProps {
  userId: string
  searchParams: {
    account?: string
    type?: string
    dateFrom?: string
    dateTo?: string
    page?: string
  }
}

// Extended mock transaction data
const mockTransactions = [
  {
    id: "1",
    transactionNumber: "TXN20240115001234",
    description: "Direct Deposit - Payroll",
    amount: 2500.0,
    type: "credit",
    category: "Income",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    account: "Primary Checking",
    accountId: "1",
    balance: 2847.52,
  },
  {
    id: "2",
    transactionNumber: "TXN20240114001235",
    description: "Transfer to Savings",
    amount: -500.0,
    type: "transfer",
    category: "Transfer",
    date: "2024-01-14T15:45:00Z",
    status: "completed",
    account: "Primary Checking",
    accountId: "1",
    balance: 347.52,
    relatedAccount: "High Yield Savings",
  },
  {
    id: "3",
    transactionNumber: "TXN20240114001236",
    description: "Starbucks Coffee",
    amount: -4.85,
    type: "debit",
    category: "Food & Dining",
    date: "2024-01-14T08:20:00Z",
    status: "completed",
    account: "Primary Checking",
    accountId: "1",
    balance: 847.52,
  },
  {
    id: "4",
    transactionNumber: "TXN20240113001237",
    description: "Shell Gas Station",
    amount: -45.2,
    type: "debit",
    category: "Gas & Fuel",
    date: "2024-01-13T17:10:00Z",
    status: "completed",
    account: "Primary Checking",
    accountId: "1",
    balance: 852.37,
  },
  {
    id: "5",
    transactionNumber: "TXN20240112001238",
    description: "Amazon Purchase",
    amount: -89.99,
    type: "debit",
    category: "Shopping",
    date: "2024-01-12T14:30:00Z",
    status: "completed",
    account: "Rewards Credit Card",
    accountId: "3",
    balance: -342.18,
  },
  {
    id: "6",
    transactionNumber: "TXN20240111001239",
    description: "Monthly Interest Payment",
    amount: 12.45,
    type: "credit",
    category: "Interest",
    date: "2024-01-11T00:01:00Z",
    status: "completed",
    account: "High Yield Savings",
    accountId: "2",
    balance: 15420.89,
  },
]

export function TransactionHistory({ userId, searchParams }: TransactionHistoryProps) {
  // In production, this would filter and paginate based on searchParams
  const transactions = mockTransactions
  const currentPage = Number.parseInt(searchParams.page || "1")
  const totalPages = Math.ceil(transactions.length / 10)

  const getTransactionIcon = (category: string, type: string) => {
    if (type === "transfer") return <ArrowRightLeft className="h-4 w-4 text-blue-600" />
    if (type === "credit") return <ArrowDownLeft className="h-4 w-4 text-green-600" />

    switch (category.toLowerCase()) {
      case "food & dining":
        return <Coffee className="h-4 w-4 text-orange-600" />
      case "gas & fuel":
        return <Fuel className="h-4 w-4 text-red-600" />
      case "shopping":
        return <ShoppingCart className="h-4 w-4 text-purple-600" />
      case "income":
        return <Building className="h-4 w-4 text-green-600" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount))
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transaction History</span>
          <Badge variant="secondary">{transactions.length} transactions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {transactions.map((transaction) => {
            const dateTime = formatDateTime(transaction.date)

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-muted rounded-full">
                    {getTransactionIcon(transaction.category, transaction.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-sm truncate">{transaction.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{transaction.account}</span>
                      <span>•</span>
                      <span>{dateTime.date}</span>
                      <span>•</span>
                      <span>{dateTime.time}</span>
                      <span>•</span>
                      <span className="font-mono">{transaction.transactionNumber}</span>
                    </div>

                    {transaction.relatedAccount && (
                      <p className="text-xs text-muted-foreground mt-1">To: {transaction.relatedAccount}</p>
                    )}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-foreground"}`}>
                    {transaction.amount > 0 ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>

                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">Balance: {formatCurrency(transaction.balance)}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, Clock } from "lucide-react"

interface RecentTransfersProps {
  userId: string
}

// Mock recent transfers data
const mockRecentTransfers = [
  {
    id: "1",
    fromAccount: "Primary Checking",
    toAccount: "High Yield Savings",
    amount: 500.0,
    date: "2024-01-15",
    status: "completed",
    description: "Monthly savings transfer",
  },
  {
    id: "2",
    fromAccount: "High Yield Savings",
    toAccount: "Primary Checking",
    amount: 200.0,
    date: "2024-01-12",
    status: "completed",
    description: "Emergency fund withdrawal",
  },
  {
    id: "3",
    fromAccount: "Primary Checking",
    toAccount: "High Yield Savings",
    amount: 1000.0,
    date: "2024-01-10",
    status: "completed",
    description: "Investment transfer",
  },
]

export function RecentTransfers({ userId }: RecentTransfersProps) {
  const transfers = mockRecentTransfers

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Clock className="mr-2 h-5 w-5" />
          Recent Transfers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{formatCurrency(transfer.amount)}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {transfer.status}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>From: {transfer.fromAccount}</p>
                <p>To: {transfer.toAccount}</p>
                <p>{formatDate(transfer.date)}</p>
              </div>

              {transfer.description && (
                <p className="text-xs text-muted-foreground mt-2 italic">{transfer.description}</p>
              )}
            </div>
          ))}

          {transfers.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <ArrowRightLeft className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent transfers</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

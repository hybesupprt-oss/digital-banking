import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, PiggyBank, TrendingUp, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface AccountOverviewProps {
  userId: string
}

// Mock data for demo - in production this would fetch from database
const mockAccounts = [
  {
    id: "1",
    accountNumber: "****1234",
    accountType: "checking",
    accountName: "Primary Checking",
    balance: 2847.52,
    availableBalance: 2847.52,
    accountStatus: "active",
  },
  {
    id: "2",
    accountNumber: "****5678",
    accountType: "savings",
    accountName: "High Yield Savings",
    balance: 15420.89,
    availableBalance: 15420.89,
    accountStatus: "active",
  },
  {
    id: "3",
    accountNumber: "****9012",
    accountType: "credit_card",
    accountName: "Rewards Credit Card",
    balance: -342.18,
    availableBalance: 4657.82,
    accountStatus: "active",
  },
]

export async function AccountOverview({ userId }: AccountOverviewProps) {
  // In production, fetch real account data:
  // const accounts = await sql`SELECT * FROM accounts WHERE user_id = ${userId} AND account_status = 'active'`

  const accounts = mockAccounts
  const totalBalance = accounts
    .filter((acc) => acc.accountType !== "credit_card")
    .reduce((sum, acc) => sum + acc.balance, 0)

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-5 w-5" />
      case "savings":
        return <PiggyBank className="h-5 w-5" />
      case "credit_card":
        return <CreditCard className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "checking":
        return "Checking"
      case "savings":
        return "Savings"
      case "credit_card":
        return "Credit Card"
      default:
        return type
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Total Balance Summary */}
      <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total Balance</span>
            <TrendingUp className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{formatCurrency(totalBalance)}</div>
          <p className="text-primary-foreground/80">
            Across {accounts.filter((acc) => acc.accountType !== "credit_card").length} accounts
          </p>
        </CardContent>
      </Card>

      {/* Individual Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getAccountIcon(account.accountType)}
                  <div>
                    <CardTitle className="text-base">{account.accountName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                  </div>
                </div>
                <Badge variant="secondary">{getAccountTypeLabel(account.accountType)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">
                    {account.accountType === "credit_card" ? "Current Balance" : "Available Balance"}
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(account.accountType === "credit_card" ? Math.abs(account.balance) : account.balance)}
                </div>
                {account.accountType === "credit_card" && (
                  <p className="text-sm text-muted-foreground">
                    Available Credit: {formatCurrency(account.availableBalance)}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  {account.accountType === "credit_card" ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Pay
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      Transfer
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

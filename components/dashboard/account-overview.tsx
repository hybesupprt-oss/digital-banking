import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, PiggyBank, TrendingUp, Eye, ArrowUpRight, ArrowDownRight, Shield } from "lucide-react"

interface AccountOverviewProps {
  userId: string
}

// Mock data for demo - in production this would fetch from database
const mockAccounts = [
  {
    id: "1",
    accountNumber: "****1234",
    accountType: "checking",
    accountName: "First City Credit Union Everyday Checking",
    balance: 2847.52,
    availableBalance: 2847.52,
    accountStatus: "active",
  },
  {
    id: "2",
    accountNumber: "****5678",
    accountType: "savings",
    accountName: "Way2Save Savings",
    balance: 15420.89,
    availableBalance: 15420.89,
    accountStatus: "active",
  },
  {
    id: "3",
    accountNumber: "****9012",
    accountType: "credit_card",
    accountName: "First City Credit Union Active Cash Card",
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
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center space-x-3">
              <div className="bg-accent/20 p-2 rounded-full">
                <Shield className="h-6 w-6" />
              </div>
              <span className="font-bold">Total Portfolio Balance</span>
            </div>
            <TrendingUp className="h-6 w-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-3 tracking-tight">{formatCurrency(totalBalance)}</div>
          <div className="flex items-center justify-between">
            <p className="text-primary-foreground/90 font-medium">
              Across {accounts.filter((acc) => acc.accountType !== "credit_card").length} deposit accounts
            </p>
            <Badge variant="secondary" className="bg-accent/20 text-primary-foreground border-accent/30">
              FDIC Insured
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-all duration-200 border-border/50 bg-card">
            <CardHeader className="pb-4 border-b border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">{getAccountIcon(account.accountType)}</div>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">{account.accountName}</CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">{account.accountNumber}</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-accent/10 text-accent-foreground border-accent/20 font-semibold"
                >
                  {getAccountTypeLabel(account.accountType)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground font-medium">
                    {account.accountType === "credit_card" ? "Current Balance" : "Available Balance"}
                  </span>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {formatCurrency(account.accountType === "credit_card" ? Math.abs(account.balance) : account.balance)}
                </div>
                {account.accountType === "credit_card" && (
                  <p className="text-sm text-muted-foreground font-medium">
                    Available Credit:{" "}
                    <span className="text-accent font-semibold">{formatCurrency(account.availableBalance)}</span>
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-border hover:bg-muted font-semibold bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 font-semibold">
                  {account.accountType === "credit_card" ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Make Payment
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 mr-2" />
                      Transfer Funds
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

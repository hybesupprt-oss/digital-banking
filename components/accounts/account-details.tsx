"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, CreditCard, Landmark, PiggyBank } from "lucide-react"

interface Account {
  id: string
  account_number: string
  account_type: string
  balance: number
  available_balance: number
  interest_rate: number
  opened_date: string
  status: string
}

export function AccountDetails() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [showBalances, setShowBalances] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching account data
    setTimeout(() => {
      setAccounts([
        {
          id: "1",
          account_number: "****1234",
          account_type: "checking",
          balance: 5420.5,
          available_balance: 5420.5,
          interest_rate: 0.01,
          opened_date: "2020-03-15",
          status: "active",
        },
        {
          id: "2",
          account_number: "****5678",
          account_type: "savings",
          balance: 12750.25,
          available_balance: 12750.25,
          interest_rate: 2.5,
          opened_date: "2020-03-15",
          status: "active",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <CreditCard className="w-5 h-5" />
      case "savings":
        return <PiggyBank className="w-5 h-5" />
      case "business":
        return <Landmark className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const formatAccountType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + " Account"
  }

  if (loading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Account Details</CardTitle>
            <CardDescription>Comprehensive view of your Wells Fargo accounts</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowBalances(!showBalances)}>
            {showBalances ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showBalances ? "Hide" : "Show"} Balances
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {accounts.map((account) => (
              <Card key={account.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        {getAccountIcon(account.account_type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{formatAccountType(account.account_type)}</h3>
                        <p className="text-sm text-muted-foreground">{account.account_number}</p>
                      </div>
                    </div>
                    <Badge variant={account.status === "active" ? "default" : "secondary"}>
                      {account.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="text-2xl font-bold text-primary">
                        {showBalances
                          ? `$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : "••••••"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-lg font-semibold">
                        {showBalances
                          ? `$${account.available_balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                          : "••••••"}
                      </p>
                    </div>
                  </div>

                  {account.account_type === "savings" && (
                    <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Annual Percentage Yield (APY)</p>
                      <p className="text-lg font-semibold text-accent-foreground">{account.interest_rate}%</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">
                    {formatAccountType(account.account_type)} - {account.account_number}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Account Opened</p>
                      <p className="font-medium">{new Date(account.opened_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Account Status</p>
                      <p className="font-medium">{account.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Routing Number</p>
                      <p className="font-medium">121000248</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">FDIC Insured</p>
                      <p className="font-medium text-green-600">Yes - Up to $250,000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Account Features & Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>Online & Mobile Banking</span>
                    <Badge variant="default">Included</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>Bill Pay Service</span>
                    <Badge variant="default">Free</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>ATM Access Nationwide</span>
                    <Badge variant="default">13,000+ ATMs</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>Overdraft Protection</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

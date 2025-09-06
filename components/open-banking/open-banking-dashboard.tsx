"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Building2,
  Plus,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Wallet,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import type { LinkedAccount, ExternalTransaction } from "@/lib/open-banking"

interface OpenBankingDashboardProps {
  userId: string
}

export function OpenBankingDashboard({ userId }: OpenBankingDashboardProps) {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([])
  const [transactions, setTransactions] = useState<ExternalTransaction[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadAccountData()
  }, [userId])

  const loadAccountData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/open-banking/overview?userId=${encodeURIComponent(userId)}`)
      if (!res.ok) throw new Error('Failed to fetch overview')
      const overview = await res.json()
      setAccounts(overview.accounts || [])
      setTransactions(overview.recentTransactions || [])
      setTotalBalance(overview.totalBalance || 0)
    } catch (error) {
      console.error("Failed to load account data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncBalances = async () => {
    try {
      setSyncing(true)
      const res = await fetch('/api/open-banking/sync', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userId }) })
      if (!res.ok) throw new Error('Sync failed')
      await loadAccountData()
    } catch (error) {
      console.error("Failed to sync balances:", error)
    } finally {
      setSyncing(false)
    }
  }

  const handleLinkAccount = async () => {
    try {
      const res = await fetch('/api/open-banking/providers?country=US')
      const data = await res.json()
      console.log('Available providers:', data.providers)
    } catch (error) {
      console.error('Failed to get providers:', error)
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <Wallet className="h-5 w-5 text-blue-500" />
      case "savings":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "credit":
        return <CreditCard className="h-5 w-5 text-orange-500" />
      default:
        return <Building2 className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Connected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "consent_expired":
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading connected accounts...</div>
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Balance Across All Accounts</p>
                <p className="text-3xl font-bold text-foreground">${totalBalance.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+2.1% this month</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected Accounts</p>
                <p className="text-2xl font-bold text-foreground">{accounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                <p className="text-2xl font-bold text-foreground">
                  {accounts.filter((a) => a.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
            <Button onClick={handleSyncBalances} disabled={syncing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              Sync Balances
            </Button>
            <Button onClick={handleLinkAccount} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Link Account
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Overview of all connected accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getAccountIcon(account.accountType)}
                      <div>
                        <p className="font-medium">{account.institutionName}</p>
                        <p className="text-sm text-muted-foreground">
                          {account.accountName} • {account.accountNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${account.balance.toLocaleString()}</p>
                      {getStatusBadge(account.status)}
                    </div>
                  </div>
                ))}

                {accounts.length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No accounts connected yet</p>
                    <Button onClick={handleLinkAccount} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Link Your First Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions across all accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {transaction.type === "debit" ? (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        transaction.type === "debit" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {transaction.type === "debit" ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No recent transactions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid gap-4">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getAccountIcon(account.accountType)}
                      <div>
                        <h3 className="font-semibold">{account.institutionName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {account.accountName} • {account.accountNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last synced: {new Date(account.lastSynced).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${account.balance.toLocaleString()}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusBadge(account.status)}
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {account.status === "consent_expired" && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your consent has expired. Please reconnect this account to continue syncing data.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>Complete transaction history from all connected accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {transaction.type === "debit" ? (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.merchantName && `${transaction.merchantName} • `}
                          {transaction.category}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "debit" ? "text-red-600" : "text-green-600"}`}
                      >
                        {transaction.type === "debit" ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{transaction.currency}</p>
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

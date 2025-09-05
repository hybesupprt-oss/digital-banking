"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bitcoin, Zap, Globe, Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface CryptoDashboardProps {
  userId: string
}

interface CryptoWallet {
  id: string
  type: "bitcoin" | "lightning" | "stellar"
  address: string
  balance: number
  balanceUSD: number
  isActive: boolean
}

export function CryptoDashboard({ userId }: CryptoDashboardProps) {
  const [wallets, setWallets] = useState<CryptoWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadWallets()
  }, [userId])

  const loadWallets = async () => {
    try {
      // Simulate loading wallets
      setWallets([
        {
          id: "btc-wallet-1",
          type: "bitcoin",
          address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          balance: 0.05432,
          balanceUSD: 2444.4,
          isActive: true,
        },
        {
          id: "ln-wallet-1",
          type: "lightning",
          address: `${userId}@wellsfargo-lightning.com`,
          balance: 0.00123,
          balanceUSD: 55.35,
          isActive: true,
        },
        {
          id: "xlm-wallet-1",
          type: "stellar",
          address: "GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A",
          balance: 1000.0,
          balanceUSD: 120.0,
          isActive: true,
        },
      ])
    } catch (error) {
      console.error("Failed to load wallets:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWalletIcon = (type: string) => {
    switch (type) {
      case "bitcoin":
        return <Bitcoin className="h-6 w-6 text-orange-500" />
      case "lightning":
        return <Zap className="h-6 w-6 text-yellow-500" />
      case "stellar":
        return <Globe className="h-6 w-6 text-blue-500" />
      default:
        return <Wallet className="h-6 w-6" />
    }
  }

  const getWalletName = (type: string) => {
    switch (type) {
      case "bitcoin":
        return "Bitcoin Wallet"
      case "lightning":
        return "Lightning Network"
      case "stellar":
        return "Stellar Wallet"
      default:
        return "Crypto Wallet"
    }
  }

  const getCurrencySymbol = (type: string) => {
    switch (type) {
      case "bitcoin":
      case "lightning":
        return "BTC"
      case "stellar":
        return "XLM"
      default:
        return ""
    }
  }

  const totalUSDBalance = wallets.reduce((sum, wallet) => sum + wallet.balanceUSD, 0)

  if (loading) {
    return <div className="flex justify-center p-8">Loading crypto wallets...</div>
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-foreground">${totalUSDBalance.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+5.2% (24h)</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Bitcoin className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bitcoin</p>
                <p className="text-xl font-bold">$45,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stellar</p>
                <p className="text-xl font-bold">$0.12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {wallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getWalletIcon(wallet.type)}
                      <div>
                        <h3 className="font-semibold">{getWalletName(wallet.type)}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{wallet.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {wallet.balance.toFixed(8)} {getCurrencySymbol(wallet.type)}
                      </p>
                      <p className="text-sm text-muted-foreground">${wallet.balanceUSD.toFixed(2)}</p>
                      <Badge variant={wallet.isActive ? "default" : "secondary"} className="mt-1">
                        {wallet.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <ArrowDownLeft className="h-4 w-4 mr-1" />
                      Receive
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Crypto Payment</CardTitle>
              <CardDescription>Send Bitcoin, Lightning, or Stellar payments instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Bitcoin className="h-6 w-6 mb-2 text-orange-500" />
                    Bitcoin
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Zap className="h-6 w-6 mb-2 text-yellow-500" />
                    Lightning
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Globe className="h-6 w-6 mb-2 text-blue-500" />
                    Stellar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receive Crypto</CardTitle>
              <CardDescription>Share your wallet addresses to receive payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getWalletIcon(wallet.type)}
                        <div>
                          <p className="font-medium">{getWalletName(wallet.type)}</p>
                          <p className="text-sm text-muted-foreground font-mono">{wallet.address}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Copy Address
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your crypto transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Your crypto transactions will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

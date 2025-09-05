"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ACHTransferForm } from "./ach-transfer-form"
import { ExternalAccountForm } from "./external-account-form"
import { PaymentHistory } from "./payment-history"
import { PaymentLimits } from "./payment-limits"
import { ArrowUpRight, ArrowDownLeft, Building2, CreditCard } from "lucide-react"

interface PaymentsDashboardProps {
  userId: string
}

export function PaymentsDashboard({ userId }: PaymentsDashboardProps) {
  const [activeTab, setActiveTab] = useState("transfer")

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("transfer")}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Send Money</p>
                <p className="text-2xl font-bold text-foreground">ACH Transfer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("receive")}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <ArrowDownLeft className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receive Money</p>
                <p className="text-2xl font-bold text-foreground">Direct Deposit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("accounts")}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Link Account</p>
                <p className="text-2xl font-bold text-foreground">External Bank</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("limits")}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-muted/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">View Limits</p>
                <p className="text-2xl font-bold text-foreground">Payment Limits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transfer">Send Money</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
          <TabsTrigger value="accounts">External Accounts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="transfer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Money via ACH</CardTitle>
              <CardDescription>Transfer money to external bank accounts or other First City Credit Union customers</CardDescription>
            </CardHeader>
            <CardContent>
              <ACHTransferForm userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Receive Money</CardTitle>
              <CardDescription>Set up direct deposit and receive transfers from other accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Your Account Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Routing Number</p>
                      <p className="font-mono">121000248</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Account Number</p>
                      <p className="font-mono">****1234</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>External Bank Accounts</CardTitle>
              <CardDescription>Link external bank accounts for transfers and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <ExternalAccountForm userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <PaymentHistory userId={userId} />
        </TabsContent>

        <TabsContent value="limits" className="space-y-6">
          <PaymentLimits userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

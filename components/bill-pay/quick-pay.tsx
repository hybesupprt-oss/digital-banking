"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Zap, Calendar, DollarSign } from "lucide-react"

export function QuickPay() {
  const [amount, setAmount] = useState("")
  const [selectedPayee, setSelectedPayee] = useState("")
  const [paymentDate, setPaymentDate] = useState("")

  const quickPayees = ["First City Credit Union Credit Card", "Pacific Gas & Electric", "Comcast", "First City Credit Union Mortgage"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Quick Pay</span>
          </CardTitle>
          <CardDescription>Make a one-time payment quickly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="payee">Select Payee</Label>
            <Select value={selectedPayee} onValueChange={setSelectedPayee}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a payee" />
              </SelectTrigger>
              <SelectContent>
                {quickPayees.map((payee) => (
                  <SelectItem key={payee} value={payee}>
                    {payee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Payment Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date">Payment Date</Label>
            <Input id="date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="account">From Account</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking ****1234</SelectItem>
                <SelectItem value="savings">Savings ****5678</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Payment
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Limits</CardTitle>
          <CardDescription>Your current payment limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Daily Limit</span>
            <span className="text-sm font-medium">$5,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Monthly Limit</span>
            <span className="text-sm font-medium">$25,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Used Today</span>
            <span className="text-sm font-medium text-primary">$339.44</span>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
            Request Limit Increase
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

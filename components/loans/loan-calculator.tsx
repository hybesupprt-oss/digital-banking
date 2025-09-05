"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, DollarSign } from "lucide-react"

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)

  const calculatePayment = () => {
    const principal = Number.parseFloat(loanAmount)
    const rate = Number.parseFloat(interestRate) / 100 / 12
    const term = Number.parseInt(loanTerm) * 12

    if (principal && rate && term) {
      const payment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
      setMonthlyPayment(payment)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calculator className="w-5 h-5" />
            <span>Loan Calculator</span>
          </CardTitle>
          <CardDescription>Calculate your monthly payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Loan Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="amount"
                type="number"
                placeholder="25,000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rate">Interest Rate (%)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              placeholder="4.25"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="term">Loan Term</Label>
            <Select value={loanTerm} onValueChange={setLoanTerm}>
              <SelectTrigger>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Year</SelectItem>
                <SelectItem value="2">2 Years</SelectItem>
                <SelectItem value="3">3 Years</SelectItem>
                <SelectItem value="5">5 Years</SelectItem>
                <SelectItem value="7">7 Years</SelectItem>
                <SelectItem value="10">10 Years</SelectItem>
                <SelectItem value="15">15 Years</SelectItem>
                <SelectItem value="30">30 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calculatePayment} className="w-full bg-primary hover:bg-primary/90">
            Calculate Payment
          </Button>

          {monthlyPayment && (
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</p>
              <p className="text-2xl font-bold text-primary">${monthlyPayment.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Rates</CardTitle>
          <CardDescription>As low as (APR)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Personal Loans</span>
            <span className="text-sm font-medium">5.99%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Auto Loans</span>
            <span className="text-sm font-medium">4.25%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Home Equity</span>
            <span className="text-sm font-medium">6.50%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Mortgages</span>
            <span className="text-sm font-medium">6.75%</span>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
            View All Rates
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

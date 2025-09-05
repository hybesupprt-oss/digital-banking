"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowRightLeft, DollarSign, AlertCircle, CheckCircle } from "lucide-react"

interface TransferFormProps {
  userId: string
}

interface Account {
  id: string
  accountName: string
  accountNumber: string
  accountType: string
  balance: number
}

// Mock account data - in production this would be fetched from the database
const mockAccounts: Account[] = [
  {
    id: "1",
    accountName: "Primary Checking",
    accountNumber: "****1234",
    accountType: "checking",
    balance: 2847.52,
  },
  {
    id: "2",
    accountName: "High Yield Savings",
    accountNumber: "****5678",
    accountType: "savings",
    balance: 15420.89,
  },
]

export function TransferForm({ userId }: TransferFormProps) {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
    transferType: "internal", // internal, external
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
    setSuccess("")
  }

  const validateTransfer = () => {
    const amount = Number.parseFloat(formData.amount)

    if (!formData.fromAccount || !formData.toAccount) {
      return "Please select both source and destination accounts"
    }

    if (formData.fromAccount === formData.toAccount) {
      return "Source and destination accounts must be different"
    }

    if (!amount || amount <= 0) {
      return "Please enter a valid amount greater than $0"
    }

    if (amount > 10000) {
      return "Transfer amount exceeds daily limit of $10,000"
    }

    const fromAccount = accounts.find((acc) => acc.id === formData.fromAccount)
    if (fromAccount && amount > fromAccount.balance) {
      return "Insufficient funds in source account"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const validationError = validateTransfer()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/transactions/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAccountId: formData.fromAccount,
          toAccountId: formData.toAccount,
          amount: Number.parseFloat(formData.amount),
          description: formData.description || "Internal transfer",
          transferType: formData.transferType,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Transfer of $${formData.amount} completed successfully!`)
        setFormData({
          fromAccount: "",
          toAccount: "",
          amount: "",
          description: "",
          transferType: "internal",
        })
        // Refresh account balances
        // In production, this would refetch from the API
      } else {
        setError(data.error || "Transfer failed. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const selectedFromAccount = accounts.find((acc) => acc.id === formData.fromAccount)
  const availableToAccounts = accounts.filter((acc) => acc.id !== formData.fromAccount)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRightLeft className="mr-2 h-5 w-5" />
          Transfer Funds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* From Account */}
          <div className="space-y-2">
            <Label htmlFor="fromAccount">From Account</Label>
            <Select
              value={formData.fromAccount}
              onValueChange={(value) => handleInputChange("fromAccount", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="font-medium">{account.accountName}</span>
                        <span className="text-muted-foreground ml-2">{account.accountNumber}</span>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {formatCurrency(account.balance)}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFromAccount && (
              <p className="text-sm text-muted-foreground">
                Available balance: {formatCurrency(selectedFromAccount.balance)}
              </p>
            )}
          </div>

          {/* To Account */}
          <div className="space-y-2">
            <Label htmlFor="toAccount">To Account</Label>
            <Select
              value={formData.toAccount}
              onValueChange={(value) => handleInputChange("toAccount", value)}
              disabled={isLoading || !formData.fromAccount}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {availableToAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="font-medium">{account.accountName}</span>
                        <span className="text-muted-foreground ml-2">{account.accountNumber}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Transfer Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max="10000"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <p className="text-sm text-muted-foreground">Daily limit: $10,000 for internal transfers</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this transfer for?"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Transfer Summary */}
          {formData.fromAccount && formData.toAccount && formData.amount && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium">Transfer Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>From:</span>
                  <span>{accounts.find((acc) => acc.id === formData.fromAccount)?.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span>{accounts.find((acc) => acc.id === formData.toAccount)?.accountName}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Amount:</span>
                  <span>{formatCurrency(Number.parseFloat(formData.amount) || 0)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Processing Time:</span>
                  <span>Instant</span>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.fromAccount || !formData.toAccount || !formData.amount}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Transfer...
              </>
            ) : (
              <>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Transfer Funds
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

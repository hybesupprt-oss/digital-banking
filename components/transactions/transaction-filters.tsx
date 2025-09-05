"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface TransactionFiltersProps {
  searchParams: {
    account?: string
    type?: string
    dateFrom?: string
    dateTo?: string
    page?: string
  }
}

const accountOptions = [
  { value: "1", label: "Primary Checking" },
  { value: "2", label: "High Yield Savings" },
  { value: "3", label: "Rewards Credit Card" },
]

const typeOptions = [
  { value: "all", label: "All Transactions" },
  { value: "credit", label: "Credits" },
  { value: "debit", label: "Debits" },
  { value: "transfer", label: "Transfers" },
]

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "income", label: "Income" },
  { value: "food-dining", label: "Food & Dining" },
  { value: "gas-fuel", label: "Gas & Fuel" },
  { value: "shopping", label: "Shopping" },
  { value: "transfer", label: "Transfers" },
  { value: "interest", label: "Interest" },
]

export function TransactionFilters({ searchParams }: TransactionFiltersProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const [filters, setFilters] = useState({
    account: searchParams.account || "all",
    type: searchParams.type || "all",
    category: "all",
    dateFrom: searchParams.dateFrom || "",
    dateTo: searchParams.dateTo || "",
  })

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value)
      }
    })

    router.push(`/transactions?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      account: "all",
      type: "all",
      category: "all",
      dateFrom: "",
      dateTo: "",
    })
    router.push("/transactions")
  }

  const hasActiveFilters = Object.values(filters).some((value) => value && value !== "all")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Filter className="mr-2 h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Account Filter */}
        <div className="space-y-2">
          <Label>Account</Label>
          <Select value={filters.account} onValueChange={(value) => updateFilter("account", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accountOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Type Filter */}
        <div className="space-y-2">
          <Label>Transaction Type</Label>
          <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="From date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
            />
            <Input
              type="date"
              placeholder="To date"
              value={filters.dateTo}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="space-y-2 pt-4 border-t">
          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>

          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-2 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.account !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Account: {accountOptions.find((opt) => opt.value === filters.account)?.label}
                </Badge>
              )}
              {filters.type !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Type: {typeOptions.find((opt) => opt.value === filters.type)?.label}
                </Badge>
              )}
              {filters.dateFrom && (
                <Badge variant="secondary" className="text-xs">
                  From: {filters.dateFrom}
                </Badge>
              )}
              {filters.dateTo && (
                <Badge variant="secondary" className="text-xs">
                  To: {filters.dateTo}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

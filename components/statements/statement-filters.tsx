"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Filter } from "lucide-react"

export function StatementFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filter Statements</span>
        </CardTitle>
        <CardDescription>Customize your statement view</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Account Type</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="checking">Checking</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Time Period</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Last 12 Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="24months">Last 24 Months</SelectItem>
              <SelectItem value="all">All Available</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Document Type</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="statements">Monthly Statements</SelectItem>
              <SelectItem value="tax">Tax Documents</SelectItem>
              <SelectItem value="notices">Account Notices</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>

        <Button variant="outline" className="w-full bg-transparent" size="sm">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}

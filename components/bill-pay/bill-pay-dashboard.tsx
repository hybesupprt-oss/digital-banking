"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, DollarSign, Plus, Edit, Trash2 } from "lucide-react"

interface Payment {
  id: string
  payee: string
  amount: number
  due_date: string
  status: string
  account_from: string
  recurring: boolean
}

interface ScheduledPayment {
  id: string
  payee: string
  amount: number
  next_payment: string
  frequency: string
  account_from: string
}

export function BillPayDashboard() {
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching payment data
    setTimeout(() => {
      setRecentPayments([
        {
          id: "1",
          payee: "First City Credit Union Credit Card",
          amount: 250.0,
          due_date: "2024-01-15",
          status: "completed",
          account_from: "****1234",
          recurring: false,
        },
        {
          id: "2",
          payee: "Pacific Gas & Electric",
          amount: 89.45,
          due_date: "2024-01-10",
          status: "pending",
          account_from: "****1234",
          recurring: true,
        },
        {
          id: "3",
          payee: "Comcast",
          amount: 79.99,
          due_date: "2024-01-08",
          status: "completed",
          account_from: "****1234",
          recurring: true,
        },
      ])

      setScheduledPayments([
        {
          id: "1",
          payee: "Pacific Gas & Electric",
          amount: 89.45,
          next_payment: "2024-02-10",
          frequency: "Monthly",
          account_from: "****1234",
        },
        {
          id: "2",
          payee: "Comcast",
          amount: 79.99,
          next_payment: "2024-02-08",
          frequency: "Monthly",
          account_from: "****1234",
        },
        {
          id: "3",
          payee: "First City Credit Union Mortgage",
          amount: 1850.0,
          next_payment: "2024-02-01",
          frequency: "Monthly",
          account_from: "****1234",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Payment Center</CardTitle>
            <CardDescription>Manage your bills and scheduled payments</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Payment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent Payments</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Bills</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{payment.payee}</h3>
                      <p className="text-sm text-muted-foreground">
                        From: {payment.account_from} • {new Date(payment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <div className="space-y-3">
              {scheduledPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-accent/10 rounded-full">
                      <Clock className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{payment.payee}</h3>
                      <p className="text-sm text-muted-foreground">
                        {payment.frequency} • Next: {new Date(payment.next_payment).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">From: {payment.account_from}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Upcoming Bills</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You're all caught up! No bills are due in the next 7 days.
              </p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Bill Reminder
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

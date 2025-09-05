"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Home, Car, GraduationCap, Plus, Calendar, DollarSign } from "lucide-react"

interface LoanApplication {
  id: string
  type: string
  amount: number
  status: string
  submitted_date: string
  progress: number
}

interface ExistingLoan {
  id: string
  type: string
  balance: number
  monthly_payment: number
  next_payment: string
  interest_rate: number
}

export function LoanDashboard() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [existingLoans, setExistingLoans] = useState<ExistingLoan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching loan data
    setTimeout(() => {
      setApplications([
        {
          id: "APP-001",
          type: "Personal Loan",
          amount: 15000,
          status: "under-review",
          submitted_date: "2024-01-10",
          progress: 75,
        },
        {
          id: "APP-002",
          type: "Auto Loan",
          amount: 25000,
          status: "approved",
          submitted_date: "2024-01-05",
          progress: 100,
        },
      ])

      setExistingLoans([
        {
          id: "LOAN-001",
          type: "Mortgage",
          balance: 285000,
          monthly_payment: 1850,
          next_payment: "2024-02-01",
          interest_rate: 3.75,
        },
        {
          id: "LOAN-002",
          type: "Auto Loan",
          balance: 18500,
          monthly_payment: 425,
          next_payment: "2024-01-25",
          interest_rate: 4.25,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getLoanIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "mortgage":
        return <Home className="w-4 h-4" />
      case "auto loan":
        return <Car className="w-4 h-4" />
      case "personal loan":
        return <DollarSign className="w-4 h-4" />
      case "student loan":
        return <GraduationCap className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "under-review":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Under Review
          </Badge>
        )
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
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
            <CardTitle className="text-xl">Loan Center</CardTitle>
            <CardDescription>Manage your loans and credit applications</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Apply for Loan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">My Loans</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-3">
              {existingLoans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">{getLoanIcon(loan.type)}</div>
                    <div>
                      <h3 className="font-medium">{loan.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        Balance: ${loan.balance.toLocaleString()} • Rate: {loan.interest_rate}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Next payment: {new Date(loan.next_payment).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${loan.monthly_payment}/month</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Make Payment
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {existingLoans.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Active Loans</h3>
                <p className="text-sm text-muted-foreground mb-4">You don't have any active loans with us.</p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Explore Loan Options
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-accent/10 rounded-full text-accent-foreground">
                        {getLoanIcon(app.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{app.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${app.amount.toLocaleString()} • Applied: {new Date(app.submitted_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">{getStatusBadge(app.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Application Progress</span>
                      <span>{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-2" />
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                    View Details
                  </Button>
                </div>
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Pending Applications</h3>
                <p className="text-sm text-muted-foreground mb-4">You don't have any loan applications in progress.</p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Application
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

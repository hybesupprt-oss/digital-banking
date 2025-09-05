"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Building, Zap, Phone, CreditCard } from "lucide-react"

interface Payee {
  id: string
  name: string
  category: string
  account_number: string
  last_payment: string
  status: string
}

export function PayeeManagement() {
  const [payees, setPayees] = useState<Payee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching payees data
    setTimeout(() => {
      setPayees([
        {
          id: "1",
          name: "Wells Fargo Credit Card",
          category: "Credit Card",
          account_number: "****4567",
          last_payment: "2024-01-15",
          status: "active",
        },
        {
          id: "2",
          name: "Pacific Gas & Electric",
          category: "Utilities",
          account_number: "****8901",
          last_payment: "2024-01-10",
          status: "active",
        },
        {
          id: "3",
          name: "Comcast",
          category: "Internet/Cable",
          account_number: "****2345",
          last_payment: "2024-01-08",
          status: "active",
        },
        {
          id: "4",
          name: "Wells Fargo Mortgage",
          category: "Mortgage",
          account_number: "****6789",
          last_payment: "2024-01-01",
          status: "active",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "utilities":
        return <Zap className="w-4 h-4" />
      case "credit card":
        return <CreditCard className="w-4 h-4" />
      case "internet/cable":
        return <Phone className="w-4 h-4" />
      case "mortgage":
        return <Building className="w-4 h-4" />
      default:
        return <Building className="w-4 h-4" />
    }
  }

  const filteredPayees = payees.filter(
    (payee) =>
      payee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payee.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Manage Payees</CardTitle>
            <CardDescription>Add, edit, or remove your bill payees</CardDescription>
          </div>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Payee
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search payees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredPayees.map((payee) => (
            <div
              key={payee.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full text-primary">{getCategoryIcon(payee.category)}</div>
                <div>
                  <h3 className="font-medium">{payee.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {payee.category} • Account: {payee.account_number}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last payment: {new Date(payee.last_payment).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={payee.status === "active" ? "default" : "secondary"}>{payee.status}</Badge>
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

        {filteredPayees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No payees found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

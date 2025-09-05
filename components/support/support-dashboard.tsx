"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Ticket, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"

interface SupportTicket {
  id: string
  subject: string
  status: string
  priority: string
  created_date: string
  last_updated: string
  category: string
}

export function SupportDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching support tickets
    setTimeout(() => {
      setTickets([
        {
          id: "TICK-001",
          subject: "Unable to transfer funds between accounts",
          status: "open",
          priority: "high",
          created_date: "2024-01-15",
          last_updated: "2024-01-15",
          category: "transfers",
        },
        {
          id: "TICK-002",
          subject: "Question about monthly statement",
          status: "resolved",
          priority: "low",
          created_date: "2024-01-10",
          last_updated: "2024-01-12",
          category: "statements",
        },
        {
          id: "TICK-003",
          subject: "Mobile app login issues",
          status: "in-progress",
          priority: "medium",
          created_date: "2024-01-08",
          last_updated: "2024-01-14",
          category: "technical",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Open</Badge>
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Medium
          </Badge>
        )
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
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
            <CardTitle className="text-xl">Support Center</CardTitle>
            <CardDescription>Track your support requests and get help</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">{getStatusIcon(ticket.status)}</div>
                    <div>
                      <h3 className="font-medium">{ticket.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        Ticket #{ticket.id} • Created: {new Date(ticket.created_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(ticket.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right space-y-1">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {tickets.length === 0 && (
              <div className="text-center py-8">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Support Tickets</h3>
                <p className="text-sm text-muted-foreground mb-4">You don't have any active support tickets.</p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Ticket
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <div className="border rounded-lg p-4 h-64 bg-muted/20">
              <div className="flex items-center space-x-2 mb-4">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Live Chat Support</h3>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Online
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Hello! I'm Sarah from Wells Fargo support. How can I help you today?</p>
                  <p className="text-xs text-muted-foreground mt-1">2:34 PM</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                <Button size="sm">Send</Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Average response time: 2-3 minutes</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

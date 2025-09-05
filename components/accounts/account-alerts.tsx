"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react"

export function AccountAlerts() {
  const alerts = [
    {
      id: 1,
      type: "info",
      title: "Statement Ready",
      message: "Your December statement is now available",
      date: "2 hours ago",
    },
    {
      id: 2,
      type: "success",
      title: "Payment Processed",
      message: "Your scheduled payment of $500 was successful",
      date: "1 day ago",
    },
    {
      id: 3,
      type: "warning",
      title: "Low Balance Alert",
      message: "Your checking account balance is below $100",
      date: "3 days ago",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive"
      case "success":
        return "default"
      case "info":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Alerts</CardTitle>
        <CardDescription>Stay informed about your account activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
            <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">{alert.title}</p>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
              <p className="text-xs text-muted-foreground">{alert.date}</p>
            </div>
          </div>
        ))}

        <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
}

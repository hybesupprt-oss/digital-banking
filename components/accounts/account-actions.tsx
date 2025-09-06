"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Settings, CreditCard, Phone } from "lucide-react"

export function AccountActions() {
  const actions = [
    { icon: Download, label: "Download Statements" },
    { icon: FileText, label: "Tax Documents" },
    { icon: CreditCard, label: "Order Checks" },
    { icon: Settings, label: "Account Preferences" },
    { icon: Phone, label: "Contact Support" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Manage your accounts efficiently</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="flex flex-col h-24 items-center justify-center space-y-2 text-center p-4 transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <action.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

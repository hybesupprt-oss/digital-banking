"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Settings, CreditCard, Phone } from "lucide-react"

export function AccountActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Manage your accounts efficiently</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download Statements
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Tax Documents
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <CreditCard className="w-4 h-4 mr-2" />
          Order Checks
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Account Preferences
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Phone className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </CardContent>
    </Card>
  )
}

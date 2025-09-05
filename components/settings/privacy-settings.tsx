"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, Download, Trash2, Shield, AlertTriangle } from "lucide-react"

export function PrivacySettings() {
  const [dataSharing, setDataSharing] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(true)
  const [analyticsTracking, setAnalyticsTracking] = useState(true)

  return (
    <div className="space-y-6">
      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Privacy Controls</span>
          </CardTitle>
          <CardDescription>Manage how your data is used and shared</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-sharing" className="text-base font-medium">
                Data Sharing with Partners
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow Wells Fargo to share your data with trusted partners for better services
              </p>
            </div>
            <Switch id="data-sharing" checked={dataSharing} onCheckedChange={setDataSharing} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails" className="text-base font-medium">
                Marketing Communications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional emails about new products and services
              </p>
            </div>
            <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics-tracking" className="text-base font-medium">
                Analytics & Performance
              </Label>
              <p className="text-sm text-muted-foreground">Help us improve our services by sharing usage analytics</p>
            </div>
            <Switch id="analytics-tracking" checked={analyticsTracking} onCheckedChange={setAnalyticsTracking} />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Control your personal data and account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download My Data
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            View Data Usage Report
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Shield className="w-4 h-4 mr-2" />
            Privacy Policy & Terms
          </Button>
        </CardContent>
      </Card>

      {/* Account Closure */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <span>Account Closure</span>
          </CardTitle>
          <CardDescription>Permanently close your Wells Fargo account</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Closing your account will permanently delete all your data and cannot be undone. Please ensure all
            transactions are complete and balances are transferred.
          </p>
          <Button variant="destructive" className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />
            Request Account Closure
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

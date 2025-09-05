"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Smartphone, Key, AlertTriangle, CheckCircle, Monitor, MapPin } from "lucide-react"

interface SecurityDevice {
  id: string
  name: string
  type: string
  last_active: string
  location: string
  trusted: boolean
}

export function SecurityOverview() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [devices, setDevices] = useState<SecurityDevice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching security data
    setTimeout(() => {
      setDevices([
        {
          id: "1",
          name: "iPhone 15 Pro",
          type: "mobile",
          last_active: "2024-01-15T10:30:00Z",
          location: "San Francisco, CA",
          trusted: true,
        },
        {
          id: "2",
          name: "MacBook Pro",
          type: "desktop",
          last_active: "2024-01-15T09:15:00Z",
          location: "San Francisco, CA",
          trusted: true,
        },
        {
          id: "3",
          name: "Chrome Browser",
          type: "browser",
          last_active: "2024-01-14T16:45:00Z",
          location: "Oakland, CA",
          trusted: false,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />
      case "desktop":
        return <Monitor className="w-4 h-4" />
      case "browser":
        return <Monitor className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  if (loading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg" />
  }

  return (
    <div className="space-y-6">
      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Security Status</span>
          </CardTitle>
          <CardDescription>Your account security is strong</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Two-Factor Authentication</p>
                <p className="text-sm text-green-600">Enabled</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Strong Password</p>
                <p className="text-sm text-green-600">Last updated 30 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Security Questions</p>
                <p className="text-sm text-yellow-600">Update recommended</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Preferences</CardTitle>
          <CardDescription>Manage your security settings and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor" className="text-base font-medium">
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch id="two-factor" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-alerts" className="text-base font-medium">
                Login Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Get notified when someone signs into your account</p>
            </div>
            <Switch id="login-alerts" checked={loginAlerts} onCheckedChange={setLoginAlerts} />
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Shield className="w-4 h-4 mr-2" />
              Update Security Questions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trusted Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Trusted Devices</CardTitle>
          <CardDescription>Manage devices that have access to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">{getDeviceIcon(device.type)}</div>
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {device.location} • Last active: {new Date(device.last_active).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={device.trusted ? "default" : "secondary"}>
                    {device.trusted ? "Trusted" : "Unverified"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {device.trusted ? "Remove" : "Trust"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

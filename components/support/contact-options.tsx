"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react"

export function ContactOptions() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with a representative",
      details: "1-800-FIRST-CITY",
      availability: "24/7",
      action: "Call Now",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with support online",
      details: "Average wait: 2-3 minutes",
      availability: "24/7",
      action: "Start Chat",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      details: "Response within 24 hours",
      availability: "Always available",
      action: "Send Email",
    },
    {
      icon: MapPin,
      title: "Branch Locator",
      description: "Visit a nearby branch",
      details: "Find locations near you",
      availability: "Mon-Fri 9AM-5PM",
      action: "Find Branch",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Us</CardTitle>
          <CardDescription>Choose your preferred way to get help</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    <p className="text-sm font-medium mb-1">{method.details}</p>
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <Clock className="w-3 h-3 mr-1" />
                      {method.availability}
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      {method.action}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Emergency Support</CardTitle>
          <CardDescription>For urgent banking issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-1">Lost or Stolen Cards</h4>
            <p className="text-sm text-red-600 mb-2">Report immediately to protect your account</p>
            <Button variant="destructive" size="sm" className="w-full">
              Report Card Loss
            </Button>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-1">Suspicious Activity</h4>
            <p className="text-sm text-yellow-600 mb-2">Report unauthorized transactions</p>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              Report Fraud
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

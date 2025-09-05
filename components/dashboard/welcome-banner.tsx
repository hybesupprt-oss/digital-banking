"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, ArrowRight } from "lucide-react"
import type { User } from "@/lib/auth"
import { useState } from "react"

interface WelcomeBannerProps {
  user: User
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Card className="bg-gradient-to-r from-accent to-primary text-primary-foreground border-0">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Welcome to First City Credit Union!</h3>
            </div>
            <p className="text-primary-foreground/90 mb-4">
              Your account has been successfully created. Complete these steps to get started with your digital banking
              experience.
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Account created successfully</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/50" />
                <span>Complete identity verification</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/50" />
                <span>Set up your first account</span>
              </div>
            </div>

            <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

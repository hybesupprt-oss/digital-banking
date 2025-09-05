"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, Shield, Bell, Menu, X } from "lucide-react"
import type { User as UserType } from "@/lib/auth"

interface DashboardHeaderProps {
  user: UserType
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_review":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-lg border-b-4 border-accent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-accent p-2 rounded-full">
                <Shield className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">First City Credit Union</h1>
                <p className="text-sm text-primary-foreground/90 font-medium">Digital Banking</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-4 py-2"
              onClick={() => router.push("/dashboard")}
            >
              Accounts
            </Button>
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-4 py-2"
              onClick={() => router.push("/transfer")}
            >
              Transfer Money
            </Button>
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-4 py-2"
              onClick={() => router.push("/transactions")}
            >
              Transactions
            </Button>
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-4 py-2"
            >
              Services
            </Button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 p-2">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2"
                >
                  <Avatar className="h-10 w-10 border-2 border-accent">
                    <AvatarFallback className="bg-accent text-accent-foreground font-bold text-lg">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">
                      {user.firstName} {user.lastName}
                    </p>
                    <Badge variant="secondary" className={`text-xs font-medium ${getKycStatusColor(user.kycStatus)}`}>
                      {user.kycStatus.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-card border-border shadow-lg">
                <DropdownMenuLabel className="pb-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-base">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary" className={`text-xs ${getKycStatusColor(user.kycStatus)}`}>
                      Account Status: {user.kycStatus.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="py-3">
                  <User className="mr-3 h-4 w-4" />
                  <span className="font-medium">Profile & Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/kyc")} className="py-3">
                  <Shield className="mr-3 h-4 w-4" />
                  <span className="font-medium">Identity Verification</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive py-3">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Sign Out Securely</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-primary-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/20">
            <nav className="flex flex-col space-y-3">
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-primary-foreground/10 font-semibold py-3"
                onClick={() => router.push("/dashboard")}
              >
                Accounts
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-primary-foreground/10 font-semibold py-3"
                onClick={() => router.push("/transfer")}
              >
                Transfer Money
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-primary-foreground/10 font-semibold py-3"
                onClick={() => router.push("/transactions")}
              >
                Transactions
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-primary-foreground hover:bg-primary-foreground/10 font-semibold py-3"
              >
                Services
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

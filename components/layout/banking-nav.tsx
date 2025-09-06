"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, ArrowLeftRight, FileText, Shield, LogOut, CreditCard, Settings, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Accounts", href: "/accounts", icon: CreditCard },
  { name: "Transfer", href: "/transfer", icon: ArrowLeftRight },
  { name: "Bill Pay", href: "/bill-pay", icon: Receipt },
  { name: "Transactions", href: "/transactions", icon: FileText },
  { name: "Statements", href: "/statements", icon: Receipt },
  { name: "Loans", href: "/loans", icon: CreditCard }, // Added loans navigation
  { name: "Support", href: "/support", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "KYC Verification", href: "/kyc", icon: Shield },
]

export function BankingNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F44ae5eb1081644219977cce4891b7752%2F02932fabb0af4e07bbcffc50c2cc28f6?format=webp&width=128"
                alt="First City Credit Union logo"
                className="h-8 w-auto"
              />
              <span className="font-bold text-lg">First City Credit Union</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground hover:bg-primary/80",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="sm" type="submit" className="text-primary-foreground hover:bg-primary/80">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                  <form action="/api/auth/logout" method="POST">
                    <Button variant="ghost" size="sm" type="submit" className="w-full justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

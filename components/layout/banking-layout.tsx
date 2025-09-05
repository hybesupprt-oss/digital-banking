import type React from "react"
import { BankingNav } from "./banking-nav"

interface BankingLayoutProps {
  children: React.ReactNode
}

export function BankingLayout({ children }: BankingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <BankingNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}

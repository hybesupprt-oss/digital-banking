import type React from "react"
import { BankingLayout } from "@/components/layout/banking-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <BankingLayout>{children}</BankingLayout>
}

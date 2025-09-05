import type React from "react"
import { BankingLayout } from "@/components/layout/banking-layout"

export default function TransferLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <BankingLayout>{children}</BankingLayout>
}

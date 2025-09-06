"use client"

import React from "react"

interface PaymentHistoryProps {
  userId: string
}

export function PaymentHistory({ userId }: PaymentHistoryProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">Payment history placeholder for user {userId}</p>
    </div>
  )
}

export default PaymentHistory

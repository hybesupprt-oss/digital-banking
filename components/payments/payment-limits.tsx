"use client"

import React from "react"

interface PaymentLimitsProps {
  userId: string
}

export function PaymentLimits({ userId }: PaymentLimitsProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">Payment limits placeholder for user {userId}</p>
    </div>
  )
}

export default PaymentLimits

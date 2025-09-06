"use client"

import React from "react"

interface ACHTransferFormProps {
  userId: string
}

export function ACHTransferForm({ userId }: ACHTransferFormProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">ACH Transfer form placeholder for user {userId}</p>
    </div>
  )
}

export default ACHTransferForm

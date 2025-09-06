"use client"

import React from "react"

interface ExternalAccountFormProps {
  userId: string
}

export function ExternalAccountForm({ userId }: ExternalAccountFormProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">External account form placeholder for user {userId}</p>
    </div>
  )
}

export default ExternalAccountForm

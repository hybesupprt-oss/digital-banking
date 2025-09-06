import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { createAuditLog } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { fromAccountId, toAccountId, amount, description, transferType } = await request.json()

    // Validate input
    if (!fromAccountId || !toAccountId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than zero" }, { status: 400 })
    }

    if (amount > 10000) {
      return NextResponse.json({ error: "Amount exceeds daily transfer limit" }, { status: 400 })
    }

    if (fromAccountId === toAccountId) {
      return NextResponse.json({ error: "Source and destination accounts must be different" }, { status: 400 })
    }

    // Verify account ownership
    const accountsResult = await sql`
      SELECT id, user_id, account_name, balance, account_status 
      FROM accounts 
      WHERE id IN (${fromAccountId}, ${toAccountId}) 
      AND user_id = ${session.user.id}
      AND account_status = 'active'
    `

    if (accountsResult.length !== 2) {
      return NextResponse.json({ error: "Invalid account selection" }, { status: 400 })
    }

  const fromAccount = accountsResult.find((acc: any) => acc.id === fromAccountId)
  const toAccount = accountsResult.find((acc: any) => acc.id === toAccountId)

    if (!fromAccount || !toAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Check sufficient funds
    if (fromAccount.balance < amount) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 })
    }

    // Create transaction records (double-entry)
    const transactionResult = await sql`
      WITH new_transaction AS (
        INSERT INTO transactions (
          from_account_id, 
          to_account_id, 
          transaction_type, 
          amount, 
          description,
          transaction_status,
          processed_at,
          processed_by
        ) VALUES (
          ${fromAccountId},
          ${toAccountId},
          'transfer',
          ${amount},
          ${description || "Internal transfer"},
          'completed',
          NOW(),
          ${session.user.id}
        ) RETURNING id, transaction_number
      )
      SELECT * FROM new_transaction
    `

    const transaction = transactionResult[0]

    // Update account balances
    await sql`
      UPDATE accounts 
      SET 
        balance = balance - ${amount},
        available_balance = available_balance - ${amount},
        last_activity_at = NOW(),
        updated_at = NOW()
      WHERE id = ${fromAccountId}
    `

    await sql`
      UPDATE accounts 
      SET 
        balance = balance + ${amount},
        available_balance = available_balance + ${amount},
        last_activity_at = NOW(),
        updated_at = NOW()
      WHERE id = ${toAccountId}
    `

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      sessionId: session.sessionId,
      action: "transaction",
      resourceType: "transaction",
      resourceId: transaction.id,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      description: `Transfer of $${amount} from ${fromAccount.account_name} to ${toAccount.account_name}`,
    })

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        transactionNumber: transaction.transaction_number,
        amount,
        fromAccount: fromAccount.account_name,
        toAccount: toAccount.account_name,
        status: "completed",
      },
    })
  } catch (error) {
    console.error("Transfer error:", error)
    return NextResponse.json({ error: "Transfer failed. Please try again." }, { status: 500 })
  }
}

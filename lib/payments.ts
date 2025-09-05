import { sql } from "./db"

export interface ACHTransfer {
  id: string
  fromAccountId: string
  toAccountId?: string
  externalAccountId?: string
  amount: number
  currency: "USD"
  type: "debit" | "credit"
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  description: string
  achTransactionId?: string
  createdAt: Date
  processedAt?: Date
}

export interface ExternalAccount {
  id: string
  userId: string
  bankName: string
  accountType: "checking" | "savings"
  routingNumber: string
  accountNumber: string // This would be encrypted in production
  accountHolderName: string
  verified: boolean
  microDepositStatus: "pending" | "sent" | "verified" | "failed"
  createdAt: Date
}

export interface PaymentLimits {
  dailyLimit: number
  monthlyLimit: number
  perTransactionLimit: number
  remainingDaily: number
  remainingMonthly: number
}

// Simulate Moov.io ACH processing
export class ACHProcessor {
  private static instance: ACHProcessor

  static getInstance(): ACHProcessor {
    if (!ACHProcessor.instance) {
      ACHProcessor.instance = new ACHProcessor()
    }
    return ACHProcessor.instance
  }

  async initiateACHTransfer(transfer: Omit<ACHTransfer, "id" | "createdAt" | "status">): Promise<ACHTransfer> {
    // Validate transfer limits
    const limits = await this.getPaymentLimits(transfer.fromAccountId)
    if (transfer.amount > limits.perTransactionLimit) {
      throw new Error("Transfer amount exceeds per-transaction limit")
    }
    if (transfer.amount > limits.remainingDaily) {
      throw new Error("Transfer amount exceeds daily limit")
    }

    // Create ACH transfer record
    const achTransfer: ACHTransfer = {
      id: crypto.randomUUID(),
      ...transfer,
      status: "pending",
      createdAt: new Date(),
      achTransactionId: `ACH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    try {
      await sql`
        INSERT INTO ach_transfers (
          id, from_account_id, to_account_id, external_account_id,
          amount, currency, type, status, description, ach_transaction_id, created_at
        )
        VALUES (
          ${achTransfer.id}, ${achTransfer.fromAccountId}, ${achTransfer.toAccountId},
          ${achTransfer.externalAccountId}, ${achTransfer.amount}, ${achTransfer.currency},
          ${achTransfer.type}, ${achTransfer.status}, ${achTransfer.description},
          ${achTransfer.achTransactionId}, ${achTransfer.createdAt}
        )
      `

      // Simulate processing delay (in production this would be async)
      setTimeout(() => this.processACHTransfer(achTransfer.id), 2000)

      return achTransfer
    } catch (error) {
      console.error("Failed to initiate ACH transfer:", error)
      throw new Error("ACH transfer initiation failed")
    }
  }

  private async processACHTransfer(transferId: string): Promise<void> {
    try {
      // Update status to processing
      await sql`
        UPDATE ach_transfers 
        SET status = 'processing', processed_at = NOW()
        WHERE id = ${transferId}
      `

      // Simulate processing time (1-3 business days for real ACH)
      const processingTime = Math.random() * 5000 + 3000 // 3-8 seconds for demo

      setTimeout(async () => {
        const success = Math.random() > 0.05 // 95% success rate
        const finalStatus = success ? "completed" : "failed"

        await sql`
          UPDATE ach_transfers 
          SET status = ${finalStatus}
          WHERE id = ${transferId}
        `

        if (success) {
          // Update account balances for completed transfers
          await this.updateAccountBalances(transferId)
        }
      }, processingTime)
    } catch (error) {
      console.error("Failed to process ACH transfer:", error)
      await sql`
        UPDATE ach_transfers 
        SET status = 'failed'
        WHERE id = ${transferId}
      `
    }
  }

  private async updateAccountBalances(transferId: string): Promise<void> {
    try {
      const transfer = await sql`
        SELECT * FROM ach_transfers WHERE id = ${transferId}
      `

      if (transfer.length === 0) return

      const { from_account_id, to_account_id, amount, type } = transfer[0]

      if (type === "debit") {
        // Debit from source account
        await sql`
          UPDATE accounts 
          SET balance = balance - ${amount}
          WHERE id = ${from_account_id}
        `
      } else {
        // Credit to destination account
        await sql`
          UPDATE accounts 
          SET balance = balance + ${amount}
          WHERE id = ${to_account_id || from_account_id}
        `
      }

      // Create transaction records for double-entry bookkeeping
      await this.createTransactionRecords(transferId)
    } catch (error) {
      console.error("Failed to update account balances:", error)
    }
  }

  private async createTransactionRecords(transferId: string): Promise<void> {
    try {
      const transfer = await sql`
        SELECT * FROM ach_transfers WHERE id = ${transferId}
      `

      if (transfer.length === 0) return

      const { from_account_id, to_account_id, amount, description, ach_transaction_id } = transfer[0]

      // Create debit transaction
      await sql`
        INSERT INTO transactions (
          account_id, type, amount, description, reference_id, created_at
        )
        VALUES (
          ${from_account_id}, 'debit', ${amount}, ${description}, 
          ${ach_transaction_id}, NOW()
        )
      `

      // Create credit transaction if internal transfer
      if (to_account_id) {
        await sql`
          INSERT INTO transactions (
            account_id, type, amount, description, reference_id, created_at
          )
          VALUES (
            ${to_account_id}, 'credit', ${amount}, ${description}, 
            ${ach_transaction_id}, NOW()
          )
        `
      }
    } catch (error) {
      console.error("Failed to create transaction records:", error)
    }
  }

  async getPaymentLimits(accountId: string): Promise<PaymentLimits> {
    try {
      const result = await sql`
        SELECT 
          daily_limit, monthly_limit, per_transaction_limit,
          COALESCE(daily_spent, 0) as daily_spent,
          COALESCE(monthly_spent, 0) as monthly_spent
        FROM accounts a
        LEFT JOIN (
          SELECT 
            from_account_id,
            SUM(CASE WHEN created_at >= CURRENT_DATE THEN amount ELSE 0 END) as daily_spent,
            SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END) as monthly_spent
          FROM ach_transfers 
          WHERE status IN ('completed', 'processing')
          GROUP BY from_account_id
        ) spending ON a.id = spending.from_account_id
        WHERE a.id = ${accountId}
      `

      if (result.length === 0) {
        throw new Error("Account not found")
      }

      const account = result[0]
      return {
        dailyLimit: account.daily_limit || 5000,
        monthlyLimit: account.monthly_limit || 50000,
        perTransactionLimit: account.per_transaction_limit || 2500,
        remainingDaily: (account.daily_limit || 5000) - (account.daily_spent || 0),
        remainingMonthly: (account.monthly_limit || 50000) - (account.monthly_spent || 0),
      }
    } catch (error) {
      console.error("Failed to get payment limits:", error)
      throw new Error("Failed to retrieve payment limits")
    }
  }

  async addExternalAccount(
    accountData: Omit<ExternalAccount, "id" | "createdAt" | "verified" | "microDepositStatus">,
  ): Promise<ExternalAccount> {
    const externalAccount: ExternalAccount = {
      id: crypto.randomUUID(),
      ...accountData,
      verified: false,
      microDepositStatus: "pending",
      createdAt: new Date(),
    }

    try {
      await sql`
        INSERT INTO external_accounts (
          id, user_id, bank_name, account_type, routing_number,
          account_number, account_holder_name, verified, micro_deposit_status, created_at
        )
        VALUES (
          ${externalAccount.id}, ${externalAccount.userId}, ${externalAccount.bankName},
          ${externalAccount.accountType}, ${externalAccount.routingNumber}, 
          ${externalAccount.accountNumber}, ${externalAccount.accountHolderName},
          ${externalAccount.verified}, ${externalAccount.microDepositStatus}, ${externalAccount.createdAt}
        )
      `

      // Initiate micro-deposit verification
      setTimeout(() => this.sendMicroDeposits(externalAccount.id), 1000)

      return externalAccount
    } catch (error) {
      console.error("Failed to add external account:", error)
      throw new Error("Failed to add external account")
    }
  }

  private async sendMicroDeposits(accountId: string): Promise<void> {
    try {
      // Simulate sending micro-deposits
      const deposit1 = Math.floor(Math.random() * 99) + 1 // $0.01 - $0.99
      const deposit2 = Math.floor(Math.random() * 99) + 1

      await sql`
        UPDATE external_accounts 
        SET 
          micro_deposit_status = 'sent',
          micro_deposit_amounts = ARRAY[${deposit1}, ${deposit2}]
        WHERE id = ${accountId}
      `

      console.log(
        `Micro-deposits sent: $0.${deposit1.toString().padStart(2, "0")} and $0.${deposit2.toString().padStart(2, "0")}`,
      )
    } catch (error) {
      console.error("Failed to send micro-deposits:", error)
    }
  }

  async verifyMicroDeposits(accountId: string, amounts: [number, number]): Promise<boolean> {
    try {
      const result = await sql`
        SELECT micro_deposit_amounts 
        FROM external_accounts 
        WHERE id = ${accountId}
      `

      if (result.length === 0) return false

      const storedAmounts = result[0].micro_deposit_amounts
      const isValid =
        storedAmounts &&
        storedAmounts.length === 2 &&
        storedAmounts[0] === amounts[0] &&
        storedAmounts[1] === amounts[1]

      if (isValid) {
        await sql`
          UPDATE external_accounts 
          SET verified = true, micro_deposit_status = 'verified'
          WHERE id = ${accountId}
        `
      } else {
        await sql`
          UPDATE external_accounts 
          SET micro_deposit_status = 'failed'
          WHERE id = ${accountId}
        `
      }

      return isValid
    } catch (error) {
      console.error("Failed to verify micro-deposits:", error)
      return false
    }
  }
}

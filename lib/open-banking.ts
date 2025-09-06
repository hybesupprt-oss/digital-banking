import { sql } from "./db"
import nodeCrypto from "crypto"

export interface OpenBankingProvider {
  id: string
  name: string
  country: string
  logo: string
  supported: boolean
  capabilities: string[]
}

export interface LinkedAccount {
  id: string
  userId: string
  providerId: string
  institutionId: string
  institutionName: string
  accountId: string
  accountType: "checking" | "savings" | "credit" | "investment"
  accountName: string
  accountNumber: string // Masked
  sortCode?: string
  iban?: string
  balance: number
  currency: string
  lastSynced: Date
  status: "active" | "inactive" | "error" | "consent_expired"
  consentId: string
  consentExpiresAt: Date
  createdAt: Date
}

export interface ExternalTransaction {
  id: string
  linkedAccountId: string
  transactionId: string
  amount: number
  currency: string
  description: string
  merchantName?: string
  category: string
  date: Date
  balance: number
  type: "debit" | "credit"
  status: "pending" | "completed"
  metadata: Record<string, any>
}

export interface AccountBalance {
  accountId: string
  available: number
  current: number
  currency: string
  lastUpdated: Date
}

// Open Banking Service (Nordigen/GoCardless integration)
export class OpenBankingService {
  private static instance: OpenBankingService

  static getInstance(): OpenBankingService {
    if (!OpenBankingService.instance) {
      OpenBankingService.instance = new OpenBankingService()
    }
    return OpenBankingService.instance
  }

  // Get supported banking providers
  async getSupportedProviders(country = "US"): Promise<OpenBankingProvider[]> {
    try {
      // In production, fetch from Nordigen/GoCardless API
      const providers: OpenBankingProvider[] = [
        {
          id: "chase",
          name: "JPMorgan Chase",
          country: "US",
          logo: "/bank-logos/chase.png",
          supported: true,
          capabilities: ["accounts", "transactions", "balances", "payments"],
        },
        {
          id: "bofa",
          name: "Bank of America",
          country: "US",
          logo: "/bank-logos/bofa.png",
          supported: true,
          capabilities: ["accounts", "transactions", "balances"],
        },
        {
          id: "citi",
          name: "Citibank",
          country: "US",
          logo: "/bank-logos/citi.png",
          supported: true,
          capabilities: ["accounts", "transactions", "balances", "payments"],
        },
        {
          id: "amex",
          name: "American Express",
          country: "US",
          logo: "/bank-logos/amex.png",
          supported: true,
          capabilities: ["accounts", "transactions", "balances"],
        },
        {
          id: "capital_one",
          name: "Capital One",
          country: "US",
          logo: "/bank-logos/capital-one.png",
          supported: true,
          capabilities: ["accounts", "transactions", "balances"],
        },
      ]

      return providers.filter((p) => p.country === country)
    } catch (error) {
      console.error("Failed to get supported providers:", error)
      return []
    }
  }

  // Initiate account linking process
  async initiateAccountLinking(
    userId: string,
    providerId: string,
    redirectUrl: string,
  ): Promise<{
    consentUrl: string
    consentId: string
    expiresAt: Date
  }> {
    try {
      console.log(`[v0] Initiating account linking for provider: ${providerId}`)

      // Generate consent ID and URL
      const consentId = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days

      // In production, call Nordigen/GoCardless API
      const consentUrl = `https://ob-api.example.com/auth?consent_id=${consentId}&redirect_uri=${encodeURIComponent(redirectUrl)}&institution_id=${providerId}`

      // Store consent request
      await sql`
        INSERT INTO open_banking_consents (
          id, user_id, provider_id, status, expires_at, redirect_url, created_at
        )
        VALUES (
          ${consentId}, ${userId}, ${providerId}, 'pending', ${expiresAt}, ${redirectUrl}, NOW()
        )
      `

      console.log(`[v0] Consent URL generated: ${consentUrl}`)

      return {
        consentUrl,
        consentId,
        expiresAt,
      }
    } catch (error) {
      console.error("Failed to initiate account linking:", error)
      throw new Error("Account linking initiation failed")
    }
  }

  // Complete account linking after user consent
  async completeAccountLinking(consentId: string, authorizationCode: string): Promise<LinkedAccount[]> {
    try {
      console.log(`[v0] Completing account linking for consent: ${consentId}`)

      // Get consent details
      const consentResult = await sql`
        SELECT * FROM open_banking_consents WHERE id = ${consentId}
      `

      if (consentResult.length === 0) {
        throw new Error("Invalid consent ID")
      }

      const consent = consentResult[0]

      // Exchange authorization code for access token (simulate API call)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Fetch account information from provider
      const accounts = await this.fetchAccountsFromProvider(consent.provider_id, authorizationCode)

      // Store linked accounts
      const linkedAccounts: LinkedAccount[] = []
      for (const account of accounts) {
        const linkedAccount: LinkedAccount = {
          id: crypto.randomUUID(),
          userId: consent.user_id,
          providerId: consent.provider_id,
          institutionId: consent.provider_id,
          institutionName: account.institutionName,
          accountId: account.accountId,
          accountType: account.accountType,
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          sortCode: account.sortCode,
          iban: account.iban,
          balance: account.balance,
          currency: account.currency,
          lastSynced: new Date(),
          status: "active",
          consentId,
          consentExpiresAt: consent.expires_at,
          createdAt: new Date(),
        }

        await sql`
          INSERT INTO linked_accounts (
            id, user_id, provider_id, institution_id, institution_name,
            account_id, account_type, account_name, account_number,
            sort_code, iban, balance, currency, last_synced, status,
            consent_id, consent_expires_at, created_at
          )
          VALUES (
            ${linkedAccount.id}, ${linkedAccount.userId}, ${linkedAccount.providerId},
            ${linkedAccount.institutionId}, ${linkedAccount.institutionName},
            ${linkedAccount.accountId}, ${linkedAccount.accountType}, ${linkedAccount.accountName},
            ${linkedAccount.accountNumber}, ${linkedAccount.sortCode}, ${linkedAccount.iban},
            ${linkedAccount.balance}, ${linkedAccount.currency}, ${linkedAccount.lastSynced},
            ${linkedAccount.status}, ${linkedAccount.consentId}, ${linkedAccount.consentExpiresAt},
            ${linkedAccount.createdAt}
          )
        `

        linkedAccounts.push(linkedAccount)
      }

      // Update consent status
      await sql`
        UPDATE open_banking_consents 
        SET status = 'completed', completed_at = NOW()
        WHERE id = ${consentId}
      `

      // Start initial transaction sync
      for (const account of linkedAccounts) {
        this.syncAccountTransactions(account.id)
      }

      console.log(`[v0] Successfully linked ${linkedAccounts.length} accounts`)

      return linkedAccounts
    } catch (error) {
      console.error("Failed to complete account linking:", error)
      throw new Error("Account linking completion failed")
    }
  }

  // Fetch accounts from banking provider (simulate API call)
  private async fetchAccountsFromProvider(
    providerId: string,
    authCode: string,
  ): Promise<
    Array<{
      accountId: string
      accountType: "checking" | "savings" | "credit" | "investment"
      accountName: string
      accountNumber: string
      sortCode?: string
      iban?: string
      balance: number
      currency: string
      institutionName: string
    }>
  > {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock account data based on provider
    const providerNames: Record<string, string> = {
      chase: "JPMorgan Chase",
      bofa: "Bank of America",
      citi: "Citibank",
      amex: "American Express",
      capital_one: "Capital One",
    }

    return [
      {
        accountId: `${providerId}_checking_001`,
        accountType: "checking",
        accountName: "Primary Checking",
        accountNumber: `****${Math.floor(Math.random() * 9000) + 1000}`,
        balance: Math.floor(Math.random() * 50000) + 1000,
        currency: "USD",
        institutionName: providerNames[providerId] || "Unknown Bank",
      },
      {
        accountId: `${providerId}_savings_001`,
        accountType: "savings",
        accountName: "High Yield Savings",
        accountNumber: `****${Math.floor(Math.random() * 9000) + 1000}`,
        balance: Math.floor(Math.random() * 100000) + 5000,
        currency: "USD",
        institutionName: providerNames[providerId] || "Unknown Bank",
      },
    ]
  }

  // Sync account balances in real-time
  async syncAccountBalances(userId: string): Promise<AccountBalance[]> {
    try {
      console.log(`[v0] Syncing account balances for user: ${userId}`)

      const linkedAccounts = await sql`
        SELECT * FROM linked_accounts 
        WHERE user_id = ${userId} AND status = 'active'
      `

      const balances: AccountBalance[] = []

      for (const account of linkedAccounts) {
        try {
          // Simulate API call to fetch current balance
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const currentBalance = account.balance + (Math.random() - 0.5) * 1000 // Simulate balance changes
          const availableBalance = currentBalance - Math.random() * 100 // Simulate pending transactions

          const balance: AccountBalance = {
            accountId: account.id,
            available: Math.max(0, availableBalance),
            current: currentBalance,
            currency: account.currency,
            lastUpdated: new Date(),
          }

          // Update stored balance
          await sql`
            UPDATE linked_accounts 
            SET balance = ${balance.current}, last_synced = NOW()
            WHERE id = ${account.id}
          `

          balances.push(balance)
        } catch (error) {
          console.error(`Failed to sync balance for account ${account.id}:`, error)
        }
      }

      console.log(`[v0] Synced ${balances.length} account balances`)

      return balances
    } catch (error) {
      console.error("Failed to sync account balances:", error)
      return []
    }
  }

  // Sync account transactions
  async syncAccountTransactions(linkedAccountId: string): Promise<ExternalTransaction[]> {
    try {
      console.log(`[v0] Syncing transactions for account: ${linkedAccountId}`)

      const account = await sql`
        SELECT * FROM linked_accounts WHERE id = ${linkedAccountId}
      `

      if (account.length === 0) {
        throw new Error("Linked account not found")
      }

      // Simulate API call to fetch transactions
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock transactions
      const transactions: ExternalTransaction[] = []
      const transactionCount = Math.floor(Math.random() * 20) + 10

      for (let i = 0; i < transactionCount; i++) {
        const isDebit = Math.random() > 0.6
        const amount = Math.floor(Math.random() * 500) + 10

        const transaction: ExternalTransaction = {
          id: crypto.randomUUID(),
          linkedAccountId,
          transactionId: `txn_${Date.now()}_${i}`,
          amount: isDebit ? -amount : amount,
          currency: account[0].currency,
          description: this.generateTransactionDescription(isDebit),
          merchantName: isDebit ? this.generateMerchantName() : undefined,
          category: this.generateTransactionCategory(isDebit),
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
          balance: account[0].balance,
          type: isDebit ? "debit" : "credit",
          status: "completed",
          metadata: {},
        }

        // Store transaction
        await sql`
          INSERT INTO external_transactions (
            id, linked_account_id, transaction_id, amount, currency,
            description, merchant_name, category, date, balance,
            type, status, metadata, created_at
          )
          VALUES (
            ${transaction.id}, ${transaction.linkedAccountId}, ${transaction.transactionId},
            ${transaction.amount}, ${transaction.currency}, ${transaction.description},
            ${transaction.merchantName}, ${transaction.category}, ${transaction.date},
            ${transaction.balance}, ${transaction.type}, ${transaction.status},
            ${JSON.stringify(transaction.metadata)}, NOW()
          )
          ON CONFLICT (transaction_id) DO NOTHING
        `

        transactions.push(transaction)
      }

      console.log(`[v0] Synced ${transactions.length} transactions`)

      return transactions
    } catch (error) {
      console.error("Failed to sync account transactions:", error)
      return []
    }
  }

  // Get aggregated account overview
  async getAggregatedAccountOverview(userId: string): Promise<{
    totalBalance: number
    accountCount: number
    accounts: LinkedAccount[]
    recentTransactions: ExternalTransaction[]
  }> {
    try {
      const accounts = await sql`
        SELECT * FROM linked_accounts 
        WHERE user_id = ${userId} AND status = 'active'
        ORDER BY created_at DESC
      `

      const recentTransactions = await sql`
        SELECT et.* FROM external_transactions et
        JOIN linked_accounts la ON et.linked_account_id = la.id
        WHERE la.user_id = ${userId}
        ORDER BY et.date DESC
        LIMIT 20
      `

      const totalBalance = accounts.reduce((sum: number, account: any) => sum + (account.balance || 0), 0)

      return {
        totalBalance,
        accountCount: accounts.length,
        accounts: accounts as LinkedAccount[],
        recentTransactions: recentTransactions as ExternalTransaction[],
      }
    } catch (error) {
      console.error("Failed to get aggregated account overview:", error)
      throw new Error("Failed to get account overview")
    }
  }

  // Disconnect linked account
  async disconnectAccount(linkedAccountId: string): Promise<void> {
    try {
      await sql`
        UPDATE linked_accounts 
        SET status = 'inactive', disconnected_at = NOW()
        WHERE id = ${linkedAccountId}
      `

      console.log(`[v0] Disconnected account: ${linkedAccountId}`)
    } catch (error) {
      console.error("Failed to disconnect account:", error)
      throw new Error("Account disconnection failed")
    }
  }

  // Helper methods for generating mock data
  private generateTransactionDescription(isDebit: boolean): string {
    const debitDescriptions = [
      "Amazon Purchase",
      "Starbucks Coffee",
      "Uber Ride",
      "Grocery Store",
      "Gas Station",
      "Restaurant",
      "Online Shopping",
      "Subscription Service",
    ]

    const creditDescriptions = [
      "Salary Deposit",
      "Refund",
      "Transfer In",
      "Interest Payment",
      "Cashback Reward",
      "Investment Return",
    ]

    const descriptions = isDebit ? debitDescriptions : creditDescriptions
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  private generateMerchantName(): string {
    const merchants = [
      "Amazon",
      "Starbucks",
      "Uber",
      "Walmart",
      "Shell",
      "McDonald's",
      "Target",
      "Netflix",
      "Spotify",
      "Apple",
    ]
    return merchants[Math.floor(Math.random() * merchants.length)]
  }

  private generateTransactionCategory(isDebit: boolean): string {
    const debitCategories = ["Shopping", "Food & Dining", "Transportation", "Groceries", "Entertainment", "Bills"]
    const creditCategories = ["Income", "Refunds", "Transfers", "Investments"]

    const categories = isDebit ? debitCategories : creditCategories
    return categories[Math.floor(Math.random() * categories.length)]
  }
}

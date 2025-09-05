import { sql } from "./db"

export interface CryptoWallet {
  id: string
  userId: string
  type: "bitcoin" | "lightning" | "stellar"
  publicKey: string
  encryptedPrivateKey: string // Encrypted with user's master key
  address: string
  balance: number
  balanceUSD: number
  isActive: boolean
  createdAt: Date
  lastSyncAt?: Date
}

export interface CryptoTransaction {
  id: string
  walletId: string
  type: "send" | "receive"
  amount: number
  currency: "BTC" | "XLM" | "USD"
  toAddress?: string
  fromAddress?: string
  txHash: string
  status: "pending" | "confirmed" | "failed"
  confirmations: number
  fees: number
  description?: string
  createdAt: Date
  confirmedAt?: Date
}

export interface ExchangeRate {
  currency: string
  usdRate: number
  lastUpdated: Date
}

// Crypto wallet manager
export class CryptoWalletManager {
  private static instance: CryptoWalletManager

  static getInstance(): CryptoWalletManager {
    if (!CryptoWalletManager.instance) {
      CryptoWalletManager.instance = new CryptoWalletManager()
    }
    return CryptoWalletManager.instance
  }

  // Create Bitcoin wallet for user
  async createBitcoinWallet(userId: string): Promise<CryptoWallet> {
    try {
      // In production, use proper Bitcoin key generation
      const keyPair = this.generateBitcoinKeyPair()
      const address = this.generateBitcoinAddress(keyPair.publicKey)

      const wallet: CryptoWallet = {
        id: crypto.randomUUID(),
        userId,
        type: "bitcoin",
        publicKey: keyPair.publicKey,
        encryptedPrivateKey: await this.encryptPrivateKey(keyPair.privateKey, userId),
        address,
        balance: 0,
        balanceUSD: 0,
        isActive: true,
        createdAt: new Date(),
      }

      await sql`
        INSERT INTO crypto_wallets (
          id, user_id, type, public_key, encrypted_private_key,
          address, balance, balance_usd, is_active, created_at
        )
        VALUES (
          ${wallet.id}, ${wallet.userId}, ${wallet.type}, ${wallet.publicKey},
          ${wallet.encryptedPrivateKey}, ${wallet.address}, ${wallet.balance},
          ${wallet.balanceUSD}, ${wallet.isActive}, ${wallet.createdAt}
        )
      `

      return wallet
    } catch (error) {
      console.error("Failed to create Bitcoin wallet:", error)
      throw new Error("Bitcoin wallet creation failed")
    }
  }

  // Create Lightning Network wallet
  async createLightningWallet(userId: string): Promise<CryptoWallet> {
    try {
      // Generate Lightning Network node identity
      const keyPair = this.generateLightningKeyPair()
      const lightningAddress = `${userId}@wellsfargo-lightning.com`

      const wallet: CryptoWallet = {
        id: crypto.randomUUID(),
        userId,
        type: "lightning",
        publicKey: keyPair.publicKey,
        encryptedPrivateKey: await this.encryptPrivateKey(keyPair.privateKey, userId),
        address: lightningAddress,
        balance: 0,
        balanceUSD: 0,
        isActive: true,
        createdAt: new Date(),
      }

      await sql`
        INSERT INTO crypto_wallets (
          id, user_id, type, public_key, encrypted_private_key,
          address, balance, balance_usd, is_active, created_at
        )
        VALUES (
          ${wallet.id}, ${wallet.userId}, ${wallet.type}, ${wallet.publicKey},
          ${wallet.encryptedPrivateKey}, ${wallet.address}, ${wallet.balance},
          ${wallet.balanceUSD}, ${wallet.isActive}, ${wallet.createdAt}
        )
      `

      return wallet
    } catch (error) {
      console.error("Failed to create Lightning wallet:", error)
      throw new Error("Lightning wallet creation failed")
    }
  }

  // Create Stellar wallet for global transfers
  async createStellarWallet(userId: string): Promise<CryptoWallet> {
    try {
      // Generate Stellar keypair
      const keyPair = this.generateStellarKeyPair()

      const wallet: CryptoWallet = {
        id: crypto.randomUUID(),
        userId,
        type: "stellar",
        publicKey: keyPair.publicKey,
        encryptedPrivateKey: await this.encryptPrivateKey(keyPair.privateKey, userId),
        address: keyPair.publicKey, // Stellar uses public key as address
        balance: 0,
        balanceUSD: 0,
        isActive: true,
        createdAt: new Date(),
      }

      await sql`
        INSERT INTO crypto_wallets (
          id, user_id, type, public_key, encrypted_private_key,
          address, balance, balance_usd, is_active, created_at
        )
        VALUES (
          ${wallet.id}, ${wallet.userId}, ${wallet.type}, ${wallet.publicKey},
          ${wallet.encryptedPrivateKey}, ${wallet.address}, ${wallet.balance},
          ${wallet.balanceUSD}, ${wallet.isActive}, ${wallet.createdAt}
        )
      `

      // Fund Stellar wallet with minimum XLM for operations
      await this.fundStellarWallet(wallet.id)

      return wallet
    } catch (error) {
      console.error("Failed to create Stellar wallet:", error)
      throw new Error("Stellar wallet creation failed")
    }
  }

  // Send Bitcoin payment
  async sendBitcoinPayment(
    walletId: string,
    toAddress: string,
    amount: number,
    description?: string,
  ): Promise<CryptoTransaction> {
    try {
      const wallet = await this.getWallet(walletId)
      if (!wallet || wallet.type !== "bitcoin") {
        throw new Error("Invalid Bitcoin wallet")
      }

      if (wallet.balance < amount) {
        throw new Error("Insufficient Bitcoin balance")
      }

      // Create transaction record
      const transaction: CryptoTransaction = {
        id: crypto.randomUUID(),
        walletId,
        type: "send",
        amount,
        currency: "BTC",
        toAddress,
        fromAddress: wallet.address,
        txHash: this.generateTxHash(),
        status: "pending",
        confirmations: 0,
        fees: this.calculateBitcoinFees(amount),
        description,
        createdAt: new Date(),
      }

      await sql`
        INSERT INTO crypto_transactions (
          id, wallet_id, type, amount, currency, to_address, from_address,
          tx_hash, status, confirmations, fees, description, created_at
        )
        VALUES (
          ${transaction.id}, ${transaction.walletId}, ${transaction.type},
          ${transaction.amount}, ${transaction.currency}, ${transaction.toAddress},
          ${transaction.fromAddress}, ${transaction.txHash}, ${transaction.status},
          ${transaction.confirmations}, ${transaction.fees}, ${transaction.description},
          ${transaction.createdAt}
        )
      `

      // Simulate Bitcoin network processing
      setTimeout(() => this.processBitcoinTransaction(transaction.id), 2000)

      return transaction
    } catch (error) {
      console.error("Failed to send Bitcoin payment:", error)
      throw new Error("Bitcoin payment failed")
    }
  }

  // Send Lightning payment (instant)
  async sendLightningPayment(
    walletId: string,
    lightningInvoice: string,
    amount: number,
    description?: string,
  ): Promise<CryptoTransaction> {
    try {
      const wallet = await this.getWallet(walletId)
      if (!wallet || wallet.type !== "lightning") {
        throw new Error("Invalid Lightning wallet")
      }

      if (wallet.balance < amount) {
        throw new Error("Insufficient Lightning balance")
      }

      const transaction: CryptoTransaction = {
        id: crypto.randomUUID(),
        walletId,
        type: "send",
        amount,
        currency: "BTC",
        toAddress: lightningInvoice,
        fromAddress: wallet.address,
        txHash: this.generateTxHash(),
        status: "confirmed", // Lightning is instant
        confirmations: 1,
        fees: this.calculateLightningFees(amount),
        description,
        createdAt: new Date(),
        confirmedAt: new Date(),
      }

      await sql`
        INSERT INTO crypto_transactions (
          id, wallet_id, type, amount, currency, to_address, from_address,
          tx_hash, status, confirmations, fees, description, created_at, confirmed_at
        )
        VALUES (
          ${transaction.id}, ${transaction.walletId}, ${transaction.type},
          ${transaction.amount}, ${transaction.currency}, ${transaction.toAddress},
          ${transaction.fromAddress}, ${transaction.txHash}, ${transaction.status},
          ${transaction.confirmations}, ${transaction.fees}, ${transaction.description},
          ${transaction.createdAt}, ${transaction.confirmedAt}
        )
      `

      // Update wallet balance immediately
      await this.updateWalletBalance(walletId, -amount - transaction.fees)

      return transaction
    } catch (error) {
      console.error("Failed to send Lightning payment:", error)
      throw new Error("Lightning payment failed")
    }
  }

  // Send Stellar payment for global transfers
  async sendStellarPayment(
    walletId: string,
    toAddress: string,
    amount: number,
    currency: "XLM" | "USD",
    description?: string,
  ): Promise<CryptoTransaction> {
    try {
      const wallet = await this.getWallet(walletId)
      if (!wallet || wallet.type !== "stellar") {
        throw new Error("Invalid Stellar wallet")
      }

      const transaction: CryptoTransaction = {
        id: crypto.randomUUID(),
        walletId,
        type: "send",
        amount,
        currency,
        toAddress,
        fromAddress: wallet.address,
        txHash: this.generateTxHash(),
        status: "pending",
        confirmations: 0,
        fees: this.calculateStellarFees(),
        description,
        createdAt: new Date(),
      }

      await sql`
        INSERT INTO crypto_transactions (
          id, wallet_id, type, amount, currency, to_address, from_address,
          tx_hash, status, confirmations, fees, description, created_at
        )
        VALUES (
          ${transaction.id}, ${transaction.walletId}, ${transaction.type},
          ${transaction.amount}, ${transaction.currency}, ${transaction.toAddress},
          ${transaction.fromAddress}, ${transaction.txHash}, ${transaction.status},
          ${transaction.confirmations}, ${transaction.fees}, ${transaction.description},
          ${transaction.createdAt}
        )
      `

      // Stellar transactions are fast (3-5 seconds)
      setTimeout(() => this.processStellarTransaction(transaction.id), 3000)

      return transaction
    } catch (error) {
      console.error("Failed to send Stellar payment:", error)
      throw new Error("Stellar payment failed")
    }
  }

  // Get current exchange rates
  async getExchangeRates(): Promise<ExchangeRate[]> {
    try {
      // In production, fetch from real crypto APIs
      return [
        { currency: "BTC", usdRate: 45000, lastUpdated: new Date() },
        { currency: "XLM", usdRate: 0.12, lastUpdated: new Date() },
      ]
    } catch (error) {
      console.error("Failed to get exchange rates:", error)
      return []
    }
  }

  // Convert crypto to USD
  async convertToUSD(amount: number, currency: "BTC" | "XLM"): Promise<number> {
    const rates = await this.getExchangeRates()
    const rate = rates.find((r) => r.currency === currency)
    return rate ? amount * rate.usdRate : 0
  }

  // Private helper methods
  private generateBitcoinKeyPair(): { publicKey: string; privateKey: string } {
    // Simulate Bitcoin key generation
    return {
      publicKey: `03${crypto.randomBytes(32).toString("hex")}`,
      privateKey: crypto.randomBytes(32).toString("hex"),
    }
  }

  private generateLightningKeyPair(): { publicKey: string; privateKey: string } {
    // Simulate Lightning key generation
    return {
      publicKey: `02${crypto.randomBytes(32).toString("hex")}`,
      privateKey: crypto.randomBytes(32).toString("hex"),
    }
  }

  private generateStellarKeyPair(): { publicKey: string; privateKey: string } {
    // Simulate Stellar key generation
    return {
      publicKey: `G${crypto
        .randomBytes(28)
        .toString("base64")
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 55)}`,
      privateKey: `S${crypto
        .randomBytes(28)
        .toString("base64")
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 55)}`,
    }
  }

  private generateBitcoinAddress(publicKey: string): string {
    // Simulate Bitcoin address generation
    return `bc1q${crypto.randomBytes(20).toString("hex")}`
  }

  private async encryptPrivateKey(privateKey: string, userId: string): Promise<string> {
    // In production, use proper encryption with user's master key
    return Buffer.from(privateKey).toString("base64")
  }

  private generateTxHash(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  private calculateBitcoinFees(amount: number): number {
    return Math.max(0.00001, amount * 0.001) // 0.1% or minimum 0.00001 BTC
  }

  private calculateLightningFees(amount: number): number {
    return Math.max(0.000001, amount * 0.0001) // 0.01% or minimum 1 satoshi
  }

  private calculateStellarFees(): number {
    return 0.00001 // Fixed Stellar fee
  }

  private async getWallet(walletId: string): Promise<CryptoWallet | null> {
    try {
      const result = await sql`
        SELECT * FROM crypto_wallets WHERE id = ${walletId}
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Failed to get wallet:", error)
      return null
    }
  }

  private async updateWalletBalance(walletId: string, balanceChange: number): Promise<void> {
    try {
      await sql`
        UPDATE crypto_wallets 
        SET balance = balance + ${balanceChange}, last_sync_at = NOW()
        WHERE id = ${walletId}
      `
    } catch (error) {
      console.error("Failed to update wallet balance:", error)
    }
  }

  private async processBitcoinTransaction(transactionId: string): Promise<void> {
    try {
      // Simulate Bitcoin confirmation process
      const confirmations = Math.floor(Math.random() * 6) + 1

      await sql`
        UPDATE crypto_transactions 
        SET status = 'confirmed', confirmations = ${confirmations}, confirmed_at = NOW()
        WHERE id = ${transactionId}
      `

      // Update wallet balance
      const transaction = await sql`
        SELECT * FROM crypto_transactions WHERE id = ${transactionId}
      `

      if (transaction.length > 0) {
        const tx = transaction[0]
        const balanceChange = tx.type === "send" ? -(tx.amount + tx.fees) : tx.amount
        await this.updateWalletBalance(tx.wallet_id, balanceChange)
      }
    } catch (error) {
      console.error("Failed to process Bitcoin transaction:", error)
    }
  }

  private async processStellarTransaction(transactionId: string): Promise<void> {
    try {
      await sql`
        UPDATE crypto_transactions 
        SET status = 'confirmed', confirmations = 1, confirmed_at = NOW()
        WHERE id = ${transactionId}
      `

      // Update wallet balance
      const transaction = await sql`
        SELECT * FROM crypto_transactions WHERE id = ${transactionId}
      `

      if (transaction.length > 0) {
        const tx = transaction[0]
        const balanceChange = tx.type === "send" ? -(tx.amount + tx.fees) : tx.amount
        await this.updateWalletBalance(tx.wallet_id, balanceChange)
      }
    } catch (error) {
      console.error("Failed to process Stellar transaction:", error)
    }
  }

  private async fundStellarWallet(walletId: string): Promise<void> {
    try {
      // Fund with minimum XLM for operations (1 XLM)
      await sql`
        UPDATE crypto_wallets 
        SET balance = 1.0, balance_usd = 0.12
        WHERE id = ${walletId}
      `
    } catch (error) {
      console.error("Failed to fund Stellar wallet:", error)
    }
  }
}

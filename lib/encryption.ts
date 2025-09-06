import crypto from "crypto"

// AES-256-GCM encryption for PII data
const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const TAG_LENGTH = 16

// In production, this would come from Vault or secure key management
const MASTER_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(KEY_LENGTH).toString("hex")

export interface EncryptedData {
  encrypted: string
  iv: string
  tag: string
}

export function encryptPII(data: string): EncryptedData {
  const key = Buffer.from(MASTER_KEY, "hex")
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  cipher.setAAD(Buffer.from("banking-pii"))

  const encryptedBuf = Buffer.concat([cipher.update(Buffer.from(data, "utf8")), cipher.final()])
  const tag = cipher.getAuthTag()
  const encrypted = encryptedBuf.toString("hex")

  return {
    encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  }
}

export function decryptPII(encryptedData: EncryptedData): string {
  const key = Buffer.from(MASTER_KEY, "hex")
  const iv = Buffer.from(encryptedData.iv, "hex")
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAAD(Buffer.from("banking-pii"))
  decipher.setAuthTag(Buffer.from(encryptedData.tag, "hex"))

  const decryptedBuf = Buffer.concat([decipher.update(Buffer.from(encryptedData.encrypted, "hex")), decipher.final()])
  return decryptedBuf.toString("utf8")
}

// Data masking utilities
export function maskSSN(ssn: string): string {
  if (!ssn || ssn.length < 4) return "***-**-****"
  return `***-**-${ssn.slice(-4)}`
}

export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length < 4) return "****"
  return `****${accountNumber.slice(-4)}`
}

export function maskEmail(email: string): string {
  const [username, domain] = email.split("@")
  if (username.length <= 2) return `${username}***@${domain}`
  return `${username.slice(0, 2)}***@${domain}`
}

export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 4) return "***-***-****"
  return `***-***-${phone.slice(-4)}`
}

// Tokenization for sensitive IDs
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function hashSensitiveData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex")
}

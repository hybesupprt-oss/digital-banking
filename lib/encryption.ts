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
  const cipher = crypto.createCipher(ALGORITHM, key)
  cipher.setAAD(Buffer.from("banking-pii"))

  let encrypted = cipher.update(data, "utf8", "hex")
  encrypted += cipher.final("hex")

  const tag = cipher.getAuthTag()

  return {
    encrypted,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  }
}

export function decryptPII(encryptedData: EncryptedData): string {
  const key = Buffer.from(MASTER_KEY, "hex")
  const decipher = crypto.createDecipher(ALGORITHM, key)
  decipher.setAAD(Buffer.from("banking-pii"))
  decipher.setAuthTag(Buffer.from(encryptedData.tag, "hex"))

  let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
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

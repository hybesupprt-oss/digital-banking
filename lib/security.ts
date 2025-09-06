import { sql } from "./db"
import crypto from "crypto"

export interface SecurityEvent {
  userId: string
  sessionId?: string
  eventType:
    | "login_attempt"
    | "login_success"
    | "login_failure"
    | "password_change"
    | "mfa_setup"
    | "suspicious_activity"
  ipAddress: string
  userAgent: string
  riskScore: number
  metadata?: Record<string, any>
}

export interface DeviceFingerprint {
  id: string
  userId: string
  fingerprint: string
  deviceName: string
  trusted: boolean
  lastSeen: Date
  createdAt: Date
}

// Enhanced audit logging with risk scoring
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    await sql`
      INSERT INTO security_events (
        user_id, session_id, event_type, ip_address, user_agent, 
        risk_score, metadata, created_at
      )
      VALUES (
        ${event.userId}, ${event.sessionId}, ${event.eventType}, 
        ${event.ipAddress}, ${event.userAgent}, ${event.riskScore}, 
        ${JSON.stringify(event.metadata)}, NOW()
      )
    `
  } catch (error) {
    console.error("Failed to log security event:", error)
  }
}

// Device fingerprinting for fraud detection
export function generateDeviceFingerprint(request: Request): string {
  const userAgent = request.headers.get("user-agent") || ""
  const acceptLanguage = request.headers.get("accept-language") || ""
  const acceptEncoding = request.headers.get("accept-encoding") || ""

  const fingerprint = crypto.createHash("sha256").update(`${userAgent}${acceptLanguage}${acceptEncoding}`).digest("hex")

  return fingerprint
}

// Risk scoring based on various factors
export function calculateRiskScore(factors: {
  newDevice?: boolean
  unusualLocation?: boolean
  offHours?: boolean
  multipleFailedAttempts?: boolean
  vpnDetected?: boolean
}): number {
  let score = 0

  if (factors.newDevice) score += 30
  if (factors.unusualLocation) score += 40
  if (factors.offHours) score += 20
  if (factors.multipleFailedAttempts) score += 50
  if (factors.vpnDetected) score += 25

  return Math.min(score, 100)
}

// Rate limiting for API endpoints
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const key = identifier
  const current = rateLimitStore.get(key)

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

// Multi-factor authentication utilities
export function generateMFASecret(): string {
  // Node's crypto does not support base32 encoding via toString; use hex instead for deterministic IDs
  return crypto.randomBytes(20).toString("hex")
}

export function generateMFABackupCodes(): string[] {
  const codes = []
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString("hex").toUpperCase())
  }
  return codes
}

// Secure session management
export async function createSecureSession(
  userId: string,
  deviceFingerprint: string,
  ipAddress: string,
): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  try {
    await sql`
      INSERT INTO sessions (
        id, user_id, device_fingerprint, ip_address, 
        expires_at, created_at, last_activity
      )
      VALUES (
        ${sessionId}, ${userId}, ${deviceFingerprint}, 
        ${ipAddress}, ${expiresAt}, NOW(), NOW()
      )
    `

    return sessionId
  } catch (error) {
    console.error("Failed to create secure session:", error)
    throw new Error("Session creation failed")
  }
}

export async function validateSecureSession(sessionId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id, expires_at 
      FROM sessions 
      WHERE id = ${sessionId} AND expires_at > NOW()
    `

    if (result.length === 0) return false

    // Update last activity
    await sql`
      UPDATE sessions 
      SET last_activity = NOW() 
      WHERE id = ${sessionId}
    `

    return true
  } catch (error) {
    console.error("Failed to validate session:", error)
    return false
  }
}

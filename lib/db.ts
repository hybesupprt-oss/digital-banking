import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Database utility functions for user management
export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT id, email, first_name, last_name, role, kyc_status, is_active, email_verified
    FROM users 
    WHERE email = ${email} AND is_active = true
  `
  return result[0] || null
}

export async function createUser(userData: {
  email: string
  firstName: string
  lastName: string
  phone?: string
}) {
  const result = await sql`
    INSERT INTO users (email, first_name, last_name, phone)
    VALUES (${userData.email}, ${userData.firstName}, ${userData.lastName}, ${userData.phone})
    RETURNING id, email, first_name, last_name, role, kyc_status
  `
  return result[0]
}

export async function updateUserLastLogin(userId: string) {
  await sql`
    UPDATE users 
    SET last_login_at = NOW()
    WHERE id = ${userId}
  `
}

export async function createAuditLog(logData: {
  userId?: string
  sessionId?: string
  action: string
  resourceType: string
  resourceId?: string
  ipAddress?: string
  userAgent?: string
  description?: string
}) {
  await sql`
    INSERT INTO audit_logs (
      user_id, session_id, action, resource_type, resource_id, 
      ip_address, user_agent, description
    )
    VALUES (
      ${logData.userId}, ${logData.sessionId}, ${logData.action}, 
      ${logData.resourceType}, ${logData.resourceId}, ${logData.ipAddress}, 
      ${logData.userAgent}, ${logData.description}
    )
  `
}

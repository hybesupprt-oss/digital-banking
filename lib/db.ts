import { neon } from "@neondatabase/serverless"

const usingRealDB = Boolean(process.env.DATABASE_URL)

let sql: any

if (usingRealDB) {
  sql = neon(process.env.DATABASE_URL)
} else {
  // Fallback tagged-template function for local dev when DATABASE_URL isn't set.
  // Returns empty arrays or resolves basic in-memory operations used by helpers below.
  console.warn("DATABASE_URL environment variable is not set — using in-memory mock database for development")
  const mockDB: { users: any[]; audit_logs: any[] } = { users: [], audit_logs: [] }

  sql = async (strings: TemplateStringsArray, ..._params: any[]) => {
    // Very small stub: most queries in this app expect arrays of rows. Return empty array.
    return []
  }

  // Expose mockDB for helper functions below via closure
  ;(sql as any)._mockDB = mockDB
}

export { sql }

// Database utility functions for user management
export async function getUserByEmail(email: string) {
  if (usingRealDB) {
    const result = await sql`
      SELECT id, email, first_name, last_name, role, kyc_status, is_active, email_verified
      FROM users 
      WHERE email = ${email} AND is_active = true
    `
    return result[0] || null
  }

  const mockDB = (sql as any)._mockDB
  const user = mockDB.users.find((u: any) => u.email === email && u.is_active !== false)
  return user || null
}

export async function createUser(userData: {
  email: string
  firstName: string
  lastName: string
  phone?: string
}) {
  if (usingRealDB) {
    const result = await sql`
      INSERT INTO users (email, first_name, last_name, phone)
      VALUES (${userData.email}, ${userData.firstName}, ${userData.lastName}, ${userData.phone})
      RETURNING id, email, first_name, last_name, role, kyc_status
    `
    return result[0]
  }

  const mockDB = (sql as any)._mockDB
  const newUser = {
    id: String(Date.now()) + Math.floor(Math.random() * 1000),
    email: userData.email,
    first_name: userData.firstName,
    last_name: userData.lastName,
    phone: userData.phone || null,
    role: 'user',
    kyc_status: 'unverified',
    is_active: true,
    email_verified: false
  }
  mockDB.users.push(newUser)
  return newUser
}

export async function updateUserLastLogin(userId: string) {
  if (usingRealDB) {
    await sql`
      UPDATE users 
      SET last_login_at = NOW()
      WHERE id = ${userId}
    `
    return
  }

  const mockDB = (sql as any)._mockDB
  const user = mockDB.users.find((u: any) => u.id === userId)
  if (user) user.last_login_at = new Date().toISOString()
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
  if (usingRealDB) {
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
    return
  }

  const mockDB = (sql as any)._mockDB
  mockDB.audit_logs.push({
    id: String(Date.now()) + Math.floor(Math.random() * 1000),
    user_id: logData.userId || null,
    session_id: logData.sessionId || null,
    action: logData.action,
    resource_type: logData.resourceType,
    resource_id: logData.resourceId || null,
    ip_address: logData.ipAddress || null,
    user_agent: logData.userAgent || null,
    description: logData.description || null,
    created_at: new Date().toISOString()
  })
}

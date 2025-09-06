import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { updateUserLastLogin, createAuditLog } from "./db"
import { sql } from "./db"
import nodeCrypto from "crypto"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "member" | "admin" | "teller" | "manager"
  kycStatus: "pending" | "in_review" | "approved" | "rejected" | "expired"
}

export interface Session {
  user: User
  sessionId: string
  expiresAt: Date
}

// Mock session store - in production this would use the PostgreSQL sessions table
const sessions = new Map<string, Session>()

export async function createSession(user: User, request?: Request): Promise<string> {
  const sessionId = nodeCrypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  const session: Session = {
    user,
    sessionId,
    expiresAt,
  }

  sessions.set(sessionId, session)

  // Set HTTP-only cookie
  const cookieStore = await cookies()
  cookieStore.set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  // Update last login and create audit log
  await updateUserLastLogin(user.id)

  if (request) {
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    await createAuditLog({
      userId: user.id,
      sessionId,
      action: "login",
      resourceType: "user",
      resourceId: user.id,
      ipAddress,
      userAgent,
      description: "User logged in successfully",
    })
  }

  return sessionId
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (!sessionId) return null

  const session = sessions.get(sessionId)
  if (!session) return null

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    sessions.delete(sessionId)
    return null
  }

  return session
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (sessionId) {
    const session = sessions.get(sessionId)
    sessions.delete(sessionId)

    // Create logout audit log
    if (session) {
      await createAuditLog({
        userId: session.user.id,
        sessionId,
        action: "logout",
        resourceType: "user",
        resourceId: session.user.id,
        description: "User logged out",
      })
    }
  }

  // Clear cookie
  cookieStore.delete("session")
}

export async function requireAuth(): Promise<User> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session.user
}

export async function requireRole(allowedRoles: string[]): Promise<User> {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, first_name, last_name, role, kyc_status
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `

    if (result.length === 0) return null

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      kycStatus: user.kyc_status,
    }
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  firstName: string
  lastName: string
  passwordHash: string
}): Promise<User | null> {
  try {
    const result = await sql`
      INSERT INTO users (email, first_name, last_name, password_hash, role, kyc_status)
      VALUES (${userData.email}, ${userData.firstName}, ${userData.lastName}, ${userData.passwordHash}, 'member', 'pending')
      RETURNING id, email, first_name, last_name, role, kyc_status
    `

    if (result.length === 0) return null

    const user = result[0]
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      kycStatus: user.kyc_status,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

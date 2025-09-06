import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { updateUserLastLogin, createAuditLog, getUserByEmail as dbGetUserByEmail, createUser as dbCreateUser } from "./db"
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
    const row = await dbGetUserByEmail(email)
    if (!row) return null

    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name ?? row.firstName,
      lastName: row.last_name ?? row.lastName,
      role: row.role,
      kycStatus: row.kyc_status ?? row.kycStatus,
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
    const row = await dbCreateUser({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: undefined,
    } as any)

    if (!row) return null

    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name ?? row.firstName,
      lastName: row.last_name ?? row.lastName,
      role: row.role,
      kycStatus: row.kyc_status ?? row.kycStatus,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

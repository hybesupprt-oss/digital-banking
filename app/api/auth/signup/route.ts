import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
  const { firstName, lastName, email, password } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    // Create new user
    // NOTE: For demo only — derive a simple password hash placeholder.
    const passwordHash = `demohash_${Buffer.from(password).toString("hex").slice(0,32)}`

    const newUser = await createUser({
      email: email.toLowerCase(),
      firstName,
      lastName,
      passwordHash,
    })

    // TODO: In production, hash the password and store it
    // For demo purposes, we're not storing passwords

    if (!newUser) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create session for the new user (normalize to camelCase)
    const sessionId = await createSession(
      {
        id: newUser.id,
        email: newUser.email,
        firstName: (newUser as any).firstName ?? newUser.first_name,
        lastName: (newUser as any).lastName ?? newUser.last_name,
        role: newUser.role,
        kycStatus: (newUser as any).kycStatus ?? newUser.kyc_status,
      },
      request,
    )

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: (newUser as any).firstName ?? newUser.first_name,
        lastName: (newUser as any).lastName ?? newUser.last_name,
        role: newUser.role,
        kycStatus: (newUser as any).kycStatus ?? newUser.kyc_status,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

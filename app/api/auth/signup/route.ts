import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password } = await request.json()

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
    const newUser = await createUser({
      email: email.toLowerCase(),
      firstName,
      lastName,
      phone,
    })

    // TODO: In production, hash the password and store it
    // For demo purposes, we're not storing passwords

    // Create session for the new user
    const sessionId = await createSession(
      {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
        kycStatus: newUser.kyc_status,
      },
      request,
    )

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
        kycStatus: newUser.kyc_status,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

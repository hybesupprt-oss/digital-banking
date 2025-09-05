import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get user from database
    const user = await getUserByEmail(email.toLowerCase())

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // In a real app, you would verify the password hash here
    // For demo purposes, we'll accept any password for existing users
    // TODO: Implement proper password hashing with bcrypt

    // Check if user account is active
    if (!user.is_active) {
      return NextResponse.json({ error: "Account is inactive. Please contact support." }, { status: 401 })
    }

    // Create session
    const sessionId = await createSession(
      {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        kycStatus: user.kyc_status,
      },
      request,
    )

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        kycStatus: user.kyc_status,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

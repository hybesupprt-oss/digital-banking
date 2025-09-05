import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql, createAuditLog } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { personalInfo, addressInfo, documents } = await request.json()

    // Validate required fields
    if (!personalInfo.dateOfBirth || !personalInfo.ssn || !personalInfo.occupation) {
      return NextResponse.json({ error: "Missing required personal information" }, { status: 400 })
    }

    if (!addressInfo.streetAddress || !addressInfo.city || !addressInfo.state || !addressInfo.zipCode) {
      return NextResponse.json({ error: "Missing required address information" }, { status: 400 })
    }

    if (!documents.includes("identity") || !documents.includes("address")) {
      return NextResponse.json({ error: "Required documents not uploaded" }, { status: 400 })
    }

    // Create KYC submission record
    const kycResult = await sql`
      INSERT INTO kyc_submissions (
        user_id,
        submission_type,
        kyc_status,
        identity_document_type,
        annual_income,
        employment_status,
        employer_name,
        submitted_at
      ) VALUES (
        ${session.user.id},
        'initial',
        'in_review',
        'drivers_license',
        ${personalInfo.annualIncome || null},
        ${personalInfo.occupation || null},
        ${personalInfo.employerName || null},
        NOW()
      ) RETURNING id
    `

    const kycSubmissionId = kycResult[0].id

    // Update user information
    await sql`
      UPDATE users 
      SET 
        date_of_birth = ${personalInfo.dateOfBirth},
        ssn_hash = ${personalInfo.ssn}, -- In production, hash this properly
        street_address = ${addressInfo.streetAddress},
        city = ${addressInfo.city},
        state = ${addressInfo.state},
        zip_code = ${addressInfo.zipCode},
        country = ${addressInfo.country},
        kyc_status = 'in_review',
        updated_at = NOW()
      WHERE id = ${session.user.id}
    `

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      sessionId: session.sessionId,
      action: "kyc_update",
      resourceType: "kyc_submission",
      resourceId: kycSubmissionId,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      description: "KYC verification documents submitted for review",
    })

    return NextResponse.json({
      success: true,
      submissionId: kycSubmissionId,
      status: "in_review",
      message: "KYC verification submitted successfully",
    })
  } catch (error) {
    console.error("KYC submission error:", error)
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 })
  }
}

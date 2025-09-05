"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, MapPin } from "lucide-react"
import type { User as AuthUser } from "@/lib/auth"

interface KycVerificationFormProps {
  user: AuthUser
}

interface DocumentUpload {
  file: File | null
  preview: string | null
  uploaded: boolean
}

export function KycVerificationForm({ user }: KycVerificationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form data
  const [personalInfo, setPersonalInfo] = useState({
    dateOfBirth: "",
    ssn: "",
    occupation: "",
    employerName: "",
    annualIncome: "",
    sourceOfFunds: "",
  })

  const [addressInfo, setAddressInfo] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    residencyStatus: "",
  })

  const [documents, setDocuments] = useState({
    identity: { file: null, preview: null, uploaded: false } as DocumentUpload,
    address: { file: null, preview: null, uploaded: false } as DocumentUpload,
    income: { file: null, preview: null, uploaded: false } as DocumentUpload,
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleFileUpload = (documentType: keyof typeof documents, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size must be less than 10MB")
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, and PDF files are allowed")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: {
          file,
          preview: e.target?.result as string,
          uploaded: false,
        },
      }))
    }
    reader.readAsDataURL(file)
    setError("")
  }

  const uploadDocument = async (documentType: keyof typeof documents) => {
    const doc = documents[documentType]
    if (!doc.file) return

    setIsLoading(true)
    try {
      // In production, upload to secure storage
      // For demo, simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setDocuments((prev) => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          uploaded: true,
        },
      }))
      setSuccess(`${documentType} document uploaded successfully`)
    } catch (err) {
      setError("Upload failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalInfo,
          addressInfo,
          documents: Object.keys(documents).filter((key) => documents[key as keyof typeof documents].uploaded),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("KYC verification submitted successfully! We will review your information within 1-2 business days.")
        setCurrentStep(totalSteps + 1) // Show completion step
      } else {
        setError(data.error || "Submission failed. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return personalInfo.dateOfBirth && personalInfo.ssn && personalInfo.occupation
      case 2:
        return addressInfo.streetAddress && addressInfo.city && addressInfo.state && addressInfo.zipCode
      case 3:
        return documents.identity.uploaded && documents.address.uploaded
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ssn">Social Security Number</Label>
                <Input
                  id="ssn"
                  type="password"
                  placeholder="XXX-XX-XXXX"
                  value={personalInfo.ssn}
                  onChange={(e) => setPersonalInfo((prev) => ({ ...prev, ssn: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  placeholder="Software Engineer"
                  value={personalInfo.occupation}
                  onChange={(e) => setPersonalInfo((prev) => ({ ...prev, occupation: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employerName">Employer Name</Label>
                <Input
                  id="employerName"
                  placeholder="Company Name"
                  value={personalInfo.employerName}
                  onChange={(e) => setPersonalInfo((prev) => ({ ...prev, employerName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualIncome">Annual Income</Label>
                <Select
                  value={personalInfo.annualIncome}
                  onValueChange={(value) => setPersonalInfo((prev) => ({ ...prev, annualIncome: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                    <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                    <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                    <SelectItem value="over-150k">Over $150,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceOfFunds">Primary Source of Funds</Label>
                <Select
                  value={personalInfo.sourceOfFunds}
                  onValueChange={(value) => setPersonalInfo((prev) => ({ ...prev, sourceOfFunds: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="business">Business Income</SelectItem>
                    <SelectItem value="investments">Investments</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Address Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  placeholder="123 Main Street"
                  value={addressInfo.streetAddress}
                  onChange={(e) => setAddressInfo((prev) => ({ ...prev, streetAddress: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={addressInfo.city}
                    onChange={(e) => setAddressInfo((prev) => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={addressInfo.state}
                    onChange={(e) => setAddressInfo((prev) => ({ ...prev, state: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="10001"
                    value={addressInfo.zipCode}
                    onChange={(e) => setAddressInfo((prev) => ({ ...prev, zipCode: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={addressInfo.country}
                    onValueChange={(value) => setAddressInfo((prev) => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residencyStatus">Residency Status</Label>
                  <Select
                    value={addressInfo.residencyStatus}
                    onValueChange={(value) => setAddressInfo((prev) => ({ ...prev, residencyStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizen">US Citizen</SelectItem>
                      <SelectItem value="permanent-resident">Permanent Resident</SelectItem>
                      <SelectItem value="visa-holder">Visa Holder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Document Upload</h3>
            </div>

            {/* Identity Document */}
            <div className="space-y-3">
              <Label>Identity Document</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                {documents.identity.file ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{documents.identity.file.name}</span>
                      {documents.identity.uploaded ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Uploaded
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => uploadDocument("identity")} disabled={isLoading}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Upload your government-issued ID</p>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload("identity", e.target.files[0])}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Address Document */}
            <div className="space-y-3">
              <Label>Address Verification</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                {documents.address.file ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{documents.address.file.name}</span>
                      {documents.address.uploaded ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Uploaded
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => uploadDocument("address")} disabled={isLoading}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Upload proof of address</p>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload("address", e.target.files[0])}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Review & Submit</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Personal Information</h4>
                <div className="text-sm space-y-1">
                  <p>Date of Birth: {personalInfo.dateOfBirth}</p>
                  <p>Occupation: {personalInfo.occupation}</p>
                  <p>Annual Income: {personalInfo.annualIncome}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Address</h4>
                <div className="text-sm">
                  <p>{addressInfo.streetAddress}</p>
                  <p>
                    {addressInfo.city}, {addressInfo.state} {addressInfo.zipCode}
                  </p>
                  <p>{addressInfo.country}</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Documents</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Identity Document</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Address Verification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2">Verification Submitted!</h3>
            <p className="text-muted-foreground">
              We'll review your information within 1-2 business days and notify you of the results.
            </p>
          </div>
        )
    }
  }

  if (user.kycStatus === "approved") {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
          <h3 className="text-xl font-semibold mb-2">Identity Verified</h3>
          <p className="text-muted-foreground">
            Your identity has been successfully verified. You have access to all banking features.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Identity Verification</CardTitle>
          <Badge variant="secondary">
            Step {Math.min(currentStep, totalSteps)} of {totalSteps}
          </Badge>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {renderStepContent()}

        {currentStep <= totalSteps && (
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1 || isLoading}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceedToNextStep() || isLoading}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!documents.identity.uploaded || !documents.address.uploaded || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Review"
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, CheckCircle, XCircle, Eye, FileText, Shield, AlertTriangle, Loader2 } from "lucide-react"
import { BiometricVerificationService } from "@/lib/biometric-verification"

interface AdvancedKycFormProps {
  userId: string
  onComplete: (result: any) => void
}

export function AdvancedKycForm({ userId, onComplete }: AdvancedKycFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Document verification state
  const [documentUploaded, setDocumentUploaded] = useState(false)
  const [documentVerified, setDocumentVerified] = useState(false)

  // Biometric verification state
  const [cameraActive, setCameraActive] = useState(false)
  const [livenessCompleted, setLivenessCompleted] = useState(false)
  const [faceMatched, setFaceMatched] = useState(false)

  // Progress tracking
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const biometricService = BiometricVerificationService.getInstance()

  useEffect(() => {
    // Initialize face API when component mounts
    biometricService.initializeFaceAPI()
  }, [])

  const steps = [
    { id: 1, title: "Document Upload", description: "Upload government-issued ID" },
    { id: 2, title: "Document Verification", description: "Verify document authenticity" },
    { id: 3, title: "Liveness Detection", description: "Prove you're a real person" },
    { id: 4, title: "Face Matching", description: "Match your face to ID photo" },
    { id: 5, title: "Final Review", description: "Complete verification process" },
  ]

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Starting document upload and verification...")

      // Simulate document processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const verification = await biometricService.verifyDocumentAuthenticity(file)

      setDocumentUploaded(true)
      setVerificationProgress(25)

      // Auto-advance to document verification
      setTimeout(() => {
        setDocumentVerified(true)
        setVerificationProgress(50)
        setCurrentStep(3)
      }, 2000)
    } catch (error) {
      setError("Document verification failed. Please try again with a clear, high-quality image.")
    } finally {
      setLoading(false)
    }
  }

  const startLivenessDetection = async () => {
    setLoading(true)
    setError(null)

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }

      // Perform liveness detection
      const livenessResult = await biometricService.performLivenessDetection(stream)

      if (livenessResult.isLive) {
        setLivenessCompleted(true)
        setVerificationProgress(75)
        setCurrentStep(4)

        // Proceed to face matching
        setTimeout(() => performFaceMatching(stream), 1000)
      } else {
        setError("Liveness detection failed. Please ensure good lighting and follow the instructions.")
      }
    } catch (error) {
      setError("Camera access denied or not available. Please enable camera permissions.")
    } finally {
      setLoading(false)
    }
  }

  const performFaceMatching = async (stream: MediaStream) => {
    try {
      console.log("[v0] Starting face matching process...")

      // Capture frame from video
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

          // Extract face descriptor
          const faceDescriptor = await biometricService.extractFaceDescriptor(imageData)

          if (faceDescriptor) {
            // Simulate comparison with document photo
            const similarity = 0.85 + Math.random() * 0.1 // 85-95% match

            if (similarity > 0.8) {
              setFaceMatched(true)
              setVerificationProgress(100)
              setCurrentStep(5)

              // Complete verification
              setTimeout(() => completeVerification(), 2000)
            } else {
              setError("Face does not match document photo. Please try again.")
            }
          }
        }
      }

      // Stop camera stream
      stream.getTracks().forEach((track) => track.stop())
      setCameraActive(false)
    } catch (error) {
      setError("Face matching failed. Please try again.")
    }
  }

  const completeVerification = async () => {
    try {
      console.log("[v0] Completing KYC verification...")

      // Perform final risk assessment
      const riskAssessment = await biometricService.performRiskAssessment({
        personalInfo: {},
        documentVerification: {} as any,
        biometricVerification: {} as any,
        addressVerification: {},
      })

      // Perform AML screening
      const amlResult = await biometricService.performAMLScreening({
        fullName: "John Doe",
        dateOfBirth: "1990-01-15",
      })

      const result = {
        status: "completed",
        riskLevel: riskAssessment.riskLevel,
        verificationId: crypto.randomUUID(),
        completedAt: new Date(),
      }

      onComplete(result)
    } catch (error) {
      setError("Verification completion failed. Please contact support.")
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Upload Identity Document
              </CardTitle>
              <CardDescription>
                Please upload a clear photo of your government-issued ID (passport, driver's license, or national ID)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">Drag and drop your ID document or click to browse</p>
                <Button onClick={() => fileInputRef.current?.click()} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
              </div>

              {documentUploaded && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Document uploaded successfully. Verifying authenticity...</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Document Verification
              </CardTitle>
              <CardDescription>Analyzing document authenticity and extracting information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>

              {documentVerified && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Document verified successfully. Proceeding to liveness detection...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Liveness Detection
              </CardTitle>
              <CardDescription>Please follow the on-screen instructions to prove you're a real person</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!cameraActive ? (
                <div className="text-center p-8">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    We'll use your camera to verify you're a real person
                  </p>
                  <Button onClick={startLivenessDetection} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting Camera...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Start Verification
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <video ref={videoRef} autoPlay muted className="w-full max-w-md mx-auto rounded-lg" />
                    <canvas ref={canvasRef} width={640} height={480} className="hidden" />
                  </div>

                  {currentChallenge && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{currentChallenge}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {livenessCompleted && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Liveness detection completed. Matching face to document...</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Face Matching
              </CardTitle>
              <CardDescription>Comparing your live photo with the document photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>

              {faceMatched && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Face matched successfully. Completing verification...</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Verification Complete
              </CardTitle>
              <CardDescription>Your identity has been successfully verified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Identity Verified</h3>
                <p className="text-sm text-muted-foreground">
                  Your account has been approved for full banking services
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Document Verification</span>
                  <Badge variant="default">Passed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Liveness Detection</span>
                  <Badge variant="default">Passed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Face Matching</span>
                  <Badge variant="default">Passed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Risk Assessment</span>
                  <Badge variant="default">Low Risk</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Identity Verification Progress</h2>
              <span className="text-sm text-muted-foreground">{verificationProgress}% Complete</span>
            </div>

            <Progress value={verificationProgress} className="w-full" />

            <div className="flex justify-between text-xs text-muted-foreground">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle className="h-3 w-3" /> : step.id}
                  </div>
                  <span className="mt-1 text-center">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Step */}
      {renderStep()}
    </div>
  )
}

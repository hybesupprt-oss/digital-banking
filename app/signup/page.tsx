import { SignupForm } from "@/components/auth/signup-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">First City Credit Union</h1>
          <p className="text-gray-600">Join Our Banking Community</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Open Your Account</CardTitle>
            <CardDescription className="text-center">Start your journey with secure digital banking</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Questions? Call us at <span className="font-medium">(555) 123-4567</span>
          </p>
          <p className="mt-2">© 2024 First City Credit Union. Member FDIC.</p>
        </div>
      </div>
    </div>
  )
}

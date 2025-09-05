import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Wells Fargo</h1>
          <p className="text-muted-foreground">Digital Banking</p>
        </div>

        <Card className="shadow-xl border-0 bg-card">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Sign in to access your banking dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Need help? Contact us at <span className="font-medium text-foreground">support@wellsfargo.com</span>
          </p>
          <p className="mt-2">© 2024 Wells Fargo Bank, N.A. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

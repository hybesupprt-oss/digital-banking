import { requireAuth } from "@/lib/auth"
import { PaymentsDashboard } from "@/components/payments/payments-dashboard"

export default async function PaymentsPage() {
  const user = await requireAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Payments & Transfers</h1>
        <p className="text-muted-foreground">Send money, pay bills, and manage your external accounts</p>
      </div>

      <PaymentsDashboard userId={user.id} />
    </div>
  )
}

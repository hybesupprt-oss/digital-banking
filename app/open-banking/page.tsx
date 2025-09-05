import { requireAuth } from "@/lib/auth"
import { OpenBankingDashboard } from "@/components/open-banking/open-banking-dashboard"

export default async function OpenBankingPage() {
  const user = await requireAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Connected Accounts</h1>
        <p className="text-muted-foreground">Link your external bank accounts to view all your finances in one place</p>
      </div>

      <OpenBankingDashboard userId={user.id} />
    </div>
  )
}

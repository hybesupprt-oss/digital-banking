import { requireAuth } from "@/lib/auth"
import { CryptoDashboard } from "@/components/crypto/crypto-dashboard"

export default async function CryptoPage() {
  const user = await requireAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crypto Wallets & Payments</h1>
        <p className="text-muted-foreground">
          Send and receive Bitcoin, Lightning payments, and global transfers via Stellar
        </p>
      </div>

      <CryptoDashboard userId={user.id} />
    </div>
  )
}

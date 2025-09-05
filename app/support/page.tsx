import { Suspense } from "react"
import { SupportDashboard } from "@/components/support/support-dashboard"
import { ContactOptions } from "@/components/support/contact-options"
import { FAQSection } from "@/components/support/faq-section"

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Customer Support</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
            <SupportDashboard />
          </Suspense>
          <FAQSection />
        </div>

        <div className="space-y-6">
          <ContactOptions />
        </div>
      </div>
    </div>
  )
}

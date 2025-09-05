import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { ServicesSection } from "@/components/landing/services-section"
import { TrustSection } from "@/components/landing/trust-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default async function HomePage() {
  const session = await getSession()

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ServicesSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Placeholder image - replace with actual brand imagery */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Your Financial Partner for a
                <span className="block text-blue-300"> Brighter Future</span>
              </h1>
              <p className="text-pretty text-xl text-blue-100/90 sm:text-2xl">
                Experience banking that puts your goals first. From everyday checking to investment planning, First City Credit Union delivers the tools and expertise you need to succeed.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                <Link href="/signup">
                  Open an Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="flex justify-center">
                  <Shield className="h-8 w-8 text-blue-300" />
                </div>
                <div className="mt-2 text-sm font-medium text-blue-100">FDIC Insured</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <Users className="h-8 w-8 text-blue-300" />
                </div>
                <div className="mt-2 text-sm font-medium text-blue-100">Community Focused</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-300" />
                </div>
                <div className="mt-2 text-sm font-medium text-blue-100">Growth Oriented</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-blue-500/20 blur-2xl" />
              {/* Placeholder image - replace with actual brand imagery */}
              <img
                src="https://images.unsplash.com/photo-1556742517-8b4b1f6a0b9e?q=80&w=2070&auto=format&fit=crop"
                alt="First City Credit Union"
                className="relative rounded-2xl shadow-2xl object-cover max-h-[420px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

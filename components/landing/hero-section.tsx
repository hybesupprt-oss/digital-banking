import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80')] opacity-20 bg-cover bg-center" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Banking Built for Your
                <span className="block text-primary-foreground"> Financial Future</span>
              </h1>
              <p className="text-pretty text-xl text-primary-foreground/90 sm:text-2xl">
                Experience banking that puts your goals first. From everyday checking to investment planning, First City Credit Union delivers the tools and expertise you need to succeed.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                <Link href="/signup">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-background/20 text-background hover:bg-foreground/10 bg-transparent"
              >
                <Link href="/login">Sign In to Your Account</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="flex justify-center">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <div className="mt-2 text-sm font-medium">FDIC Insured</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <div className="mt-2 text-sm font-medium">70M+ Customers</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <div className="mt-2 text-sm font-medium">150+ Years</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-accent/20 blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
                alt="Professionally dressed people discussing banking solutions"
                className="relative rounded-2xl shadow-2xl object-cover max-h-[420px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

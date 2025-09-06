import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Ready to Get Started?</h2>
          <p className="mt-4 text-pretty text-xl text-primary-foreground/90">
            Join millions of customers who trust First City Credit Union with their financial future. Open your account today and
            experience banking that works for you.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
            <Link href="/signup">
              Open Account Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-background/20 text-background hover:bg-foreground/10 bg-transparent"
          >
            <Link href="/login">Access Your Account</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <Phone className="h-8 w-8 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-primary-foreground/80">1-800-FIRST-CITY</p>
            <p className="text-sm text-primary-foreground/60">Available 24/7</p>
          </div>
          <div className="text-center">
            <MessageCircle className="h-8 w-8 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-primary-foreground/80">Get instant help</p>
            <p className="text-sm text-primary-foreground/60">Mon-Fri 8AM-8PM</p>
          </div>
          <div className="text-center">
            <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-accent-foreground font-bold text-sm">?</span>
            </div>
            <h3 className="font-semibold mb-2">Visit a Branch</h3>
            <p className="text-primary-foreground/80">Find locations near you</p>
            <p className="text-sm text-primary-foreground/60">5,000+ locations</p>
          </div>
        </div>
      </div>
    </section>
  )
}

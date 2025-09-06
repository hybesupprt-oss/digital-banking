import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

import { MapPin } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 bg-blue-700 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to Get Started?</h2>
          <p className="mt-4 text-pretty text-xl text-blue-100/90">
            Join millions of members who trust First City Credit Union with their financial future. Open your account
            today and experience banking that works for you.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100 shadow-md">
            <Link href="/signup">
              Open an Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Link href="/login">Access Your Account</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-4">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p className="text-blue-100/80">1-800-FIRST-CITY</p>
            <p className="text-sm text-blue-200/60">Available 24/7</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-4">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-blue-100/80">Get instant help</p>
            <p className="text-sm text-blue-200/60">Mon-Fri 8AM-8PM</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Visit a Branch</h3>
            <p className="text-blue-100/80">Find locations near you</p>
            <p className="text-sm text-blue-200/60">5,000+ locations</p>
          </div>
        </div>
      </div>
    </section>
  )
}

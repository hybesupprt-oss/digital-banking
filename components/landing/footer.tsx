import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F44ae5eb1081644219977cce4891b7752%2F02932fabb0af4e07bbcffc50c2cc28f6?format=webp&width=128"
                alt="First City Credit Union logo"
                className="h-8 w-auto"
              />
              <div className="text-2xl font-bold text-primary">First City Credit Union</div>
            </div>
            <p className="mt-4 text-sm text-background/80">
              Banking built for your financial future. Member FDIC. Equal Housing Lender.
            </p>
            <div className="mt-6 flex space-x-4">
              <Facebook className="h-5 w-5 text-background/60 hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-background/60 hover:text-primary cursor-pointer" />
              <Linkedin className="h-5 w-5 text-background/60 hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-background/60 hover:text-primary cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-background">Personal Banking</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Checking Accounts
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Savings Accounts
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Credit Cards
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Personal Loans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background">Home Lending</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Mortgages
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Refinancing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Home Equity
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  First-Time Buyers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/support" className="text-background/80 hover:text-primary">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Find ATM/Branch
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Security Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-background/20 pt-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-sm text-background/60">
              © 2024 First City Credit Union Bank, N.A. All rights reserved. NMLSR ID 399801
            </p>
            <div className="mt-4 flex space-x-6 sm:mt-0">
              <Link href="#" className="text-sm text-background/60 hover:text-primary">
                Terms of Use
              </Link>
              <Link href="#" className="text-sm text-background/60 hover:text-primary">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-background/60 hover:text-primary">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

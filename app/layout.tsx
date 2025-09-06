import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"
import dynamic from "next/dynamic"
const PageTransitions = dynamic(() => import("../components/transition/page-transitions"), { ssr: false })
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "First City Credit Union - Digital Banking",
  description: "Secure digital banking services for First City Credit Union members",
  generator: "First City Credit Union",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <PageTransitions>{children}</PageTransitions>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

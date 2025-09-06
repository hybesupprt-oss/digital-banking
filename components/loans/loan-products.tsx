"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Car, GraduationCap, DollarSign, Briefcase } from "lucide-react"

export function LoanProducts() {
  const loanProducts = [
    {
      icon: Home,
      title: "Mortgage Loans",
      description: "Purchase or refinance your home with competitive rates",
      features: ["Fixed & adjustable rates", "FHA & VA loans", "Jumbo mortgages"],
      rate: "6.75%",
      badge: "Popular",
    },
    {
      icon: Car,
      title: "Auto Loans",
      description: "Finance your new or used vehicle with flexible terms",
      features: ["New & used cars", "Up to 84 months", "No prepayment penalty"],
      rate: "4.25%",
      badge: "Low Rate",
    },
    {
      icon: DollarSign,
      title: "Personal Loans",
      description: "Unsecured loans for any personal need",
      features: ["No collateral required", "Fixed monthly payments", "Quick approval"],
      rate: "5.99%",
      badge: null,
    },
    {
      icon: Home,
      title: "Home Equity",
      description: "Tap into your home's equity for major expenses",
      features: ["Line of credit or loan", "Tax advantages", "Competitive rates"],
      rate: "6.50%",
      badge: null,
    },
    {
      icon: GraduationCap,
      title: "Student Loans",
      description: "Finance your education with flexible repayment options",
      features: ["Undergraduate & graduate", "Deferment options", "No origination fees"],
      rate: "5.25%",
      badge: null,
    },
    {
      icon: Briefcase,
      title: "Business Loans",
      description: "Grow your business with commercial lending solutions",
      features: ["Lines of credit", "Equipment financing", "SBA loans"],
      rate: "7.25%",
      badge: null,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Products</CardTitle>
        <CardDescription>Explore our comprehensive lending solutions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {loanProducts.map((product, index) => {
            const Icon = product.icon
            return (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      {product.badge && (
                        <Badge variant="secondary" className="mt-1">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Starting at</p>
                    <p className="font-semibold text-primary">{product.rate} APR</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{product.description}</p>

                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Learn More
                  </Button>
                  <Button size="sm" className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                    Apply Now
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

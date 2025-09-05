import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Home, PiggyBank, TrendingUp, Shield, Smartphone } from "lucide-react"

const services = [
  {
    icon: CreditCard,
    title: "Personal Banking",
    description:
      "Checking and savings accounts designed for your everyday needs with no monthly fees and nationwide ATM access.",
    features: ["No minimum balance", "Mobile check deposit", "24/7 customer support"],
  },
  {
    icon: Home,
    title: "Home Lending",
    description:
      "Competitive mortgage rates and personalized guidance to help you buy, refinance, or renovate your home.",
    features: ["Low down payment options", "First-time buyer programs", "Expert loan officers"],
  },
  {
    icon: TrendingUp,
    title: "Investment Services",
    description:
      "Build wealth with our comprehensive investment platform and professional financial advisory services.",
    features: ["Portfolio management", "Retirement planning", "Tax-advantaged accounts"],
  },
  {
    icon: PiggyBank,
    title: "Savings & CDs",
    description: "Grow your money with competitive rates on savings accounts, CDs, and money market accounts.",
    features: ["High-yield options", "Flexible terms", "FDIC insured up to $250,000"],
  },
  {
    icon: Shield,
    title: "Business Banking",
    description: "Comprehensive business solutions from checking accounts to commercial lending and cash management.",
    features: ["Business credit cards", "Merchant services", "Payroll solutions"],
  },
  {
    icon: Smartphone,
    title: "Digital Banking",
    description: "Bank anytime, anywhere with our award-winning mobile app and online banking platform.",
    features: ["Biometric login", "Real-time alerts", "Budget tracking tools"],
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Complete Banking Solutions
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            From personal banking to business solutions, we offer comprehensive financial services to help you achieve
            your goals at every stage of life.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-card-foreground">{service.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

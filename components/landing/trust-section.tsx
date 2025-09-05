import { Card, CardContent } from "@/components/ui/card"
import { Star, Award, Users, Shield } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content:
      "First City Credit Union has been instrumental in helping me grow my business. Their business banking solutions and expert guidance have made all the difference.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "First-Time Homebuyer",
    content:
      "The mortgage process was seamless with First City Credit Union. Their team guided me through every step and helped me secure a great rate for my first home.",
    rating: 5,
  },
  {
    name: "Lisa Rodriguez",
    role: "Retirement Planner",
    content:
      "Their investment advisors helped me create a comprehensive retirement strategy. I feel confident about my financial future with First City Credit Union.",
    rating: 5,
  },
]

const awards = [
  { title: "Best Digital Bank", organization: "Banking Excellence Awards 2024" },
  { title: "Top Customer Service", organization: "J.D. Power Banking Study" },
  { title: "Most Trusted Bank", organization: "American Banker Association" },
  { title: "Innovation Leader", organization: "Fintech Awards 2024" },
]

export function TrustSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Millions
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            See why customers choose First City Credit Union for their banking needs
          </p>
        </div>

        {/* Trust Statistics */}
        <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="text-center">
            <div className="flex justify-center">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-foreground">70M+</div>
              <div className="text-sm text-muted-foreground">Active Customers</div>
            </div>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-foreground">$1.9T</div>
              <div className="text-sm text-muted-foreground">Assets Under Management</div>
            </div>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <Award className="h-12 w-12 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-foreground">150+</div>
              <div className="text-sm text-muted-foreground">Years of Service</div>
            </div>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <Star className="h-12 w-12 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-foreground">4.8/5</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mt-24">
          <h3 className="text-center text-2xl font-bold text-foreground mb-12">What Our Customers Say</h3>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <blockquote className="text-card-foreground mb-4">"{testimonial.content}"</blockquote>
                  <div>
                    <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div className="mt-24">
          <h3 className="text-center text-2xl font-bold text-foreground mb-12">Industry Recognition</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((award, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-muted/50">
                <Award className="h-8 w-8 text-accent mx-auto mb-3" />
                <div className="font-semibold text-foreground">{award.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{award.organization}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

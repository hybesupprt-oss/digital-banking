"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Search, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const faqs = [
    {
      id: "1",
      category: "Account Management",
      question: "How do I change my account password?",
      answer:
        "You can change your password by going to Settings > Security > Change Password. You'll need to verify your identity with your current password and security questions.",
    },
    {
      id: "2",
      category: "Transfers",
      question: "What are the limits for online transfers?",
      answer:
        "Daily transfer limits are $5,000 for external transfers and $25,000 for internal transfers between your Wells Fargo accounts. Monthly limits may apply based on your account type.",
    },
    {
      id: "3",
      category: "Bill Pay",
      question: "How long does it take for bill payments to process?",
      answer:
        "Electronic payments typically process within 1-2 business days. Check payments may take 3-5 business days to reach the payee. We recommend scheduling payments at least 5 business days before the due date.",
    },
    {
      id: "4",
      category: "Mobile Banking",
      question: "Is mobile banking secure?",
      answer:
        "Yes, our mobile banking uses bank-level security including 256-bit encryption, multi-factor authentication, and fraud monitoring. We also offer biometric login options for added security.",
    },
    {
      id: "5",
      category: "Fees",
      question: "What fees are associated with my checking account?",
      answer:
        "Fees vary by account type. Most accounts have monthly maintenance fees that can be waived with minimum balance requirements or direct deposits. ATM fees may apply for out-of-network usage.",
    },
    {
      id: "6",
      category: "Cards",
      question: "How do I report a lost or stolen debit card?",
      answer:
        "Report lost or stolen cards immediately by calling 1-800-WELLS-FARGO or using the mobile app. We'll cancel your card and rush a replacement to you, typically within 1-2 business days.",
    },
  ]

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5" />
          <span>Frequently Asked Questions</span>
        </CardTitle>
        <CardDescription>Find quick answers to common banking questions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2">
          {filteredFAQs.map((faq) => (
            <Collapsible key={faq.id} open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{faq.category}</span>
                  </div>
                  <h3 className="font-medium">{faq.question}</h3>
                </div>
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", openItems.includes(faq.id) && "rotate-180")}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No FAQs found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText, Calendar } from "lucide-react"

interface Statement {
  id: string
  account_type: string
  account_number: string
  period: string
  date_generated: string
  status: string
  file_size: string
}

export function StatementsOverview() {
  const [statements, setStatements] = useState<Statement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching statements data
    setTimeout(() => {
      setStatements([
        {
          id: "1",
          account_type: "Checking",
          account_number: "****1234",
          period: "December 2024",
          date_generated: "2024-12-31",
          status: "available",
          file_size: "245 KB",
        },
        {
          id: "2",
          account_type: "Savings",
          account_number: "****5678",
          period: "December 2024",
          date_generated: "2024-12-31",
          status: "available",
          file_size: "198 KB",
        },
        {
          id: "3",
          account_type: "Checking",
          account_number: "****1234",
          period: "November 2024",
          date_generated: "2024-11-30",
          status: "available",
          file_size: "267 KB",
        },
        {
          id: "4",
          account_type: "Savings",
          account_number: "****5678",
          period: "November 2024",
          date_generated: "2024-11-30",
          status: "available",
          file_size: "201 KB",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Available Statements</span>
          </CardTitle>
          <CardDescription>
            Download or view your monthly account statements. Statements are available for up to 7 years.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statements.map((statement) => (
              <div
                key={statement.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{statement.account_type} Account Statement</h3>
                    <p className="text-sm text-muted-foreground">
                      {statement.account_number} • {statement.period}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Generated: {new Date(statement.date_generated).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">{statement.file_size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={statement.status === "available" ? "default" : "secondary"}>{statement.status}</Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Documents</CardTitle>
          <CardDescription>Access your tax-related documents and forms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">1099-INT Interest Statement 2024</h4>
                <p className="text-sm text-muted-foreground">Interest earned on savings accounts</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Annual Summary 2024</h4>
                <p className="text-sm text-muted-foreground">Complete account activity summary</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

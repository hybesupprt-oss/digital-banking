import { Suspense } from "react"
import { SecurityOverview } from "@/components/settings/security-overview"
import { AccountSettings } from "@/components/settings/account-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Security & Settings</h1>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
            <SecurityOverview />
          </Suspense>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

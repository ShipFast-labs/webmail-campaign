import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cursor01Icon,
  MailBlock01Icon,
  MailOpen01Icon,
  MailSend01Icon,
} from "@hugeicons/core-free-icons"
import { createFileRoute } from "@tanstack/react-router"
import { motion } from "motion/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const KPI = [
  {
    label: "Total Sent",
    value: "124,832",
    trend: "12.3% vs last month",
    trendUp: true,
    trendGood: true,
    icon: MailSend01Icon,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    label: "Open Rate",
    value: "24.6%",
    trend: "2.1% vs last month",
    trendUp: true,
    trendGood: true,
    icon: MailOpen01Icon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    label: "Click Rate",
    value: "3.8%",
    trend: "0.4% vs last month",
    trendUp: false,
    trendGood: false,
    icon: Cursor01Icon,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
  },
  {
    label: "Bounce Rate",
    value: "0.9%",
    trend: "0.2% vs last month",
    trendUp: false,
    trendGood: true,
    icon: MailBlock01Icon,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
] as const

const RECENT_CAMPAIGNS = [
  { name: "Summer Sale Newsletter", status: "COMPLETED", sent: "12,400", openRate: "28.4%" },
  { name: "Product Launch Announcement", status: "SENDING", sent: "8,250", openRate: "31.2%" },
  { name: "Weekly Digest", status: "COMPLETED", sent: "5,100", openRate: "22.8%" },
  { name: "Re-engagement Series", status: "SCHEDULED", sent: "0", openRate: "—" },
] as const

const STATUS_PILL: Record<string, string> = {
  COMPLETED: "bg-green-500/10 text-green-600 dark:text-green-400",
  SENDING: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  SCHEDULED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  DRAFT: "bg-muted text-muted-foreground",
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
})

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Last 30 days across your workspace.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI.map(({ label, value, trend, trendUp, trendGood, icon, iconColor, iconBg }, i) => (
          <motion.div
            key={label}
            {...fadeUp(0.08 + i * 0.07)}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Card className="h-full cursor-default">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
                    <p className={`text-xs mt-1.5 font-medium ${trendGood ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                      {trendUp ? "↑" : "↓"} {trend}
                    </p>
                  </div>
                  <motion.span
                    className={`shrink-0 rounded-lg p-2.5 ${iconBg} ${iconColor}`}
                    whileHover={{ scale: 1.12, rotate: 6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <HugeiconsIcon icon={icon} size={20} />
                  </motion.span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUp(0.4)}>
        <Card>
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="text-left font-medium px-5 py-3">Campaign</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-right font-medium px-4 py-3">Sent</th>
                  <th className="text-right font-medium px-5 py-3">Open rate</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_CAMPAIGNS.map(({ name, status, sent, openRate }, i) => (
                  <motion.tr
                    key={name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.06, ease: "easeOut" }}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground">{name}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_PILL[status]}`}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-muted-foreground tabular-nums">{sent}</td>
                    <td className="px-5 py-3.5 text-right text-muted-foreground tabular-nums">{openRate}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

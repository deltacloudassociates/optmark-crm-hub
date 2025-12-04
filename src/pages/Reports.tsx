import {
  BarChart3,
  TrendingUp,
  Users,
  PoundSterling,
  FileText,
  Download,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const reportCategories = [
  {
    title: "Financial Reports",
    icon: PoundSterling,
    reports: [
      { name: "Revenue Summary", description: "Monthly and YTD revenue breakdown" },
      { name: "Outstanding Invoices", description: "Unpaid invoices by client and age" },
      { name: "Payment Analysis", description: "Payment trends and collection rates" },
      { name: "Profitability Report", description: "Client and service profitability" },
    ],
  },
  {
    title: "Client Reports",
    icon: Users,
    reports: [
      { name: "Client Overview", description: "Complete client portfolio summary" },
      { name: "New Clients", description: "Recently onboarded clients" },
      { name: "Client Activity", description: "Engagement and service history" },
      { name: "Retention Report", description: "Client retention metrics" },
    ],
  },
  {
    title: "Productivity Reports",
    icon: TrendingUp,
    reports: [
      { name: "Team Utilization", description: "Billable hours by team member" },
      { name: "Task Completion", description: "Task metrics and turnaround times" },
      { name: "Workload Distribution", description: "Work allocation across team" },
      { name: "Deadline Compliance", description: "On-time delivery metrics" },
    ],
  },
  {
    title: "Compliance Reports",
    icon: FileText,
    reports: [
      { name: "Filing Deadlines", description: "Upcoming and past filing dates" },
      { name: "Submission Status", description: "HMRC submission tracking" },
      { name: "Audit Trail", description: "Document and change history" },
      { name: "Regulatory Compliance", description: "Compliance checklist status" },
    ],
  },
];

const quickStats = [
  { label: "Total Revenue (YTD)", value: "£245,600", change: "+18%" },
  { label: "Active Clients", value: "156", change: "+12" },
  { label: "Tasks Completed", value: "432", change: "+8%" },
  { label: "Avg Response Time", value: "2.4 days", change: "-0.5" },
];

export default function Reports() {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Generate insights and track performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <span className="text-sm text-success">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        {reportCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-primary" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.reports.map((report) => (
                <div
                  key={report.name}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

// Mock data
const recentTasks = [
  { id: 1, client: "James Wilson", service: "Self Assessment", deadline: "15 Jan 2024", status: "pending" as const, category: "A" as const },
  { id: 2, client: "Smith & Partners Ltd", service: "Corporation Tax", deadline: "31 Jan 2024", status: "active" as const, category: "B" as const },
  { id: 3, client: "Sarah Johnson", service: "Tax Planning", deadline: "10 Jan 2024", status: "overdue" as const, category: "A" as const },
  { id: 4, client: "Tech Solutions Ltd", service: "VAT Returns", deadline: "7 Feb 2024", status: "pending" as const, category: "C" as const },
  { id: 5, client: "Michael Brown", service: "Bookkeeping", deadline: "28 Jan 2024", status: "active" as const, category: "D" as const },
];

const workloadDistribution = [
  { category: "Q1", clients: 45, percentage: 28, color: "bg-category-q1" },
  { category: "Q2", clients: 38, percentage: 24, color: "bg-category-q2" },
  { category: "Q3", clients: 42, percentage: 26, color: "bg-category-q3" },
  { category: "Q4", clients: 35, percentage: 22, color: "bg-category-q4" },
];

const upcomingDeadlines = [
  { date: "Jan 31", title: "Self Assessment Deadline", count: 24 },
  { date: "Feb 7", title: "VAT Quarter End", count: 12 },
  { date: "Mar 31", title: "Corporation Tax", count: 8 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Good morning, John</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your practice today.</p>
        </div>
        <Button asChild className="hover-lift">
          <Link to="/clients/new">
            <Users className="mr-2 h-4 w-4" />
            Add New Client
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Clients", value: "160", icon: Users, trend: { value: 12, isPositive: true }, variant: "primary" as const },
          { title: "Active Tasks", value: "48", icon: CheckSquare, trend: { value: 8, isPositive: false }, variant: "info" as const },
          { title: "Pending Reviews", value: "12", icon: Clock, variant: "warning" as const },
          { title: "Revenue (MTD)", value: "£24,580", icon: TrendingUp, trend: { value: 15, isPositive: true }, variant: "success" as const },
        ].map((stat, index) => (
          <div 
            key={stat.title}
            className={`animate-slide-up opacity-0 stagger-${index + 1}`}
            style={{ animationFillMode: 'forwards' }}
          >
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2 hover-glow animate-slide-up opacity-0 stagger-5" style={{ animationFillMode: 'forwards' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Tasks</CardTitle>
            <Button variant="ghost" size="sm" asChild className="group">
              <Link to="/tasks">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between rounded-lg border border-border p-4 transition-all duration-200 hover:bg-secondary/50 hover:border-primary/20 hover:-translate-x-1 cursor-pointer animate-fade-in opacity-0`}
                  style={{ animationDelay: `${0.4 + index * 0.05}s`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <CheckSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{task.client}</p>
                      <p className="text-sm text-muted-foreground">{task.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <CategoryBadge category={task.category} />
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{task.deadline}</p>
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Workload Distribution */}
          <Card className="hover-glow animate-slide-up opacity-0 stagger-5" style={{ animationFillMode: 'forwards' }}>
            <CardHeader>
              <CardTitle className="text-lg">Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workloadDistribution.map((item, index) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground">{item.clients} clients</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className={`h-full ${item.color} progress-animate rounded-full`}
                      style={{ 
                        width: `${item.percentage}%`,
                        animationDelay: `${0.5 + index * 0.1}s`
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="hover-glow animate-slide-up opacity-0 stagger-6" style={{ animationFillMode: 'forwards' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              <AlertTriangle className="h-5 w-5 text-warning animate-pulse-subtle" />
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 transition-all duration-200 hover:bg-secondary hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-sm">
                      {deadline.date.split(" ")[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground">{deadline.date}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
                    {deadline.count}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

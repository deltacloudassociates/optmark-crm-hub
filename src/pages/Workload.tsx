import { useState } from "react";
import {
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const teamMembers = [
  {
    id: "1",
    name: "John Smith",
    role: "Senior Accountant",
    totalTasks: 24,
    completedTasks: 18,
    inProgressTasks: 4,
    pendingTasks: 2,
    capacity: 85,
    billableHours: 32,
    targetHours: 40,
  },
  {
    id: "2",
    name: "Sarah Jones",
    role: "Accountant",
    totalTasks: 18,
    completedTasks: 12,
    inProgressTasks: 5,
    pendingTasks: 1,
    capacity: 72,
    billableHours: 28,
    targetHours: 40,
  },
  {
    id: "3",
    name: "Mike Brown",
    role: "Junior Accountant",
    totalTasks: 12,
    completedTasks: 8,
    inProgressTasks: 3,
    pendingTasks: 1,
    capacity: 55,
    billableHours: 22,
    targetHours: 40,
  },
  {
    id: "4",
    name: "Emma Wilson",
    role: "Tax Specialist",
    totalTasks: 20,
    completedTasks: 14,
    inProgressTasks: 4,
    pendingTasks: 2,
    capacity: 90,
    billableHours: 36,
    targetHours: 40,
  },
];

const overallStats = [
  { label: "Total Team Members", value: 4, icon: User },
  { label: "Active Projects", value: 48, icon: TrendingUp },
  { label: "Hours This Week", value: 118, icon: Clock },
  { label: "Tasks Completed", value: 52, icon: CheckCircle },
];

export default function Workload() {
  const [period, setPeriod] = useState("week");

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return "text-destructive";
    if (capacity >= 70) return "text-warning";
    return "text-success";
  };

  const getCapacityStatus = (capacity: number) => {
    if (capacity >= 90) return "Overloaded";
    if (capacity >= 70) return "High Load";
    return "Available";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {overallStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Period Filter */}
      <div className="flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Workload */}
      <div className="grid gap-4 lg:grid-cols-2">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getCapacityColor(member.capacity)
                    )}
                  >
                    {getCapacityStatus(member.capacity)}
                  </span>
                  {member.capacity >= 90 && (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Capacity Bar */}
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{member.capacity}%</span>
                </div>
                <Progress
                  value={member.capacity}
                  className={cn(
                    "h-2",
                    member.capacity >= 90
                      ? "[&>div]:bg-destructive"
                      : member.capacity >= 70
                      ? "[&>div]:bg-warning"
                      : "[&>div]:bg-success"
                  )}
                />
              </div>

              {/* Task Breakdown */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-success/10 p-2">
                  <p className="text-lg font-semibold text-success">
                    {member.completedTasks}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="rounded-lg bg-info/10 p-2">
                  <p className="text-lg font-semibold text-info">
                    {member.inProgressTasks}
                  </p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <div className="rounded-lg bg-warning/10 p-2">
                  <p className="text-lg font-semibold text-warning">
                    {member.pendingTasks}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>

              {/* Billable Hours */}
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-muted-foreground">
                  Billable Hours
                </span>
                <span className="text-sm font-medium">
                  {member.billableHours} / {member.targetHours} hrs
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

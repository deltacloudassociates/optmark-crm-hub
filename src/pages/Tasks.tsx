import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock data
const tasks = [
  {
    id: "1",
    client: "James Wilson",
    clientType: "individual" as const,
    service: "Self Assessment",
    deadline: "2024-01-31",
    status: "pending" as const,
    category: "A" as const,
    priority: "high",
    assignee: "John Smith",
    daysRemaining: 5,
  },
  {
    id: "2",
    client: "Smith & Partners Ltd",
    clientType: "business" as const,
    service: "Corporation Tax",
    deadline: "2024-01-31",
    status: "active" as const,
    category: "B" as const,
    priority: "high",
    assignee: "Sarah Jones",
    daysRemaining: 5,
  },
  {
    id: "3",
    client: "Sarah Johnson",
    clientType: "individual" as const,
    service: "Tax Planning",
    deadline: "2024-01-10",
    status: "overdue" as const,
    category: "A" as const,
    priority: "urgent",
    assignee: "John Smith",
    daysRemaining: -16,
  },
  {
    id: "4",
    client: "Tech Solutions Ltd",
    clientType: "business" as const,
    service: "VAT Returns",
    deadline: "2024-02-07",
    status: "pending" as const,
    category: "C" as const,
    priority: "medium",
    assignee: "Mike Brown",
    daysRemaining: 12,
  },
  {
    id: "5",
    client: "Michael Brown",
    clientType: "individual" as const,
    service: "Bookkeeping",
    deadline: "2024-01-28",
    status: "active" as const,
    category: "D" as const,
    priority: "low",
    assignee: "Sarah Jones",
    daysRemaining: 2,
  },
  {
    id: "6",
    client: "Creative Design Agency",
    clientType: "business" as const,
    service: "Annual Accounts",
    deadline: "2024-03-31",
    status: "pending" as const,
    category: "A" as const,
    priority: "medium",
    assignee: "John Smith",
    daysRemaining: 64,
  },
];

const taskStats = [
  { label: "Total Tasks", value: 48, icon: CheckCircle, color: "text-primary" },
  { label: "In Progress", value: 12, icon: Clock, color: "text-info" },
  { label: "Pending Review", value: 8, icon: AlertTriangle, color: "text-warning" },
  { label: "Overdue", value: 3, icon: AlertTriangle, color: "text-destructive" },
];

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDeadline = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {taskStats.map((stat, index) => (
          <Card 
            key={stat.label} 
            className={`hover-lift animate-slide-up opacity-0 stagger-${index + 1}`}
            style={{ animationFillMode: 'forwards' }}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className={cn("rounded-lg bg-secondary p-2 transition-transform duration-200 group-hover:scale-110", stat.color)}>
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

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => (
          <Card
            key={task.id}
            className={cn(
              "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer animate-slide-up opacity-0",
              task.status === "overdue" && "border-destructive/50"
            )}
            style={{ animationDelay: `${0.3 + index * 0.05}s`, animationFillMode: 'forwards' }}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    task.clientType === "individual"
                      ? "bg-primary/10 text-primary"
                      : "bg-info/10 text-info"
                  )}
                >
                  {task.clientType === "individual" ? (
                    <User className="h-6 w-6" />
                  ) : (
                    <Building2 className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{task.client}</p>
                    <CategoryBadge category={task.category} />
                  </div>
                  <p className="text-sm text-muted-foreground">{task.service}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formatDeadline(task.deadline)}</span>
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      task.daysRemaining < 0
                        ? "text-destructive font-medium"
                        : task.daysRemaining <= 7
                        ? "text-warning"
                        : "text-muted-foreground"
                    )}
                  >
                    {task.daysRemaining < 0
                      ? `${Math.abs(task.daysRemaining)} days overdue`
                      : task.daysRemaining === 0
                      ? "Due today"
                      : `${task.daysRemaining} days remaining`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <StatusBadge status={task.status} />
                    <p className="mt-1 text-xs text-muted-foreground">{task.assignee}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Task</DropdownMenuItem>
                      <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                      <DropdownMenuItem>Reassign</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

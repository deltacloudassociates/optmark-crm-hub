import { useState } from "react";
import {
  Search,
  Plus,
  Clock,
  Play,
  Pause,
  Calendar,
  User,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const timeEntries = [
  {
    id: "1",
    client: "James Wilson",
    task: "Self Assessment Preparation",
    date: "2024-01-26",
    duration: "2h 30m",
    billable: true,
    rate: 150,
    status: "completed",
  },
  {
    id: "2",
    client: "Smith & Partners Ltd",
    task: "Corporation Tax Review",
    date: "2024-01-26",
    duration: "1h 45m",
    billable: true,
    rate: 175,
    status: "completed",
  },
  {
    id: "3",
    client: "Tech Solutions Ltd",
    task: "VAT Return Filing",
    date: "2024-01-25",
    duration: "1h 15m",
    billable: true,
    rate: 150,
    status: "completed",
  },
  {
    id: "4",
    client: "Sarah Johnson",
    task: "Tax Planning Meeting",
    date: "2024-01-25",
    duration: "45m",
    billable: true,
    rate: 200,
    status: "completed",
  },
  {
    id: "5",
    client: "Internal",
    task: "Team Training",
    date: "2024-01-24",
    duration: "2h 00m",
    billable: false,
    rate: 0,
    status: "completed",
  },
];

const timeStats = [
  { label: "Hours Today", value: "4h 15m", subtext: "£637.50 billable" },
  { label: "Hours This Week", value: "32h 45m", subtext: "£4,912.50 billable" },
  { label: "Hours This Month", value: "128h", subtext: "£19,200 billable" },
  { label: "Utilization", value: "82%", subtext: "Target: 75%" },
];

export default function TimeTracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [activeTimer, setActiveTimer] = useState("00:00:00");

  const filteredEntries = timeEntries.filter(
    (entry) =>
      entry.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Active Timer */}
      <Card className="border-primary">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Timer</p>
              <p className="text-3xl font-bold font-mono">{activeTimer}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="james">James Wilson</SelectItem>
                <SelectItem value="smith">Smith & Partners Ltd</SelectItem>
                <SelectItem value="tech">Tech Solutions Ltd</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="What are you working on?" className="w-64" />
            <Button
              size="lg"
              onClick={() => setIsTracking(!isTracking)}
              className={cn(
                isTracking && "bg-destructive hover:bg-destructive/90"
              )}
            >
              {isTracking ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {timeStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-72 pl-9"
          />
        </div>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Manual Entry
        </Button>
      </div>

      {/* Time Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{entry.task}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.client}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(entry.date)}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.duration}</p>
                    {entry.billable ? (
                      <p className="text-sm text-success">
                        £{entry.rate}/hr
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Non-billable
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Entry</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

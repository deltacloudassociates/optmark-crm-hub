import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  CreditCard,
  CheckCircle,
  Clock,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const payments = [
  {
    id: "PAY-001",
    invoiceId: "INV-2024-002",
    client: "Smith & Partners Ltd",
    amount: 2500,
    date: "2024-01-26",
    method: "Bank Transfer",
    status: "completed",
  },
  {
    id: "PAY-002",
    invoiceId: "INV-2024-001",
    client: "James Wilson",
    amount: 450,
    date: "2024-01-25",
    method: "Card Payment",
    status: "completed",
  },
  {
    id: "PAY-003",
    invoiceId: "INV-2023-089",
    client: "Tech Solutions Ltd",
    amount: 1200,
    date: "2024-01-24",
    method: "Bank Transfer",
    status: "completed",
  },
  {
    id: "PAY-004",
    invoiceId: "INV-2024-005",
    client: "Creative Design Agency",
    amount: 900,
    date: "2024-01-23",
    method: "Card Payment",
    status: "pending",
  },
  {
    id: "PAY-005",
    invoiceId: "INV-2023-087",
    client: "Michael Brown",
    amount: 350,
    date: "2024-01-22",
    method: "Bank Transfer",
    status: "completed",
  },
];

const paymentStats = [
  { label: "Received This Month", value: "£24,500", trend: "+12%", up: true },
  { label: "Received This Week", value: "£5,400", trend: "+8%", up: true },
  { label: "Pending Payments", value: "£900", trend: "-15%", up: false },
  { label: "Average Days to Pay", value: "18 days", trend: "-2 days", up: false },
];

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Completed</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Pending</Badge>;
      case "failed":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {paymentStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <span
                  className={cn(
                    "flex items-center text-sm",
                    stat.up ? "text-success" : "text-destructive"
                  )}
                >
                  {stat.up ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.trend}
                </span>
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
              placeholder="Search payments..."
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{payment.client}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.invoiceId} • {payment.method}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-success">
                      +£{payment.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(payment.date)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>View Invoice</DropdownMenuItem>
                      <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
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

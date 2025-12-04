import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Send,
  Download,
  MoreHorizontal,
  Eye,
  PoundSterling,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const invoices = [
  {
    id: "INV-2024-001",
    client: "James Wilson",
    description: "Self Assessment 2023/24",
    amount: 450,
    date: "2024-01-26",
    dueDate: "2024-02-26",
    status: "sent",
  },
  {
    id: "INV-2024-002",
    client: "Smith & Partners Ltd",
    description: "Corporation Tax Return & Advisory",
    amount: 2500,
    date: "2024-01-25",
    dueDate: "2024-02-25",
    status: "paid",
  },
  {
    id: "INV-2024-003",
    client: "Tech Solutions Ltd",
    description: "VAT Returns Q3 & Q4",
    amount: 800,
    date: "2024-01-20",
    dueDate: "2024-02-20",
    status: "overdue",
  },
  {
    id: "INV-2024-004",
    client: "Sarah Johnson",
    description: "Tax Planning Consultation",
    amount: 350,
    date: "2024-01-18",
    dueDate: "2024-02-18",
    status: "draft",
  },
  {
    id: "INV-2024-005",
    client: "Creative Design Agency",
    description: "Annual Accounts Preparation",
    amount: 1800,
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "sent",
  },
];

const invoiceStats = [
  { label: "Total Outstanding", value: "£12,450", icon: PoundSterling, color: "text-primary" },
  { label: "Paid This Month", value: "£8,200", icon: CheckCircle, color: "text-success" },
  { label: "Pending", value: "£4,250", icon: Clock, color: "text-warning" },
  { label: "Overdue", value: "£800", icon: AlertTriangle, color: "text-destructive" },
];

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
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
      case "paid":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Paid</Badge>;
      case "sent":
        return <Badge className="bg-info/10 text-info hover:bg-info/20">Sent</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "overdue":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Overdue</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {invoiceStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={cn("rounded-lg bg-secondary p-2", stat.color)}>
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
              placeholder="Search invoices..."
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Invoices List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{invoice.id}</p>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {invoice.client} • {invoice.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      £{invoice.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due: {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Invoice</DropdownMenuItem>
                        <DropdownMenuItem>Record Payment</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

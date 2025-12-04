import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  User,
  Building2,
  MoreHorizontal,
  Paperclip,
  Reply,
  Forward,
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

const communications = [
  {
    id: "1",
    client: "James Wilson",
    clientType: "individual" as const,
    type: "email" as const,
    subject: "Self Assessment Submission Confirmation",
    preview: "Your self assessment for tax year 2023/24 has been successfully submitted...",
    date: "2024-01-26T10:30:00",
    status: "sent",
    hasAttachment: true,
  },
  {
    id: "2",
    client: "Smith & Partners Ltd",
    clientType: "business" as const,
    type: "email" as const,
    subject: "Corporation Tax Return - Documents Required",
    preview: "Please provide the following documents for your corporation tax return...",
    date: "2024-01-25T14:15:00",
    status: "pending",
    hasAttachment: false,
  },
  {
    id: "3",
    client: "Sarah Johnson",
    clientType: "individual" as const,
    type: "phone" as const,
    subject: "Tax Planning Discussion",
    preview: "Discussed pension contributions and ISA allowances for the current tax year...",
    date: "2024-01-25T11:00:00",
    status: "logged",
    hasAttachment: false,
  },
  {
    id: "4",
    client: "Tech Solutions Ltd",
    clientType: "business" as const,
    type: "email" as const,
    subject: "VAT Return Reminder",
    preview: "This is a reminder that your Q4 VAT return is due on...",
    date: "2024-01-24T09:00:00",
    status: "sent",
    hasAttachment: true,
  },
  {
    id: "5",
    client: "Michael Brown",
    clientType: "individual" as const,
    type: "message" as const,
    subject: "Bookkeeping Query",
    preview: "Quick question about expense categorisation for my freelance work...",
    date: "2024-01-24T16:45:00",
    status: "received",
    hasAttachment: false,
  },
];

const commStats = [
  { label: "Total Messages", value: 156, icon: Mail },
  { label: "Pending Replies", value: 8, icon: Clock },
  { label: "Phone Calls", value: 24, icon: Phone },
  { label: "Client Queries", value: 12, icon: MessageSquare },
];

export default function Communications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredComms = communications.filter((comm) => {
    const matchesSearch =
      comm.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || comm.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return d.toLocaleDateString("en-GB", { weekday: "short" });
    }
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return Mail;
      case "phone":
        return Phone;
      case "message":
        return MessageSquare;
      default:
        return Mail;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="secondary">Sent</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Pending</Badge>;
      case "received":
        return <Badge className="bg-info/10 text-info hover:bg-info/20">Received</Badge>;
      case "logged":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Logged</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {commStats.map((stat) => (
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

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search communications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="message">Message</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Communications List */}
      <div className="space-y-3">
        {filteredComms.map((comm) => {
          const TypeIcon = getTypeIcon(comm.type);
          return (
            <Card
              key={comm.id}
              className="cursor-pointer transition-shadow hover:shadow-card-hover"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      comm.clientType === "individual"
                        ? "bg-primary/10 text-primary"
                        : "bg-info/10 text-info"
                    )}
                  >
                    {comm.clientType === "individual" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{comm.client}</p>
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      {comm.hasAttachment && (
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="font-medium text-sm">{comm.subject}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {comm.preview}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(comm.date)}
                    </span>
                    {getStatusBadge(comm.status)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Reply className="mr-2 h-4 w-4" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="mr-2 h-4 w-4" />
                        Forward
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Full</DropdownMenuItem>
                      <DropdownMenuItem>Link to Client</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

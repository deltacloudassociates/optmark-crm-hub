import { useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Mail,
  Receipt,
  FileCheck,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
  Eye,
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

const templates = [
  {
    id: "1",
    name: "Engagement Letter - Individual",
    category: "Letters",
    type: "document",
    lastModified: "2024-01-20",
    usageCount: 45,
  },
  {
    id: "2",
    name: "Engagement Letter - Business",
    category: "Letters",
    type: "document",
    lastModified: "2024-01-18",
    usageCount: 32,
  },
  {
    id: "3",
    name: "Self Assessment Reminder",
    category: "Emails",
    type: "email",
    lastModified: "2024-01-15",
    usageCount: 128,
  },
  {
    id: "4",
    name: "VAT Return Reminder",
    category: "Emails",
    type: "email",
    lastModified: "2024-01-10",
    usageCount: 86,
  },
  {
    id: "5",
    name: "Standard Invoice",
    category: "Invoices",
    type: "invoice",
    lastModified: "2024-01-08",
    usageCount: 256,
  },
  {
    id: "6",
    name: "Corporation Tax Invoice",
    category: "Invoices",
    type: "invoice",
    lastModified: "2024-01-05",
    usageCount: 64,
  },
  {
    id: "7",
    name: "New Client Checklist",
    category: "Checklists",
    type: "checklist",
    lastModified: "2024-01-03",
    usageCount: 48,
  },
  {
    id: "8",
    name: "Year End Checklist",
    category: "Checklists",
    type: "checklist",
    lastModified: "2024-01-01",
    usageCount: 24,
  },
];

const templateStats = [
  { label: "Total Templates", value: 24, icon: FileText },
  { label: "Email Templates", value: 8, icon: Mail },
  { label: "Invoice Templates", value: 6, icon: Receipt },
  { label: "Checklists", value: 10, icon: FileCheck },
];

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "email":
        return Mail;
      case "invoice":
        return Receipt;
      case "checklist":
        return FileCheck;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-primary/10 text-primary";
      case "email":
        return "bg-info/10 text-info";
      case "invoice":
        return "bg-success/10 text-success";
      case "checklist":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {templateStats.map((stat, index) => (
          <Card 
            key={stat.label} 
            className={`hover-lift animate-slide-up opacity-0 stagger-${index + 1}`}
            style={{ animationFillMode: 'forwards' }}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-primary/10 p-2 text-primary transition-transform duration-200 group-hover:scale-110">
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
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Letters">Letters</SelectItem>
              <SelectItem value="Emails">Emails</SelectItem>
              <SelectItem value="Invoices">Invoices</SelectItem>
              <SelectItem value="Checklists">Checklists</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template, index) => {
          const TypeIcon = getTypeIcon(template.type);
          return (
            <Card
              key={template.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group animate-slide-up opacity-0"
              style={{ animationDelay: `${0.2 + index * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110",
                      getTypeColor(template.type)
                    )}
                  >
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-3">
                  <p className="font-medium">{template.name}</p>
                  <Badge variant="secondary" className="mt-2">
                    {template.category}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Used {template.usageCount} times</span>
                  <span>{formatDate(template.lastModified)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

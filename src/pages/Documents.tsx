import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  FileText,
  Folder,
  Download,
  MoreHorizontal,
  Eye,
  Trash2,
  Share2,
  Upload,
  Grid,
  List,
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

const documents = [
  {
    id: "1",
    name: "Self Assessment 2023-24.pdf",
    type: "pdf",
    client: "James Wilson",
    category: "Tax Returns",
    size: "2.4 MB",
    modified: "2024-01-26",
  },
  {
    id: "2",
    name: "Corporation Tax Return.xlsx",
    type: "xlsx",
    client: "Smith & Partners Ltd",
    category: "Tax Returns",
    size: "1.8 MB",
    modified: "2024-01-25",
  },
  {
    id: "3",
    name: "VAT Q4 2023.pdf",
    type: "pdf",
    client: "Tech Solutions Ltd",
    category: "VAT",
    size: "856 KB",
    modified: "2024-01-24",
  },
  {
    id: "4",
    name: "Annual Accounts 2023.pdf",
    type: "pdf",
    client: "Creative Design Agency",
    category: "Accounts",
    size: "3.2 MB",
    modified: "2024-01-23",
  },
  {
    id: "5",
    name: "Engagement Letter.docx",
    type: "docx",
    client: "Michael Brown",
    category: "Contracts",
    size: "245 KB",
    modified: "2024-01-22",
  },
  {
    id: "6",
    name: "Tax Planning Report.pdf",
    type: "pdf",
    client: "Sarah Johnson",
    category: "Reports",
    size: "1.1 MB",
    modified: "2024-01-21",
  },
];

const folders = [
  { id: "1", name: "Tax Returns", count: 24, color: "bg-primary" },
  { id: "2", name: "VAT Returns", count: 18, color: "bg-info" },
  { id: "3", name: "Annual Accounts", count: 12, color: "bg-success" },
  { id: "4", name: "Contracts", count: 8, color: "bg-warning" },
];

const docStats = [
  { label: "Total Documents", value: 342, icon: FileText },
  { label: "Folders", value: 12, icon: Folder },
  { label: "Uploaded This Month", value: 28, icon: Upload },
  { label: "Shared", value: 45, icon: Share2 },
];

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getFileIcon = (type: string) => {
    const colors: Record<string, string> = {
      pdf: "bg-destructive/10 text-destructive",
      xlsx: "bg-success/10 text-success",
      docx: "bg-info/10 text-info",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {docStats.map((stat) => (
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

      {/* Quick Access Folders */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {folders.map((folder) => (
            <Card
              key={folder.id}
              className="cursor-pointer transition-shadow hover:shadow-card-hover"
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn("rounded-lg p-2", folder.color)}>
                  <Folder className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{folder.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {folder.count} files
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Tax Returns">Tax Returns</SelectItem>
              <SelectItem value="VAT">VAT</SelectItem>
              <SelectItem value="Accounts">Accounts</SelectItem>
              <SelectItem value="Contracts">Contracts</SelectItem>
              <SelectItem value="Reports">Reports</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Documents List */}
      {viewMode === "list" ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        getFileIcon(doc.type)
                      )}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.client} • {doc.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-muted-foreground">
                      {doc.size}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(doc.modified)}
                    </span>
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
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
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
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              className="cursor-pointer transition-shadow hover:shadow-card-hover"
            >
              <CardContent className="p-4">
                <div
                  className={cn(
                    "mb-3 flex h-12 w-12 items-center justify-center rounded-lg",
                    getFileIcon(doc.type)
                  )}
                >
                  <FileText className="h-6 w-6" />
                </div>
                <p className="font-medium truncate">{doc.name}</p>
                <p className="text-sm text-muted-foreground">{doc.client}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{doc.size}</span>
                  <span>{formatDate(doc.modified)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

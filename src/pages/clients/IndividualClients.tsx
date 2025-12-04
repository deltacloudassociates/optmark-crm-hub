import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data
const clients = [
  {
    id: "1",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@email.com",
    phone: "07700 900123",
    postcode: "SW1A 1AA",
    status: "active" as const,
    category: "A" as const,
    services: ["Self Assessment", "Tax Planning"],
    lastContact: "2 days ago",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "07700 900456",
    postcode: "EC1A 1BB",
    status: "active" as const,
    category: "B" as const,
    services: ["Self Assessment"],
    lastContact: "1 week ago",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Brown",
    email: "m.brown@email.com",
    phone: "07700 900789",
    postcode: "W1A 1AB",
    status: "pending" as const,
    category: "A" as const,
    services: ["Bookkeeping", "Self Assessment"],
    lastContact: "3 days ago",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@email.com",
    phone: "07700 900321",
    postcode: "N1 9GU",
    status: "inactive" as const,
    category: "C" as const,
    services: ["Tax Planning"],
    lastContact: "1 month ago",
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "Taylor",
    email: "r.taylor@email.com",
    phone: "07700 900654",
    postcode: "SE1 7PB",
    status: "active" as const,
    category: "D" as const,
    services: ["CIS Returns", "Self Assessment"],
    lastContact: "5 days ago",
  },
  {
    id: "6",
    firstName: "Jennifer",
    lastName: "Anderson",
    email: "j.anderson@email.com",
    phone: "07700 900987",
    postcode: "E14 5AB",
    status: "active" as const,
    category: "B" as const,
    services: ["Self Assessment", "Tax Planning"],
    lastContact: "1 day ago",
  },
];

export default function IndividualClients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredClients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClients.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="left">Left</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link to="/clients/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Link>
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredClients.length}</span> of{" "}
          <span className="font-medium text-foreground">{clients.length}</span> clients
        </p>
        {selectedIds.length > 0 && (
          <p className="text-sm text-primary font-medium">
            {selectedIds.length} selected
          </p>
        )}
      </div>

      {/* Clients Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === filteredClients.length && filteredClients.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Postcode</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client, index) => (
              <TableRow
                key={client.id}
                className="cursor-pointer transition-all duration-200 hover:bg-primary/5 group animate-fade-in opacity-0"
                style={{ animationDelay: `${0.15 + index * 0.03}s`, animationFillMode: 'forwards' }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(client.id)}
                    onCheckedChange={() => toggleSelect(client.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium transition-transform duration-200 group-hover:scale-110">
                      {client.firstName[0]}{client.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium">{client.firstName} {client.lastName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{client.postcode}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {client.services.slice(0, 2).map((service) => (
                      <span
                        key={service}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs"
                      >
                        {service}
                      </span>
                    ))}
                    {client.services.length > 2 && (
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs">
                        +{client.services.length - 2}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <CategoryBadge category={client.category} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={client.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {client.lastContact}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

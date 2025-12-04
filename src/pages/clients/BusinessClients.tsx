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
  Building2,
  ExternalLink,
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
const businesses = [
  {
    id: "1",
    companyName: "Smith & Partners Ltd",
    companyNumber: "12345678",
    responsiblePerson: "John Smith",
    email: "john@smithpartners.co.uk",
    phone: "020 7946 0958",
    postcode: "EC2A 4NE",
    status: "active" as const,
    category: "A" as const,
    services: ["Corporation Tax", "Annual Accounts", "VAT Returns"],
    vatRegistered: true,
    nextDeadline: "31 Jan 2024",
  },
  {
    id: "2",
    companyName: "Tech Solutions Ltd",
    companyNumber: "87654321",
    responsiblePerson: "Emma Wilson",
    email: "emma@techsolutions.com",
    phone: "020 7946 1234",
    postcode: "W1D 3QF",
    status: "active" as const,
    category: "B" as const,
    services: ["Corporation Tax", "Payroll Services"],
    vatRegistered: true,
    nextDeadline: "28 Feb 2024",
  },
  {
    id: "3",
    companyName: "Green Gardens Landscaping",
    companyNumber: "11223344",
    responsiblePerson: "Michael Green",
    email: "m.green@greengardens.co.uk",
    phone: "020 7946 5678",
    postcode: "N1 9GU",
    status: "pending" as const,
    category: "C" as const,
    services: ["Bookkeeping", "VAT Returns"],
    vatRegistered: false,
    nextDeadline: "15 Mar 2024",
  },
  {
    id: "4",
    companyName: "Creative Design Agency",
    companyNumber: "55667788",
    responsiblePerson: "Sophie Taylor",
    email: "sophie@creativedesign.co.uk",
    phone: "020 7946 9012",
    postcode: "SE1 7PB",
    status: "active" as const,
    category: "A" as const,
    services: ["Corporation Tax", "Annual Accounts", "Payroll Services"],
    vatRegistered: true,
    nextDeadline: "31 Mar 2024",
  },
  {
    id: "5",
    companyName: "Roberts Construction Ltd",
    companyNumber: "99887766",
    responsiblePerson: "David Roberts",
    email: "david@robertsconstruction.co.uk",
    phone: "020 7946 3456",
    postcode: "E14 5AB",
    status: "inactive" as const,
    category: "D" as const,
    services: ["Corporation Tax"],
    vatRegistered: true,
    nextDeadline: "30 Apr 2024",
  },
];

export default function BusinessClients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.companyNumber.includes(searchQuery) ||
      business.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || business.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBusinesses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBusinesses.map((b) => b.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or company number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-9"
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
            <Link to="/clients/new?type=business">
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredBusinesses.length}</span> of{" "}
          <span className="font-medium text-foreground">{businesses.length}</span> businesses
        </p>
        {selectedIds.length > 0 && (
          <p className="text-sm text-primary font-medium">
            {selectedIds.length} selected
          </p>
        )}
      </div>

      {/* Business Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === filteredBusinesses.length && filteredBusinesses.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>VAT</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Deadline</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.map((business) => (
              <TableRow
                key={business.id}
                className="cursor-pointer transition-colors hover:bg-secondary/30"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(business.id)}
                    onCheckedChange={() => toggleSelect(business.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{business.companyName}</p>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground font-mono">
                        {business.companyNumber}
                        <a
                          href={`https://find-and-update.company-information.service.gov.uk/company/${business.companyNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{business.responsiblePerson}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {business.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {business.services.slice(0, 2).map((service) => (
                      <span
                        key={service}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs"
                      >
                        {service}
                      </span>
                    ))}
                    {business.services.length > 2 && (
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs">
                        +{business.services.length - 2}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {business.vatRegistered ? (
                    <span className="text-success font-medium text-sm">Registered</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">No</span>
                  )}
                </TableCell>
                <TableCell>
                  <CategoryBadge category={business.category} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={business.status} />
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {business.nextDeadline}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/clients/client-3`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Business
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Business
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

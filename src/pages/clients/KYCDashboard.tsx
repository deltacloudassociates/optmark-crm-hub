import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Mail,
  Phone,
  FileText,
  User,
  Building2,
  Calendar,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClientDocument {
  id: string;
  clientId: string;
  clientName: string;
  clientType: "individual" | "business";
  email: string;
  phone: string;
  documentType: "id";
  documentName: string;
  expiryDate: string;
  status: "expired" | "expiring-soon" | "expiring" | "valid";
  daysRemaining: number;
  lastReminderSent: string | null;
}

// Mock data - ID documents only (no PoA expiry tracking)
const mockDocuments: ClientDocument[] = [
  {
    id: "1",
    clientId: "client-1",
    clientName: "Sarah Johnson",
    clientType: "individual",
    email: "sarah.johnson@email.com",
    phone: "07700 900123",
    documentType: "id",
    documentName: "UK Passport",
    expiryDate: "2024-11-15",
    status: "expired",
    daysRemaining: -19,
    lastReminderSent: "2024-11-01",
  },
  {
    id: "2",
    clientId: "client-2",
    clientName: "Michael Chen",
    clientType: "individual",
    email: "m.chen@email.com",
    phone: "07700 900456",
    documentType: "id",
    documentName: "UK Driving Licence",
    expiryDate: "2024-12-20",
    status: "expiring-soon",
    daysRemaining: 16,
    lastReminderSent: null,
  },
  {
    id: "3",
    clientId: "client-3",
    clientName: "Tech Solutions Ltd",
    clientType: "business",
    email: "accounts@techsolutions.co.uk",
    phone: "020 7946 0958",
    documentType: "id",
    documentName: "Director Passport (James Wilson)",
    expiryDate: "2025-01-15",
    status: "expiring-soon",
    daysRemaining: 42,
    lastReminderSent: "2024-11-20",
  },
  {
    id: "4",
    clientId: "client-4",
    clientName: "Green Energy Corp",
    clientType: "business",
    email: "info@greenenergy.co.uk",
    phone: "0161 496 0123",
    documentType: "id",
    documentName: "Director Passport (Lisa Brown)",
    expiryDate: "2025-02-28",
    status: "expiring",
    daysRemaining: 86,
    lastReminderSent: null,
  },
  {
    id: "5",
    clientId: "client-5",
    clientName: "David Thompson",
    clientType: "individual",
    email: "d.thompson@email.com",
    phone: "07700 900321",
    documentType: "id",
    documentName: "EU National ID",
    expiryDate: "2025-03-15",
    status: "valid",
    daysRemaining: 101,
    lastReminderSent: null,
  },
  {
    id: "6",
    clientId: "client-6",
    clientName: "Robert Garcia",
    clientType: "individual",
    email: "r.garcia@email.com",
    phone: "07700 900654",
    documentType: "id",
    documentName: "UK Biometric Residence Permit",
    expiryDate: "2024-11-30",
    status: "expired",
    daysRemaining: -4,
    lastReminderSent: "2024-11-15",
  },
  {
    id: "7",
    clientId: "client-7",
    clientName: "Emma Williams",
    clientType: "individual",
    email: "emma.w@email.com",
    phone: "07700 900789",
    documentType: "id",
    documentName: "UK Passport",
    expiryDate: "2025-06-20",
    status: "valid",
    daysRemaining: 198,
    lastReminderSent: null,
  },
];

const getStatusBadge = (status: string, daysRemaining: number) => {
  switch (status) {
    case "expired":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Expired ({Math.abs(daysRemaining)} days ago)
        </Badge>
      );
    case "expiring-soon":
      return (
        <Badge variant="outline" className="gap-1 bg-amber-500/20 text-amber-600 border-amber-500/30">
          <AlertTriangle className="h-3 w-3" />
          Expiring in {daysRemaining} days
        </Badge>
      );
    case "expiring":
      return (
        <Badge variant="outline" className="gap-1 bg-blue-500/20 text-blue-600 border-blue-500/30">
          <Clock className="h-3 w-3" />
          Expires in {daysRemaining} days
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1 bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
          <CheckCircle className="h-3 w-3" />
          Valid
        </Badge>
      );
  }
};

export default function KYCDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientTypeFilter, setClientTypeFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [sendingBulk, setSendingBulk] = useState(false);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesClientType = clientTypeFilter === "all" || doc.clientType === clientTypeFilter;
    return matchesSearch && matchesStatus && matchesClientType;
  });

  const expiredCount = mockDocuments.filter((d) => d.status === "expired").length;
  const expiringSoonCount = mockDocuments.filter((d) => d.status === "expiring-soon").length;
  const expiringCount = mockDocuments.filter((d) => d.status === "expiring").length;
  const validCount = mockDocuments.filter((d) => d.status === "valid").length;

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDocuments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocuments.map((d) => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSendReminder = async (doc: ClientDocument) => {
    setSendingReminder(doc.id);
    try {
      const { data, error } = await supabase.functions.invoke('send-renewal-reminder', {
        body: {
          clientName: doc.clientName,
          clientEmail: doc.email,
          documentType: doc.documentName,
          expiryDate: doc.expiryDate,
        },
      });

      if (error) throw error;

      toast({
        title: "Reminder Sent",
        description: `Renewal reminder sent to ${doc.clientName} at ${doc.email}`,
      });
    } catch (error: any) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Error Sending Reminder",
        description: error.message || "Failed to send reminder email",
        variant: "destructive",
      });
    } finally {
      setSendingReminder(null);
    }
  };

  const handleBulkReminder = async () => {
    setSendingBulk(true);
    const selectedDocs = filteredDocuments.filter((d) => selectedIds.includes(d.id));
    
    let successCount = 0;
    let failCount = 0;

    for (const doc of selectedDocs) {
      try {
        const { error } = await supabase.functions.invoke('send-renewal-reminder', {
          body: {
            clientName: doc.clientName,
            clientEmail: doc.email,
            documentType: doc.documentName,
            expiryDate: doc.expiryDate,
          },
        });
        if (error) throw error;
        successCount++;
      } catch {
        failCount++;
      }
    }

    toast({
      title: "Bulk Reminders Complete",
      description: `${successCount} sent successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
      variant: failCount > 0 ? "destructive" : "default",
    });
    
    setSelectedIds([]);
    setSendingBulk(false);
  };

  const renderDocumentRow = (doc: ClientDocument, showRenewalButton = false) => (
    <TableRow key={doc.id} className="group">
      <TableCell>
        <Checkbox
          checked={selectedIds.includes(doc.id)}
          onCheckedChange={() => toggleSelect(doc.id)}
        />
      </TableCell>
      <TableCell>
        <Link to={`/clients/${doc.clientId}`} className="flex items-center gap-3 hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {doc.clientType === "individual" ? (
              <User className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium hover:text-primary">{doc.clientName}</p>
            <p className="text-sm text-muted-foreground">{doc.email}</p>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium">{doc.documentName}</p>
            <p className="text-xs text-muted-foreground">ID Document</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {new Date(doc.expiryDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(doc.status, doc.daysRemaining)}</TableCell>
      <TableCell>
        {doc.lastReminderSent ? (
          <span className="text-sm text-muted-foreground">
            {new Date(doc.lastReminderSent).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Never</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {showRenewalButton ? (
          <Button 
            size="sm" 
            onClick={() => handleSendReminder(doc)}
            disabled={sendingReminder === doc.id}
          >
            {sendingReminder === doc.id ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Request Renewal
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => handleSendReminder(doc)}
                disabled={sendingReminder === doc.id}
              >
                {sendingReminder === doc.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Send Reminder
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Call Client
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/clients/${doc.clientId}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Client
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            KYC Compliance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage client ID document expiry status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {selectedIds.length > 0 && (
            <Button size="sm" onClick={handleBulkReminder} disabled={sendingBulk}>
              {sendingBulk ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Send {selectedIds.length} Reminders
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift animate-slide-up border-destructive/30 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired IDs</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{expiredCount}</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>
        <Card className="hover-lift animate-slide-up stagger-1 border-amber-500/30 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{expiringSoonCount}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
        <Card className="hover-lift animate-slide-up stagger-2 border-blue-500/30 bg-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{expiringCount}</div>
            <p className="text-xs text-muted-foreground">Within 90 days</p>
          </CardContent>
        </Card>
        <Card className="hover-lift animate-slide-up stagger-3 border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid IDs</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{validCount}</div>
            <p className="text-xs text-muted-foreground">No action required</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="animate-slide-up stagger-2">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="expiring">Expiring</SelectItem>
                  <SelectItem value="valid">Valid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Client Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="animate-slide-up stagger-3">
        <TabsList>
          <TabsTrigger value="all">All ID Documents</TabsTrigger>
          <TabsTrigger value="action-required" className="text-destructive">
            Action Required ({expiredCount + expiringSoonCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === filteredDocuments.length && filteredDocuments.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Reminder</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Shield className="h-8 w-8" />
                          <p>No documents found matching your criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => renderDocumentRow(doc, false))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action-required" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedIds.length ===
                            filteredDocuments.filter(
                              (d) => d.status === "expired" || d.status === "expiring-soon"
                            ).length &&
                          filteredDocuments.filter(
                            (d) => d.status === "expired" || d.status === "expiring-soon"
                          ).length > 0
                        }
                        onCheckedChange={() => {
                          const actionRequired = filteredDocuments.filter(
                            (d) => d.status === "expired" || d.status === "expiring-soon"
                          );
                          if (selectedIds.length === actionRequired.length) {
                            setSelectedIds([]);
                          } else {
                            setSelectedIds(actionRequired.map((d) => d.id));
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Reminder</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments
                    .filter((d) => d.status === "expired" || d.status === "expiring-soon")
                    .map((doc) => renderDocumentRow(doc, true))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredDocuments.length} of {mockDocuments.length} ID documents
          {selectedIds.length > 0 && ` • ${selectedIds.length} selected`}
        </p>
      </div>
    </div>
  );
}

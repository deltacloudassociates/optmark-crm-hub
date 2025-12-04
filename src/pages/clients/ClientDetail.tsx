import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  Edit,
  Send,
  Camera,
  CreditCard,
  File,
  Loader2,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Mock client data
const mockClients: Record<string, any> = {
  "client-1": {
    id: "client-1",
    type: "individual",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "07700 900123",
    address: "123 High Street, London",
    postcode: "EC1A 1BB",
    status: "active",
    category: "A",
    services: ["Self Assessment", "Tax Planning"],
    clientSince: "2021-03-15",
    kyc: {
      status: "action-required",
      idDocument: {
        type: "UK Passport",
        number: "123456789",
        issueDate: "2019-05-20",
        expiryDate: "2024-11-15",
        status: "expired",
        daysRemaining: -19,
        frontImage: "/placeholder.svg",
        backImage: null,
      },
      proofOfAddress: {
        type: "Council Tax Bill",
        dateReceived: "2024-08-10",
        validAtCollection: true,
        documentImage: "/placeholder.svg",
      },
      selfie: {
        image: "/placeholder.svg",
        dateCapture: "2024-08-10",
      },
      lastVerified: "2024-08-10",
    },
    documents: [
      { id: "1", name: "Tax Return 2023-24", type: "Tax Return", date: "2024-01-15" },
      { id: "2", name: "P60 2022-23", type: "Income Statement", date: "2023-05-20" },
      { id: "3", name: "Bank Statements Q3", type: "Financial", date: "2024-10-01" },
    ],
    activityHistory: [
      { id: "1", action: "KYC Renewal Reminder Sent", date: "2024-11-01", user: "System" },
      { id: "2", action: "Tax Return Submitted", date: "2024-01-15", user: "John Smith" },
      { id: "3", action: "Client Meeting", date: "2023-11-20", user: "Jane Doe" },
      { id: "4", action: "Initial Onboarding Complete", date: "2021-03-15", user: "John Smith" },
    ],
  },
  "client-2": {
    id: "client-2",
    type: "individual",
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@email.com",
    phone: "07700 900456",
    address: "45 Park Lane, Manchester",
    postcode: "M1 4BH",
    status: "active",
    category: "B",
    services: ["Self Assessment", "Bookkeeping"],
    clientSince: "2022-06-10",
    kyc: {
      status: "expiring-soon",
      idDocument: {
        type: "UK Driving Licence",
        number: "CHEN9705123AB1CD",
        issueDate: "2014-12-20",
        expiryDate: "2024-12-20",
        status: "expiring-soon",
        daysRemaining: 16,
        frontImage: "/placeholder.svg",
        backImage: "/placeholder.svg",
      },
      proofOfAddress: {
        type: "Bank Statement",
        dateReceived: "2024-09-15",
        validAtCollection: true,
        documentImage: "/placeholder.svg",
      },
      selfie: {
        image: "/placeholder.svg",
        dateCapture: "2024-09-15",
      },
      lastVerified: "2024-09-15",
    },
    documents: [
      { id: "1", name: "Tax Return 2023-24", type: "Tax Return", date: "2024-01-20" },
    ],
    activityHistory: [
      { id: "1", action: "Documents Uploaded", date: "2024-01-20", user: "Client Portal" },
      { id: "2", action: "Initial Onboarding Complete", date: "2022-06-10", user: "Jane Doe" },
    ],
  },
  "client-3": {
    id: "client-3",
    type: "business",
    companyName: "Tech Solutions Ltd",
    companyNumber: "12345678",
    responsiblePerson: "James Wilson",
    email: "accounts@techsolutions.co.uk",
    phone: "020 7946 0958",
    address: "100 Tech Park, Birmingham",
    postcode: "B1 1AA",
    status: "active",
    category: "A",
    services: ["Corporation Tax", "Annual Accounts", "VAT Returns"],
    vatRegistered: true,
    clientSince: "2020-01-20",
    kyc: {
      status: "expiring-soon",
      idDocument: {
        type: "UK Passport (Director)",
        number: "987654321",
        issueDate: "2020-01-15",
        expiryDate: "2025-01-15",
        status: "expiring-soon",
        daysRemaining: 42,
        frontImage: "/placeholder.svg",
        backImage: null,
        directorName: "James Wilson",
      },
      proofOfAddress: {
        type: "Utility Bill",
        dateReceived: "2024-07-20",
        validAtCollection: true,
        documentImage: "/placeholder.svg",
      },
      selfie: {
        image: "/placeholder.svg",
        dateCapture: "2024-07-20",
      },
      lastVerified: "2024-07-20",
    },
    documents: [
      { id: "1", name: "Annual Accounts 2023", type: "Accounts", date: "2024-03-15" },
      { id: "2", name: "Corporation Tax Return", type: "Tax Return", date: "2024-03-20" },
    ],
    activityHistory: [
      { id: "1", action: "KYC Renewal Reminder Sent", date: "2024-11-20", user: "System" },
      { id: "2", action: "VAT Return Filed", date: "2024-10-07", user: "John Smith" },
      { id: "3", action: "Annual Accounts Submitted", date: "2024-03-15", user: "Jane Doe" },
    ],
  },
};

const getKYCStatusBadge = (status: string) => {
  switch (status) {
    case "expired":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Expired
        </Badge>
      );
    case "action-required":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Action Required
        </Badge>
      );
    case "expiring-soon":
      return (
        <Badge variant="outline" className="gap-1 bg-amber-500/20 text-amber-600 border-amber-500/30">
          <AlertTriangle className="h-3 w-3" />
          Expiring Soon
        </Badge>
      );
    case "verified":
      return (
        <Badge variant="outline" className="gap-1 bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
          <CheckCircle className="h-3 w-3" />
          Verified
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
  }
};

const getDocumentStatusBadge = (status: string, daysRemaining: number) => {
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

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const [sendingReminder, setSendingReminder] = useState(false);
  
  const client = mockClients[id || ""] || mockClients["client-1"];
  const isIndividual = client.type === "individual";

  const handleSendRenewalReminder = async () => {
    setSendingReminder(true);
    try {
      const { error } = await supabase.functions.invoke('send-renewal-reminder', {
        body: {
          clientName: isIndividual ? `${client.firstName} ${client.lastName}` : client.companyName,
          clientEmail: client.email,
          documentType: client.kyc.idDocument.type,
          expiryDate: client.kyc.idDocument.expiryDate,
        },
      });

      if (error) throw error;

      toast({
        title: "Renewal Reminder Sent",
        description: `Email sent to ${client.email}`,
      });
    } catch (error: any) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reminder",
        variant: "destructive",
      });
    } finally {
      setSendingReminder(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={isIndividual ? "/clients/individual" : "/clients/business"}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {isIndividual ? (
                <User className="h-6 w-6 text-primary" />
              ) : (
                <Building2 className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isIndividual ? `${client.firstName} ${client.lastName}` : client.companyName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {!isIndividual && (
                  <>
                    <span className="font-mono">{client.companyNumber}</span>
                    <span>•</span>
                  </>
                )}
                <span>Client since {new Date(client.clientSince).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={client.status} />
          <CategoryBadge category={client.category} />
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Client Info */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isIndividual && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{client.responsiblePerson}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                  {client.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${client.phone}`} className="hover:text-primary">
                  {client.phone}
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{client.address}</p>
                  <p className="font-medium">{client.postcode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {client.services.map((service: string) => (
                  <Badge key={service} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
              {!isIndividual && client.vatRegistered && (
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  VAT Registered
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - KYC & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* KYC Status Card */}
          <Card className={client.kyc.status === "action-required" || client.kyc.status === "expired" ? "border-destructive/50" : client.kyc.status === "expiring-soon" ? "border-amber-500/50" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">KYC Verification Status</CardTitle>
                </div>
                {getKYCStatusBadge(client.kyc.status)}
              </div>
              <CardDescription>
                Last verified: {new Date(client.kyc.lastVerified).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ID Document */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    ID Document
                  </h4>
                  {getDocumentStatusBadge(client.kyc.idDocument.status, client.kyc.idDocument.daysRemaining)}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Document Type</p>
                    <p className="text-sm font-medium">{client.kyc.idDocument.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Document Number</p>
                    <p className="text-sm font-medium font-mono">{client.kyc.idDocument.number}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Expiry Date</p>
                    <p className="text-sm font-medium">
                      {new Date(client.kyc.idDocument.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <div className="relative aspect-[3/2] w-32 rounded-lg border bg-muted overflow-hidden">
                    <img src={client.kyc.idDocument.frontImage} alt="ID Front" className="object-cover w-full h-full" />
                    <span className="absolute bottom-1 left-1 text-[10px] bg-background/80 px-1 rounded">Front</span>
                  </div>
                  {client.kyc.idDocument.backImage && (
                    <div className="relative aspect-[3/2] w-32 rounded-lg border bg-muted overflow-hidden">
                      <img src={client.kyc.idDocument.backImage} alt="ID Back" className="object-cover w-full h-full" />
                      <span className="absolute bottom-1 left-1 text-[10px] bg-background/80 px-1 rounded">Back</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Proof of Address */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Proof of Address
                  </h4>
                  <Badge variant="outline" className="gap-1 bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
                    <CheckCircle className="h-3 w-3" />
                    Valid at Collection
                  </Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Document Type</p>
                    <p className="text-sm font-medium">{client.kyc.proofOfAddress.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Date Received</p>
                    <p className="text-sm font-medium">
                      {new Date(client.kyc.proofOfAddress.dateReceived).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  PoA documents are validated at time of collection (within 3 months). Fresh PoA is required when ID is renewed.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="relative aspect-[3/2] w-32 rounded-lg border bg-muted overflow-hidden">
                    <img src={client.kyc.proofOfAddress.documentImage} alt="Proof of Address" className="object-cover w-full h-full" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Selfie */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  Identity Selfie
                </h4>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full border bg-muted overflow-hidden">
                    <img src={client.kyc.selfie.image} alt="Selfie" className="object-cover w-full h-full" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Captured</p>
                    <p className="text-sm font-medium">
                      {new Date(client.kyc.selfie.dateCapture).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Renewal Button */}
              {(client.kyc.status === "action-required" || client.kyc.status === "expired" || client.kyc.status === "expiring-soon") && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Request updated ID document and fresh Proof of Address
                    </p>
                    <Button onClick={handleSendRenewalReminder} disabled={sendingReminder}>
                      {sendingReminder ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Request Renewal
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs for Documents & Activity */}
          <Tabs defaultValue="documents">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity History</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {client.documents.map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <File className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">{doc.type}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(doc.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {client.activityHistory.map((activity: any, index: number) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <History className="h-4 w-4 text-muted-foreground" />
                          </div>
                          {index < client.activityHistory.length - 1 && (
                            <div className="w-px flex-1 bg-border mt-2" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{new Date(activity.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span>•</span>
                            <span>{activity.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

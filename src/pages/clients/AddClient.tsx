import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  User,
  Building2,
  MapPin,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  Shield,
  AlertTriangle,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";

type ClientType = "individual" | "business";

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
}

const individualSteps: Step[] = [
  { id: 1, title: "Personal Information", icon: <User className="h-5 w-5" /> },
  { id: 2, title: "Address & Contact", icon: <MapPin className="h-5 w-5" /> },
  { id: 3, title: "Identity Verification", icon: <Shield className="h-5 w-5" /> },
  { id: 4, title: "Tax Information", icon: <FileText className="h-5 w-5" /> },
  { id: 5, title: "Services", icon: <CheckCircle className="h-5 w-5" /> },
  { id: 6, title: "Review", icon: <CheckCircle className="h-5 w-5" /> },
];

const businessSteps: Step[] = [
  { id: 1, title: "Company Information", icon: <Building2 className="h-5 w-5" /> },
  { id: 2, title: "Contact Person", icon: <User className="h-5 w-5" /> },
  { id: 3, title: "Identity Verification", icon: <Shield className="h-5 w-5" /> },
  { id: 4, title: "Tax & VAT", icon: <FileText className="h-5 w-5" /> },
  { id: 5, title: "Services", icon: <CheckCircle className="h-5 w-5" /> },
  { id: 6, title: "Review", icon: <CheckCircle className="h-5 w-5" /> },
];

const services = [
  { id: "self-assessment", name: "Self Assessment", type: "individual", price: 150 },
  { id: "tax-planning-ind", name: "Tax Planning (Individual)", type: "individual", price: 300 },
  { id: "bookkeeping-ind", name: "Bookkeeping", type: "individual", price: 100 },
  { id: "cis-returns", name: "CIS Returns", type: "individual", price: 50 },
  { id: "corporation-tax", name: "Corporation Tax", type: "business", price: 500 },
  { id: "annual-accounts", name: "Annual Accounts", type: "business", price: 800 },
  { id: "vat-returns", name: "VAT Returns", type: "business", price: 120 },
  { id: "payroll", name: "Payroll Services", type: "business", price: 150 },
  { id: "bookkeeping-bus", name: "Bookkeeping (Business)", type: "business", price: 200 },
];

const idTypes = [
  { value: "passport", label: "Passport" },
  { value: "driving-licence", label: "UK Driving Licence" },
  { value: "eu-national-id", label: "EU National ID Card" },
  { value: "biometric-residence", label: "UK Biometric Residence Permit" },
];

const poaTypes = [
  { value: "council-tax", label: "Council Tax Bill" },
  { value: "bank-statement", label: "Bank Statement" },
  { value: "utility-bill", label: "Utility Bill (Gas/Electric/Water)" },
  { value: "mortgage-statement", label: "Mortgage Statement" },
  { value: "government-letter", label: "Government Letter (HMRC/DWP)" },
];

// Helper function to calculate expiry status
const getExpiryStatus = (expiryDate: string) => {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return { status: "expired", label: "Expired", color: "destructive", days: Math.abs(daysUntilExpiry) };
  if (daysUntilExpiry <= 30) return { status: "expiring-soon", label: "Expiring Soon", color: "warning", days: daysUntilExpiry };
  if (daysUntilExpiry <= 90) return { status: "expiring", label: "Expiring", color: "warning", days: daysUntilExpiry };
  return { status: "valid", label: "Valid", color: "success", days: daysUntilExpiry };
};

// Helper function to check if proof of address is valid (within 3 months)
const getPoaStatus = (issueDate: string) => {
  if (!issueDate) return null;
  const issue = new Date(issueDate);
  const now = new Date();
  const daysSinceIssue = Math.ceil((now.getTime() - issue.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = 90 - daysSinceIssue;

  if (daysSinceIssue > 90) return { status: "expired", label: "Expired", color: "destructive", days: Math.abs(daysRemaining) };
  if (daysRemaining <= 14) return { status: "expiring-soon", label: "Expiring Soon", color: "warning", days: daysRemaining };
  if (daysRemaining <= 30) return { status: "expiring", label: "Expiring", color: "warning", days: daysRemaining };
  return { status: "valid", label: "Valid", color: "success", days: daysRemaining };
};

export default function AddClient() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "business" ? "business" : "individual";

  const [clientType, setClientType] = useState<ClientType>(initialType);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { toast } = useToast();

  // KYC - ID Document state
  const [idType, setIdType] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [idIssueDate, setIdIssueDate] = useState<string>("");
  const [idExpiryDate, setIdExpiryDate] = useState<string>("");
  const [idDocumentFront, setIdDocumentFront] = useState<File | null>(null);
  const [idDocumentBack, setIdDocumentBack] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);

  // KYC - Proof of Address state
  const [poaType, setPoaType] = useState<string>("");
  const [poaIssueDate, setPoaIssueDate] = useState<string>("");
  const [poaDocument, setPoaDocument] = useState<File | null>(null);

  const steps = clientType === "individual" ? individualSteps : businessSteps;
  const totalSteps = 6;

  const handleCompanyLookup = async () => {
    setIsLookingUp(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLookingUp(false);
    toast({
      title: "Company Found",
      description: "Company details have been auto-filled from Companies House.",
    });
  };

  const handlePostcodeLookup = async () => {
    setIsLookingUp(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLookingUp(false);
    toast({
      title: "Address Found",
      description: "Please select your address from the dropdown.",
    });
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const filteredServices = services.filter(
    (s) => s.type === clientType || s.type === "both"
  );

  const idExpiryStatus = getExpiryStatus(idExpiryDate);
  const poaStatus = getPoaStatus(poaIssueDate);

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Back Link */}
      <Link
        to="/clients/individual"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      {/* Client Type Selector */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setClientType("individual");
            setCurrentStep(1);
            setSelectedServices([]);
          }}
          className={cn(
            "flex flex-1 items-center gap-4 rounded-xl border-2 p-4 transition-all",
            clientType === "individual"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              clientType === "individual" ? "bg-primary text-primary-foreground" : "bg-secondary"
            )}
          >
            <User className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Individual Client</p>
            <p className="text-sm text-muted-foreground">Personal tax returns, self-employed</p>
          </div>
        </button>
        <button
          onClick={() => {
            setClientType("business");
            setCurrentStep(1);
            setSelectedServices([]);
          }}
          className={cn(
            "flex flex-1 items-center gap-4 rounded-xl border-2 p-4 transition-all",
            clientType === "business"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              clientType === "business" ? "bg-primary text-primary-foreground" : "bg-secondary"
            )}
          >
            <Building2 className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Business Client</p>
            <p className="text-sm text-muted-foreground">Limited companies, partnerships</p>
          </div>
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <div
              className={cn(
                "flex items-center gap-2",
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  currentStep > step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-border"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <span className="hidden lg:block text-sm font-medium whitespace-nowrap">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 lg:mx-4 h-0.5 w-8 lg:w-12",
                  currentStep > step.id ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && clientType === "individual" && "Enter the client's personal details"}
            {currentStep === 1 && clientType === "business" && "Enter company registration details"}
            {currentStep === 2 && clientType === "individual" && "Enter address and contact information"}
            {currentStep === 2 && clientType === "business" && "Enter the responsible person's details"}
            {currentStep === 3 && "Upload identification documents for AML compliance"}
            {currentStep === 4 && "Enter tax registration information"}
            {currentStep === 5 && "Select the services this client requires"}
            {currentStep === 6 && "Review all information before creating the client"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 - Individual: Personal Information */}
          {currentStep === 1 && clientType === "individual" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" placeholder="e.g., John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" placeholder="e.g., Smith" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="john.smith@example.com" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="07XXX XXXXXX" />
                <p className="text-xs text-muted-foreground">UK format: 07XXX XXXXXX or 01XX XXX XXXX</p>
              </div>
            </div>
          )}

          {/* Step 1 - Business: Company Information */}
          {currentStep === 1 && clientType === "business" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyNumber">Company Number *</Label>
                <div className="flex gap-2">
                  <Input id="companyNumber" placeholder="e.g., 12345678" className="flex-1 font-mono" />
                  <Button onClick={handleCompanyLookup} disabled={isLookingUp}>
                    {isLookingUp ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Lookup
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Enter 8-digit Companies House number</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" placeholder="Auto-filled from Companies House" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyStatus">Company Status</Label>
                  <Input id="companyStatus" placeholder="Active" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incorporationDate">Incorporation Date</Label>
                  <Input id="incorporationDate" type="date" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Individual: Address & Contact */}
          {currentStep === 2 && clientType === "individual" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <div className="flex gap-2">
                  <Input id="postcode" placeholder="SW1A 1AA" className="flex-1 font-mono uppercase" />
                  <Button onClick={handlePostcodeLookup} variant="outline" disabled={isLookingUp}>
                    {isLookingUp ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Find Address
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input id="address1" placeholder="Street address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input id="address2" placeholder="Apartment, suite, etc. (optional)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Town/City *</Label>
                <Input id="city" placeholder="e.g., London" />
              </div>
            </div>
          )}

          {/* Step 2 - Business: Contact Person */}
          {currentStep === 2 && clientType === "business" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="responsiblePerson">Responsible Person Name *</Label>
                <Input id="responsiblePerson" placeholder="e.g., John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input id="contactEmail" type="email" placeholder="john@company.co.uk" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Input id="contactPhone" placeholder="020 XXXX XXXX" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="position">Position/Role</Label>
                <Input id="position" placeholder="e.g., Director, Company Secretary" />
              </div>
            </div>
          )}

          {/* Step 3 - Identity Verification (KYC) */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* ID Document Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">ID Document</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="idType">ID Type *</Label>
                    <Select value={idType} onValueChange={setIdType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        {idTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number *</Label>
                    <Input
                      id="idNumber"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="Enter ID number"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idIssueDate">Issue Date *</Label>
                    <Input
                      id="idIssueDate"
                      type="date"
                      value={idIssueDate}
                      onChange={(e) => setIdIssueDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idExpiryDate">Expiry Date *</Label>
                    <Input
                      id="idExpiryDate"
                      type="date"
                      value={idExpiryDate}
                      onChange={(e) => setIdExpiryDate(e.target.value)}
                    />
                    {idExpiryStatus && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={idExpiryStatus.color === "success" ? "default" : "destructive"}
                          className={cn(
                            idExpiryStatus.color === "warning" && "bg-warning text-warning-foreground",
                            idExpiryStatus.color === "success" && "bg-success text-success-foreground"
                          )}
                        >
                          {idExpiryStatus.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {idExpiryStatus.status === "expired"
                            ? `Expired ${idExpiryStatus.days} days ago`
                            : `${idExpiryStatus.days} days remaining`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FileUpload
                    label="ID Front *"
                    description="Upload front of your ID document"
                    value={idDocumentFront}
                    onChange={setIdDocumentFront}
                    accept="image/*,.pdf"
                  />
                  {idType === "driving-licence" && (
                    <FileUpload
                      label="ID Back *"
                      description="Upload back of driving licence"
                      value={idDocumentBack}
                      onChange={setIdDocumentBack}
                      accept="image/*,.pdf"
                    />
                  )}
                </div>
              </div>

              {/* Selfie Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Identity Selfie</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FileUpload
                    label="Selfie Photo *"
                    description="Clear photo of yourself"
                    value={selfieImage}
                    onChange={setSelfieImage}
                    accept="image/*"
                    previewType="image"
                  />
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
                    <p className="text-sm font-medium">Selfie Guidelines:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Clear, well-lit photo</li>
                      <li>• Face clearly visible</li>
                      <li>• No sunglasses or hats</li>
                      <li>• Neutral background preferred</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Proof of Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Proof of Address</h3>
                </div>

                <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-warning-foreground">
                    Document must be dated within the last 3 months
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="poaType">Document Type *</Label>
                    <Select value={poaType} onValueChange={setPoaType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {poaTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poaIssueDate">Document Date *</Label>
                    <Input
                      id="poaIssueDate"
                      type="date"
                      value={poaIssueDate}
                      onChange={(e) => setPoaIssueDate(e.target.value)}
                    />
                    {poaStatus && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={poaStatus.color === "success" ? "default" : "destructive"}
                          className={cn(
                            poaStatus.color === "warning" && "bg-warning text-warning-foreground",
                            poaStatus.color === "success" && "bg-success text-success-foreground"
                          )}
                        >
                          {poaStatus.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {poaStatus.status === "expired"
                            ? `Expired ${poaStatus.days} days ago`
                            : `${poaStatus.days} days until expiry`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <FileUpload
                  label="Proof of Address Document *"
                  description="Upload your proof of address document"
                  value={poaDocument}
                  onChange={setPoaDocument}
                  accept="image/*,.pdf"
                  previewType="document"
                />
              </div>
            </div>
          )}

          {/* Step 4 - Tax Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {clientType === "individual" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ni">National Insurance Number *</Label>
                    <Input id="ni" placeholder="AB123456C" className="font-mono uppercase" />
                    <p className="text-xs text-muted-foreground">Format: 2 letters, 6 numbers, 1 letter</p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label>Has UTR Number?</Label>
                      <p className="text-sm text-muted-foreground">Unique Taxpayer Reference from HMRC</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="utr">UTR Number</Label>
                    <Input id="utr" placeholder="1234567890" className="font-mono" />
                    <p className="text-xs text-muted-foreground">10-digit number</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Employment Status *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self_employed">Self-Employed</SelectItem>
                        <SelectItem value="director">Company Director</SelectItem>
                        <SelectItem value="pensioner">Pensioner</SelectItem>
                        <SelectItem value="multiple">Multiple Income Sources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="utrBusiness">UTR Number *</Label>
                    <Input id="utrBusiness" placeholder="1234567890" className="font-mono" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label>VAT Registered?</Label>
                      <p className="text-sm text-muted-foreground">Is the company registered for VAT?</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT Number</Label>
                    <Input id="vatNumber" placeholder="GB123456789" className="font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payeRef">PAYE Reference</Label>
                    <Input id="payeRef" placeholder="123/AB456" className="font-mono" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 5 - Services */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select the services this client will require. Prices can be customized per client.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all",
                      selectedServices.includes(service.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2",
                        selectedServices.includes(service.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      )}
                    >
                      {selectedServices.includes(service.id) && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">£{service.price}/year</p>
                    </div>
                  </button>
                ))}
              </div>
              {selectedServices.length > 0 && (
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Selected Services:</span>
                    <span>{selectedServices.length}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium">Total Annual Value:</span>
                    <span className="text-lg font-semibold text-primary">
                      £{selectedServices.reduce((sum, id) => {
                        const service = services.find((s) => s.id === id);
                        return sum + (service?.price || 0);
                      }, 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 6 - Review */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="rounded-lg border border-success/20 bg-success/5 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <div>
                    <p className="font-semibold text-success">Ready to Create Client</p>
                    <p className="text-sm text-muted-foreground">
                      Review the information below. You can edit any section by going back.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Client type: {clientType === "individual" ? "Individual" : "Business"}
                  </p>
                </div>

                {/* KYC Summary */}
                <div className="rounded-lg border p-4 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Identity Verification
                  </h4>

                  {/* Document Status Warnings */}
                  {(idExpiryStatus?.status === "expired" || idExpiryStatus?.status === "expiring-soon" ||
                    poaStatus?.status === "expired" || poaStatus?.status === "expiring-soon") && (
                    <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-warning-foreground">Document Attention Required</p>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          {idExpiryStatus?.status === "expired" && (
                            <li>• ID document has expired</li>
                          )}
                          {idExpiryStatus?.status === "expiring-soon" && (
                            <li>• ID document expires in {idExpiryStatus.days} days</li>
                          )}
                          {poaStatus?.status === "expired" && (
                            <li>• Proof of address has expired</li>
                          )}
                          {poaStatus?.status === "expiring-soon" && (
                            <li>• Proof of address expires in {poaStatus.days} days</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">ID Type</p>
                      <p className="font-medium">
                        {idTypes.find((t) => t.value === idType)?.label || "Not selected"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ID Number</p>
                      <p className="font-medium font-mono">{idNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ID Expiry</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{idExpiryDate || "Not provided"}</p>
                        {idExpiryStatus && (
                          <Badge
                            variant={idExpiryStatus.color === "success" ? "default" : "destructive"}
                            className={cn(
                              "text-xs",
                              idExpiryStatus.color === "warning" && "bg-warning text-warning-foreground",
                              idExpiryStatus.color === "success" && "bg-success text-success-foreground"
                            )}
                          >
                            {idExpiryStatus.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Proof of Address</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {poaTypes.find((t) => t.value === poaType)?.label || "Not selected"}
                        </p>
                        {poaStatus && (
                          <Badge
                            variant={poaStatus.color === "success" ? "default" : "destructive"}
                            className={cn(
                              "text-xs",
                              poaStatus.color === "warning" && "bg-warning text-warning-foreground",
                              poaStatus.color === "success" && "bg-success text-success-foreground"
                            )}
                          >
                            {poaStatus.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Document Upload Status */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Badge variant={idDocumentFront ? "default" : "outline"} className={idDocumentFront ? "bg-success text-success-foreground" : ""}>
                      {idDocumentFront ? "✓" : "○"} ID Front
                    </Badge>
                    {idType === "driving-licence" && (
                      <Badge variant={idDocumentBack ? "default" : "outline"} className={idDocumentBack ? "bg-success text-success-foreground" : ""}>
                        {idDocumentBack ? "✓" : "○"} ID Back
                      </Badge>
                    )}
                    <Badge variant={selfieImage ? "default" : "outline"} className={selfieImage ? "bg-success text-success-foreground" : ""}>
                      {selfieImage ? "✓" : "○"} Selfie
                    </Badge>
                    <Badge variant={poaDocument ? "default" : "outline"} className={poaDocument ? "bg-success text-success-foreground" : ""}>
                      {poaDocument ? "✓" : "○"} Proof of Address
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Services Selected</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.map((id) => {
                      const service = services.find((s) => s.id === id);
                      return (
                        <span key={id} className="rounded-md bg-primary/10 px-2 py-1 text-sm text-primary">
                          {service?.name}
                        </span>
                      );
                    })}
                    {selectedServices.length === 0 && (
                      <span className="text-sm text-muted-foreground">No services selected</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                After creating the client, an engagement letter will be automatically generated and
                sent to the client's email address.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              toast({
                title: "Client Created",
                description: "The client has been successfully added to the system.",
              });
            }}
          >
            Create Client
          </Button>
        )}
      </div>
    </div>
  );
}

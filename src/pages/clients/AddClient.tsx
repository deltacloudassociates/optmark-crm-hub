import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
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
  ExternalLink,
  Users,
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCompaniesHouseLookup, CompanyData, OfficerData, ExistingClient } from "@/hooks/useCompaniesHouseLookup";
import { useDuplicateCheck, DuplicateClient } from "@/hooks/useDuplicateCheck";
import { supabase } from "@/integrations/supabase/client";

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
  { id: 1, title: "Company Lookup", icon: <Building2 className="h-5 w-5" /> },
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

// Format date for display
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AddClient() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = searchParams.get("type") === "business" ? "business" : "individual";

  const [clientType, setClientType] = useState<ClientType>(initialType);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Companies House lookup
  const { lookupCompany, isLoading: isLookingUpCompany, error: lookupError, clearError } = useCompaniesHouseLookup();
  const [companyNumber, setCompanyNumber] = useState("");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [officers, setOfficers] = useState<OfficerData[]>([]);
  const [existingClient, setExistingClient] = useState<ExistingClient | null>(null);
  const [companyLookupDone, setCompanyLookupDone] = useState(false);

  // Individual client fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [niNumber, setNiNumber] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [hasUtr, setHasUtr] = useState(false);

  // Business contact fields
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [primaryContactEmail, setPrimaryContactEmail] = useState("");
  const [primaryContactPhone, setPrimaryContactPhone] = useState("");
  const [vatRegistered, setVatRegistered] = useState(false);
  const [vatNumber, setVatNumber] = useState("");
  const [businessUtr, setBusinessUtr] = useState("");
  const [payeRef, setPayeRef] = useState("");

  // Duplicate check for individuals
  const { checkForDuplicates, isChecking: isCheckingDuplicates, duplicates, clearDuplicates } = useDuplicateCheck();
  const [duplicateCheckDone, setDuplicateCheckDone] = useState(false);
  const [duplicateComment, setDuplicateComment] = useState("");

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

  // Auto-populate contact from first director when company data loads
  useEffect(() => {
    if (officers.length > 0 && !primaryContactName) {
      const firstDirector = officers.find(o => o.is_primary_contact) || officers[0];
      if (firstDirector) {
        setPrimaryContactName(firstDirector.officer_name);
      }
    }
  }, [officers, primaryContactName]);

  const handleCompanyLookup = async () => {
    clearError();
    setExistingClient(null);
    setCompanyData(null);
    setOfficers([]);
    setCompanyLookupDone(false);

    const result = await lookupCompany(companyNumber);

    if (result) {
      if (result.exists && result.existingClient) {
        setExistingClient(result.existingClient);
        toast({
          title: "Company Already Registered",
          description: `${result.existingClient.company_name} is already in your database.`,
          variant: "destructive",
        });
      } else if (result.company) {
        setCompanyData(result.company);
        setOfficers(result.officers || []);
        setCompanyLookupDone(true);
        toast({
          title: "Company Found",
          description: `${result.company.company_name} details loaded from Companies House.`,
        });
      }
    }
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

  const handleDuplicateCheck = async () => {
    if (firstName && lastName) {
      await checkForDuplicates(firstName, lastName, dateOfBirth);
      setDuplicateCheckDone(true);
    }
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

  // Save client to database
  const handleSaveClient = async () => {
    setIsSaving(true);

    try {
      if (clientType === "business" && companyData) {
        // Save business client
        const { data: businessClient, error: businessError } = await supabase
          .from("business_clients")
          .insert({
            company_number: companyData.company_number,
            company_name: companyData.company_name,
            company_type: companyData.company_type,
            company_status: companyData.company_status,
            incorporation_date: companyData.incorporation_date,
            registered_office_address: companyData.registered_office_address,
            accounts_next_made_up_to: companyData.accounts_next_made_up_to,
            accounts_due_by: companyData.accounts_due_by,
            accounts_last_made_up_to: companyData.accounts_last_made_up_to,
            confirmation_next_date: companyData.confirmation_next_date,
            confirmation_due_by: companyData.confirmation_due_by,
            confirmation_last_date: companyData.confirmation_last_date,
            primary_contact_name: primaryContactName,
            primary_contact_email: primaryContactEmail,
            primary_contact_phone: primaryContactPhone,
            utr_number: businessUtr || null,
            vat_registered: vatRegistered,
            vat_number: vatRegistered ? vatNumber : null,
            paye_reference: payeRef || null,
            services: selectedServices,
            kyc_id_type: idType || null,
            kyc_id_number: idNumber || null,
            kyc_id_expiry: idExpiryDate || null,
            kyc_poa_type: poaType || null,
            kyc_poa_issue_date: poaIssueDate || null,
          })
          .select()
          .single();

        if (businessError) throw businessError;

        // Save officers
        if (businessClient && officers.length > 0) {
          const officersToInsert = officers.map(officer => ({
            business_client_id: businessClient.id,
            officer_name: officer.officer_name,
            officer_role: officer.officer_role,
            correspondence_address: officer.correspondence_address,
            date_of_birth_month: officer.date_of_birth_month,
            date_of_birth_year: officer.date_of_birth_year,
            appointed_date: officer.appointed_date,
            nationality: officer.nationality,
            country_of_residence: officer.country_of_residence,
            occupation: officer.occupation,
            is_primary_contact: officer.officer_name === primaryContactName,
          }));

          const { error: officersError } = await supabase
            .from("company_officers")
            .insert(officersToInsert);

          if (officersError) {
            console.error("Error saving officers:", officersError);
          }
        }

        toast({
          title: "Business Client Created",
          description: `${companyData.company_name} has been added successfully.`,
        });

        navigate("/clients/business");
      } else if (clientType === "individual") {
        // Save individual client
        const { error: individualError } = await supabase
          .from("individual_clients")
          .insert({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth || null,
            email: email || null,
            phone: phone || null,
            address_line1: addressLine1 || null,
            address_line2: addressLine2 || null,
            city: city || null,
            postcode: postcode || null,
            ni_number: niNumber || null,
            utr_number: hasUtr ? utrNumber : null,
            services: selectedServices,
            kyc_id_type: idType || null,
            kyc_id_number: idNumber || null,
            kyc_id_expiry: idExpiryDate || null,
            kyc_poa_type: poaType || null,
            kyc_poa_issue_date: poaIssueDate || null,
            duplicate_check_notes: duplicateComment || null,
          });

        if (individualError) throw individualError;

        toast({
          title: "Individual Client Created",
          description: `${firstName} ${lastName} has been added successfully.`,
        });

        navigate("/clients/individual");
      }
    } catch (error) {
      console.error("Error saving client:", error);
      toast({
        title: "Error",
        description: "Failed to save client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if can proceed to next step
  const canProceed = () => {
    if (clientType === "business" && currentStep === 1) {
      return companyLookupDone && companyData && !existingClient;
    }
    return true;
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Back Link */}
      <Link
        to={clientType === "business" ? "/clients/business" : "/clients/individual"}
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
            setCompanyData(null);
            setOfficers([]);
            setExistingClient(null);
            setCompanyLookupDone(false);
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
            clearDuplicates();
            setDuplicateCheckDone(false);
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
            {currentStep === 1 && clientType === "business" && "Look up company details from Companies House"}
            {currentStep === 2 && clientType === "individual" && "Enter address and contact information"}
            {currentStep === 2 && clientType === "business" && "Confirm primary contact details"}
            {currentStep === 3 && "Upload identification documents for AML compliance"}
            {currentStep === 4 && "Enter tax registration information"}
            {currentStep === 5 && "Select the services this client requires"}
            {currentStep === 6 && "Review all information before creating the client"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 - Individual: Personal Information */}
          {currentStep === 1 && clientType === "individual" && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="e.g., John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="e.g., Smith"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check for Duplicates</Label>
                  <Button
                    onClick={handleDuplicateCheck}
                    variant="outline"
                    className="w-full"
                    disabled={!firstName || !lastName || isCheckingDuplicates}
                  >
                    {isCheckingDuplicates ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Check Duplicates
                  </Button>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="07XXX XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">UK format: 07XXX XXXXXX or 01XX XXX XXXX</p>
                </div>
              </div>

              {/* Duplicate Warning */}
              {duplicateCheckDone && duplicates.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Potential Duplicates Found</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">The following clients have matching names:</p>
                    <ul className="list-disc list-inside space-y-1 mb-3">
                      {duplicates.map((dup) => (
                        <li key={dup.id}>
                          {dup.first_name} {dup.last_name}
                          {dup.date_of_birth && ` (DOB: ${formatDate(dup.date_of_birth)})`}
                          {dup.email && ` - ${dup.email}`}
                          <Link
                            to={`/clients/individual/${dup.id}`}
                            className="ml-2 text-primary underline"
                          >
                            View
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-2">
                      <Label htmlFor="duplicateComment">
                        If this is not a duplicate, please provide a reason:
                      </Label>
                      <Textarea
                        id="duplicateComment"
                        placeholder="e.g., Different person - verified by ID"
                        value={duplicateComment}
                        onChange={(e) => setDuplicateComment(e.target.value)}
                      />
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {duplicateCheckDone && duplicates.length === 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>No Duplicates Found</AlertTitle>
                  <AlertDescription>
                    No existing clients match this name and date of birth.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 1 - Business: Company Lookup */}
          {currentStep === 1 && clientType === "business" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyNumber">Company Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="companyNumber"
                    placeholder="e.g., 12345678"
                    className="flex-1 font-mono uppercase"
                    value={companyNumber}
                    onChange={(e) => setCompanyNumber(e.target.value.toUpperCase())}
                  />
                  <Button onClick={handleCompanyLookup} disabled={isLookingUpCompany || !companyNumber}>
                    {isLookingUpCompany ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Lookup
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Enter 8-digit Companies House number</p>
              </div>

              {/* Lookup Error */}
              {lookupError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Lookup Failed</AlertTitle>
                  <AlertDescription>{lookupError}</AlertDescription>
                </Alert>
              )}

              {/* Existing Client Warning */}
              {existingClient && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Company Already Registered</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      <strong>{existingClient.company_name}</strong> ({existingClient.company_number}) is already in your database.
                    </p>
                    <Link
                      to={`/clients/business/${existingClient.id}`}
                      className="inline-flex items-center gap-1 text-primary underline"
                    >
                      View Existing Client <ExternalLink className="h-3 w-3" />
                    </Link>
                  </AlertDescription>
                </Alert>
              )}

              {/* Company Details */}
              {companyData && (
                <div className="space-y-4">
                  {/* Company Info Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Company Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Company Name</p>
                        <p className="font-medium">{companyData.company_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Company Number</p>
                        <p className="font-mono">{companyData.company_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="capitalize">{companyData.company_type?.replace(/-/g, " ")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge variant={companyData.company_status === "active" ? "default" : "secondary"}>
                          {companyData.company_status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Incorporated</p>
                        <p>{formatDate(companyData.incorporation_date)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground">Registered Office</p>
                        <p>{companyData.registered_office_address}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Accounts Deadlines Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Accounts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Next Made Up To</p>
                        <p className="font-medium">{formatDate(companyData.accounts_next_made_up_to)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due By</p>
                        <p className="font-medium text-warning">{formatDate(companyData.accounts_due_by)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Made Up To</p>
                        <p>{formatDate(companyData.accounts_last_made_up_to)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Confirmation Statement Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Confirmation Statement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Next Statement Date</p>
                        <p className="font-medium">{formatDate(companyData.confirmation_next_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due By</p>
                        <p className="font-medium text-warning">{formatDate(companyData.confirmation_due_by)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Statement</p>
                        <p>{formatDate(companyData.confirmation_last_date)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Officers Card */}
                  {officers.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Current Officers ({officers.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {officers.map((officer, index) => (
                          <div
                            key={index}
                            className={cn(
                              "rounded-lg border p-4",
                              officer.is_primary_contact && "border-primary bg-primary/5"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold">{officer.officer_name}</p>
                                <Badge variant="outline" className="mt-1 capitalize">
                                  {officer.officer_role?.replace(/-/g, " ")}
                                </Badge>
                              </div>
                              {officer.is_primary_contact && (
                                <Badge>Primary Contact</Badge>
                              )}
                            </div>
                            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                              {officer.appointed_date && (
                                <div>
                                  <span className="text-muted-foreground">Appointed: </span>
                                  {formatDate(officer.appointed_date)}
                                </div>
                              )}
                              {officer.date_of_birth_month && officer.date_of_birth_year && (
                                <div>
                                  <span className="text-muted-foreground">DOB: </span>
                                  {officer.date_of_birth_month}/{officer.date_of_birth_year}
                                </div>
                              )}
                              {officer.nationality && (
                                <div>
                                  <span className="text-muted-foreground">Nationality: </span>
                                  {officer.nationality}
                                </div>
                              )}
                              {officer.country_of_residence && (
                                <div>
                                  <span className="text-muted-foreground">Residence: </span>
                                  {officer.country_of_residence}
                                </div>
                              )}
                              {officer.occupation && (
                                <div>
                                  <span className="text-muted-foreground">Occupation: </span>
                                  {officer.occupation}
                                </div>
                              )}
                              {officer.correspondence_address && (
                                <div className="sm:col-span-2">
                                  <span className="text-muted-foreground">Address: </span>
                                  {officer.correspondence_address}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2 - Individual: Address & Contact */}
          {currentStep === 2 && clientType === "individual" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode *</Label>
                <div className="flex gap-2">
                  <Input
                    id="postcode"
                    placeholder="SW1A 1AA"
                    className="flex-1 font-mono uppercase"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  />
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
                <Input
                  id="address1"
                  placeholder="Street address"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Town/City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., London"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2 - Business: Contact Person */}
          {currentStep === 2 && clientType === "business" && (
            <div className="space-y-6">
              {officers.length > 0 && (
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertTitle>Contact Auto-Populated</AlertTitle>
                  <AlertDescription>
                    Contact details have been pre-filled from the first director. You can update these if needed.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="responsiblePerson">Primary Contact Name *</Label>
                  <Input
                    id="responsiblePerson"
                    placeholder="e.g., John Smith"
                    value={primaryContactName}
                    onChange={(e) => setPrimaryContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="john@company.co.uk"
                    value={primaryContactEmail}
                    onChange={(e) => setPrimaryContactEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    placeholder="020 XXXX XXXX"
                    value={primaryContactPhone}
                    onChange={(e) => setPrimaryContactPhone(e.target.value)}
                  />
                </div>
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
                    <Input
                      id="ni"
                      placeholder="AB123456C"
                      className="font-mono uppercase"
                      value={niNumber}
                      onChange={(e) => setNiNumber(e.target.value.toUpperCase())}
                    />
                    <p className="text-xs text-muted-foreground">Format: 2 letters, 6 numbers, 1 letter</p>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label>Has UTR Number?</Label>
                      <p className="text-sm text-muted-foreground">Unique Taxpayer Reference from HMRC</p>
                    </div>
                    <Switch checked={hasUtr} onCheckedChange={setHasUtr} />
                  </div>
                  {hasUtr && (
                    <div className="space-y-2">
                      <Label htmlFor="utr">UTR Number</Label>
                      <Input
                        id="utr"
                        placeholder="1234567890"
                        className="font-mono"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">10-digit number</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="utrBusiness">UTR Number *</Label>
                    <Input
                      id="utrBusiness"
                      placeholder="1234567890"
                      className="font-mono"
                      value={businessUtr}
                      onChange={(e) => setBusinessUtr(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label>VAT Registered?</Label>
                      <p className="text-sm text-muted-foreground">Is the company registered for VAT?</p>
                    </div>
                    <Switch checked={vatRegistered} onCheckedChange={setVatRegistered} />
                  </div>
                  {vatRegistered && (
                    <div className="space-y-2">
                      <Label htmlFor="vatNumber">VAT Number</Label>
                      <Input
                        id="vatNumber"
                        placeholder="GB123456789"
                        className="font-mono"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="payeRef">PAYE Reference</Label>
                    <Input
                      id="payeRef"
                      placeholder="123/AB456"
                      className="font-mono"
                      value={payeRef}
                      onChange={(e) => setPayeRef(e.target.value)}
                    />
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
                {/* Basic Information */}
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  {clientType === "business" && companyData ? (
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Company: </span>
                        {companyData.company_name}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Number: </span>
                        {companyData.company_number}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status: </span>
                        {companyData.company_status}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contact: </span>
                        {primaryContactName}
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Name: </span>
                        {firstName} {lastName}
                      </div>
                      <div>
                        <span className="text-muted-foreground">DOB: </span>
                        {formatDate(dateOfBirth)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email: </span>
                        {email}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone: </span>
                        {phone}
                      </div>
                    </div>
                  )}
                </div>

                {/* Services Summary */}
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-2">Selected Services</h4>
                  {selectedServices.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedServices.map((id) => {
                        const service = services.find((s) => s.id === id);
                        return service ? (
                          <Badge key={id} variant="secondary">
                            {service.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No services selected</p>
                  )}
                </div>

                {/* KYC Summary */}
                <div className="rounded-lg border p-4 space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Identity Verification
                  </h4>

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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSaveClient} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Create Client
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

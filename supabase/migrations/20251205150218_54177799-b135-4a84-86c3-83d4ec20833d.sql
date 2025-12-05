-- Create update_updated_at_column function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create business_clients table with all Companies House fields
CREATE TABLE public.business_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Company House core fields
  company_number TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_type TEXT,
  company_status TEXT,
  incorporation_date DATE,
  registered_office_address TEXT,
  
  -- Accounts deadlines
  accounts_next_made_up_to DATE,
  accounts_due_by DATE,
  accounts_last_made_up_to DATE,
  
  -- Confirmation statement deadlines
  confirmation_next_date DATE,
  confirmation_due_by DATE,
  confirmation_last_date DATE,
  
  -- Primary contact (from first director)
  primary_contact_name TEXT,
  primary_contact_email TEXT,
  primary_contact_phone TEXT,
  
  -- Tax information
  utr_number TEXT,
  vat_registered BOOLEAN DEFAULT false,
  vat_number TEXT,
  paye_reference TEXT,
  
  -- Services and classification
  services TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Standard',
  status TEXT DEFAULT 'Active',
  
  -- KYC fields
  kyc_status TEXT DEFAULT 'Pending',
  kyc_id_type TEXT,
  kyc_id_number TEXT,
  kyc_id_expiry DATE,
  kyc_poa_type TEXT,
  kyc_poa_issue_date DATE,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_officers table for directors
CREATE TABLE public.company_officers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_client_id UUID NOT NULL REFERENCES public.business_clients(id) ON DELETE CASCADE,
  
  officer_name TEXT NOT NULL,
  officer_role TEXT NOT NULL,
  correspondence_address TEXT,
  date_of_birth_month INTEGER,
  date_of_birth_year INTEGER,
  appointed_date DATE,
  resigned_date DATE,
  nationality TEXT,
  country_of_residence TEXT,
  occupation TEXT,
  is_primary_contact BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create individual_clients table
CREATE TABLE public.individual_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Personal details
  title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  email TEXT,
  phone TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postcode TEXT,
  country TEXT DEFAULT 'United Kingdom',
  
  -- Tax information
  ni_number TEXT,
  utr_number TEXT,
  
  -- Services and classification
  services TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Standard',
  status TEXT DEFAULT 'Active',
  
  -- KYC fields
  kyc_status TEXT DEFAULT 'Pending',
  kyc_id_type TEXT,
  kyc_id_number TEXT,
  kyc_id_expiry DATE,
  kyc_selfie_verified BOOLEAN DEFAULT false,
  kyc_poa_type TEXT,
  kyc_poa_issue_date DATE,
  
  -- Duplicate handling
  duplicate_check_notes TEXT,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for duplicate detection on individual_clients
CREATE INDEX idx_individual_clients_name_dob ON public.individual_clients(first_name, last_name, date_of_birth);

-- Enable RLS
ALTER TABLE public.business_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individual_clients ENABLE ROW LEVEL SECURITY;

-- RLS policies for business_clients
CREATE POLICY "Anyone can view business clients" ON public.business_clients
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert business clients" ON public.business_clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update business clients" ON public.business_clients
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete business clients" ON public.business_clients
  FOR DELETE USING (true);

-- RLS policies for company_officers
CREATE POLICY "Anyone can view company officers" ON public.company_officers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert company officers" ON public.company_officers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update company officers" ON public.company_officers
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete company officers" ON public.company_officers
  FOR DELETE USING (true);

-- RLS policies for individual_clients
CREATE POLICY "Anyone can view individual clients" ON public.individual_clients
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert individual clients" ON public.individual_clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update individual clients" ON public.individual_clients
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete individual clients" ON public.individual_clients
  FOR DELETE USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_business_clients_updated_at
  BEFORE UPDATE ON public.business_clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_individual_clients_updated_at
  BEFORE UPDATE ON public.individual_clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
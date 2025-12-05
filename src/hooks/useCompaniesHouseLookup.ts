import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CompanyData {
  company_number: string;
  company_name: string;
  company_type: string;
  company_status: string;
  incorporation_date: string;
  registered_office_address: string;
  accounts_next_made_up_to: string | null;
  accounts_due_by: string | null;
  accounts_last_made_up_to: string | null;
  confirmation_next_date: string | null;
  confirmation_due_by: string | null;
  confirmation_last_date: string | null;
}

export interface OfficerData {
  officer_name: string;
  officer_role: string;
  appointed_date: string | null;
  date_of_birth_month: number | null;
  date_of_birth_year: number | null;
  nationality: string | null;
  country_of_residence: string | null;
  occupation: string | null;
  correspondence_address: string | null;
  is_primary_contact: boolean;
}

export interface ExistingClient {
  id: string;
  company_name: string;
  company_number: string;
}

export interface LookupResult {
  exists: boolean;
  existingClient?: ExistingClient;
  company?: CompanyData;
  officers?: OfficerData[];
  error?: string;
  notFound?: boolean;
}

export function useCompaniesHouseLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupCompany = async (companyNumber: string): Promise<LookupResult | null> => {
    if (!companyNumber || companyNumber.trim().length === 0) {
      setError('Please enter a company number');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('companies-house-lookup', {
        body: { company_number: companyNumber.trim().toUpperCase() },
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        setError('Failed to lookup company. Please try again.');
        return null;
      }

      if (data.error) {
        if (data.notFound) {
          setError('Company not found. Please check the company number.');
        } else {
          setError(data.error);
        }
        return null;
      }

      return data as LookupResult;
    } catch (err) {
      console.error('Lookup error:', err);
      setError('An unexpected error occurred. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupCompany,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

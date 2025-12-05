import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompanyProfile {
  company_number: string;
  company_name: string;
  company_status: string;
  type: string;
  date_of_creation: string;
  registered_office_address: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
  accounts?: {
    next_made_up_to?: string;
    next_due?: string;
    last_accounts?: {
      made_up_to?: string;
    };
  };
  confirmation_statement?: {
    next_made_up_to?: string;
    next_due?: string;
    last_made_up_to?: string;
  };
}

interface Officer {
  name: string;
  officer_role: string;
  appointed_on?: string;
  resigned_on?: string;
  date_of_birth?: {
    month?: number;
    year?: number;
  };
  nationality?: string;
  country_of_residence?: string;
  occupation?: string;
  address?: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { company_number } = await req.json();

    if (!company_number) {
      console.error('Missing company_number parameter');
      return new Response(
        JSON.stringify({ error: 'Company number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('COMPANIES_HOUSE_API_KEY');
    if (!apiKey) {
      console.error('COMPANIES_HOUSE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Companies House API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client to check for existing company
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if company already exists in database
    console.log(`Checking if company ${company_number} exists in database`);
    const { data: existingCompany, error: dbError } = await supabase
      .from('business_clients')
      .select('id, company_name, company_number')
      .eq('company_number', company_number.toUpperCase())
      .maybeSingle();

    if (dbError) {
      console.error('Database error checking for existing company:', dbError);
    }

    if (existingCompany) {
      console.log(`Company ${company_number} already exists in database`);
      return new Response(
        JSON.stringify({
          exists: true,
          existingClient: {
            id: existingCompany.id,
            company_name: existingCompany.company_name,
            company_number: existingCompany.company_number,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Base64 encode the API key for basic auth (Companies House uses API key as username, no password)
    const authHeader = 'Basic ' + btoa(apiKey + ':');
    const baseUrl = 'https://api.company-information.service.gov.uk';

    // Fetch company profile
    console.log(`Fetching company profile for ${company_number}`);
    const profileRes = await fetch(`${baseUrl}/company/${company_number}`, {
      headers: { Authorization: authHeader },
    });

    if (!profileRes.ok) {
      if (profileRes.status === 404) {
        console.log(`Company ${company_number} not found`);
        return new Response(
          JSON.stringify({ error: 'Company not found', notFound: true }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error(`Companies House API error: ${profileRes.status}`);
      throw new Error(`Companies House API error: ${profileRes.status}`);
    }

    const profile: CompanyProfile = await profileRes.json();
    console.log(`Company profile fetched: ${profile.company_name}`);

    // Fetch officers
    console.log(`Fetching officers for ${company_number}`);
    const officersRes = await fetch(`${baseUrl}/company/${company_number}/officers`, {
      headers: { Authorization: authHeader },
    });

    let officers: Officer[] = [];
    if (officersRes.ok) {
      const officersData = await officersRes.json();
      officers = officersData.items || [];
      // Filter to active officers only (no resigned_on date)
      officers = officers.filter(o => !o.resigned_on);
      console.log(`Found ${officers.length} active officers`);
    } else {
      console.warn(`Could not fetch officers: ${officersRes.status}`);
    }

    // Format the registered office address
    const address = profile.registered_office_address;
    const formattedAddress = [
      address?.address_line_1,
      address?.address_line_2,
      address?.locality,
      address?.postal_code,
      address?.country,
    ].filter(Boolean).join(', ');

    // Format officers for response
    const formattedOfficers = officers.map((officer, index) => ({
      officer_name: officer.name,
      officer_role: officer.officer_role,
      appointed_date: officer.appointed_on,
      date_of_birth_month: officer.date_of_birth?.month,
      date_of_birth_year: officer.date_of_birth?.year,
      nationality: officer.nationality,
      country_of_residence: officer.country_of_residence,
      occupation: officer.occupation,
      correspondence_address: officer.address ? [
        officer.address.address_line_1,
        officer.address.address_line_2,
        officer.address.locality,
        officer.address.postal_code,
        officer.address.country,
      ].filter(Boolean).join(', ') : null,
      is_primary_contact: index === 0, // First director is primary contact
    }));

    // Build response
    const response = {
      exists: false,
      company: {
        company_number: profile.company_number,
        company_name: profile.company_name,
        company_type: profile.type,
        company_status: profile.company_status,
        incorporation_date: profile.date_of_creation,
        registered_office_address: formattedAddress,
        // Accounts deadlines
        accounts_next_made_up_to: profile.accounts?.next_made_up_to,
        accounts_due_by: profile.accounts?.next_due,
        accounts_last_made_up_to: profile.accounts?.last_accounts?.made_up_to,
        // Confirmation statement deadlines
        confirmation_next_date: profile.confirmation_statement?.next_made_up_to,
        confirmation_due_by: profile.confirmation_statement?.next_due,
        confirmation_last_date: profile.confirmation_statement?.last_made_up_to,
      },
      officers: formattedOfficers,
    };

    console.log('Successfully retrieved company data');
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in companies-house-lookup:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

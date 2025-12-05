import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DuplicateClient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  email: string | null;
}

export function useDuplicateCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [duplicates, setDuplicates] = useState<DuplicateClient[]>([]);

  const checkForDuplicates = async (
    firstName: string,
    lastName: string,
    dateOfBirth: string
  ): Promise<DuplicateClient[]> => {
    if (!firstName || !lastName) {
      return [];
    }

    setIsChecking(true);

    try {
      // First check for exact name + DOB match
      let query = supabase
        .from('individual_clients')
        .select('id, first_name, last_name, date_of_birth, email')
        .ilike('first_name', firstName.trim())
        .ilike('last_name', lastName.trim());

      const { data, error } = await query;

      if (error) {
        console.error('Duplicate check error:', error);
        return [];
      }

      // If DOB is provided, highlight exact matches
      const results = (data || []).map(client => ({
        ...client,
        isExactMatch: dateOfBirth && client.date_of_birth === dateOfBirth,
      }));

      setDuplicates(results);
      return results;
    } catch (err) {
      console.error('Duplicate check error:', err);
      return [];
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkForDuplicates,
    isChecking,
    duplicates,
    clearDuplicates: () => setDuplicates([]),
  };
}

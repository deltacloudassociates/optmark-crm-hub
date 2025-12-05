export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      business_clients: {
        Row: {
          accounts_due_by: string | null
          accounts_last_made_up_to: string | null
          accounts_next_made_up_to: string | null
          category: string | null
          company_name: string
          company_number: string
          company_status: string | null
          company_type: string | null
          confirmation_due_by: string | null
          confirmation_last_date: string | null
          confirmation_next_date: string | null
          created_at: string
          id: string
          incorporation_date: string | null
          kyc_id_expiry: string | null
          kyc_id_number: string | null
          kyc_id_type: string | null
          kyc_poa_issue_date: string | null
          kyc_poa_type: string | null
          kyc_status: string | null
          notes: string | null
          paye_reference: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          registered_office_address: string | null
          services: string[] | null
          status: string | null
          updated_at: string
          user_id: string | null
          utr_number: string | null
          vat_number: string | null
          vat_registered: boolean | null
        }
        Insert: {
          accounts_due_by?: string | null
          accounts_last_made_up_to?: string | null
          accounts_next_made_up_to?: string | null
          category?: string | null
          company_name: string
          company_number: string
          company_status?: string | null
          company_type?: string | null
          confirmation_due_by?: string | null
          confirmation_last_date?: string | null
          confirmation_next_date?: string | null
          created_at?: string
          id?: string
          incorporation_date?: string | null
          kyc_id_expiry?: string | null
          kyc_id_number?: string | null
          kyc_id_type?: string | null
          kyc_poa_issue_date?: string | null
          kyc_poa_type?: string | null
          kyc_status?: string | null
          notes?: string | null
          paye_reference?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          registered_office_address?: string | null
          services?: string[] | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          utr_number?: string | null
          vat_number?: string | null
          vat_registered?: boolean | null
        }
        Update: {
          accounts_due_by?: string | null
          accounts_last_made_up_to?: string | null
          accounts_next_made_up_to?: string | null
          category?: string | null
          company_name?: string
          company_number?: string
          company_status?: string | null
          company_type?: string | null
          confirmation_due_by?: string | null
          confirmation_last_date?: string | null
          confirmation_next_date?: string | null
          created_at?: string
          id?: string
          incorporation_date?: string | null
          kyc_id_expiry?: string | null
          kyc_id_number?: string | null
          kyc_id_type?: string | null
          kyc_poa_issue_date?: string | null
          kyc_poa_type?: string | null
          kyc_status?: string | null
          notes?: string | null
          paye_reference?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          registered_office_address?: string | null
          services?: string[] | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          utr_number?: string | null
          vat_number?: string | null
          vat_registered?: boolean | null
        }
        Relationships: []
      }
      company_officers: {
        Row: {
          appointed_date: string | null
          business_client_id: string
          correspondence_address: string | null
          country_of_residence: string | null
          created_at: string
          date_of_birth_month: number | null
          date_of_birth_year: number | null
          id: string
          is_primary_contact: boolean | null
          nationality: string | null
          occupation: string | null
          officer_name: string
          officer_role: string
          resigned_date: string | null
        }
        Insert: {
          appointed_date?: string | null
          business_client_id: string
          correspondence_address?: string | null
          country_of_residence?: string | null
          created_at?: string
          date_of_birth_month?: number | null
          date_of_birth_year?: number | null
          id?: string
          is_primary_contact?: boolean | null
          nationality?: string | null
          occupation?: string | null
          officer_name: string
          officer_role: string
          resigned_date?: string | null
        }
        Update: {
          appointed_date?: string | null
          business_client_id?: string
          correspondence_address?: string | null
          country_of_residence?: string | null
          created_at?: string
          date_of_birth_month?: number | null
          date_of_birth_year?: number | null
          id?: string
          is_primary_contact?: boolean | null
          nationality?: string | null
          occupation?: string | null
          officer_name?: string
          officer_role?: string
          resigned_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_officers_business_client_id_fkey"
            columns: ["business_client_id"]
            isOneToOne: false
            referencedRelation: "business_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      individual_clients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          duplicate_check_notes: string | null
          email: string | null
          first_name: string
          id: string
          kyc_id_expiry: string | null
          kyc_id_number: string | null
          kyc_id_type: string | null
          kyc_poa_issue_date: string | null
          kyc_poa_type: string | null
          kyc_selfie_verified: boolean | null
          kyc_status: string | null
          last_name: string
          ni_number: string | null
          notes: string | null
          phone: string | null
          postcode: string | null
          services: string[] | null
          status: string | null
          title: string | null
          updated_at: string
          user_id: string | null
          utr_number: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          duplicate_check_notes?: string | null
          email?: string | null
          first_name: string
          id?: string
          kyc_id_expiry?: string | null
          kyc_id_number?: string | null
          kyc_id_type?: string | null
          kyc_poa_issue_date?: string | null
          kyc_poa_type?: string | null
          kyc_selfie_verified?: boolean | null
          kyc_status?: string | null
          last_name: string
          ni_number?: string | null
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          services?: string[] | null
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          utr_number?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          duplicate_check_notes?: string | null
          email?: string | null
          first_name?: string
          id?: string
          kyc_id_expiry?: string | null
          kyc_id_number?: string | null
          kyc_id_type?: string | null
          kyc_poa_issue_date?: string | null
          kyc_poa_type?: string | null
          kyc_selfie_verified?: boolean | null
          kyc_status?: string | null
          last_name?: string
          ni_number?: string | null
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          services?: string[] | null
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          utr_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

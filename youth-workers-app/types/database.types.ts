// Generated TypeScript types for Supabase database
// This is a placeholder - regenerate with: supabase gen types typescript --linked

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          role_title: string
          organization_name: string
          organization_address: string
          organization_city: string
          organization_state: 'MA' | 'NH' | 'ME' | 'VT' | 'RI' | 'CT'
          organization_zip: string
          bio: string
          birth_month: number
          birth_day: number
          birth_year: number | null
          hire_month: number
          hire_year: number
          hire_day: number | null
          profile_picture_url: string | null
          public_email: string | null
          organization_website: string | null
          ministry_focus_tags: string[] | null
          visibility_settings: Json
          location: unknown | null // PostGIS geography type
          hide_from_map: boolean
          status: 'guest' | 'pending' | 'approved' | 'suspended' | 'rejected'
          admin_notes: string | null
          push_token: string | null
          created_at: string
          updated_at: string
          approved_at: string | null
          approved_by: string | null
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          role_title: string
          organization_name: string
          organization_address: string
          organization_city: string
          organization_state: 'MA' | 'NH' | 'ME' | 'VT' | 'RI' | 'CT'
          organization_zip: string
          bio: string
          birth_month: number
          birth_day: number
          birth_year?: number | null
          hire_month: number
          hire_year: number
          hire_day?: number | null
          profile_picture_url?: string | null
          public_email?: string | null
          organization_website?: string | null
          ministry_focus_tags?: string[] | null
          visibility_settings?: Json
          location?: unknown | null
          hide_from_map?: boolean
          status?: 'guest' | 'pending' | 'approved' | 'suspended' | 'rejected'
          admin_notes?: string | null
          push_token?: string | null
          created_at?: string
          updated_at?: string
          approved_at?: string | null
          approved_by?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          role_title?: string
          organization_name?: string
          organization_address?: string
          organization_city?: string
          organization_state?: 'MA' | 'NH' | 'ME' | 'VT' | 'RI' | 'CT'
          organization_zip?: string
          bio?: string
          birth_month?: number
          birth_day?: number
          birth_year?: number | null
          hire_month?: number
          hire_year?: number
          hire_day?: number | null
          profile_picture_url?: string | null
          public_email?: string | null
          organization_website?: string | null
          ministry_focus_tags?: string[] | null
          visibility_settings?: Json
          location?: unknown | null
          hide_from_map?: boolean
          status?: 'guest' | 'pending' | 'approved' | 'suspended' | 'rejected'
          admin_notes?: string | null
          push_token?: string | null
          created_at?: string
          updated_at?: string
          approved_at?: string | null
          approved_by?: string | null
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'admin' | 'moderator'
          granted_at: string
          granted_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role: 'user' | 'admin' | 'moderator'
          granted_at?: string
          granted_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'user' | 'admin' | 'moderator'
          granted_at?: string
          granted_by?: string | null
        }
      }
      connections: {
        Row: {
          id: string
          user_id: string
          connected_user_id: string
          status: 'pending' | 'accepted' | 'rejected'
          requested_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          connected_user_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          requested_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          connected_user_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          requested_at?: string
          responded_at?: string | null
        }
      }
      channels: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'state' | 'topic'
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: 'state' | 'topic'
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: 'state' | 'topic'
          slug?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          channel_id: string
          user_id: string
          content: string
          mentions: string[] | null
          reply_to: string | null
          edited_at: string | null
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          user_id: string
          content: string
          mentions?: string[] | null
          reply_to?: string | null
          edited_at?: string | null
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          user_id?: string
          content?: string
          mentions?: string[] | null
          reply_to?: string | null
          edited_at?: string | null
          deleted_at?: string | null
          created_at?: string
        }
      }
      direct_messages: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          content: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          content: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          from_user_id?: string
          to_user_id?: string
          content?: string
          read_at?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          end_date: string | null
          location_type: 'physical' | 'virtual'
          location_address: string | null
          location_city: string | null
          location_state: string | null
          location_zip: string | null
          virtual_link: string | null
          organizer_id: string
          status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
          admin_notes: string | null
          created_at: string
          updated_at: string
          approved_at: string | null
          approved_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          start_date: string
          end_date?: string | null
          location_type: 'physical' | 'virtual'
          location_address?: string | null
          location_city?: string | null
          location_state?: string | null
          location_zip?: string | null
          virtual_link?: string | null
          organizer_id: string
          status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          approved_at?: string | null
          approved_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_date?: string
          end_date?: string | null
          location_type?: 'physical' | 'virtual'
          location_address?: string | null
          location_city?: string | null
          location_state?: string | null
          location_zip?: string | null
          virtual_link?: string | null
          organizer_id?: string
          status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          approved_at?: string | null
          approved_by?: string | null
        }
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: 'going' | 'maybe' | 'not_going'
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status: 'going' | 'maybe' | 'not_going'
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          status?: 'going' | 'maybe' | 'not_going'
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string | null
          reported_message_id: string | null
          reason: string
          description: string | null
          status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          resolved_by: string | null
          resolved_at: string | null
          resolution_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id?: string | null
          reported_message_id?: string | null
          reason: string
          description?: string | null
          status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          resolved_by?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_user_id?: string | null
          reported_message_id?: string | null
          reason?: string
          description?: string | null
          status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          resolved_by?: string | null
          resolved_at?: string | null
          resolution_notes?: string | null
          created_at?: string
        }
      }
      blocks: {
        Row: {
          id: string
          blocker_id: string
          blocked_id: string
          created_at: string
        }
        Insert: {
          id?: string
          blocker_id: string
          blocked_id: string
          created_at?: string
        }
        Update: {
          id?: string
          blocker_id?: string
          blocked_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_approved_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_mod: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      can_view_field: {
        Args: {
          profile_id: string
          field_name: string
          requesting_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

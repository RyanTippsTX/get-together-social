export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      hosts: {
        Row: {
          host_id: string;
          display_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          host_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          host_id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
      };
      events: {
        Row: {
          event_id: string;
          created_at: string;
          host_id: string;
          title: string;
          date: string;
          time: string | null;
          location: string | null;
          photo_url: string | null;
          description: string;
          contributions_enabled: boolean | null;
          contributions_frozen: boolean | null;
          contributions_custom_title: string | null;
        };
        Insert: {
          event_id?: string;
          created_at?: string;
          host_id: string;
          title: string;
          date: string;
          time?: string | null;
          location?: string | null;
          photo_url?: string | null;
          description?: string;
          contributions_enabled?: boolean | null;
          contributions_frozen?: boolean | null;
          contributions_custom_title?: string | null;
        };
        Update: {
          event_id?: string;
          created_at?: string;
          host_id?: string;
          title?: string;
          date?: string;
          time?: string | null;
          location?: string | null;
          photo_url?: string | null;
          description?: string;
          contributions_enabled?: boolean | null;
          contributions_frozen?: boolean | null;
          contributions_custom_title?: string | null;
        };
      };
      guests: {
        Row: {
          guest_id: string;
          created_at: string | null;
          event_id: string | null;
          display_name: string;
        };
        Insert: {
          guest_id?: string;
          created_at?: string | null;
          event_id?: string | null;
          display_name: string;
        };
        Update: {
          guest_id?: string;
          created_at?: string | null;
          event_id?: string | null;
          display_name?: string;
        };
      };
      contributions: {
        Row: {
          contribution_id: string;
          created_at: string | null;
          event_id: string;
          description: string;
          requested: boolean;
          contributor_id: string | null;
          claimed_comment: string | null;
        };
        Insert: {
          contribution_id?: string;
          created_at?: string | null;
          event_id: string;
          description: string;
          requested: boolean;
          contributor_id?: string | null;
          claimed_comment?: string | null;
        };
        Update: {
          contribution_id?: string;
          created_at?: string | null;
          event_id?: string;
          description?: string;
          requested?: boolean;
          contributor_id?: string | null;
          claimed_comment?: string | null;
        };
      };
      notes: {
        Row: {
          id: number;
          content: string | null;
        };
        Insert: {
          id?: number;
          content?: string | null;
        };
        Update: {
          id?: number;
          content?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Type definitions for form inputs
// Do not confuse these type defs with those for the db client.
// These are centralized here because they are bound to be reused by similar forms.

export type Inputs = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  contributions_enabled: boolean;
  contributions_frozen: boolean;
  contributions_custom_title_enabled: boolean;
  contributions_custom_title?: string;
};

export type ProfileInputs = {
  display_name: string;
  avatar_url?: string | null;
};

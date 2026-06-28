// Shapes of the rows stored in Supabase. Keep these in sync with
// supabase/schema.sql.

export type Profile = {
  id: string;
  email: string | null;
  created_at: string;
};

export type Team = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
};

export type TeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  created_at: string;
};

export type Setup = {
  id: string;
  user_id: string;
  team_id: string | null;
  name: string;
  car: string;
  track: string;
  notes: string | null;
  weather: string | null;
  driving_style: string | null;
  setup_data: string | null;
  created_at: string;
};

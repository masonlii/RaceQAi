// Shapes of the rows stored in Supabase. Keep these in sync with
// supabase/schema.sql.

export type Team = {
  id: string;
  name: string;
  owner_id: string;
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
  created_at: string;
};

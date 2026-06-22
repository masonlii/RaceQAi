-- RaceIQ AI — database schema
-- ---------------------------------------------------------------------------
-- HOW TO USE:
--   1. Open your Supabase project -> SQL Editor -> New query
--   2. Paste this whole file and click "Run".
-- This creates the tables AND the Row Level Security (RLS) policies that keep
-- each user's data private. Do NOT skip the RLS parts — without them the
-- public anon key would let anyone read/write everything.
-- ---------------------------------------------------------------------------

-- ===== TEAMS ===============================================================
create table if not exists public.teams (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  owner_id   uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.teams enable row level security;

-- A user can see/create/delete only the teams they own.
create policy "owners can read their teams"
  on public.teams for select
  using (auth.uid() = owner_id);

create policy "users can create teams they own"
  on public.teams for insert
  with check (auth.uid() = owner_id);

create policy "owners can update their teams"
  on public.teams for update
  using (auth.uid() = owner_id);

create policy "owners can delete their teams"
  on public.teams for delete
  using (auth.uid() = owner_id);

-- ===== SETUPS ==============================================================
create table if not exists public.setups (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  team_id    uuid references public.teams (id) on delete set null,
  name       text not null,
  car        text not null,
  track      text not null,
  notes      text,
  created_at timestamptz not null default now()
);

alter table public.setups enable row level security;

-- A user can see/manage only their own setups.
create policy "users can read their setups"
  on public.setups for select
  using (auth.uid() = user_id);

create policy "users can create their setups"
  on public.setups for insert
  with check (auth.uid() = user_id);

create policy "users can update their setups"
  on public.setups for update
  using (auth.uid() = user_id);

create policy "users can delete their setups"
  on public.setups for delete
  using (auth.uid() = user_id);

-- Helpful indexes for the queries the app runs.
create index if not exists setups_user_id_idx on public.setups (user_id);
create index if not exists setups_team_id_idx on public.setups (team_id);
create index if not exists teams_owner_id_idx on public.teams (owner_id);

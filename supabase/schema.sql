-- RaceIQ AI — database schema
-- ---------------------------------------------------------------------------
-- HOW TO USE:
--   1. Open your Supabase project -> SQL Editor -> New query
--   2. Paste this whole file and click "Run".
-- This creates the tables AND the Row Level Security (RLS) policies that keep
-- each user's data private. Do NOT skip the RLS parts — without them the
-- public anon key would let anyone read/write everything.
-- ---------------------------------------------------------------------------

-- ===== PROFILES ============================================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users can read their profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users can upsert their profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Lets team owners look up users by email when sending invites.
create policy "authenticated users can read profiles for invites"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- ===== TEAMS ===============================================================
create table if not exists public.teams (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  owner_id   uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.teams enable row level security;

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

-- ===== TEAM MEMBERS ========================================================
create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.teams (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       text not null default 'member',
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

alter table public.team_members enable row level security;

create policy "members can read team rosters"
  on public.team_members for select
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.teams t
      where t.id = team_id and t.owner_id = auth.uid()
    )
    or exists (
      select 1
      from public.team_members tm
      where tm.team_id = team_members.team_id and tm.user_id = auth.uid()
    )
  );

create policy "owners can add team members"
  on public.team_members for insert
  with check (
    exists (
      select 1
      from public.teams t
      where t.id = team_id and t.owner_id = auth.uid()
    )
  );

create policy "owners can remove team members"
  on public.team_members for delete
  using (
    exists (
      select 1
      from public.teams t
      where t.id = team_id and t.owner_id = auth.uid()
    )
  );

create policy "members can read teams they belong to"
  on public.teams for select
  using (
    exists (
      select 1
      from public.team_members tm
      where tm.team_id = id and tm.user_id = auth.uid()
    )
  );

-- ===== SETUPS ==============================================================
create table if not exists public.setups (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  team_id        uuid references public.teams (id) on delete set null,
  name           text not null,
  car            text not null,
  track          text not null,
  notes          text,
  weather        text,
  driving_style  text,
  setup_data     text,
  created_at     timestamptz not null default now()
);

alter table public.setups enable row level security;

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
create index if not exists team_members_team_id_idx on public.team_members (team_id);
create index if not exists team_members_user_id_idx on public.team_members (user_id);
create index if not exists profiles_email_idx on public.profiles (email);

-- If you already ran an older version of this schema, add the new setup columns:
alter table public.setups add column if not exists weather text;
alter table public.setups add column if not exists driving_style text;
alter table public.setups add column if not exists setup_data text;

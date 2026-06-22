# Security checklist (RaceIQ AI)

A short, practical list to keep this app safe as it grows.

## Supabase / database (most important)

- [ ] **Enable Row Level Security (RLS) on EVERY table.**
      In the Supabase dashboard: Table Editor -> select table -> "Enable RLS".
      Without RLS, the public anon key lets *anyone* read and write the whole table.
- [ ] **Write RLS policies** so users can only see/edit their own rows
      (e.g. `auth.uid() = user_id`). RLS with no policies = nobody can read;
      RLS with the right policies = each user sees only their data.
- [ ] **Never put the `service_role` (secret) key in the frontend.**
      Only the anon/public key (`VITE_SUPABASE_ANON_KEY`) is safe to ship to the browser.
      The service_role key bypasses RLS and must live only on a server you control.

## Secrets & config

- [ ] Keep real keys in `frontend/.env` (already gitignored). Never commit `.env`.
- [ ] Share config via `frontend/.env.example` (no real values).

## Auth & routing

- [ ] The "Continue with Google" button in `Login.tsx` is currently a placeholder.
      Wire it to Supabase auth before relying on it.
- [ ] `/dashboard` is currently open to anyone. Add a route guard that redirects
      logged-out users to `/login` once auth is implemented.

## User input (once features are added)

- [ ] React escapes text by default. Avoid `dangerouslySetInnerHTML` unless you
      sanitize the input first.
- [ ] Always rely on RLS for authorization. Never trust the browser to enforce
      who can do what.

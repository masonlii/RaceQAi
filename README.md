# RaceIQ AI

The AI Race Engineer for iRacing — manage your team, store and share car
setups, and (later) get AI-assisted tuning suggestions.

Built with **React + TypeScript + Vite** (frontend) and **Supabase**
(login + database).

---

## Run it locally

You need [Node.js](https://nodejs.org) installed (LTS version is fine).

```bash
# from the project root (C:\Projects\RaceQAi\RaceQAi)
npm run install:frontend   # one time — installs dependencies
npm run dev                # starts the app
```

Then open the URL it prints (usually http://localhost:5173).

> The app runs right away, but login and saving data won't work until you do
> the **Supabase setup** below. Until then you'll see a "connect your database"
> notice on the home page — that's expected.

---

## Supabase setup (3 steps)

Supabase is a free service that handles user login and stores your data.

### 1. Create a project
- Go to [supabase.com](https://supabase.com) and create a free account.
- Click **New project**. Give it a name and a database password.

### 2. Create the database tables
- In your project, open **SQL Editor → New query**.
- Open the file [`supabase/schema.sql`](supabase/schema.sql) in this repo,
  copy everything, paste it into the editor, and click **Run**.
- This creates the tables **and** the security rules (Row Level Security) that
  keep each user's data private. Don't skip it.

### 3. Add your keys to the app
- In Supabase go to **Project Settings → API**. Copy the **Project URL** and
  the **anon public** key.
- In the `frontend` folder, copy `.env.example` to `.env`:
  ```bash
  # from the frontend folder
  cp .env.example .env       # (Windows PowerShell: copy .env.example .env)
  ```
- Open `.env` and paste your values:
  ```
  VITE_SUPABASE_URL=https://your-project-ref.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-public-key
  ```
- Stop the dev server (Ctrl+C) and run `npm run dev` again.

**Optional — Google login:** in Supabase go to **Authentication → Providers →
Google** and follow their instructions. Email magic-link login works without
any extra setup.

---

## What works today

- Landing page, with a graceful "set up your database" state.
- Login via Google or an emailed magic link.
- A protected dashboard (logged-out users get redirected to login).
- **Teams** — create, list, and delete your teams.
- **Setups** — save car setups (name, car, track, notes), optionally tied to a
  team; list and delete them.

## Ideas for next

- Invite teammates to a team (shared access).
- The "AI Setup Builder" — call an AI model to suggest setup tweaks.
- Public "Setup Marketplace" to browse setups shared by others.

---

## Project layout

```
.
├─ package.json            # root shortcuts that run the frontend scripts
├─ supabase/schema.sql     # database tables + security rules
└─ frontend/               # the React app
   ├─ src/
   │  ├─ pages/            # Home, Login, Dashboard, Teams, Setups
   │  ├─ components/       # Layout (nav), ProtectedRoute
   │  ├─ context/          # AuthContext (login state)
   │  ├─ services/         # supabase.ts (database client)
   │  └─ types.ts          # shared data shapes
   └─ .env.example         # template for your Supabase keys
```

## Security notes

See [`SECURITY.md`](SECURITY.md). The short version: the anon key in `.env` is
meant to be public, and the app is only safe because every table has Row Level
Security enabled (step 2 above). Never put the Supabase **service_role** key in
the frontend.

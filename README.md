# Profiles — A minimal Discord directory

A premium minimalist web application where Discord users log in once and appear on a clean, continuously updated profile board.

**Stack:** Next.js 15 (App Router) · TypeScript · TailwindCSS · Supabase · Discord OAuth

---

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd discord-profile-board
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your **Project URL** and **anon key**
3. Run `supabase/schema.sql` in the Supabase SQL editor

### 3. Configure Discord OAuth

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications) → New Application
2. Navigate to **OAuth2 → General**
3. Copy **Client ID** and **Client Secret**
4. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. In Supabase Dashboard → **Authentication → Providers → Discord**:
   - Enable Discord
   - Paste Client ID and Client Secret
   - Save

### 4. Environment variables

```bash
cp .env.example .env.local
```

Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run

```bash
npm run dev
```

---

## Project structure

```
app/
  page.tsx              # Landing page (unauthenticated)
  board/page.tsx        # Profile board (authenticated)
  auth/callback/route.ts # OAuth callback + profile sync
  globals.css           # Design tokens, CSS variables
  layout.tsx            # Root layout with font + theme

components/
  DiscordLoginButton    # OAuth trigger button
  Navbar                # Sticky header
  ProfileCard           # Individual Discord profile card
  ProfileBoardClient    # Client board with search + filter
  SearchBar             # Instant search input
  SkeletonCard          # Loading placeholder
  ThemeProvider         # Dark/light mode context
  ThemeToggle           # Toggle button
  SignOutButton         # Auth sign-out

lib/supabase/
  client.ts             # Browser Supabase client
  server.ts             # Server Supabase client
  middleware.ts         # Session refresh helper

supabase/
  schema.sql            # Database schema + RLS policies

types/
  index.ts              # TypeScript types
```

---

## Design principles

- **Monochrome only** — no accent colors, no gradients
- **System dark mode** by default, with manual toggle
- **CSS variables** for all color tokens
- **Geist font** — clean, neutral, Apple-grade
- **Reduced motion** support via `@media (prefers-reduced-motion)`
- **Semantic HTML** + ARIA labels throughout

---

## Deployment

Deploy to [Vercel](https://vercel.com) with zero config:

```bash
vercel
```

Add environment variables in the Vercel dashboard.

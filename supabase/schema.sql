-- ============================================================
-- Profiles Board — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension (already enabled by default)
create extension if not exists "uuid-ossp";

-- ============================================================
-- Profiles table
-- ============================================================
create table if not exists public.profiles (
  -- Uses Supabase Auth user ID as primary key
  id            uuid primary key references auth.users(id) on delete cascade,

  discord_id    text not null unique,
  username      text not null,
  display_name  text,
  avatar_url    text,
  banner_url    text,
  bio           text,
  gender        text,
  badges        jsonb not null default '[]'::jsonb,
  presence      text not null default 'offline'
                  check (presence in ('online','idle','dnd','offline','invisible')),

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- Updated_at trigger
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;

-- Anyone can read profiles (public board)
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Users can only insert/update their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists profiles_username_idx
  on public.profiles (lower(username));

create index if not exists profiles_created_at_idx
  on public.profiles (created_at desc);

-- ============================================================
-- Grant permissions
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon;
grant select, insert, update on public.profiles to authenticated;

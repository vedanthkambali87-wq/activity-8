-- Run in the Supabase SQL editor. Keep service-role keys on a trusted server only.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'household' check (role in ('household','coordinator','admin')),
  household_id uuid,
  created_at timestamptz not null default now()
);
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  system_size_kw numeric not null default 0,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.households enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Authenticated users can read households" on public.households for select to authenticated using (true);
create table if not exists public.energy_readings (
  id bigint generated always as identity primary key,
  household_id uuid not null references public.households(id) on delete cascade,
  device_id text not null,
  recorded_at timestamptz not null default now(),
  production_kwh numeric not null default 0,
  consumption_kwh numeric not null default 0,
  battery_percent numeric,
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists energy_readings_household_time on public.energy_readings(household_id, recorded_at desc);
alter table public.energy_readings enable row level security;
-- Replace with membership based policies before ingesting production data.

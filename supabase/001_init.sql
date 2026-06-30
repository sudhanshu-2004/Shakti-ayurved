-- ============================================================
-- SHAKTI AYURVED CRM — Database Migration
-- Run this in Supabase SQL editor
-- Project: ksjgsvtrfbhlgrvxrahu (SHARED with website)
-- Safe to re-run: uses IF NOT EXISTS everywhere.
-- ============================================================

-- Extension for UUID generation (usually already enabled on Supabase)
create extension if not exists "pgcrypto";

-- ---------------- USERS ----------------
create table if not exists public.users (
  id text primary key default ('u_' || replace(gen_random_uuid()::text, '-', '')),
  name text not null,
  username text unique not null,
  password text not null,
  role text not null default 'agent' check (role in ('admin','agent')),
  status text not null default 'active' check (status in ('active','inactive')),
  mobile text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_users_username on public.users (username);
create index if not exists idx_users_role on public.users (role);

-- ---------------- LEADS ----------------
create table if not exists public.leads (
  id text primary key default ('ld_' || replace(gen_random_uuid()::text, '-', '')),
  customer_name text not null,
  mobile text not null,
  email text,
  product text not null default 'kidney',
  stage text not null default 'Fresh',
  status text not null default 'New',
  assigned_agent_id text references public.users(id) on delete set null,
  assigned_agent_name text,
  assigned_by text,
  lead_type text default 'Fresh',
  followup_date timestamptz,
  interest_level text,
  tracking_id text,
  awb_number text,
  rate numeric default 0,
  quantity numeric default 0,
  value numeric default 0,
  cnp_reason text,
  order_status text,
  delivery_address text,
  advance_amount numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_leads_agent on public.leads (assigned_agent_id);
create index if not exists idx_leads_stage on public.leads (stage);
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_product on public.leads (product);
create index if not exists idx_leads_followup on public.leads (followup_date);

-- ---------------- LEAD HISTORY ----------------
create table if not exists public.lead_history (
  id bigint generated always as identity primary key,
  lead_id text references public.leads(id) on delete cascade,
  action text,
  old_status text,
  new_status text,
  agent_name text,
  created_at timestamptz default now()
);

create index if not exists idx_lead_history_lead on public.lead_history (lead_id);

-- ---------------- ORDERS ----------------
create table if not exists public.orders (
  id text primary key default ('ord_' || replace(gen_random_uuid()::text, '-', '')),
  lead_id text references public.leads(id) on delete set null,
  customer_name text,
  agent_id text references public.users(id) on delete set null,
  product text,
  amount numeric default 0,
  mode text default 'Sale',
  tracking_id text,
  shipment_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_orders_agent on public.orders (agent_id);

-- ---------------- SETTINGS (key-value, single global row) ----------------
create table if not exists public.settings (
  id text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into public.settings (id, value)
values ('global', '{"sound": true, "browserNotify": true, "popup": true}'::jsonb)
on conflict (id) do nothing;

-- ---------------- UPDATED_AT TRIGGERS ----------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();

-- ---------------- ROW LEVEL SECURITY ----------------
-- The backend connects with the service_role key, which bypasses RLS.
-- Enable RLS to ensure the anon/public key (if ever exposed) cannot read/write directly.
alter table public.users enable row level security;
alter table public.leads enable row level security;
alter table public.lead_history enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

-- No public policies are created: only the service_role key (used by backend) bypasses RLS.
-- This locks down direct browser access via the anon key, forcing all access through the API.

-- ---------------- SEED ADMIN (idempotent) ----------------
-- Default password is plaintext here for first boot only; the backend will
-- automatically bcrypt-hash it on first successful login.
insert into public.users (id, name, username, password, role, status, mobile, email)
values ('u_admin', 'Admin Manager', 'shaktiayurved', '#shakti@123', 'admin', 'active', '9999900000', 'admin@shaktiayurved.in')
on conflict (username) do nothing;

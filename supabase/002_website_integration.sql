-- ============================================================
-- SHAKTI AYURVED CRM — Website Integration Migration
-- Run in Supabase SQL Editor after 001_init.sql
-- Project: ksjgsvtrfbhlgrvxrahu (SHARED with website)
-- Safe to re-run: uses CREATE OR REPLACE + IF NOT EXISTS.
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. CONSULTATIONS TABLE
--    (website Contact page writes here)
-- ──────────────────────────────────────────────
create table if not exists public.consultations (
  id text primary key default ('con_' || replace(gen_random_uuid()::text, '-', '')),
  name text not null,
  phone text not null,
  message text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS (backend service_role key bypasses this)
alter table public.consultations enable row level security;

-- Allow the website anon key to INSERT only (so contact form still works
-- even when the CRM backend is not in the request path)
drop policy if exists "website_anon_insert_consultations" on public.consultations;
create policy "website_anon_insert_consultations"
  on public.consultations for insert
  to anon, authenticated
  with check (true);

-- ──────────────────────────────────────────────
-- 2. ORDERS TABLE — ensure website columns exist
--    (website Checkout writes here; CRM orders
--     table has different columns so we patch in
--     what is needed for the trigger to read)
-- ──────────────────────────────────────────────

-- Add website-side columns if missing (non-destructive)
alter table public.orders
  add column if not exists subtotal      numeric default 0,
  add column if not exists discount      numeric default 0,
  add column if not exists shipping      numeric default 0,
  add column if not exists total         numeric default 0,
  add column if not exists payment_method text,
  add column if not exists shipping_address jsonb,
  add column if not exists user_id       text,
  add column if not exists source        text default 'crm'; -- 'crm' | 'website'

-- Allow website anon/auth key to INSERT orders (checkout flow)
drop policy if exists "website_anon_insert_orders" on public.orders;
create policy "website_anon_insert_orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- Allow website users to SELECT their own orders
drop policy if exists "website_select_own_orders" on public.orders;
create policy "website_select_own_orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid()::text or source = 'crm');

-- Allow inserting order_items (website checkout)
create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id text references public.orders(id) on delete cascade,
  product_id text,
  combo_id   text,
  name       text,
  image_url  text,
  price      numeric default 0,
  quantity   integer default 1,
  subtotal   numeric default 0,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

drop policy if exists "website_anon_insert_order_items" on public.order_items;
create policy "website_anon_insert_order_items"
  on public.order_items for insert
  to anon, authenticated
  with check (true);

-- ──────────────────────────────────────────────
-- 3. HELPER — Map website product name → CRM key
-- ──────────────────────────────────────────────
create or replace function public.map_product_to_crm_key(product_name text)
returns text
language plpgsql stable
as $$
declare
  lower_name text := lower(coalesce(product_name, ''));
begin
  if lower_name like '%pathri%' or lower_name like '%kidney%' then return 'kidney'; end if;
  if lower_name like '%hair%'                                  then return 'hairgrowth'; end if;
  if lower_name like '%bp%' or lower_name like '%blood pressure%' then return 'bp'; end if;
  if lower_name like '%sugar%' or lower_name like '%diabetes%' then return 'sugar'; end if;
  if lower_name like '%liver%'                                 then return 'liver'; end if;
  if lower_name like '%weight%'                                then return 'weightloss'; end if;
  if lower_name like '%joint%'                                 then return 'joint'; end if;
  if lower_name like '%digest%'                                then return 'digestive'; end if;
  if lower_name like '%skin%' or lower_name like '%glow%'      then return 'skin'; end if;
  if lower_name like '%immun%'                                 then return 'immunity'; end if;
  -- Default: store raw name as-is (CRM will show it verbatim)
  return coalesce(nullif(trim(lower_name), ''), 'other');
end;
$$;

-- ──────────────────────────────────────────────
-- 4. TRIGGER FUNCTION — Website Order → CRM Lead
-- ──────────────────────────────────────────────
create or replace function public.fn_website_order_to_lead()
returns trigger
language plpgsql security definer
as $$
declare
  addr       jsonb := coalesce(NEW.shipping_address, '{}'::jsonb);
  cust_name  text  := coalesce(addr->>'full_name', 'Unknown Customer');
  cust_phone text  := coalesce(addr->>'phone', '');
  full_addr  text;
  product_key text;
  order_total numeric;
  lead_id    text;
  first_item record;
begin
  -- Only fire for website-originating orders (not CRM-internal ones)
  if coalesce(NEW.source, 'website') = 'crm' then
    return NEW;
  end if;

  -- Skip if no customer phone (data integrity guard)
  if cust_phone = '' then
    return NEW;
  end if;

  -- Build readable address string
  full_addr := concat_ws(', ',
    nullif(trim(addr->>'address_line1'), ''),
    nullif(trim(addr->>'city'), ''),
    nullif(trim(addr->>'state'), ''),
    nullif(trim(addr->>'pincode'), '')
  );

  -- Get first ordered product name for the CRM product key
  select oi.name, oi.price, oi.quantity
    into first_item
    from public.order_items oi
    where oi.order_id = NEW.id
    limit 1;

  product_key := public.map_product_to_crm_key(coalesce(first_item.name, ''));
  order_total := coalesce(NEW.total, NEW.subtotal, 0);

  -- Generate lead id
  lead_id := 'ld_' || replace(gen_random_uuid()::text, '-', '');

  -- Insert into CRM leads table
  insert into public.leads (
    id,
    customer_name,
    mobile,
    email,
    product,
    stage,
    status,
    lead_type,
    rate,
    quantity,
    value,
    order_status,
    delivery_address,
    assigned_agent_id,
    assigned_agent_name,
    assigned_by,
    created_at,
    updated_at
  ) values (
    lead_id,
    cust_name,
    cust_phone,
    null,                      -- website checkout has optional email field
    product_key,
    'Converted',               -- already an order
    'Converted',
    'Website',                 -- marks this as a website lead
    coalesce(first_item.price, order_total),
    coalesce(first_item.quantity, 1),
    order_total,
    case
      when coalesce(NEW.payment_method, '') = 'cod' then 'Address Pending'
      else 'Payment Received'
    end,
    full_addr,
    null,                      -- unassigned — admin can assign later
    null,
    'Website',
    now(),
    now()
  );

  -- Record history
  insert into public.lead_history (lead_id, action, old_status, new_status, agent_name)
  values (lead_id, 'created_from_website_order', null, 'Converted', 'System (Website)');

  return NEW;
end;
$$;

-- Attach trigger to orders table
drop trigger if exists trg_website_order_to_lead on public.orders;
create trigger trg_website_order_to_lead
  after insert on public.orders
  for each row
  execute function public.fn_website_order_to_lead();

-- ──────────────────────────────────────────────
-- 5. TRIGGER FUNCTION — Consultation → CRM Lead
-- ──────────────────────────────────────────────
create or replace function public.fn_consultation_to_lead()
returns trigger
language plpgsql security definer
as $$
declare
  lead_id text;
begin
  -- Skip if phone is blank
  if coalesce(trim(NEW.phone), '') = '' then
    return NEW;
  end if;

  lead_id := 'ld_' || replace(gen_random_uuid()::text, '-', '');

  insert into public.leads (
    id,
    customer_name,
    mobile,
    email,
    product,
    stage,
    status,
    lead_type,
    assigned_agent_id,
    assigned_agent_name,
    assigned_by,
    created_at,
    updated_at
  ) values (
    lead_id,
    NEW.name,
    NEW.phone,
    null,
    'other',                   -- product unknown at enquiry stage
    'Fresh',
    'New',
    'Website Enquiry',         -- marks this as a contact form lead
    null,
    null,
    'Website',
    now(),
    now()
  );

  insert into public.lead_history (lead_id, action, old_status, new_status, agent_name)
  values (lead_id, 'created_from_website_enquiry', null, 'New', 'System (Website)');

  return NEW;
end;
$$;

-- Attach trigger to consultations table
drop trigger if exists trg_consultation_to_lead on public.consultations;
create trigger trg_consultation_to_lead
  after insert on public.consultations
  for each row
  execute function public.fn_consultation_to_lead();

-- ──────────────────────────────────────────────
-- 6. USER PROFILES TABLE
--    (website AuthContext uses profiles table)
-- ──────────────────────────────────────────────
create table if not exists public.profiles (
  id text primary key,
  full_name text,
  phone text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid()::text);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid()::text);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid()::text);

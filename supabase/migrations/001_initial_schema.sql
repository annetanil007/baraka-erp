create extension if not exists "pgcrypto";

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  manager text,
  employees integer not null default 0,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  role text not null default 'Operations Employee',
  branch_id uuid references public.branches(id),
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_code text not null unique,
  name text not null,
  segment text,
  credit_limit numeric(14,2) not null default 0,
  balance numeric(14,2) not null default 0,
  status text not null default 'Active',
  created_at timestamptz not null default now()
);

create table if not exists public.sales_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id),
  amount numeric(14,2) not null default 0,
  item_count integer not null default 0,
  status text not null default 'Under Review',
  risk_level text not null default 'Low',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.sales_orders enable row level security;
alter table public.audit_logs enable row level security;

create policy "Authenticated users can read branches" on public.branches for select to authenticated using (true);
create policy "Authenticated users can manage branches" on public.branches for all to authenticated using (true) with check (true);
create policy "Users can read profiles" on public.profiles for select to authenticated using (true);
create policy "Users can update their profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Authenticated users can read customers" on public.customers for select to authenticated using (true);
create policy "Authenticated users can manage customers" on public.customers for all to authenticated using (true) with check (true);
create policy "Authenticated users can read sales orders" on public.sales_orders for select to authenticated using (true);
create policy "Authenticated users can manage sales orders" on public.sales_orders for all to authenticated using (true) with check (true);
create policy "Authenticated users can read audit logs" on public.audit_logs for select to authenticated using (true);
create policy "Authenticated users can create audit logs" on public.audit_logs for insert to authenticated with check (actor_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

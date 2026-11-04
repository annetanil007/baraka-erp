-- COGS foundation
-- Cost layers preserve the source cost of inventory; cogs_entries records the
-- cost recognized when inventory is sold.

alter table public.products
  add column if not exists valuation_method text not null default 'weighted_average'
    check (valuation_method in ('fifo', 'weighted_average')),
  add column if not exists standard_unit_cost numeric(14,4) not null default 0
    check (standard_unit_cost >= 0);

alter table public.inventory_movements
  add column if not exists unit_cost numeric(14,4) not null default 0
    check (unit_cost >= 0);

create table if not exists public.inventory_cost_layers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  branch_id uuid references public.branches(id),
  source_movement_id uuid not null unique references public.inventory_movements(id) on delete restrict,
  quantity_received numeric(14,4) not null check (quantity_received > 0),
  quantity_remaining numeric(14,4) not null check (quantity_remaining >= 0 and quantity_remaining <= quantity_received),
  unit_cost numeric(14,4) not null check (unit_cost >= 0),
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.cogs_entries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  branch_id uuid references public.branches(id),
  sales_order_id uuid references public.sales_orders(id) on delete restrict,
  inventory_movement_id uuid not null unique references public.inventory_movements(id) on delete restrict,
  quantity numeric(14,4) not null check (quantity > 0),
  unit_cost numeric(14,4) not null check (unit_cost >= 0),
  total_cost numeric(14,2) not null check (total_cost >= 0),
  costing_method text not null check (costing_method in ('fifo', 'weighted_average')),
  status text not null default 'Posted' check (status in ('Posted', 'Reversed')),
  posted_by uuid references auth.users(id),
  posted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists inventory_cost_layers_product_remaining_idx
  on public.inventory_cost_layers (product_id, quantity_remaining, received_at);
create index if not exists cogs_entries_posted_at_idx
  on public.cogs_entries (posted_at);
create index if not exists cogs_entries_product_idx
  on public.cogs_entries (product_id, posted_at);
create index if not exists cogs_entries_sales_order_idx
  on public.cogs_entries (sales_order_id);

alter table public.inventory_cost_layers enable row level security;
alter table public.cogs_entries enable row level security;

create policy "Authenticated users can read inventory cost layers"
  on public.inventory_cost_layers for select to authenticated using (true);
create policy "Authenticated users can create inventory cost layers"
  on public.inventory_cost_layers for insert to authenticated with check (true);
create policy "Authenticated users can read COGS entries"
  on public.cogs_entries for select to authenticated using (true);
create policy "Authenticated users can create COGS entries"
  on public.cogs_entries for insert to authenticated with check (posted_by = auth.uid());

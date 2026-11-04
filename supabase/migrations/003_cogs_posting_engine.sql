-- COGS posting engine

create or replace function public.post_cogs_for_sale(
  p_inventory_movement_id uuid,
  p_sales_order_id uuid default null,
  p_posted_by uuid default auth.uid()
)
returns public.cogs_entries
language plpgsql
security definer
set search_path = public
as $$
declare
  movement public.inventory_movements%rowtype;
  product public.products%rowtype;
  layer record;
  available numeric(14,4);
  allocation numeric(14,4);
  consumed numeric(14,4) := 0;
  total_cost numeric(14,4) := 0;
  average_cost numeric(14,4);
  result public.cogs_entries%rowtype;
begin
  select * into movement from public.inventory_movements where id = p_inventory_movement_id for update;
  if not found then raise exception 'Inventory movement % was not found', p_inventory_movement_id; end if;
  if movement.movement_type <> 'Sale' then raise exception 'Inventory movement % is not a Sale', p_inventory_movement_id; end if;
  if movement.quantity <= 0 then raise exception 'Sale movement quantity must be greater than zero'; end if;
  select * into result from public.cogs_entries where inventory_movement_id = movement.id;
  if found then return result; end if;

  select * into product from public.products where id = movement.product_id for update;
  select coalesce(sum(quantity_remaining), 0) into available
  from public.inventory_cost_layers
  where product_id = movement.product_id and quantity_remaining > 0;
  if available < movement.quantity then
    raise exception 'Insufficient cost-layer quantity for product %: requested %, available %',
      movement.product_id, movement.quantity, available;
  end if;

  if product.valuation_method = 'weighted_average' then
    select coalesce(sum(quantity_remaining * unit_cost) / nullif(sum(quantity_remaining), 0), product.standard_unit_cost)
      into average_cost
    from public.inventory_cost_layers
    where product_id = movement.product_id and quantity_remaining > 0;
  end if;

  for layer in
    select id, quantity_remaining, unit_cost
    from public.inventory_cost_layers
    where product_id = movement.product_id and quantity_remaining > 0
    order by received_at, created_at, id
    for update
  loop
    exit when consumed >= movement.quantity;
    allocation := least(layer.quantity_remaining, movement.quantity - consumed);
    update public.inventory_cost_layers set quantity_remaining = quantity_remaining - allocation where id = layer.id;
    consumed := consumed + allocation;
    total_cost := total_cost + allocation * case when product.valuation_method = 'weighted_average' then average_cost else layer.unit_cost end;
  end loop;
  if consumed <> movement.quantity then
    raise exception 'Unable to allocate the full sale quantity for movement %', movement.id;
  end if;

  insert into public.cogs_entries (
    product_id, branch_id, sales_order_id, inventory_movement_id,
    quantity, unit_cost, total_cost, costing_method, posted_by
  )
  values (
    movement.product_id, product.branch_id, p_sales_order_id, movement.id,
    movement.quantity, round(total_cost / movement.quantity, 4), round(total_cost, 2),
    product.valuation_method, p_posted_by
  )
  returning * into result;
  return result;
end;
$$;

create or replace function public.create_cost_layer_for_receipt()
returns trigger language plpgsql security definer set search_path = public as $$
declare product_branch_id uuid;
begin
  if new.movement_type = 'Receipt' then
    select branch_id into product_branch_id from public.products where id = new.product_id for update;
    insert into public.inventory_cost_layers (
      product_id, branch_id, source_movement_id, quantity_received, quantity_remaining, unit_cost
    ) values (new.product_id, product_branch_id, new.id, new.quantity, new.quantity, new.unit_cost);
  end if;
  return new;
end;
$$;

create or replace function public.post_cogs_after_sale()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.movement_type = 'Sale' then
    perform public.post_cogs_for_sale(new.id, null, new.created_by);
  end if;
  return new;
end;
$$;

drop trigger if exists inventory_receipt_creates_cost_layer on public.inventory_movements;
create trigger inventory_receipt_creates_cost_layer after insert on public.inventory_movements
for each row execute function public.create_cost_layer_for_receipt();

drop trigger if exists inventory_sale_posts_cogs on public.inventory_movements;
create trigger inventory_sale_posts_cogs after insert on public.inventory_movements
for each row execute function public.post_cogs_after_sale();

revoke execute on function public.post_cogs_for_sale(uuid, uuid, uuid) from public;
grant execute on function public.post_cogs_for_sale(uuid, uuid, uuid) to authenticated;

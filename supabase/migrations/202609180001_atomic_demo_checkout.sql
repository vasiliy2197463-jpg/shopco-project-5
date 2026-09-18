create or replace function public.create_demo_order(
  p_customer_email text,
  p_customer_name text,
  p_customer_phone text,
  p_city text,
  p_shipping_address text,
  p_postal_code text,
  p_delivery_method text,
  p_payment_method text,
  p_payment_status text,
  p_customer_notes text,
  p_discount numeric,
  p_delivery_fee numeric,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  created_order_id uuid;
  item jsonb;
  product_record public.products%rowtype;
  item_quantity integer;
  calculated_subtotal numeric(10,2) := 0;
  safe_discount numeric(10,2);
  safe_delivery_fee numeric(10,2);
begin
  if auth.uid() is null then
    raise exception 'Sign in before placing an order';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'The order has no items';
  end if;

  for item in select * from jsonb_array_elements(p_items)
  loop
    item_quantity := greatest(1, (item->>'quantity')::integer);
    select * into product_record
    from public.products
    where id = (item->>'product_id')::bigint
    for update;

    if not found or product_record.active = false or product_record.archived = true then
      raise exception 'A product is unavailable';
    end if;
    if product_record.stock < item_quantity then
      raise exception 'Not enough stock for %', product_record.name;
    end if;
    calculated_subtotal := calculated_subtotal + product_record.price * item_quantity;
  end loop;

  safe_discount := least(greatest(coalesce(p_discount, 0), 0), calculated_subtotal);
  safe_delivery_fee := greatest(coalesce(p_delivery_fee, 0), 0);

  insert into public.orders (
    user_id, status, subtotal, discount, delivery_fee, total,
    customer_email, customer_name, customer_phone, city, shipping_address,
    postal_code, delivery_method, payment_method, payment_status, customer_notes
  ) values (
    auth.uid(), 'new', calculated_subtotal, safe_discount, safe_delivery_fee,
    calculated_subtotal - safe_discount + safe_delivery_fee,
    p_customer_email, p_customer_name, p_customer_phone, p_city, p_shipping_address,
    nullif(p_postal_code, ''), p_delivery_method, p_payment_method, p_payment_status,
    nullif(p_customer_notes, '')
  ) returning id into created_order_id;

  for item in select * from jsonb_array_elements(p_items)
  loop
    item_quantity := greatest(1, (item->>'quantity')::integer);
    select * into product_record from public.products where id = (item->>'product_id')::bigint;
    update public.products set stock = stock - item_quantity, updated_at = now() where id = product_record.id;
    insert into public.order_items (order_id, product_id, product_name, color, size, quantity, unit_price)
    values (created_order_id, product_record.id, product_record.name, item->>'color', item->>'size', item_quantity, product_record.price);
  end loop;

  return created_order_id;
end;
$$;

revoke all on function public.create_demo_order(text,text,text,text,text,text,text,text,text,text,numeric,numeric,jsonb) from public;
grant execute on function public.create_demo_order(text,text,text,text,text,text,text,text,text,text,numeric,numeric,jsonb) to authenticated;

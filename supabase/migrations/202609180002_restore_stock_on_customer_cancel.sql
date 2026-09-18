create or replace function public.cancel_demo_order(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_order public.orders%rowtype;
  item_record record;
begin
  select * into target_order
  from public.orders
  where id = p_order_id
  for update;

  if not found or target_order.user_id <> auth.uid() then
    raise exception 'Order not found';
  end if;
  if target_order.status not in ('new', 'pending') then
    raise exception 'The order can no longer be cancelled';
  end if;

  for item_record in
    select product_id, quantity from public.order_items where order_id = p_order_id
  loop
    if item_record.product_id is not null then
      update public.products
      set stock = stock + item_record.quantity, updated_at = now()
      where id = item_record.product_id;
    end if;
  end loop;

  update public.orders set status = 'cancelled' where id = p_order_id;
  return true;
end;
$$;

revoke all on function public.cancel_demo_order(uuid) from public;
grant execute on function public.cancel_demo_order(uuid) to authenticated;

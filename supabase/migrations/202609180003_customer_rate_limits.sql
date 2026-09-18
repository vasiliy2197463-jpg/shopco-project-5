create or replace function public.limit_customer_submissions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count integer;
begin
  if public.is_admin() then
    return new;
  end if;

  if tg_table_name = 'product_questions' then
    select count(*) into recent_count
    from public.product_questions
    where user_id = auth.uid() and created_at > now() - interval '1 minute';
    if recent_count >= 3 then
      raise exception 'Please wait before sending another question';
    end if;
  elsif tg_table_name = 'order_notifications' and new.sender = 'customer' then
    select count(*) into recent_count
    from public.order_notifications
    where user_id = auth.uid()
      and sender = 'customer'
      and created_at > now() - interval '1 minute';
    if recent_count >= 5 then
      raise exception 'Please wait before sending another message';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists limit_product_questions on public.product_questions;
create trigger limit_product_questions
before insert on public.product_questions
for each row execute procedure public.limit_customer_submissions();

drop trigger if exists limit_customer_order_messages on public.order_notifications;
create trigger limit_customer_order_messages
before insert on public.order_notifications
for each row execute procedure public.limit_customer_submissions();

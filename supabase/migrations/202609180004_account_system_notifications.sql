-- Customer-facing account security notifications.
-- Messages are stored as stable tokens and translated in the application.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'customer')
  on conflict (id) do nothing;

  insert into public.order_notifications
    (order_id, user_id, sender, message, is_read, allow_reply)
  values
    (null, new.id, 'system', 'ACCOUNT_WELCOME', false, false);

  return new;
end;
$$;

create or replace function public.notify_password_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.order_notifications
    (order_id, user_id, sender, message, is_read, allow_reply)
  values
    (null, new.id, 'system', 'ACCOUNT_PASSWORD_CHANGED', false, false);

  return new;
end;
$$;

drop trigger if exists on_auth_password_changed on auth.users;
create trigger on_auth_password_changed
after update of encrypted_password on auth.users
for each row
when (old.encrypted_password is distinct from new.encrypted_password)
execute procedure public.notify_password_changed();

create table if not exists public.visitor_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text not null,
  user_id uuid references auth.users(id) on delete set null,
  visitor_email text,
  path text not null,
  referrer text,
  device text not null default 'desktop',
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists visitor_events_created_at_idx on public.visitor_events (created_at desc);
create index if not exists visitor_events_visitor_id_idx on public.visitor_events (visitor_id);

alter table public.visitor_events enable row level security;

drop policy if exists "visitors record analytics" on public.visitor_events;
create policy "visitors record analytics"
on public.visitor_events for insert
to anon, authenticated
with check (user_id is null or user_id = auth.uid());

drop policy if exists "admins read analytics" on public.visitor_events;
create policy "admins read analytics"
on public.visitor_events for select
to authenticated
using (public.is_admin());

drop policy if exists "admins delete analytics" on public.visitor_events;
create policy "admins delete analytics"
on public.visitor_events for delete
to authenticated
using (public.is_admin());

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  language text not null default 'en' check (language in ('en', 'ru')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$');

create policy "Owner can view subscribers"
on public.newsletter_subscribers
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'vasiliy2197463@gmail.com');

create policy "Owner can update subscribers"
on public.newsletter_subscribers
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'vasiliy2197463@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'vasiliy2197463@gmail.com');

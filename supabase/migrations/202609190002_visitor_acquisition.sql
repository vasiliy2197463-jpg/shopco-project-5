alter table public.visitor_events
  add column if not exists source text,
  add column if not exists landing_page text,
  add column if not exists query_string text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists ip_address inet;

create or replace function public.record_visitor_event(
  p_visitor_id text, p_session_id text, p_visitor_email text, p_path text,
  p_referrer text, p_source text, p_landing_page text, p_query_string text,
  p_utm_source text, p_utm_medium text, p_utm_campaign text, p_utm_content text,
  p_device text, p_user_agent text
) returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  new_id uuid;
  headers jsonb := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::jsonb;
  raw_ip text;
begin
  raw_ip := split_part(coalesce(headers->>'cf-connecting-ip', headers->>'x-forwarded-for', ''), ',', 1);
  insert into public.visitor_events (
    visitor_id, session_id, user_id, visitor_email, path, referrer, source,
    landing_page, query_string, utm_source, utm_medium, utm_campaign, utm_content,
    device, user_agent, ip_address
  ) values (
    left(p_visitor_id, 120), left(p_session_id, 120), auth.uid(), left(p_visitor_email, 320),
    left(p_path, 1000), left(p_referrer, 2000), left(p_source, 200),
    left(p_landing_page, 2000), left(p_query_string, 2000), left(p_utm_source, 200),
    left(p_utm_medium, 200), left(p_utm_campaign, 300), left(p_utm_content, 300),
    left(p_device, 50), left(p_user_agent, 1000), nullif(trim(raw_ip), '')::inet
  ) returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.record_visitor_event(text,text,text,text,text,text,text,text,text,text,text,text,text,text) from public;
grant execute on function public.record_visitor_event(text,text,text,text,text,text,text,text,text,text,text,text,text,text) to anon, authenticated;

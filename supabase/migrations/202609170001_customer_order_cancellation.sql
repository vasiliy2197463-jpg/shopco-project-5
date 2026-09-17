create policy "customers cancel own new orders"
on public.orders
for update
to authenticated
using (
  user_id = auth.uid()
  and status in ('new', 'pending')
)
with check (
  user_id = auth.uid()
  and status = 'cancelled'
);

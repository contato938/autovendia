create table if not exists public.product_demand (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  lead_id uuid references public.leads(id) on delete set null,
  product_name text not null,
  sku text,
  status text default 'pending',
  priority text default 'medium'
);

create index if not exists product_demand_tenant_id_idx on public.product_demand(tenant_id);
create index if not exists product_demand_created_at_idx on public.product_demand(created_at);

-- RLS Policies
alter table public.product_demand enable row level security;

create policy "Users can view product demands for their tenant"
  on public.product_demand for select
  using ( tenant_id in (
    select tenant_id from public.user_tenants where user_id = auth.uid()
  ));

create policy "Users can insert product demands for their tenant"
  on public.product_demand for insert
  with check ( tenant_id in (
    select tenant_id from public.user_tenants where user_id = auth.uid()
  ));

create policy "Users can update product demands for their tenant"
  on public.product_demand for update
  using ( tenant_id in (
    select tenant_id from public.user_tenants where user_id = auth.uid()
  ));

create policy "Users can delete product demands for their tenant"
  on public.product_demand for delete
  using ( tenant_id in (
    select tenant_id from public.user_tenants where user_id = auth.uid()
  ));
